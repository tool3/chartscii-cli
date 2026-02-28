import Chartscii from 'chartscii';
import { InputData, CustomizationOptions } from './types';
import * as parser from './parser';
import * as reader from './reader';
import * as config from './config';

/**
 * Generate chart from command line arguments and options
 */
export async function generate(args: Array<string | number>, options: Partial<CustomizationOptions> = {}): Promise<string> {
  // Get input source
  const fileOption = (options as any).file || (options as any).f;
  const inputSource = await reader.getInputSource(args, fileOption);

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

  // Build configuration
  const chartConfig = config.buildOptions(options);

  // Generate chart
  const chart = new Chartscii(data, chartConfig);
  return chart.create();
}
