#!/usr/bin/env node

const yargs = require('yargs');

yargs
    .config(
        {
            // config here
            // will be available on argv
        })
    .command(
        ['some_command <name>', 'l'],
        'some_command description',
        { op: { alias: 'o', type: 'boolean', desc: 'option #1' } },
        async argv => {
            console.log(argv, 'some_command_to_execute');
        })
    .example('$0 some_command', 'get pods list in env')
    .option('some_option', { alias: 's', type: 'boolean', default: false, desc: 'some option', required: true })
    .demandCommand(1, '')
    .help()
    .wrap(72)
    .argv