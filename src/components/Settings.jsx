function Settings({ 
  ollamaUrl, setOllamaUrl,
  model, setModel,
  srcLang, setSrcLang,
  tgtLang, setTgtLang,
  temperature, setTemperature,
  chunkSize, setChunkSize,
  systemPrompt, setSystemPrompt
}) {
  return (
    <div className="panel">
      <p className="panel-title">Settings</p>

      <div className="field">
        <label>Ollama URL</label>
        <input type="text" value={ollamaUrl} onChange={e => setOllamaUrl(e.target.value)} />
      </div>

      <div className="field">
        <label>Model</label>
        <input type="text" value={model} onChange={e => setModel(e.target.value)} />
      </div>

      <div className="field">
        <label>Source language</label>
        <input type="text" value={srcLang} onChange={e => setSrcLang(e.target.value)} />
      </div>

      <div className="field">
        <label>Target language</label>
        <input type="text" value={tgtLang} onChange={e => setTgtLang(e.target.value)} />
      </div>

      <div className="field">
        <label>
          Temperature
          <span className="field-value">{temperature}</span>
        </label>
        <input
          type="range" min="0" max="1" step="0.1"
          value={temperature}
          onChange={e => setTemperature(parseFloat(e.target.value))}
        />
      </div>

      <div className="field">
        <label>Chunk size (words)</label>
        <input
          type="number" min="100" max="1500"
          value={chunkSize}
          onChange={e => setChunkSize(parseInt(e.target.value))}
        />
      </div>

      <div className="field">
        <label>System prompt</label>
        <textarea
          rows="5"
          value={systemPrompt}
          onChange={e => setSystemPrompt(e.target.value)}
        />
      </div>
    </div>
  )
}

export default Settings