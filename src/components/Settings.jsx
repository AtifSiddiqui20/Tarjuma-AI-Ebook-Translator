import languages from '../data/languages.json'


function Settings({ 
  ollamaUrl, setOllamaUrl,
  model, setModel, models,
  modelsLoading, modelsError,
  srcLang, setSrcLang,
  tgtLang, setTgtLang,
  temperature, setTemperature,
  chunkSize, setChunkSize, systemPrompt
}) {
  return (
    <div className="panel">
      <p className="panel-title">Settings</p>

      <div className="field">
        <label>Ollama URL</label>
        <input
          type="text"
          value={ollamaUrl}
          onChange={e => setOllamaUrl(e.target.value)}
        />
      </div>

      <div className="field">
        <label>Model</label>
        {modelsError ? (
          <div className="models-error">{modelsError}</div>
        ) : (
          <select
            value={model}
            onChange={e => setModel(e.target.value)}
            disabled={modelsLoading}
          >
            {modelsLoading && (
              <option>Loading models…</option>
            )}
            {models.map(m => (
              <option key={m.name} value={m.name}>{m.name}</option>
            ))}
          </select>
        )}
      </div>

      <div className="field">
        <label>Source language</label>
        <select 
          value={srcLang.code} 
          onChange={e => {
            const selected = languages.find(
              lang => lang.code === e.target.value
            );
            setSrcLang(selected);
          }}
      >
          {languages.map(lang => (
            <option key={lang.code} value={lang.code}>
              {lang.name}
            </option>
          ))}
        </select>
      </div>

      <div className="field">
        <label>Target language</label>
        <select 
          value={tgtLang.code} 
          onChange={e => {
            const selected = languages.find(
              lang => lang.code === e.target.value
            );
            setTgtLang(selected);
          }}
        >
          {languages.map(lang => (
            <option key={lang.code} value={lang.code}>
              {lang.name}
            </option>
          ))}
        </select>
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
          onChange={e => {}}
          //readOnly
        />
      </div>
    </div>
  )
}

export default Settings