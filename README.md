# Northcoders News

News aggregation website for Northcoders, built with React and PostgreSQL.

Frontend repo: https://github.com/sethLundst/nc-news-frontend

Deployed version: https://nc-news-backend-heroku.herokuapp.com/

## Run Locally

Requires **Node v16.x** and **PostgreSQL v14.x**

Clone and navigate to repository:

    # git clone https://github.com/sethLundst/nc-news-backend.git
    # cd nc-news-backend

Create environment variables in src folder:

<pre>
<i>nc-news-backend/src/.env.test</i>

<code>PGDATABASE=nc_news_test</code>
</pre>

<pre>
<i>nc-news-backend/src/.env.development</i>

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
