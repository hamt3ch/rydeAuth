import mongoose from 'mongoose';
import bcrypt from 'bcrypt-nodejs';

const user = new mongoose.Schema({
  email: { type: String, required: true },
  password: { type: String, required: true },
});

user.methods.validPassword = (password, hash, done) => {
  bcrypt.compare(password, hash, (err, samePassword) => {
    if (samePassword === true) {
      done(null, true);
    } else {
      done(null, false);
    }
  });
};

export default mongoose.model('User', user);
