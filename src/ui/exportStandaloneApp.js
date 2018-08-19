import { doWith } from '../core'
import storage from './storage'
import { saveAs } from 'file-saver'

/* HEADS UP: This duplicates index.html.
 * For now, this duplication is easier to deal with than
 * more build tooling.
 */
const template = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    <meta name="theme-color" content="#000000">
    <title>Verse</title>
    <link rel="manifest" href="/manifest.json">
    <link rel="shortcut icon" href="/favicon.ico">
    <script>
window.stackStyle = (() =>
  new Error().stack.split('\\n')[0].includes('@') ? 'moz' : 'webkit'
)()
    </script>
  </head>
  <body>
    <noscript>
      You need to enable JavaScript to run this app.
    </noscript>
    <div id="root"></div>
    <style id="main-css" type="text/css">$CODE_GOES_HERE$</style>
    <script id="app-code" type="text/x-verse">$CODE_GOES_HERE$</script>
    <script id="main-script" type="text/javascript">$CODE_GOES_HERE$</script>
  </body>
</html>
`

const split = delimiter => text => text.split(delimiter)
const join = delimiter => items => items.join(delimiter)
const interleave = xs => ys => {
  // this function is not general-purpose! It assumes ys
  // will always be longer than xs.
  let out = []
  for (let i = 0; i < ys.length; i++) {
    out.push(ys[i])
    if (i < xs.length) {
      out.push(xs[i])
    }
  }
  return out
}

export function exportStandaloneApp() {
  const appCode = storage.load()['main.js']
  const mainScript = el('main-script').innerText
  const mainCss    = el('main-css').innerText

  saveAs(doWith(
    template,
    /* split and interleave instead of doing text
     * replacement in case the app code contains
     * $CODE_GOES_HERE$ (and note that the mainScript
     * *definitely* contains it) */
    split('$CODE_GOES_HERE$'),
    interleave([mainCss, appCode, mainScript]),
    join(''),
    toBlob
  ), 'verse-app.html')
}

function toBlob(string) {
  return new Blob([string], {type: 'text/plain;charset=utf-8'})
}

function el(id) {
   return document.getElementById(id)
}
