'use strict'

function escapeString(str) {
  return str
    .replace(/\\/g, '\\\\')
    .replace(/'/g, "\\'")
    .replace(/\n/g, '\\n')
    .replace(/\r/g, '\\r')
    .replace(/\t/g, '\\t')
    .replace(/\v/g, '\\v')
    .replace(/[\b]/g, '\\b')
    .replace(/\f/g, '\\f')
}

function isType(obj, type) {
  var t = Object.prototype.toString.call(obj)
  return t === '[object ' + type + ']'
}

const defaultOptions = {
  parenthesis: false,
}

export default function stringify(obj, options) {
  if(typeof Error !=='undefined' && obj instanceof Error){
    return obj?.toString();
  }
  options = Object.assign({}, defaultOptions, options || {})

  var openParen = options.parenthesis ? '(' : ''
  var closeParen = options.parenthesis ? ')' : ''

  if (obj == null)
    return obj + ''

  if (isType(obj, 'RegExp') || isType(obj, 'Number') || isType(obj, 'Boolean'))
    return obj.toString()

  if (typeof obj === 'function')
    return openParen + obj.toString() + closeParen

  if (typeof obj === 'string')
    return "'" + escapeString(obj) + "'"

  if (isType(obj, 'Date'))
    return 'new Date(' + obj.getTime() + ')'

  if (Array.isArray(obj))
    return '[' + obj.map(v => stringify(v)).join(',') + ']'

  if (typeof obj === 'object'){
    return openParen + '{' + Object.keys(obj).map(k => {
        var v = obj[k]
        return stringify(k) + ':' + stringify(v)
      }).join(',') + '}' + closeParen
   }
    if(!obj) return String(obj);
    return typeof obj?.toString =="function"? obj?.toString() : String(obj);
}