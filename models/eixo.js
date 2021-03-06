const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const eixoSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
      min: 3,
      max: 160,
      required: true,
    },
    subTitle: {
      type: String,
      trim: true,
      min: 3,
      max: 160,
    },
    slug: {
      type: String,
      unique: true,
      index: true,
    },
    vis: {
      type: {},
      required: true,
    },
    met: {
      type: {},
      required: true,
    },
    pro: {
      type: {},
      required: true,
    },
    borderColor: {
      type: String,
      required: true,
    },
    thumb: {
      data: Buffer,
      contentType: String,
    },
    projetos: [{ type: ObjectId, ref: "Projeto", required: true }],
    postedBy: {
      type: ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Eixo", eixoSchema);
