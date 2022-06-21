const db = require("../connection");
const format = require("pg-format");

function getValues(data) {
  let values = [];
  for (let i = 0; i < data.length; i++) {
    values.push(Object.values(data[i]));
  }
  return values;
}

async function seed(data) {
  const { articleData, commentData, likesData, topicData, userData } = data;

  await db.query("DROP TABLE IF EXISTS comments;");
  await db.query("DROP TABLE IF EXISTS likes;");
  await db.query("DROP TABLE IF EXISTS articles;");
  await db.query("DROP TABLE IF EXISTS users;");
  await db.query("DROP TABLE IF EXISTS topics;");

  await db.query(`CREATE TABLE topics (
    slug VARCHAR (100) PRIMARY KEY,
    description TEXT NOT NULL
    );`);
  await db.query(`CREATE TABLE users (
    username VARCHAR (30) PRIMARY KEY UNIQUE,
    name VARCHAR (30) NOT NULL,
    avatar_url TEXT NOT NULL
    );`);
  await db.query(`CREATE TABLE articles (
    article_id SERIAL PRIMARY KEY,
    author VARCHAR (30) REFERENCES users(username) NOT NULL,
    title VARCHAR (100) NOT NULL,
    votes INT DEFAULT 0 NOT NULL,
    topic VARCHAR (100) REFERENCES topics(slug) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW () NOT NULL,
    body TEXT NOT NULL
    );`);
  await db.query(`CREATE TABLE comments (
    comment_id SERIAL PRIMARY KEY,
    author VARCHAR (30) REFERENCES users(username) NOT NULL,
    article_id INT REFERENCES articles(article_id) NOT NULL,
    votes INT DEFAULT 0 NOT NULL,
    created_at TIMESTAMP DEFAULT NOW () NOT NULL,
    body TEXT NOT NULL
    );`);
  await db.query(`CREATE TABLE likes (
    username VARCHAR (30) REFERENCES users(username) NOT NULL,
    article_id INT REFERENCES articles(article_id) NOT NULL,
    like_dislike INT DEFAULT 0 NOT NULL
    );`);
  await db.query(
    format(
      `INSERT INTO topics (description, slug) VALUES %L`,
      getValues(topicData)
    )
  );
  await db.query(
    format(
      `INSERT INTO users (username, name, avatar_url) VALUES %L`,
      getValues(userData)
    )
  );
  await db.query(
    format(
      `INSERT INTO articles (title, topic, author, body, created_at, votes) VALUES %L`,
      getValues(articleData)
    )
  );
  await db.query(
    format(
      `INSERT INTO comments (body, votes, author, article_id, created_at) VALUES %L`,
      getValues(commentData)
    )
  );
  await db.query(
    format(
      `INSERT INTO likes (username, article_id, like_dislike) VALUES %L`,
      getValues(likesData)
    )
  );
}

module.exports = seed;
