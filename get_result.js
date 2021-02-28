const Apify = require("apify");
require("dotenv").config();
const ObjectsToCsv = require("objects-to-csv");

Apify.main(async () => {
    const dataset = await Apify.openDataset();
    const data = await dataset.getData();
    const dup_check_arr = [];
    const final_list = [];
    data.items.forEach((ele)=>{
      if(!dup_check_arr.includes(ele['Phone'].toLowerCase())){
        dup_check_arr.push(ele['Phone'].toLowerCase());
        final_list.push(ele);
      }
    });
    await new ObjectsToCsv(final_list).toDisk("./scrape_intermediate_result_sulekha.csv");
});
  
  
  