import Settings from './components/Settings'
import FileUpload from './components/FileUpload'
import ProgressPanel from './components/ProgressPanel'
import OutputPanel from './components/OutputPanel'
import './App.css'

function App() {
  return (
      <div className = "app">
          <header className= "topBar">
            <div>
                <h1 className ="app-title">Tarjuuma al Kitaab</h1>
                <p className="app-subtitle">Local AI translation tool - powered by Ollama</p>
            </div>
              <span className={"model-badge"}>Model: <strong>llama2-7b-chat</strong></span>
          </header>
        <div className = "layout">
            <aside className = "sidebar">
                <Settings />
                <FileUpload />
            </aside>
            <main className = "main-content">
                <ProgressPanel />
                <OutputPanel />
            </main>


        </div>
      </div>
  )
}

export default App
