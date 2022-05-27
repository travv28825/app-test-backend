function findGateway(gateways, uid) {
  for (const gateway of gateways) {
    for (const device of gateway.devices) {
      if (device.uid === uid) {
        return gateway.serial;
      }
    }
  }

  return null;
}

// TODO: Add security validation
function validUID(params) {
  const { uid } = params;

  // TODO: add security validation
  if (uid) {
    const uidToNumber = Number(uid);

    return uidToNumber;
  }

  return null;
}

function validSerial(params) {
  const { serial } = params;
  // TODO: add security validation
  if (serial) {
    const serialToNumber = Number(serial);

    return serialToNumber;
  }

  return null;
}

function isValidIp(ip) {
  return /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(
    ip
  );
}

module.exports = {
  findGateway,
  validUID,
  validSerial,
  isValidIp,
};
