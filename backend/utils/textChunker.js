/**
 * Split text into chunks for better AI processing
 */

export const chunkText = (text, chunkSize = 500, overlap = 50) => {
  if (!text || text.trim().length === 0) {
    return [];
  }

  // Clean text while preserving paragraph structure
  const cleanedText = text
    .replace(/\r\n/g, "\n")
    .replace(/[ \t]+/g, " ")
    .trim();

  // Split by paragraphs
  const paragraphs = cleanedText
    .split(/\n+/)
    .filter((p) => p.trim().length > 0);

  const chunks = [];
  let currentChunk = [];
  let currentWordCount = 0;
  let chunkIndex = 0;

  for (const paragraph of paragraphs) {
    const paragraphWords = paragraph.trim().split(/\s+/);
    const paragraphWordCount = paragraphWords.length;

    // If single paragraph exceeds chunk size
    if (paragraphWordCount > chunkSize) {
      for (let i = 0; i < paragraphWords.length; i += chunkSize - overlap) {
        const chunkWords = paragraphWords.slice(i, i + chunkSize);

        chunks.push({
          content: chunkWords.join(" "),
          chunkIndex: chunkIndex++,
          pageNumber: 0,
        });

        if (i + chunkSize >= paragraphWords.length) break;
      }

      continue;
    }

    // If adding paragraph exceeds chunk size
    if (
      currentWordCount + paragraphWordCount > chunkSize &&
      currentChunk.length > 0
    ) {
      chunks.push({
        content: currentChunk.join("\n\n"),
        chunkIndex: chunkIndex++,
        pageNumber: 0,
      });

      // Create overlap from previous chunk
      const prevChunkText = currentChunk.join(" ");
      const prevWords = prevChunkText.split(/\s+/);
      const overlapText = prevWords
        .slice(-Math.min(overlap, prevWords.length))
        .join(" ");

      currentChunk = [overlapText, paragraph.trim()];
      currentWordCount =
        overlapText.split(/\s+/).length + paragraphWordCount;
    } else {
      currentChunk.push(paragraph.trim());
      currentWordCount += paragraphWordCount;
    }
  }

  // Add last chunk
  if (currentChunk.length > 0) {
    chunks.push({
      content: currentChunk.join("\n\n"),
      chunkIndex: chunkIndex,
      pageNumber: 0,
    });
  }

  // Fallback if no chunks created
  if (chunks.length === 0 && cleanedText.length > 0) {
    const allWords = cleanedText.split(/\s+/);
    for (let i = 0; i < allWords.length; i += chunkSize - overlap) {
      const chunkWords = allWords.slice(i, i + chunkSize);

      chunks.push({
        content: chunkWords.join(" "),
        chunkIndex: chunkIndex++,
        pageNumber: 0,
      });

      if (i + chunkSize >= allWords.length) break;
    }
  }

  return chunks;
};

/**
 * Find relevant chunks based on keyword matching
 */

export const findRelevantChunks = (
  chunks,
  query,
  maxChunks = 3
) => {
  if (!chunks || chunks.length === 0 || !query) {
    return [];
  }

  const normalizeText = (value = "") =>
    value
      .toLowerCase()
      .replace(/[^\p{L}\p{N}\s]/gu, " ")
      .replace(/\s+/g, " ")
      .trim();

  const stopWords = new Set([
    "the","is","at","which","on","a","an",
    "and","or","but","in","with","to",
    "for","as","by","this","that","it"
  ]);

  const normalizedQuery = normalizeText(query);
  const queryWords = normalizedQuery
    .split(/\s+/)
    .filter((w) => w.length > 2 && !stopWords.has(w));

  if (queryWords.length === 0) {
    return chunks.slice(0, maxChunks);
  }

  const scoredChunks = chunks.map((chunk, index) => {
    const rawContent = chunk.content || "";
    const content = normalizeText(rawContent);
    const contentWords = content.split(/\s+/).length;

    let score = 0;
    let uniqueWordsFound = 0;

    if (normalizedQuery && content.includes(normalizedQuery)) {
      score += normalizedQuery.split(/\s+/).length * 5;
      uniqueWordsFound += 1;
    }

    for (const word of queryWords) {
      const exactRegex = new RegExp(`\\b${word}\\b`, "g");
      const exactMatches = (content.match(exactRegex) || []).length;

      if (exactMatches > 0) uniqueWordsFound++;

      score += exactMatches * 3;

      const partialMatches =
        (content.match(new RegExp(word, "g")) || []).length;

      score += Math.max(0, partialMatches - exactMatches) * 1.5;
    }

    if (uniqueWordsFound > 1) {
      score += uniqueWordsFound * 2;
    }

    const normalizedScore = score / Math.sqrt(contentWords);

    const positionBonus =
      1 - (index / chunks.length) * 0.1;

    return {
      content: rawContent,
      chunkIndex: chunk.chunkIndex,
      pageNumber: chunk.pageNumber,
      score: normalizedScore * positionBonus,
      matchedWords: uniqueWordsFound,
    };
  });

  return scoredChunks
    .filter((chunk) => chunk.score > 0)
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      if (b.matchedWords !== a.matchedWords)
        return b.matchedWords - a.matchedWords;
      return a.chunkIndex - b.chunkIndex;
    })
    .slice(0, maxChunks);
};
