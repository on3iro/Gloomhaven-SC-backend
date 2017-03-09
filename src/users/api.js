import express from 'express';
import passport from 'passport';

import { login, register } from './auth';


export const requireAuth = passport.authenticate('jwt', { session: false });
export const requireLogin = passport.authenticate('local', { session: false });

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

apiRoutes.get('/', requireAuth, (req, res) => {
  res.send('Yeah, you are so authenticated...');
  req.logout();
});
