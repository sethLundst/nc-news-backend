const { selectUsers, selectUserByUsername } = require("../models/index");

const { checkExists } = require("../errors");

exports.getUsers = async (_req, res, next) => {
  try {
    const users = await selectUsers();
    res.status(200).send({ users });
  } catch (err) {
    next(err);
  }
};

exports.getUserByUsername = async (req, res, next) => {
  const { username } = req.params;
  try {
    await checkExists("users", "username", username);
    const user = await selectUserByUsername(username);
    res.status(200).send({ user });
  } catch (err) {
    next(err);
  }
};
