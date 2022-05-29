const { Gateway } = require('../models');

const { DB_ERROR_CODES } = require('../utils/constants');

async function getAll() {
  const allGateways = await Gateway.find({}, (error, data) =>
    error ? error : data
  );

  return allGateways;
}

async function getBySerial(serial) {
  const gateway = await Gateway.findOne({ serial }, (error, gateway) =>
    error ? error : gateway
  );
  return gateway;
}

async function addOne(data) {
  const newGateway = new Gateway();
  const { serial, human, ip, devices } = data;

  try {
    newGateway.serial = serial;
    newGateway.human = human;
    newGateway.ip = ip;
    newGateway.devices = devices;

    const saveResponse = await newGateway.save();

    return {
      message: 'Gateway successfully added!',
      saveResponse,
    };
  } catch (error) {
    const isDuplicate = error.code === DB_ERROR_CODES.DUPLICATE;

    if (isDuplicate) {
      return { message: 'A gateway with that serial number already exists.' };
    } else {
      return { message: error };
    }
  }
}

async function updateOne(serial, update) {
  const response = await Gateway.updateOne({ serial }, update);

  return response.ok === 1
    ? { message: 'Gateway updated!', response }
    : { message: 'Error updating gateway!' };
}

async function deleteOne(serial) {
  const response = await Gateway.deleteOne({ serial }, (error, response) =>
    error ? error : response
  );
  return response.result.ok === 1
    ? { message: 'Gateway successfully deleted!', response }
    : { message: 'Error delted!' };
}

module.exports = {
  getAll,
  getBySerial,
  addOne,
  updateOne,
  deleteOne,
};
