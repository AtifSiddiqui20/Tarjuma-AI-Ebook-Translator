export function chunkText(text, maxWords) {
  const paragraphs = text.split(/\n+/).filter(p => p.trim())
  const chunks = []
  let current = []
  let wordCount = 0

  for (const para of paragraphs) {
    const words = para.trim().split(/\s+/).length

    if (wordCount + words > maxWords && current.length > 0) {
      chunks.push(current.join('\n\n'))
      current = []
      wordCount = 0
    }

    if (words > maxWords) {
      const wordArr = para.split(/\s+/)
      for (let i = 0; i < wordArr.length; i += maxWords) {
        chunks.push(wordArr.slice(i, i + maxWords).join(' '))
      }
    } else {
      current.push(para.trim())
      wordCount += words
    }
  }

  if (current.length > 0) {
    chunks.push(current.join('\n\n'))
  }

  return chunks
}

export function estimateTime(chunkCount) {
  const minutes = Math.round(chunkCount * 0.5)
  if (minutes < 1) return '< 1 min'
  if (minutes === 1) return '~1 min'
  return `~${minutes} min`
}