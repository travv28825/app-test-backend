const Device = require('../models/Device');
const Gateway = require('../models/Gateway');

module.exports = {
  getAll(_, res) {
    Device.find({}, (err, data) =>
      err ? res.status(500).send(err) : res.status(200).json(data)
    );
  },
  getByUid(req, res) {
    try {
      const { uid } = req.params;
      if (validateUID(uid)) {
        Device.findOne({ uid }, (err, item) =>
          err ? res.status(500).send(err) : res.status(200).json(item)
        );
      } else {
        res.status(401).send({ message: 'Invalid UID' });
      }
    } catch (error) {
      // TODO: Add error logger
      res.status(500).send(error);
    }
  },
  addOne(req, res) {
    const { uid, vendor, date, status } = req.body;
    let newDevice = new Device();
    newDevice.uid = Number(uid);
    newDevice.vendor = vendor;
    newDevice.status = status;
    newDevice.created = date || new Date().now();

    newDevice.save((err, device) => {
      if (err) {
        return err.code == 11000
          ? res.json({
              success: false,
              message: 'A device with that UID number already exists. ',
            })
          : res.status(500).send({
              success: false,
              message: err,
            });
      }

      res.status(200).json({
        message: 'Device successfully added!',
        device,
      });
    });
  },
  updateOne(req, res) {
    const { uid } = req.params;
    if (validateUID(uid)) {
      const filter = { uid: Number(req.params.uid) };
      // TODO: validate req.body
      const update = req.body;

      Device.updateOne(filter, update)
        .then((response) =>
          response.n === 0
            ? res.json({ message: 'Device not found!', response })
            : res.status(200).json({ message: 'Device updated!', response })
        )
        .catch((err) => res.status(500).send(err));
    } else {
      res.status(401).send({ message: 'Invalid UID' });
    }
  },
  deleteOne(req, res) {
    const { uid } = req.params;
    if (validateUID(uid)) {
      Gateway.find({}, (err, data) => {
        let exist = false;
        let current = {};

        if (err) res.send({ success: false, message: `Error: ${err}` });

        for (g of data) {
          for (d of g.devices) {
            if (d.uid === Number(uid)) {
              exist = true;
              current = g.serial;
            }
          }
        }
        if (exist) {
          return res.send({
            success: false,
            message: `this device belongs to the gateway with serial number: ${current}`,
          });
        } else {
          Device.deleteOne({ uid }, (err, response) => {
            if (err) res.status(500).send(err);
            if (response.result.n === 0)
              return res
                .status(200)
                .send({ message: 'Device not found!', response });

            res
              .status(200)
              .json({ message: 'Device successfully deleted!', response });
          });
        }
      });
    } else {
      res.status(401).send({ message: 'Invalid UID' });
    }
  },
};
// TODO: Add security validation
function validateUID(uid) {
  return typeof uid === Number ? true : false;
}
