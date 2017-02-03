import { thinky } from '../plugins';

const type = thinky.type;

export const User = thinky.createModel('User', {
  name: type.string().required(),
  mail: type.string().email().required(),
  password: type.string().required(),
  createdAt: type.date(),
});

