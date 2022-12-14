// Copyright 2022 @fto-consult/Boris Fouomene. All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

import CryptoJS from "./aes";

function encode (data, key){
    if(data && typeof (data) =='object'){
        key = defaultStr(data.key)
        data = defaultStr(data.pass,data.password);
    }
    data = defaultStr(data);
    if(!(data) || !isNonNullString(key)) return data;
    return CryptoJS.AES.encrypt(data,key);
}
function decode (data,key){
    if(data && typeof (data) =='object'){
        key = defaultStr(data.key)
        data = defaultStr(data.pass,data.password);
    }
    data = defaultStr(data);
    if(!(data) || !isNonNullString(key)) return data;
    return CryptoJS.AES.decode(data,key);
}

export {
    encode,
    decode,
    encode as encrypt,
    decode as decrypt,
 }

 export default {
    encode,
    decode,
    encrypt:encode,
    decrypt : decode,
 }