var _ = require('underscore');
var sinon = require('sinon');
var should = require('should');

var Twitter = require('../src/');

describe('twitter', function() {

  it('exports a class named Twitter', function() {
    Twitter.name.should.equal('Twitter');
  });

  describe('constructor', function() {

    beforeEach(function() {
      this.testTwitter = new Twitter({
        applicationSecrect: 'abc',
        consumerKey: 'abc'
      });
    });

    afterEach(function() { this.testTwitter = undefined; });

    it('requires that you provide a consumerKey and application secret', function() {
      var errTestOpts = [
        {},
        { applicationSecrect: 'abc' },
        { consumerKey: 'abc' }
      ].forEach(function(t) {
        (function() { new Twitter(t); }).should.throw();
      });
    });

    it('creates an instance of the oauth module', function() {
      (typeof this.testTwitter.request).should.equal('object');
      (this.testTwitter.request.constructor.name).should.equal('OAuth');
    });
  });

  describe('public methods', function() {

    describe('fetchTweetsSince', function() {
      it('requires a date and a callback', function() {});

      it('returns a set of tweet objects', function() {});

      it('filters tweets from dates previous the provided one', function() {});

      it('always returns tweets that are after the provided date', function() {});
    });
  });

  describe('private functions', function() {

  });
});
