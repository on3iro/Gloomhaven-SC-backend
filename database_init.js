import readline from 'readline';

import { thinky } from './src/plugins';
import { User } from './src/users/models';
import { Scenario, ScenarioComment } from './src/scenarios/models';
import { Campaign, CampaignComment } from './src/campaigns/models';
import { Asset, AssetType } from './src/assets/models';
import { ScenarioMap, MapAsset } from './src/maps/models';
import { DATABASE_NAME } from './src/config';


const r = thinky.r;

/**
 * This is a simple database initiation script.
 * It creates valid test data to demonstrate the underlaying thinky schema.
  */
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function promptOverwrite(tableValues) {
  /**
   * If there are already tables inside the database the user is prompted
   * to continue the script. Returns a promise which only resolves if there are
   * no tables or if the user presses 'y'.
    */

  return new Promise(
    (resolve, reject) => {
      if(tableValues.length > 0) {
        rl.question('The database is not empty.\ Would you like to continue and delete all data? (y/N)\n',
          answer => {
            answer.toLowerCase() === 'y' ? resolve(tableValues) : reject();
        });
      }else{
        resolve(tableValues);
      }
    }
  )
}

function createContent() {
  /**
    * Creates and writes database content.
    */

  return new Promise(
    (resolve, reject) => {
      console.log('Creating documents!');

      // Dummy user
      const user = new User({
        name: 'foo',
        mail: 'foo@bar.com',
        password: '123456',
        createdAt: r.now(),
      });

      // Scenario A
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

      // Scenario B
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

      // Comments for A
      const commA1 = new ScenarioComment({
        text: "This is a bad scenario",
      });

      const commA2 = new ScenarioComment({
        text: "Na, I disagree (with myself)!",
      });

      // Comments for B
      const commB1 = new ScenarioComment({
        text: "Hi there!",
      });

      // Map for A
      const mapA = new ScenarioMap({});

      // Map for B
      const mapB = new ScenarioMap({});

      // Campaign
      const campaignA = new Campaign({
        createdAt: r.now(),
        creatorID: '',
        title: 'The awesome dummy campaign',
        description: 'Only true adventurers know how to deal with "The Dummy"...',
        introduction: 'Once upon a time...',
        conclusion: '...and "The Dummy" said:...',
        rating: 5,
        public: true,
      });

      // CampaignComments
      const campComment = new CampaignComment({
        text: 'This is a cool campaign',
      })

      // AssetTypes
      const enemy = new AssetType({
        title: "Enemy",
      });

      const obstacle = new AssetType({
        title: "Obstacle",
      });

      const treasure = new AssetType({
        title: "Treasure",
      });

      const trap = new AssetType({
        title: "Trap",
      });

      const item = new AssetType({
        title: "Item",
      });

      const mapTile = new AssetType({
        title: "MapTile",
      });

      // Assets
      const dorkazork = new Asset({
        title: "Dorkazork",
      });

      const fireTrap = new Asset({
        title: "Firetrap",
      });

      // MapAssets
      const mapADork = new MapAsset({
        fields: {
          playerCount: 3,
          fieldCoordinate: '23',
        }
      });

      const mapAFire = new MapAsset({
        fields: {
          playerCount: 2,
          fieldCoordinate: 'A6'
        }
      });

      const mapBFire = new MapAsset({
        fields: {
          playerCount: 4,
          fieldCoordinate: '45',
        }
      });

      // Relations
      user.scenarios = [scenA, scenB];
      user.scenarioComments = [commA1, commA2, commB1];
      user.campaigns = [campaignA];
      user.campaignComments = [campComment];
      user.assets = [dorkazork, fireTrap];

      scenA.scenarioComments = [commA1, commA2];
      scenB.scenarioComments = [commB1];

      scenA.scenarioMap = mapA;
      scenB.scenarioMap = mapB;

      mapADork.asset = dorkazork;
      mapAFire.asset = fireTrap;
      mapBFire.asset = fireTrap;

      mapA.mapAssets = [mapADork, mapAFire];
      mapB.mapAssets = [mapBFire];

      campaignA.scenarios = [scenA, scenB];
      campaignA.campaignComments = [campComment];

      dorkazork.assetType = enemy;
      fireTrap.assetType = trap;

      // Save
      user.saveAll(
        {
          scenarios: {
            scenarioComments: true,
          },
        }
      ).then(
        () => {
          // Set campaign links
          campaignA.links = [{
            source: { id: scenA.id, code: 'A1' },
            target: { id: scenB.id, code: 'B1'}
          }];

          return user.saveAll({
            campaigns: {
              campaignComments: true,
              scenarios: true,
            }
          });
        }
      ).then(
        () => {
          return Promise.all([
            enemy.save(),
            obstacle.save(),
            treasure.save(),
            trap.save(),
            item.save(),
            mapTile.save(),
          ]);
        }
      ).then(
        () => {
          return Promise.all([
            dorkazork.saveAll({
              assetType: true,
            }),
            fireTrap.saveAll({
              assetType: true,
            })
          ]);
        }
      ).then(
        () => {
          return Promise.all([
            mapADork.saveAll({asset: true}),
            mapAFire.saveAll({asset: true}),
            mapBFire.saveAll({asset: true}),
          ]);
        }
      ).then(
        () => {
          return Promise.all([
            mapA.saveAll({mapAssets: true}),
            mapB.saveAll({mapAssets: true}),
          ]);
        }
      ).then(
        () => {
          return Promise.all([
            scenA.saveAll({scenarioMap: true}),
            scenB.saveAll({scenarioMap: true}),
          ]);
        }
      ).then(
        () => {
          return user.saveAll({
            scenarioComments: true,
            campaignComments: true,
            assets: true,
          });
        }
      ).then(
        () => resolve('Done!')
      );
    }
  );
}

// -----------------------------------------------------------------------------
// Query execution
// -----------------------------------------------------------------------------

thinky.dbReady()
  .then(
    () => new Promise(
      resolve => {
        const db = r.db(DATABASE_NAME);

        console.log('Database ready!');

        // Get existing tables if any
        return db.tableList().run().then(
          tableValues => resolve(tableValues)
        );
      }
    )
  ).then(
    // Prompt user
    (tableValues) => {
      return promptOverwrite(tableValues);
    }
  )
  .catch(
    () => process.exit(0)
  )
  .then(
    tableValues => {
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
    val => createContent()
  )
  .then(
    val => {
      console.log(val);
      process.exit(0);
    }
  );
