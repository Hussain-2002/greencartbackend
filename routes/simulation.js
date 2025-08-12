const express = require('express');
const router = express.Router();
const simulationController = require('../controllers/simulationController');
const auth = require('../middleware/auth');

router.use(auth); // Protect all routes

router.post('/run', simulationController.runSimulation);
router.get('/history', simulationController.getSimulationHistory);

module.exports = router;
