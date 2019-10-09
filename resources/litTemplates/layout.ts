import meta from './meta'
import footer from './partials/footer'
import menu from './partials/menu'
const { html } = require('@popeindustries/lit-html-server')
const { unsafeHTML } = require('@popeindustries/lit-html-server/directives/unsafe-html.js')
// get correct filesnames after appending unique string
const files = require('../../app/services/files')
const fs = require('fs')
//
export default (content: string, options: { [prop: string]: string; } = {}) => html`
<!DOCTYPE html>
<html lang="en">
<head>
  ${meta()}
  <link type="text/css" href="/${files().css['css/litApp.css']}" rel="stylesheet" />
  <script>${unsafeHTML(fs.readFileSync('./public/' + files().js['js/index.js']))}
  </script>

  ${options.head || ''}
</head>
<body class="${options.bodyClass || ''} temp-body">
  ${menu}
  <div id="page" class="Grid">
    ${content || ''}
  </div>
  ${footer}
</body>
</html>
`
