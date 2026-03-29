import path from "node:path";
import { PDFParse } from "pdf-parse";

const MAX_SOURCE_TEXT_LENGTH = 200_000;
const pdfWorkerPath = path.join(
  process.cwd(),
  "node_modules",
  "pdf-parse",
  "dist",
  "pdf-parse",
  "cjs",
  "pdf.worker.mjs"
);

PDFParse.setWorker(pdfWorkerPath);

function normalizeExtractedText(value: string) {
  return value.replace(/\u0000/g, "").replace(/\r\n/g, "\n").trim().slice(0, MAX_SOURCE_TEXT_LENGTH);
}

function isPdfFile(file: File) {
  return file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");
}

function isTextFile(file: File) {
  if (file.type.startsWith("text/")) {
    return true;
  }

  return /\.(txt|md|csv|json|log)$/i.test(file.name);
}

export async function extractManualUpload(file: File) {
  if (isPdfFile(file)) {
    const parser = new PDFParse({ data: new Uint8Array(await file.arrayBuffer()) });

    try {
      const result = await parser.getText();
      return {
        sourceText: normalizeExtractedText(result.text),
        pages: result.total > 0 ? result.total : undefined
      };
    } finally {
      await parser.destroy().catch(() => undefined);
    }
  }

  if (isTextFile(file)) {
    return {
      sourceText: normalizeExtractedText(await file.text())
    };
  }

  throw new Error("Unsupported file type. Upload a PDF or a text-based file.");
}
