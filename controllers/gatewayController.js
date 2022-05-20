const Gateway = require('../models/Gateway');

function ValidateIPaddress(ipaddress) {
    if (/^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(ipaddress)) {
        return (true)
    }
    return (false)
}

module.exports = {
    getAll(req, res) {
        let query = Gateway.find({})
        query.exec((err, gateways) => {
            if (err) res.status(500).send(err)

            res.status(200).json(gateways)
        })
    },
    getBySerial(req, res) {
        Gateway.findOne({ serial: req.params.serial }, (err, gateway) => {
            if (err) res.status(500).send(err)

            res.status(200).json(gateway);
        });
    },
    addOne(req, res) {
        const newGateway = new Gateway(req.body)
        const { ip, devices } = newGateway

        if (ValidateIPaddress(ip)) {
            if (devices && devices.length > 10) {
                res.send({ devices: 'fail', message: "A gateway can only have less than 10 or less devices!" })
            } else {
                newGateway.save((err, gateway) => {
                    if (err) {
                        if (err.code == 11000)
                            return res.json({
                                message: "A gateway with that serial number already exists. ",
                            });

                        return res.status(500).send(err);
                    }

                    return res.status(200).send({
                        message: "Gateway successfully added!",
                        gateway
                    });
                })
            }
        } else {
            res.send({ ipaddress: 'fail', message: "Invalid IP address!" })
        }


    },
    updateOne(req, res) {
        Gateway.updateOne({ serial: req.params.serial }, req.body).then(response => {
            if (response.n === 0) res.json({ message: 'Gateway not found!', response });

            res.status(200).json({ message: 'Gateway updated!', response });
        }).catch(err => {
            res.status(500).send(err)
        })
    },
    deleteOne(req, res) {
        const { serial } = req.params;
        Gateway.deleteOne({ serial }, (err, response) => {
            if (err) res.status(500).send(err);
            if (response.result.n === 0) return res.status(200).send({ message: 'Gateway not found!', response })

            res.status(200).json({ message: "Gateway successfully deleted!", response });
        });
    }
}
