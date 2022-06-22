const app = require("../src/app");
const db = require("../src/db/connection");
const request = require("supertest");
const seed = require("../src/db/seeds/seed");
const testData = require("../src/db/data/test-data/index.js");

beforeEach(() => seed(testData));
afterAll(() => db.end());

describe("GET /", () => {
  test("200 OK: Responds with JSON representation of all API endpoints.", async () => {
    const { body } = await request(app).get("/").expect(200);
    const { endpoints } = body;
    expect(endpoints).toEqual({
      "GET /": {
        description: "Requests JSON representation of all API endpoints.",
      },
      "GET /articles": {
        description: "Requests array of all article objects.",
        queries: ["limit", "order", "p", "sort_by", "author", "topic"],
        exampleResponse: {
          articles: [
            {
              article_id: 9,
              author: "butter_bridge",
              title: "They're not exactly dogs, are they?",
              votes: 0,
              topic: "mitch",
              created_at: "2020-06-06T09:10:00.000Z",
              comment_count: "2",
            },
          ],
          total_count: 1,
        },
      },
      "GET /articles/:article_id": {
        description: "Requests specific article object.",
        queries: [],
        exampleResponse: {
          article: {
            article_id: 9,
            author: "butter_bridge",
            title: "They're not exactly dogs, are they?",
            votes: 0,
            topic: "mitch",
            created_at: "2020-06-06T09:10:00.000Z",
            comment_count: "2",
          },
        },
      },
      "GET /articles/:article_id/comments": {
        description: "Requests array of comments for specific article.",
        queries: ["limit, p"],
        exampleResponse: {
          comments: [
            {
              body: "The owls are not what they seem.",
              votes: 20,
              author: "icellusedkars",
              created_at: "2020-03-14T17:02:00.000Z",
              comment_id: 17,
            },
          ],
        },
      },
      "GET /comments/": {
        description: "Requests array of all comment objects.",
        queries: ["p", "limit"],
        exampleResponse: {
          comments: [
            {
              comment_id: 16,
              author: "butter_bridge",
              article_id: 6,
              votes: 1,
              created_at: "2020-10-11T15:23:00.000Z",
              body: "This is a bad article name",
            },
          ],
        },
      },
      "GET /topics": {
        description: "Requests array of all topic objects.",
        queries: [],
        exampleResponse: {
          topics: [{ slug: "football", description: "Footie!" }],
        },
      },
      "GET /users/": {
        description: "Requests array of all user objects.",
        queries: [],
        exampleResponse: {
          users: [{ username: "lurker" }],
        },
      },
      "GET /users/:username": {
        description: "Requests specific user object.",
        queries: [],
        exampleResponse: {
          user: [{ username: "lurker" }],
        },
      },
      "POST /articles": {
        description:
          "Sends article to the server and requests newly added article.",
        queries: [],
        exampleResponse: {
          article: {
            author: "rogersop",
            title: "Nightmail",
            body: "This is the night mail crossing the Border.",
            topic: "cats",
            article_id: 13,
            votes: 0,
            created_at: "2020-10-11T15:23:00.000Z",
            comment_count: "0",
          },
        },
      },
      "POST /articles/:article_id/comments": {
        description:
          "Sends comment to the server and requests newly added comment.",
        queries: [],
        exampleRequest: {
          username: "rogersop",
          body: "Bringing the cheque and the postal order.",
        },
        exampleResponse: {
          comment_id: 19,
          author: "rogersop",
          article_id: 1,
          votes: 0,
          created_at: "2020-10-11T15:23:00.000Z",
          body: "Bringing the cheque and the postal order.",
        },
      },
      "POST /topics": {
        description:
          "Sends topic to the server and requests newly added topic.",
        queries: [],
        exampleRequest: {
          slug: "topic_name_here",
          description: "description here",
        },
        exampleResponse: {
          slug: "topic_name_here",
          description: "description here",
        },
      },
      "PATCH /articles/:article_id": {
        description:
          "Requests article updated with incremented/decremented votes.",
        queries: [],
        exampleRequest: { inc_votes: 25 },
        exampleResponse: {
          article_id: 3,
          author: "icellusedkars",
          title: "Eight pug gifs that remind me of mitch",
          votes: 25,
          topic: "mitch",
          created_at: "2020-11-03T09:12:00.000Z",
          body: "some gifs",
          comment_count: "2",
        },
      },
      "PATCH /comments/:comment_id": {
        description:
          "Requests comment updated with incremented/decremented votes.",
        queries: [],
        exampleRequest: { inc_votes: 25 },
        exampleResponse: {
          comment_id: 3,
          body: "Replacing the quiet elegance of the dark suit and tie with the casual indifference of these muted earth tones is a form of fashion suicide, but, uh, call me crazy — onyou it works.",
          votes: 125,
          author: "icellusedkars",
          article_id: 1,
          created_at: "2020-03-01T01:13:00.000Z",
        },
      },
      "DELETE /articles/:article_id": {
        description: "Deletes requested article and responds with no content.",
        queries: [],
        exampleResponse: { Msg: 204 },
      },
      "DELETE /comments/:comment_id": {
        description: "Deletes requested comment and responds with no content.",
        queries: [],
        exampleResponse: { Msg: 204 },
      },
    });
  });
});

