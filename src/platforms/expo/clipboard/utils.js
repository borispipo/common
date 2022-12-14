// Copyright 2022 @fto-consult/Boris Fouomene. All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.


import * as Clipboard from 'expo-clipboard';
import notify from "$active-platform/notify";

export const readText = x => Clipboard.getStringAsync();

export const readTextFromClipboard = readText;

export const copyTextToClipboard = (str) => {
    if(typeof str =='number' || typeof str =='boolean'){
        str +="";
    }
    if(isNonNullString(str)){
        Clipboard.setString(str);
        let str2 = str.length > 153 ? (str.substring(0,150)+"...") : str
        notify.info("["+str2+"]\ncopié avec succèss dans le presse papier");
        return true;
    }
};