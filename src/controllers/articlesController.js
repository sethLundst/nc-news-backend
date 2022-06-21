const {
  selectArticles,
  selectArticleByID,
  selectCommentsByArticleID,
  insertArticle,
  insertCommentByArticleID,
  updateArticleByID,
  removeArticleByID,
} = require("../models/index");

const { checkExists } = require("../errors/index");

exports.getArticles = async (req, res, next) => {
  const { sort_by, order, topic, author, limit, p } = req.query;
  try {
    await checkExists("topics", "slug", topic);
    const { articles, total_count } = await selectArticles(
      sort_by,
      order,
      topic,
      author,
      limit,
      p
    );
    res.status(200).send({ articles, total_count });
  } catch (err) {
    next(err);
  }
};

exports.getArticleByID = async (req, res, next) => {
  const { article_id } = req.params;
  try {
    await checkExists("articles", "article_id", article_id);
    const article = await selectArticleByID(article_id);
    res.status(200).send({ article });
  } catch (err) {
    next(err);
  }
};

exports.getCommentsByArticleID = async (req, res, next) => {
  const { article_id } = req.params;
  const { limit, p, order, sort_by } = req.query;
  try {
    await checkExists("articles", "article_id", article_id);
    const comments = await selectCommentsByArticleID(
      article_id,
      limit,
      p,
      order,
      sort_by
    );
    res.status(200).send({ comments });
  } catch (err) {
    next(err);
  }
};

exports.postArticle = async (req, res, next) => {
  const { author, body, title, topic } = req.body;
  try {
    const article = await insertArticle(author, body, title, topic);
    res.status(201).send({ article });
  } catch (err) {
    next(err);
  }
};

exports.postCommentByArticleID = async (req, res, next) => {
  const { article_id } = req.params;
  const { username, body } = req.body;
  try {
    await checkExists("articles", "article_id", article_id);
    await checkExists("users", "username", username);
    const comment = await insertCommentByArticleID(article_id, username, body);
    res.status(201).send({ comment });
  } catch (err) {
    next(err);
  }
};

exports.patchArticleByID = async (req, res, next) => {
  const { article_id } = req.params;
  const { inc_votes } = req.body;
  try {
    await checkExists("articles", "article_id", article_id);
    const article = await updateArticleByID(article_id, inc_votes);
    res.status(200).send({ article });
  } catch (err) {
    next(err);
  }
};

exports.deleteArticleByID = async (req, res, next) => {
  const { article_id } = req.params;
  try {
    await checkExists("articles", "article_id", article_id);
    const result = await removeArticleByID(article_id);
    if (result.length === 0) res.status(204).send({});
  } catch (err) {
    next(err);
  }
};
