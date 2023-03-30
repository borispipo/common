import getDBFunction,{PouchDB} from "./getDB";
import "./getInfos";

export {default as localServerConfig} from "./localServerConfig"

export * from "./pouchdb";
export * from "./getDB";

export default function getDB (dbName,opts){
    return new Promise((resolve,reject)=>{
        return getDBFunction(dbName,opts).then((rest)=>{
            return rest.db.getInfos().finally(()=>{
                resolve(rest);
            });
        }).catch(reject);
    })
}


export {getDB};