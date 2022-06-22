const { checkExists } = require("../errors");
const {
  selectLikesByUser,
  insertLikeByUser,
  removeLikeByUser,
} = require("../models/index");

exports.getLikesByUser = async (req, res, next) => {
  const { username } = req.params;
  try {
    await checkExists("users", "username", username);
    const likes = await selectLikesByUser(username);
    res.status(200).send({ likes });
  } catch (err) {
    next(err);
  }
};

exports.postLikeByUser = async (req, res, next) => {
  const { username } = req.params;
  const { article_id, like_dislike } = req.body;
  try {
    const like = await insertLikeByUser(username, article_id, like_dislike);
    res.status(201).send({ like });
  } catch (err) {
    next(err);
  }
};

exports.deleteLikeByUser = async (req, res, next) => {
  console.log(req.params);
  const { username, id } = req.params;

  try {
    const result = await removeLikeByUser(username, id);
    if (result.length === 0) {
      res.status(204).send({});
    }
  } catch (err) {
    next(err);
  }
};
