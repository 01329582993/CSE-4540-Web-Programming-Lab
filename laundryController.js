const Laundry = require('../models/laundryModel');

exports.addLaundry = async (req, res) => {
  try {
    const { items, status, scheduledDate } = req.body;

    if (!items || !status) {
      return res.status(400).json({ message: "items and status are required" });
    }

    const laundry = await Laundry.create({
      items, 
      status,
      scheduledDate: scheduledDate ? new Date(scheduledDate) : new Date(),
    });

    res.status(201).json({ message: "Laundry added", laundry });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.updateLaundry = async (req, res) => {
  try {
    const { id } = req.params;
    const { items, status, scheduledDate } = req.body;

    const updated = await Laundry.findByIdAndUpdate(
      id,
      {
        ...(items && { items }),
        ...(status && { status }),
        ...(scheduledDate && { scheduledDate: new Date(scheduledDate) }),
      },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Laundry record not found" });
    }

    res.status(200).json({ message: "Laundry updated", laundry: updated });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
