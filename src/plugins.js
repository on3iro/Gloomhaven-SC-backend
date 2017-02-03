import { DATABASE_NAME } from './config';

const thinky = require('thinky')({
  host: 'localhost',
  port: 28015,
  db: DATABASE_NAME,
});

module.exports = {
  thinky
}
