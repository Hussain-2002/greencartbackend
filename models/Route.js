const mongoose = require('mongoose');

const routeSchema = new mongoose.Schema({
  routeId: {
    type: String,
    required: true,
    unique: true,
  },
  distance: {
    type: Number,
    required: true,
    min: 0,
  },
  trafficLevel: {
    type: String,
    enum: ['Low', 'Medium', 'High'],
    required: true,
  },
  baseTime: {
    type: Number, // in minutes
    required: true,
    min: 0,
  },
  active: {
    type: Boolean,
    default: true,
  }
}, { timestamps: true });

// Method to calculate fuel cost based on company rules
routeSchema.methods.calculateFuelCost = function() {
  const baseCost = this.distance * 5; // ₹5/km base cost
  const trafficSurcharge = this.trafficLevel === 'High' ? this.distance * 2 : 0; // ₹2/km surcharge for high traffic
  return baseCost + trafficSurcharge;
};

module.exports = mongoose.model('Route', routeSchema);
