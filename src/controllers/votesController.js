const { checkExists } = require("../errors");
const {
  selectVotesByUser,
  insertArticleVoteByUser,
  insertCommentVoteByUser,
  removeArticleVoteByUser,
  removeCommentVoteByUser,
} = require("../models/index");

exports.getVotesByUser = async (req, res, next) => {
  const { username } = req.params;
  try {
    await checkExists("users", "username", username);
    const votes = await selectVotesByUser(username);
    res.status(200).send({ votes });
  } catch (err) {
    next(err);
  }
};

exports.postArticleVoteByUser = async (req, res, next) => {
  const { username } = req.params;
  const { article_id, downvote_upvote } = req.body;
  try {
    const vote = await insertArticleVoteByUser(
      username,
      article_id,
      downvote_upvote
    );
    res.status(201).send({ vote });
  } catch (err) {
    next(err);
  }
};

exports.postCommentVoteByUser = async (req, res, next) => {
  const { username } = req.params;
  const { comment_id, downvote_upvote } = req.body;
  try {
    const vote = await insertCommentVoteByUser(
      username,
      comment_id,
      downvote_upvote
    );
    res.status(201).send({ vote });
  } catch (err) {
    next(err);
  }
};

exports.deleteArticleVoteByUser = async (req, res, next) => {
  const { username, article_id } = req.params;
  try {
    const result = await removeArticleVoteByUser(username, article_id);
    if (result.length === 0) {
      res.status(204).send({});
    }
  } catch (err) {
    next(err);
  }
};

exports.deleteCommentVoteByUser = async (req, res, next) => {
  const { username, comment_id } = req.params;
  try {
    const result = await removeCommentVoteByUser(username, comment_id);
    if (result.length === 0) {
      res.status(204).send({});
    }
  } catch (err) {
    next(err);
  }
};
