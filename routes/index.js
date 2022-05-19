const express = require('express');
const router = express.Router();
const gatewayController = require('../controllers/gatewayController')
const deviceController = require('../controllers/deviceController')

router
    
// gateway router
    .get('/gateway', gatewayController.getAll)
    .get('/gateway/:serial', gatewayController.getBySerial)
    .post('/gateway', gatewayController.addOne)
    .put('/gateway', gatewayController.updateOne)
    .delete('/gateway/:serial', gatewayController.deleteOne)
    
    // device router
    .get('/device', deviceController.getAll)
    .get('/device/:uid', deviceController.getByUid)
    .post('/device', deviceController.addOne)
    .put('/device', deviceController.updateOne)
    .delete('/device/:uid', deviceController.deleteOne)

module.exports = router;