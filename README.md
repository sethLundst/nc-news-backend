## Northcoders News (backend) ![Heroku](https://pyheroku-badge.herokuapp.com/?app=nc-news-lundst&style=plastic) 
##### Go to [frontend repository](https://github.com/sethLundst/nc-news-frontend)
![](https://badges.aleen42.com/src/javascript.svg)

RESTful web API for [Northcoders News](https://news-northcoders.netlify.app), a news aggregation website built for Northcoders' full-stack software developer bootcamp. Visit the API [here](https://nc-news-lundst.herokuapp.com/), or follow the instructions to run locally.

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
