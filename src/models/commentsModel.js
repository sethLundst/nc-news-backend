const db = require("../db/connection");

exports.selectComments = async (limit, p) => {
  const offset = (p - 1) * limit;
  const result = await db.query("SELECT * FROM comments OFFSET $1 LIMIT $2;", [
    offset ? offset : 0,
    limit ? limit : 10,
  ]);
  return result.rows;
};

exports.updateCommentByID = async (comment_id, inc_votes) => {
  const result = await db.query(
    `UPDATE comments SET votes = votes + $1 WHERE comment_id = $2 RETURNING *;`,
    [inc_votes, comment_id]
  );
  return result.rows[0];
};

exports.removeCommentByID = async (comment_id) => {
  await db.query(`DELETE FROM comments WHERE comment_id = $1;`, [comment_id]);
  const result = await db.query(`SELECT FROM comments WHERE comment_id = $1;`, [
    comment_id,
  ]);
  return result.rows;
};
