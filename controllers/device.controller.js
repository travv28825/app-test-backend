const deviceService = require('../services/device.service');

const { validUID } = require('../utils/utils');

async function getAll(_, res) {
  try {
    const allDevices = await deviceService.getAll();

    res.status(200).json(allDevices);
  } catch (error) {
    res.status(500).send(error);
  }
}

async function getByUID(req, res) {
  const uid = validUID(req.params);
  if (uid) {
    try {
      const deviceByUID = await deviceService.getByUID(uid);

      return res.status(200).json(deviceByUID);
    } catch (error) {
      // TODO: Add error logger
      res.status(500).send(error);
    }
  } else {
    res.status(400).send({ message: 'Invalid UID' });
  }
}

async function addOne(req, res) {
  const deviceData = req.body;

  try {
    const deviceSaved = await deviceService.addOne(deviceData);

    return res.status(201).json(deviceSaved);
  } catch (error) {
    res.status(500).send(error);
  }
}

async function updateOne(req, res) {
  const uid = validUID(req.params);
  const update = req.body;

  if (uid) {
    try {
      const response = await deviceService.updateOne(uid, update);

      return res.status(200).json(response);
    } catch (error) {
      res.status(500).send({ message: error });
    }
  } else {
    res.status(400).send({ message: 'Invalid UID' });
  }
}

async function deleteOne(req, res) {
  const uid = validUID(req.params);

  if (uid) {
    try {
      const response = await deviceService.deleteOne(uid);

      return res.status(200).json(response);
    } catch (error) {
      res.status(500).send({ message: error });
    }
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
