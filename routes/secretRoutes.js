const express = require("express");
const {
  getAllSecretController,
  createSecretController,
  updateSecretController,
  deleteSecretController,
  userSecretController,
  getSecretByIdController,
} = require("../controllers/secretController");

//router object
const router = express.Router();

//routes
// GET || all blogs
router.get("/all-secrets", getAllSecretController);

//POST || create blog
router.post("/create-secret", createSecretController);

//PUT || update blog
router.put("/update-secret/:id", updateSecretController);

//DELETE || delete blog
router.delete("/delete-secret/:id", deleteSecretController);

//GET || user blog
router.get("/user-secret/:id", userSecretController);

//GET || update Blog Details
router.get("/get-secret/:id", getSecretByIdController);
module.exports = router;