const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, "Username is required"],
  },
  googleId: {
    type: String,
  },
  email: {
    type: String,
    required: [true, "Email is required"],
  },
  password: {
    type: String,
    required: [true, "Password is required"],
  },
  // secretQuestion: {
  //   type: String,
  //   required: [true, "Please answer secret question"],
  // },
  // hasPost:{
  //   type :Boolean,
  //   default: false,
  // },
  secrets: [
    {
      type: mongoose.Types.ObjectId,
      ref: "secret",
    },
  ],
},
{ timestamps: true }
);

const userModel = mongoose.model("user", userSchema);

module.exports = userModel;
