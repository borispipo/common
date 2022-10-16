// Copyright 2022 @fto-consult/Boris Fouomene. All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

import parseDBName from "./utils/parseDBName";
import getDB from "./getDB";
import CONSTANTS from "./constants";
import getData from "./getData";
import pouch from "./pouchdb";

const PouchDB = pouch.PouchDB;

export * from "./getDB";

export {default as useSWR} from "./useSWR";

export {
    getDB,
    CONSTANTS,
    getData,
    parseDBName,
    PouchDB,
}

export default {
    getDB,
    CONSTANTS,
    getData,
    parseDBName,
    ...pouch,
}