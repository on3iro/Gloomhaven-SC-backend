import { thinky } from '../plugins';
import { Scenario, ScenarioComment } from '../scenarios/models';
import { Campaign, CampaignComment } from '../campaigns/models';
import { Asset } from '../assets/models';


const r = thinky.r;
const type = thinky.type;

export const User = thinky.createModel('User', {
  id: type.string(),
  name: type.string().required(),
  mail: type.string().email().required(),
  password: type.string().required(),
  createdAt: type.date().default(r.now()),
});

// User --< Scenarios
User.hasMany(Scenario, 'scenarios', 'id', 'userID');
Scenario.belongsTo(User, 'user', 'userID', 'id');

// User --< ScenarioComments
User.hasMany(ScenarioComment, 'scenarioComments', 'id', 'userID');
ScenarioComment.belongsTo(User, 'user', 'userID', 'id');

// User --< Campaigns
User.hasMany(Campaign, 'campaigns', 'id', 'userID');
Campaign.belongsTo(User, 'user', 'userID', 'id');

// User --< CampaignComments
User.hasMany(CampaignComment, 'campaignComments', 'id', 'userID');
CampaignComment.belongsTo(User, 'user', 'userID', 'id');

// User --< Assets
User.hasMany(Asset, 'assets', 'id', 'userID');
Asset.belongsTo(User, 'user', 'userID', 'id');
