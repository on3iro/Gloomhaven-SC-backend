let r = require('rethinkdb');

function createTables(connection, db) {
  return Promise.all(
    [
      db.tableCreate('Scenarios').run(connection),
      db.tableCreate('Maps').run(connection),
      db.tableCreate('MapAssets').run(connection),
      db.tableCreate('Sections').run(connection),
      db.tableCreate('Requirements').run(connection),
      db.tableCreate('Goals').run(connection),
      db.tableCreate('ScenarioComments').run(connection),
      db.tableCreate('Assets').run(connection),
      db.tableCreate('AssetFields').run(connection),
      db.tableCreate('AssetTypes').run(connection),
      db.tableCreate('AssetTypeStats').run(connection),
      db.tableCreate('StatFields').run(connection),
      db.tableCreate('Campaigns').run(connection),
      db.tableCreate('CampaignScenarios').run(connection),
      db.tableCreate('CampaignScenarioLinks').run(connection),
      db.tableCreate('CampaignComments').run(connection),
      db.tableCreate('Users').run(connection),
    ]
  );
}

function createInitialData(connection, db) {
  return Promise.all(
    [
      db.table('AssetFields').insert({
        value: "5|7"
      }).run(connection),
      db.table('AssetTypeStats').insert({
      }).run(connection),
      db.table('AssetTypes').insert({
      }).run(connection),
      db.table('Assets').insert({
        createdAt: r.now(),
        title: 'Soldier',
        public: 'false',
      }).run(connection),
      db.table('CampaignComments').insert({
        createdAt: r.now(),
        text: 'This campaign is awesome'
      }).run(connection),
      db.table('CampaignScenarioLinks').insert({
      }).run(connection),
      db.table('CampaignScenarios').insert({
        scenarioCode: 'Q1',
      }).run(connection),
      db.table('Campaigns').insert({
        createdAt: r.now(),
        title: 'The awesome dummy campaign',
        description: 'Only true adventures know how to deal with "The Dummy"...',
        introduction: 'Once upon a time...',
        conclusion: '...and "The Dummy" said:...',
        rating: 5,
        public: true
      }).run(connection),
      db.table('Goals').insert({
        text: 'Kill all enemies',
      }).run(connection),
      db.table('MapAssets').insert({
        playerCount: 3,
        fieldCoordinate: '23',
      }).run(connection),
      db.table('Maps').insert({
      }).run(connection),
      db.table('Requirements').insert({
        text: 'none',
      }).run(connection),
      db.table('ScenarioComments').insert({
        createdAt: r.now(),
        text: "Wow, what a scenario...",
      }).run(connection),
      db.table('Scenarios').insert({
        createdAt: r.now(),
        title: "The wolf and the dummy",
        introduction: "Oh no - wolf... and a dummy",
        conclusion: "That's it",
        notes: "Don't play this... seriously",
        description: "Crazy wolf slaying",
        rating: 2,
        public: true,
      }).run(connection),
      db.table('Sections').insert({
        text: 'Yadayada',
      }).run(connection),
      db.table('StatFields').insert({
        title: 'Attack',
      }).run(connection),
      db.table('Users').insert({
        name: 'Dude',
        mail: 'dude@example.com',
        password: '123456',
        createdAt: r.now(),
      }).run(connection),
    ]
  );
}

// Establish connection
let connection = null;
r.connect( {host: 'localhost', port: 28015}, (err, conn) => {
  if(err) throw err;
  connection = conn;
}).then(
  () => {
    // Drop db if exists
    r.dbDrop('gloomhavenSC').run(connection, (err, result) => {
      if(err) throw err;
      console.log(JSON.stringify(result, null, 2));
    }).then(
      () => {
        // Create Database
        r.dbCreate('gloomhavenSC').run(connection, (err, result) => {
          if(err) throw err;
          console.log(JSON.stringify(result, null, 2));
        }).then(
          () => {
            let db = r.db('gloomhavenSC');

            createTables(connection, db)
              .then(
                values => {
                  console.log(values);
                  createInitialData(connection, db)
                    .then(
                      values => {
                        console.log(values);
                      }
                    );
                }
              );
          }
        );
      }
    );
  }
);
