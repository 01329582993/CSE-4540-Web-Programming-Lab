const mongoose = require("mongoose");

const clothesSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, enum: ['top', 'bottom', 'dress', 'suit', 'shoes', 'accessories', 'other'] },
  subcategory: String,
  color: { type: String, required: true },
  season: [String],
  occasion: [String],
  images: {
    type: [{
      url: String,
      public_id: String,
    }],
  },
  wearCount: { type: Number, default: 0 },
  lastWorn: Date,
  status: { type: String, enum: ["active", "donated", "sold"], default: "active" },
});

module.exports = mongoose.model("Clothes", clothesSchema);
