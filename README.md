# Concurrent Web Crawler

A simple Node.js CLI tool to crawl a website, find all internal links, and export the results into a JSON report. It uses a concurrency limit so you don't accidentally DDOS the site you're trying to scrape.
## How to use it

First, make sure you have your dependencies installed:

`npm install`


To run the crawler, you need to provide three specific arguments: the Base URL, the Max Concurrency, and the Max Pages limit.

`npm run start <BASE_URL> <MAX_CONCURRENCY> <MAX_PAGES>`

## How it works

* Validation: It checks if you passed the right amount of arguments. If not, it'll kill the process and let you know
* Crawling: It kicks off the crawlSiteAsync function. This handles the logic of visiting the baseURL and keeping the worker count under your maxConcurrency limit
* Reporting: Once the crawling finishes, it counts the unique pages found and triggers writeJSONReport to save the data.

## Output

When it finishes, look for a new JSON file in your project folder. That's the report containing all the crawled page data.
