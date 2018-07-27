'use strict'

const Transformer = require('./Transformer')
const AssetTransformer = require('./AssetTransformer')
const convertMarkdown = require('../services/convertMarkdown')
let modifiers = {
  reset: true
}

class SectionTransformer extends Transformer {
  transform (data) {
    let fn = this[data.sys.contentType.sys.id].bind(this)
    if (typeof fn === 'function') {
      return {
        id: data.sys.id,
        createdAt: data.sys.createdAt,
        updatedAt: data.sys.updatedAt,
        fields: fn(data)
      }
    }
    return null
  }

  textSection (data) {
    return {
      type: data.sys.contentType.sys.id,
      title: this.getContent(data, 'title'),
      titleType: this.getContent(data, 'titleType', 'hidden'),
      options: this.getContent(data, 'stylingOptions', []),
      intro: this.getContent(data, 'intro'),
      text: convertMarkdown(this.getContent(data, 'text'), modifiers),
      annotation: convertMarkdown(this.getContent(data, 'annotation'), modifiers)
    }
  }

  mediaSection (data) {
    return {
      type: data.sys.contentType.sys.id,
      title: this.getContent(data, 'title'),
      titleType: this.getContent(data, 'titleType', 'hidden'),
      classes: this.getContent(data, 'classes'),
      description: this.getContent(data, 'description'),
      media: new AssetTransformer(this.getContent(data, 'media'), this.getContent(data, 'title')).get()
    }
  }

  mediaCollectionSection (data) {
    return {
      type: data.sys.contentType.sys.id,
      title: this.getContent(data, 'title'),
      titleType: this.getContent(data, 'titleType', 'hidden'),
      descriptionTitle: this.getContent(data, 'descriptionTitle'),
      description: this.getContent(data, 'description'),
      media: new AssetTransformer(this.getContent(data, 'media'), this.getContent(data, 'title')).get(),
      classes: this.getContent(data, 'classes')
    }
  }

  quoteSection (data) {
    return {
      type: data.sys.contentType.sys.id,
      title: this.getContent(data, 'title'),
      titleType: this.getContent(data, 'titleType', 'hidden'),
      text: this.getContent(data, 'text'),
      author: this.getContent(data, 'author')
    }
  }
}

module.exports = SectionTransformer
