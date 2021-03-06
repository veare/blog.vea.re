import layout from '../layout'
import preview from '../partials/article_preview'
import { revFile } from '../../services/files'
import { templateInterface } from '../../../types/template'
import { requestInterface } from '../../../types/request'
const { html } = require('@popeindustries/lit-html-server')
const { repeat } = require('@popeindustries/lit-html-server/directives/repeat.js')
// get correct filesnames after appending unique string
export default (articles, req: requestInterface): templateInterface => layout(html`
  <main class="Article-list" slug="${req.path}" itemscope itemtype="http://schema.org/Blog">
    ${repeat(articles, (article) => preview(article))}
    <div class="Article__more_on_medium Article__preview">
      <a href="https://medium.com/@lukasoppermann" target="_blank">More articles on medium</a>
    </div>
</main>
`, {
  title: 'Articles on design, technology and workflow',
  head: html`
  <link type="text/css" href="/${revFile('css/blog.css')}" rel="stylesheet" />
  `
}, req)
