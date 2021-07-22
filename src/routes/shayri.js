const router = require("express").Router();
const {
  create,
  allUserPrefShayris,
  remove,
  myShayris,
  pinShayri,
  unPinShayri,
  likeToggle,
  likedBy,
  pinned,
} = require("../controller/shayri");
const { verifyUserAccessToken } = require("../middlewares/jwt");

router.post("/allUserPrefShayris", verifyUserAccessToken, allUserPrefShayris);
router.post("/create", verifyUserAccessToken, create);
router.delete("/remove/:shayriId", verifyUserAccessToken, remove);
router.get("/my", verifyUserAccessToken, myShayris);
router.get("/pinned", verifyUserAccessToken, pinned);
router.post("/pin/:shayriId", verifyUserAccessToken, pinShayri);
router.delete("/unPin/:shayriId", verifyUserAccessToken, unPinShayri);
router.post("/like/:shayriId", verifyUserAccessToken, likeToggle);
router.get("/likedBy/:shayriId", likedBy);

module.exports = router;
