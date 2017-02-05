import { thinky } from './src/plugins';
import { User } from './src/users/models';
import { Scenario } from './src/scenarios/models';
import { DATABASE_NAME } from './src/config';


const r = thinky.r;

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

          const user = new User({
            name: 'foo',
            mail: 'foo@bar.com',
            password: '123456',
            createdAt: r.now(),
          });

          const scenA = new Scenario({
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
              'Kill all enemies!',
              'Have fun!',
            ],
            requirements: [
              'Be cool',
            ],
          });

          const scenB = new Scenario({
            title: "baaaar",
            introduction: "",
            conclusion: "",
            notes: "",
            description: "Setting the bar high",
            rating: 1,
            goals: [
              'Release me',
            ],
            requirements: [
              'Foo',
            ],
          });

          user.scenarios = [scenA, scenB];
          user.saveAll({scenarios: true}).then(
            val => {
              console.log(val)
              User.getJoin({scenarios: true}).then(
                val => console.log(val)
              )
            }
          );
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
