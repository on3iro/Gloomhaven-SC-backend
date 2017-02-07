import bcrypt from 'bcrypt';


function hashPassword(password) {
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

function authenticate(password, hash) {
  return new Promise((resolve, reject) => {
    bcrypt.compare(password, hash, (error, response) => {
      if(error) return reject(error);
      return resolve(response);
    });
  });
}


module.exports = {
  hashPassword,
  authenticate,
};
