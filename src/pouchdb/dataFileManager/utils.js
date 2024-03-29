import {isNonNullString,isObj,defaultStr,extendObj,defaultDecimal,defaultBool,defaultFunc,defaultArray} from "$cutils";
import sanitizeName from "./sanitizeName";
import dataFileText from "./dataFileText";
import isValid from "./isValidDataFile";
import getAllDefault from "./getAllDefault";
import prepareFilter from "./prepareFilter";
import SignIn2SignOut,{getLoggedUser,getLoginId} from "$cauth/utils";
import { getCurrentDB } from "./session";
import DATA_FILES from "./DATA_FILES";
import isCommon from "./isCommon";
import {structDataDBName} from "./structData";
import isStructData from "./isStructData";

export {default as DATA_FILES } from "./DATA_FILES";

export {extendDefaultDataFiles} from "./defaultDataFiles";

const dataFilesCounter = {};

export {default as dbName} from "./dbName";

export {default as types} from "./types";

export {default as fields} from "./fields";

export {dataFileText,isStructData,structDataDBName,sanitizeName,isCommon,isValid,prepareFilter,getAllDefault};

///check wheater the given name is supposed to be dataFile Name
export {default as isDBName} from "./isDataFileDBName";

export const trimCommonDocId = (docCodeOrId,dbName)=>{
    docCodeOrId = defaultStr(docCodeOrId).toUpperCase().trim();
    if(isNonNullString(dbName)){
        dbName = dbName.trim().toUpperCase().rtrim("/")+"/";
        return dbName+docCodeOrId.ltrim(dbName);
    }
    return docCodeOrId;
};


export const count = (type)=>{
    type = defaultStr(type,"all").toLowerCase();
    return defaultDecimal(dataFilesCounter[type]);
}

export const get = (code)=>{
    code = sanitizeName(defaultStr(code));
    let ret = null;
    if(isNonNullString(code)){
        getAll((dF)=>{
            if(code == dF.code){
                ret = dF;
            }
        });
    }
    return ret;
}

export const getLabel = (code)=>{
    let dF = get(code);
    if(dF) return defaultStr(dF.label,dF.code,code);
    return defaultStr(code);
};

export const getAll = (filter,returnArray)=>{
    let all = {...getAllDefault(),...DATA_FILES.get()};
    filter = prepareFilter(filter);
    let allDBToReturn = returnArray ? [] : {};
    const foundedTypes = {};
    dataFilesCounter.all = 0;
    Object.map(all,(dF,i)=>{
        if(dF.type){
            if(!foundedTypes[dF.type]){
                dataFilesCounter[dF.type] = 0;
                foundedTypes[dF.type] = true;
            }
            dataFilesCounter[dF.type] = defaultDecimal(dataFilesCounter[dF.type]);
            dataFilesCounter[dF.type]++;
        }
        dataFilesCounter.all = defaultDecimal(dataFilesCounter.all);
        dataFilesCounter.all++;
        if(!isValid(dF)) return null;
        if(filter(dF,dF.code,allDBToReturn) !== false){
            if(returnArray){
                allDBToReturn.push(dF)
            } else {
                allDBToReturn[dF.code]=dF;
            }
        }
    });
    return allDBToReturn;
}
/**** si le le dataFile passé en paramètre est archivé où non
*  @param {string|object}, si chaine de caractère,par défaut le code du fichier de données en cours;
*  @return {bool}, vrai si le fichier est archivé ou non et faux au cas contraire, si le fichier de données n'est pas trouvé, alors vrai est retourné
*/
export const isArchived = (dFCode)=>{
    let type = undefined;
    if(isObj(dFCode)){
        type = defaultStr(dFCode.type);
        dFCode = defaultStr(dFCode.code);
    }
    if(!isNonNullString(dFCode) || dFCode.toLowerCase() == "default"){
        dFCode = getCurrentDB(type);
    }
    const dF = get(dFCode);
    if(dF){
        return dF.archived ? true : false;
    }
    return true;
}

export const isForUser = (dF,user)=>{
    if(SignIn2SignOut.isMasterAdmin()) return true;
    if(!isObj(dF) || !isArray(dF.users)) return false;
    if(isNonNullString(user)){
        user = {code:user};
    }
    user = isObj(user)? user : defaultObj(getLoggedUser());
    const loginId = getLoginId(user);
    if(!isNonNullString(loginId) && typeof loginId !=='number') return false;
    return dF.users.includes(loginId);
}
