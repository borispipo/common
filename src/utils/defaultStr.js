// Copyright 2022 @fto-consult/Boris Fouomene. All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

import isNonNullString from "./isNonNullString";
export default function defaultStr(){
    var args = Array.prototype.slice.call(arguments,0);
    if(args.length == 1){
        let s = args[0];
        if(typeof(s) =="number" && !isNaN(s)){
            return s+"";
        }
        if(isNonNullString(s)) return s;
        return "";
    }
   for(var i in args){
       let v = args[i];
       if(typeof v == "string" && isNonNullString(v)) return v
       //if(v!= null && isNonNullString(v.toString()) ) return v.toString();
   }
   return "";
}