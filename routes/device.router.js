const express = require('express');
const router = express.Router();

const deviceController = require('../controllers/device.controller');

router
  .get('/', deviceController.getAll)
  .get('/:uid', deviceController.getByUID)
  .post('/', deviceController.addOne)
  .put('/:uid', deviceController.updateOne)
  .delete('/:uid', deviceController.deleteOne);

module.exports = router;
