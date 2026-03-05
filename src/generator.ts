import Chartscii from 'chartscii';
import { InputData, CustomizationOptions } from './types';
import * as parser from './parser';
import * as reader from './reader';
import * as config from './config';
import { calculateBarAreaWidth } from './width-calculator';

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

function applyAutoColors(data: InputData[]): InputData[] {
  return data.map((item, index) => {
    const color = AUTO_COLORS[index % AUTO_COLORS.length];

    if (typeof item === 'number') {
      return { value: item, color };
    }

    return { ...item, color };
  });
}

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

  if (options.color === 'auto') {
    data = applyAutoColors(data);
    delete options.color;
  }

  const hasStackedData = data.some((item: any) =>
    Array.isArray(item?.value) ||
    (Array.isArray(item?.value) && item.value.some((v: any) => typeof v === 'object'))
  );

  if (hasStackedData && (!options.stackColors || (options.stackColors as any[]).length === 0)) {
    let maxSegments = 1;
    data.forEach((item: any) => {
      if (Array.isArray(item?.value)) {
        maxSegments = Math.max(maxSegments, item.value.length);
      }
    });

    if (maxSegments > 1) {
      options.stackColors = AUTO_COLORS.slice(0, maxSegments) as any;
    }
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
