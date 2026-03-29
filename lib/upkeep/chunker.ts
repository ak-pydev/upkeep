export function chunkText(text: string, maxChunkLength = 1200): string[] {
  const normalized = text.replace(/\r\n/g, "\n").trim();
  if (!normalized) {
    return [];
  }

  const paragraphs = normalized
    .split(/\n{2,}/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);

  const chunks: string[] = [];
  let current = "";

  for (const paragraph of paragraphs) {
    if (!current) {
      current = paragraph;
      continue;
    }

    if ((current.length + paragraph.length + 2) <= maxChunkLength) {
      current = `${current}\n\n${paragraph}`;
      continue;
    }

    chunks.push(current);
    current = paragraph;
  }

  if (current) {
    chunks.push(current);
  }

  if (chunks.length === 0) {
    const sentences = normalized.split(/(?<=[.!?])\s+/);
    let buffer = "";

    for (const sentence of sentences) {
      if (!buffer) {
        buffer = sentence;
        continue;
      }

      if (buffer.length + sentence.length + 1 <= maxChunkLength) {
        buffer = `${buffer} ${sentence}`;
        continue;
      }

      chunks.push(buffer);
      buffer = sentence;
    }

    if (buffer) {
      chunks.push(buffer);
    }
  }

  return chunks.length > 0 ? chunks : [normalized];
}

