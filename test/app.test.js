const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = require('chai').expect;
var mocha = require('mocha');
var describe = mocha.describe;
var it = mocha.it;
const server = require('./../app').server;

var assert = require('assert'),
http = require('http');

chai.use(chaiHttp);

describe('Test request and response', function () {

    it('POST(\"/\") - should return 200', function () {
        chai.request('http://127.0.0.1:3000')
            .post('/')
            .type('form')
            .send({
                'test': 'POST'
            })
            .then(function (res) {
                expect(res).to.have.status(200);
            })
            .catch(function (err) {
                throw err;
            });
    });

    it('POST(\"/scheduled\") - should return 200', function () {
        chai.request('http://127.0.0.1:3000')
            .post('/scheduled')
            .type('form')
            .send({
                'test': 'POST'
            })
            .then(function (res) {
                expect(res).to.have.status(200);
            })
            .catch(function (err) {
                throw err;
            });
    });


    it('GET - should return 200', function (done) {
        http.get('http://127.0.0.1:3000', function (res) {
        assert.equal(200, res.statusCode);
        done();
        });
    });

    it('GET - data should be string', function (done) {
        http.get('http://127.0.0.1:3000', function (res) {
        var data = '';
            res.on('data', function (chunk) {
                data += chunk;
            });

            expect(data).to.be.a('string');
            done();
        });
    });
});