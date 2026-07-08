import Epub from "epubjs";

export async function parseEpub(file) {
  const arrayBuffer = await file.arrayBuffer()
  const book = Epub(arrayBuffer)
  await book.ready

  const metadata = await book.loaded.metadata
  const navigation = await book.loaded.navigation

  const chapters = []

  for (const item of navigation.toc) {
    try {
      const section = await book.spine.get(item.href)
      if (!section) continue

      await section.load(book.load.bind(book))
      const doc = section.document
      const text = doc.body.innerText || doc.body.textContent || ''

      if (text.trim().length > 0) {
        chapters.push({
          title: item.label.trim(),
          text: text.trim()
        })
      }

      section.unload()
    } catch (err) {
      console.warn(`Skipping chapter "${item.label}":`, err)
    }
  }

  return {
    title: metadata.title || 'Untitled',
    author: metadata.creator || 'Unknown',
    chapters
  }
}