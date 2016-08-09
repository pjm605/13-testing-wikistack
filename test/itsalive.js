var chai = require('chai');
var spies = require('chai-spies');
var itsalive = require('../itsalivefunctions.js');
var expect = chai.expect;

chai.use(spies);

describe('add', function() {
  it('should equal 4', function() {
    expect(itsalive.add(2, 2)).to.be.equal(4);
  })
});

describe('settimeout', function () {
  it('should be asynchronous', function (done) {
    function myFunc (n1, n2) {
      return n1 + n2
    }
    setTimeout(function () {
      expect(myFunc(1,2)).to.be.equal(3);
      done();
    }, 1000)

  })
})

describe('spy', function() {
  it('should spy a set # of times', function() {
    var obj = {
      foobar: function () {
        console.log('foo');
        return 'bar';
      }
    }
    var spy = chai.spy.on(obj, 'foobar');
    obj.foobar();
    obj.foobar();
    expect(spy).to.have.been.called.exactly(2);
  })
})
