import express from 'express';
import logger from 'morgan';
import bodyParser from 'body-parser';
import cors from 'cors';
import helmet from 'helmet';
import passport from 'passport';
import { LocalStrategy } from 'passport-local';
import { ExtractJWT } from 'passport-jwt';
import { JwtStrategy } from 'passport-jwt';

import { User } from './users/models';
import users from './users/api';

const app = express();

// Define passport
// const localOptions = { usernameField: 'mail'};
// const localLogin = new LocalStrategy(localOptions, (email, password, done) => {
// });


// Initialize modules
app.use(logger('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());
app.use(helmet());

// Initialize API
app.get('/', (req, resp) => {
  User.filter({mail: 'foo@bar.com'}).run().then(val => resp.send(val));
  // resp.send('test');
});
app.use('/users', users);

// Error handling
app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({ error: error.message });
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
  res.header('Acces-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, Access-Control-Allow-Credentials');
  res.header('Access-Control-Allow-Credentials', 'true');
  next();
});

const server = app.listen(3000, () => {
  const host = server.address().address;
  const port = server.address().port;

  console.log(`App is listening on http://${host}:${port}`);
});
