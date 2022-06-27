const {
  selectArticles,
  selectArticleByID,
  selectCommentsByArticleID,
  insertArticle,
  insertCommentByArticleID,
  updateArticleByID,
  removeArticleByID,
} = require("./articlesModel");

const {
  selectComments,
  updateCommentByID,
  removeCommentByID,
} = require("./commentsModel");

const { selectTopics, insertTopic } = require("./topicsModel");

const { selectUsers, selectUserByUsername } = require("./usersModel");

const {
  selectVotesByUser,
  insertArticleVoteByUser,
  insertCommentVoteByUser,
  removeArticleVoteByUser,
  removeCommentVoteByUser,
} = require("./votesModel");

module.exports = {
  selectArticles,
  selectArticleByID,
  selectComments,
  selectCommentsByArticleID,
  selectUserByUsername,
  selectTopics,
  selectUsers,
  selectVotesByUser,
  insertArticle,
  insertCommentByArticleID,
  insertTopic,
  insertArticleVoteByUser,
  insertCommentVoteByUser,
  updateArticleByID,
  updateCommentByID,
  removeArticleByID,
  removeCommentByID,
  removeArticleVoteByUser,
  removeCommentVoteByUser,
};

//
