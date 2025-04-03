require("dotenv").config();
const cheerio = require("cheerio");
const axios = require("axios");
const mailjet = require("node-mailjet");

// Environment variables
const email = process.env.EMAIL;
const name = process.env.NAME;
const mailjetApiKey = process.env.MAILJET_API_KEY;
const mailjetApiSecret = process.env.MAILJET_API_SECRET;
const url =
  "https://www.rebuy.nl/i,15186111/smartwatches/apple-watch-ultra-2-49-mm-titanium-kast-naturel-op-ocean-bandje-oranje-wi-fi-plus-cellular";

// Scrape data from the specified page
async function scrapePage(url) {
  try {
    const response = await axios.get(url);
    const html = response.data;
    const $ = cheerio.load(html);

    // Scrape the price of the product
    const price = $(".price-content--wrapper .ry-h3.mb-4").text().trim();

    console.log(`Scraped price: ${price}`);

    // Send the price via email
    // await sendEmail(price);
  } catch (err) {
    console.error(`Failed to scrape page ${url}:`, err);
  }
}

// Function to send the email with the scraped price
async function sendEmail(price) {
  const mailjetClient = mailjet.apiConnect(mailjetApiKey, mailjetApiSecret);

  const request = mailjetClient.post("send", { version: "v3.1" }).request({
    Messages: [
      {
        From: {
          Email: "enej.dev@gmail.com",
          Name: "Scraper Dev",
        },
        To: [
          {
            Email: email,
            Name: name,
          },
        ],
        Subject: "Current price of Apple Watch Ultra 2",
        TextPart: `Good morning ${name}, the price of the watch is ${price}. ${url}`,
        CustomID: "AppGettingStartedTest",
      },
    ],
  });

  request
    .then((result) => {
      console.log(result.body);
    })
    .catch((err) => {
      console.error(err.statusCode);
    });
}

scrapePage(`${url}`);
