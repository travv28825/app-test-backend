const chai = require('chai');
const chaiHttp = require('chai-http');

const { Gateway } = require('../models');
const server = require('../app');

process.env.NODE_ENV = 'test';
chai.use(chaiHttp);

describe('******* Gateways *******', () => {
  beforeEach((done) => {
    //Before each test we empty the database
    Gateway.remove({}, (err) => {
      done();
    });
  });

  // GET /api/gateway or /api/gateway/:serial
  describe('[GET]    /api/gateway', () => {
    it('it should GET all the Gateways', (done) => {
      chai
        .request(server)
        .get('/api/gateway')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('array');
          res.body.length.should.be.eql(0);
          done();
        });
    });
    it('it should GET a gateway by the given serial', (done) => {
      let gateway = new Gateway({
        serial: 123,
        human: 'J.R.R. Tolkien',
        ip: '1.1.1.1',
        devices: [],
      });

      gateway.save((_, gateway) => {
        chai
          .request(server)
          .get(`/api/gateway/${gateway.serial}`)
          .send(gateway)
          .end((_, res) => {
            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.should.have.property('serial').eql(gateway.serial);
            res.body.should.have.property('human');
            res.body.should.have.property('ip');
            res.body.should.have.property('devices');
            done();
          });
      });
    });
  });
  // POST /api/gateway
  describe('[POST]   /api/gateway', () => {
    it('add a gateway', (done) => {
      const gateway = {
        serial: 123,
        human: 'J.R.R. Tolkien',
        ip: '1.1.1.1',
        devices: [],
      };

      chai
        .request(server)
        .post('/api/gateway')
        .send(gateway)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have
            .property('message')
            .eql('Gateway successfully added!');
          res.body.gateway.should.have.property('serial');
          res.body.gateway.should.have.property('human');
          res.body.gateway.should.have.property('ip');
          res.body.gateway.should.have.property('devices');
          done();
        });
    });
    it('add a gateway with invalid ip address(1.1.1)', (done) => {
      let gateway = {
        serial: 123,
        human: 'J.R.R. Tolkien',
        ip: '1.1.1',
        devices: [],
      };
      chai
        .request(server)
        .post('/api/gateway')
        .send(gateway)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('ipaddress').eql('fail');
          res.body.should.have.property('message').eql('Invalid IP address!');
          done();
        });
    });
    it('add a gateway with invalid ip address(280.1.1.1', (done) => {
      let gateway = {
        serial: 123,
        human: 'J.R.R. Tolkien',
        ip: '280.1.1.1',
        devices: [],
      };
      chai
        .request(server)
        .post('/api/gateway')
        .send(gateway)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('ipaddress').eql('fail');
          res.body.should.have.property('message').eql('Invalid IP address!');
          done();
        });
    });
    it('add a gateway with more than 10 devices', (done) => {
      const gateway = {
        serial: 123,
        human: 'J.R.R. Tolkien',
        ip: '1.1.1.3',
        devices: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
      };
      chai
        .request(server)
        .post('/api/gateway')
        .send(gateway)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('devices').eql('fail');
          res.body.should.have
            .property('message')
            .eql('A gateway can only have less than 10 or less devices!');
          done();
        });
    });
  });
  // PUT /api/gateway/:serial
  describe('[PUT]    /api/gateway/:serial', () => {
    it('UPDATE a gateway given the serial', (done) => {
      let gateway = new Gateway({
        serial: 433,
        human: 'C.S. Lewis',
        ip: '5.5.5.5',
        devices: [],
      });
      gateway.save((err, gateway) => {
        chai
          .request(server)
          .put(`/api/gateway/${gateway.serial}`)
          .send({
            serial: 433,
            human: 'C.S. Lewis',
            ip: '4.4.4.4',
            devices: [],
          })
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.should.have.property('message').eql('Gateway updated!');
            res.body.response.should.have.property('ok').eql(1);
            res.body.response.should.have.property('n').eql(1);
            done();
          });
      });
    });
    it('UPDATE a nonexistent gateway given the serial number', (done) => {
      chai
        .request(server)
        .put(`/api/gateway/999000999`)
        .send({
          serial: 433,
          human: 'C.S. Lewis',
          ip: '4.4.4.4',
          devices: [],
        })
        .end((err, res) => {
          res.should.have.status(404);
          res.body.should.be.a('object');
          res.body.should.have.property('message').eql('Gateway not found!');
          done();
        });
    });
  });
  // DELETE /api/gateway/:serial
  describe('[DELETE] /api/gateway/:serial', () => {
    it('DELETE a gateway given the serial', (done) => {
      let gateway = new Gateway({
        serial: 456,
        human: 'C.S. Lewis',
        ip: '2.2.2.2',
        devices: [],
      });
      gateway.save((err, gateway) => {
        chai
          .request(server)
          .delete(`/api/gateway/${gateway.serial}`)
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.should.have
              .property('message')
              .eql('Gateway successfully deleted!');
            res.body.response.should.have.property('ok').eql(1);
            res.body.response.should.have.property('n').eql(1);
            done();
          });
      });
    });
    it('DELETE a gateway given a nonexistent serial number', (done) => {
      chai
        .request(server)
        .delete(`/api/gateway/900009`)
        .end((err, res) => {
          res.should.have.status(404);
          res.body.should.be.a('object');
          res.body.should.have.property('message').eql('Gateway not found!');
          done();
        });
    });
  });
});
