function ProgressPanel({ chunks, chunkStatuses, isRunning }) {
  //if (chunks.length === 0) return null

  const doneCount = chunkStatuses.filter(s => s === 'done').length
  const pct = Math.round((doneCount / chunks.length) * 100)

  return (
    <div className="panel">
      <p className="panel-title">Progress</p>

      <div className="progress-header">
        <span className="progress-status">
          {!isRunning && chunks.length === 0 ? (<p> No translation in progress </p>) : (
            isRunning ? `Translating chunk ${doneCount + 1} of ${chunks.length}…` : `Done — ${doneCount} of ${chunks.length} chunks`
          )}
        </span>
        <span className="progress-pct">{isRunning && chunks.length > 0 ? `${pct}%` : null}</span>
      </div>

      <div className="progress-track">
        {isRunning && chunks.length > 0 && (
          <div className="progress-fill" style={{ width: pct + '%' }} />
        )}
      </div>

      <div className="chunk-list">
        {chunks.map((chunk, i) => (
          <div key={i} className={`chunk-row chunk-row--${chunkStatuses[i]}`}>
            <span className="chunk-num">{i + 1}</span>
            <span className="chunk-preview">
              {chunk.slice(0, 60).replace(/\n/g, ' ')}…
            </span>
            <span className="chunk-status">
              {chunkStatuses[i] === 'done' && '✓'}
              {chunkStatuses[i] === 'running' && '…'}
              {chunkStatuses[i] === 'pending' && '–'}
              {chunkStatuses[i] === 'error' && '✗'}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ProgressPanel