import { useState, useRef, useEffect } from "react";
import "./App.css";
import Settings from "./components/Settings";
import FileUpload from "./components/FileUpload";
import ProgressPanel from "./components/ProgressPanel";
import OutputPanel from "./components/OutputPanel";
import { chunkText } from "./utils/chunker";
import { buildPrompt } from "./utils/buildPrompt";
import { getModels, translateChunk, streamResponse } from "./utils/ollamaApi";

function App() {
  const [ollamaUrl, setOllamaUrl] = useState("http://localhost:11434");
  const [model, setModel] = useState("translategemma:12b");
  const [srcLang, setSrcLang] = useState({ name: "English", code: "en" });
  const [tgtLang, setTgtLang] = useState({ name: "Urdu", code: "ur" });
  const [temperature, setTemperature] = useState(0.2);
  const [chunkSize, setChunkSize] = useState(1000);
  const [chapterMap, setChapterMap] = useState({});
  const systemPrompt = buildPrompt({
    srcLang: srcLang.name,
    srcCode: srcLang.code,
    tgtLang: tgtLang.name,
    tgtCode: tgtLang.code,
  });

  const [fileText, setFileText] = useState(null);
  const [fileName, setFileName] = useState(null);
  const [fileSize, setFileSize] = useState(null);

  const [chunks, setChunks] = useState([]);
  const [chunkStatuses, setChunkStatuses] = useState([]);
  const [output, setOutput] = useState([]);
  const [isRunning, setIsRunning] = useState(false);
  const stopFlag = useRef(false);
  const [models, setModels] = useState([]);
  const [modelsLoading, setModelsLoading] = useState(false);
  const [modelsError, setModelsError] = useState(null);

  const [languages, setLanguages] = useState([]);
  const [bookMeta, setBookMeta] = useState(null);
  const [fileType, setFileType] = useState(null);
  const [chapters, setChapters] = useState([]);

  useEffect(() => {
    setLanguages(languages);
  }, []);

  useEffect(() => {
    async function fetchModels() {
      setModelsLoading(true);
      setModelsError(null);
      try {
        const result = await getModels(ollamaUrl);
        setModels(result);
      } catch (err) {
        setModelsError("Could not reach Ollama — is it running?");
        setModels([]);
      }
      setModelsLoading(false);
    }
    fetchModels();
  }, [ollamaUrl]);

  function handleFileLoaded(name, text, size, type, parsedEpub) {
    setFileName(name);
    setFileSize(size);
    setFileText(text);
    setFileType(type);

    if (type === "txt") {
      const newChunks = chunkText(text, chunkSize);
      setChunks(newChunks);
      setChunkStatuses(new Array(newChunks.length).fill("pending"));
      setOutput(new Array(newChunks.length).fill(""));
      setChapters([]);
      setBookMeta(null);
    } else if (type === "epub") {
      setBookMeta({ title: parsedEpub.title, author: parsedEpub.author });
      setChapters(parsedEpub.chapters);

      const allChunks = [];
      const map = []; // each entry: { chapterIndex, title }

      for (let i = 0; i < parsedEpub.chapters.length; i++) {
        const chapter = parsedEpub.chapters[i];
        const chapterChunks = chunkText(chapter.text, chunkSize);
        for (let j = 0; j < chapterChunks.length; j++) {
          allChunks.push(chapterChunks[j]);
          map.push({ chapterIndex: i, title: chapter.title });
        }
      }

      setChunks(allChunks);
      setChapterMap(map);
      setChunkStatuses(new Array(allChunks.length).fill("pending"));
      setOutput(new Array(allChunks.length).fill(""));
      setFileText(null);
    }
  }

  async function handleTranslate() {
    if (chunks.length === 0 || isRunning) return;
    setIsRunning(true);
    stopFlag.current = false;

    const workingChunks =
      fileType === "epub" ? chunks : chunkText(fileText, chunkSize);

    if (fileType !== "epub") {
      setChunks(workingChunks);
    }

    const statuses = new Array(workingChunks.length).fill("pending");
    const outputs = new Array(workingChunks.length).fill("");
    setChunkStatuses([...statuses]);
    setOutput([...outputs]);

    for (let i = 0; i < workingChunks.length; i++) {
      if (stopFlag.current) break;

      statuses[i] = "running";
      setChunkStatuses([...statuses]);

      try {
        const response = await translateChunk(
          ollamaUrl,
          model,
          systemPrompt,
          workingChunks[i],
          temperature,
        );
        await streamResponse(response, (text) => {
          outputs[i] = text;
          setOutput([...outputs]);
        });
        statuses[i] = "done";
      } catch (err) {
        statuses[i] = "error";
        outputs[i] = `[Error: ${err.message}]`;
      }

      setChunkStatuses([...statuses]);
      setOutput([...outputs]);
    }

    setIsRunning(false);
  }

  function handleStop() {
    stopFlag.current = true;
    setIsRunning(false);
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
            ollamaUrl={ollamaUrl}
            setOllamaUrl={setOllamaUrl}
            model={model}
            setModel={setModel}
            models={models}
            modelsLoading={modelsLoading}
            modelsError={modelsError}
            srcLang={srcLang}
            setSrcLang={setSrcLang}
            tgtLang={tgtLang}
            setTgtLang={setTgtLang}
            temperature={temperature}
            setTemperature={setTemperature}
            chunkSize={chunkSize}
            setChunkSize={setChunkSize}
            systemPrompt={systemPrompt}
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
            fileType={fileType}
            bookMeta={bookMeta}
            chapters={chapters}
            chapterMap={chapterMap}
          />
        </main>
      </div>
    </div>
  );
}

export default App;
