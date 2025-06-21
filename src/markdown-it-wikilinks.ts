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

  function isAbsolute(pageName: string) {
    return options.makeAllLinksAbsolute || pageName.charCodeAt(0) === 0x2F/* / */
  }

  function removeInitialSlashes(str: string) {
    return str.replace(/^\/+/, '')
  }

  function makeRelativeToWorkspace(pagePath: string, workspaceRoot: string) {
    const normalizedWorkspaceRoot = path.resolve(workspaceRoot)
    pagePath = removeInitialSlashes(pagePath)
    // If pagePath is already absolute, use it directly
    // If it's relative, resolve it relative to the workspace root
    const normalizedPagePath = path.isAbsolute(pagePath) 
      ? path.resolve(pagePath)
      : path.resolve(normalizedWorkspaceRoot, pagePath)
    
    const pathFromRootToPage = path.relative(normalizedWorkspaceRoot, normalizedPagePath)
    
    // If the relative path starts with '..' it means the file is outside the workspace
    if (pathFromRootToPage.startsWith('..')) {
      return removeInitialSlashes(pagePath.replace(/\\/g, '/'))
    }
    
    return pathFromRootToPage.replace(/\\/g, '/')
  }

  return Plugin(
    new RegExp("\\[\\[([^sep\\]]+)(sep[^sep\\]]+)?\\]\\]".replace(/sep/g, options.separator)),
    (match: RegExpMatchArray, utils: any) => {
      let label = ''
      let pagePath = ''
      let href = ''
      let htmlAttrs: string[] = []
      let htmlAttrsString = ''
      const isSplit = !!match[2]
      if (isSplit) {
        if (options.description_then_file) {  
          label = match[1]
          pagePath = options.generatePageNameFromLabel(match[2].replace(new RegExp(options.separator), ''))
        } else {
          label = match[2].replace(new RegExp(options.separator), '')
          pagePath = options.generatePageNameFromLabel(match[1])
        }
        
      }
      else {
        label = match[1]
        pagePath = options.generatePageNameFromLabel(match[1]) // doesn't handle non-path links
      }

      label = options.postProcessLabel(label)
      pagePath = options.postProcessPageName(pagePath)

      // make sure none of the values are empty
      if (!label || !pagePath) {
        return match.input
      }

      if (isAbsolute(pagePath)) {
        // Convert absolute path to workspace-relative path
        if (options.workspaceRoot) {
          href = makeRelativeToWorkspace(pagePath, options.workspaceRoot)
        } else {
          href = removeInitialSlashes(pagePath.replace(/\\/g, '/'))
        }
      }
      else {
        if (options.workspaceRoot) {
          href = makeRelativeToWorkspace(pagePath, options.workspaceRoot)
        } else {
        href = options.relativeBaseURL + pagePath
      }
    }
      href = utils.escape(href)

      htmlAttrs.push(`href="${href}"`)
      for (let attrName in options.htmlAttributes) {
        const attrValue = options.htmlAttributes[attrName]
        htmlAttrs.push(`${attrName}="${attrValue}"`)
      }
      htmlAttrsString = htmlAttrs.join(' ')
      
      return `<a ${htmlAttrsString}>${href}</a>`
    }
  )
}
