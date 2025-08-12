const Order = require('../models/Order');
const Route = require('../models/Route');
const Driver = require('../models/Driver');

// Get all orders
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('route')
      .populate('driver');
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create new order
const createOrder = async (req, res) => {
  try {
    const order = new Order(req.body);
    await order.save();
    res.status(201).json(order);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Update order
const updateOrder = async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    res.json(order);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete order
const deleteOrder = async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    res.json({ message: 'Order deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update order delivery status
const updateDeliveryStatus = async (req, res) => {
  try {
    const { actualDeliveryTime } = req.body;
    const order = await Order.findById(req.params.id).populate('route');
    
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    order.actualDeliveryTime = new Date(actualDeliveryTime);
    order.calculatePenalties(order.actualDeliveryTime, order.route.baseTime);
    order.calculateBonus();
    order.calculateProfit(order.route.calculateFuelCost());
    
    await order.save();
    res.json(order);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  getAllOrders,
  createOrder,
  updateOrder,
  deleteOrder,
  updateDeliveryStatus
};
