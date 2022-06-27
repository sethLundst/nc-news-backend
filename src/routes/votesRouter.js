const {
  getVotesByUser,
  postArticleVoteByUser,
  postCommentVoteByUser,
  deleteArticleVoteByUser,
  deleteCommentVoteByUser,
} = require("../controllers");

const votesRouter = require("express").Router();

votesRouter.route("/:username").get(getVotesByUser);

votesRouter.route("/:username/articles").post(postArticleVoteByUser);

votesRouter.route("/:username/comments").post(postCommentVoteByUser);

votesRouter.route("/:username/:id/articles").delete(deleteArticleVoteByUser);

votesRouter.route("/:username/:id/comments").delete(deleteCommentVoteByUser);

module.exports = votesRouter;
