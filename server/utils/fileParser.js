const mammoth = require('mammoth');
const pdfParse = require('pdf-parse');

async function extractText(buffer, filename) {
  const lower = filename.toLowerCase();
  if (lower.endsWith('.docx')) {
    const result = await mammoth.extractRawText({ buffer });
    return result.value;
  }
  if (lower.endsWith('.pdf')) {
    const result = await pdfParse(buffer);
    return result.text;
  }
  throw new Error('Formato no soportado. Usa archivos .docx o .pdf');
}

module.exports = { extractText };
