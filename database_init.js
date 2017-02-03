import { thinky } from './src/plugins';
import { User } from './src/models';



function createTables(db) {
  return Promise.all(
    [
      db.tableCreate('AssetTypes').run(),
      db.tableCreate('Assets').run(),
      db.tableCreate('CampaignComments').run(),
      db.tableCreate('Campaigns').run(),
      db.tableCreate('Maps').run(),
      db.tableCreate('ScenarioComments').run(),
      db.tableCreate('Scenarios').run(),
      db.tableCreate('User').run(),
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

function dropDB(dbName) {
  return new Promise(
    (resolve, reject) => {
      // Drop db if exists
      thinky.r.dbDrop(dbName).run(null, (err, result) => {
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

// -----------------------------------------------------------------------------
// Query execution
// -----------------------------------------------------------------------------

// Establish connection
dropDB('gloomhavenSC')
  .then(
    (value) => {
      return new Promise(
        (resolve, reject) => {
          console.log(value);

          // Create Database
          thinky.r.dbCreate('gloomhavenSC').run(null, (err, result) => {
            if(err) throw err;
            console.log(JSON.stringify(result, null, 2));
          }).then(
            () => resolve('create')
          );
        }
      )
    }
  )
.then(
  (value) => {
    return new Promise(
      (resolve, reject) => {
        console.log(value);

        createTables(thinky.r).then(
          values => resolve(values)
        );
      }
    )
  }
)
.then(
  val => {
    return new Promise(
      (resolve, reject) => {
        console.log(val);

        const oneiro = new User({
          name: 'oneiro',
          mail: 'dev@on3iro.de',
          password: '123456',
          createdAt: db.r.now(),
        });
        oneiro.save().then(
          doc => {
            console.log(doc);
            resolve('Done');
          }
        );
      }
    )
  }
);
// ).then(
  // (obj) => {
    // return new Promise(
      // (resolve, reject) => {
        // console.log(obj.values);

        // createInitialData(connection, obj.db).then(
          // values => resolve({ values, db: obj.db })
        // );
      // }
    // )
  // }
// ).then(
  // (obj) => {
    // return new Promise(
      // (resolve, reject) => {
        // console.log(obj.values);

        // createIndices(connection, obj.db).then(
          // () => resolve(obj.db)
        // );
      // }
    // )
  // }
// ).then(
  // (db) => {
    // return new Promise(
      // (resolve, reject) => {

        // createRelations(connection, db);
      // }
    // )
  // }
// );
