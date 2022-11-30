const express = require("express");
const router = express.Router();

const controllersUser = require("../controllers/user");
const checkAuth = require("../middleware/check-auth");

router.get("/", controllersUser.users_get_all);

router.post("/signup", controllersUser.users_signup_user);

router.post("/login", controllersUser.users_login_user);

router.delete("/:userId", checkAuth, controllersUser.users_delete_user);

module.exports = router;