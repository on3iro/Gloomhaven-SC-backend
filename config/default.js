module.exports = {
  dbConfig: {
    host: 'localhost',
    port: 28015,
    db: 'gloomhavenSC'
  },
  secretKey: process.env.GSC_SECRET_KEY || 'changeMeSecretKey',
};
