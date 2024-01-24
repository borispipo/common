import notify from "$notify";
import DateLib from "$date";
import {open as showPreloader,close as hidePreloader} from "$preloader";
import Background from "./background";
import $session from "$session";
const $sessionKey = "sync-data-session-key";
import drivers from "./drivers";
import lastSyncDate from "./lastSyncDate";
import BG_TASK_MANAGER from "./bakgroundTaskManager";
import isRunning from "./isRunning";
import {isObjOrArray} from "$cutils";
import getAllDB from "../dataFileManager/getAllDB";
import { syncDirections} from "./utils";

export * from "./utils";

///retourne les infos liées à la synchronisation des données
export const getInfo = ($key)=>{
    let ret = defaultObj($session.get($sessionKey));
    if(isNonNullString($key)){
        return ret[$key];
    }
    return ret;
}
/**** définit les informations de synchronisation de la base de données */
export const setInfo = (data)=>{
    let date = DateLib.SQLDate();
    let time = DateLib.SQLTime();
    let r = {
        date, //la date de dernière bonne synchronisation
        time, // l'heure de dernière bonne synchronisation
        user : Auth.getLoggedUserCode(), //l'utilisation dont la synchronisation a été un succès
    };
    if(data === false){
        let r2 = {}; 
        let prefix = "failed"
        for(let i in r){
            r2[prefix+i.ucFirst()] = r[i];
        }
        r = r2;
    }
    data = defaultObj(data);
    $session.set($sessionKey,extendObj(getInfo(),data,r));
}
const errorF = ({msg,error,reject})=>{
    BG_TASK_MANAGER.running = false;
    if(Background.isNotDBSyncBackground() && isNonNullString(msg)){
        notify.error(msg);
    }
    if(isFunction(error)){
        error(msg)
    }
    setInfo(false);
    return reject(msg);
}
/*** 
 * synchronise les bases de données locales vers un serveur distant
 * @param {args} de la forme : 
 * {
 *      
 * }
 * 
*/
export const sync = (args)=>{
    if(isBool(args)){
        args = {cancel:args};
    }
    args = defaultObj(args);
    let {success,error,...restA} = args;
    ///pour éviter qu'une tâche d'arrière plan vient empêcher la synchronisation des données
    if(args.background !== true){
        Background.setDBSyncBackground(args);
    }
    restA = defaultObj(restA);
    const servers = [];
    const allServers = isObjOrArray(args.servers)? args.servers : [];
    ///on a la possibilité de passer la liste des serveurs directement à l'agent de synchronisation des données
    Object.map(allServers,(server,i)=>{
        if(isObj(server) && defaultVal(server.status,true) && isValidUrl(server.url)){
            server.type = defaultStr(server.type,'couchdb');
            if(!Array.isArray((server.syncData))){
                server.syncData = ["common#full"]
            }
            servers.push(server);
        }
    })
    let syncResults = {};
    return new Promise((resolve,reject)=>{
        let index = -1,length=servers.length,server = undefined; 
        if(BG_TASK_MANAGER.running){
            return Promise.reject({
                status : false,
                code : 2000,
                msg : "Une autre instance de la tâche de synchronisation des données est en cours"
            })
        }
        BG_TASK_MANAGER.running = true;  
        Background.setDBSyncBackground(args);
        if(!Auth.isLoggedIn()){
            return errorF({msg:'Utilisateur non connecté, impossible d\'Effectuer la synchronisation des données.',error,reject});
        }
        const next = ()=>{
            index++;
            if(index >= length) {
                if(Background.isNotDBSyncBackground()){
                    hidePreloader();
                    notify.info("Synchronisation terminée")
                }
                if(isFunction(success)){
                    success(syncResults);
                }
                setInfo({servers : syncResults});
                BG_TASK_MANAGER.running = undefined;
                return resolve(syncResults);
            }
            server = servers[index];
            if(!isObj(server) || !isNonNullString(server.type)) {
                next();
                return;
            }
            let servCode = defaultStr(server.code,server._id);
            const lSyncDate = lastSyncDate.get(servCode);
            if(args.forceSync !== true && lSyncDate && isDecimal(server.timeout) && server.timeout >0 && lSyncDate.getTime){
                const diff = new Date().getTime() - lSyncDate.getTime();
                if(diff < server.timeout){
                    return next();
                }
            }

            let sType = server.type;
            const driver = drivers[sType] || drivers[sType.toLowerCase()];
            if(!isObj(driver) || !isFunction(driver.sync)) return next();
            let {local} = server;
            if(local === true || local === 1){
                local = true;
            } else {
                local = undefined;
            }
            if(Background.isNotDBSyncBackground()){
                showPreloader("Synchronisation, serveur "+defaultStr(server.code,server._id)+"");
            }
            const ret = driver.sync({...restA,...server,onTimeoutEnd:(err)=>{
                next();
            },syncIndex:index,syncLength:length,...server,local});
            if(isPromise(ret)) {
                ret.then((databases)=>{
                    syncResults[servCode] = databases;
                    lastSyncDate.set(servCode);
                }).catch((err)=>{
                    errorF({msg:err,error,reject});
                }).finally(next);
            } else {      
                next();
            }
        }
        next()
    });
}

export {sync as run, isRunning};

/**** sync dbs with local server */
export const syncOnLocalServer = ()=>{
    return getAllDB().then((dbs)=>{
        const promises = [];
        dbs.map(({db})=>{
            promises.push(db.syncOnLocalServer);
        });
        return Promise.all(promises);
    });
}


export default {
    run : sync,
    syncDirections,
    syncOnLocalServer, //use to sync every database with local server
    isRunning,
    setInfo,
    getInfo,
}