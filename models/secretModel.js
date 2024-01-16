const mongoose = require("mongoose");

const secretSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      require: [true, "Title is required"],
    },
    content: {
      type: String,
      required: [true, "Content is required"],
    },
    isUpdated: {
      type: Boolean,
      default: false,
    },
    user: {
      type: mongoose.Types.ObjectId,
      ref: "user",
      require: [true, "user id is required"],
    },
  },
  { timestamps: true }
);

const secretModel = mongoose.model("secret", secretSchema);

module.exports = secretModel;
