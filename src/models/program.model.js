const mongoose = require("mongoose");

const programSchema = new mongoose.Schema(
  {
    logo: { type: String, required: true },
    title: { type: String, required: true },
    content: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Program", programSchema);
