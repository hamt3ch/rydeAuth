import http from 'http';
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import passport from 'passport';
import expressSession from 'express-session';
import fetchival from 'fetchival';
import config from './config.json';
import initializeDb from './db';
import User from './user';

fetchival.fetch = require('node-fetch');

const app = express();
app.server = http.createServer(app);

/**
* 3rd party middleware
*/

app.use(morgan('dev'));
app.use(cors({ exposedHeaders: config.corsHeaders }));
app.use(bodyParser.json({ limit: config.bodyLimit }));

// passport
app.use(expressSession({ secret: 'mySecretKey' }));
app.use(passport.initialize());
app.use(passport.session());

app.server.listen(process.env.PORT || config.port);

/*
* Passport files
*/
const LocalStrategy = require('passport-local').Strategy;

passport.use('local', new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
    // find an existent user
    // if not existent, create user
    // if existent, login user
  User.findOne({ email }, (err, user) => {
    if (err) return done(err);
    if (!user) return done(null, false, { message: 'User does not exist.' });
    const hash = user.password;
    user.validPassword(password, hash, (error, isMatch) => {
      if (error) return done(error);
      if (!isMatch) return done(null, false, { message: 'Invalid email/password combination.' });
      done(null, user);
      return true;
    });
    return false;
  });
}));

passport.serializeUser((user, done) => done(null, user));

passport.deserializeUser((id, done) => done(null, id));

app.post('/login', passport.authenticate('local'), (req, res) => {
  // If this function gets called, authentication was successful.
  // `req.user` contains the authenticated user.
  //  return access/bearer token w/ user info
  res.json(req.user);
});

// connect to db
initializeDb(() => {
  app.server.listen(process.env.PORT || config.port);
  console.log(`Started on port ${app.server.address().port}`);
});

export default app;
