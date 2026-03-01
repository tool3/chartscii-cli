import Chartscii from 'chartscii';
import { InputData, CustomizationOptions } from './types';
import * as parser from './parser';
import * as reader from './reader';
import * as config from './config';

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

  // Build configuration
  const chartConfig = config.buildOptions(options);

  // Generate chart
  const chart = new Chartscii(data, chartConfig);
  return chart.create();
}
