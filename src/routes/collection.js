const router = require("express").Router();
const {
  allCollections,
  create,
  removeCollection,
} = require("../controller/collection");
const { verifyUserAccessToken } = require("../middlewares/jwt");

router.post("/create", verifyUserAccessToken, create);
router.get("/allCollections", verifyUserAccessToken, allCollections);
router.delete("/remove/:collectionId", verifyUserAccessToken, removeCollection);

module.exports = router;
