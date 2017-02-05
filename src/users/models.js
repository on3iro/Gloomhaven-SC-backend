import { thinky } from '../plugins';
import { Scenario } from '../scenarios/models';


const r = thinky.r;
const type = thinky.type;

export const User = thinky.createModel('User', {
  name: type.string().required(),
  mail: type.string().email().required(),
  password: type.string().required(),
  createdAt: type.date().default(r.now()),
});

User.hasMany(Scenario, "scenarios", "id", "userID");
Scenario.belongsTo(User, "user", "userID", "id");
