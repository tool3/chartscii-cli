import Chartscii from 'chartscii';
import { InputData, CustomizationOptions } from './types';
import * as parser from './parser';
import * as reader from './reader';
import * as config from './config';
import { calculateBarAreaWidth } from './width-calculator';

export async function generate(args: Array<string | number>, options: Partial<CustomizationOptions> = {}): Promise<string> {
  const inputSource = await reader.getInputSource(args);

  let data: InputData[];

  if (inputSource.type === 'args') {
    data = parser.parseArgs(inputSource.data as string[]);
  } else {
    data = parser.parse(inputSource.data as string);
  }

  if (data.length === 0) {
    throw new Error('No valid data to chart');
  }

  const chartConfig = config.buildOptions(options);

  if (typeof chartConfig.width === 'number') {
    const targetWidth = chartConfig.width;
    const barAreaWidth = calculateBarAreaWidth(targetWidth, data, options);
    chartConfig.width = barAreaWidth;
  }

  const chart = new Chartscii(data, chartConfig);
  return chart.create();
}
