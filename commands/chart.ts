import Chartscii from 'chartscii';
import { CustomizationOptions, InputData } from 'chartscii/dist/types/types';
import fs from 'fs';

function structure(argv: any) {
    argv.structure = {};
    argv.structure.x = argv.structureX
    argv.structure.y = argv.structureY
    argv.structure.axis = argv.structureAxis
    argv.structure.bottomLeft = argv.structureBottomLeft
}

function getPoint(point: any): InputData {
    const result = {};
    const pattern = /([a-zA-Z]+):\s*('[^']*'|[^,{}]+)/g;
    const matches = point.matchAll(pattern);

    for (const match of matches) {
        const key: string = match[1];
        const value: string = match[2];

        if (key === "value") {
            result[key] = Number(value);
            continue;
        }

        result[key] = value.replace(/['"]+/g, '');
    }

    return result as InputData;
}

function getData(data: string) {
    const inputData: InputData[] = [];

    for (const point of data) {
        if (typeof point === "number") {
            inputData.push(Number(point));
        } else {
            inputData.push(getPoint(point));
        }
    }

    return inputData;
}

function getChart(data: InputData[], options: CustomizationOptions) {
    return new Chartscii(data, options);
}

function chart(argv: any) {
    const { data } = argv;

    structure(argv);

    if (argv.file) {
        const file = fs.readFileSync(argv.file, 'utf8')

        const data = JSON.parse(file);
        const chart = getChart(data, argv);
        console.log(chart.create());
        return;
    }

    const inputData = getData(data);
    const chart = getChart(inputData, argv);
    console.log(chart.create());
}

export default chart;