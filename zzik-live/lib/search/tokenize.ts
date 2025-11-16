/**
 * Search Tokenization
 * 
 * Handles Korean (Hangul jamo decomposition) and English (2-gram) tokenization
 * for place search with typo tolerance.
 * 
 * Phase 6: Place Search 1.0
 */

/**
 * Korean Jamo constants
 * Unicode ranges: 초성(Choseong), 중성(Jungseong), 종성(Jongseong)
 */
const CHOSEONG_BASE = 0x1100;
const JUNGSEONG_BASE = 0x1161;
const JONGSEONG_BASE = 0x11A7;
const HANGUL_BASE = 0xAC00;

const CHOSEONG = [
  'ㄱ', 'ㄲ', 'ㄴ', 'ㄷ', 'ㄸ', 'ㄹ', 'ㅁ', 'ㅂ', 'ㅃ', 'ㅅ',
  'ㅆ', 'ㅇ', 'ㅈ', 'ㅉ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ'
];

const JUNGSEONG = [
  'ㅏ', 'ㅐ', 'ㅑ', 'ㅒ', 'ㅓ', 'ㅔ', 'ㅕ', 'ㅖ', 'ㅗ', 'ㅘ',
  'ㅙ', 'ㅚ', 'ㅛ', 'ㅜ', 'ㅝ', 'ㅞ', 'ㅟ', 'ㅠ', 'ㅡ', 'ㅢ', 'ㅣ'
];

const JONGSEONG = [
  '', 'ㄱ', 'ㄲ', 'ㄳ', 'ㄴ', 'ㄵ', 'ㄶ', 'ㄷ', 'ㄹ', 'ㄺ',
  'ㄻ', 'ㄼ', 'ㄽ', 'ㄾ', 'ㄿ', 'ㅀ', 'ㅁ', 'ㅂ', 'ㅄ', 'ㅅ',
  'ㅆ', 'ㅇ', 'ㅈ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ'
];

/**
 * Decompose Korean character into jamo components
 * 
 * @example
 * decomposeKorean('가') // ['ㄱ', 'ㅏ', '']
 * decomposeKorean('갈') // ['ㄱ', 'ㅏ', 'ㄹ']
 * decomposeKorean('A') // ['A'] (non-Korean passthrough)
 */
export function decomposeKorean(char: string): string[] {
  const code = char.charCodeAt(0);
  
  // Check if character is in Hangul syllable range
  if (code < HANGUL_BASE || code > 0xD7A3) {
    return [char]; // Non-Korean character, return as-is
  }
  
  const syllableIndex = code - HANGUL_BASE;
  const choseongIndex = Math.floor(syllableIndex / 588);
  const jungseongIndex = Math.floor((syllableIndex % 588) / 28);
  const jongseongIndex = syllableIndex % 28;
  
  return [
    CHOSEONG[choseongIndex],
    JUNGSEONG[jungseongIndex],
    JONGSEONG[jongseongIndex]
  ].filter(j => j !== ''); // Remove empty jongseong
}

/**
 * Generate 2-grams from a string
 * Used for English fuzzy matching and typo tolerance
 * 
 * @example
 * generateBigrams('cafe') // ['ca', 'af', 'fe']
 * generateBigrams('한글') // ['한글']
 */
export function generateBigrams(text: string): string[] {
  if (text.length < 2) {
    return [text];
  }
  
  const bigrams: string[] = [];
  for (let i = 0; i < text.length - 1; i++) {
    bigrams.push(text.substring(i, i + 2));
  }
  
  return bigrams;
}

/**
 * Detect language of text (Korean, English, Mixed, Number)
 */
export function detectLanguage(text: string): 'ko' | 'en' | 'mixed' | 'number' {
  const hasKorean = /[\u3131-\u314e\u314f-\u3163\uac00-\ud7a3]/u.test(text);
  const hasEnglish = /[a-zA-Z]/u.test(text);
  const hasNumber = /[0-9]/u.test(text);
  
  if (hasNumber && !hasKorean && !hasEnglish) {
    return 'number';
  }
  
  if (hasKorean && hasEnglish) {
    return 'mixed';
  }
  
  if (hasKorean) {
    return 'ko';
  }
  
  return 'en';
}

/**
 * Tokenization options
 */
export interface TokenizeOptions {
  /**
   * Generate bigrams for English text (default: true)
   */
  bigrams?: boolean;
  
  /**
   * Decompose Korean characters into jamo (default: true)
   */
  decomposeKorean?: boolean;
  
  /**
   * Minimum token length to keep (default: 1)
   */
  minLength?: number;
  
  /**
   * Maximum token length (default: 50)
   */
  maxLength?: number;
}

/**
 * Token with metadata
 */
export interface Token {
  /**
   * Original text
   */
  text: string;
  
  /**
   * Normalized form
   */
  normalized: string;
  
  /**
   * Token type
   */
  type: 'word' | 'bigram' | 'jamo' | 'number';
  
  /**
   * Language
   */
  lang: 'ko' | 'en' | 'mixed' | 'number';
  
  /**
   * Position in original text
   */
  position: number;
}

