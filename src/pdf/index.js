import pdfMake from "./pdfmake";
import {isObj,isNonNullString,defaultStr,extendObj} from "$cutils";
import { pageBreakBefore,createPageHeader,getHeader,getFooter,getPrintedDate,prepareOptions,getPageSize,getPageMargins,textToObject,createSignatories} from "./utils";
import packageJSON from "$packageJSON";
import printFile from "./print";

export * from "./formats";
export * from "./utils";
export * from "./pdfmake";



/*** permet de créere un pdf à partir de l'utilitaire pdfmake
    @see https://pdfmake.github.io/docs/0.1
    @param {object} docDefinition {
        la définition selon pdfmake
        pageHeader {false|string|array|object}, si false, le header de la page ne sera pas généré
        signatories {Array<{object}>}, la liste des signataires, générés en bas de page
        printedDate {false}, si la date de tirage sera affichée où non
    }
    @param {object:{createPDF|createPdf}}, en environnement node par example, l'on devra passer une autre fonction createPdf afin que ça marche car sinon une erreur sera générée
*/
export function createPDF(_docDefinition,customPdfMake,...restOptions){
    _docDefinition = prepareOptions(_docDefinition);
    const docDefinition = {..._docDefinition,...getPageSize(_docDefinition)};
    const {content:dContent,pageBreakBefore:pBefore} = docDefinition;
    const content = Array.isArray(dContent)? dContent : isObj(dContent) || isNonNullString(content) ? [dContent] : [];
    docDefinition.pageBreakBefore = pageBreakBefore(pBefore);
    if(docDefinition.pageHeader !== false){
        const pageHeader = createPageHeader(docDefinition);
        if(pageHeader && (Array.isArray(pageHeader) && pageHeader.length || Object.size(pageHeader,true))){
            content.unshift(pageHeader);
        }
    }
    delete docDefinition.pageHeader;
    docDefinition.header = getHeader(docDefinition);
    docDefinition.footer = getFooter(docDefinition);
    
    if(isNonNullString(docDefinition.footerNote)){
        content.push({text:textToObject(docDefinition.footerNote)})
    }
    delete docDefinition.footerNote;
    if(docDefinition.printedDate !== false){
        content.push(getPrintedDate(docDefinition));
    }
    const _sign = Array.isArray(docDefinition.signatories)? docDefinition.signatories : [];
    if(_sign.length && docDefinition.signatories !== false){
        const signatories = createSignatories(_sign);
        if(signatories){
            content.push(signatories);
        }
    }
    delete docDefinition.signatories;
    docDefinition.content = content;
    docDefinition.info = extendObj({},{
        title: defaultStr(restOptions.title,),
        author: defaultStr(packageJSON?.author,"Boris Fouomene"),
        subject: defaultStr(restOptions?.description,packageJSON?.description),
        creator : defaultStr(packageJSON?.author),
        producer : defaultStr(packageJSON?.author),
        creationDate : new Date(),
        keywords: defaultStr(restOptions.keywords,packageJSON?.keywords),
    },docDefinition.info);
    
    const createPdf = customPdfMake && typeof customPdfMake?.createPDF =='function'? customPdfMake.createPDF : typeof customPdfMake?.createPdf =='function'? customPdfMake.createPdf : pdfMake.createPdf;
    
    //@see : https://pdfmake.github.io/docs/0.1/document-definition-object/tables
    // The full signature of createPdf looks like this.
    // tableLayouts, fonts and vfs are all optional - falsy values will cause
    // pdfMake.tableLayouts, pdfMake.fonts or pdfMake.vfs to be used.
    //signature: docDefinition,tableLayouts, fonts, vfs
    return createPdf(docDefinition,...restOptions);
};

/*** permet de générer le pdf à partir de la fonction print du fichier ./print
    @param {Array|Object} data, la données où l'ensemble des données à imprimer
    @param {object} options, les options supplémentaires à passer à la fonction print
*/
export const print = (data,options,customPdfMake, ...restOptions)=>{
    return printFile(data,options).then((docDefinition)=>{
        return createPDF({...docDefinition,pageHeader:false,printedDate:false,footerNote:false,signatories:false},customPdfMake, ...restOptions)
    })
}