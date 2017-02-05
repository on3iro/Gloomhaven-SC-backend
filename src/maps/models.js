import { thinky } from '../plugins';
import { Asset } from '../assets/models';


const type = thinky.type;
const r = thinky.r;

export const ScenarioMap = thinky.createModel('ScenarioMap', {
  id: type.string(),
  scenarioID: type.string(),
});

// ScenarioMap >--< Assets
ScenarioMap.hasAndBelongsToMany(Asset, "assets", "id", "id");
