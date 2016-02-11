const express = require('express');
const router = express.Router();
const gatewayController = require('../controllers/gateway.controller');
const deviceController = require('../controllers/device.controller');

router
  // gateway router
  .get('/gateway', gatewayController.getAll)
  .get('/gateway/:serial', gatewayController.getBySerial)
  .post('/gateway', gatewayController.addOne)
  .put('/gateway/:serial', gatewayController.updateOne)
  .delete('/gateway/:serial', gatewayController.deleteOne)

  // device router
  .get('/device', deviceController.getAll)
  .get('/device/:uid', deviceController.getByUID)
  .post('/device', deviceController.addOne)
  .put('/device/:uid', deviceController.updateOne)
  .delete('/device/:uid', deviceController.deleteOne);

module.exports = router;
