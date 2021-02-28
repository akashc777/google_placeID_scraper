const Apify = require("apify");
require("dotenv").config();
const ObjectsToCsv = require("objects-to-csv");

Apify.main(async () => {
    const dataset = await Apify.openDataset();
    const data = await dataset.getData();
    
    await new ObjectsToCsv(data.items).toDisk("./scrape_intermediate_all_result_sulekha.csv");
});
  
  
  