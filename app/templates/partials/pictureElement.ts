const { html } = require('@popeindustries/lit-html-server')
const { repeat } = require('@popeindustries/lit-html-server/directives/repeat.js')
const { unsafeHTML } = require('@popeindustries/lit-html-server/directives/unsafe-html.js')

export default (item, loading = 'lazy') => {
  return html`
  <figure class="Picture__Element Picture__Element--${item.style} ${item.classes}" style="--aspect-ratio:${item.image.fields.details.image.width / item.image.fields.details.image.height}; ${item.backgroundColor !== null ? '--backgroundColor: ' + item.backgroundColor + ';' : ''}">
    <picture>
      ${repeat(item.sources, (source) => html`<source media="${source.fields.mediaQuery}" type="image/webp" srcset="${source.fields.image.fields.url}?fm=webp">`)}
      ${item.image.fields.contentType !== 'image/svg+xml'
      ? html`<source type="image/webp" srcset="${item.image.fields.url}?fm=webp">` : ''}
      <img src="${item.image.fields.url}" alt="${item.title}" loading="${loading}"/>

    </picture>
  </figure>
  ${item.description
    ? html`<div class="Annotation">
        <div class="Annotation__text">${unsafeHTML(item.description)}</div>
      </div>`
  : ''}
`
}
// ${item.backgroundColor !== null ? 'Picture__Element--background" style="--backgroundColor: ' + item.backgroundColor : ''}
