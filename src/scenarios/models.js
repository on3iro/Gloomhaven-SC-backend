import { thinky } from '../plugins';


const type = thinky.type;
const r = thinky.r;

export const Scenario = thinky.createModel('Scenario', {
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
