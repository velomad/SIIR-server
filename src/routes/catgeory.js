const router = require("express").Router();
const {
  allCategories,
  create,
  remove,
  update,
  addUserCategories,
  getUserCategories,
  toggleUserCategory,
} = require("../controller/category");
const { verifyUserAccessToken } = require("../middlewares/jwt");

// DASHBOARD APIS
router.get("/allCategories", allCategories);
router.post("/create", create);
router.patch("/update/:categoryId", update);
router.delete("/remove/:categoryId", remove);

// USER APIS
router.post("/addUserCategories", verifyUserAccessToken, addUserCategories);
router.get("/getUserCategories", verifyUserAccessToken, getUserCategories);
router.post(
  "/toggleUserCategory/:categoryId",
  verifyUserAccessToken,
  toggleUserCategory
);

module.exports = router;
