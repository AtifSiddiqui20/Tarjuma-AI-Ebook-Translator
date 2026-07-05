


import { useState, useRef } from 'react'
import './App.css'
import Settings from './components/Settings'
import FileUpload from './components/FileUpload'
import ProgressPanel from './components/ProgressPanel'
import OutputPanel from './components/OutputPanel'
import { chunkText } from './utils/chunker'
import { translateChunk, streamResponse } from './utils/ollamaApi'

function App() {
  const [ollamaUrl, setOllamaUrl] = useState('http://localhost:11434')
  const [model, setModel] = useState('translategemma:12b')
  const [srcLang, setSrcLang] = useState('English')
  const [tgtLang, setTgtLang] = useState('Urdu')
  const [temperature, setTemperature] = useState(0.2)
  const [chunkSize, setChunkSize] = useState(600)
  const [systemPrompt, setSystemPrompt] = useState('You are a professional English to Urdu literary translator with expertise in translating books, novels, and long-form prose. Your goal is accuracy, naturalness, and preserving the author\'s voice and tone. Output only the translated text, nothing else.')

  const [fileText, setFileText] = useState(null)
  const [fileName, setFileName] = useState(null)
  const [fileSize, setFileSize] = useState(null)

  const [chunks, setChunks] = useState([])
  const [chunkStatuses, setChunkStatuses] = useState([])
  const [output, setOutput] = useState([])
  const [isRunning, setIsRunning] = useState(false)
  const stopFlag = useRef(false)

  function handleFileLoaded(name, text, size) {
    setFileName(name)
    setFileSize(size)
    setFileText(text)
    const newChunks = chunkText(text, chunkSize)
    setChunks(newChunks)
    setChunkStatuses(new Array(newChunks.length).fill('pending'))
    setOutput(new Array(newChunks.length).fill(''))
  }

  async function handleTranslate() {
  if (!fileText || isRunning) return
  setIsRunning(true)
  stopFlag.current = false        // ← .current instead of setStopFlag

  const newChunks = chunkText(fileText, chunkSize)
  setChunks(newChunks)
  const statuses = new Array(newChunks.length).fill('pending')
  const outputs = new Array(newChunks.length).fill('')
  setChunkStatuses([...statuses])
  setOutput([...outputs])

  for (let i = 0; i < newChunks.length; i++) {
    if (stopFlag.current) break    // ← .current instead of stopFlag

    statuses[i] = 'running'
    setChunkStatuses([...statuses])

    try {
      const response = await translateChunk(
        ollamaUrl, model, systemPrompt, newChunks[i], temperature
      )
      await streamResponse(response, (text) => {
        outputs[i] = text
        setOutput([...outputs])
      })
      statuses[i] = 'done'
    } catch (err) {
      statuses[i] = 'error'
      outputs[i] = `[Error: ${err.message}]`
    }

    setChunkStatuses([...statuses])
    setOutput([...outputs])
  }

  setIsRunning(false)
}

  function handleStop() {
  stopFlag.current = true     
  setIsRunning(false)
}

  return (
    <div className="app">
      <header className="topbar">
        <div>
          <h1 className="app-title"> Tarjuma</h1>
          <p className="app-sub">Local AI translation — powered by Ollama</p>
        </div>
        <span className="model-badge">{model}</span>
      </header>

      <div className="layout">
        <aside className="sidebar">
          <Settings
            ollamaUrl={ollamaUrl} setOllamaUrl={setOllamaUrl}
            model={model} setModel={setModel}
            srcLang={srcLang} setSrcLang={setSrcLang}
            tgtLang={tgtLang} setTgtLang={setTgtLang}
            temperature={temperature} setTemperature={setTemperature}
            chunkSize={chunkSize} setChunkSize={setChunkSize}
            systemPrompt={systemPrompt} setSystemPrompt={setSystemPrompt}
          />
          <FileUpload
            fileName={fileName}
            fileSize={fileSize}
            fileText={fileText}
            chunkSize={chunkSize}
            isRunning={isRunning}
            onFileLoaded={handleFileLoaded}
            onTranslate={handleTranslate}
            onStop={handleStop}
            chunks={chunks}
          />
        </aside>

        <main className="main">
          <ProgressPanel
            chunks={chunks}
            chunkStatuses={chunkStatuses}
            isRunning={isRunning}
          />
          <OutputPanel
            output={output}
            fileName={fileName}
          />
        </main>
      </div>
    </div>
  )
}

export default App