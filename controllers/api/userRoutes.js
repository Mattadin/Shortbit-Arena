const router = require('express').Router();
const { User } = require('../../models/');
const bcrypt = require('bcrypt');
const passport = require('passport');
const {
  serialize,
  deSerialize,
  strategy,
  passAuth,
} = require('../../config/passport-config');

router.post('/account', passAuth, (req, res) => {
  res.redirect('/dashboard');
});

router.post('/register', async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const user = new User({
      fullName: req.body.fullName,
      email: req.body.email,
      password: hashedPassword,
    });
    await User.create(user);
    res.redirect('/account');
  } catch (err) {
    res.redirect('/register');
    console.log(err);
  }
});

module.exports = router;
//  {
//   getUsers(req, res) {
//     User.find()
//       .then((users) => res.json(users))
//       .catch((err) => res.status(500).json(err));
//   },
//   getSingleUser(req, res) {
//     User.findOne({ _id: req.params.userId })
//       .select('-__v')
//       .then((user) =>
//         !user
//           ? res.status(404).json({ message: 'No user with that ID' })
//           : res.json(user)
//       )
//       .catch((err) => res.status(500).json(err));
//   },
//   // create a new user,
// }
