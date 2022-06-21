const format = require("pg-format");
const db = require("../db/connection");

exports.checkExists = async (table, column, value) => {
  if (value) {
    const result = await db.query(
      format(`SELECT * FROM %I WHERE %I = $1;`, table, column),
      [value]
    );
    if (result.rows.length === 0) {
      return Promise.reject({
        status: 404,
        msg: `Not Found: ${
          table.charAt(0).toUpperCase() + table.slice(1, -1)
        } does not exist.`,
      });
    }
  }
};

exports.handleCustomErrors = (err, _req, res, next) => {
  if (err.status && err.msg) {
    res.status(err.status).send({ msg: err.msg });
  } else next(err);
};

exports.handlePsqlErrors = (err, req, res, next) => {
  if (
    err.code === "22P02" ||
    err.code === "23502" ||
    (req.method !== "DELETE") & (err.code === "23503")
  ) {
    res.status(400).send({ msg: "Bad Request." });
  } else if (req.method === "DELETE" && err.code === "23503") {
    res.status(400).send({ msg: `Bad Request: Cannot delete resource.` });
  } else if (err.code === "42601") {
    res.status(400).send({ msg: "Bad Request: Invalid order query." });
  } else if (err.code === "42703") {
    res.status(404).send({ msg: "Bad Request: Invalid sort_by query." });
  } else next(err, req, res);
};

exports.handleServerErrors = (err, _req, res, _next) => {
  console.log(err);
  res.status(500).send({ msg: "Internal Server Error." });
};
