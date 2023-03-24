// Copyright 2022 @fto-consult/Boris Fouomene. All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.
import isNonNullString from "./isNonNullString";
import "./string";

const sanitize = require("sanitize-filename");

export const sanitizeSheetName = function(sheetName){
    if(!isNonNullString(sheetName)) return "";
    sheetName = sheetName.replaceAll("/","-").replaceAll("\\","-").sanitizeFileName().replaceAll("[","<").replaceAll("]","")
    if(sheetName.length > 31){
        sheetName = sheetName.substring(0,28)+"..."
    }
    return sheetName;
}

export const sanitizeFileName  = (str,escapeSpaces)=>{
    escapeSpaces = isBool(escapeSpaces)? escapeSpaces : true;
    if(isNonNullString(str)){
        if(escapeSpaces) str = str.removeSpecialChars().replaceAll(" ","-").replaceAll("[","(").replaceAll("]",")")
        return sanitize(sprintf(str).replaceAll("/","-"));
    }
    return "";
}

export const sanitizeName = sanitizeFileName;


String.prototype.sanitizeFileName = function(escapeSpaces){
    return sanitizeFileName(this.toString(),escapeSpaces);
}
String.prototype.sanitizeSheetName = function(){
    return sanitizeSheetName(this.toString(),false);
}
