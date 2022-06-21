const {
  getLikesByUser,
  postLikeByUser,
  deleteLikeByUser,
} = require("../controllers");

const likesRouter = require("express").Router();

likesRouter
  .route("/:username")
  .get(getLikesByUser)
  .post(postLikeByUser)
  .delete(deleteLikeByUser);

module.exports = likesRouter;
