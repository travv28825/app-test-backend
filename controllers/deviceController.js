const Device = require('../models/Device');
const Gateway = require('../models/Gateway');
const gatewayController = require('./gatewayController');

module.exports = {
    getAll(req, res) {
        Device.find({}, (err, data) => {
            if (err) res.json({ success: false, message: `Error: ${err}` })

            return res.json({ success: true, data })
        })
    },
    getByUid(req, res) {
        const { uid } = req.params;

        Device.findOne({ uid }, (err, item) => {
            if (err) res.json({ success: false, message: `Error: ${err}` })

            return item === null
                ? res.json({ success: false, message: "Device not found" })
                : res.send({
                    success: true,
                    data: item,
                });
        });
    },
    addOne(req, res) {
        const { uid, vendor, date, status } = req.body;
        let device = new Device()
        device.uid = Number(uid);
        device.vendor = vendor;
        device.created = date;
        device.status = status

        device.save(err => {
            if (err) {
                if (err.code == 11000)
                    return res.json({
                        success: false,
                        message: "A device with that UID number already exists. ",
                    });

                return res.send({
                    success: false,
                    message: err,
                });
            }

            return res.send({
                success: true,
                message: "Device saved",
            });
        })
    },
    updateOne(req, res) {
        const item = req.body;

        Device.updateOne({ uid: item.uid }, item)
            .then((resp) => {
                console.log('resp:', resp)
                return res.send({ success: true, message: "Device updated" });
            })
            .catch((err) => {
                return res.send({ success: false, error: `Error: You can't update this device data, check if the UID aren't used` });
            });
    },
    deleteOne(req, res) {
        const { uid } = req.params;
        Gateway.find({}, (err, data) => {
            if (err) res.send({ success: false, message: `Error: ${err}` })
            let exist = false
            let current = {}
            for (g of data) {
                for (d of g.devices) {
                    if (d.uid === Number(uid)) {
                        exist = true
                        current = g.serial
                    }
                }
            }
            if (exist) {
                return res.send({ success: false, message: `this device belongs to the gateway with serial number: ${current}` })
            } else {
                Device.deleteOne({ uid }, (err) => {
                    if (err) res.send({ success: false, error: `Error: ${err}` });

                    return res.send({ success: true, message: "Device deleted" });
                });
            }
        })
    }
}