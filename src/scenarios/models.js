import { thinky } from '../plugins';
import { ScenarioMap } from '../maps/models';


const type = thinky.type;
const r = thinky.r;

export const Scenario = thinky.createModel('Scenario', {
  id: type.string(),
  userID: type.string(),
  title: type.string().required(),
  introduction: type.string(),
  conclusion: type.string(),
  notes: type.string(),
  description: type.string(),
  rating: type.number(),
  public: type.boolean().default(false),
  createdAt: type.date().default(r.now()),
  sections: [{
    title: type.string().required(),
    content: type.string().required(),
  }],
  goals: [type.string()],
  requirements: [type.string()],
});

export const ScenarioComment = thinky.createModel('ScenarioComment', {
  id: type.string(),
  userID: type.string(),
  scenarioID: type.string(),
  createdAt: type.date().default(r.now()),
  text: type.string(),
});

// Scenario --< ScenarioComments
Scenario.hasMany(ScenarioComment, 'scenarioComments', 'id', 'scenarioID');
ScenarioComment.belongsTo(Scenario, 'scenario', 'scenarioID', 'id');

// Scenario -- Map
Scenario.hasOne(ScenarioMap, 'scenarioMap', 'id', 'scenarioID');
ScenarioMap.belongsTo(Scenario, 'scenario', 'scenarioID', 'id');
