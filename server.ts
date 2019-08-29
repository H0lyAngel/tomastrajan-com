import 'zone.js/dist/zone-node';
import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as email from '@sendgrid/mail';
import fetch from 'node-fetch';
import dotenv from 'dotenv';
import { join } from 'path';
import { enableProdMode } from '@angular/core';
import { Request, Response } from 'express';

const {
  AppServerModuleNgFactory,
  LAZY_MODULE_MAP,
  ngExpressEngine,
  provideModuleMap
} = require('./dist/server/main');

enableProdMode();
dotenv.config();
email.setApiKey(process.env.API_TOKEN_SENDGRID);

const PORT = process.env.PORT || 4000;
const DIST_FOLDER = join(process.cwd(), 'dist/browser');
const API_URL_GITHUB = 'https://api.github.com';
const API_TOKEN_GITHUB = Buffer.from(
  `tomastrajan:${process.env.API_TOKEN_GITHUB}`
).toString('base64');

const app = express();
app.use(bodyParser.json());
app.use(requireHTTPS);

// Our Universal express-engine (found @ https://github.com/angular/universal/tree/master/modules/express-engine)
app.engine(
  'html',
  ngExpressEngine({
    bootstrap: AppServerModuleNgFactory,
    providers: [provideModuleMap(LAZY_MODULE_MAP)]
  })
);

app.set('view engine', 'html');
app.set('views', DIST_FOLDER);

// Example Express Rest API endpoints
app.get('/api/github/repositories', (req, res) => {
  const options = { headers: { Authorization: `Basic ${API_TOKEN_GITHUB}` } };
  Promise.all([
    fetch(`${API_URL_GITHUB}/users/angular/repos?per_page=10`, options),
    fetch(`${API_URL_GITHUB}/users/tomastrajan/repos?per_page=100`, options),
    fetch(`${API_URL_GITHUB}/users/angular-extensions/repos`, options)
  ])
    .then(responses => Promise.all(responses.map(r => r.json())))
    .then(responses =>
      responses.reduce((result, next) => result.concat(next), [])
    )
    .then(repos => res.json(repos));
});
app.post('/api/email', (req: Request, res: Response) => {
  const msg = {
    to: 'tomas.trajan@gmail.com',
    from: req.body.email,
    subject: 'tomastrajan.com - Get in touch form',
    text: `
      From: ${req.body.firstname} ${req.body.lastname}
      Email: ${req.body.email}
      Company: ${req.body.company}
      Message: ${req.body.message}
    `
  };
  email
    .send(msg)
    .then(() => res.status(200).json('success'))
    .catch(error => res.send(error));
});

// Serve static files from /browser
app.get(
  '*.*',
  express.static(DIST_FOLDER, {
    maxAge: '1y'
  })
);

// All regular routes use the Universal engine
app.get('*', (req, res) => {
  res.render('index', { req });
});

// Start up the Node server
app.listen(PORT, () => {
  console.log(`Node Express server listening on http://localhost:${PORT}`);
});

function requireHTTPS(req, res, next) {
  // The 'x-forwarded-proto' check is for Heroku
  if (
    !req.secure &&
    req.get('x-forwarded-proto') !== 'https' &&
    process.env.ENV !== 'development'
  ) {
    return res.redirect(`https://${req.get('host')}${req.url}`);
  }
  next();
}
