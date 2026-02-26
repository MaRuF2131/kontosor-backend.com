export const blockBots = (req, res, next) => {
  const userAgent = req.headers["user-agent"] || "";

   const blockedKeywords = [
  // Terminal tools / HTTP clients
  "curl",
  "wget",
  "httpie",
  "fetch",
  "python-requests",
  "python-urllib",
  "php",
  "node-fetch",
  "axios",
  "postman",
  "insomnia",
  "rest-client",
  "httpclient",
  
  // Bots / Crawlers
  "bot",
  "spider",
  "crawler",
  "python",
  "scrapy",
  "semrush",
  "ahrefs",
  "bingpreview",
  "slurp",
  "mediapartners",
  "facebookexternalhit",
  "twitterbot",
  "linkedinbot",
  "telegrambot",
  "whatsapp",
  
  // SEO / Tools
  "majestic",
  "seo",
  "siteexplorer",
  "googlebot",
  "bingbot",
  "yandexbot",
  
  // Other common automation tools
  "phantomjs",
  "headless",
  "chrome-lighthouse",
  "curlrequest",
  "http-request",
  "crawlerdetect",
   ];

  if (blockedKeywords.some(keyword => userAgent.toLowerCase().includes(keyword))) {
    return res.status(403).json({ message: "Bot not allowed" });
  }

  next();
};