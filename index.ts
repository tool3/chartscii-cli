#!/usr/bin/env node

import yargs from 'yargs';
import chart from './commands/chart';
import { CustomizationOptions } from 'chartscii/dist/types/types';

yargs
    .command(
        ['create [data..]'],
        'create a chart',
        {},
        async argv => {
            chart(argv);
        })
    .example('$0 create $(seq 1 20)', 'creates a bar chart with 20 members')
    .example('$0 create $(seq 1 20) -c green', 'color bars green')
    .example('$0 create --ff example.json', 'creates a bar chart from a .json file')
    .option('file', { alias: 'f', type: 'string', desc: 'create chart from json file', default: '' })
    .option('sort', { alias: 's', type: 'boolean', desc: 'sort input data', default: false })
    .option('percentage', { alias: 'o', type: 'boolean', desc: 'calculate and display percentage data', default: false })
    .option('color-labels', { alias: 'd', type: 'boolean', desc: 'color labels', default: true })
    .option('reverse', { alias: 'r', type: 'boolean', desc: 'reverse the chart', default: false })
    .option('naked', { alias: 'n', type: 'boolean', desc: 'display a naked chart', default: false })
    .option('labels', { alias: 'l', type: 'boolean', desc: 'display labels', default: true })
    .option('color', { alias: 'c', type: 'string', desc: 'color of chart bars', default: '' })
    .option('title', { alias: 't', type: 'string', desc: 'chart title', default: '' })
    .option('char', { alias: 'z', type: 'string', desc: 'ascii character for bars', default: '█' })
    .option('fill', { alias: 'g', type: 'boolean', desc: 'fill bars with ascii character', default: false })
    .option('theme', { alias: 'k', type: 'string', desc: 'chart theme', default: '' })
    .option('max-value', { alias: 'm', type: 'number', desc: 'maximum value for scaling', default: 0 })
    .option('width', { alias: 'w', type: 'number', desc: 'chart width', default: 50 })
    .option('height', { alias: 'h', type: 'number', desc: 'chart height', default: 20 })
    .option('bar-size', { alias: 'b', type: 'number', desc: 'size of chart bars', default: 1 })
    .option('padding', { alias: 'p', type: 'number', desc: 'chart padding', default: 0 })
    .option('orientation', { alias: 'e', type: 'string', desc: 'chart orientation', default: 'horizontal' })
    .option('structure-x', { alias: 'x', type: 'string', desc: 'chart x structure', default: '═' })
    .option('structure-y', { alias: 'y', type: 'string', desc: 'chart y structure', default: '╢' })
    .option('structure-axis', { alias: 'a', type: 'string', desc: 'chart axis structure', default: '║' })
    .option('structure-bottom-left', { alias: 'q', type: 'string', desc: 'chart bottom left structure', default: '╚' })
    .demandCommand(1, '')
    .help()
    .wrap(82)
    .argv
