const Route = require('../models/Route');

// Get all routes
const getAllRoutes = async (req, res) => {
  try {
    const routes = await Route.find({ active: true });
    res.json(routes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create new route
const createRoute = async (req, res) => {
  try {
    const route = new Route(req.body);
    await route.save();
    res.status(201).json(route);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Update route
const updateRoute = async (req, res) => {
  try {
    const route = await Route.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!route) {
      return res.status(404).json({ error: 'Route not found' });
    }
    res.json(route);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete route (soft delete)
const deleteRoute = async (req, res) => {
  try {
    const route = await Route.findByIdAndUpdate(
      req.params.id,
      { active: false },
      { new: true }
    );
    if (!route) {
      return res.status(404).json({ error: 'Route not found' });
    }
    res.json({ message: 'Route deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getAllRoutes,
  createRoute,
  updateRoute,
  deleteRoute
};
