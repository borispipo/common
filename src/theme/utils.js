// Copyright 2022 @fto-consult/Boris Fouomene. All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

import { lightColors,darkColors} from "./defaultTheme";
import themeRef from "$active-platform/themeRef";

export * from "./alpha";

export {themeRef};

export const fields = {
    name : {
        type : 'text',
        maxLength : 30,
        text : 'Nom du thème',
        required : true,
        upper : true,
    }, 
    dark : {
        type : 'switch',
        checkedValue : true,
        uncheckedValue : false,
        label : 'Mode Sombre',
        checkedTooltip : 'Mode sombre actif',
        uncheckedTooltip : 'Mode sombre inactif',
        onChange : ({value,checked,context})=>{
            if(checked === undefined) return;
            if(context && context.getField){
                const darkFields = checked ? darkColors  : lightColors;
                Object.map(darkFields,(dF,i)=>{
                    const dFContext = context.getField(i);
                    if(dFContext && dFContext.setValue){
                        dFContext.validate({value:dF});
                    }
                })
            }
        }
    },
    profilAvatarPosition : {
        type : 'switch',
        checkedValue : "drawer",
        uncheckedValue : "appBar",
        label : "Profil affiché sur le drawer",
        checkedTooltip : "Votre profil avatar sera affiché sur la barre de navigation latéralle de l'application"
    },
    textFieldMode:null,
    primary : {
        type : 'color',
        text : 'Couleur principale [primary]',
        required : true,
        onChange : ({value,context})=>{
            if(context && context.getField){
                const pOnSurface = context.getField("primaryOnSurface");
                if(pOnSurface){
                    pOnSurface.setValue(value);
                }
            }
        }
    },
    onPrimary : {
        type :'color',
        text :'Texte sur couleur principale [onPrimary]',
        required : true,
    },
    secondary : {
        type : 'color',
        text : ' Couleur secondaire [secondary]',
        required : true,
        onChange : ({value,context})=>{
            if(context && context.getField){
                const sOnSurface = context.getField("secondaryOnSurface");
                if(sOnSurface){
                    sOnSurface.setValue(value);
                }
            }
        }
    },
    onSecondary : {
        type :'color',
        text :'Texte sur couleur secondaire [onSecondary]',
        required : true,
    },
    text : {
        type :'color',
        text : 'Couleur de texte [text]',
        required : true,
    },
    disabled : {
        type :'color',
        text :'Texte Inactif [disabeld]'
    },
    divider : {
        type : 'color',
        text : 'Couleur|Soulignement [divider]'
    },
    background : {
        type : 'color',
        text : 'Couleur d\'arrière plan [background]',
    },
    surface : {
        type :'color',
        text :'Couleur de surface [surface]',
    },
    onSurface : {
        type :'color',
        text :'Texte sur surface [onSurface]',
    },
    primaryOnSurface : {
        type :'color',
        text :'Couleur principale sur surface  [primaryOnSurface]',
    },
    secondaryOnSurface : {
        type :'color',
        text :'Couleur secondaire sur surface  [secondaryOnSurface]',
    },
    info : {
        type :'color',
        text :'Notification|info [info]'
    },
    success : {
        type :'color',
        text :'Notification|Succès [success]'
    },
    warning : {
        type :'color',
        text :'Notification|Alerte [warning]'
    },
    error : {
        type :'color',
        text :'Notification|Erreur [error]'
    },
};

export const canBeNumber = function isNumeric(value) {
    if(typeof value !=="string") return false;
    return /^-?\d+$/.test(value);
}

export const getThemeData = (value)=>{
    const theme = {name:value.name,colors:{}};
    const validValue = {};
    Object.map(fields,(f,i)=>{
        if(!f) return;
        if(f.type =='color'){
            const fText = i+"Color";
            theme.colors[i] = value[i] || value[fText];
        } else {
            theme[i] = value[i];
        }
        validValue[i] = value[i];
    });
    return {theme,value:validValue};
}