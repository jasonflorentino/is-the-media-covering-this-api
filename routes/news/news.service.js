const axios = require('axios');
const { makeError: error } = require('../../_helpers/error_handler');

module.exports = {
  searchNewscatcher,
  searchNewsApi,
  searchGoogle,
};

// Handlers

async function searchNewscatcher(query) {
  if (!query) throw error(400, "You must provide a query string 'q' to search.");

  const options = getNewscatcherRequestOptions(query);
  let response; 
  try {
    response = await axios.request(options);
  } catch (e) {
    throw error(500, e.message, e.name);
  }

  if (response.status !== 200) throw error(500, "An error occurred during the search.");
  return processNewscatcherResponse(response.data);
}

async function searchNewsApi(query) {
  if (!query) throw error(400, "You must provide a query string 'q' to search.");

  const options = getNewsApiRequestOptions(query);
  let response; 
  try {
    response = await axios.request(options);
  } catch (e) {
    throw error(500, e.message, e.name);
  }
  
  if (response.status !== 200) throw error(500, "An error occurred during the search.");
  return processNewsApiResponse(response.data);
}

async function searchGoogle(query, page = 1) {
  if (!query) throw error(400, "You must provide a query string 'q' to search.");
  if (page > 10) throw error(400, "Due to Google restrictions we can't get more than 100 results.");
  console.log("--QUERY--\n", query);

  const options = getGoogleRequestOptions(query, page);
  let response; 
  try {
    response = await axios.request(options);
  } catch (e) {
    throw error(500, e.message, e.name);
  }

  if (response.status !== 200) throw error(500, "An error occurred during the search.");
  if (!response.data.items) throw error(500, "Couldn't find any results.");
  return  processGoogleResponse(response.data);
}

// Helpers - Newscatcher

function getNewscatcherRequestOptions(query) {
  return {
    method: 'GET',
    url: process.env.NEWSCATCHER_API_URL,
    params: {q: query, lang: 'en'},
    headers: {
      'x-rapidapi-key': process.env.NEWSCATCHER_API_KEY,
      'x-rapidapi-host': process.env.NEWSCATCHER_HOST
    }
  }
}

function processNewscatcherResponse(res) {
  return {
    status: res.status,
    total_articles: res.total_hits,
    articles: res.articles.map(makeArticleFromNewscatcher)
  }
}

function makeArticleFromNewscatcher(article) {
  return {
    title: article.title,
    author: article.author,
    source: article.clean_url,
    published_on: article.published_date,
    link: article.link,
    media: article.media
  }
}

// Helpers - NewsAPI

function getNewsApiRequestOptions(query) {
  return {
    method: 'GET',
    url: process.env.NEWAPI_API_URL,
    params: {q: query},
    headers: {
      'X-Api-Key': process.env.NEWAPI_API_KEY,
    }
  }
}

function processNewsApiResponse(res) {
  return {
    status: res.status,
    total_articles: res.totalResults,
    articles: res.articles.map(makeArticleFromNewsApi)
  }
}

function makeArticleFromNewsApi(article) {
  return {
    title: article.title,
    author: article.author,
    source: article.source.name,
    published_on: article.publishedAt,
    link: article.url,
    media: article.urlToImage
  }
}

// Helpers - Google

function getGoogleRequestOptions(query, page) {
  return {
    method: 'GET',
    url: process.env.GOOGLE_API_URL,
    params: {
      q: query,
      key: process.env.GOOGLE_API_KEY,
      cx: process.env.GOOGLE_API_CX,
      safe: "active",
      start: 1 + (10 * page - 10), // Start index for pagination: 1, 11, 21, etc.
      dateRestrict: "m6" // Limit to previous 6 months
    }
  }
}

function processGoogleResponse(res) {
  return {
    total_articles: res.searchInformation.totalResults || 0,
    articles: res.items.map(makeArticleFromGoogle)
  }
}

function makeArticleFromGoogle(article) {
  const { metatags } = article.pagemap;
  return {
    title: article.title,
    author: getAuthorFromGoogle(metatags[0]), 
    source: article.displayLink,
    published_on: getPubDateFromGoogle(article),
    link: article.link,
    media: getImageFromGoogle(metatags[0])
  }
}

function getPubDateFromGoogle(article) {
  const meta = article.pagemap.metatags[0];
  let date = meta["article:published_time"] 
  || meta.pubdate
  || meta.date
  || null

  if (!date) {
    // Snippet is a long string that usually begins with a date "Sep 17, 2020..."
    const possibleDate = article.snippet.slice(0,12)
    re = /\w{3} \d{1,2}, \d{4}/;
    if (re.test(possibleDate)) {
      date = new Date(possibleDate);
    }
  }

  return date;
}

function getAuthorFromGoogle(meta) {
  if (meta.author) return meta.author;
  if (meta["twitter:creator"]) return meta["twitter:creator"]
  if (meta["article:author"]) return pullNameFromAuthorURL(meta["article:author"])
  return null
}

function getImageFromGoogle(meta) {
  return meta["og:image"] 
  || null
}

// Helpers - Other

function pullNameFromAuthorURL(urlString) {
  // Expecting URL string that ends with name like:
  // "https://www.newssite.com/profile/firstName-lastName"
  const arr = urlString.split("/");
  const name = arr[arr.length - 1];
  const re = /-/g;
  return convertToTitleCase(name.replace(re, " "));
}

function convertToTitleCase(str) {
  let inWord = false;
  let output = "";
  for (let i = 0; i < str.length; i++) {
    if (!inWord) {
      inWord = true;
      output += str[i].toUpperCase();
      continue;
    }
    if (str[i] === " ") inWord = false;
    output += str[i];
  }
  return output;
}