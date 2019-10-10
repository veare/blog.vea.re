import layout from '../layout'
import preview from '../partials/article-preview'
const { html } = require('@popeindustries/lit-html-server')
const { repeat } = require('@popeindustries/lit-html-server/directives/repeat.js')
// get correct filesnames after appending unique string
const files = require('../../../app/services/files.ts')
export default (articles) => layout(html`
  <ul class="Article-list" itemscope itemtype="http://schema.org/Blog">
    ${repeat(articles, (article) => preview(article))}
  </ul>
`, {
  head: html`
  <link type="text/css" href="/${files().css['css/blog.css']}" rel="stylesheet" />
  `
})
