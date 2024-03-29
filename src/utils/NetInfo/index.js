// Copyright 2022 @fto-consult/Boris Fouomene. All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

import {isClientSide} from "$cplatform";
import {isValidUrl} from "$cutils";
let NetInfo  = undefined;
let hasNetInfoIntialized = false;
import appConfig from "$appConfig";
import {defaultNumber} from "$cutils";

const init = ()=>{
    const status = 200;
    if(!NetInfo && isClientSide() && !hasNetInfoIntialized){
        const fetchUrl = isValidUrl(process.env.NET_INFO_TEST_URL) ? process.env.NET_INFO_TEST_URL : ("https://httpstat.us/"+status);
        NetInfo = require('$active-platform/NetInfo').default;
        NetInfo.configure({
            /**** The URL to call to test if the internet is reachable. Only used on platforms which do not supply internet reachability natively or if useNativeReachability is false. */
            reachabilityUrl: fetchUrl,
            /***The HTTP request method to use to call reachabilityUrl URL to call to test if the internet is reachable. Defaults to HEAD. GET is also available */
            reachabilityMethod : "HEAD",
            /***A function which is passed the Response from calling the reachability URL. It should return true if the response indicates that the internet is reachable. Only used on platforms which do not supply internet reachability natively or if useNativeReachability is false. */
            reachabilityTest: async (response) => response.status === 200 || response.status==status,
            /**The number of milliseconds between internet reachability checks when the internet was previously detected. Only used on platforms which do not supply internet reachability natively or if useNativeReachability is false. */
            reachabilityLongTimeout: defaultNumber(appConfig.get("netInfoReachabilityLongTimeout"),10 * 60 * 1000), // 10min
            /**The number of milliseconds between internet reachability checks when the internet was not previously detected. Only used on platforms which do not supply internet reachability natively or if useNativeReachability is false. */
            reachabilityShortTimeout: defaultNumber(appConfig.get("netInfoReachabilityShortTimeout"),30 * 1000), // 30 seconds
            /***The number of milliseconds that a reachability check is allowed to take before failing. Only used on platforms which do not supply internet reachability natively or if useNativeReachability is false.*/
            reachabilityRequestTimeout: 15 * 1000, // 15s
            /***A function which returns a boolean to determine if checkInternetReachability should be run. */
            reachabilityShouldRun: () => true,
            /***A flag indicating one of the requirements on iOS has been met to retrieve the network (B)SSID, and the native SSID retrieval APIs should be called. This has no effect on Android. */
            shouldFetchWiFiSSID : false,
            /***A flag indicating whether or not Netinfo should use native reachability checks, if available. */
            useNativeReachability : true,
        });
        hasNetInfoIntialized = true;
    }
}
const N = {
    get fetch (){
        if(!isClientSide()) return x=> Promise.resolve({});
        init();
        return NetInfo.fetch;
    },
    get refresh (){
       if(!isClientSide()) return x=> Promise.resolve({});
       init();
       return NetInfo.refresh;
    },
    get addEventListener(){
      if(!isClientSide()) return x=> Promise.resolve({});   
      init();
      return NetInfo.addEventListener;
    },
    get useNetInfo (){
       if(!isClientSide()) return x=> Promise.resolve({});
       init();
       return NetInfo.useNetInfo;
    }
}

export default N;