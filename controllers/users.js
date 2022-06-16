const User = require("../models/user");

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch((err) => res.status(500).send({ message: `Error: ${err}` }));
  // next();
};

module.exports.getUser = (req, res) => {
  User.findById(req.params.userId)
    .then((user) => res.send({ data: user }))
    .catch((err) => res.status(500).send({ message: `Error: ${err}` }));
  // next();
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => res.send({ data: user }))
    .catch((err) => res.status(500).send({ message: `Error: ${err}` }));
  // next();
};

// module.exports.doesUserExist = (req, res, next) => {
//   const { userId } = req.params.userId;
//   if (!userId) {
//     res.send("Такого пользователя не существует.");
//     return;
//   }
//   next();
// };

// module.exports.sendUsers = (req, res, next) => {
//   const { users } = req.body;
//   res.send(users);
//   next();
// };

module.exports.updateProfile = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true })
    .then((user) => res.send(user))
    .catch((err) => res.status(500).send({ message: `Error: ${err}` }));
};
module.exports.updateAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true })
    .then((newAvatar) => res.send(newAvatar))
    .catch((err) => res.status(500).send({ message: `Error: ${err}` }));
};
