const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const bannerSchema = new mongoose.Schema(
  {
    link: {
      type: String,
    },
    image: {
      data: Buffer,
      contentType: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Banner", bannerSchema);
