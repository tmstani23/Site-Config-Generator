'use strict';
const excelToJson = require('convert-excel-to-json');
const readline = require('readline-sync');
const chalk = require('chalk');

let isEnglish = true;
let labelsArr = [];
let itemLabels = [];
let idString = "";
let footerText = [];
let parsedSegments = [];


// B82:C86
// B110:C111


//Set language variable to false if footer Language = "no"
const setLanguage = () => { 
	//Take user input from console and save to a variable:
	const footerLanguage = readline.question("Is the footer without logogram symbols? (yes/no)");
	footerLanguage === "no" ? isEnglish = false : isEnglish = true;
	return createSegments();
}

function createSegments() {
	parsedSegments = [];
	
	//Store number of labels to parse from footer as a variable:
	const numLabels = readline.question("How many labels are there?");
	//Parse each segment of the excel file based on the number of labels
	for(let i=0; i<numLabels; i++) {
		//parse each range into a separate object
		let labelRange = readline.question("What is the range of the label and its links? (ex:B66:C85)");
		let segment = excelToJson({
			sourceFile: 'test_config3.xlsx',
			range: labelRange, //'B82:C86'
			sheets: ['themeConfig Request']
		});
		//Add each object to the parsedSegments array
		parsedSegments.push(segment)
	}
	//console.log(JSON.stringify(parsedSegments));
	return parseFooterObject(parsedSegments);
}

function parseFooterObject(parsedSegments) {
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
				//If not english set label to item plus an index
				if(isEnglish === false) {
					item = `item${index}`;
					//save item labels to an array
					itemLabels.push(item);
					//add footer label identifier to each section
footerText.push(`
#${itemLabels[index]}`)
				}
				
				//Add the header labels to a labels array
				labelsArr.push(label);
				//add footer label identifier to each section and save to footer text array:
footerText.push(`
#${labelsArr[index]}`)
				//Loop through each label object
				for (let i = 0; i<labelObj.length; i++) {
					//If not the first label which is the header:
					if (!i==0) {
						//set link name and url to the object value with key B
						let linkName = labelObj[i].B;
						//format the url at key C to fit standards
						let linkUrl = formatUrl(labelObj[i].C);
						
						//generate the remaining footer text
						genfooterText(label, linkName, linkUrl, i, item);
					}
				}
			}
		}
		
	});
	//generate the id string
	genIdString(labelsArr, itemLabels)
	//join the final array and separate each array element with a new line
	let parsedfooter = footerText.join("\n");
	console.log(chalk.blue(parsedfooter));
	
	return parsedfooter;
	
}
//Function that takes all the parsed input variables and returns the correct footer text strings
function genfooterText(label, linkName, linkUrl, i, item) {
	let nameText = "";
	let urlText = "";
	//If in english return the name text and string text based on the matching header label
	if (isEnglish === true) {
		nameText = `footer.site.${label.substr(0,4).toLowerCase()}.name.${i} = ${linkName}`;
		urlText = `footer.site.${label.substr(0,4).toLowerCase()}.url.${i} = ${linkUrl}`;
	}
	//If not in English return the name and url text with item and id number
	else if (isEnglish == false) {
		
		nameText = `footer.site.${item}.name.${i} = ${linkName}`;
		urlText = `footer.site.${item}.url.${i} = ${linkUrl}`;
		
	}
	//Save the name and link text to the footer text array
	footerText.push(nameText, urlText);		
}

//function to generate footer id string
function genIdString (labelsArr, itemLabels) {
    
    if(isEnglish === true) {
		//set the id string as corresponding label shortened to 4 characters
		idString = `footer.site.categories = ${labelsArr.map(
			(val) => `${val.substr(0,4).toLowerCase()} | ${val}`
		).join(", ")}`;
	}
	else if (isEnglish === false) {
		idString = `footer.site.categories = ${itemLabels.map(
			(val) => `${val}|${val.charAt(0).toUpperCase() + val.slice(1)}`)}`;
	}

	//Save id string at the beginning of footerText array
    footerText.unshift(idString);
    footerText.unshift(parseSiteName());
	return idString;
}
function parseSiteName() {
    let siteNameRange = readline.question("What is the range of the footer site name label? (ex:B79:B79)");
    let parsedSiteName = [];
    let label = "";
    let siteName = excelToJson({
        sourceFile: 'test_config2.xlsx',
        range: siteNameRange, //'B82:C86'
        sheets: ['themeConfig Request']
    });
    parsedSiteName.push(siteName);
    parsedSiteName.forEach((element, index) => {
		let valuesObj = (Object.values(element));
		//loop through each key in each object
		for (var key in valuesObj) {
			if (valuesObj.hasOwnProperty(key)) {
                let labelObj = valuesObj[key];
				//Set header label
				label = `footer.site.name = ${labelObj[0].B}`
                //console.log(label);
                
            }    
        }
    })            
    //console.log(siteName);
    return label;
    //console.log(siteName.values.keys.B)

}
//Format the urls based on correct snn url format
function formatUrl(url) {
	//if no bracket at beginning of url add one
    if(url === "undefined") {
        return;
    }
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
	//console.log(url);
	return url;
}
//formatUrl("[CORP_FUZEExp_JP_All3MProducts?N=5002385+8710669+8711017+8721561+3294803017&rt=r3")
//console.log(formatUrl("URL.CORP_FUZEExp_US_All3MProducts~/All-3M-Products/Home-Care-Cleaning/Consumer/?N=5002385+8709316+8710658+8711017+3294857497&rt=r3"));
// URL.CORP_FUZEExp_US_All3MProducts]~/All-3M-Products/Home-Care-Cleaning/Consumer/?N=5002385+8709316+8710658+8711017+3294857497&rt=r3
//parseSiteName();
//createSegments()
//parsefooterObject(parsedSegments);
setLanguage();
//formatUrl("Käyttökohteet")

