require('dotenv').config();
const { errorHandler } = require('./_helpers/error_handler');
const authenticate = require('./_helpers/authenticate');
const ratelimiter = require('./_helpers/rate_limiter');
const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');
const app = express();

const isProd = process.env.NODE_ENV === 'production';

// Middlewares
app.use(morgan(isProd ? 'combined' : 'dev'));
app.use(helmet());
app.use(cors());
app.use(ratelimiter);
app.use(express.json());

// Routes
app.use(authenticate);
app.use('/v1/news', require('./routes/news/news.controller'));

// Errors
app.use(errorHandler);

// Server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log('Server listening on port ' + PORT));