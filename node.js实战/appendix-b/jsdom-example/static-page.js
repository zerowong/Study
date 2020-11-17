const { JSDOM } = require('jsdom')

const html = `
<div class="book">
  <h2>Catch-22</h2>
  <h3>Joseph Heller</h3>
  <p>A satirical indictment of military madness.</p>
</div>`

const dom = new JSDOM(html)
const book = {
  title: dom.window.document.querySelector('.book h2').textContent,
  author: dom.window.document.querySelector('.book h3').textContent,
  desc: dom.window.document.querySelector('.book p').textContent,
}

console.log(book)
