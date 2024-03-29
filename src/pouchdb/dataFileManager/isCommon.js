import defaultDataFiles from "./getAllDefault";
import sanitizeName from "./sanitizeName";
import defaultStr from "$cutils/defaultStr";
import isValidDataFile from "./isValidDataFile";
import constants from "../constants";
import DATA_FILES from "./DATA_FILES";

/**** vérifie si une base de données en question est commune 
 * @param {object|string} dataFile, le fichier de données/ ou son code. 
 *  S'il s'agit d'un object, alors cet objet sera vérifié s'il s'agit d'une source de données commune
 *  S'il s'agit d'une chaine de caractère, alors l'objet dataFile correspondant sera vérifié parmis la liste des fichiers de données
 *  et sa propriétés common sera testée.
 * @return {boolean} si vrai, alors il s'agit d'un fichier de données partagé par tous les utilisateurs
*/
export default function isCommon (dataFile){
    if(isValidDataFile(dataFile)){
        return dataFile.common || defaultStr(dataFile.type).toLowerCase().trim() =="common" ? true : false
    }
    const sCode = sanitizeName(dataFile);
    const commonDb = defaultStr(constants.COMMON_DB).toLowerCase().trim();
    if(sCode === commonDb || defaultStr(dataFile).toLowerCase().trim() === commonDb){
        return true;
    }
    const dataFiles = DATA_FILES.get();
    if(!sCode) return false;
    if(dataFiles[sCode]){
        const dF = dataFiles[sCode];
        if(dF.common || defaultStr(dF.type).toLowerCase().trim() =="common") return true; 
    }
    if(defaultDataFiles[sCode]){
        const dF = defaultDataFiles[sCode];
        if(dF.common || defaultStr(dF.type).toLowerCase().trim() =="common") return true; 
    }
    return false;
};

