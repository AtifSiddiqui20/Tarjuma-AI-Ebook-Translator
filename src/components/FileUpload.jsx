import { chunkText, estimateTime } from '../utils/chunker'

function FileUpload({ chunkSize, isRunning, onFileLoaded, onTranslate, onStop, chunks, fileName, fileSize }) {
  function handleFile(e) {
    const file = e.target.files[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      const text = event.target.result
      const size = (file.size/1024).toFixed(0) + ' KB' // size in KB
      
      onFileLoaded(file.name, text, size)
    }
      
    reader.readAsText(file)
  }

  const wordCount = chunks.reduce((acc, c) => acc + c.split(/\s+/).length, 0)
  return (
    <div className="panel">
      <p className="panel-title">Input file</p>

      <div className="upload-zone">
        <i className="upload-icon">📄</i>
        <p className="upload-text">Click to upload a file</p>
        <p className="upload-sub">.txt files only for now</p>
        <input type="file" accept=".txt" onChange={handleFile} />
      </div>

      {chunks.length > 0 && (
        <div className="file-info">
          <div className="file-info-header">
            <span className="file-name">{(fileName)}</span>
            <span className="file-size">{(fileSize)}</span>
          </div>
          <div className="stats-row">
            <div className="stat">
              <div className="stat-val">{wordCount.toLocaleString()}</div>
              <div className="stat-lbl">Words</div>
            </div>
            <div className="stat">
              <div className="stat-val">{chunks.length}</div>
              <div className="stat-lbl">Chunks</div>
            </div>
            <div className="stat">
              <div className="stat-val">{estimateTime(chunks.length)}</div>
              <div className="stat-lbl">Est. time</div>
            </div>
          </div>
        </div>
      )}

      <div className="btn-row">
        <button
          className="btn-translate"
          disabled={chunks.length === 0 || isRunning}
          onClick={onTranslate}
        >
          ▶ Translate
        </button>
        <button className="btn-stop" onClick={onStop}>
          ■ Stop
        </button>
      </div>
    </div>
  )
}

export default FileUpload