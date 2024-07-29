import fs from 'fs';
import pdf from 'pdf-parse';
//this extracts text from pdf
export async function extractTextFromFile(filePath: string): Promise<string> {
  return new Promise((resolve, reject) => {
    // Read the file
    fs.readFile(filePath, (err, buffer) => {
      if (err) {
        reject(new Error(`Error reading file: ${err.message}`));
        return;
      }

      // Parse the PDF
      pdf(buffer).then((data: { text: string | PromiseLike<string>; }) => {
        // Resolve with the extracted text
        resolve(data.text);
      }).catch((error: { message: any; }) => {
        reject(new Error(`Error parsing PDF: ${error.message}`));
      });
    });
  });
}