describe("GET /articles", () => {
  test(`200 OK: Responds with array of all article objects
      (including 'comment_count', excluding 'body).`, async () => {
    const { body } = await request(app).get("/articles").expect(200);
    const { articles } = body;
    expect(articles).toBeInstanceOf(Array);
    expect(articles).toHaveLength(10);
    articles.forEach((article) => {
      expect(article).toEqual(
        expect.objectContaining({
          article_id: expect.any(Number),
          author: expect.any(String),
          title: expect.any(String),
          votes: expect.any(Number),
          topic: expect.any(String),
          created_at: expect.any(String),
          comment_count: expect.any(String),
        })
      );
      expect(article).toEqual(
        expect.not.objectContaining({
          body: expect.any(String),
        })
      );
    });
  });
  test("200 OK: Accepts sort_by query which sorts articles by column.", async () => {
    const { body } = await request(app)
      .get("/articles?sort_by=title")
      .expect(200);
    const { articles } = body;
    let titles = [];
    expect(articles).toHaveLength(10);
    articles.forEach((article) => {
      titles.push(article.title);
    });
    titles.forEach((_, index) => {
      expect(titles[index]).toEqual(titles.sort().reverse()[index]);
    });
  });
  test("200 OK: sort_by query defaults to sorting by date (column: 'created_at').", async () => {
    const { body } = await request(app).get("/articles").expect(200);
    const { articles } = body;
    let dates = [];
    expect(articles).toHaveLength(10);
    articles.forEach((article) => {
      dates.push(article.created_at);
    });
    dates.forEach((_, index) => {
      expect(dates[index]).toEqual(dates.sort().reverse()[index]);
    });
  });
  test("200 OK: Accepts order query which sets order to ASC or DESC.", async () => {
    const { body } = await request(app)
      .get("/articles?sort_by=title&order=ASC")
      .expect(200);
    const { articles } = body;
    let titles = [];
    expect(articles).toHaveLength(10);
    articles.forEach((article) => {
      titles.push(article.title);
    });
    titles.forEach((_, index) => {
      expect(titles[index]).toEqual(titles.sort()[index]);
    });
  });
  test("200 OK: order query defaults to ordering by descending.", async () => {
    const { body } = await request(app)
      .get("/articles?sort_by=author")
      .expect(200);
    const { articles } = body;
    let authors = [];
    expect(articles).toHaveLength(10);
    articles.forEach((article) => {
      authors.push(article.author);
    });
    authors.forEach((_, index) => {
      expect(authors[index]).toEqual(authors.sort().reverse()[index]);
    });
  });
  test("200 OK: Accepts topic query which filters articles by topic.", async () => {
    const { body } = await request(app).get("/articles?topic=cats").expect(200);
    const { articles } = body;
    expect(articles).toHaveLength(1);
    articles.forEach((article) => {
      expect(article.topic).toEqual("cats");
    });
  });
  test(`200 OK: Valid topic query returning no articles responds with empty 
      array, e.g. ?topic=paper.`, async () => {
    const { body } = await request(app)
      .get("/articles?topic=paper")
      .expect(200);
    const { articles } = body;
    expect(articles).toEqual([]);
  });
  test("200 OK: Accepts author query which filters articles by author.", async () => {
    const { body } = await request(app)
      .get("/articles?author=icellusedkars")
      .expect(200);
    const { articles } = body;
    expect(articles).toHaveLength(6);
    articles.forEach((article) => {
      expect(article.author).toEqual("icellusedkars");
    });
  });
  test("200 OK: Author query returns articles where author string includes query string.", async () => {
    const { body } = await request(app)
      .get("/articles?author=icell")
      .expect(200);
    const { articles } = body;
    expect(articles).toHaveLength(6);
    articles.forEach((article) => {
      expect(article.author).toEqual("icellusedkars");
    });
  });
  test(`200 OK: Valid author query returning no articles responds with empty 
      array, e.g. ?topic=paper.`, async () => {
    const { body } = await request(app)
      .get("/articles?author=paper")
      .expect(200);
    const { articles } = body;
    expect(articles).toEqual([]);
  });
  test("200 OK: Valid topic and author query work in conjunction.", async () => {
    const { body } = await request(app)
      .get("/articles?author=rogersop&topic=mitch")
      .expect(200);
    const { articles } = body;
    expect(articles).toHaveLength(2);
    articles.forEach((article) => {
      expect(article.author).toEqual("rogersop");
      expect(article.topic).toEqual("mitch");
    });
  });
  test("200 OK: Accepts a limit query which limits number of responses.", async () => {
    const { body } = await request(app).get("/articles?limit=7").expect(200);
    const { articles } = body;
    expect(articles).toBeInstanceOf(Array);
    expect(articles).toHaveLength(7);
  });
  test("200 OK: Limit query defaults to 10.", async () => {
    const { body } = await request(app).get("/articles").expect(200);
    const { articles } = body;
    expect(articles).toBeInstanceOf(Array);
    expect(articles).toHaveLength(10);
  });
  test(`200 OK: Accepts a page query which specifies the page at which to start,
      calculated using limit.`, async () => {
    const { body } = await request(app)
      .get("/articles?limit=3&p=3")
      .expect(200);
    const { articles } = body;
    expect(articles).toEqual([
      {
        article_id: 9,
        author: "butter_bridge",
        title: "They're not exactly dogs, are they?",
        votes: 0,
        topic: "mitch",
        created_at: "2020-06-06T09:10:00.000Z",
        comment_count: "2",
      },
      {
        article_id: 10,
        author: "rogersop",
        title: "Seven inspirational thought leaders from Manchester UK",
        votes: 0,
        topic: "mitch",
        created_at: "2020-05-14T04:15:00.000Z",
        comment_count: "0",
      },
      {
        article_id: 4,
        author: "rogersop",
        title: "Student SUES Mitch!",
        votes: 0,
        topic: "mitch",
        created_at: "2020-05-06T01:14:00.000Z",
        comment_count: "0",
      },
    ]);
  });
  test("200 OK: Accepts various queries simultaneously.", async () => {
    const { body } = await request(app)
      .get("/articles?sort_by=title&order=ASC&topic=mitch&limit=5&p=2")
      .expect(200);
    const { articles } = body;
    let titles = [];
    expect(articles).toHaveLength(5);
    articles.forEach((article) => {
      expect(article.topic).toEqual("mitch");
      titles.push(article.title);
    });
    titles.forEach((_, index) => {
      expect(titles[index]).toEqual(titles.sort()[index]);
    });
  });
  test("200 OK: Response body has a total_count property, displaying the number of articles returned.", async () => {
    const { body } = await request(app).get("/articles").expect(200);
    expect(body.total_count).toBe(10);
  });
  test("400 Bad Request: Responds with error if order query is invalid.", async () => {
    const { body } = await request(app)
      .get("/articles?order=ascending")
      .expect(400);
    expect(body.msg).toBe("Bad Request: Invalid order query.");
  });
  test("400 Bad Request: Responds with error if sort_by query is invalid.", async () => {
    const { body } = await request(app)
      .get("/articles?sort_by=bananas")
      .expect(404);
    expect(body.msg).toBe("Bad Request: Invalid sort_by query.");
  });
  test("404 Not Found: Responds with error if topic does not exist in database.", async () => {
    const { body } = await request(app)
      .get("/articles?topic=i_am_not_a_topic")
      .expect(404);
    expect(body.msg).toBe("Not Found: Topic does not exist.");
  });
});

