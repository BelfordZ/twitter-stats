var _ = require('underscore');
var sinon = require('sinon');
var should = require('should');

var Twitter = require('../src/');

var testTwitter;

describe('twitter', function() {

  it('exports a class named Twitter', function() {
    Twitter.name.should.equal('Twitter');
  });

  beforeEach(function() {
    testTwitter = new Twitter({
      applicationSecret: 'abc',
      consumerKey: 'abc'
    });
  });

  afterEach(function() { testTwitter = undefined; });

  describe('constructor', function() {

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
      (typeof testTwitter.request).should.equal('object');
      (typeof testTwitter.request.get).should.equal('function');
    });
  });

  describe('public methods', function() {

    describe('fetchTweetsSince', function() {
      it('requires a date and a callback', function() {
        (testTwitter.fetchTweetsSince()).should.throw();
        (testTwitter.fetchTweetsSince(new Date())).should.throw();
        (testTwitter.fetchTweetsSince(new Date(), true)).should.throw();
        (testTwitter.fetchTweetsSince(1, function() {})).should.throw();
        (testTwitter.fetchTweetsSince(1, function() {})).should.throw();
      });

      it('returns a set of tweet objects', function(done) {
        var fixture = [ { thisIsATweet: true } ];

        testTwitter._getTweetsForUser = sinon.stub().callsArgWith(-1, null, fixture);

        testTwitter.fetchTweetsSince(new Date(), function(err, tweets) {
          (tweets instanceof Array).should.be.OK;
          tweets.should.eql(fixture);
          testTwitter._getTweetsForUser.called.should.be.OK;
          testTwitter._getTweetsForUser.restore();
          done();
        });
      });

      it('filters tweets from dates previous the provided one', function() {

      });

      it('always returns tweets that are after the provided date', function() {

      });
    });
  });

  describe('private functions', function() {

    describe('buildUrl', function() {
      it('takes a username and optionally a since_id and returns a url', function() {
        var testUrl = testTwitter.buildUrl('belfordz');
        (typeof testUrl).should.equal('string');

        testUrl = testTwitter.buildUrl('belfordz', '123456');
        (testUrl.match(/123456/)).should.be.OK;
      });
    });

  });
});
