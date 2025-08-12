const mongoose = require('mongoose');

const simulationSchema = new mongoose.Schema({
  timestamp: {
    type: Date,
    default: Date.now,
  },
  inputs: {
    availableDrivers: Number,
    routeStartTime: String,
    maxHoursPerDriver: Number,
  },
  results: {
    totalProfit: Number,
    efficiencyScore: Number,
    onTimeDeliveries: Number,
    lateDeliveries: Number,
    fuelCosts: {
      total: Number,
      byTrafficLevel: {
        Low: Number,
        Medium: Number,
        High: Number,
      },
    },
    driverUtilization: [{
      driverId: mongoose.Schema.Types.ObjectId,
      hoursWorked: Number,
      deliveriesCompleted: Number,
    }],
  }
}, { timestamps: true });

module.exports = mongoose.model('Simulation', simulationSchema);
