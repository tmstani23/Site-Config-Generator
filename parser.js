'use strict';
const excelToJson = require('convert-excel-to-json');
const readline = require('readline-sync');


//let labelRange = readline.question("What is the first range?");
//let linkRange = readline.question("What is the link range?");
//let LABELS_STRING = readline.question("Enter labels");

let LABELS_STRING = "Products Applications Support"
// function result = excelToJson({
// 	sourceFile: 'test_config.xlsx',
// 	range: `${labelRange}:${linkRange}`, //'B82:C86'
// 	sheets: ['themeConfig Request']
// });

//function to generate ssn id string
function genIdString (labelsArr) {
	const idString = `psn.manual.ids = ${labelsArr.map(
		(val, index) => val.substr(0,4)
	).join(", ").toLowerCase()}`;
	console.log(idString);
	return idString;
}
//save labels to an array
function storeLabels(labelStr) {
	//Create array of labels
	let labelsArr = labelStr.split(" ");

	console.log(labelsArr);
	return labelsArr;
}
function storeIds(labelsArr) {
	
	const idsArr = labelsArr.map((val) =>
		val.substr(0,4).toLowerCase()
	);
	console.log(idsArr);
	return idsArr;
}

function genSsnNames(labelsArr, idsArr) {
	//const categoriesText = [];
	//loop through labels and generate text segment for each
	
	const categoriesText = labelsArr.map((val,index)=> {
		index === 0 
		? `psn.manual.${val[index].substr(0,4).toLowerCase()}.name = ${val[index]}`
		: `psn.manual.${val[index].substr(0,4).toLowerCase()}.name.${index} = `
	})
	console.log(categoriesText);
	return categoriesText;
}
// function genSsnUrls(labelsArr) {

// 	//loop through labels and generate text segment for each
// 	for (let i=0; i<labelsArr.length; i++) {
		
// 		let urlText = `psn.manual.${labelsArr[i].substr(0,4).toLowerCase()}.url = ${labelsArr[i]}`
// 		categoriesText.push(text);
// 	}
// }



//console.log(getRange("B82", "C86"));
//console.log(labelRange, linkRange);
//console.log(JSON.stringify(result, null, 4));

//console.log(genId("product", 2));
//console.log(genIdString("product", ))
//storeLabels(LABELS_STRING);
//genIdString(storeLabels(LABELS_STRING))
genSsnNames(storeLabels(LABELS_STRING));
//storeIds(storeLabels(LABELS_STRING));