const mongoose = require("mongoose");

const courtSchema = new mongoose.Schema({
  courtType: {
    type: String,
    enum: ["District Court", "High Court", "Supreme Court", "Magistrate Court"],
    required: true,
  },
});

module.exports = mongoose.model("Court", courtSchema);