const router = require("express").Router();
const {
  allCategories,
  create,
  remove,
  update,
} = require("../controller/category");

router.get("/allCategories", allCategories);
router.post("/create", create);
router.delete("/remove/:categoryId", remove);
router.patch("/update/:categoryId", update);

module.exports = router;
