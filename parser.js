'use strict';
const excelToJson = require('convert-excel-to-json');
const readline = require('readline-sync');
const chalk = require('chalk');



//const LABELS_STRING = "Products Applications Support";
let linksArr = [];
let namesArr = [];
let isEnglish = true;
let labelsArr = [];
let itemLabels = [];
//let parsedSegments = [];
let idsArr = [];
let idString = "";
let labelText = [];
let categoriesText = [];

let parsedSegments = [ 
	{"themeConfig Request":
		[
			{
				"B":"製品",
				"C":"(Provide link in this cell, only if no dropdown is desired)"},
			{
				"B":"ネクスケア™ 製品 / ばんそうこう・テープ製品",
				"C":"[CORP_FUZEExp_JP_All3MProducts]?N=5002385+8709316+8711017+8711752+3294803017&rt=r3"},
			{
				"B":"フツロ™ 製品 / サポーター製品",
				"C":"[CORP_FUZEExp_JP_All3MProducts]?N=5002385+8709316+8711017+8711744+3294803017&rt=r3"},
			{
				"B":"スキンケア製品",
				"C":"[CBG_PersonalHealthCare_Skincare_JP]"},
			{
				"B":"すべて表示",
				"C":"[CORP_FUZEExp_JP_All3MProducts]?N=5002385+8710669+8711017+8721561+3294803017&rt=r3"}
		]
	}, 
	{"themeConfig Request":
		[
			{
				"B":"ソリューション"},
			{
				"B":"おむつかぶれ対策",
				"C":"[CBG_PersonalHealthCare_Solutions_DiaperRash_JP]"},
			{
				"B":"ハンドケア",
				"C":"[CBG_PersonalHealthCare_Solutions_HandCare_JP]"},
			{
				"B":"すべて表示",
				"C":"[CBG_PersonalHealthCare_Solutions_JP]"}
		]
	},
	{"themeConfig Request":
		[
			{"B":"サポート"
			},
			{"B":"お問い合わせ",	
			"C":"CBG_PersonalHealthCare_Support_ContactUs_JP"
			}
		]
	}
];

// B46:C50
// B51:C54
// B55:C56

function setLanguage (ssnLanguage) {
	if(ssnLanguage === "no") {
		isEnglish = false;
	}
}

function createSegments() {
	parsedSegments = [];
	const ssnLanguage = readline.question("Is the SSN in English? (yes/no)");
	//set language if not english:
	setLanguage(ssnLanguage);
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
	//console.log(JSON.stringify(parsedSegments));
	parseSsnObject(parsedSegments);
}

function parseSsnObject(parsedSegments) {
	//iterate through all the objects in the parsedSegments array
	parsedSegments.forEach((element, index) => {
		let valuesObj = (Object.values(element));
		
		for (var key in valuesObj) {
			if (valuesObj.hasOwnProperty(key)) {
				let labelObj = valuesObj[key];
				//console.log(labelObj);
				//console.log(labelObj[0]);
				 
				
				let label = labelObj[0].B;
				let item = "";
				
				
				let labelText = `psn.manual.${label.substr(0,4).toLowerCase()}.name = ${label}`;
				let labelTextUrl = `psn.manual.${label.substr(0,4).toLowerCase()}.url = #`;
				
				
				if(isEnglish === false) {
					item = `item${index}`;
					labelText = `psn.manual.item${index}.name = ${label}`;
					labelTextUrl = `psn.manual.item${index}.url = #`;
					itemLabels.push(item);
				}
				//console.log(label);
				labelsArr.push(label);
				
				categoriesText.push(labelText, labelTextUrl)

				for (let i = 0; i<labelObj.length; i++) {
					
					if (!i==0) {
						
						let linkName = labelObj[i].B;
						let linkUrl = formatUrl(labelObj[i].C);
						
						genSsnText(label, linkName, linkUrl, i, item);
					}
				}
			}
		}
		
	});
	genIdString(labelsArr, itemLabels)
	let parsedSsn = categoriesText.join("\n");
	console.log(chalk.magenta(parsedSsn));
	//console.log(labelsArr);
	//console.log(namesArr);
	//console.log(linksArr);
	return parsedSsn;
	
}
function genSsnText(label, linkName, linkUrl, i, item) {
	let nameText = "";
	let urlText = "";
	
	if (isEnglish === true) {
		nameText = `psn.manual.${label.substr(0,4).toLowerCase()}.name.${i} = ${linkName}`;
		urlText = `psn.manual.${label.substr(0,4).toLowerCase()}.url.${i} = ${linkUrl}`;
	}
	else if (isEnglish == false) {
		
		nameText = `psn.manual.${item}.name.${i} = ${linkName}`;
		urlText = `psn.manual.${item}.url.${i} = ${linkUrl}`;
		
	}

	categoriesText.push(nameText, urlText);
	
	
}

//function to generate ssn id string
function genIdString (labelsArr, itemLabels) {
	if(isEnglish === true) {
		idString = `psn.manual.ids = ${labelsArr.map(
			(val) => val.substr(0,4)
		).join(", ").toLowerCase()}`;
	}
	else if (isEnglish === false) {
		idString = `psn.manual.ids = ${itemLabels.map(
			(val) => val)}`;
	}
	
	//console.log(idString);
	categoriesText.unshift(idString);
	return idString;
}
function formatUrl(url) {
	
	if (url[0] !== "[") {
		url = `[${url}`;
	}
	if (!url.includes("?N") && url.charAt(url.length - 1) != "]") {
		url = `${url}]`;
	}
	if (url.includes("?N") && !url.includes("]?N")) {
		let insertBracketAt = url.indexOf("?N");
		url = url.slice(0, insertBracketAt) + "]" + url.slice(insertBracketAt);
		// console.log(insertBracketAt);
	}
	if(url[1] != "U") {
		
		url = url.slice(0, 1) + "URL." + url.slice(1);
	}
	
	//console.log(url);
	return url;
}
//formatUrl("[CORP_FUZEExp_JP_All3MProducts?N=5002385+8710669+8711017+8721561+3294803017&rt=r3")


createSegments()
//parseSsnObject(parsedSegments);

