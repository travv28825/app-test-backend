const Device = require('../models/Device');
const Gateway = require('../models/Gateway');

const { validUID, findGateway } = require('../Utils/utils');
const {
  DB_ERROR_CODES,
  DB_UPDATE_STATUS,
  DB_DELETE_STATUS,
} = require('../Utils/constants');

function getAll(_, res) {
  Device.find({}, (error, data) =>
    error ? res.status(500).send(error) : res.status(200).json(data)
  );
}

function getByUID(req, res) {
  try {
    const uid = validUID(req.params);

    if (uid) {
      Device.findOne({ uid }, (err, item) =>
        err ? res.status(500).send(err) : res.status(200).json(item)
      );
    } else {
      res.send({ message: 'Invalid UID' });
    }
  } catch (error) {
    // TODO: Add error logger
    res.status(500).send(error);
  }
}

function addOne(req, res) {
  const newDevice = new Device();
  const { uid, vendor, created, status } = req.body;

  newDevice.uid = Number(uid);
  newDevice.vendor = vendor;
  newDevice.status = status;
  newDevice.created = created || new Date();

  newDevice.save((saveError, device) => {
    if (saveError) {
      const isDuplicate = saveError.code === DB_ERROR_CODES.DUPLICATE;

      if (isDuplicate) {
        res.json({
          success: false,
          message: 'A device with that UID number already exists. ',
        });
      } else {
        res.status(500).send({ success: false, message: saveError });
      }
    } else {
      res.status(200).json({ message: 'Device successfully added!', device });
    }
  });
}

async function updateOne(req, res) {
  const uid = validUID(req.params);

  if (uid) {
    const update = req.body;
    const filter = { uid: Number(uid) };

    try {
      const response = await Device.updateOne(filter, update);
      // TODO: document or link to mongoose documentation
      const wasDeviceUpdated = response.n === DB_UPDATE_STATUS.UPDATED;

      if (!wasDeviceUpdated) {
        res.status(404).json({ message: 'Device not found!' });
      } else {
        res.status(200).json({ message: 'Device updated!', response });
      }
    } catch (err) {
      res.status(500).send(err);
    }
  } else {
    res.status(401).send({ message: 'Invalid UID' });
  }
}

function deleteOne(req, res) {
  const uid = validUID(req.params);

  if (uid) {
    Gateway.find({}, (error, data) => {
      if (error) {
        return res.send({ message: `Error: ${error}` });
      }

      const gateway = findGateway(data);

      if (gateway) {
        return res.send({
          message: `This device belongs to the gateway with serial number: ${current}`,
        });
      } else {
        try {
          Device.deleteOne({ uid }, (error, response) => {
            if (error) {
              return res.status(500).send(error);
            }

            const wasDeviceDeleted =
              response.result.n === DB_DELETE_STATUS.DELETED;
            if (!wasDeviceDeleted) {
              return res
                .status(404)
                .send({ message: 'Device not found!', response });
            } else {
              res
                .status(200)
                .json({ message: 'Device successfully deleted!', response });
            }
          });
        } catch (error) {
          res.status(500).send(error);
        }
      }
    });
  } else {
    res.send({ message: 'Invalid UID' });
  }
}

module.exports = {
  getAll,
  getByUID,
  addOne,
  updateOne,
  deleteOne,
};
