const db = require("../db/connection");
const format = require("pg-format");

exports.selectArticles = async (sort_by, order, topic, author, limit, p) => {
  const offset = (p - 1) * limit;
  const result = await db.query(
    format(
      `SELECT articles.article_id, articles.title, articles.author,
      articles.topic, articles.created_at, articles.votes, 
      COUNT(comments.article_id) AS comment_count FROM articles
      LEFT JOIN comments ON articles.article_id = comments.article_id
      ${topic ? "WHERE articles.topic = %L" : "%s"}
      ${
        topic
          ? author
            ? "AND articles.author LIKE %L"
            : "%s"
          : author
          ? "WHERE articles.author LIKE %L"
          : "%s"
      } 
      GROUP BY articles.article_id
      ORDER BY %I %s OFFSET $1 LIMIT $2;`,
      topic,
      author ? `%${author}%` : "",
      sort_by ? sort_by : "created_at",
      order ? (order === "ASC" || order === "DESC" ? order : "error") : "DESC"
    ),
    [offset ? offset : 0, limit ? limit : 10]
  );
  const articles = result.rows;
  const total_count = result.rowCount;
  return { articles, total_count };
};

exports.selectArticleByID = async (article_id) => {
  const result = await db.query(
    `SELECT articles.*, COUNT(comments.article_id) AS comment_count 
    FROM articles LEFT JOIN comments 
    ON articles.article_id = comments.article_id 
    WHERE articles.article_id = $1 GROUP BY articles.article_id;`,
    [article_id]
  );
  return result.rows[0];
};

exports.selectCommentsByArticleID = async (
  article_id,
  limit,
  p,
  order,
  sort_by
) => {
  const offset = (p - 1) * limit;
  const result = await db.query(
    format(
      `SELECT comment_id, votes, created_at, author, body
      FROM comments WHERE article_id = %L ORDER BY %I %s OFFSET $1 LIMIT $2`,
      article_id,
      sort_by ? sort_by : "created_at",
      order ? (order === "ASC" || order === "DESC" ? order : "error") : "DESC"
    ),
    [offset ? offset : 0, limit ? limit : 10]
  );
  return result.rows;
};

exports.insertArticle = async (author, body, title, topic) => {
  const result = await db.query(
    `INSERT INTO articles (author, body, title, topic) 
    VALUES ($1, $2, $3, $4) RETURNING *;`,
    [author, body, title, topic]
  );
  return this.selectArticleByID(result.rows[0].article_id);
};

exports.insertCommentByArticleID = async (article_id, username, body) => {
  const result = await db.query(
    `INSERT INTO comments (article_id, author, body, created_at) 
    VALUES ($1, $2, $3, CURRENT_TIMESTAMP) RETURNING *;`,
    [article_id, username, body]
  );
  return result.rows[0];
};

exports.updateArticleByID = async (article_id, inc_votes) => {
  const result = await db.query(
    `UPDATE articles SET votes = votes + $1 
    WHERE article_id = $2 RETURNING *;`,
    [inc_votes ? inc_votes : 0, article_id]
  );
  return this.selectArticleByID(result.rows[0].article_id);
};

exports.removeArticleByID = async (article_id) => {
  await db.query("DELETE FROM article_votes WHERE article_id = $1", [
    article_id,
  ]);
  await db.query("DELETE FROM articles WHERE article_id = $1", [article_id]);
  const result = await db.query(`SELECT FROM articles WHERE article_id = $1`, [
    article_id,
  ]);

  return result.rows;
};
