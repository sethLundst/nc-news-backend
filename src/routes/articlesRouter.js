const {
  getArticles,
  getArticleByID,
  getCommentsByArticleID,
  postArticle,
  postCommentByArticleID,
  patchArticleByID,
  deleteArticleByID,
} = require("../controllers");

const articlesRouter = require("express").Router();

articlesRouter.route("/").get(getArticles).post(postArticle);

articlesRouter
  .route("/:article_id")
  .get(getArticleByID)
  .patch(patchArticleByID)
  .delete(deleteArticleByID);

articlesRouter
  .route("/:article_id/comments")
  .get(getCommentsByArticleID)
  .post(postCommentByArticleID);

module.exports = articlesRouter;
