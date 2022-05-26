const router = require('express').Router();

const gatewayRouter = require('./gateway.router');
const deviceRouter = require('./device.router');

router.use('/gateway', gatewayRouter);
router.use('/device', deviceRouter);

module.exports = router;
