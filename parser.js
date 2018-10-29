'use strict';
const excelToJson = require('convert-excel-to-json');
const readline = require('readline-sync');


//initialize readline to process user inputs
// const rl = readline.createInterface({
//     input: process.stdin,
//     output: process.stdout
// });


let labelRange = readline.question("What is the first range?");
let linkRange = readline.question("What is the link range?");

const getRange = (labelRange, linkRange) => {
    //return range to parse
    return `${labelRange}:${linkRange}`;
}

const result = excelToJson({
	sourceFile: 'test_config.xlsx',
	range: `${labelRange}:${linkRange}`, //'B82:C86'
	sheets: ['themeConfig Request']
});



//console.log(getRange("B82", "C86"));
console.log(labelRange, linkRange);
console.log(JSON.stringify(result, null, 4));

//rl.close();



