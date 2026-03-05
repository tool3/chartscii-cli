import { CustomizationOptions } from './types';
import { parseGradient } from './gradient-parser';

export function getDefaults(): CustomizationOptions {
  return {
    orientation: 'horizontal',
    width: 80,
    padding: 1,
    labels: true,
    colorLabels: true,
    percentage: false,
    sort: true,
    reverse: false,
    naked: false,
    char: '█',
    title: '',
    color: '',
    theme: '',
    structure: {
      x: '═',
      y: '╢',
      axis: '║',
      topLeft: '╔',
      bottomLeft: '╚'
    }
  };
}

export function buildOptions(options: Partial<CustomizationOptions>): CustomizationOptions {
  const clean = cleanYargsOptions(options);
  const defaults = getDefaults();

  if ((clean as any).width === 'auto') {
    clean.width = process.stdout.columns || 80;
  }
  if ((clean as any).height === 'auto') {
    clean.height = process.stdout.rows || 20;
  }

  const newStructure = clean.structure;
  delete clean.structure;

  const config = {
    ...defaults,
    ...clean
  };

  if (newStructure) {
    config.structure = {
      ...defaults.structure!,
      ...newStructure
    };
  }

  if (config.height === undefined) {
    config.height = config.orientation === 'horizontal' ? 1 : 20;
  }

  return config as CustomizationOptions;
}

function cleanYargsOptions(options: any): Partial<CustomizationOptions> {
  const clean: any = { ...options };

  delete clean._;
  delete clean.$0;
  delete clean.help;
  delete clean.version;

  if (clean.color === '') {
    delete clean.color;
  } else if (clean.color && typeof clean.color === 'string') {
    clean.color = parseGradient(clean.color);
  }

  if (clean.theme === '') delete clean.theme;
  if (clean.title === '') delete clean.title;
  if (clean['fill-color'] === '') delete clean['fill-color'];
  if (clean['align-bars'] === '') delete clean['align-bars'];

  if (clean['color-labels'] !== undefined) {
    clean.colorLabels = clean['color-labels'];
    delete clean['color-labels'];
  }

  if (clean['value-labels'] !== undefined) {
    clean.valueLabels = clean['value-labels'];
    delete clean['value-labels'];
  }

  if (clean['value-labels-prefix'] !== undefined) {
    clean.valueLabelsPrefix = clean['value-labels-prefix'];
    delete clean['value-labels-prefix'];
  }

  if (clean['value-labels-floating-point'] !== undefined) {
    clean.valueLabelsFloatingPoint = clean['value-labels-floating-point'];
    delete clean['value-labels-floating-point'];
  }

  if (clean['max-value'] !== undefined) {
    clean.maxValue = clean['max-value'];
    delete clean['max-value'];
  }

  if (clean['bar-size'] !== undefined) {
    clean.barSize = clean['bar-size'];
    delete clean['bar-size'];
  }

  if (clean['fill-color'] !== undefined) {
    clean.fillColor = clean['fill-color'];
    delete clean['fill-color'];
  }

  if (clean['align-bars'] !== undefined) {
    clean.alignBars = clean['align-bars'];
    delete clean['align-bars'];
  }

  if (clean['stack-colors'] !== undefined && Array.isArray(clean['stack-colors']) && clean['stack-colors'].length > 0) {
    clean.stackColors = clean['stack-colors'];
    delete clean['stack-colors'];
  }

  if (clean['stack-labels'] !== undefined && Array.isArray(clean['stack-labels']) && clean['stack-labels'].length > 0) {
    clean.stackLabels = clean['stack-labels'];
    delete clean['stack-labels'];
  }

  if (clean['stack-value-labels'] !== undefined) {
    clean.stackValueLabels = clean['stack-value-labels'];
    delete clean['stack-value-labels'];
    if (clean.stackValueLabels) {
      clean.valueLabels = true;
    }
  }

  const structure: any = {};
  let hasStructure = false;

  if (clean['structure-x'] || clean.structureX) {
    structure.x = clean['structure-x'] || clean.structureX;
    delete clean['structure-x'];
    delete clean.structureX;
    hasStructure = true;
  }

  if (clean['structure-y'] || clean.structureY) {
    structure.y = clean['structure-y'] || clean.structureY;
    delete clean['structure-y'];
    delete clean.structureY;
    hasStructure = true;
  }

  if (clean['structure-axis'] || clean.structureAxis) {
    structure.axis = clean['structure-axis'] || clean.structureAxis;
    delete clean['structure-axis'];
    delete clean.structureAxis;
    hasStructure = true;
  }

  if (clean['structure-bottom-left'] || clean.structureBottomLeft) {
    structure.bottomLeft = clean['structure-bottom-left'] || clean.structureBottomLeft;
    delete clean['structure-bottom-left'];
    delete clean.structureBottomLeft;
    hasStructure = true;
  }

  if (hasStructure) {
    clean.structure = structure;
  }

  return clean;
}