describe("GET /articles/:article_id", () => {
  test("200 OK: Responds with specific article object.", async () => {
    const { body } = await request(app).get("/articles/5");
    const { article } = body;
    expect(article).toEqual({
      article_id: 5,
      author: "rogersop",
      title: "UNCOVERED: catspiracy to bring down democracy",
      votes: 0,
      topic: "cats",
      created_at: "2020-08-03T13:14:00.000Z",
      body: "Bastet walks amongst us, and the cats are taking arms!",
      comment_count: "2",
    });
  });
  test("400 Bad Request: Responds with error if bad article_id is requested.", async () => {
    const { body } = await request(app).get("/articles/dog").expect(400);
    expect(body.msg).toBe("Bad Request.");
  });
  test("404 Not Found: Responds with error if article_id does not exist in database.", async () => {
    const { body } = await request(app).get("/articles/99").expect(404);
    expect(body.msg).toBe("Not Found: Article does not exist.");
  });
});

describe("GET /articles/:article_id/comments", () => {
  test("200 OK: Responds with array of comments for specific article.", async () => {
    const { body } = await request(app).get("/articles/9/comments").expect(200);
    const { comments } = body;
    expect(comments).toBeInstanceOf(Array);
    expect(comments).toHaveLength(2);
    expect(comments).toEqual([
      {
        body: "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
        votes: 16,
        author: "butter_bridge",
        created_at: "2020-04-06T12:17:00.000Z",
        comment_id: 1,
      },
      {
        body: "The owls are not what they seem.",
        votes: 20,
        author: "icellusedkars",
        created_at: "2020-03-14T17:02:00.000Z",
        comment_id: 17,
      },
    ]);
  });
  test("200 OK: Accepts a limit query which limits number of responses.", async () => {
    const { body } = await request(app)
      .get("/articles/1/comments?limit=7")
      .expect(200);
    const { comments } = body;
    expect(comments).toBeInstanceOf(Array);
    expect(comments).toHaveLength(7);
  });
  test("200 OK: Limit query defaults to 10.", async () => {
    const { body } = await request(app).get("/articles/1/comments").expect(200);
    const { comments } = body;
    expect(comments).toBeInstanceOf(Array);
    expect(comments).toHaveLength(10);
  });
  test(`200 OK: Accepts a page query which specifies the page at which to start, 
      calculated using limit.`, async () => {
    const { body } = await request(app)
      .get("/articles/1/comments?limit=3&p=3")
      .expect(200);
    const { comments } = body;
    expect(comments).toEqual([
      {
        comment_id: 6,
        votes: 0,
        created_at: "2020-04-11T21:02:00.000Z",
        author: "icellusedkars",
        body: "I hate streaming eyes even more",
      },
      {
        comment_id: 12,
        votes: 0,
        created_at: "2020-03-02T07:10:00.000Z",
        author: "icellusedkars",
        body: "Massive intercranial brain haemorrhage",
      },
      {
        comment_id: 3,
        votes: 100,
        created_at: "2020-03-01T01:13:00.000Z",
        author: "icellusedkars",
        body: "Replacing the quiet elegance of the dark suit and tie with the casual indifference of these muted earth tones is a form of fashion suicide, but, uh, call me crazy — onyou it works.",
      },
    ]);
  });
  test("200 OK: Valid article_id returning no comments responds with empty array.", async () => {
    const { body } = await request(app).get("/articles/2/comments").expect(200);
    const { comments } = body;
    expect(comments).toEqual([]);
  });
  test("400 Bad Request: Responds with error if bad article_id is requested.", async () => {
    const { body } = await request(app)
      .get("/articles/dog/comments")
      .expect(400);
    expect(body.msg).toBe("Bad Request.");
  });
  test("404 Not Found: Responds with error if article_id does not exist in database.", async () => {
    const { body } = await request(app)
      .get("/articles/99/comments")
      .expect(404);
    expect(body.msg).toBe("Not Found: Article does not exist.");
  });
});