/**
 * Tokenize text into searchable tokens
 * 
 * Handles:
 * - Korean: Jamo decomposition for typo tolerance
 * - English: 2-grams for fuzzy matching
 * - Mixed: Both strategies
 * - Numbers: Preserved as-is
 * 
 * @example
 * tokenize('커피바K')
 * // [
 * //   { text: '커피바K', normalized: '커피바k', type: 'word', lang: 'mixed', position: 0 },
 * //   { text: 'ㅋㅓㅍㅣㅂㅏk', normalized: 'ㅋㅓㅍㅣㅂㅏk', type: 'jamo', lang: 'ko', position: 0 }
 * // ]
 */
export function tokenize(text: string, options: TokenizeOptions = {}): Token[] {
  const {
    bigrams = true,
    decomposeKorean: decomposeKo = true,
    minLength = 1,
    maxLength = 50,
  } = options;
  
  if (!text || text.length === 0) {
    return [];
  }
  
  // Normalize: lowercase, trim
  const normalized = text.toLowerCase().trim();
  
  if (normalized.length < minLength || normalized.length > maxLength) {
    return [];
  }
  
  const tokens: Token[] = [];
  const lang = detectLanguage(normalized);
  
  // Always add the full word token
  tokens.push({
    text,
    normalized,
    type: 'word',
    lang,
    position: 0,
  });
  
  // Korean: Add jamo decomposition
  if (decomposeKo && (lang === 'ko' || lang === 'mixed')) {
    const jamos: string[] = [];
    for (const char of normalized) {
      const decomposed = decomposeKorean(char);
      jamos.push(...decomposed);
    }
    
    if (jamos.length > 0) {
      tokens.push({
        text: jamos.join(''),
        normalized: jamos.join(''),
        type: 'jamo',
        lang: 'ko',
        position: 0,
      });
    }
  }
  
  // English: Add bigrams
  if (bigrams && (lang === 'en' || lang === 'mixed')) {
    const englishOnly = normalized.replace(/[^a-z0-9]/g, '');
    if (englishOnly.length >= 2) {
      const bigs = generateBigrams(englishOnly);
      bigs.forEach((bigram, idx) => {
        tokens.push({
          text: bigram,
          normalized: bigram,
          type: 'bigram',
          lang: 'en',
          position: idx,
        });
      });
    }
  }
  
  return tokens;
}

/**
 * Tokenize query with multiple strategies
 * Returns all possible token variants for matching
 * 
 * @example
 * tokenizeQuery('까페') // Full word + jamo variants for typo tolerance
 * tokenizeQuery('cafe') // Full word + 2-grams for fuzzy matching
 */
export function tokenizeQuery(query: string, options?: TokenizeOptions): Token[] {
  // Split by spaces for multi-word queries
  const words = query.trim().split(/\s+/);
  
  const allTokens: Token[] = [];
  let position = 0;
  
  for (const word of words) {
    const tokens = tokenize(word, options);
    
    // Adjust positions for multi-word queries
    tokens.forEach(token => {
      allTokens.push({
        ...token,
        position: position + token.position,
      });
    });
    
    position += word.length + 1; // +1 for space
  }
  
  return allTokens;
}

/**
 * Calculate similarity between two strings using Levenshtein distance
 * Used for typo tolerance (distance ≤ 2)
 * 
 * @returns Similarity score (0-1, 1 = identical)
 */
export function calculateSimilarity(str1: string, str2: string): number {
  const m = str1.length;
  const n = str2.length;
  
  if (m === 0) return n === 0 ? 1 : 0;
  if (n === 0) return 0;
  
  // Create distance matrix
  const dp: number[][] = Array(m + 1).fill(null).map(() => Array(n + 1).fill(0));
  
  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;
  
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const cost = str1[i - 1] === str2[j - 1] ? 0 : 1;
      dp[i][j] = Math.min(
        dp[i - 1][j] + 1,      // Deletion
        dp[i][j - 1] + 1,      // Insertion
        dp[i - 1][j - 1] + cost // Substitution
      );
    }
  }
  
  const distance = dp[m][n];
  const maxLength = Math.max(m, n);
  
  return 1 - (distance / maxLength);
}

/**
 * Check if query matches place name with typo tolerance (≤2 characters)
 */
export function matchesWithTypo(query: string, placeName: string, maxDistance: number = 2): boolean {
  const q = query.toLowerCase();
  const p = placeName.toLowerCase();
  
  // Exact match
  if (q === p || p.includes(q)) {
    return true;
  }
  
  // Jamo-level matching for Korean
  const qTokens = tokenize(q);
  const pTokens = tokenize(p);
  
  for (const qt of qTokens) {
    for (const pt of pTokens) {
      if (qt.type === 'jamo' && pt.type === 'jamo') {
        const similarity = calculateSimilarity(qt.normalized, pt.normalized);
        const distance = Math.round((1 - similarity) * Math.max(qt.normalized.length, pt.normalized.length));
        
        if (distance <= maxDistance) {
          return true;
        }
      }
    }
  }
  
  return false;
}
