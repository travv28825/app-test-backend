const { Device, Gateway } = require('../models');
const { DB_ERROR_CODES } = require('../utils/constants');
const { findGateway } = require('../utils/utils');

async function getAll() {
  const allDevices = await Device.find({}, (error, data) =>
    error ? error : data
  );

  return allDevices;
}

async function getByUID(uid) {
  const device = await Device.findOne({ uid }, (error, item) =>
    error ? error : item
  );

  return device;
}

async function addOne(data) {
  const newDevice = new Device();
  const { uid, vendor, created, status } = data;

  try {
    newDevice.uid = uid;
    newDevice.vendor = vendor;
    newDevice.status = status;
    newDevice.created = created || new Date();

    const response = await newDevice.save();

    return {
      message: 'Device successfully added!',
      response,
    };
  } catch (error) {
    const isDuplicate = error.code === DB_ERROR_CODES.DUPLICATE;

    if (isDuplicate) {
      return { message: 'A device with that UID already exists.' };
    } else {
      return { message: error };
    }
  }
}

async function updateOne(uid, update) {
  try {
    const response = await Device.updateOne({ uid }, update);

    return response.ok === 1
      ? { message: 'Device updated!', response }
      : { message: 'Error updating device!' };
  } catch (error) {
    res.status(500).send({ message: error });
  }
}

async function deleteOne(uid) {
  try {
    const listGateways = await Gateway.find({}, (error, data) =>
      error ? error : data
    );

    const hasDevice = findGateway(listGateways, uid);

    if (typeof hasDevice === 'number') {
      return {
        message: `This device belongs to the gateway with serial number: ${hasDevice}`,
      };
    } else {
      const response = await Device.deleteOne({ uid }, (error, res) =>
        error ? error : res
      );

      return response.result.ok === 1
        ? { message: 'Device deleted!', response }
        : { message: 'Error delete!' };
    }
  } catch (error) {
    return { message: error };
  }
}

module.exports = {
  getAll,
  getByUID,
  addOne,
  updateOne,
  deleteOne,
};
