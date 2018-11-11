# Site Configuration Generator
A tool used for parsing excel files into json objects and converting them to site configuration format.

##Installation:

Clone the repo and take note of the install directory.

Make sure you have the latest version of node installed globally

Navigate in the terminal to where you cloned this repo.

Type npm init in terminal to initialize the package. 

You should now have a package.json file with a section showing dependencies and their version.

Type npm install chalk and npm install readline-sync.

Type npm install convert-excel-to-json 
You should now have all the necessary dependencies.  Check your package.json file to verify.


##Notes on usage:

Copy the site config into the config folder.  Make sure there is only one file in the config folder at a time.

The program scans this folder and returns the first file found here to parse.
    
To run: type "node ssn_parser.js" from the root directory in terminal.

All commands must be made through the terminal.

Use the format shown when questions are asked or the program will crash or produce incorrect results.

Question answers are case sensitive.

When specifying the range from the excel file include the header label and links. See screenshot (ss1.png).

Configurations using logogram symbols will have their ssn text parsed as: item0,item1,item2 etc.

Urls will be auto parsed according to the correct format but verify in case there are missing conditions.

I will update as needed!
    
![Alt text](https://raw.githubusercontent.com/tmstani23/Site-Config-Generator/master/screenshots/ss1.png)


