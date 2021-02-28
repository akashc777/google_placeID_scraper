let categoryArray = [];
const parse = require('csv-parse/lib/sync');
const fs = require('fs');

const csvData = fs.readFileSync('sulekha_urls_blr_Inverter_UPS.csv', 'utf8');

const records = parse(csvData, {
    columns: true,
    skip_empty_lines: true
});

console.log(records);

records.forEach(element => {
    categoryArray.push(element.url.split('/')[3]);
});

let rawdata = fs.readFileSync('INPUT.json');
let user_input = JSON.parse(rawdata);
user_input.categoryArray = categoryArray;

fs.writeFileSync("INPUT.json", JSON.stringify(user_input,null, '\t')); 
