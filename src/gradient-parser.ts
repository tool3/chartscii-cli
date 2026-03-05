import { Gradient } from 'chartscii/types/types';

export function parseGradient(value: string): Gradient | string {
  if (!value.startsWith('gradient(')) {
    return value;
  }

  const match = value.match(/^gradient\(([^)]+)\)$/);
  if (!match) {
    return value;
  }

  const content = match[1];
  const parts = content.split(':');
  const colorsPart = parts[0];
  const options = parts.slice(1);

  const colors = colorsPart.split(',').map(c => c.trim()).filter(c => c.length > 0);

  if (colors.length === 0) {
    return value;
  }

  const gradient: Gradient = {
    type: 'gradient',
    colors
  };

  for (const opt of options) {
    const trimmed = opt.trim().toLowerCase();
    if (trimmed === 'horizontal' || trimmed === 'vertical') {
      gradient.direction = trimmed;
    } else if (trimmed === 'reverse' || trimmed === 'reversed') {
      gradient.reverse = true;
    }
  }

  return gradient;
}
