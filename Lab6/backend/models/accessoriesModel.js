const mongoose = require("mongoose");

const accessoriesSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: String,
  color: String,
  compatibleWith: [String],
  image: {
    url: String,
    public_id: String,
  },
  wearCount: { type: Number, default: 0 },
  lastWorn: Date,
  status: { type: String, enum: ["active", "donated"], default: "active" },
});

module.exports = mongoose.model("Accessories", accessoriesSchema);
