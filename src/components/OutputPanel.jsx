function OutputPanel({ output, fileName }) {
  const fullText = output.join('\n\n')

  function handleDownload() {
    const blob = new Blob([fullText], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = fileName ? `translated_${fileName}` : 'translation.txt'
    a.click()
    URL.revokeObjectURL(url)
  }

  if (output.length === 0) return null

  return (
    <div className="panel">
      <div className="output-header">
        <p className="panel-title" style={{ margin: 0 }}>Output</p>
        <div className="output-actions">
          <button className="btn-sm" onClick={() => navigator.clipboard.writeText(fullText)}>
            Copy
          </button>
          <button className="btn-sm" onClick={handleDownload}>
            Download .txt
          </button>
        </div>
      </div>
      <div className="output-text">
        {fullText || 'Translation will appear here…'}
      </div>
    </div>
  )
}

export default OutputPanel