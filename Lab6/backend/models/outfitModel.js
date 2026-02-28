const mongoose = require("mongoose");

const outfitSchema = new mongoose.Schema({
  name: String,
  clothingItems: [{ type: mongoose.Schema.Types.ObjectId, ref: "Clothes" }],
  accessories: [{ type: mongoose.Schema.Types.ObjectId, ref: "Accessories" }],
  weatherCondition: String,
  outfitImages: {
    url: String,
    public_id: String,
  },
  wearCount: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Outfit", outfitSchema);
