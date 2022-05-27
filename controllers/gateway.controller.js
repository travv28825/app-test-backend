const gatewayService = require('../services/gateway.service');

const { isValidIp, validSerial } = require('../utils/utils');

async function getAll(_, res) {
  try {
    const allGateways = await gatewayService.getAll();

    res.status(200).json(allGateways);
  } catch (error) {
    res.status(500).send(error);
  }
}

async function getBySerial(req, res) {
  const serial = validSerial(req.params);

  if (serial) {
    try {
      const gatewayBySerial = await gatewayService.getBySerial(serial);

      res.status(200).json(gatewayBySerial);
    } catch (error) {
      res.status(500).send(error);
    }
  } else {
    res.send({ serial: 'fail', message: 'Invalid serial number' });
  }
}

async function addOne(req, res) {
  const gatewayData = req.body;
  const { ip, devices } = gatewayData;
  const isDevicesLength = devices.length <= 10;

  if (isValidIp(ip)) {
    if (isDevicesLength) {
      try {
        const addResponse = await gatewayService.addOne(gatewayData);

        res.status(200).json(addResponse);
      } catch (error) {
        res.status(500).send(error);
      }
    } else {
      return res.status(400).send({
        devices: 'fail',
        message: 'A gateway can only have less than 10 or less devices!',
      });
    }
  } else {
    res.status(400).send({ ipaddress: 'fail', message: 'Invalid IP address!' });
  }
}

async function updateOne(req, res) {
  const serial = validSerial(req.params);
  const update = req.body;

  const isValidDevices = req.body.devices;

  if (isValidDevices && isValidDevices.length > 10) {
    return res.send(400).send({
      devices: 'fail',
      message: 'A gateway can only have less than 10 or less devices!',
    });
  }

  if (serial) {
    try {
      const updateResponse = await gatewayService.updateOne(serial, update);

      return res.status(200).json(updateResponse);
    } catch (error) {
      res.status(500).send(error);
    }
  } else {
    res.send({ serial: 'fail', message: 'Invalid serial number' });
  }
}

async function deleteOne(req, res) {
  const serial = validSerial(req.params);

  if (serial) {
    try {
      const deleteResponse = await gatewayService.deleteOne(serial);

      return res.status(200).json(deleteResponse);
    } catch (error) {
      return res.status(500).send(error);
    }
  } else {
    res.status(200).send({ serial: 'fail', message: 'Invalid serial number' });
  }
}

module.exports = {
  getAll,
  getBySerial,
  addOne,
  updateOne,
  deleteOne,
};
