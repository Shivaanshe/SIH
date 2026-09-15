import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf.mjs';

// Configure worker for browser environment
if (typeof window !== 'undefined' && pdfjsLib?.GlobalWorkerOptions) {
  try {
    // In Vite, new URL(..., import.meta.url).href generates the correct bundled asset URL
    pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
      'pdfjs-dist/legacy/build/pdf.worker.mjs',
      import.meta.url
    ).href;
  } catch (e) {
    console.warn('Could not set workerSrc via URL, falling back to embedded worker mode:', e);
  }
}

/**
 * Extracts all plain text from a PDF file using client-side PDF.js.
 * @param {File|Blob|ArrayBuffer} fileInput 
 * @returns {Promise<string>} Clean, extracted multi-line text
 */
export async function extractTextFromPdf(fileInput) {
  try {
    let arrayBuffer;
    if (fileInput instanceof ArrayBuffer) {
      arrayBuffer = fileInput;
    } else if (fileInput && typeof fileInput.arrayBuffer === 'function') {
      arrayBuffer = await fileInput.arrayBuffer();
    } else {
      throw new Error('Invalid file input provided for PDF extraction.');
    }

    const uint8Data = new Uint8Array(arrayBuffer);
    const loadingTask = pdfjsLib.getDocument({
      data: uint8Data,
      useSystemFonts: true,
      disableFontFace: true
    });

    const pdfDoc = await loadingTask.promise;
    const numPages = pdfDoc.numPages;
    const extractedPages = [];

    for (let pageNum = 1; pageNum <= numPages; pageNum++) {
      const page = await pdfDoc.getPage(pageNum);
      const textContent = await page.getTextContent();
      
      const pageStrings = [];
      let lastY = null;

      for (const item of textContent.items) {
        if (!item || !item.str) continue;
        
        // Detect line breaks based on Y coordinate
        if (lastY !== null && Math.abs(item.transform[5] - lastY) > 6) {
          pageStrings.push('\n');
        } else if (pageStrings.length > 0 && !pageStrings[pageStrings.length - 1].endsWith(' ')) {
          pageStrings.push(' ');
        }

        pageStrings.push(item.str);
        lastY = item.transform[5];
      }

      const pageText = pageStrings.join('').replace(/ {2,}/g, ' ').trim();
      if (pageText) {
        extractedPages.push(pageText);
      }
    }

    const fullText = extractedPages.join('\n\n');
    
    // Fallback: If text was empty (e.g. scanned image or non-standard encoding)
    if (!fullText || fullText.trim().length === 0) {
      return fallbackAsciiExtraction(uint8Data);
    }

    return fullText;
  } catch (err) {
    console.error('PDF.js client extraction error:', err);
    // If PDF.js encounters an issue, try binary ASCII stream extraction
    if (fileInput && typeof fileInput.arrayBuffer === 'function') {
      try {
        const ab = await fileInput.arrayBuffer();
        return fallbackAsciiExtraction(new Uint8Array(ab));
      } catch (fallbackErr) {
        console.error('Fallback extraction error:', fallbackErr);
      }
    }
    throw err;
  }
}

/**
 * Intelligent ASCII token extractor for emergency recovery of text strings from streams
 */
function fallbackAsciiExtraction(uint8Array) {
  let text = '';
  let currentWord = '';
  for (let i = 0; i < uint8Array.length; i++) {
    const code = uint8Array[i];
    if ((code >= 32 && code <= 126) || code === 10 || code === 13) {
      currentWord += String.fromCharCode(code);
    } else {
      if (currentWord.length > 3) {
        text += currentWord + ' ';
      }
      currentWord = '';
    }
  }
  if (currentWord.length > 3) text += currentWord;
  return text
    .replace(/obj|endobj|stream|endstream|xref|trailer|startxref/gi, ' ')
    .replace(/<<.*?>>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}
