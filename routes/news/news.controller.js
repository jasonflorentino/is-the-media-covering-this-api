const express = require('express');
const newsService = require('./news.service');
const router = express.Router();

// Routes
router.get('/search/newscatcher', searchNewscater);
router.get('/search/newsapi', searchNewsapi);
router.get('/search/google', searchGoogle);

module.exports = router;

// Dispatch
function searchNewscater(req, res, next) {
  newsService.searchNewscatcher(req.query.q)
    .then(news => res.status(200).json(news))
    .catch(err => next(err));
}

function searchNewsapi(req, res, next) {
  newsService.searchNewsApi(req.query.q)
    .then(news => res.status(200).json(news))
    .catch(err => next(err));
}

function searchGoogle(req, res, next) {
  newsService.searchGoogle(req.query.q, req.query.p)
    .then(news => res.status(200).json(news))
    .catch(err => next(err));
}