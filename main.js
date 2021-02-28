require("dotenv").config();
const { runActor } = require("@apify/scraper-tools");
const CrawlerSetup = require("./src/crawler_setup");
const Apify = require("apify");
const fs = require("fs");

const ObjectsToCsv = require("objects-to-csv");
const { Log } = require("apify-shared/log");
const { utils: { log } } = Apify;

const f = async function pageFunction(context) {
  const { request, log, skipLinks, jQuery: $, waitFor } = context;

  
  const address = $('[data-section-id="ad"] .section-info-line').text().trim();
  const addressAlt = $("button[data-tooltip*='address']").text().trim();
  const addressAlt2 = $("button[data-item-id*='address']").text().trim();
  const secondaryAddressLine = $('[data-section-id="ad"] .section-info-secondary-text').text().replace('Located in:', '').trim();
  const secondaryAddressLineAlt = $("button[data-tooltip*='locatedin']").text().replace('Located in:', '').trim();
  const secondaryAddressLineAlt2 = $("button[data-item-id*='locatedin']").text().replace('Located in:', '').trim();
  const phone = $('[data-section-id="pn0"].section-info-speak-numeral').length
      // @ts-ignore
      ? $('[data-section-id="pn0"].section-info-speak-numeral').attr('data-href').replace('tel:', '')
      : $("button[data-tooltip*='phone']").text().trim();
  const phoneAlt = $('button[data-item-id*=phone]').text().trim();


  const rdata = {
    Title: $('h1.section-hero-header-title-title').text().trim(),
    subTitle: $('section-hero-header-title-subtitle').first().text().trim() || null,
    totalScore: $('span.section-star-display').eq(0).text().trim(),
    categoryName: $('[jsaction="pane.rating.category"]').text().trim(),
    address: address || addressAlt || addressAlt2 || null,
    plusCode: $('[data-section-id="ol"] .widget-pane-link').text().trim()
        || $("button[data-tooltip*='plus code']").text().trim()
        || $("button[data-item-id*='oloc']").text().trim() || null,
    website: $('[data-section-id="ap"]').length
        ? $('[data-section-id="ap"]').eq(0).text().trim()
        : $("button[data-tooltip*='website']").text().trim()
        || $("button[data-item-id*='authority']").text().trim() || null,
    phone: phone || phoneAlt || null,
  };

  return rdata;
  
};


Apify.main(async () => {

  // clear storage from previous scrape. 
  // only uncomment it during testing
  fs.rmdirSync("./apify_storage", { recursive: true });

  // Read input from json
  let rawdata = fs.readFileSync('INPUT.json');
  let user_input = JSON.parse(rawdata);

  
  user_input.pageFunction= "" + f;
  
  await Apify.setValue("INPUT", user_input);

  log.debug("Reading INPUT.");
  const input = await Apify.getInput();
  if (!input) throw new Error("INPUT cannot be empty!");

  // Get crawler setup and startup options.
  const setup = new CrawlerSetup(input);
  log.info(`Configuring ${setup.name}.`);
  const crawler = await setup.createCrawler();

  log.info("Configuration completed. Starting the scrape.");
  await crawler.run();
  log.info(`${setup.name} finished.`);
  const dataset = await Apify.openDataset();
  const data = await dataset.getData();
  console.log("***************************************");
  console.log(data.items);
  console.log("***************************************");
  await new ObjectsToCsv(data.items).toDisk("./all_scrape_result_sulekha.csv");
});


