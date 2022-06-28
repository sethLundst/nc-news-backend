const db = require("../db/connection");
const format = require("pg-format");

exports.selectVotesByUser = async (username) => {
  const articleVotes = await db.query(
    format(
      `SELECT article_id, downvote_upvote FROM article_votes WHERE username = %L;`,
      username
    )
  );
  const commentVotes = await db.query(
    format(
      `SELECT comment_id, downvote_upvote FROM comment_votes WHERE username = %L;`,
      username
    )
  );
  return {
    articleVotes: articleVotes.rows,
    commentVotes: commentVotes.rows,
  };
};

exports.insertArticleVoteByUser = async (
  username,
  article_id,
  downvote_upvote
) => {
  await db.query(
    `DELETE FROM article_votes WHERE username = $1 AND article_id = $2;`,
    [username, article_id]
  );
  const result = await db.query(
    `INSERT INTO article_votes (username, article_id, downvote_upvote) 
    VALUES ($1, $2, $3) RETURNING *;`,
    [username, article_id, downvote_upvote]
  );
  return result.rows[0];
};

exports.insertCommentVoteByUser = async (
  username,
  comment_id,
  downvote_upvote
) => {
  await db.query(
    `DELETE FROM comment_votes WHERE username = $1 AND comment_id = $2;`,
    [username, comment_id]
  );
  const result = await db.query(
    `INSERT INTO comment_votes (username, comment_id, downvote_upvote) 
    VALUES ($1, $2, $3) RETURNING *;`,
    [username, comment_id, downvote_upvote]
  );
  return result.rows[0];
};

exports.removeArticleVoteByUser = async (username, article_id) => {
  await db.query(
    `DELETE FROM article_votes WHERE username = $1 AND article_id = $2;`,
    [username, article_id]
  );
  const result = await db.query(
    `SELECT * FROM article_votes WHERE username = $1 AND article_id = $2;`,
    [username, article_id]
  );
  return result.rows;
};

exports.removeCommentVoteByUser = async (username, comment_id) => {
  await db.query(
    `DELETE FROM comment_votes WHERE username = $1 AND comment_id = $2;`,
    [username, comment_id]
  );
  const result = await db.query(
    `SELECT * FROM comment_votes WHERE username = $1 AND comment_id = $2;`,
    [username, comment_id]
  );
  return result.rows;
};
