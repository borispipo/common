// Copyright 2022 @fto-consult/Boris Fouomene. All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

import { notifyRef,notificationRef} from "$cnotify";

export {default} from "$cnotify";

notifyRef.current = (options)=>{
    if(!notificationRef.current || !notificationRef.current.alertWithType) return;
    return notificationRef.current.alertWithType(options);
}

export * from "$cnotify";