describe("GET /comments", () => {
  test("200 OK: Responds with array of all comment objects.", async () => {
    const { body } = await request(app).get("/comments").expect(200);
    const { comments } = body;
    expect(comments).toBeInstanceOf(Array);
    expect(comments).toHaveLength(10);
    comments.forEach((comment) => {
      expect(comment).toEqual(
        expect.objectContaining({
          comment_id: expect.any(Number),
          author: expect.any(String),
          article_id: expect.any(Number),
          votes: expect.any(Number),
          created_at: expect.any(String),
          body: expect.any(String),
        })
      );
    });
  });
  test("200 OK: Accepts a limit query which limits number of responses.", async () => {
    const { body } = await request(app).get("/comments?limit=7").expect(200);
    const { comments } = body;
    expect(comments).toBeInstanceOf(Array);
    expect(comments).toHaveLength(7);
  });
  test("200 OK: Limit query defaults to 10.", async () => {
    const { body } = await request(app).get("/comments").expect(200);
    const { comments } = body;
    expect(comments).toBeInstanceOf(Array);
    expect(comments).toHaveLength(10);
  });
  test(`200 OK: Accepts a page query which specifies the page at which to start,
      calculated using limit.`, async () => {
    const { body } = await request(app)
      .get("/comments?limit=3&p=3")
      .expect(200);
    const { comments } = body;
    expect(comments).toEqual([
      {
        body: "Lobster pot",
        votes: 0,
        author: "icellusedkars",
        article_id: 1,
        created_at: "2020-05-15T20:19:00.000Z",
        comment_id: 7,
      },
      {
        body: "Delicious crackerbreads",
        votes: 0,
        author: "icellusedkars",
        article_id: 1,
        created_at: "2020-04-14T20:19:00.000Z",
        comment_id: 8,
      },
      {
        body: "Superficially charming",
        votes: 0,
        author: "icellusedkars",
        article_id: 1,
        created_at: "2020-01-01T03:08:00.000Z",
        comment_id: 9,
      },
    ]);
  });
});

