const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

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
    eixo: { type: ObjectId, ref: "Eixo", required: true },
    selos: [{ type: ObjectId, ref: "Selo" }],
  },
  { timestamp: true }
);

module.exports = mongoose.model("Projeto", projetoSchema);
