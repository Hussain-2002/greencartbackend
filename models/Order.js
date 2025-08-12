const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  orderId: {
    type: String,
    required: true,
    unique: true,
  },
  valueRs: {
    type: Number,
    required: true,
    min: 0,
  },
  route: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Route',
    required: true,
  },
  driver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Driver',
  },
  deliveryTimestamp: {
    type: Date,
    required: true,
  },
  actualDeliveryTime: {
    type: Date,
  },
  status: {
    type: String,
    enum: ['pending', 'assigned', 'in-progress', 'delivered', 'late'],
    default: 'pending',
  },
  profit: {
    type: Number,
    default: 0,
  },
  penalties: {
    type: Number,
    default: 0,
  },
  bonus: {
    type: Number,
    default: 0,
  }
}, { timestamps: true });

// Method to calculate delivery penalties
orderSchema.methods.calculatePenalties = function(actualDeliveryTime, baseRouteTime) {
  if (actualDeliveryTime > baseRouteTime + 10) { // 10 minutes grace period
    this.penalties = 50; // ₹50 late delivery penalty
    this.status = 'late';
  }
  return this.penalties;
};

// Method to calculate high-value bonus
orderSchema.methods.calculateBonus = function() {
  if (this.valueRs > 1000 && this.status !== 'late') {
    this.bonus = this.valueRs * 0.1; // 10% bonus for high-value on-time deliveries
  }
  return this.bonus;
};

// Method to calculate total profit
orderSchema.methods.calculateProfit = function(fuelCost) {
  this.profit = this.valueRs + this.bonus - this.penalties - fuelCost;
  return this.profit;
};

module.exports = mongoose.model('Order', orderSchema);
