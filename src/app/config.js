// Copyright 2022 @fto-consult/Boris Fouomene. All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

import "$cutils/string";
import isNonNullString from "$cutils/isNonNullString";
import device from "./device";
import session from "$session";
import { isValidURL } from "$cutils/uri";
import currencies from "$ccurrency/currencies";
import {isValidCurrency} from "$ccurrency/utils";
import  "../utils/extendObj";
import { getPackageJson,getName,getAppId,prefixStrWithAppId,isInitializedRef} from "./config.utils";

export * from "./config.utils";

const configRef = {current:getPackageJson()};

/**** l'ensemble des tables de la base de données */
const tablesDataRef = {current:null};

const structsDataRef = {current : {}};

const getTableDataRef = {current : {}};
const getStructDataRef = {current : {}};

const sessionDatatKey = "app-config-session-data-key";
const sessionAPIHostKey = "app-config-session-api-host";

export const getConfig = x=>{
    if(typeof configRef.current =="object" && configRef.current && !Array.isArray(configRef.current) && configRef.current?.name) return configRef.current;
    configRef.current = {...getPackageJson()};
    return configRef.current;
};
const configValuesRef = {current:{}};

export const setConfig = configValue=> {
    if(typeof configValue =="object" && configValue && !Array.isArray(configValue)){
        configValuesRef.current = configValue;
        configRef.current = {
            ...getPackageJson(),
            ...configValue,
        };
        isInitializedRef.current = true;
    }
}
export const setConfigValue = (key,value)=>{
    const conf = getConfig();
    if(isNonNullString(key)){
        try {
            if(key in config && key !=='current' && !(isGetter(key) || isSetter(key))){
                config[key] = value;
            } else {
                conf[key] = value;
            }
        } catch(e){
            try {
                conf[key] = value;
            } catch{}
            console.log(e," setting config value ",key,value);
        }
    }
    return conf;
}
const countryCodeSessionKey = "countryCodeSessionKey";
export const getCountryCode = ()=>{
    const s = session.get(countryCodeSessionKey);
    return s && typeof s =='string'? s.trim() : "";
}
export const getSessionData = (key)=>{
    const d = session.get(sessionDatatKey);
    const sData = d && typeof d =='object' && !Array.isArray(d) ? d : {};
    if(isNonNullString(key)) return sData[key];
    return sData;
}
export const setSessionData = (key,value)=>{
    let data = getSessionData();
    if(key && typeof key =='object' && !Array.isArray(key)){
        data = {...data,...key};
    } else if(isNonNullString(key)){
        data [key] = value;
    }
    session.set(sessionDatatKey,data);
    return data;
}
export const setCountryCode = (code)=>{
    session.set(countryCodeSessionKey,code && typeof code=='string'&& code || '');
    return code;
}
export const getConfigValue = function(){
    const conf = getConfig();
    const args = Array.prototype.slice.call(arguments,0);
    let hasKey = false;
    for(let i in args){
        const a = args[i];
        if(isNonNullString(a)){
            hasKey = true;
            if(conf.hasOwnProperty(a)){
                return conf[a];
            }
        }
    }
    return hasKey ? undefined : conf;
}
/** récupère le lien api host définie dans les configurations de l'application */
export const getAPIHost = ()=>{
    const host = session.get(sessionAPIHostKey);
    return isValidURL(host)? host : null; 
}
///Spécifie le lien apihost
export const setAPIHost = (newAPIHost)=>{
    newAPIHost = isValidURL(newAPIHost)? newAPIHost : "";
    session.set(sessionAPIHostKey,newAPIHost);
    return true;
}
export const getSWR = ()=>{
    const swr = getSessionData("swr");
    return swr && typeof swr =='object' && !Array.isArray(swr)? swr : {};
}
export const setSWR = (swr)=>{
    swr = swr && typeof swr =='object' && !Array.isArray(swr)? swr : {};
    return setSessionData('swr',swr);
}
const config = {
    get current(){
        return getConfig();
    },
    set current(configValue){
        return setConfig(configValue);
    },
    get theme () {
        return getTheme();
    },
    get name (){
        return getName();
    },
    get description (){
        return getDescription();
    },
    get version (){
        return getVersion();
    },
    get env (){
        return getEnv();
    },
    get realeaseDateStr (){
        return getReleaseDateStr();
    },
    get releaseDate (){
        return getReleaseDate();
    },
    get devMail (){
        return getDevMail();
    },
    get devWebsite(){
        return getDevWebsite();
    },
    get copyright (){
        return getCopyright();
    },
    get author(){
        return getAuthor();
    },
    //l'unique id de l'application
    get id (){
        return getConfigValue("id");
    },
    get appId (){
        return getAppId();
    },
    get apiVersion(){
        return getAppVersion();
    },
    get prefixWithAppId (){
        return prefixStrWithAppId;
    },
    get feeds (){
        return getFeeds();
    },
    ///le préfixe de base de données pouchdb local
    get dbNamePrefix(){
        return getDBNamePrefix();
    },
    get pouchdbPrefix(){
        return getDBNamePrefix();
    },
    get pouchdbNamePrefix (){
        return getDBNamePrefix();
    },
    get backgroundTasks (){
        return canRunBackgroundTasks();
    },
    get canRunBackgroundTasks (){
        return canRunBackgroundTasks;
    },
    get device (){
        return device;
    },
    get deviceId (){
        return device.get();
    },
    set deviceId (deviceIdOrDeviceIdGetter){
        return device.set(deviceIdOrDeviceIdGetter);
    },
    get getDeviceId(){
        return device.get;
    },
    get setDeviceId(){
        return device.set;
    },
    get get (){
        return getConfigValue;
    },
    get getValue (){
        return getConfigValue;
    },
    get currency(){
        return getCurrency();
    },
    get currencyFormat(){
        return getCurrencyFormat();
    },
    get currencies(){
        return currencies;
    },
    set currencyFormat(value){
        return setCurrencyFormat(value);
    },
    set currency(currency){
        setCurrency(currency);
    },
    get setCurrency(){
        return setCurrency;
    },
    get init (){
        return getInit();
    },
    set init(init){
        if(typeof init =="function"){
            configRef.current.init == init;
        };
    },
    /*** si le fichier de configuration a déjà été initialié */
    get initialized (){
        return isInitialized();
    },
    get isInitialized(){
        return isInitialized();
    },
    get countryCode(){
        return getCountryCode();
    },
    set countryCode(code){
        return setCountryCode(code);
    },
    get setCountryCode(){
        return setCountryCode;
    },
    get getSessionData(){
        return getSessionData;
    },
    get setSessionData(){
        return setSessionData;
    },
    /*** retourne l'api host */
    get API_HOST (){ 
        return getAPIHost();
    },
    get getAPIHost(){
        return getAPIHost;
    },
    get setAPIHost(){
        return setAPIHost;
    },
    set API_HOST (newAPIHost){
        return setAPIHost(newAPIHost);
    },
    get swr (){
        return getSWR();
    },
    set swr(value){
        return setSWR(value);
    },
    get getConfigValue(){
        return getConfigValue;
    },
    get set (){
        return setConfigValue;
    },
    get setValue (){
        return setConfigValue;
    },
    /**** les tables data sont les tables de données de la bd */
    get tablesData (){
        return getTablesData();
    },
    get getTablesData(){
        return getTablesData;
    },
    set tablesData(value){
        return setTablesData(value)
    },
    get structsData (){
        return getStructsData();
    },
    get getStructsData(){
        return getStructsData;
    },
    set structsData(value){
        return setStructsData(value);
    },
    get getTableData (){
        return getTableData;
    },
    set getTableData (value){
        if(typeof value =='function'){
            getTableDataRef.current = value;
        }
        return getTableDataRef.current;
    },
    get getStructData (){
        return getStructData;
    },
    set getStructData (value){
        if(typeof getStructDataRef.current =='function'){
            getStructDataRef.current = value;
        }
        return getStructDataRef.current;
    },
    get runBackgroundTasks(){
        if(typeof runBackgroundTasksRef.current =='function'){
            return runBackgroundTasksRef.current;
        }
        return undefined;
    },
    set runBackgroundTasks(value){
        runBackgroundTasksRef.current = value;
    }
}

