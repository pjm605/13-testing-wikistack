var chai = require('chai');
var spies = require('chai-spies');
var models = require('../models');
var Page = models.Page;
var User = models.User;
chai.should();
chai.use(require('chai-things'));
var expect = chai.expect;

describe('Page model', function () {

  describe('Virtuals', function () {
    var page;
    beforeEach(function () {
      page = Page.build();
    });

    describe('route', function () {
      it('returns the url_name prepended by "/wiki/"', function () {
        page.urlTitle = 'some_title'
        expect(page.route).to.be.equal('/wiki/some_title')
      });
    });
    describe('renderedContent', function () {
      it('converts the markdown-formatted content into HTML', function () {
        page.content = "This is content"
        expect(page.renderedContent).to.be.equal('<p>' + page.content + '</p>\n');
      });
    });
  });

  describe('Class methods', function () {
    beforeEach(function (done) {
      Page.create({
        title: 'foo',
        content: 'bar',
        tags: ['foo', 'bar']
      })
      .then(function () {
        done();
      })
      .catch(done);
    });
    afterEach(function () {
      Page.destroy({
        where: {
          title: 'foo'
        }
      })
    })
    describe('findByTag', function () {
      it('gets pages with the search tag', function(done) {
        Page.findByTag('foo')
        .then(function(pages) {
          expect(pages).to.have.lengthOf(1);
          done();
        })
        .catch(done)
      });
      it('does not get pages without the search tag', function (done) {
        Page.findByTag('blah')
        .then(function (pages) {
          expect(pages).to.have.lengthOf(0);
          done();
        })
        .catch(done)
      });
    });
  });

  describe('Instance methods', function () {
    beforeEach(function (done) {
      Page.create({
        title: 'foo',
        content: 'bar',
        tags: ['foo', 'bar']
      })
      .then(function() {
        return Page.create({
          title: 'poodle',
          content: 'bar',
          tags: ['foo', 'bar']
        })
      })
      .then(function() {
        return Page.create({
          title: 'hi',
          content: 'bar',
          tags: ['abc']
        })
      })
      .then(function () {
        done();
      })
      .catch(done);
    });

    afterEach(function () {
      Page.destroy({
        where: {
          title: 'foo'
        }
      })
      Page.destroy({
        where: {
          title: 'poodle'
        }
      })
      Page.destroy({
        where: {
          title: 'hi'
        }
      })
    })

    describe('findSimilar', function () {
      var thepage;
      it('never gets itself', function(done) {
        Page.findOne({
            where: {
                title: 'foo'
            }
        })
        .then(function(page) {
          thepage = page;
          return page.findSimilar();
        })
        .then(function(similarPages) {
          similarPages.should.not.include(thepage)
        })
        done();
      });
      it('gets other pages with any common tags', function (done) {
        var poodle;
        Page.findOne( {
          where: {
            title: 'poodle'
          }
        })
        .then(function(poodlePage) {
          poodle = poodlePage;
        });

        Page.findOne({
                where: {
                  title: 'foo'
              }
          })
        .then(function (page) {
          return page.findSimilar();
        })
        .then(function (similarPages) {
          similarPages.should.include(poodle);
        })
        done();
      });
      it('does not get other pages without any common tags', function (done) {
        var poodle;
        Page.findOne( {
          where: {
            title: 'poodle'
          }
        })
        .then(function(poodlePage) {
          poodle = poodlePage;
        });

        Page.findOne({
            where: {
              title: 'hi'
            }
        })
        .then(function (page) {
          return page.findSimilar();
        })
        .then(function (differentPages) {
          differentPages.should.not.include(poodle)
        })
        done();
      });
    });
  });

  describe('Validations', function () {
    it('errors without title');
    it('errors without content');
    it('errors given an invalid status');
  });

  describe('Hooks', function () {
    it('it sets urlTitle based on title before validating');
  });

});
