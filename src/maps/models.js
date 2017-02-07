import { thinky } from '../plugins';
import { Asset } from '../assets/models';


const type = thinky.type;

export const ScenarioMap = thinky.createModel('ScenarioMap', {
  id: type.string(),
  scenarioID: type.string(),
});

export const MapAsset = thinky.createModel('MapAsset', {
  id: type.string(),
  mapID: type.string(),
  fields: type.object().allowExtra(),
});

// ScenarioMap --< MapAssets
ScenarioMap.hasMany(MapAsset, 'mapAssets', 'id', 'scenarioMapID');
MapAsset.belongsTo(ScenarioMap, 'scenarioMap', 'scenarioMapID', 'id');

// Asset --< MapAssets
Asset.hasMany(MapAsset, 'mapAssets', 'id', 'assetID');
MapAsset.belongsTo(Asset, 'asset', 'assetID', 'id');
