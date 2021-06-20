const router = require("express").Router();
const {auth} = require("../controller/auth")

router.post("/login", auth.login);

module.exports = router;
