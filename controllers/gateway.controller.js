const Gateway = require('../models/Gateway');
const { isValidIp, validSerial } = require('../Utils/utils');
const {
  DB_ERROR_CODES,
  DB_UPDATE_STATUS,
  DB_DELETE_STATUS,
} = require('../Utils/constants');
const { type } = require('express/lib/response');

function getAll(req, res) {
  Gateway.find({}, (error, data) => {
    error ? res.status(500).send(error) : res.status(200).json(data);
  });
}

function getBySerial(req, res) {
  const serial = validSerial(req.params);

  if (serial) {
    try {
      Gateway.findOne({ serial }, (error, gateway) => {
        if (error) {
          return res.status(500).send(error);
        }
        res.status(200).json(gateway);
      });
    } catch (error) {
      res.status(500).send(error);
    }
  } else {
    res.send({ serial: 'fail', message: 'Invalid serial number' });
  }
}

function addOne(req, res) {
  const { serial, human, ip, devices } = req.body;
  const isDevicesLength = devices.length <= 10;

  if (isValidIp(ip)) {
    if (isDevicesLength) {
      const gateway = new Gateway();

      gateway.serial = serial;
      gateway.human = human;
      gateway.ip = ip;
      gateway.devices = devices;

      gateway.save((saveError, gateway) => {
        if (saveError) {
          const isDuplicate = saveError.code === DB_ERROR_CODES.DUPLICATE;

          if (isDuplicate) {
            return res.send({
              message: 'A gateway with that serial number already exists. ',
            });
          } else {
            return res.status(500).send(saveError);
          }
        }

        res.status(200).json({
          message: 'Gateway successfully added!',
          gateway,
        });
      });
    } else {
      // devices length > 10
      return res.send({
        devices: 'fail',
        message: 'A gateway can only have less than 10 or less devices!',
      });
    }
  } else {
    // isn't a valid ip
    res.send({ ipaddress: 'fail', message: 'Invalid IP address!' });
  }
}

async function updateOne(req, res) {
  const serial = validSerial(req.params);
  const update = req.body;

  if (serial) {
    try {
      const response = await Gateway.updateOne({ serial }, update);
      const wasGatewayUpdated = response.n === DB_UPDATE_STATUS.UPDATED;

      if (!wasGatewayUpdated) {
        return res.status(404).send({ message: 'Gateway not found!' });
      } else {
        res.status(200).json({ message: 'Gateway updated!', response });
      }
    } catch (error) {
      res.status(500).send(error);
    }
  } else {
    res.send({ serial: 'fail', message: 'Invalid serial number' });
  }
}

function deleteOne(req, res) {
  const serial = validSerial(req.params);

  if (serial) {
    Gateway.deleteOne({ serial }, (error, response) => {
      if (error) {
        return res.status(500).send(error);
      }
      const wasGatewayDeleted = response.result.n === DB_DELETE_STATUS.DELETED;

      if (!wasGatewayDeleted) {
        return res.status(404).send({ message: 'Gateway not found!' });
      } else {
        return res
          .status(200)
          .json({ message: 'Gateway successfully deleted!', response });
      }
    });
  } else {
    res.send({ serial: 'fail', message: 'Invalid serial number' });
  }
}

// TODO: validate serial number
module.exports = {
  getAll,
  getBySerial,
  addOne,
  updateOne,
  deleteOne,
};
