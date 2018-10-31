'use strict';
const excelToJson = require('convert-excel-to-json');
const readline = require('readline-sync');


//let labelRange = readline.question("What is the first range?");
//let linkRange = readline.question("What is the link range?");
//let LABELS_STRING = readline.question("Enter labels");

const LABELS_STRING = "Products Applications Support";
let linksArr = ["[URL.SGB_RoadSafety_DocumentLibrary_AU]","[URL.CORP_FUZEExp_Safety_Stories_AU]?key=c-Science%20of%20Road%20Safety",
"[URL.SGB_RoadSafety_ScienceofRoadSafety_ScienceOfRoadSafetyVideoSeries_AU]","[URL.SGB_RoadSafety_ReflectiveCertifiedPartners_AU]"];
let namesArr = ["Contact Us", "FAQ", "Where to Buy", "Warranty Registration"];

let labelsArr = [];
let idsArr = [];
let idString = "";
let labelText = [];
let categoriesText = [];
// function result = excelToJson({
// 	sourceFile: 'test_config.xlsx',
// 	range: `${labelRange}:${linkRange}`, //'B82:C86'
// 	sheets: ['themeConfig Request']
// });

//function to generate ssn id string
function genIdString (labelsArr) {
	idString = `psn.manual.ids = ${labelsArr.map(
		(val) => val.substr(0,4)
	).join(", ").toLowerCase()}`;
	//console.log(idString);
	return idString;
}
//save labels to an array
function storeLabels(labelStr) {
	//Create array of labels
	labelsArr = labelStr.split(" ");

	//console.log(labelsArr);
	return labelsArr;
}
function storeIds(labelsArr) {
	
	idsArr = labelsArr.map((val) =>
		val.substr(0,4).toLowerCase()
	);
	//console.log(idsArr);
	return idsArr;
}

function genSsnLabels(labelsArr, idsArr) {
	
	//loop through labels and generate text segment for each
		
	labelText = labelsArr.map((val,index)=> {
		let mappedStr = "";
		mappedStr = `psn.manual.${idsArr[index].substr(0,4).toLowerCase()}.name = ${val}`
	
		return mappedStr;
	})
	console.log(labelText);
	//console.log(labelsArr, idsArr);
	return labelText;
}
function genSsnLinks(labelsArr, linksArr) {
	let nameText = "";
	let urlText = "";
	//loop through the labels
	for(let i=0; i<labelsArr.length;i++){
		//loop through labels and generate text segment for each
		for (let ii=0; ii<linksArr.length; ii++) {
			nameText = `psn.manual.${labelsArr[i].substr(0,4).toLowerCase()}.name = ${namesArr[ii]}`
			urlText = `psn.manual.${labelsArr[i].substr(0,4).toLowerCase()}.url = ${linksArr[ii]}`
			
			categoriesText.push(nameText, urlText);
		}
	}
	console.log(categoriesText);
}



//console.log(getRange("B82", "C86"));
//console.log(labelRange, linkRange);
//console.log(JSON.stringify(result, null, 4));

//console.log(genId("product", 2));
//console.log(genIdString("product", ))
//storeLabels(LABELS_STRING);
//genIdString(storeLabels(LABELS_STRING))
storeLabels(LABELS_STRING);
storeIds(storeLabels(LABELS_STRING));
genIdString(labelsArr)
//genSsnCategory(labelsArr, idsArr);
genSsnLinks(labelsArr, linksArr);
