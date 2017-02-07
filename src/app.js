import express from 'express';
import logger from 'morgan';
import bodyParser from 'body-parser';
import cors from 'cors';
import helmet from 'helmet';

import users from './users/api';

const app = express();

// Initialize modules
app.use(logger('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());
app.use(helmet());

// Initialize API
app.get('/', (req, resp) => {
  resp.send('Hello World');
});
app.use('/users', users);

// Error handling
app.use((error, request, response, next) => {
  response.status(error.status || 500);
  response.json({ error: error.message });
});

const server = app.listen(3000, () => {
  const host = server.address().address;
  const port = server.address().port;

  console.log(`App is listening on http://${host}:${port}`);
});
