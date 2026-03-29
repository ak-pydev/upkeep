export const EMBEDDING_DIMENSION = 1536;
const embeddingCache = new Map<string, number[]>();

function normalize(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9\s-]/g, " ");
}

function tokenize(text: string) {
  return normalize(text)
    .split(/\s+/)
    .map((token) => token.trim())
    .filter((token) => token.length > 1);
}

function hashToken(token: string, seed: number) {
  let hash = 2166136261 ^ seed;
  for (let index = 0; index < token.length; index += 1) {
    hash ^= token.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return (hash >>> 0) % EMBEDDING_DIMENSION;
}

function buildNgrams(token: string) {
  if (token.length < 3) {
    return [token];
  }

  const grams: string[] = [];
  for (let index = 0; index <= token.length - 3; index += 1) {
    grams.push(token.slice(index, index + 3));
  }
  return grams;
}

function normalizeVector(vector: number[]) {
  const magnitude = Math.sqrt(vector.reduce((sum, value) => sum + value * value, 0));
  if (!Number.isFinite(magnitude) || magnitude === 0) {
    return vector;
  }

  return vector.map((value) => value / magnitude);
}

function cacheKey(text: string) {
  return normalize(text).slice(0, 6000);
}

export function embedText(text: string) {
  const key = cacheKey(text);
  const cached = embeddingCache.get(key);
  if (cached) {
    return cached;
  }

  const vector = new Array<number>(EMBEDDING_DIMENSION).fill(0);
  const tokens = tokenize(text);

  for (const token of tokens) {
    const primaryIndex = hashToken(token, 17);
    vector[primaryIndex] += 1.4;

    const grams = buildNgrams(token);
    for (const gram of grams) {
      vector[hashToken(gram, 31)] += 0.45;
    }

    if (/[0-9]/.test(token)) {
      vector[hashToken(token, 47)] += 1.2;
    }
  }

  const normalized = normalizeVector(vector);
  embeddingCache.set(key, normalized);
  return normalized;
}

export function cosineSimilarity(left: number[], right: number[]) {
  const length = Math.min(left.length, right.length);
  let score = 0;
  for (let index = 0; index < length; index += 1) {
    score += left[index] * right[index];
  }
  return score;
}

export function toPgvectorLiteral(vector: number[]) {
  return `[${vector.map((value) => Number(value.toFixed(8))).join(",")}]`;
}