export const getDescription = x=>getConfigValue("description","desc");
export const getDesc = getDescription;
export const getVersion = x=>getConfigValue("version");
export const getEnv = x=>getConfigValue("env");
export const getReleaseDateStr = x=>getConfigValue("realeaseDateStr");
export const getReleaseDate = x=>getConfigValue("releaseDate");
export const getDevMail = x=>getConfigValue("devMail");
export const getDevWebsite = x=>getConfigValue("devWebsite");
export const getCopyright = x=>getConfigValue("copyRight");
export const getAuthor = x=>getConfigValue("author");

export const getAppVersion = x=>getConfigValue("apiVersion");0
export const getFeeds = x=>getConfigValue("feeds");
export const getDBNamePrefix = x=> getConfigValue("pouchdbNamePrefix") || getAppId();
export const canRunBackgroundTasks = x=>getConfigValue("runBackgroundTasks","canRunBackgroundTasks","backgroundTasks");
const runBackgroundTasksRef = {current:null};
export const getCurrency = ()=> {
    let currency = Object.assign({},session.get("appConfigCurrency"));
    const currencyCode = getConfigValue("currencyCode");
    if(isNonNullString(currencyCode) && isValidCurrency(currencies[currencyCode.trim().toUpperCase()])){
        currency = {...currency,...currencies[currencyCode.trim().toUpperCase()]};
    }
    const format = getCurrencyFormat();
    if(format){
        currency.format = typeof currency.format =="string" && currency.format.toLowerCase().trim() || format;
    }
    return currency;
};
export const getInit = ()=>{
    return getConfigValue("init");
}
export const isInitialized = ()=>{
    return isInitializedRef.current;;
}
export const getCurrencyFormat = ()=>{
    const r = session.get("currencyFormat");
    return r && typeof r =="string" && r.toLowerCase().contains("%v")? r.toLowerCase() : "%v %s";
}
export const setCurrencyFormat = (format)=>{
    format = format && typeof format =="string"? format.trim() : "";
    return session.set("currencyFormat",format);
}
export const setCurrency = (currency)=>{
    if(!isValidCurrency(currency)){
        let cCode = typeof currency =="object" && currency && !Array.isArray(currency) ? currency.code : typeof currency =="string" ? currency : undefined;
        if(cCode){
            cCode = cCode.trim().toUpperCase();
        }
        if(cCode && isValidCurrency(currencies[cCode])){
            currency = currencies[cCode];
        } else if(typeof currency =='string') {
            cCode = currency.trim().toUpperCase();
            if(isValidCurrency(currencies[cCode])){
                currency = currencies[cCode];
            }
        }
    }
    currency = Object.assign({},currency);
    const format = getCurrencyFormat();
    if(format){
        currency.format = format;
    }
    return session.set("appConfigCurrency",currency);
}
export const getTheme  =x=>{
    const t = getConfigValue("theme");
    if(typeof t =='object' && t && !Array.isArray(t)){
        return t;
    }
    return {};
}


