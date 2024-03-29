// Copyright 2022 @fto-consult/Boris Fouomene. All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.


import useSWR from 'swr';
import { getFetcherOptions as apiGetFetcherOptions } from '$capi';
import {defaultStr ,extendObj,isNonNullString,isObjOrArray,defaultObj} from "$cutils";
import appConfig from "$capp/config";
import {canFetchOffline} from "$capi/utils";

/****
 * Cette fonction est une abstraction au hook useSWR de https://swr.vercel.app
 * Elle a pour rôle de préfixer les url (path) passés en paramètres par l'url de base du site de déploiement de l'application
 * généré par la commande next export, voir https://nextjs.org/docs/advanced-features/static-html-export.
 * Il est à noter que, en utilisant next export, toutes les api routes sont supprimés des fichiés générés. ça rend donc impossible
 * l'utilisation des api pour la récupération des données au serveur.
 * A supposer que les api sont déployé sur un serveur distant dont l'adresse url root est enregistré dans la constante
 * BASE_PATH de ../utils
 * @param opts {string|object} si opts est une chaine de caractère, alors il s'agira de l'url à exécuter la fonction fetch
 * opts est de la forme : {
 *    path : {string}: le chemin de l'api qu'on veut préfixer,
 *    swrOptions : {object} les options à passer à la fonction swr, voir https://swr.vercel.app/docs/options
 *    options : {object} : les options à passer à la fonction useSWR : voir https://swr.vercel.app/docs/options
 *    fetcher : {function} : la fonction de récupération des données distante. par défaut, (url)=>fetch(url); ou fetch est par défaut importé du package 'unfetch'
 *    queryParams : {object} : les paramètres queryString à passer à la fonction buildAPIPath, @see api/fetch {@link api/fetch}
 * }
 * 
 */
export default function useSwr (path,opts) {
  const isNull = path === null || path === false;
  const {swrOptions,...options} = getFetcherOptions(opts);
  const { data, error,mutate,...rest } = useSWR(isNull?null:path,(fetchUrl)=>{
    const {fetcher,...rest} = apiGetFetcherOptions(fetchUrl,options);
    rest.swrQueryKey = options.swrQueryPath = fetchUrl;
    rest.fetchUrl = fetchUrl;
    return fetcher(path,rest);
  },{refreshWhenOffline:canFetchOffline,...defaultObj(swrOptions)});
  return {
    ...rest,
    mutate,
    refresh : (key, customData, options)=>{
       return mutate(defaultStr(key,path),isObjOrArray(customData) && Object.size(customData,true) ? customData : data,options);
    },
    data,
    isLoading: !error && !data,
    isError: error,
    hasError : error,
    error,
  }
}

export const getFetcherOptions = (opts)=>{
  opts = defaultObj(opts);
  return {...opts,swrOptions :extendObj(true,{},appConfig.swr,opts.swrOptions)};
}

export * from "swr";