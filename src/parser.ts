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

    // Format 1: Array notation - JavaScript,[68, 21, 23]
    const arrayMatch = line.match(/^([^,]+),\s*(\[[\d\s,]+\])$/);
    if (arrayMatch) {
      const label = arrayMatch[1].trim();
      const arrayStr = arrayMatch[2];
      try {
        const values = JSON.parse(arrayStr);
        if (Array.isArray(values) && values.every(v => typeof v === 'number')) {
          result.push({ label, value: values });
          continue;
        }
      } catch {
        // Fall through to regular parsing
      }
    }

    // Format 2: Pipe-separated - JavaScript,68|21|23
    const pipeMatch = line.match(/^([^,]+),\s*([\d.]+(?:\|[\d.]+)+)$/);
    if (pipeMatch) {
      const label = pipeMatch[1].trim();
      const pipeStr = pipeMatch[2];
      const values = pipeStr.split('|').map(v => parseNumber(v.trim())).filter(v => v !== null) as number[];
      if (values.length > 1) {
        result.push({ label, value: values });
        continue;
      }
    }

    // Format 3: Space-separated in quotes - JavaScript,"68 21 23"
    const quotedSpaceMatch = line.match(/^([^,]+),\s*"([\d\s.]+)"$/);
    if (quotedSpaceMatch) {
      const label = quotedSpaceMatch[1].trim();
      const spaceStr = quotedSpaceMatch[2];
      const values = spaceStr.split(/\s+/).map(v => parseNumber(v.trim())).filter(v => v !== null) as number[];
      if (values.length > 1) {
        result.push({ label, value: values });
        continue;
      }
    }

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
      // Format 4: Multiple columns - JavaScript,68,21,23
      // If first part is not a number (label) and rest are numbers, treat as stacked
      const firstIsLabel = parseNumber(parts[0]) === null;
      if (firstIsLabel) {
        const values = parts.slice(1).map(p => parseNumber(p)).filter(v => v !== null) as number[];
        if (values.length > 1) {
          result.push({ label: parts[0], value: values });
          continue;
        } else if (values.length === 1) {
          result.push({ label: parts[0], value: values[0] });
          continue;
        }
      }

      // Fallback: treat as separate numeric entries
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
  const trimmed = content.trim();

  // If content has newlines, check each line
  if (trimmed.includes('\n') || trimmed.includes('\r')) {
    const lines = trimmed
      .split(/[\n\r]+/)
      .map(line => line.trim())
      .filter(line => line.length > 0);

    // Check if lines contain only pure numbers (space-separated)
    const allLinesArePureNumbers = lines.every(line => {
      const tokens = line.split(/\s+/);
      return tokens.every(token => parseNumber(token) !== null);
    });

    if (allLinesArePureNumbers) {
      // Split all by whitespace and return pure numbers
      return trimmed
        .split(/\s+/)
        .map(parseNumber)
        .filter(n => n !== null) as number[];
    }

    // Check if lines follow "number string" or "string number" pattern
    const parsedLines = lines
      .map(parseNumberLabelLine)
      .filter(item => item !== null) as InputData[];

    if (parsedLines.length > 0) {
      return parsedLines;
    }

    // Otherwise, extract numbers with labels from each line (fallback)
    return lines
      .map(extractNumberFromString)
      .filter(item => item !== null) as InputData[];
  }

  // Single line: try to parse as label+value(s) first
  const tokens = trimmed.split(/\s+/);

  if (tokens.length >= 2) {
    const parsed = parseNumberLabelLine(trimmed);
    if (parsed) return [parsed];
  }

  const hasNonNumeric = tokens.some(token => parseNumber(token) === null);

  if (hasNonNumeric) {
    // Extract numbers and ignore non-numeric tokens
    return tokens
      .map(parseNumber)
      .filter(n => n !== null) as number[];
  }

  // Pure numbers
  return tokens
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

  // Try CSV if it contains commas (but not if they're only inside brackets)
  // This prevents [1, 2, 3] from being detected as CSV
  const hasCommasOutsideBrackets = /,(?![^\[]*\])/.test(trimmed);
  if (hasCommasOutsideBrackets) {
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

/**
 * Parse a line that contains a number and label separated by whitespace
 * Handles both "number label" and "label number" formats
 * Also handles size suffixes like "8.0K filename"
 * Also handles stacked values like "label 100|50|30" or "label [100, 50, 30]"
 */
function parseNumberLabelLine(line: string): InputData | null {
  const tokens = line.split(/\s+/);

  if (tokens.length < 2) {
    return null;
  }

  // Format: "label [100, 50, 30]"
  const arrayMatch = line.match(/^(.+?)\s+(\[[\d\s,]+\])$/);
  if (arrayMatch) {
    const label = arrayMatch[1].trim();
    const arrayStr = arrayMatch[2];
    try {
      const values = JSON.parse(arrayStr);
      if (Array.isArray(values) && values.every(v => typeof v === 'number')) {
        return { label, value: values };
      }
    } catch {
      // Fall through
    }
  }

  // Format: "label 100|50|30" or "100|50|30 label"
  const lastToken = tokens[tokens.length - 1];
  if (lastToken.includes('|')) {
    const pipeValues = lastToken.split('|').map(v => parseNumber(v.trim())).filter(v => v !== null) as number[];
    if (pipeValues.length > 1) {
      const label = tokens.slice(0, -1).join(' ');
      return { label, value: pipeValues };
    }
  }

  const firstToken = tokens[0];
  if (firstToken.includes('|')) {
    const pipeValues = firstToken.split('|').map(v => parseNumber(v.trim())).filter(v => v !== null) as number[];
    if (pipeValues.length > 1) {
      const label = tokens.slice(1).join(' ');
      return { label, value: pipeValues };
    }
  }

  // Try "number label" format (e.g., "8.0K CONTRIBUTING.md")
  const restAsLabel = tokens.slice(1).join(' ');

  // Check for size suffix first
  const sizeMatch = firstToken.match(/^([\d.]+)([KMGT])$/i);
  if (sizeMatch) {
    const baseValue = parseFloat(sizeMatch[1]);
    const suffix = sizeMatch[2].toUpperCase();

    const multipliers: { [key: string]: number } = {
      'K': 1024,
      'M': 1024 * 1024,
      'G': 1024 * 1024 * 1024,
      'T': 1024 * 1024 * 1024 * 1024
    };

    const value = baseValue * multipliers[suffix];
    return { label: restAsLabel, value };
  }

  // Try plain number
  const firstNum = parseNumber(firstToken);
  if (firstNum !== null) {
    return { label: restAsLabel, value: firstNum };
  }

  // Try "label number" format (e.g., "CONTRIBUTING.md 8.0K")
  // lastToken already declared above
  const restAsLabelReverse = tokens.slice(0, -1).join(' ');

  // Check for size suffix
  const sizeMatchLast = lastToken.match(/^([\d.]+)([KMGT])$/i);
  if (sizeMatchLast) {
    const baseValue = parseFloat(sizeMatchLast[1]);
    const suffix = sizeMatchLast[2].toUpperCase();

    const multipliers: { [key: string]: number } = {
      'K': 1024,
      'M': 1024 * 1024,
      'G': 1024 * 1024 * 1024,
      'T': 1024 * 1024 * 1024 * 1024
    };

    const value = baseValue * multipliers[suffix];
    return { label: restAsLabelReverse, value };
  }

  // Try plain number
  const lastNum = parseNumber(lastToken);
  if (lastNum !== null) {
    return { label: restAsLabelReverse, value: lastNum };
  }

  return null;
}

/**
 * Extract number from a string that may contain non-numeric characters
 * Returns an InputData object with the original string as label and extracted number as value
 */
function extractNumberFromString(str: string): InputData | null {
  // Try direct number conversion first (for pure numeric strings)
  const directNum = parseNumber(str);
  if (directNum !== null) {
    return directNum;
  }

  // Check for size suffixes (e.g., 8.0K, 44M, 1.2G, 5.3T)
  const sizeMatch = str.match(/^([\d.]+)([KMGT])$/i);
  if (sizeMatch) {
    const baseValue = parseFloat(sizeMatch[1]);
    const suffix = sizeMatch[2].toUpperCase();

    const multipliers: { [key: string]: number } = {
      'K': 1024,
      'M': 1024 * 1024,
      'G': 1024 * 1024 * 1024,
      'T': 1024 * 1024 * 1024 * 1024
    };

    const value = baseValue * multipliers[suffix];
    return { label: str, value };
  }

  // Extract any numeric value from the string (including decimals and commas)
  // This handles cases like: "test123", "$1,500", "Price: 99.99", etc.
  const numberMatch = str.match(/([\d,]+\.?\d*|\d*\.[\d,]+)/);
  if (numberMatch) {
    // Remove commas and parse
    const cleanNum = numberMatch[1].replace(/,/g, '');
    const value = parseFloat(cleanNum);
    if (!isNaN(value)) {
      // Return object with original string as label and extracted number as value
      return { label: str, value };
    }
  }

  return null;
}
