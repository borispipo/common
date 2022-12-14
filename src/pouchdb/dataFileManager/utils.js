import {isNonNullString,isObj,defaultStr,extendObj,defaultDecimal,defaultBool,defaultFunc,defaultArray} from "$cutils";
import dataFileText from "./dataFileText";
import sanitizeName from "./sanitizeName";
import isValid from "./isValidDataFile";
import getAllDefault from "./getAllDefault";
import prepareFilter from "./prepareFilter";
import getCurrentDB from "./getCurrentDB";
import setCurrentDB from "./setCurrentDB";
import table from "./table";
import isCommon from "./isCommon";
import docId from "./docId";
import {structDataDBName} from "./structData";
import isStructData from "./isStructData";
import {getLoggedUser} from "$cauth/utils/session";

const dataFilesCounter = {};


export {default as dbName} from "./dbName";

const tableName = table;
export {dataFileText,isStructData,structDataDBName,docId,tableName,table,getCurrentDB,setCurrentDB,sanitizeName,isCommon,isValid,prepareFilter,getAllDefault};


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
    let all = extendObj(true,{},getAllDefault(),getDataFiles());
    filter = prepareFilter(filter);
    dataFilesCounter = {};
    let allDBToReturn = returnArray ? [] : {};
    Object.map(all,(dF,i)=>{
        if(dF.type){
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
/**** si le le dataFile pass?? en param??tre est archiv?? o?? non
*  @param {string|object}, si chaine de caract??re,par d??faut le code du fichier de donn??es en cours;
*  @return {bool}, vrai si le fichier est archiv?? ou non et faux au cas contraire, si le fichier de donn??es n'est pas trouv??, alors vrai est retourn??
*/
export const isArchived = (dFCode)=>{
    if(isObj(dFCode)){
        dFCode = defaultStr(dFCode.code);
    }
    if(!isNonNullString(dFCode) || dFCode.toLowerCase() == "default"){
        dFCode = getCurrentDB();
    }
    const dF = get(dFCode);
    if(dF){
        return dF.archived ? true : false;
    }
    return true;
}

export const isForUser = (dF,user)=>{
    //if(isMasterAdmin()) return true;
    if(!isObj(dF) || !isArray(dF.users)) return false;
    if(isNonNullString(user)){
        user = {code:user};
    }
    user = isObj(user)? user : defaultObj(getLoggedUser());
    if(!isNonNullString(user.code)) return false;
    return arrayValueExists(dF.users,user.code)
}
