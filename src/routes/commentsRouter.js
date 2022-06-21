const {
  getComments,
  patchCommentByID,
  deleteCommentByID,
} = require("../controllers");

const commentsRouter = require("express").Router();

commentsRouter.route("/").get(getComments);

commentsRouter
  .route("/:comment_id")
  .patch(patchCommentByID)
  .delete(deleteCommentByID);

module.exports = commentsRouter;
