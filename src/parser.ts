import { InputData } from './types';

/**
 * Parse CSV content into InputData array
 */
export function parseCSV(content: string): InputData[] {
  const lines = content.trim().split('\n');
  const result: InputData[] = [];

  for (const line of lines) {
    const trimmedLine = line.trim();
    if (!trimmedLine) continue;

    const parts = trimmedLine.split(',').map(p => p.trim());

    if (parts.length === 1) {
      const value = parseNumber(parts[0]);
      if (value !== null) result.push(value);
    } else if (parts.length === 2) {
      const value = parseNumber(parts[1]);
      if (value !== null) {
        result.push({ label: parts[0], value });
      }
    } else {
      for (const part of parts) {
        const value = parseNumber(part);
        if (value !== null) result.push(value);
      }
    }
  }

  return result;
}

/**
 * Parse JSON content into InputData array
 */
export function parseJSON(content: string): InputData[] {
  try {
    const parsed = JSON.parse(content);
    if (!Array.isArray(parsed)) {
      throw new Error('JSON must be an array');
    }
    return parsed;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(`Invalid JSON: ${message}`);
  }
}

/**
 * Parse plain text with numbers
 */
export function parseText(content: string): InputData[] {
  return content
    .trim()
    .split(/\s+/)
    .map(parseNumber)
    .filter(n => n !== null) as number[];
}

/**
 * Auto-detect format and parse
 */
export function parse(content: string): InputData[] {
  const trimmed = content.trim();

  if (!trimmed) {
    throw new Error('Empty input');
  }

  // Try JSON first
  if (trimmed.startsWith('[') || trimmed.startsWith('{')) {
    try {
      return parseJSON(trimmed);
    } catch {
      // Continue to other formats
    }
  }

  // Try CSV if it contains commas
  if (trimmed.includes(',')) {
    try {
      const result = parseCSV(trimmed);
      if (result.length > 0) return result;
    } catch {
      // Continue
    }
  }

  // Default to plain text
  return parseText(trimmed);
}

/**
 * Parse command line arguments
 */
export function parseArgs(args: Array<string | number>): InputData[] {
  const result: InputData[] = [];

  for (const arg of args) {
    if (typeof arg === 'number') {
      result.push(arg);
      continue;
    }

    const str = String(arg);
    const num = parseNumber(str);

    if (num !== null) {
      result.push(num);
      continue;
    }

    if (str.includes(':')) {
      const parsed = parseObjectNotation(str);
      if (parsed) result.push(parsed);
    }
  }

  return result;
}

/**
 * Parse object notation: label: 'foo', value: 10
 */
function parseObjectNotation(str: string): InputData | null {
  try {
    const result: any = {};
    const pattern = /([a-zA-Z]+):\s*('[^']*'|"[^"]*"|[^,{}]+)/g;
    const matches = str.matchAll(pattern);

    for (const match of matches) {
      const key = match[1];
      let value: any = match[2].trim();

      if ((value.startsWith("'") && value.endsWith("'")) ||
          (value.startsWith('"') && value.endsWith('"'))) {
        value = value.slice(1, -1);
      }

      if (key === 'value') {
        const num = parseNumber(value);
        if (num !== null) result[key] = num;
      } else {
        result[key] = value;
      }
    }

    return Object.keys(result).length > 0 ? result as InputData : null;
  } catch {
    return null;
  }
}

/**
 * Safely parse number
 */
function parseNumber(str: string): number | null {
  const num = Number(str);
  return isNaN(num) ? null : num;
}