describe("GET /topics", () => {
  test("200 OK: Responds with array of all topic objects.", async () => {
    const { body } = await request(app).get("/topics").expect(200);
    const { topics } = body;
    expect(topics).toBeInstanceOf(Array);
    expect(topics).toHaveLength(3);
    topics.forEach((topic) => {
      expect(topic).toEqual(
        expect.objectContaining({
          description: expect.any(String),
          slug: expect.any(String),
        })
      );
    });
  });
});

describe("GET /users", () => {
  test("200 OK: Responds with array of all user objects.", async () => {
    const { body } = await request(app).get("/users").expect(200);
    const { users } = body;
    expect(users).toBeInstanceOf(Array);
    expect(users).toHaveLength(4);
    users.forEach((user) => {
      expect(user).toEqual(
        expect.objectContaining({
          username: expect.any(String),
        })
      );
      expect(user).toEqual(
        expect.not.objectContaining({
          name: expect.any(String),
          avatar_url: expect.any(String),
        })
      );
    });
  });
});

describe("GET /users/:username", () => {
  test("200 OK: Responds with specific user object.", async () => {
    const { body } = await request(app).get("/users/lurker").expect(200);
    const { user } = body;
    expect(user).toEqual({
      username: "lurker",
      name: "do_nothing",
      avatar_url:
        "https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png",
    });
  });
  test("404 Not Found: Responds with error if username does not exist in database.", async () => {
    const { body } = await request(app).get("/users/dog").expect(404);
    expect(body.msg).toEqual("Not Found: User does not exist.");
  });
});

