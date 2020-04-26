import { documentToHtmlString } from '@contentful/rich-text-html-renderer'
import { Document as richTextDocument, BLOCKS, INLINES } from '@contentful/rich-text-types'
// templates
import block from '../templates/newPartials/block'
import boxedContentSection from '../templates/newPartials/boxedContent'
import section from '../templates/newPartials/section'
import collection from '../templates/newPartials/collection'
import pictureElement from '../templates/newPartials/pictureElement'
import code from '../templates/newPartials/code'
import picture from '../templates/newPartials/picture'
// Transformer
import blockTransformer from '../transformer/new/blockTransformer'
import boxedContentTransformer from '../transformer/new/boxedContentTransformer'
import sectionTransformer from '../transformer/new/sectionTransformer'
import collectionTransformer from '../transformer/new/collectionTransformer'
import pictureElementTransformer from '../transformer/new/pictureElementTransformer'
import pictureTransformer from '../transformer/new/pictureTransformer'
import codeTransformer from '../transformer/new/codeTransformer'

const { renderToString } = require('@popeindustries/lit-html-server')

// Transformer functions
const transformerFunctions = {
  block: blockTransformer,
  boxedContentSection: boxedContentTransformer,
  section: sectionTransformer,
  collection: collectionTransformer,
  code: codeTransformer,
  pictureElement: pictureElementTransformer,
  picture: pictureTransformer
}

// templates functions for embeddedEntries
const templates = {
  block: block,
  boxedContentSection: boxedContentSection,
  section: section,
  collection: collection,
  code: code,
  pictureElement: pictureElement,
  picture: picture
}
/**
 * convertHyperlinks
 * @param  node          richTextNode
 * @param  next
 * @return                   [description]
 */
const convertHyperlinks = (node, next, anchors) => {
  // split uri
  const uri = node.data.uri.split("#")
  // test if link is anchor
  if (uri[0] === 'name=') {
    const name = uri[1].toLowerCase().replace(/\s/g, '-').replace(/[^&-A-Za-z0-9]/g, '')
    // store anchor in data store
    anchors.push(name)
    // return anchor link with name tag
    return `<a name="${name}">${next(node.content)}</a>`
  }
  // return normal link
  return `<a href="${node.data.uri}">${next(node.content)}</a>`
}
/**
 * asnyc convertEmbeddedEntries
 * @param  richText          richTextDocument
 * @param  embeddedEntriesFn Object with functions
 * @return                   [description]
 */
const convertEmbeddedEntries = async (richText: richTextDocument, templates: {[key: string]: Function}): Promise<Array<any>> => {
  // return if richText is empty
  if (richText === null) {
    return []
  }
  // await conversion to resolive
  return Promise.all(
    // all nodes from richText
    richText.content
      // filter to only embedded-entry-block
      .filter(node => node.nodeType === 'embedded-entry-block')
      // trasform data and convert to HTML
      .map(async node => {
        // run transformer on data
        try {
          const transfomedData = await transformerFunctions[node.data.target.sys.contentType.sys.id](node.data.target)
          // return id & html
          return {
            // unique id of the node
            id: node.data.target.sys.id,
            // converted HTML
            html: await renderToString(templates[node.data.target.sys.contentType.sys.id](transfomedData[0].fields))
          }
        } catch (e) {
          console.error(`🚨 \x1b[31mError: Trying to convert and render of type "${node.data.target.sys.contentType.sys.id}"\x1b[0m`)
        }
      })
  )
}
/**
 * async convertRichText
 * @param  richText contentful
 * @return          [description]
 */
export default async (richText: richTextDocument) => {
  // get all converted embedded-entries
  const embedded = await convertEmbeddedEntries(richText, templates)
  // reset anchor variable
  const anchors: Array<String> = []
  // convert richText as HTML
  const html: String = documentToHtmlString(richText, {
    renderNode: {
      [BLOCKS.EMBEDDED_ENTRY]: (node) => {
        try {
          return embedded.find((entry: any) => entry.id === node.data.target.sys.id).html
        } catch (e) {
          console.error('🚨 ERROR: ', node.data.target, e)
        }
      },
      [BLOCKS.HR]: () => '<div class="horizontal-rule"><hr></div>',
      [INLINES.HYPERLINK]: (node, next) => convertHyperlinks(node, next, anchors)
    }
  })
  // return data object
  return {
    html: html,
    anchors: anchors
  }
}
