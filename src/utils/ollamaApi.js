export async function getModels(baseUrl) {
  const response = await fetch(`${baseUrl}/api/tags`)
  const data = await response.json()
  return data.models
}

export async function translateChunk(baseUrl, model, systemPrompt, text, temperature) {
  const response = await fetch(`${baseUrl}/api/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: model,
      system: systemPrompt,
      prompt: text,
      stream: true,
      options: {
        temperature: temperature,
        num_ctx: 4096,
      }
    })
  })

  if (!response.ok) {
    throw new Error(`Ollama error: ${response.status}`)
  }

  return response
}

export async function streamResponse(response, onToken) {
  const reader = response.body.getReader()
  const decoder = new TextDecoder()
  let fullText = ''

  while (true) {
    const { done, value } = await reader.read()
    if (done) break

    const lines = decoder.decode(value).split('\n').filter(Boolean)

    for (const line of lines) {
      try {
        const obj = JSON.parse(line)
        if (obj.response) {
          fullText += obj.response
          onToken(fullText)
        }
        if (obj.done) return fullText
      } catch {
        // skip malformed lines
      }
    }
  }

  return fullText
}