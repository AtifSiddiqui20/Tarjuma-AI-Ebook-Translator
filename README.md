# Tarjuma
> A local AI ebook translation tool built with React and Ollama


---


![Demo](images\Demo.gif)
## What is it?
Tarjuma translates `.txt` and `.epub` files between languages using a locally 
running AI model via Ollama. No data leaves your machine.

It automatically chunks files into appropriately sized pieces for the model, 
translates them sequentially, and outputs either a `.txt` file or a structured 
`.epub` with chapter titles and table of contents preserved.

Any model available in Ollama can be used — not just TranslateGemma.

---

## Requirements
- [Ollama](https://ollama.com) installed and running
- A translation model pulled in Ollama (I recommend: `translategemma:12b`)
- Node.js v20 or higher
- A modern browser (Chrome, Firefox, Edge)

---

## Setup

**1. Install and start Ollama with CORS enabled**
```bash
# Windows (PowerShell)
$env:OLLAMA_ORIGINS="*"; ollama serve

# Mac/Linux
OLLAMA_ORIGINS="*" ollama serve
```

You can also use the desktop app of Ollama. Simply open the app, head to settings, and enable the option 'Expose Ollama on the Network'
![Alternative description text](images\OllamaCORS.PNG)

**2. Pull a translation model**
```bash
ollama pull translategemma:12b
```


**3. Clone and run Tarjuma**
```bash
git clone https://github.com/AtifSiddiqui20/Tarjuma-AI-Ebook-Translator
cd tarjuma
npm install
npm run dev
```

**4. Open your browser to `http://localhost:5173`**

---

## How to use
1. Configure your Ollama URL, model, source and target languages in the settings panel
2. Upload a `.txt` or `.epub` file
3. Click Translate and wait for the progress bar to complete
4. Click Download to save the translated `.epub` or `.txt` !
5. (For advanced users) To change the prompt, simply open utils/buildPrompt.js and edit the prompt there. 

---

## Current Limitations
- Only `.txt` and `.epub` input formats are supported (PDF on the roadmap)
- Images in EPUB files are not carried over to the output
- Hyperlinks in EPUB files are not preserved
- Chapter detection accuracy depends on how well-structured the source EPUB is
- Translation quality depends on the model used and the language pair

---

## Recommended Models
| Model | Size | Best for |
|---|---|---|
| `translategemma:12b` | ~8GB VRAM | Best translation quality, purpose-built |
| `translategemma:4b` | Low VRAM | For lower spec'd machines
| `qwen3:8b` | ~6GB VRAM | Good multilingual alternative |


---

## Roadmap
- [ ] PDF input support
- [ ] Image preservation in EPUB output
- [ ] Translation memory (avoid re-translating unchanged chunks)
- [ ] Batch file processing

## License
MIT © Atif