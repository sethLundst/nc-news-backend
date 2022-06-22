const {
  getLikesByUser,
  postLikeByUser,
  deleteLikeByUser,
} = require("../controllers");

const likesRouter = require("express").Router();

likesRouter.route("/:username").get(getLikesByUser).post(postLikeByUser);

likesRouter.route("/:username/:id").delete(deleteLikeByUser);

module.exports = likesRouter;
