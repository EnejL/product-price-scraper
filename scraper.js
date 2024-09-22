require('dotenv').config();
const cheerio = require('cheerio');
const axios = require('axios');
const mailjet = require('node-mailjet')

// Environment variables
const email = process.env.EMAIL;
const name = process.env.NAME;
const mailjetApiKey = process.env.MAILJET_API_KEY;
const mailjetApiSecret = process.env.MAILJET_API_SECRET;
const url = "https://www.amazon.nl/-/en/dp/B0CVHHJ18D/?coliid=I3Q3CRV384RJQW&colid=1ZLJD8L1QFESH&ref_=list_c_wl_lv_ov_lig_dp_it&th=1";

// Scrape data from the specified page
async function scrapePage(url) {
    try {
        const response = await axios.get(url);
        const html = response.data;
        const $ = cheerio.load(html);

        // Scrape the price of the product
        const price = $("span.a-price-whole").text().trim();

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

    const request = mailjetClient
        .post("send", { 'version': 'v3.1' })
        .request({
            "Messages": [
                {
                    "From": {
                        "Email": "enej.dev@gmail.com",
                        "Name": "Scraper Dev"
                    },
                    "To": [
                        {
                            "Email": email,
                            "Name": name
                        }
                    ],
                    "Subject": "Current price of Apple Watch Ultra 2",
                    "TextPart": `Good morning ${name}, the price of the watch is ${price}. ${url}`,
                    "CustomID": "AppGettingStartedTest"
                }
            ]
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
