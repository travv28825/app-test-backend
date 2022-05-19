const Gateway = require('../models/Gateway');

function ValidateIPaddress(ipaddress) {
    if (/^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(ipaddress)) {
        return (true)
    }
    return (false)
}

module.exports = {
    getAll(req, res) {
        Gateway.find({}, (err, data) => {
            if (err) res.send({ success: false, message: `Error: ${err}` })

            res.send({ success: true, data })
        })
    },
    getBySerial(req, res) {
        const { serial } = req.params;

        Gateway.findOne({ serial }, (err, item) => {
            if (err) res.send({ success: false, message: `Error: ${err}` })

            item === null
                ? res.send({ success: false, message: "Gateway not found" })
                : res.send({
                    success: true,
                    data: item,
                    message: `Gateway whith serial number:${serial}`
                });
        });
    },
    addOne(req, res) {
        const { serial, human, ip, devices } = req.body;

        if (ValidateIPaddress(ip)) {
            if (devices && devices.length > 10) {
                res.send({ devices: 'fail', message: "A gateway can only have less than 10 devices" })
            } else {
                let gateway = new Gateway()
                gateway.serial = serial;
                gateway.human = human;
                gateway.ip = ip;
                gateway.devices = devices

                gateway.save(err => {
                    if (err) {
                        if (err.code == 11000)
                            return res.json({
                                success: false,
                                message: "A gateway with that serial number already exists. ",
                            });

                        return res.send({
                            success: false,
                            message: err,
                        });
                    }

                    console.log('gateway saved')
                    return res.send({
                        success: true,
                        message: "Gateway saved",
                    });
                })
            }
        } else {
            res.send({ ipaddress: 'fail', message: "Invalid IP address" })
        }


    },
    updateOne(req, res) {
        const item = req.body;
        Gateway.updateOne({ serial: item.serial }, item)
            .then((resp) => {
                console.log('resp-UpdateOne:', resp)
                res.send({ success: true, message: "Gateway updated" });
            })
            .catch((err) => {
                res.send({ success: false, error: `Error: ${err}` });
            });
    },
    deleteOne(req, res) {
        const { serial } = req.params;
        console.log('eliminar::: ', serial)
        Gateway.deleteOne({ serial }, (err) => {
            if (err) res.send({ success: false, error: `Error: ${err}` });
            res.send({ success: true, message: "Gateway deleted" });
        });
    }
}