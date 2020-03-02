const Chartscii = require('chartscii');
const fs = require('fs');

const chart = (argv) => {
    let { data } = argv;

    if (argv.fromFile) {
        data = JSON.parse(fs.readFileSync(argv.fromFile));
    }
    
    if (argv.fill) {
        argv.fill = '░';
    }

    const chart = new Chartscii(data, { ...argv });
    console.log(chart.create());
}

module.exports = chart;