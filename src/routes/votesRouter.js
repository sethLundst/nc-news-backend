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

votesRouter
  .route("/:username/:article_id/articles")
  .delete(deleteArticleVoteByUser);

votesRouter
  .route("/:username/:comment_id/comments")
  .delete(deleteCommentVoteByUser);

module.exports = votesRouter;
