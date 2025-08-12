const Simulation = require('../models/Simulation');
const Driver = require('../models/Driver');
const Order = require('../models/Order');
const Route = require('../models/Route');

// Run new simulation
const runSimulation = async (req, res) => {
  try {
    const { availableDrivers, routeStartTime, maxHoursPerDriver } = req.body;

    // Validate inputs
    if (availableDrivers <= 0 || maxHoursPerDriver <= 0) {
      return res.status(400).json({ error: 'Invalid input parameters' });
    }

    // Get active drivers and orders
    const drivers = await Driver.find({ active: true }).limit(availableDrivers);
    const orders = await Order.find({ status: 'pending' }).populate('route');

    if (drivers.length === 0) {
      return res.status(400).json({ error: 'No active drivers available' });
    }

    // Initialize simulation results
    let totalProfit = 0;
    let onTimeDeliveries = 0;
    let lateDeliveries = 0;
    let fuelCosts = {
      total: 0,
      byTrafficLevel: { Low: 0, Medium: 0, High: 0 }
    };

    // Allocate orders to drivers
    const driverUtilization = await allocateOrders(
      drivers,
      orders,
      maxHoursPerDriver,
      routeStartTime
    );

    // Calculate KPIs
    const simulationResults = calculateSimulationKPIs(
      orders,
      driverUtilization,
      fuelCosts
    );

    // Create simulation record
    const simulation = new Simulation({
      inputs: {
        availableDrivers,
        routeStartTime,
        maxHoursPerDriver
      },
      results: simulationResults
    });

    await simulation.save();
    res.json(simulation);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get simulation history
const getSimulationHistory = async (req, res) => {
  try {
    const simulations = await Simulation.find()
      .sort({ timestamp: -1 })
      .limit(10);
    res.json(simulations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Helper function to allocate orders to drivers
const allocateOrders = async (drivers, orders, maxHours, startTime) => {
  const driverUtilization = drivers.map(driver => ({
    driverId: driver._id,
    hoursWorked: 0,
    deliveriesCompleted: 0
  }));

  // Sort orders by value (highest first)
  orders.sort((a, b) => b.valueRs - a.valueRs);

  for (const order of orders) {
    // Find least utilized driver
    const availableDriver = driverUtilization
      .filter(d => d.hoursWorked < maxHours)
      .sort((a, b) => a.hoursWorked - b.hoursWorked)[0];

    if (availableDriver) {
      order.driver = availableDriver.driverId;
      order.status = 'assigned';
      await order.save();

      const route = order.route;
      const deliveryTime = route.baseTime * (drivers.find(d => 
        d._id.equals(availableDriver.driverId)).isFatigued ? 1.3 : 1);

      availableDriver.hoursWorked += deliveryTime / 60;
      availableDriver.deliveriesCompleted++;
    }
  }

  return driverUtilization;
};

// Helper function to calculate simulation KPIs
const calculateSimulationKPIs = (orders, driverUtilization, fuelCosts) => {
  let totalProfit = 0;
  let onTimeDeliveries = 0;
  let lateDeliveries = 0;

  orders.forEach(order => {
    if (order.status === 'assigned') {
      const route = order.route;
      const routeFuelCost = route.calculateFuelCost();
      
      fuelCosts.total += routeFuelCost;
      fuelCosts.byTrafficLevel[route.trafficLevel] += routeFuelCost;

      if (order.penalties > 0) {
        lateDeliveries++;
      } else {
        onTimeDeliveries++;
      }

      totalProfit += order.calculateProfit(routeFuelCost);
    }
  });

  const efficiencyScore = (onTimeDeliveries / (onTimeDeliveries + lateDeliveries)) * 100;

  return {
    totalProfit,
    efficiencyScore,
    onTimeDeliveries,
    lateDeliveries,
    fuelCosts,
    driverUtilization
  };
};

module.exports = {
  runSimulation,
  getSimulationHistory
};
