// Copyright 2022 @fto-consult/Boris Fouomene. All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.
/*** @namespace session/utils */
import {isJSON, parseJSON,stringify} from "$cutils/json";
import appConfig from "$capp/config";
import {isNonNullString} from "$utils";

export const sanitizeKey = (key)=>{
  if(!isNonNullString(key)) return "";
  return appConfig.prefixWithAppId(key);
}
export const handleSetValue = (value,decycle) => {
  value = value && typeof value =="object" ? stringify(value,decycle) : value;
  if(value ===null) value = "";
  return value;
}
export const handleGetValue = value => {
  if(value !== null) {
    return isJSON(value) ? parseJSON(value) : value;
  }
  return undefined;
}
 

export default {handleGetValue,handleSetValue};