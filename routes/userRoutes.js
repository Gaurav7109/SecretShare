const express = require("express");
const {
  getAllUsers,
  getaUsers,
  registerController,
  loginController,
  loginByGoogleController,
  forgotPasswordController,
} = require("../controllers/userController");

//router object
const router = express.Router();

// GET ALL USERS || GET
router.get("/all-users", getAllUsers);

// GET one USER || GET
// router.get("/users", getaUsers);

// CREATE USER || POST
router.post("/register", registerController);

//LOGIN || POST
router.post("/login", loginController);

router.post("/login-by-google",loginByGoogleController);
// FORGOT PASSWORD || POST
router.post('/forget-password', forgotPasswordController);

module.exports = router;