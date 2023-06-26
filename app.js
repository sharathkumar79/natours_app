const express = require('express');
const morgan = require('morgan');
const hpp = require('hpp');
const path = require('path');
const cookieParser = require('cookie-parser');

// const bodyParser = require('body-parser');

const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');
const xss = require('xss-clean');

const tourrouter = require('./routes/tourroutes');
const userrouter = require('./routes/userroutes');
const reviewrouter = require('./routes/reviewroutes');
const viewRouer = require('./routes/viewroutes');

const AppError = require('./utils/appError');
const errorHandler = require('./controllers/errorHandler');

const app = express();

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// app.use(bodyParser.json());

app.use(
  helmet.contentSecurityPolicy({
    directives: {
      'default-src': ["'self'"],
      'script-src': ["'self'", '127.0.0.1:10662'],
    },
  })
);
app.use(mongoSanitize());
app.use(xss());
app.use(
  hpp({
    whitelist: ['duration'],
  })
);

// console.log(process.env.NODE_ENV);

// if (process.env.NODE_ENV === 'development')

app.use(morgan('dev'));

const limitter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'request limit exceeded try again later',
});

app.use('/api', limitter);
app.use(express.json());

app.use((req, res, next) => {
  console.log('hi this is middleware');
  next();
});

app.use(express.static(`${__dirname}/public`));
app.use(cookieParser());

app.use('/', viewRouer);
app.use('/api/v1/tours', tourrouter);
app.use('/api/v1/users', userrouter);
app.use('/api/v1/reviews', reviewrouter);

app.use((req, res, next) => {
  next(
    new AppError(
      `page not found check u r url '${req.originalUrl}' once again`,
      404
    )
  );
});

app.use(errorHandler);

module.exports = app;
