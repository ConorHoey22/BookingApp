// middleware/auth.js

const bcrypt = require('bcrypt');
const User = require('../models/User');

async function authenticateUser(email, password) {
  const user = await User.findOne({ email: email });

  if (!user || !bcrypt.compareSync(password, user.password)) {
    return null;
  }

  return user;
}

module.exports = {
  authenticateUser,
};
