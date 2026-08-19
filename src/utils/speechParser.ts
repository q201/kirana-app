import type { Product } from '../types';
import { INITIAL_PRODUCTS } from '../data/mockData';

export interface ParsedItemResult {
  product: Product;
  quantity: number;
  extractedText: string;
  confidence: number;
  unitDetected?: string;
}

// Hindi & Hinglish number word mappings
const HINDI_NUMBER_MAP: Record<string, number> = {
  'ek': 1,
  'ekk': 1,
  'one': 1,
  'do': 2,
  'doo': 2,
  'two': 2,
  'teen': 3,
  'tin': 3,
  'three': 3,
  'chaar': 4,
  'char': 4,
  'four': 4,
  'paanch': 5,
  'panch': 5,
  'five': 5,
  'chhe': 6,
  'che': 6,
  'six': 6,
  'saat': 7,
  'sat': 7,
  'seven': 7,
  'aath': 8,
  'ath': 8,
  'eight': 8,
  'nau': 9,
  'nine': 9,
  'das': 10,
  'ten': 10,
  'gyarah': 11,
  'barah': 12,
  'pandrah': 15,
  'bees': 20,
  'twenty': 20,
  'aadha': 0.5,
  'half': 0.5,
  'dhed': 1.5,
  'dhai': 2.5
};

export function parseVoiceOrderText(text: string): ParsedItemResult[] {
  if (!text || !text.trim()) return [];

  const normalized = text.toLowerCase().trim();
  const results: ParsedItemResult[] = [];
  const processedProductIds = new Set<string>();

  INITIAL_PRODUCTS.forEach(product => {
    let matched = false;
    let matchedKeyword = '';

    const allKeywords = [
      product.item_name_en.toLowerCase(),
      product.item_name_hi.toLowerCase(),
      product.item_code.toLowerCase(),
      ...product.keywords.map(k => k.toLowerCase())
    ];

    for (const keyword of allKeywords) {
      if (normalized.includes(keyword)) {
        matched = true;
        matchedKeyword = keyword;
        break;
      }
    }

    if (matched && !processedProductIds.has(product.id)) {
      processedProductIds.add(product.id);

      // Extract window around matched keyword
      const keywordIdx = normalized.indexOf(matchedKeyword);
      const windowStart = Math.max(0, keywordIdx - 20);
      const windowEnd = Math.min(normalized.length, keywordIdx + matchedKeyword.length + 25);
      const contextWindow = normalized.substring(windowStart, windowEnd);

      let quantity = 1;
      let unitDetected = product.unit;

      // 1. Try numeric match first e.g. "5 kg", "2.5 L", "10 packets"
      const numericMatch = contextWindow.match(/(\d+(?:\.\d+)?)\s*(kg|kilo|litre|liter|l|packet|pkt|pouch|tray|can|pcs|piece|pack|dabba|g|gram)?/i);

      if (numericMatch && numericMatch[1]) {
        const val = parseFloat(numericMatch[1]);
        if (val > 0 && val <= 50) {
          quantity = val;
          if (numericMatch[2]) {
            unitDetected = numericMatch[2];
          }
        }
      } else {
        // 2. Try Hindi number words e.g. "do kg", "paanch packet", "ek litre"
        const numberWordKeys = Object.keys(HINDI_NUMBER_MAP).join('|');
        const wordMatchRegex = new RegExp(`\\b(${numberWordKeys})\\b\\s*(kg|kilo|litre|liter|l|packet|pkt|pouch|tray|can|pcs|piece|pack|dabba|g|gram)?`, 'i');
        const wordMatch = contextWindow.match(wordMatchRegex);

        if (wordMatch && wordMatch[1]) {
          const mappedNum = HINDI_NUMBER_MAP[wordMatch[1].toLowerCase()];
          if (mappedNum) {
            quantity = mappedNum;
            if (wordMatch[2]) {
              unitDetected = wordMatch[2];
            }
          }
        }
      }

      // Calculate confidence score (higher if exact product name matched)
      let confidence = 0.85;
      if (matchedKeyword === product.name.toLowerCase() || matchedKeyword === product.item_name_hi.toLowerCase()) {
        confidence = 0.98;
      } else if (matchedKeyword === product.item_code.toLowerCase()) {
        confidence = 0.99;
      } else if (matchedKeyword.length > 3) {
        confidence = 0.92;
      }

      results.push({
        product,
        quantity,
        extractedText: matchedKeyword,
        confidence,
        unitDetected
      });
    }
  });

  return results;
}

