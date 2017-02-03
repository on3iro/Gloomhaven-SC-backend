import { db } from './plugins';

let type = db.type;

let User = db.createModel('User', {
  name: type.string().required(),
  mail: type.string().email().required(),
  password: type.string().required(),
  createdAt: type.date(),
});

let oneiro = new User({
  name: 'oneiro',
  mail: 'dev@on3iro.de',
  password: '123456',
  createdAt: db.r.now(),
});

let dude = new User({
  name: 'dude',
  mail: 'dude@dudsen.com',
  password: '654321',
  createdAt: db.r.now(),
})

oneiro.save().then(doc => console.log(doc));
dude.save().then(doc => console.log(doc));
