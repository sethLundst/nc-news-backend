# Northcoders News ![Heroku](https://pyheroku-badge.herokuapp.com/?app=nc-news-lundst&style=plastic) 

News aggregation website for Northcoders, built with React and PostgreSQL.

Frontend repo: https://github.com/sethLundst/northcoders-news

Deployed version: https://nc-news-backend-heroku.herokuapp.com/

## Run Locally

Requires **Node v16.x** and **PostgreSQL v14.x**

Clone and navigate to repository:

    # git clone https://github.com/sethLundst/northcoders-news-server.git
    # cd northcoders-news-server

Create environment variables in src folder:

<pre>
<i>northcoders-news-server/src/.env.test</i>

<code>PGDATABASE=nc_news_test</code>
</pre>

<pre>
<i>northcoders-news-server/src/.env.development</i>

<code>PGDATABASE=nc_news</code>
</pre>

Install dependencies:

    # npm install

Seed database:

    # npm run setup-dbs
    # npm run seed

Run tests:

    # npm run test

Run server:

    # npm start
