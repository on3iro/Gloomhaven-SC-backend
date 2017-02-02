let r = require('rethinkdb');

function createTables(connection, db) {
  return Promise.all(
    [
      db.tableCreate('AssetTypes').run(connection),
      db.tableCreate('Assets').run(connection),
      db.tableCreate('CampaignComments').run(connection),
      db.tableCreate('Campaigns').run(connection),
      db.tableCreate('Maps').run(connection),
      db.tableCreate('ScenarioComments').run(connection),
      db.tableCreate('Scenarios').run(connection),
      db.tableCreate('Users').run(connection),
    ]
  );
}

function createInitialData(connection, db) {
  return Promise.all(
    [
      db.table('AssetTypes').insert({
        title: 'Enemy',
        icon: null,
        fields: [
          {name: 'attack'},
          {name: 'defense'},
          {name: 'life'},
        ],
      }).run(connection),
      db.table('Assets').insert({
        createdAt: r.now(),
        creatorID: '',
        typeID: '',
        title: 'Crazy Wolf',
        public: 'false',
      }).run(connection),
      db.table('CampaignComments').insert({
        createdAt: r.now(),
        campaignID: '',
        userID: '',
        text: 'This campaign is awesome'
      }).run(connection),
      db.table('Campaigns').insert({
        createdAt: r.now(),
        creatorID: '',
        title: 'The awesome dummy campaign',
        description: 'Only true adventurers know how to deal with "The Dummy"...',
        introduction: 'Once upon a time...',
        conclusion: '...and "The Dummy" said:...',
        rating: 5,
        public: true,
        scenarios: [
          {id: '', scenarioCode: 'Q1'}
        ],
        links: [
          {sourceID: '', source: 'Q1', targetID: '', target: 'Q2'}
        ],
      }).run(connection),
      db.table('Maps').insert({
        scenarioID: '',
        assets: [
          {assetID: '', playerCount: 3, fieldCoordinate: '23'}
        ],
      }).run(connection),
      db.table('ScenarioComments').insert({
        createdAt: r.now(),
        scenarioID: '',
        userID: '',
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
        sections: [
          {title: 'Section One', content: 'Yadayadayada'}
        ],
        goals: [
          {goal: 'Kill all enemies'},
          {goal: 'Have fun'},
        ],
        requirements: [
          {requirement: 'Be cool'},
        ],
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

function createIndices(connection, db) {
  return Promise.all([
    db.table('Assets').indexCreate('creatorID').run(connection)
      .then(
        val => console.log(val)
      ),
    db.table('Assets').indexCreate('typeID').run(connection)
      .then(
        val => console.log(val)
      ),
    db.table('CampaignComments').indexCreate('campaignID').run(connection)
      .then(
        val => console.log(val)
      ),
    db.table('CampaignComments').indexCreate('userID').run(connection)
      .then(
        val => console.log(val)
      ),
    db.table('Campaigns').indexCreate('creatorID').run(connection)
      .then(
        val => console.log(val)
      ),
    db.table('Maps').indexCreate('scenarioID').run(connection)
      .then(
        val => console.log(val)
      ),
    db.table('ScenarioComments').indexCreate('scenarioID').run(connection)
      .then(
        val => console.log(val)
      ),
    db.table('ScenarioComments').indexCreate('userID').run(connection)
      .then(
        val => console.log(val)
      ),
  ]);
}

function createRelations(connection, db) {
  return Promise.all([

  ]);
}


// -----------------------------------------------------------------------------
// Query execution
// -----------------------------------------------------------------------------

// Establish connection
let connection = null;
r.connect( {host: 'localhost', port: 28015}, (err, conn) => {
  if(err) throw err;
  connection = conn;
}).then(
  () => {
    return new Promise(
      (resolve, reject) => {
        // Drop db if exists
        r.dbDrop('gloomhavenSC').run(connection, (err, result) => {
          console.log(JSON.stringify(result, null, 2));
        }).then(
          () => resolve('drop')
        ).catch(
          (err) => {
            console.log(err);
            resolve('Did not drop')
          }
        );
      }
    )
  }
).then(
  (value) => {
    return new Promise(
      (resolve, reject) => {
        console.log(value);

        // Create Database
        r.dbCreate('gloomhavenSC').run(connection, (err, result) => {
          if(err) throw err;
          console.log(JSON.stringify(result, null, 2));
        }).then(
          () => resolve('create')
        );
      }
    )
  }
).then(
  (value) => {
    return new Promise(
      (resolve, reject) => {
        console.log(value);
        let db = r.db('gloomhavenSC');

        createTables(connection, db).then(
          values => resolve({ values, db })
        );
      }
    )
  }
).then(
  (obj) => {
    return new Promise(
      (resolve, reject) => {
        console.log(obj.values);

        createInitialData(connection, obj.db).then(
          values => resolve({ values, db: obj.db })
        );
      }
    )
  }
).then(
  (obj) => {
    return new Promise(
      (resolve, reject) => {
        console.log(obj.values);

        createIndices(connection, obj.db).then(
          () => resolve(obj.db)
        );
      }
    )
  }
).then(
  (db) => {
    return new Promise(
      (resolve, reject) => {

        createRelations(connection, db);
      }
    )
  }
);
