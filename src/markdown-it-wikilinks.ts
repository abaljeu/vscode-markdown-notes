// based on '@thomaskoppelaar/markdown-it-wikilinks' index.js
//    "@thomaskoppelaar/markdown-it-wikilinks": "^1.3.0",
'use strict'

const Plugin = require('markdown-it-regexp')
const extend = require('extend')
const sanitize = require('sanitize-filename')
const path = require('path')

module.exports = (options: any) => {

  const defaults = {
    baseURL: '/',
    relativeBaseURL: './',
    makeAllLinksAbsolute: false,
    uriSuffix: '.html',
    description_then_file: false,
    separator: "\\|",
    htmlAttributes: {
    },
    generatePageNameFromLabel: (label: string) => {
      return label
    },
    postProcessPageName: (pageName: string) => {
      pageName = pageName.trim()
      pageName = pageName.split('/').map(sanitize).join('/')
      pageName = pageName.replace(/\s+/, '_')
      return pageName
    },
    postProcessLabel: (label: string) => {
      label = label.trim()
      return label
    }
  }

  options = extend(true, defaults, options)

  return Plugin(
    new RegExp("\\[\\[([^sep\\]]+)(sep[^sep\\]]+)?\\]\\]".replace(/sep/g, options.separator)),
    (match: RegExpMatchArray, utils: any) => {
      let description = ''
      let fileSpec = ''
      let htmlAttrs: string[] = []
      let htmlAttrsString = ''
      const isSplit = !!match[2]

      if (isSplit) {
        // Two parts: one is description, other is fileSpec (order by options)
        if (options.description_then_file) {  
          description = match[1]
          fileSpec = match[2]
        } else {
          fileSpec = match[1]
          description = match[2]
        }
      } else {
        // Single part: determine if it's a fileSpec or description
        const spec = match[1]
        description = spec
        if (spec.includes('\\') || spec.includes('/') || spec.includes('.')) {
          // Contains path characters, treat as fileSpec
          fileSpec = spec
        } else {
          // Treat as description, generate fileSpec
          fileSpec = options.generatePageNameFromLabel(spec)
        }
      }

      fileSpec = fileSpec.replace(new RegExp(options.separator), '')
      // Apply post-processing
      description = options.postProcessLabel(description)
      fileSpec = options.postProcessPageName(fileSpec)

      // Escape for HTML
      const escapedFileSpec = utils.escape(fileSpec)
      const displayText = utils.escape(description)

      // Generate <a> element
      htmlAttrs.push(`href="javascript:void(0)"`)
      htmlAttrs.push(`data="${escapedFileSpec}"`)
      // htmlAttrs.push(`style="cursor:pointer; color:blue; text-decoration:underline;"`)
      
      for (let attrName in options.htmlAttributes) {
        const attrValue = options.htmlAttributes[attrName]
        htmlAttrs.push(`${attrName}="${attrValue}"`)
      }
      
      htmlAttrsString = htmlAttrs.join(' ')
      let elem = `<a ${htmlAttrsString}>${displayText}</a>`
      console.log('generated', elem)
      return elem
    }
  )
}
