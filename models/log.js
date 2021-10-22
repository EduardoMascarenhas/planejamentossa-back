const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const logSchema = new mongoose.Schema(
  {
    userLog: {
      type: ObjectId,
      ref: "User",
      required: true,
    },
    userName: {
      type: String,
      required: true,
      maxlength: 32,
    },
    acao: {
      type: String,
      required: true,
      max: 500,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Log", logSchema);
