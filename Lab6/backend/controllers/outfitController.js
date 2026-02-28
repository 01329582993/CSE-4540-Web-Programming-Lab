const Outfit = require('../models/outfitModel');
const Clothes = require('../models/clothesModel');
const Accessories = require('../models/accessoriesModel');
const Laundry = require('../models/laundryModel');
const User = require('../models/userModel');
const Weather = require('../models/weatherModel');

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
    // 1) Get User and Location (Lab 6 Requirement)
    const user = await User.findOne();
    const location = user ? user.location : "New York";

    // 2) Get Weather (Lab 6 Requirement)
    const weather = await Weather.findOne({ location }).sort({ date: -1 });
    const condition = weather ? weather.conditions : "sunny";

    // Map weather to season for filtering
    let targetSeason = "Summer";
    if (condition === "cold") targetSeason = "Winter";
    else if (condition === "rainy" || condition === "cloudy") targetSeason = "Autumn";
    else if (condition === "sunny" || condition === "hot") targetSeason = "Summer";

    // 3) Exclude items in laundry (Lab 6: status !== "done")
    const laundryItems = await Laundry.find({ status: { $ne: "done" } }).select("items");
    const excludedIds = laundryItems.flatMap(l => l.items);

    // 4) Filter Clothes (Lab 6: season, occasion, color compatibility)
    const clothes = await Clothes.find({
      _id: { $nin: excludedIds },
      status: "active",
      season: { $in: [targetSeason, "All"] }
    });

    if (clothes.length === 0) {
      return res.status(400).json({ message: "No compatible clothes available for current conditions" });
    }

    // Select one top and one bottom for a sensible outfit
    const tops = clothes.filter(c => c.category === 'top');
    const bottoms = clothes.filter(c => c.category === 'bottom');

    let selectedClothes = [];
    if (tops.length > 0 && bottoms.length > 0) {
      selectedClothes = [
        tops[Math.floor(Math.random() * tops.length)],
        bottoms[Math.floor(Math.random() * bottoms.length)]
      ];
    } else {
      selectedClothes = clothes.sort(() => 0.5 - Math.random()).slice(0, 2);
    }

    // 5) Select Accessories (Lab 6: compatibility rules)
    const categoryNames = selectedClothes.map(c => c.category);
    const accessories = await Accessories.find({
      status: "active",
      compatibleWith: { $in: [...categoryNames, "any"] }
    });
    const selectedAccessories = accessories.sort(() => 0.5 - Math.random()).slice(0, 1);

    // 6) Create Outfit and Update Wear Counts (Lab 6 Requirement)
    const outfit = await Outfit.create({
      name: `StyleSync ${condition.charAt(0).toUpperCase() + condition.slice(1)} Look`,
      clothingItems: selectedClothes.map(c => c._id),
      accessories: selectedAccessories.map(a => a._id),
      weatherCondition: condition,
      outfitImages: selectedClothes[0]?.images ? [selectedClothes[0].images[0]] : []
    });

    // Update wear counts for all components
    for (let item of selectedClothes) {
      item.wearCount += 1;
      item.lastWorn = new Date();
      await item.save();
    }

    for (let acc of selectedAccessories) {
      acc.wearCount += 1;
      acc.lastWorn = new Date();
      await acc.save();
    }

    outfit.wearCount += 1;
    await outfit.save();

    res.status(201).json({
      success: true,
      message: "Smart outfit generated based on weather and compatibility",
      outfit
    });

  } catch (error) {
    console.error("Generate Outfit Error:", error);
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
