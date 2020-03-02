#!/usr/bin/env node

const yargs = require('yargs');
const chart = require('./commands/chart');

yargs
    .command(
        ['create [data..]'],
        'create a chart',
        {},
        async argv => {
            chart(argv);
        })
    .example('$0 create $(seq 1 20)', 'creates a bar chart with 20 memebers')
    .example('$0 create --ff example.json', 'creates a bar chart from a .json file')
    .example('$0 create $(seq 1 20) -c green', 'creates a bar chart from a .json file')
    .option('label', { alias: 'l', type: 'string', desc: 'chart label' })
    .option('width', { alias: 'w', type: 'number', default: 100, desc: 'chart width' })
    .option('color', { alias: 'c', type: 'string', desc: 'color of chart bars' })
    .option('naked', { alias: 'n', type: 'boolean', default: false, desc: 'naked chart' })
    .option('color-labels', { alias: 'cl', type: 'boolean', default: false, desc: 'color labels' })
    .option('percentage', { alias: 'p', type: 'boolean', default: false, desc: 'show percentage data' })
    .option('fill', { alias: 'f', type: 'boolean', default: false, desc: 'ascii character for bars fill' })
    .option('from-file', { alias: 'ff', type: 'string', desc: 'create chart from .json file' })
    .option('char', { alias: 'ch', type: 'string', default: '█', desc: 'ascii character for bars' })
    .demandCommand(1, '')
    .help()
    .wrap(82)
    .argv