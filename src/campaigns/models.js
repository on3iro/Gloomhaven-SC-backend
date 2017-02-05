import { thinky } from '../plugins';


const type = thinky.type;
const r = thinky.r;

export const Campaign = thinky.createModel('Campaign', {
  id: type.string(),
  userID: type.string(),
  createdAt: type.date().default(r.now()),
  title: type.string().required(),
  description: type.string(),
  introduction: type.string(),
  conclusion: type.string(),
  rating: type.number(),
  public: type.boolean().default(false),
});

export const CampaignComment = thinky.createModel('CampaignComment', {
  id: type.string(),
  userID: type.string(),
  campaignID: type.string(),
  createdAt: type.date().default(r.now()),
  text: type.string(),
});

// Campaign --< CampaignComments
Campaign.hasMany(CampaignComment, "campaignComments", "id", "campaignID");
CampaignComment.belongsTo(Campaign, "campaign", "campaignID", "id");
