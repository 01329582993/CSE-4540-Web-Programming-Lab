const Weather = require('../models/weatherModel');

exports.addWeather = async (req, res) => {
  try {
    const { location, conditions, date } = req.body;

    if (!location || !conditions) {
      return res.status(400).json({ message: "location and conditions are required" });
    }

    const weather = await Weather.create({
      location,
      conditions,
      date: date ? new Date(date) : new Date(),
    });

    res.status(201).json({ message: "Weather added", weather });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};