const {
  selectComments,
  updateCommentByID,
  removeCommentByID,
} = require("../models/index");

const { checkExists } = require("../errors");

exports.getComments = async (req, res, next) => {
  const { limit, p } = req.query;
  try {
    const comments = await selectComments(limit, p);
    res.status(200).send({ comments });
  } catch (err) {
    next(err);
  }
};

exports.patchCommentByID = async (req, res, next) => {
  const { comment_id } = req.params;
  const { inc_votes } = req.body;
  try {
    await checkExists("comments", "comment_id", comment_id);
    const comment = await updateCommentByID(comment_id, inc_votes);
    res.status(200).send({ comment });
  } catch (err) {
    next(err);
  }
};

exports.deleteCommentByID = async (req, res, next) => {
  const { comment_id } = req.params;
  try {
    await checkExists("comments", "comment_id", comment_id);
    const result = await removeCommentByID(comment_id);
    if (result.length === 0) {
      res.status(204).send({});
    }
  } catch (err) {
    next(err);
  }
};
