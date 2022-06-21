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
  selectLikesByUser,
  insertLikeByUser,
  removeLikeByUser,
} = require("./likesModel");

module.exports = {
  selectArticles,
  selectArticleByID,
  selectComments,
  selectCommentsByArticleID,
  selectUserByUsername,
  selectTopics,
  selectUsers,
  selectLikesByUser,
  insertArticle,
  insertCommentByArticleID,
  insertTopic,
  insertLikeByUser,
  updateArticleByID,
  updateCommentByID,
  removeArticleByID,
  removeCommentByID,
  removeLikeByUser,
};

//
