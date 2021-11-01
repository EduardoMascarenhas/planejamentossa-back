const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const seloSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
      required: true,
    },
    body: {
      type: {},
    },
    image: {
      data: Buffer,
      contentType: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Selo", seloSchema);
