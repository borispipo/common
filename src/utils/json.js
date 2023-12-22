// Copyright 2022 @fto-consult/Boris Fouomene. All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

const {stringify:stringifyJSON,parse} = JSON;
import {isRegExp} from "./isRegex";
export const decycle = function decycle(obj, stack = []) {
    if(typeof obj ==='function') return undefined;
    if (!obj || typeof obj !== 'object')
        return obj;
    
    if (stack.includes(obj))
        return null;

    let s = stack.concat([obj]);

    return Array.isArray(obj)
        ? obj.map(x => decycle(x, s))
        : Object.fromEntries(
            Object.entries(obj)
                .map(([k, v]) => [k, decycle(v, s)]));
}

export const stringify = function(jsonObj,decylcleVal){
    return isJSON(jsonObj) ? jsonObj : JSON.stringify(decylcleVal !== false ? decycle(jsonObj) : jsonObj);
}

export const isJSON = function (json_string){
    if(!json_string || typeof json_string != 'string') return false;
    var text = json_string;
    return !(/[^,:{}\[\]0-9.\-+Eaeflnr-u \n\r\t]/.test(text.replace(/"(\\.|[^"\\])*"/g, '')));
}

/***
 * parse JSON string recursively
 * @param {string} json string to parse
 * @return {object} or null, parse json
 */
 export const  parseJSON  = function(jsonStr){
    if(!isJSON(jsonStr)) {
        if(jsonStr && typeof(jsonStr) == 'object'){
            for(var i in jsonStr){
                jsonStr[i] = parseJSON(jsonStr[i]);
            }
        }
        return jsonStr;
    }
    try {
        jsonStr = JSON.parse(jsonStr);
        if(jsonStr && typeof(jsonStr) == 'object'){
            for(var i in jsonStr){
                jsonStr[i] = parseJSON(jsonStr[i]);
            }
        }
    } catch(e){
        return jsonStr;
    }
    return jsonStr;
}


function replacer(key, value) {
    if (isRegExp(value))
      return value.toString();
    else
      return value;
}
  
  function reviver(key, value) {
    if (isRegExp(value) && !(value instanceof RegExp)) {
      return new RegExp(value);
    } else
      return value;
  }

JSON.stringify = function(o,replacerFunc,...rest){
    replacerFunc = typeof replacerFunc =='function' ? replacerFunc : (key,value)=>value;
    return stringifyJSON(o,(key,value,...rest)=>{
        return replacerFunc(key,replacer(key,value,...rest),...rest);
    },...rest);
}
JSON.parse = function(o,reviverFunc,...rest){
    reviverFunc = typeof reviverFunc =='function'? reviverFunc : (key,value)=>value;
    return parse(o,(key,value,...rest)=>{
        return reviverFunc(o,reviver(key,value,...rest),...rest);
    },...rest);
}