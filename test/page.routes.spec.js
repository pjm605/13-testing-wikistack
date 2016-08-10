var supertest = require('supertest');
var app = require('../app');
var agent = supertest.agent(app);
var models = require('../models');
var Page = models.Page;
var User = models.User;
var chai = require('chai');
var expect = chai.expect;


describe('http requests', function () {
 // Page.sync({force: true})

  describe('GET /wiki', function () {
    it('gets 200 on index', function (done) {
      agent
      .get('/wiki')
      .expect(200, done);
    });
  });

  describe('GET /wiki/add', function () {
    it('responds with 200', function (done) {
      agent
      .get('/wiki')
      .expect(200, done);
    });
  });

  describe('GET /wiki/:urlTitle', function () {
      before(function (done) {
      Page.sync({force: true})
      .then(function() {
        return Page.create({
          title: 'poodle',
          content: 'bar',
          tags: ['bar']
        })
      })
      .then(function () {
        done();
      })
      .catch(done);
    });

    it('responds with 404 on page that does not exist', function (done) {
      agent
      .get('/wiki/abbbbbb')
      .expect(404, done)
    });
    it('responds with 200 on page that does exist', function(done) {
      agent
      .get('/wiki/poodle')
      .expect(200, done)
    });
  });

  describe('GET /wiki/search', function () {
    it('responds with 200', function(done) {
      agent
      .get('/wiki/search')
      .expect(200, done)
    });
  });

  describe('GET /wiki/:urlTitle/similar', function () {
      before(function (done) {
      Page.sync({force: true})
      .then(function() {
        return Page.create({
          title: 'poodle',
          content: 'bar',
          tags: ['bar']
        })
      })
      .then (function () {
        return Page.create({
          title: 'Java',
          content: "test",
          tags: ['bar', 'abc']
        })
      })
      .then(function () {
        done();
      })
      .catch(done);
    });
    it('responds with 404 for page that does not exist', function (done) {
      agent
      .get('/wiki/poodleeeee/search')
      .expect(404, done)
    });
    it('responds with 200 for similar page', function (done) {
      agent
      .get('/wiki/Java/similar')
      .expect(200, done)
    });
  });

  describe('POST /wiki', function () {
          var page = {
        title: 'poodle',
        content: 'dog',
        tags: 'paw',
        status: 'open',
        authorName: 'Cindy',
        authorEmail: 'cindy@example.com'};


    it('responds with 302',function(done) {

      agent
      .post('/wiki')
      .send(page)
      .expect(302, done)
    });

    it('creates a page in the database', function(done) {
      var test;
      agent
      .post('/wiki')
      .send(page)
      Page.findOne({
        where: {title: 'poodle'}
      })
      .then(function(foundPage) {
        expect(foundPage.title).to.equal('poodle');
        done()
      })
      .catch(done)
    });

  });

});
