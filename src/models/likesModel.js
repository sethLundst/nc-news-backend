const db = require("../db/connection");
const format = require("pg-format");

exports.selectLikesByUser = async (username) => {
  const result = await db.query(
    format(
      `SELECT article_id, like_dislike FROM likes WHERE username = %L;`,
      username
    )
  );
  return result.rows;
};

exports.insertLikeByUser = async (username, article_id, like_dislike) => {
  await db.query(`DELETE FROM likes WHERE username = $1 AND article_id = $2;`, [
    username,
    article_id,
  ]);
  const result = await db.query(
    `INSERT INTO likes (username, article_id, like_dislike) 
    VALUES ($1, $2, $3) RETURNING *;`,
    [username, article_id, like_dislike]
  );
  return result.rows[0];
};

exports.removeLikeByUser = async (username, article_id) => {
  await db.query(`DELETE FROM likes WHERE username = $1 AND article_id = $2;`, [
    username,
    article_id,
  ]);
  const result2 = await db.query(
    format(
      `SELECT article_id, like_dislike FROM likes WHERE username = %L;`,
      username
    )
  );
  const result = await db.query(
    `SELECT FROM likes WHERE username = $1 AND article_id = $2;`,
    [username, article_id]
  );
  return result.rows;
};
