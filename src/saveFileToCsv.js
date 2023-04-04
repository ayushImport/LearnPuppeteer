const fs = require('fs')

const sampleData1 = [{'country': 'India', 'import_partners': 'Russia,France', 'export_partners': 'Nepal,Vietnam'}, {'Economy':'3T'}]
const sampleData2 = [{'country': 'India', 'import_partners': 'Russia,France', 'export_partners': 'Nepal,Vietnam'}]

// For above sample data1, a function to convert and save it into csv file

let listOfKeys = async (data) => listOfKeys = Object.keys(data);

// Create a file and write keys

fs.writeFile(filename, listOfKeys(data) ) // TODO

for (data of sampleData1) {
    
    // TODO

}

