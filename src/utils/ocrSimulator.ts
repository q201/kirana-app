import { parseVoiceOrderText, ParsedItemResult } from './speechParser';

export interface OCRLineBoundingBox {
  lineIndex: number;
  rawText: string;
  normalizedText: string;
  box: { x: number; y: number; width: number; height: number };
  confidence: number;
}

export interface OCRScanResult {
  items: ParsedItemResult[];
  lineBoxes: OCRLineBoundingBox[];
  overallConfidence: number;
}

// Convert Devanagari numerals (१, २, ३...) to Western digits (1, 2, 3...)
export function convertDevanagariNumerals(str: string): string {
  const devanagariMap: Record<string, string> = {
    '०': '0',
    '१': '1',
    '२': '2',
    '३': '3',
    '४': '4',
    '५': '5',
    '६': '6',
    '७': '7',
    '८': '8',
    '९': '9'
  };

  return str.replace(/[०-९]/g, match => devanagariMap[match] || match);
}

export function parseHandwrittenListText(rawText: string): ParsedItemResult[] {
  const result = scanHandwrittenListOCR(rawText);
  return result.items;
}

export function scanHandwrittenListOCR(rawText: string): OCRScanResult {
  if (!rawText || !rawText.trim()) {
    return { items: [], lineBoxes: [], overallConfidence: 0 };
  }

  const lines = rawText.split('\n').filter(l => l.trim().length > 0);
  const items: ParsedItemResult[] = [];
  const lineBoxes: OCRLineBoundingBox[] = [];
  const seenProductIds = new Set<string>();

  lines.forEach((line, idx) => {
    const normalizedLine = convertDevanagariNumerals(line);
    const lineResults = parseVoiceOrderText(normalizedLine);

    let confidence = 0.91;
    if (lineResults.length > 0) {
      confidence = Math.max(...lineResults.map(i => i.confidence));
    }

    // Calculate synthetic bounding box for canvas drawing
    const yPos = 40 + idx * 45;
    const box = {
      x: 30,
      y: yPos,
      width: Math.min(320, line.length * 12 + 60),
      height: 36
    };

    lineBoxes.push({
      lineIndex: idx,
      rawText: line,
      normalizedText: normalizedLine,
      box,
      confidence
    });

    lineResults.forEach(item => {
      if (!seenProductIds.has(item.product.id)) {
        seenProductIds.add(item.product.id);
        items.push(item);
      }
    });
  });

  const overallConfidence =
    lineBoxes.length > 0
      ? Math.round(
          (lineBoxes.reduce((acc, l) => acc + l.confidence, 0) / lineBoxes.length) * 100
        )
      : 0;

  return {
    items,
    lineBoxes,
    overallConfidence
  };
}

