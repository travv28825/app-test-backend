const Device = require('../models/Device');
const Gateway = require('../models/Gateway');

module.exports = {
    getAll(req, res) {
        Device.find({}, (err, data) => {
            if (err) res.status(500).send(err)

            return res.status(200).json(data)
        })
    },
    getByUid(req, res) {
        Device.findOne({ uid: req.params.uid }, (err, item) => {
            if (err) res.status(500).send(err)

            res.status(200).json(item)
        });
    },
    addOne(req, res) {
        const { uid, vendor, date, status } = req.body;
        let newDevice = new Device()
        newDevice.uid = Number(uid);
        newDevice.vendor = vendor;
        newDevice.status = status

        newDevice.save((err, device) => {
            if (err) {
                if (err.code == 11000)
                    return res.json({
                        success: false,
                        message: "A device with that UID number already exists. ",
                    });

                return res.status(500).send({
                    success: false,
                    message: err,
                });
            }

            return res.status(200).json({
                message: "Device successfully added!",
                device
            });
        })
    },
    updateOne(req, res) {
        const filter = { uid: Number(req.params.uid) };
        const update = req.body;

        Device.updateOne(filter, update).then(response => {
            if (response.n === 0) res.json({ message: 'Device not found!', response });
            res.status(200).json({ message: 'Device updated!', response });
        }).catch(err => {
            res.status(500).send(err)
        })
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
                Device.deleteOne({ uid }, (err, response) => {
                    if (err) res.status(500).send(err);
                    if (response.result.n === 0) return res.status(200).send({ message: 'Device not found!', response })

                    res.status(200).json({ message: "Device successfully deleted!", response });
                });
            }
        })
    }
}