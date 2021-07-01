const router = require("express").Router();
const {
  create,
  allUserPrefShayris,
  remove,
  myShayris,
  pinShayri,
  unPinShayri,
} = require("../controller/shayri");
const { verifyUserAccessToken } = require("../middlewares/jwt");

router.post("/allUserPrefShayris", allUserPrefShayris);
router.post("/create", verifyUserAccessToken, create);
router.delete("/remove/:shayriId", verifyUserAccessToken, remove);
router.get("/my", verifyUserAccessToken, myShayris);
router.post("/pin/:shayriId", verifyUserAccessToken, pinShayri);
router.delete("/unPin/:shayriId", verifyUserAccessToken, unPinShayri);

module.exports = router;
