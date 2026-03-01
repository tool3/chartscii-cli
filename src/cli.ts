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

/**
 * Check if argument is a file path
 */
function isFilePath(arg: string): boolean {
  try {
    return fs.existsSync(arg) && fs.statSync(arg).isFile();
  } catch {
    return false;
  }
}

/**
 * Create parser
 */
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

    // Display options
    .option('title', {
      alias: 't',
      type: 'string',
      description: 'Chart title',
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

    // Layout options
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
      },
      default: 20
    })
    .option('bar-size', {
      alias: 'b',
      type: 'number',
      description: 'Bar size (thickness)',
      default: 1
    })
    .option('padding', {
      alias: 'd',
      type: 'number',
      description: 'Padding between bars',
      default: 1
    })

    // Styling options
    .option('color', {
      alias: 'c',
      type: 'string',
      description: 'Bar color (named, hex, ANSI, or "auto" for cycling colors)',
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
        // If flag used without value, yargs passes true
        if (value === true) return '▒';
        // If value provided, use it
        if (typeof value === 'string') return value;
        // Otherwise undefined (no flag)
        return undefined;
      }
    })
    .option('scale', {
      type: 'string',
      description: 'Scale mode (auto or number for max value)',
      default: 'auto'
    })
    .option('fill-color', {
      alias: 'G',
      type: 'string',
      description: 'Color for fill character',
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

    // Data options
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

    // Structure options
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

    // Utility options
    .option('list-themes', {
      type: 'boolean',
      description: 'List all available color themes',
      default: false
    })

    // Help
    .help('help')
    .alias('help', '?')
    .version()
    .wrap(Math.min(120, yargs().terminalWidth()));
}

/**
 * Main execution
 */
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

  // If first argument is a file, read it and pass as stdin-like data
  if (args.length === 1 && typeof args[0] === 'string' && isFilePath(args[0])) {
    const filePath = args[0];
    const fileContent = reader.readFile(filePath);

    try {
      // Parse file content directly
      const parsedData = dataParser.parse(fileContent);

      // Handle auto color cycling
      let data: any = parsedData;
      if (argv.color === 'auto') {
        const AUTO_COLORS = ['red', 'green', 'yellow', 'blue', 'purple', 'cyan', 'pink', 'orange', 'marine'];
        data = parsedData.map((item: any, index: number) => {
          const color = AUTO_COLORS[index % AUTO_COLORS.length];
          if (typeof item === 'number') {
            return { value: item, color };
          }
          return { ...item, color };
        });
        delete argv.color;
      }

      const chartConfig = configBuilder.buildOptions(argv);
      const chart = new Chartscii(data, chartConfig);
      console.log(chart.create());
      return;
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      console.error(`Error: ${message}`);
      process.exit(1);
    }
  }

  try {
    const chart = await generator.generate(args, argv);
    console.log(chart);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);

    // If no input was provided, show help instead of error
    if (message.includes('No input provided') || message.includes('Empty input')) {
      parser.showHelp();
      process.exit(0);
    }

    console.error(`Error: ${message}`);
    process.exit(1);
  }
}

// Execute
run().catch(error => {
  console.error('Unexpected error:', error);
  process.exit(1);
});
