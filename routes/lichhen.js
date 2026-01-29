const express = require('express');
const router = express.Router();
const controller = require('../controllers/lichhenController');

// Danh sách các API
router.get('/', controller.getAllAppointments);
router.post('/', controller.createAppointment);
router.put('/:id', controller.updateAppointment);
router.delete('/:id', controller.deleteAppointment);

module.exports = router;
