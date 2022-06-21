const {
  getArticles,
  getArticleByID,
  getCommentsByArticleID,
  postArticle,
  postCommentByArticleID,
  patchArticleByID,
  deleteArticleByID,
} = require("./articlesController");
const {
  getComments,
  patchCommentByID,
  deleteCommentByID,
} = require("./commentsController");
const { getTopics, postTopic } = require("./topicsController");
const { getUsers, getUserByUsername } = require("./usersController");
const {
  getLikesByUser,
  postLikeByUser,
  deleteLikeByUser,
} = require("./likesController");

module.exports = {
  getArticles,
  getArticleByID,
  getComments,
  getCommentsByArticleID,
  getTopics,
  getUsers,
  getUserByUsername,
  getLikesByUser,
  postArticle,
  postCommentByArticleID,
  postTopic,
  postLikeByUser,
  patchArticleByID,
  patchCommentByID,
  deleteArticleByID,
  deleteCommentByID,
  deleteLikeByUser,
};
