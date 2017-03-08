import express from 'express';
import passport from 'passport';

import { login, register } from './auth';


const requireAuth = passport.authenticate('jwt', { session: false });
const requireLogin = passport.authenticate('local', {
  successRedirect: '/login',
  failureRedirect: '/api/auth/login',
  session: false,
});

export const apiRoutes = express.Router();
export const authRoutes = express.Router();

// Set auth routes as subgroup/middleware to apiRoutes
apiRoutes.use('/auth', authRoutes);

// Registration
authRoutes.post('/register', register);

// Login
authRoutes.get('/login', (req, res) => {
  res.send('Please login');
});
authRoutes.post('/login', requireLogin, login);

apiRoutes.get('/', (req, resp) => {
  resp.send('Users');
});
