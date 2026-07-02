const pdfParse = require('pdf-parse');

async function parseResume(fileBuffer, mimetype) {
  if (mimetype === 'application/pdf') {
    const data = await pdfParse(fileBuffer);
    return data.text;
  }
  // For .txt, .doc, .docx — return raw buffer as string
  return fileBuffe **...**

_This response is too long to display in full._
