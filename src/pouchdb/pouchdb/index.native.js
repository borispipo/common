// Copyright 2022 @fto-consult/Boris Fouomene. All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

import mobileNativePouchAdapter from "./native.adapter";
import  PouchDB from "pouchdb";

const extra = {adapter : mobileNativePouchAdapter.adapter};
PouchDB
  .plugin(mobileNativePouchAdapter)
export default {
  PouchDB,
  ...extra
}

export {PouchDB};