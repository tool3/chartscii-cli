#!/usr/bin/env node

import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import fs from 'fs';
import Chartscii from 'chartscii';
import * as generator from './generator';
import * as dataParser from './parser';
import * as configBuilder from './config';
import * as reader from './reader';
import { CLIOptions } from './types';
import { calculateBarAreaWidth } from './width-calculator';

function isFilePath(arg: string): boolean {
  try {
    return fs.existsSync(arg) && fs.statSync(arg).isFile();
  } catch {
    return false;
  }
}

function createParser() {
  return yargs(hideBin(process.argv))
    .scriptName('chartscii')
    .usage('Usage: $0 [data...] [options]')
    .example('$0 1 2 3 4 5', 'Create chart from numbers')
    .example('$0 $(seq 1 20)', 'Create chart from sequence')
    .example('echo "1 2 3 4 5" | $0', 'Create chart from piped data')
    .example('cat data.txt | $0', 'Create chart from pipe')
    .example('$0 data.json', 'Create chart from JSON file')
    .example('$0 data.csv', 'Create chart from CSV file')
    .example('du -sh * | $0', 'Create chart from command output')
    .example('$0 1 2 3 -c green -t "My Chart"', 'Chart with options')
    .example('$0 1 2 3 -f -o vertical', 'Vertical chart with fill')
    .example('$0 1 2 3 4 5 -c "gradient(red,yellow,green)"', 'Gradient colors')

    .option('title', {
      alias: 't',
      type: 'string',
      description: 'Chart title',
      default: ''
    })
    .option('title-color', {
      alias: 'T',
      type: 'string',
      description: 'Title color (named, hex, ANSI, or "gradient" to match chart gradient)',
      default: ''
    })
    .option('title-align', {
      alias: 'A',
      type: 'string',
      description: 'Title alignment',
      choices: ['left', 'center', 'right'],
      default: 'left'
    })
    .option('title-padding', {
      alias: 'D',
      type: 'string',
      description: 'Title padding (CSS-style: single number, "v,h" or "top,right,bottom,left")',
      default: ''
    })
    .option('labels', {
      alias: 'l',
      type: 'boolean',
      description: 'Display labels',
      default: true
    })
    .option('color-labels', {
      alias: 'C',
      type: 'boolean',
      description: 'Color labels',
      default: true
    })
    .option('percentage', {
      alias: 'p',
      type: 'boolean',
      description: 'Display percentages',
      default: false
    })
    .option('value-labels', {
      alias: 'v',
      type: 'boolean',
      description: 'Display value labels on bars',
      default: false
    })
    .option('value-labels-prefix', {
      type: 'string',
      alias: 'P',
      description: 'Prefix for value labels (e.g., "$")',
      default: ''
    })
    .option('value-labels-floating-point', {
      type: 'number',
      alias: 'V',
      description: 'Decimal places for value labels',
      default: 2
    })

    .option('orientation', {
      alias: 'o',
      type: 'string',
      description: 'Chart orientation',
      choices: ['horizontal', 'vertical'],
      default: 'horizontal'
    })
    .option('width', {
      alias: 'w',
      description: 'Chart width (number or "auto" for terminal width)',
      coerce: (value: any) => {
        if (value === 'auto') return 'auto';
        const num = Number(value);
        return isNaN(num) ? 80 : num;
      },
      default: 80
    })
    .option('height', {
      alias: 'h',
      description: 'Chart height (number or "auto" for terminal height)',
      coerce: (value: any) => {
        if (value === 'auto') return 'auto';
        const num = Number(value);
        return isNaN(num) ? 20 : num;
      }
    })
    .option('bar-size', {
      alias: 'b',
      type: 'number',
      description: 'Bar size (thickness)'
    })
    .option('padding', {
      alias: 'd',
      type: 'number',
      description: 'Padding between bars',
      default: 1,
    })

    .option('color', {
      alias: 'c',
      type: 'string',
      description: 'Bar color (named, hex, ANSI, "auto" for cycling colors, or gradient(color1,color2,...) for gradients)',
      default: ''
    })
    .option('theme', {
      alias: 'k',
      type: 'string',
      description: 'Color theme',
      default: ''
    })
    .option('char', {
      alias: 'z',
      type: 'string',
      description: 'Character for bars',
      default: '█'
    })
    .option('fill', {
      alias: 'f',
      description: 'Fill character for empty space (default: ▒)',
      coerce: (value: any) => {
        if (value === true) return '▒';
        if (typeof value === 'string') return value;
        return undefined;
      }
    })
    .option('scale', {
      alias: 'S',
      type: 'string',
      description: 'Scale mode: auto (0 to max), relative (min to max with baseline), relative-zero (min to max, no baseline), or number for fixed scale',
      default: 'auto'
    })
    .option('fill-color', {
      alias: 'G',
      type: 'string',
      description: 'Color for fill character. Use "auto" to match bar color (works with gradients)',
      default: ''
    })
    .option('align-bars', {
      alias: 'E',
      type: 'string',
      description: 'Bar alignment (horizontal: top/center/bottom/justify, vertical: left/center/right/justify)',
      default: ''
    })
    .option('stack-colors', {
      alias: 'I',
      type: 'array',
      description: 'Colors for stacked segments (space-separated)',
      default: []
    })
    .option('stack-labels', {
      alias: 'J',
      type: 'array',
      description: 'Labels for stacked segments (space-separated)',
      default: []
    })
    .option('stack-value-labels', {
      alias: 'K',
      type: 'boolean',
      description: 'Show value labels on stacked segments',
      default: false
    })

    .option('sort', {
      alias: 's',
      type: 'boolean',
      description: 'Sort data',
      default: true
    })
    .option('reverse', {
      alias: 'r',
      type: 'boolean',
      description: 'Reverse the chart',
      default: false
    })

    .option('naked', {
      alias: 'n',
      type: 'boolean',
      description: 'Display without structure characters',
      default: false
    })
    .option('structure-x', {
      alias: 'x',
      type: 'string',
      description: 'Horizontal structure character',
      default: '═'
    })
    .option('structure-y', {
      alias: 'y',
      type: 'string',
      description: 'Vertical structure character',
      default: '╢'
    })
    .option('structure-axis', {
      alias: 'a',
      type: 'string',
      description: 'Axis structure character',
      default: '║'
    })
    .option('structure-bottom-left', {
      alias: 'q',
      type: 'string',
      description: 'Bottom-left corner character',
      default: '╚'
    })

    .option('list-themes', {
      type: 'boolean',
      description: 'List all available color themes',
      default: false
    })

    .option('animate', {
      type: 'boolean',
      description: 'Animate the chart (bars grow from 0)',
      default: false
    })
    .option('animate-duration', {
      type: 'number',
      description: 'Animation duration in milliseconds',
      default: 1000
    })
    .option('animate-fps', {
      type: 'number',
      description: 'Animation frames per second',
      default: 60
    })
    .option('animate-easing', {
      type: 'string',
      description: 'Animation easing function',
      choices: ['linear', 'easeIn', 'easeOut', 'easeInOut'],
      default: 'easeOut'
    })
    .option('animate-step', {
      type: 'number',
      description: 'Animation step size (0-1, e.g. 0.1 for 10 steps). Overrides fps when set.'
    })

    .help('help')
    .alias('help', '?')
    .version()
    .wrap(Math.min(120, yargs().terminalWidth()));
}