describe("GET /likes/:username", () => {
  test("200 OK: Responds with liked/disliked articles for specific user.", async () => {
    const { body } = await request(app).get("/likes/lurker").expect(200);
    const { likes } = body;
    expect(likes).toEqual([
      { article_id: 1, like_dislike: 1 },
      { article_id: 2, like_dislike: 0 },
    ]);
  });
});

describe("POST /likes/:username", () => {
  test("201 Created: Inserts like/dislike into database and responds with newly add like/dislike.", async () => {
    const { body } = await request(app)
      .post("/likes/lurker")
      .send({
        article_id: 1,
        like_dislike: 1,
      })
      .expect(201);
    const { like } = body;
    expect(like).toEqual({
      username: "lurker",
      article_id: 1,
      like_dislike: 1,
    });
  });
});

describe("POST /articles", () => {
  test("201 Created: Inserts article into database and responds with newly added article.", async () => {
    const { body } = await request(app)
      .post("/articles")
      .send({
        author: "rogersop",
        title: "Nightmail",
        body: "This is the night mail crossing the Border.",
        topic: "cats",
      })
      .expect(201);
    const { article } = body;
    expect(article).toEqual({
      author: "rogersop",
      title: "Nightmail",
      body: "This is the night mail crossing the Border.",
      topic: "cats",
      article_id: 13,
      votes: 0,
      created_at: expect.any(String),
      comment_count: "0",
    });
  });
  test("400 Bad Request: Responds with error if request body format is invalid.", async () => {
    const { body } = await request(app)
      .post("/articles")
      .send({
        author: 1,
      })
      .expect(400);
    expect(body.msg).toEqual("Bad Request.");
  });
  test("400 Bad Request: Responds with error if request body is empty.", async () => {
    const { body } = await request(app).post("/articles").send({}).expect(400);
    expect(body.msg).toEqual("Bad Request.");
  });
});

describe("POST /articles/:article_id/comments", () => {
  test("201 Created: Inserts comment into database and responds with newly added comment.", async () => {
    const { body } = await request(app)
      .post("/articles/1/comments")
      .send({
        username: "rogersop",
        body: "Bringing the cheque and the postal order.",
      })
      .expect(201);
    const { comment } = body;
    expect(comment).toEqual({
      comment_id: 19,
      author: "rogersop",
      article_id: 1,
      votes: 0,
      created_at: expect.any(String),
      body: "Bringing the cheque and the postal order.",
    });
  });
  test("201 Created: Ignores unnecessary properties on request body.", async () => {
    const { body } = await request(app)
      .post("/articles/1/comments")
      .send({
        username: "rogersop",
        body: "Bringing the cheque and the postal order.",
        ignore_me: "unnecessary property",
      })
      .expect(201);
    const { comment } = body;
    expect(comment).toEqual({
      comment_id: 19,
      author: "rogersop",
      article_id: 1,
      votes: 0,
      created_at: expect.any(String),
      body: "Bringing the cheque and the postal order.",
    });
  });
  test("400 Bad Request: Responds with error if request body format is invalid.", async () => {
    const { body } = await request(app)
      .post("/articles/1/comments")
      .send({ author: "icellusedkars", body: "hello" })
      .expect(400);
    expect(body.msg).toEqual("Bad Request.");
  });
  test("400 Bad Request: Responds with error if request body is empty.", async () => {
    const { body } = await request(app)
      .post("/articles/1/comments")
      .send({})
      .expect(400);
    expect(body.msg).toEqual("Bad Request.");
  });
  test("400 Bad Request: Responds with error if missing required field(s).", async () => {
    const { body } = await request(app)
      .post("/articles/1/comments")
      .send({ username: "icellusedkars" })
      .expect(400);
    expect(body.msg).toEqual("Bad Request.");
  });
  test("400 Bad Request: Responds with error if article_id is invalid.", async () => {
    const { body } = await request(app)
      .post("/articles/not_an_id/comments")
      .send({ username: "icellusedkars", body: "hello" })
      .expect(400);
    expect(body.msg).toEqual("Bad Request.");
  });
  test("404 Not Found: Responds with error if article_id does not exist.", async () => {
    const { body } = await request(app)
      .post("/articles/99/comments")
      .send({ username: "icellusedkars", body: "hello" })
      .expect(404);
    expect(body.msg).toEqual("Not Found: Article does not exist.");
  });
  test("404 Not Found: Responds with error if username does not exist.", async () => {
    const { body } = await request(app)
      .post("/articles/1/comments")
      .send({ username: "user18081971", body: "hello" })
      .expect(404);
    expect(body.msg).toEqual("Not Found: User does not exist.");
  });
});

