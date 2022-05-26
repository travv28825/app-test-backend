let chai = require('chai');
let chaiHttp = require('chai-http');

//During the test the env variable is set to test
process.env.NODE_ENV = 'test';

const Device = require('../models/device.model');

//Require the dev-dependencies
let server = require('../app');

chai.use(chaiHttp);
describe('******* Devices *******', () => {
  beforeEach((done) => {
    //Before each test we empty the database
    Device.remove({}, (err) => {
      done();
    });
  });

  describe('[GET]    /api/device', () => {
    it('it should GET all the Devices', (done) => {
      chai
        .request(server)
        .get('/api/device')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('array');
          res.body.length.should.be.eql(0);
          done();
        });
    });
  });

  describe('[GET]    /api/device/:uid', () => {
    it('GET a device by the given uid', (done) => {
      let device = new Device({
        uid: 123,
        vendor: 'J.R.R. Tolkien',
        created: '1/1/1',
        status: 'online',
      });
      device.save((err, device) => {
        chai
          .request(server)
          .get(`/api/device/${device.uid}`)
          .send(device)
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.should.have.property('uid').eql(device.uid);
            res.body.should.have.property('vendor');
            res.body.should.have.property('created');
            res.body.should.have.property('status');
            done();
          });
      });
    });
  });

  describe('[POST]   /api/device', () => {
    it('add a device', (done) => {
      let device = {
        uid: 1233,
        vendor: 'J.R.R. Tolkien',
        status: 'online',
      };
      chai
        .request(server)
        .post('/api/device')
        .send(device)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have
            .property('message')
            .eql('Device successfully added!');
          res.body.device.should.have.property('uid');
          res.body.device.should.have.property('vendor');
          res.body.device.should.have.property('created');
          res.body.device.should.have.property('status');
          done();
        });
    });

    // faltan pruebas para el caso de agregar con uid existente
  });

  describe('[PUT]    /api/device/:uid', () => {
    it('UPDATE a device', (done) => {
      let device = new Device({
        uid: 223,
        vendor: 'J.R.R. Tolkien',
        created: new Date('4/4/4'),
        status: 'online',
      });
      device.save((err, device) => {
        chai
          .request(server)
          .put(`/api/device/${device.uid}`)
          .send({
            uid: 223,
            vendor: 'C.S. Lewis',
            created: new Date('55/55/55'),
            status: 'offline',
          })
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.should.have.property('message').eql('Device updated!');
            res.body.response.should.have.property('ok').eql(1);
            res.body.response.should.have.property('n').eql(1);
            done();
          });
      });
    });
    it('UPDATE a nonexistent device', (done) => {
      chai
        .request(server)
        .put(`/api/device/999000999`)
        .send({
          uid: 223,
          vendor: 'C.S. Lewis',
          created: new Date('55/55/55'),
          status: 'offline',
        })
        .end((err, res) => {
          res.should.have.status(404);
          res.body.should.be.a('object');
          res.body.should.have.property('message').eql('Device not found!');
          done();
        });
    });
  });

  describe('[DELETE] /api/device/:uid', () => {
    it('DELETE a device', (done) => {
      let device = new Device({
        uid: 1223,
        vendor: 'J.R.R. Tolkien',
        created: new Date('11/11/11'),
        status: 'online',
      });
      device.save((err, device) => {
        chai
          .request(server)
          .delete(`/api/device/${device.uid}`)
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.should.have
              .property('message')
              .eql('Device successfully deleted!');
            res.body.response.should.have.property('ok').eql(1);
            res.body.response.should.have.property('n').eql(1);
            done();
          });
      });
    });
    it('DELETE an nonexistent device', (done) => {
      chai
        .request(server)
        .delete(`/api/device/900009`)
        .end((err, res) => {
          res.should.have.status(404);
          res.body.should.be.a('object');
          res.body.should.have.property('message').eql('Device not found!');
          done();
        });
    });
  });
});
