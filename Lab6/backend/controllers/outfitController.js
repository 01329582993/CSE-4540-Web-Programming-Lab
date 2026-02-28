const Outfit = require('../models/outfitModel');
const Clothes = require('../models/clothesModel');
const Accessories = require('../models/accessoriesModel');
const Laundry = require('../models/laundryModel');

exports.addOutfit = async (req, res) => {
  try {
    const { name, clothingItems, accessories, weatherCondition } = req.body;

    const outfit = await Outfit.create({
      name,
      clothingItems,
      accessories,
      weatherCondition
    });

    res.status(201).json({
      success: true,
      message: "Outfit added",
      outfit
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.generateOutfit = async (req, res) => {
  try {
    const laundryItems = await Laundry.find({ status: { $ne: "done" } })
      .select("items");

    const excludedIds = laundryItems.flatMap(l => l.items);

    const clothes = await Clothes.find({
      _id: { $nin: excludedIds },
      status: "active"
    });

    if (clothes.length === 0) {
      return res.status(400).json({ message: "No clothes available" });
    }

    const selectedClothes = clothes.sort(() => 0.5 - Math.random()).slice(0, 2);
    const accessories = await Accessories.find({ status: "active" });
    const selectedAccessories = accessories.sort(() => 0.5 - Math.random()).slice(0, 1);

    // ⭐ TAKE IMAGE FROM FIRST CLOTHING ITEM
    let outfitImage = null;
    if (selectedClothes.length > 0 && selectedClothes[0].images && selectedClothes[0].images.length > 0) {
      outfitImage = {
        url: selectedClothes[0].images[0].url,
        public_id: selectedClothes[0].images[0].public_id
      };
    }

    const outfit = await Outfit.create({
      name: `StyleSync Look ${new Date().toLocaleDateString()}`,
      clothingItems: selectedClothes.map(c => c._id),
      accessories: selectedAccessories.map(a => a._id),
      weatherCondition: "sunny",
      outfitImages: outfitImage
    });

    for (let item of selectedClothes) {
      item.wearCount += 1;
      item.lastWorn = new Date();
      await item.save();
    }

    for (let acc of accessories.slice(0, 1)) {
      acc.wearCount += 1;
      acc.lastWorn = new Date();
      await acc.save();
    }

    outfit.wearCount += 1;
    await outfit.save();

    res.status(201).json({
      success: true,
      message: "Outfit generated",
      outfit
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAllOutfits = async (req, res) => {
  try {
    const outfits = await Outfit.find()
      .populate({
        path: "clothingItems",
        select: "name category color season occasion images wearCount status"
      })
      .populate({
        path: "accessories",
        select: "name type images wearCount status"
      });

    res.status(200).json(outfits);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getOutfitById = async (req, res) => {
  try {
    const outfit = await Outfit.findById(req.params.id)
      .populate({
        path: "clothingItems",
        select: "name category color season occasion images wearCount status"
      })
      .populate({
        path: "accessories",
        select: "name type images wearCount status"
      });

    if (!outfit) {
      return res.status(404).json({ message: "Outfit not found" });
    }

    res.status(200).json(outfit);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.modifyOutfitById = async (req, res) => {
  try {
    const updated = await Outfit.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Outfit not found" });
    }

    res.status(200).json({
      success: true,
      outfit: updated
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
