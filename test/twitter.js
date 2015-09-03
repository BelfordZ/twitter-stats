var _ = require('underscore');
var sinon = require('sinon');
var should = require('should');
var moment = require('moment');


var Twitter = require('../src/');

var testTwitter;

describe('twitter', function() {

  it('exports a class named Twitter', function() {
    Twitter.name.should.equal('Twitter');
  });

  beforeEach(function() {
    testTwitter = new Twitter({
      consumerSecret: 'asd',
      consumerKey: 's',
      accessToken: 'srtn',
      accessTokenSecret: 'th'
    });
  });

  afterEach(function() { testTwitter = undefined; });

  describe('constructor', function() {

    it('requires that you provide consumerKeys, and accessTokens', function() {
      var errTestOpts = [
        {},
        { consumerSecret: 'abc', accessToken: '123', accessTokenSecret: '123' },
        { consumerKey: 'abc', accessToken: '123', accessTokenSecret: '123' },
        { consumerKey: 'abc', consumerSecret: 'abc', accessTokenSecret: '123' },
        { consumerKey: 'abc', consumerSecret: 'abc', accessToken: '123' },
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
      var fixture = [ { thisIsATweet: true, created_at: moment().subtract(1, 'month').format() } ];

      beforeEach(function() {
        testTwitter._getTweets = sinon.stub().callsArgWith(-1, null, fixture);
      });


      it('requires a username, date and a callback', function() {
        (function() { testTwitter.fetchTweetsSince(); }).should.throw();
      });

      it('returns a set of tweet objects', function(done) {
        testTwitter.fetchTweetsSince('belfordz', new Date(), function(err, tweets) {
          (tweets instanceof Array).should.be.OK;
          tweets.should.eql(fixture);
          testTwitter._getTweets.called.should.be.OK;
          done();
        });
      });

      it('filters tweets from dates previous the provided one', function(done) {
        var twoWeeksAgo = moment().subtract(2, 'weeks');

        testTwitter.fetchTweetsSince('belfordz', new Date(twoWeeksAgo), function() {
          done();
        });
      });

      it('always returns tweets that are after the provided date', function() {

      });
    });

    describe('fetchTweetsSinceForList', function() {
      it('returns an object keyd by username', function(done) {
        var oldFetch = testTwitter.fetchTweetsSince;
        testTwitter.fetchTweetsSince = sinon.stub().callsArgWith(-1, null, [ { tweet: true } ]);
        testTwitter.fetchTweetsSinceForList(['belfordz'], new Date(), function(err, result) {
          _.keys(result)[0].should.equal('belfordz');
          testTwitter.fetchTweetsSince = oldFetch;
          done();
        })
      });
    });
  });

  describe('private functions', function() {

    describe('_getTweets', function() {
      it('makes an api request to twitter', function(done) {
        var oldRequest = testTwitter.request;
        testTwitter.request = {
          get: sinon.stub().callsArgWith(-1, null, [ { this: 'is a tweet' } ])
        };

        testTwitter._getTweets({ username: 'belfordz' }, function(err, tweets) {
          (tweets instanceof Array).should.be.OK;
          testTwitter.request = oldRequest;
          done();
        });
      });
    });

    describe('_buildUrl', function() {
      it('takes a username and optionally a since_id and returns a url', function() {
        var expectedUrl = 'https://api.twitter.com/1.1/statuses/user_timeline.json' +
              '?count=200&include_rts=false&exclude_replies=true&trim_user=true&screen_name=belfordz';

        var testUrl = testTwitter._buildUrl('belfordz');
        (typeof testUrl).should.equal('string');

        testUrl.should.equal(expectedUrl);
        testUrl = testTwitter._buildUrl('belfordz', '123456');
        (testUrl.match(/123456/)).should.be.OK;
      });
    });

  });
});
