'use strict';
const excelToJson = require('convert-excel-to-json');
const readline = require('readline-sync');
const chalk = require('chalk');

let isEnglish = true;
let labelsArr = [];
let itemLabels = [];
let idString = "";
let ssnText = [];

//add path that includes all files in/config to use as a variable in parseSegments

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
//Set language variable to false if ssnLanguage = "no"
const setLanguage = () => { 
	//Take user input from console and save to a variable:
	const ssnLanguage = readline.question("Is the ssn without logogram symbols? (yes/no)");
	ssnLanguage === "no" ? isEnglish = false : isEnglish = true;
	return createSegments();
}

function createSegments() {
	parsedSegments = [];
	
	//Store number of labels to parse from ssn as a variable:
	const numLabels = readline.question("How many labels are there?");
	//Parse each segment of the excel file based on the number of labels
	for(let i=0; i<numLabels; i++) {
		//parse each range into a separate object
		let labelRange = readline.question("What is the range of the label and its links? (ex:B66:C85)");
		let segment = excelToJson({
			sourceFile: "test_config3.xlsx",
			range: labelRange, //'B82:C86'
			sheets: ['themeConfig Request']
		});
		//Add each object to the parsedSegments array
		parsedSegments.push(segment)
	}
	//console.log(JSON.stringify(parsedSegments));
	return parseSsnObject(parsedSegments);
}

function parseSsnObject(parsedSegments) {
	//iterate through all the objects in the parsedSegments array
	parsedSegments.forEach((element, index) => {
		let valuesObj = (Object.values(element));
		//loop through each key in each object
		for (var key in valuesObj) {
			if (valuesObj.hasOwnProperty(key)) {
				let labelObj = valuesObj[key];
				//Set header label
				let label = labelObj[0].B;
				let item = "";
				//Set header text name and url
let labelText = `
psn.manual.${label.substr(0,4).toLowerCase()}.name = ${label}`;
				let labelTextUrl = `psn.manual.${label.substr(0,4).toLowerCase()}.url = #`;
				//Adjust label text and url if the ssn is not in English
				if(isEnglish === false) {
					item = `item${index}`;
					labelText = `psn.manual.item${index}.name = ${label}`;
					labelTextUrl = `psn.manual.item${index}.url = #
					
					`;
					itemLabels.push(item);
				}
				//Add the header labels to a labels array
				labelsArr.push(label);
				//Add the parsed names and urls to the final ssn text array
				ssnText.push(labelText, labelTextUrl)
				//Loop through each label object
				for (let i = 0; i<labelObj.length; i++) {
					//If not the first label which is the header:
					if (!i==0) {
						//set link name and url
						let linkName = labelObj[i].B;
						//format the url to fit standards
						let linkUrl = formatUrl(labelObj[i].C);
						//generate the remaining ssn text
						genSsnText(label, linkName, linkUrl, i, item);
					}
				}
			}
		}
		
	});
	//generate the id string
	genIdString(labelsArr, itemLabels)
	//join the final array and separate each array element with a new line
	let parsedSsn = ssnText.join("\n");
	
	console.log(chalk.blue(parsedSsn));
	
	
	//console.log(labelsArr);
	//console.log(namesArr);
	//console.log(linksArr);
	return parsedSsn;
	
}
//Function that takes all the parsed input variables and returns the correct ssn text strings
function genSsnText(label, linkName, linkUrl, i, item) {
	let nameText = "";
	let urlText = "";
	//If in english return the name text and string text based on the matching header label
	if (isEnglish === true) {
		nameText = `psn.manual.${label.substr(0,4).toLowerCase()}.name.${i} = ${linkName}`;
		urlText = `psn.manual.${label.substr(0,4).toLowerCase()}.url.${i} = ${linkUrl}`;
	}
	//If not in English return the name and url text with item and id number
	else if (isEnglish == false) {
		
		nameText = `psn.manual.${item}.name.${i} = ${linkName}`;
		urlText = `psn.manual.${item}.url.${i} = ${linkUrl}`;
		
	}
	//Save the name and link text to the ssn text array
	ssnText.push(nameText, urlText);
	
	
}

//function to generate ssn id string
function genIdString (labelsArr, itemLabels) {
	if(isEnglish === true) {
		//set the id string as corresponding label shortened to 4 characters
		idString = `psn.manual.ids = ${labelsArr.map(
			(val) => val.substr(0,4)
		).join(", ").toLowerCase()}`;
	}
	else if (isEnglish === false) {
		idString = `psn.manual.ids = ${itemLabels.map(
			(val) => val)}`;
	}
	
	//Save id string at the beginning of ssnText array
	ssnText.unshift(idString);
	return idString;
}
//Format the urls based on correct snn url format
function formatUrl(url) {
	if(url === "undefined") {
		return;
	}
	//if no bracket at beginning of url add one
	if (url[0] !== "[") {
		url = `[${url}`;
	}
	//if the url includes ?N and not ~ add a bracket at the end of the url
	if (!url.includes("?N") && url.charAt(url.length - 1) != "]" && !url.includes("~")) {
		url = `${url}]`;
	}
	//if the url includes ?N and not ]?N and not a ~ add a bracket before the ?N
	if (url.includes("?N") && !url.includes("]?N") && !url.includes("~")) {
		let insertBracketAt = url.indexOf("?N");
		url = url.slice(0, insertBracketAt) + "]" + url.slice(insertBracketAt);
	}
	//if the url includes a ~ and not a bracket before the ~ add a bracket before the ~
	if (url.includes("~") && !url.includes("]~")) {
		let insertBracketAt = url.indexOf("~");
		url = url.slice(0, insertBracketAt) + "]" + url.slice(insertBracketAt);
	}
	//If the second character of the url is not a U add URL starting at the second character
	if(url[1] != "U") {
		url = url.slice(0, 1) + "URL." + url.slice(1);
	}
	console.log(url.charAt(url.length - 1))
	console.log(url);
	return url;
}
//formatUrl("[CORP_FUZEExp_JP_All3MProducts?N=5002385+8710669+8711017+8721561+3294803017&rt=r3")
//console.log(formatUrl("URL.CORP_FUZEExp_US_All3MProducts~/All-3M-Products/Home-Care-Cleaning/Consumer/?N=5002385+8709316+8710658+8711017+3294857497&rt=r3"));
// URL.CORP_FUZEExp_US_All3MProducts]~/All-3M-Products/Home-Care-Cleaning/Consumer/?N=5002385+8709316+8710658+8711017+3294857497&rt=r3

//createSegments()
//parseSsnObject(parsedSegments);
//formatUrl("[URL.SGB_CommercialCleaning_IN_Resources_ResourcesLibrary]")
setLanguage();

