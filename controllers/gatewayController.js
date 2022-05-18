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
            if (err) res.json({ success: false, message: `Error: ${err}` })

            res.json({ success: true, data })
        })
    },
    getBySerial(req, res) {
        const { serial } = req.params;

        Gateway.findOne({ serial }, (err, item) => {
            if (err) res.json({ success: false, message: `Error: ${err}` })

            item === null
                ? res.json({ success: false, message: "Gateway not found" })
                : res.send({
                    success: true,
                    data: item,
                });
        });
    },
    addOne(req, res) {
        const { serial, human, ip, devices } = req.body;
        console.log('ip:', ValidateIPaddress(ip))
        if (ValidateIPaddress(ip)) {
            let gateway = new Gateway()
            gateway.serial = serial;
            gateway.human = human;
            gateway.ip = ip;
            gateway.devices = devices

            gateway.save(err => {
                if (err) {
                    res.json({
                        success: false,
                        message: err,
                    });
                }

                console.log('gateway saved')
                res.send({
                    success: true,
                    message: "Gateway saved",
                });
            })
        } else {
            res.json({ ipaddress: 'fail', message: "Invalid IP address" })
        }


    },
    updateOne(req, res) {
        const { serial } = req.params;

        Gateway.updateOne({ serial })
            .then((resp) => {
                console.log('resp:', resp)
                res.send({ success: true, message: "Gateway updated" });
            })
            .catch((err) => {
                res.send({ success: false, error: `Error: ${err}` });
            });
    },
    deleteOne(req, res) {
        const { serial } = req.params;

        Character.deleteOne({ serial }, (err) => {
            if (err) res.send({ success: false, error: `Error: ${err}` });

            res.send({ success: true, message: "Gateway deleted" });
        });
    }
}