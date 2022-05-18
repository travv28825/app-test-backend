const Device = require('../models/Device');

module.exports = {
    getAll(req, res) {
        Device.find({}, (err, data) => {
            if (err) res.json({ success: false, message: `Error: ${err}` })

            res.json({ success: true, data })
        })
    },
    getByUid(req, res) {
        const { uid } = req.params;

        Device.findOne({ uid }, (err, item) => {
            if (err) res.json({ success: false, message: `Error: ${err}` })

            item === null
                ? res.json({ success: false, message: "Device not found" })
                : res.send({
                    success: true,
                    data: item,
                });
        });
    },
    addOne(req, res) {
        console.log('***********    ', req.body)
        const { uid, vendor, date, status } = req.body;
        let device = new Device()
        device.uid = Number(uid);
        device.vendor = vendor;
        device.created = date;
        device.status = status

        device.save(err => {
            if (err) {
                res.json({
                    success: false,
                    message: err,
                });
            }

            res.send({
                success: true,
                message: "Device saved",
            });
        })
    },
    updateOne(req, res) {
        const { uid } = req.params;

        Device.updateOne({ uid })
            .then((resp) => {
                console.log('resp:', resp)
                res.send({ success: true, message: "Device updated" });
            })
            .catch((err) => {
                res.send({ success: false, error: `Error: ${err}` });
            });
    },
    deleteOne(req, res) {
        const { uid } = req.params;

        Character.deleteOne({ uid }, (err) => {
            if (err) res.send({ success: false, error: `Error: ${err}` });

            res.send({ success: true, message: "Device deleted" });
        });
    }
}