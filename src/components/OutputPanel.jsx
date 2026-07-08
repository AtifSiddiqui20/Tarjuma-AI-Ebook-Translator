import { buildAndDownloadEpub } from "../utils/epubExporter";

function OutputPanel({
  output,
  fileName,
  fileType,
  bookMeta,
  chapters,
  chapterMap,
}) {
  const fullText = output.join("\n\n");

  async function handleDownload() {
    if (fileType === "epub" && bookMeta && chapters.length > 0) {
      const chapterTexts = {};
      chapterMap.forEach((entry, i) => {
        if (!chapterTexts[entry.chapterIndex]) {
          chapterTexts[entry.chapterIndex] = { title: entry.title, parts: [] };
        }
        chapterTexts[entry.chapterIndex].parts.push(output[i] || "");
      });

      const translatedChapters = Object.values(chapterTexts).map((ch) => ({
        title: ch.title,
        translatedText: ch.parts.join("\n\n"),
      }));

      await buildAndDownloadEpub(
        bookMeta.title,
        bookMeta.author,
        translatedChapters,
        `translated_${fileName.replace(".epub", "")}.epub`,
      );
    } else {
      const blob = new Blob([output.join("\n\n")], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = fileName ? `translated_${fileName}` : "translation.txt";
      a.click();
      URL.revokeObjectURL(url);
    }
  }

  //if (output.length === 0) return null

  return (
    <div className="panel">
      <div className="output-header">
        <p className="panel-title" style={{ margin: 0 }}>
          Output
        </p>
        <div className="output-actions">
          <button
            className="btn-sm"
            onClick={() => navigator.clipboard.writeText(fullText)}
          >
            Copy
          </button>
          <button className="btn-sm" onClick={handleDownload}>
            Download {fileType === "epub" ? ".epub" : ".txt"}
          </button>
        </div>
      </div>
      <div className="output-text">
        {fullText || "Translation will appear here…"}
      </div>
    </div>
  );
}

export default OutputPanel;
