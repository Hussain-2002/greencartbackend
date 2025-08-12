const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const auth = require('../middleware/auth');

router.use(auth); // Protect all routes

router.get('/', orderController.getAllOrders);
router.post('/', orderController.createOrder);
router.put('/:id', orderController.updateOrder);
router.delete('/:id', orderController.deleteOrder);
router.put('/:id/delivery', orderController.updateDeliveryStatus);

module.exports = router;
