import Chartscii from 'chartscii';
import { InputData, CustomizationOptions } from './types';
import * as parser from './parser';
import * as reader from './reader';
import * as config from './config';
import { calculateBarAreaWidth } from './width-calculator';

/**
 * Available colors for auto-cycling
 */
const AUTO_COLORS = [
  'red',
  'green',
  'yellow',
  'blue',
  'purple',
  'cyan',
  'pink',
  'orange',
  'marine'
];

/**
 * Apply auto colors to data items in cycling order
 */
function applyAutoColors(data: InputData[]): InputData[] {
  return data.map((item, index) => {
    const color = AUTO_COLORS[index % AUTO_COLORS.length];

    if (typeof item === 'number') {
      return { value: item, color };
    }

    return { ...item, color };
  });
}

/**
 * Generate chart from command line arguments and options
 */
export async function generate(args: Array<string | number>, options: Partial<CustomizationOptions> = {}): Promise<string> {
  // Get input source (file detection is automatic in reader.getInputSource via cli.ts)
  const inputSource = await reader.getInputSource(args);

  // Parse input data
  let data: InputData[];

  if (inputSource.type === 'args') {
    data = parser.parseArgs(inputSource.data as string[]);
  } else {
    data = parser.parse(inputSource.data as string);
  }

  if (data.length === 0) {
    throw new Error('No valid data to chart');
  }

  // Handle auto color cycling
  if (options.color === 'auto') {
    data = applyAutoColors(data);
    // Remove the global color option so each item uses its own color
    delete options.color;
  }

  // Check if any data has stacked values (arrays) and no stackColors provided
  const hasStackedData = data.some((item: any) =>
    Array.isArray(item?.value) ||
    (Array.isArray(item?.value) && item.value.some((v: any) => typeof v === 'object'))
  );

  if (hasStackedData && (!options.stackColors || (options.stackColors as any[]).length === 0)) {
    // Find the maximum number of segments
    let maxSegments = 1;
    data.forEach((item: any) => {
      if (Array.isArray(item?.value)) {
        maxSegments = Math.max(maxSegments, item.value.length);
      }
    });

    // Auto-generate stack colors if not provided
    if (maxSegments > 1) {
      options.stackColors = AUTO_COLORS.slice(0, maxSegments) as any;
    }
  }

  // Build configuration
  const chartConfig = config.buildOptions(options);

  // Adjust width if it was specified to ensure output fits in terminal
  // This is purely a CLI concern - the library just renders what we tell it to
  // NOTE: We pass the original options (not chartConfig) so width calculator can tell
  // which values were explicitly set by user vs defaults
  if (typeof chartConfig.width === 'number') {
    const targetWidth = chartConfig.width;
    const barAreaWidth = calculateBarAreaWidth(targetWidth, data, options);
    chartConfig.width = barAreaWidth;
  }

  // Generate chart
  const chart = new Chartscii(data, chartConfig);
  return chart.create();
}
