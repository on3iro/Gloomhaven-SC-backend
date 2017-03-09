import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import config from 'config';

import { User } from './models';


export function hashPassword(password) {
  return new Promise((resolve, reject) => {
    bcrypt.genSalt(10, (saltErr, salt) => {
      if(saltErr) {
        return reject(saltErr);
      }else{
        return bcrypt.hash(password, salt, (hashErr, hash) => {
          if(hashErr) return reject(hashErr);
          return resolve(hash);
        });
      }
    });
  });
}

export function authenticate(password, hash) {
  return new Promise((resolve, reject) => {
    bcrypt.compare(password, hash, (error, response) => {
      if(error) return reject(error);
      return resolve(response);
    });
  });
}

function generateToken(user) {
  return jwt.sign(user, config.get('secretKey'), {
    expiresIn: 3600 // in seconds
  });
}

export function setUserInfo(user) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
  };
}

// -----------------------------------------------------------------------------
// Login Route
// -----------------------------------------------------------------------------
export function login(req, res, next) {
  const userInfo = setUserInfo(req.user);

  res.status(200).json({
    token: 'JWT ' + generateToken(userInfo),
    user: userInfo
  });
}

// -----------------------------------------------------------------------------
// Registration Route
// -----------------------------------------------------------------------------
export function register(req, res, next) {
  // Check for registration errors
  const email = req.body.email;
  const name = req.body.name;
  const password = req.body.password;

  // Return error if no email was provided
  if(!email) {
    return res.status(422).send({ error: 'You have to enter an email address.'});
  }

  // Return error if no name was provided
  if(!name) {
    return res.status(422).send({ error: 'You have to enter a username.' });
  }

  // Return error if no password was provided
  if(!password) {
    return res.status(422).send({ error: 'You have to enter a password.'});
  }

  // Check if user with provided mail already exists
  return User.filter({ email: email }).run()
    .then(userList => new Promise(
        (resolve, reject) => {
          if(userList.length > 0) {
            return reject('This email is already in use.');
          }else {
            return resolve();
          }
        }
      )
    )
    .then(
      // Check if username already exists
      () => User.filter({ name: name }).run()
    )
    .then(userList => new Promise(
        (resolve, reject) => {
          if(userList.length > 0) {
            return reject('This name is already in use.');
          }else {
            return resolve();
          }
        }
      ))
    .then(() => {
        const user = new User({
          name,
          email,
        });

        return hashPassword(password)
          .then(hash => {
              user.password = hash;
              return user.saveAll();
            });
      })
    .then(user => {
        const userInfo = setUserInfo(user);

        res.status(201).json({
          token: 'JWT ' + generateToken(userInfo),
          user: userInfo
        });
      })
    .catch(msg => res.status(422).send({ error: msg }));
}
