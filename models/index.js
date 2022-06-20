const User = require('./User');
const Character = require('./Character');

User.hasOne(Character, {
  foreignKey: 'id',
});

module.exports = { User, Character };
