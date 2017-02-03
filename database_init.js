import { thinky } from './src/plugins';
import { User } from './src/users/models';
import { DATABASE_NAME } from './src/config';


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

// -----------------------------------------------------------------------------
// Query execution
// -----------------------------------------------------------------------------

thinky.dbReady()
  .then(
    () => new Promise(
      (resolve, reject) => {
        const r = thinky.r;
        const db = r.db(DATABASE_NAME);

        console.log('Database ready!');

        // Delete all documents if tables already exist
        const tables = db.tableList().run()
          .then(
            (tableValues) => {
              Promise.all(
                tableValues.map(val => {
                  return r.table(val).delete().run()
                    .then(
                      (doc) => console.log(`Table ${val}:`, doc)
                    )
                })
              )
            }
          )
          .then(
              () => resolve('Succesfully deleted documents!')
          )
          .catch(val => console.log(val))
      }
    )
  )
  .then(
    val => {
      return new Promise(
        (resolve, reject) => {
          console.log(val);
          console.log('Creating documents!');

          const foo = new User({
            name: 'foo',
            mail: 'foo@bar.com',
            password: '123456',
            createdAt: thinky.r.now(),
          });
          foo.save().then(
            (val) => {
              console.log(val);
              resolve('Done')
            }
          )
        }
      )
    }
  )
  .then(
    val => {
      console.log(val);
      process.exit(0);
    }
  );
