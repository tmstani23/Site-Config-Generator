'use strict';
const excelToJson = require('convert-excel-to-json');
const readline = require('readline-sync');


//const LABELS_STRING = readline.question("Enter labels");
//console.log(LABELS_STRING);
//const linkRange = readline.question("What is the link range? (ex:B66:C85)");

// const parsedExcel = excelToJson({
// 	sourceFile: 'test_config.xlsx',
// 	range: linkRange, //'B82:C86'
// 	sheets: ['themeConfig Request']
// });


//const LABELS_STRING = "Products Applications Support";
let linksArr = ["[URL.SGB_RoadSafety_DocumentLibrary_AU]","[URL.CORP_FUZEExp_Safety_Stories_AU]?key=c-Science%20of%20Road%20Safety",
"[URL.SGB_RoadSafety_ScienceofRoadSafety_ScienceOfRoadSafetyVideoSeries_AU]","[URL.SGB_RoadSafety_ReflectiveCertifiedPartners_AU]"];
let namesArr = ["Contact Us", "FAQ", "Where to Buy", "Warranty Registration"];

let labelsArr = [];
let parsedSegments = [];
let idsArr = [];
let idString = "";
let labelText = [];
let categoriesText = [];
// [ 
// 	{"themeConfig Request":
// 		[
// 			{
// 				"B":"製品",
// 				"C":"(Provide link in this cell, only if no dropdown is desired)"},
// 			{
// 				"B":"ネクスケア™ 製品 / ばんそうこう・テープ製品",
// 				"C":"[CORP_FUZEExp_JP_All3MProducts]?N=5002385+8709316+8711017+8711752+3294803017&rt=r3"},
// 			{
// 				"B":"フツロ™ 製品 / サポーター製品",
// 				"C":"[CORP_FUZEExp_JP_All3MProducts]?N=5002385+8709316+8711017+8711744+3294803017&rt=r3"},
// 			{
// 				"B":"スキンケア製品",
// 				"C":"[CBG_PersonalHealthCare_Skincare_JP]"},
// 			{
// 				"B":"すべて表示",
// 				"C":"[CORP_FUZEExp_JP_All3MProducts]?N=5002385+8710669+8711017+8721561+3294803017&rt=r3"}
// 		]
// 	}, 
// 	{"themeConfig Request":
// 		[
// 			{
// 				"B":"ソリューション"},
// 			{
// 				"B":"おむつかぶれ対策",
// 				"C":"[CBG_PersonalHealthCare_Solutions_DiaperRash_JP]"},
// 			{
// 				"B":"ハンドケア",
// 				"C":"[CBG_PersonalHealthCare_Solutions_HandCare_JP]"},
// 			{
// 				"B":"すべて表示",
// 				"C":"[CBG_PersonalHealthCare_Solutions_JP]"}
// 		]
// 	},
// 	{"themeConfig Request":
// 		[
// 			{"B":"サポート"
// 			},
// 			{"B":"お問い合わせ",	
// 			"C":"CBG_PersonalHealthCare_Support_ContactUs_JP"
// 			}
// 		]
// 	}
// ]



function createSegments() {
	parsedSegments = [];
	const numLabels = readline.question("How many labels are there?");
	for(let i=0; i<numLabels; i++) {
		let labelRange = readline.question("What is the range of the label and its links? (ex:B66:C85)");
		let segment = excelToJson({
			sourceFile: 'test_config.xlsx',
			range: labelRange, //'B82:C86'
			sheets: ['themeConfig Request']
		});
		parsedSegments.push(segment)
	}
	console.log(JSON.stringify(parsedSegments));
}

//function to generate ssn id string
function genIdString (labelsArr) {
	idString = `psn.manual.ids = ${labelsArr.map(
		(val) => val.substr(0,4)
	).join(", ").toLowerCase()}`;
	console.log(idString);
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
	console.log(idsArr);
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




//console.log(parsedExcel);
createSegments()
// storeLabels(LABELS_STRING);
//storeIds(storeLabels(LABELS_STRING));

//genIdString(labelsArr)
// genSsnCategory(labelsArr, idsArr);
// genSsnLinks(labelsArr, linksArr);
