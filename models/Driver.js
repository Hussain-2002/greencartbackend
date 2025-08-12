const mongoose = require('mongoose');

const driverSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  currentShiftHours: {
    type: Number,
    default: 0,
  },
  pastWeekHours: {
    type: [Number],
    default: Array(7).fill(0),
  },
  isFatigued: {
    type: Boolean,
    default: false,
  },
  lastWorkDate: {
    type: Date,
    default: Date.now,
  },
  active: {
    type: Boolean,
    default: true,
  }
}, { timestamps: true });

// Method to update driver fatigue status
driverSchema.methods.updateFatigueStatus = function(hoursWorked) {
  this.isFatigued = hoursWorked > 8;
  return this.save();
};

// Method to update weekly hours
driverSchema.methods.updateWeeklyHours = function(hoursWorked) {
  this.pastWeekHours.push(hoursWorked);
  this.pastWeekHours.shift(); // Remove oldest day
  return this.save();
};

module.exports = mongoose.model('Driver', driverSchema);
