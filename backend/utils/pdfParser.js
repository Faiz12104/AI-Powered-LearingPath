import fs from "fs/promises";
import pdf from "pdf-parse-debugging-disabled";

export const extractTextFromPDF = async (filePath) => {
  try {
    const dataBuffer = await fs.readFile(filePath);
    const data = await pdf(dataBuffer);

    return data.text; // 🔥 ONLY TEXT RETURN
  } catch (error) {
    console.error("PDF parsing error:", error);
    throw error;
  }
};