describe("POST /topics", () => {
  test("200 OK: Inserts topic into database and responds with newly added topic.", async () => {
    const { body } = await request(app)
      .post("/topics")
      .send({ slug: "topic_name_here", description: "description here" })
      .expect(200);
    const { topic } = body;
    expect(topic).toEqual({
      slug: "topic_name_here",
      description: "description here",
    });
  });
  test("400 Bad Request: Responds with error if request body format is invalid.", async () => {
    const { body } = await request(app)
      .post("/topics")
      .send({
        slug: "invalid",
      })
      .expect(400);
    expect(body.msg).toEqual("Bad Request.");
  });
  test("400 Bad Request: Responds with error if request body is empty.", async () => {
    const { body } = await request(app).post("/topics").send({}).expect(400);
    expect(body.msg).toEqual("Bad Request.");
  });
});

describe("PATCH /articles/:article_id", () => {
  test("200 OK: Responds with article updated with incremented votes.", async () => {
    const { body } = await request(app)
      .patch("/articles/3")
      .send({ inc_votes: 25 })
      .expect(200);
    const { article } = body;
    expect(article).toEqual({
      article_id: 3,
      author: "icellusedkars",
      title: "Eight pug gifs that remind me of mitch",
      votes: 25,
      topic: "mitch",
      created_at: "2020-11-03T09:12:00.000Z",
      body: "some gifs",
      comment_count: "2",
    });
  });
  test("200 OK: Responds with article updated with decremented votes.", async () => {
    const { body } = await request(app)
      .patch("/articles/3")
      .send({ inc_votes: -35 })
      .expect(200);
    const { article } = body;
    expect(article).toEqual({
      article_id: 3,
      author: "icellusedkars",
      title: "Eight pug gifs that remind me of mitch",
      votes: -35,
      topic: "mitch",
      created_at: "2020-11-03T09:12:00.000Z",
      body: "some gifs",
      comment_count: "2",
    });
  });
  test("200 OK: Empty request body has no effect to article.", async () => {
    const { body } = await request(app)
      .patch("/articles/3")
      .send({})
      .expect(200);
    const { article } = body;
    expect(article).toEqual({
      article_id: 3,
      author: "icellusedkars",
      title: "Eight pug gifs that remind me of mitch",
      votes: 0,
      topic: "mitch",
      created_at: "2020-11-03T09:12:00.000Z",
      body: "some gifs",
      comment_count: "2",
    });
  });
  test("400 Bad Request: Responds with error if bad article_id is requested.", async () => {
    const { body } = await request(app)
      .patch("/articles/cat}")
      .send({ inc_votes: 25 })
      .expect(400);
    expect(body.msg).toBe("Bad Request.");
  });
  test("400 Bad Request: Responds with error if invalid body is requested", async () => {
    const { body } = await request(app)
      .patch("/articles/3")
      .send({ inc_votes: "cat" })
      .expect(400);
    expect(body.msg).toBe("Bad Request.");
  });
  test("404 Not Found: Responds with error if article_id does not exist in database.", async () => {
    const { body } = await request(app)
      .patch("/articles/99")
      .send({ inc_votes: 25 })
      .expect(404);
    expect(body.msg).toBe("Not Found: Article does not exist.");
  });
});

