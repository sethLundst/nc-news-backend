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
  getVotesByUser,
  postArticleVoteByUser,
  postCommentVoteByUser,
  deleteArticleVoteByUser,
  deleteCommentVoteByUser,
} = require("./votesController");

module.exports = {
  getArticles,
  getArticleByID,
  getComments,
  getCommentsByArticleID,
  getTopics,
  getUsers,
  getUserByUsername,
  getVotesByUser,
  postArticle,
  postCommentByArticleID,
  postTopic,
  postArticleVoteByUser,
  postCommentVoteByUser,
  patchArticleByID,
  patchCommentByID,
  deleteArticleByID,
  deleteCommentByID,
  deleteArticleVoteByUser,
  deleteCommentVoteByUser,
};
