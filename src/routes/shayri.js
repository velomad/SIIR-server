const router = require("express").Router();
const { create, allShayris, remove } = require("../controller/shayri");
const { verifyUserAccessToken } = require("../middlewares/jwt");

router.get("/allShayris", allShayris);
router.post("/create", verifyUserAccessToken, create);
router.delete("/remove/:shayriId", verifyUserAccessToken, remove);

module.exports = router;