describe("PATCH /comments/:comments_id", () => {
  test("200 OK: Responds with comment updated with incremented votes.", async () => {
    const { body } = await request(app)
      .patch("/comments/3")
      .send({ inc_votes: 25 })
      .expect(200);
    const { comment } = body;
    expect(comment).toEqual({
      comment_id: 3,
      body: "Replacing the quiet elegance of the dark suit and tie with the casual indifference of these muted earth tones is a form of fashion suicide, but, uh, call me crazy — onyou it works.",
      votes: 125,
      author: "icellusedkars",
      article_id: 1,
      created_at: "2020-03-01T01:13:00.000Z",
    });
  });
  test("200 OK: Responds with comment updated with decremented votes.", async () => {
    const { body } = await request(app)
      .patch("/comments/3")
      .send({ inc_votes: -35 })
      .expect(200);
    const { comment } = body;
    expect(comment).toEqual({
      comment_id: 3,
      body: "Replacing the quiet elegance of the dark suit and tie with the casual indifference of these muted earth tones is a form of fashion suicide, but, uh, call me crazy — onyou it works.",
      votes: 65,
      author: "icellusedkars",
      article_id: 1,
      created_at: "2020-03-01T01:13:00.000Z",
    });
  });
  test("400 Bad Request: Responds with error if bad comment_id is requested.", async () => {
    const { body } = await request(app)
      .patch("/comments/cat")
      .send({ inc_votes: 25 })
      .expect(400);
    expect(body.msg).toBe("Bad Request.");
  });
  test("400 Bad Request: Responds with error if invalid body is requested.", async () => {
    const { body } = await request(app)
      .patch("/comments/3")
      .send({ inc_votes: "cat" })
      .expect(400);
    expect(body.msg).toBe("Bad Request.");
  });
  test("404 Not Found: Responds with error if comment_id does not exist in database.", async () => {
    const { body } = await request(app)
      .patch("/comments/999")
      .send({ inc_votes: 25 })
      .expect(404);
    expect(body.msg).toBe("Not Found: Comment does not exist.");
  });
});

describe("DELETE /articles/:article_id", () => {
  test("204 OK: Deletes requested article and responds with no content.", async () => {
    const { body } = await request(app).delete("/articles/2").expect(204);
    expect(body.msg).toBe(undefined);
  });
  test("400 Bad Request: Responds with error if bad article_id is requested.", async () => {
    const { body } = await request(app).delete("/articles/cat").expect(400);
    expect(body.msg).toBe("Bad Request.");
  });
  test("404 Bad Request: Responds with error if article_id does not exist.", async () => {
    const { body } = await request(app).delete("/articles/99").expect(404);
    expect(body.msg).toBe("Not Found: Article does not exist.");
  });
  test("400 Bad Request: Responds with error if delete request violates article_id foreign key constraint.", async () => {
    const { body } = await request(app).delete("/articles/1").expect(400);
    expect(body.msg).toBe("Bad Request: Cannot delete resource.");
  });
});

describe("DELETE /comments/:comment_id", () => {
  test("204 No Content: Deletes requested comment and responds with no content.", async () => {
    const { body } = await request(app).delete("/comments/7").expect(204);
    expect(body.msg).toBe(undefined);
  });
  test("400 Bad Request: Responds with error if bad comment_id is request.", async () => {
    const { body } = await request(app).delete("/comments/cat").expect(400);
    expect(body.msg).toBe("Bad Request.");
  });
  test("404 Bad Request: Responds with error if commend_id does not exist.", async () => {
    const { body } = await request(app).delete("/comments/99").expect(404);
    expect(body.msg).toBe("Not Found: Comment does not exist.");
  });
});

describe("DELETE /likes/:username", () => {
  test("204 No Content: Deletes requested like/dislike and responds with no content.", async () => {
    const { body } = await request(app)
      .delete("/likes/lurker")
      .send({ article_id: 2 })
      .expect(204);
    console.log(body);
    expect(body.msg).toBe(undefined);
  });
});
