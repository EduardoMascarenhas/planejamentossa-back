const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const arquivoSchema = new mongoose.Schema(
  {
    arquivo: {
      data: Buffer,
      contentType: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Arquivo", arquivoSchema);
