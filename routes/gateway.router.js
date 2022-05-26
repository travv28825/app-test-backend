const express = require('express');
const router = express.Router();

const gatewayController = require('../controllers/gateway.controller');

router
  .get('/', gatewayController.getAll)
  .get('/:serial', gatewayController.getBySerial)
  .post('/', gatewayController.addOne)
  .put('/:serial', gatewayController.updateOne)
  .delete('/:serial', gatewayController.deleteOne);

module.exports = router;
