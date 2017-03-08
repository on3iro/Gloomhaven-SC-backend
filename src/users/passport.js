import passport from 'passport';
import { Strategy } from 'passport-local';
import { ExtractJwt, Strategy as JwtStrategy } from 'passport-jwt';
import config from 'config';

import { User } from './models';
import { authenticate, hashPassword } from './auth';

const localOptions = { usernameField: 'email' };
const localLogin = new Strategy(localOptions, (email, password, done) => {
  const incorrMessage = 'Incorrect username or password!';

  User.filter({ email: email }).run()
    .then(
      user => {
        if(!user[0]) {
          return done(null, false, { message: incorrMessage });
        }

        return authenticate(password, user[0].password)
          .then(val => {
              return done(null, user[0]);
            })
          .catch(val => {
              return done(null, false, { message: incorrMessage });
            })
      }
    )
    .catch(err => {
        return done(err);
      });
});

const jwtOptions = {
  // Check authorization headers
  jwtFromRequest: ExtractJwt.fromAuthHeader(),
  // Look for secret
  secretOrKey: config.get('secretKey'),
};
const jwtAuth = new JwtStrategy(jwtOptions, (payload, done) => {
  const incorrMessage = 'Invalid Token provided!';

  User.get(payload.id).run()
    .then(
      user => {
        if(!user) {
          return done(null, false, { message: incorrMessage });
        }

        return done(null, user);
      }
    )
    .catch(err => {
        return done(err);
      });
});

passport.use(jwtAuth);
passport.use(localLogin);

export default passport;
