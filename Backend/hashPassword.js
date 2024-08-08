const bcrypt = require('bcrypt');

// Plain text password you want to hash
const password = 'Ad99india@123';

bcrypt.hash(password, 10, (err, hash) => {
  if (err) throw err;
  console.log('Hashed password:', hash);
});
