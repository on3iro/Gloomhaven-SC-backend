import { thinky } from '../plugins';


const type = thinky.type;
const r = thinky.r;

export const Asset = thinky.createModel('Asset', {
  id: type.string(),
  userID: type.string(),
  assetTypeID: type.string(),
  createdAt: type.date().default(r.now()),
  title: type.string().required(),
  imagePath: type.string(),
  public: type.boolean().default(false),
});

export const AssetType = thinky.createModel('AssetType', {
  id: type.string(),
  title: type.string().required(),
  iconPath: type.string(),
});

// AssetType --< Assets
AssetType.hasMany(Asset, "assets", "id", "assetTypeID");
Asset.belongsTo(AssetType, "assetType", "assetTypeID", "id");
