const User = require('../models/User');
const Driver = require('../models/Driver');
const Route = require('../models/Route');
const Order = require('../models/Order');

const seedDatabase = async () => {
  try {
    // Create default admin user
    const adminExists = await User.findOne({ username: 'admin' });
    if (!adminExists) {
      await User.create({
        username: 'admin',
        password: 'admin123',
        role: 'admin'
      });
      console.log('Admin user created');
    }

    // Create sample drivers
    const driversCount = await Driver.countDocuments();
    if (driversCount === 0) {
      const drivers = [
        { name: 'John Doe', currentShiftHours: 0 },
        { name: 'Jane Smith', currentShiftHours: 0 },
        { name: 'Mike Johnson', currentShiftHours: 0 }
      ];
      await Driver.insertMany(drivers);
      console.log('Sample drivers created');
    }

    // Create sample routes
    const routesCount = await Route.countDocuments();
    if (routesCount === 0) {
      const routes = [
        { routeId: 'R001', distance: 10, trafficLevel: 'Low', baseTime: 30 },
        { routeId: 'R002', distance: 15, trafficLevel: 'Medium', baseTime: 45 },
        { routeId: 'R003', distance: 20, trafficLevel: 'High', baseTime: 60 }
      ];
      await Route.insertMany(routes);
      console.log('Sample routes created');
    }

    // Create sample orders
    const ordersCount = await Order.countDocuments();
    if (ordersCount === 0) {
      const routes = await Route.find();
      const drivers = await Driver.find();

      const orders = [
        {
          orderId: 'O001',
          valueRs: 1200,
          route: routes[0]._id,
          driver: drivers[0]._id,
          deliveryTimestamp: new Date(),
          status: 'pending'
        },
        {
          orderId: 'O002',
          valueRs: 800,
          route: routes[1]._id,
          driver: drivers[1]._id,
          deliveryTimestamp: new Date(),
          status: 'pending'
        }
      ];
      await Order.insertMany(orders);
      console.log('Sample orders created');
    }

  } catch (error) {
    console.error('Error seeding database:', error);
  }
};

module.exports = seedDatabase;
