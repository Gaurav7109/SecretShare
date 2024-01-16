const mongoose = require("mongoose");
const secretModel = require("../models/secretModel");
const userModel = require("../models/userModel");

//GET ALL BLOGS
exports.getAllSecretController = async (req, res) => {
  try {
    const secrets = await secretModel.find({}).populate("user");
    // const secrets = await secretModel.find({});
    // console.log(secrets);
    if (!secrets) {
      return res.status(200).send({
        success: false,
        message: "No secrets found",
      });
    }
    return res.status(200).send({
      success: true,
      SecretCount: secrets.length,
      message: "All secrets lists",
      secrets,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error while getting all secrets",
      error,
    });
  }
};

//Create Blog
exports.createSecretController = async (req, res) => {
  try {
    const { title, content, user } = req.body;
    //validation
    if (!title || !content) {
      return res.status(400).send({
        success: false,
        message: "Please provide both fields",
      });
    }
    const exisitingUser = await userModel.findById(user);
    //validaton
    if (!exisitingUser) {
      return res.status(404).send({
        success: false,
        message: "Please login first",
      });
    }

    const newSecret = new secretModel({ title, content, user });
    const session = await mongoose.startSession();
    session.startTransaction();
    await newSecret.save({ session });
    exisitingUser.secrets.push(newSecret);
    await exisitingUser.save({ session });
    await session.commitTransaction();
    await newSecret.save();
    return res.status(201).send({
      success: true,
      message: "Secret created successfully",
      newSecret,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).send({
      success: false,
      message: "Error while creating secret",
      error,
    });
  }
};

//Update Blog
exports.updateSecretController = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content,} = req.body;
    const secret = await secretModel.findByIdAndUpdate(
      id,
      { ...req.body },
      { new: true },
      // {isUpdated:true}
    );
    return res.status(200).send({
      success: true,
      message: "Updated Secret successfully",
      secret,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).send({
      success: false,
      message: "Error while updating Secret",
      error,
    });
  }
};

//Delete Blog
exports.deleteSecretController = async (req, res) => {
  try {
    const secret = await secretModel
      // .findOneAndDelete(req.params.id)
      .findByIdAndDelete(req.params.id)
      .populate("user");
    await secret.user.secrets.pull(secret);
    await secret.user.save();
    return res.status(200).send({
      success: true,
      message: "Secret Deleted!",
    });
  } catch (error) {
    console.log(error);
    return res.status(400).send({
      success: false,
      message: "Error while deleteing your secret",
      error,
    });
  }
};

//GET USER BLOG
exports.userSecretController = async (req, res) => {
  try {
    const UserSecrets = await userModel.findById(req.params.id).populate("secrets");
    const user = await userModel.findById(req.params.id);
    const username = user.username;
    // console.log(username);
    if (!UserSecrets) {
      return res.status(404).send({
        success: false,
        message: "secrets not found with this id",
        username,
        
      });
    }
    return res.status(200).send({
      success: true,
      message: "secrets fetched successfully",
      UserSecrets,
      username,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).send({
      success: false,
      message: "error in user secrets",
      error,
    });
  }
};

exports.getSecretByIdController = async (req, res) => {
  try {
    const { id } = req.params;
    const secret = await secretModel.findById(id);
    if (!secret) {
      return res.status(404).send({
        success: false,
        message: "secret not found with your id",
      });
    }
    return res.status(200).send({
      success: true,
      message: "Fetched single secret",
      secret,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).send({
      success: false,
      message: "Error while getting single secret",
      error,
    });
  }
};