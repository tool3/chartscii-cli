#!/usr/bin/env node

import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import fs from 'fs';
import * as generator from './generator';
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
 * Separate file paths from data arguments
 */
function separateArgs(args: Array<string | number>): { files: string[], data: Array<string | number> } {
  const files: string[] = [];
  const data: Array<string | number> = [];

  for (const arg of args) {
    if (typeof arg === 'string' && isFilePath(arg)) {
      files.push(arg);
    } else {
      data.push(arg);
    }
  }

  return { files, data };
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
    .example('$0 -f data.json', 'Create chart from file (explicit)')
    .example('$0 1 2 3 -c green -t "My Chart"', 'Chart with options')
    .example('$0 1 2 3 -e vertical -w 50', 'Vertical chart')

    // Input options
    .option('file', {
      alias: 'f',
      type: 'string',
      description: 'Read chart data from file (JSON or CSV)',
      requiresArg: true
    })

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
      alias: 'd',
      type: 'boolean',
      description: 'Color labels',
      default: true
    })
    .option('percentage', {
      alias: 'o',
      type: 'boolean',
      description: 'Display percentages',
      default: false
    })

    // Layout options
    .option('orientation', {
      alias: 'e',
      type: 'string',
      description: 'Chart orientation',
      choices: ['horizontal', 'vertical'],
      default: 'horizontal'
    })
    .option('width', {
      alias: 'w',
      type: 'number',
      description: 'Chart width',
      default: 80
    })
    .option('height', {
      alias: 'h',
      type: 'number',
      description: 'Chart height',
      default: 20
    })
    .option('bar-size', {
      alias: 'b',
      type: 'number',
      description: 'Bar size (thickness)',
      default: 1
    })
    .option('padding', {
      alias: 'p',
      type: 'number',
      description: 'Padding between bars',
      default: 1
    })

    // Styling options
    .option('color', {
      alias: 'c',
      type: 'string',
      description: 'Bar color (named, hex, or ANSI)',
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
      alias: 'g',
      type: 'string',
      description: 'Fill character for empty space',
      default: ''
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
  try {
    const argv = createParser().argv as unknown as CLIOptions;
    const args = argv._ || [];

    // Separate files from data
    const { files, data } = separateArgs(args);

    // If files detected, use the first one
    if (files.length > 0 && !argv.file) {
      argv.file = files[0];
    }

    const chart = await generator.generate(data, argv);
    console.log(chart);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`Error: ${message}`);
    process.exit(1);
  }
}

// Execute
run().catch(error => {
  console.error('Unexpected error:', error);
  process.exit(1);
});