async function run() {
  const parser = createParser();
  const argv = parser.argv as unknown as CLIOptions;
  let args = argv._ || [];

  // Handle --list-themes flag
  if ((argv as any).listThemes) {
    const themes = [
      'default', 'pastel', 'lush', 'standard', 'beach', 'nature', 'neon',
      'spring', 'pinkish', 'crayons', 'sunset', 'rufus', 'summer', 'autumn',
      'mint', 'vintage', 'sport', 'rainbow', 'pool', 'champagne'
    ];

    console.log('\nAvailable themes:\n');
    themes.forEach(theme => {
      console.log(`  - ${theme}`);
    });
    console.log('\nUsage: chartscii data.json -k <theme-name>\n');
    process.exit(0);
  }

  const animateOptions = {
    animate: (argv as any).animate,
    duration: (argv as any).animateDuration || (argv as any)['animate-duration'] || 1000,
    fps: (argv as any).animateFps || (argv as any)['animate-fps'] || 30,
    easing: (argv as any).animateEasing || (argv as any)['animate-easing'] || 'easeOut',
    step: (argv as any).animateStep || (argv as any)['animate-step']
  };

  if (args.length === 1 && typeof args[0] === 'string' && isFilePath(args[0])) {
    const filePath = args[0];
    const fileContent = reader.readFile(filePath);

    try {
      const parsedData = dataParser.parse(fileContent);

      const chartConfig = configBuilder.buildOptions(argv);

      if (typeof chartConfig.width === 'number') {
        const targetWidth = chartConfig.width;
        const barAreaWidth = calculateBarAreaWidth(targetWidth, parsedData, argv);
        chartConfig.width = barAreaWidth;
      }

      const chart = new Chartscii(parsedData, chartConfig);

      if (animateOptions.animate) {
        await (chart as any).animate({
          duration: animateOptions.duration,
          fps: animateOptions.fps,
          easing: animateOptions.easing,
          step: animateOptions.step
        });
      } else {
        console.log(chart.create());
      }
      return;
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      console.error(`Error: ${message}`);
      process.exit(1);
    }
  }

  try {
    const chartOutput = await generator.generate(args, argv, animateOptions);
    if (!animateOptions.animate) {
      console.log(chartOutput);
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);

    if (message.includes('No input provided') || message.includes('Empty input')) {
      parser.showHelp();
      process.exit(0);
    }

    console.error(`Error: ${message}`);
    process.exit(1);
  }
}

run().catch(error => {
  console.error('Unexpected error:', error);
  process.exit(1);
});
