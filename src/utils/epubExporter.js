

import JSZip from 'jszip'
import { saveAs } from 'file-saver'

export async function buildAndDownloadEpub(title, author, chapters, filename) {
  const zip = new JSZip()

  zip.file('mimetype', 'application/epub+zip')

  zip.folder('META-INF').file('container.xml', `<?xml version="1.0"?>
<container version="1.0" xmlns="urn:oasis:schemas:container">
  <rootfiles>
    <rootfile full-path="OEBPS/content.opf" media-type="application/oebps-package+xml"/>
  </rootfiles>
</container>`)

  const oebps = zip.folder('OEBPS')

  const chapterFiles = chapters.map((chapter, i) => `chapter_${i + 1}.xhtml`)

  oebps.file('content.opf', `<?xml version="1.0" encoding="UTF-8"?>
<package xmlns="http://www.idpf.org/2007/opf" version="3.0" unique-identifier="uid">
  <metadata xmlns:dc="http://purl.org/dc/elements/1.1/">
    <dc:title>${title}</dc:title>
    <dc:creator>${author}</dc:creator>
    <dc:language>ur</dc:language>
    <dc:identifier id="uid">tarjuman-${Date.now()}</dc:identifier>
  </metadata>
  <manifest>
    <item id="nav" href="nav.xhtml" media-type="application/xhtml+xml" properties="nav"/>
    ${chapters.map((_, i) => `<item id="chapter${i+1}" href="chapter_${i+1}.xhtml" media-type="application/xhtml+xml"/>`).join('\n    ')}
  </manifest>
  <spine>
    ${chapters.map((_, i) => `<itemref idref="chapter${i+1}"/>`).join('\n    ')}
  </spine>
</package>`)

  oebps.file('nav.xhtml', `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:epub="http://www.idpf.org/2007/ops">
<head><title>Table of Contents</title></head>
<body>
  <nav epub:type="toc">
    <h1>Table of Contents</h1>
    <ol>
      ${chapters.map((ch, i) => `<li><a href="chapter_${i+1}.xhtml">${ch.title}</a></li>`).join('\n      ')}
    </ol>
  </nav>
</body>
</html>`)

  chapters.forEach((chapter, i) => {
    const paragraphs = chapter.translatedText
      .split('\n\n')
      .filter(p => p.trim())
      .map(p => `<p>${p.trim()}</p>`)
      .join('\n    ')

    oebps.file(`chapter_${i + 1}.xhtml`, `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
  <title>${chapter.title}</title>
  <style>
    body { direction: rtl; font-family: serif; font-size: 1.1em; line-height: 2; text-align: right; margin: 2em; }
    h2 { text-align: right; }
    p { margin-bottom: 1em; }
  </style>
</head>
<body>
  <h2>${chapter.title}</h2>
  ${paragraphs}
</body>
</html>`)
  })

  const blob = await zip.generateAsync({
    type: 'blob',
    mimeType: 'application/epub+zip',
    compression: 'DEFLATE',
  })

  saveAs(blob, filename)
}