export const prefixWithAppId = prefixStrWithAppId;

export const getTablesData  = ()=>{
    if(tablesDataRef.current && typeof tablesDataRef.current =='object') return tablesDataRef.current;
    return {};
}

export const getStructsData  = ()=>{
    if(structsDataRef.current && typeof structsDataRef.current =='object') return structsDataRef.current;
    return {};
}

export const setStructsData = (value)=>{
    if(value && typeof value =='object'){
        structsDataRef.current = value;
    }
    return structsDataRef.current;
}
export const setTablesData = (value)=>{
    if(value && typeof value =='object'){
        tablesDataRef.current = value;
    }
    return tablesDataRef.current;
}

const getDBTableOrStructData = (tableName,tables)=>{
    if(!isNonNullString(tableName)) return null;
    if(typeof tables !== 'object' || !tables) return null;
    for(let i in tables){
        const table = tables[i];
        if(!table || typeof table !=='object') return null;
        const name = typeof table.table =='string' && table.tableName || typeof table.tableName =='string' && table.tableName || '';
        if(name && name.trim().toLowerCase() === tableName.toLowerCase()){
            return table;
        }
    }
    return null;
}
/****recupère la structData dont le nom est passée en paramètre */
export const getStructData = (tableName,table)=>{
    if(typeof getStructDataRef.current =='function'){
        return getStructDataRef.current(tableName,table);
    }
    return getDBTableOrStructData(tableName,config.structsData);
}
/****recupère la tableData dont le nom est passée en paramètre */
export const getTableData = (tableName,table)=>{
    if(typeof getTableDataRef.current =='function'){
        return getTableDataRef.current (tableName,table);
    }
    return getDBTableOrStructData(tableName,config.tablesData);
}

export default config;

function isGetter (prop) {
    return isNonNullString(prop) && !!Object.getOwnPropertyDescriptor(config, prop)['get']
}
function isSetter (prop) {
    return  isNonNullString(prop) && !!Object.getOwnPropertyDescriptor(config, prop)['set']
}