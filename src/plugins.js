import config from 'config';

const thinky = require('thinky')(config.get('dbConfig'));

module.exports = {
  thinky,
};
