const Driver = require('../models/Driver');

// Get all drivers
const getAllDrivers = async (req, res) => {
  try {
    const drivers = await Driver.find({ active: true });
    res.json(drivers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create new driver
const createDriver = async (req, res) => {
  try {
    const driver = new Driver(req.body);
    await driver.save();
    res.status(201).json(driver);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Update driver
const updateDriver = async (req, res) => {
  try {
    const driver = await Driver.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!driver) {
      return res.status(404).json({ error: 'Driver not found' });
    }
    res.json(driver);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete driver (soft delete)
const deleteDriver = async (req, res) => {
  try {
    const driver = await Driver.findByIdAndUpdate(
      req.params.id,
      { active: false },
      { new: true }
    );
    if (!driver) {
      return res.status(404).json({ error: 'Driver not found' });
    }
    res.json({ message: 'Driver deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getAllDrivers,
  createDriver,
  updateDriver,
  deleteDriver
};
