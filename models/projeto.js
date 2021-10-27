const mongoose = require("mongoose");

const projetoSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
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
    body: {
      type: {},
      required: true,
    },
  },
  { timestamp: true }
);

module.exports = mongoose.model("Projeto", projetoSchema);
