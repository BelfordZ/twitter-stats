// Lib for fetching data from twitter api

var url = require('url');

var clone = require('clone');
var async = require('async');
var _ = require('underscore');
var OAuth = require('OAuth');

function Twitter(opts) {
  if (typeof opts.consumerKey !== 'string') {
    throw new Error('opts.consumerKey must be a string');
  }

  if (typeof opts.consumerSecret !== 'string') {
    throw new Error('opts.consumerSecret must be a string');
  }

  if (typeof opts.accessToken !== 'string') {
    throw new Error('opts.accessToken must be a string');
  }

  if (typeof opts.accessTokenSecret !== 'string') {
    throw new Error('opts.accessTokenSecret must be a string');
  }

  this.accessToken = opts.accessToken;
  this.accessTokenSecret = opts.accessTokenSecret;

  this.request = new OAuth.OAuth(
    'https://api.twitter.com/oauth/request_token',
    'https://api.twitter.com/oauth/access_token',
    opts.consumerKey,
    opts.consumerSecret,
    '1.0A',
    null,
    'HMAC-SHA1'
  );

  this.baseUrl = {
    protocol: 'https',
    host: 'api.twitter.com',
    pathname: '/1.1/statuses/user_timeline.json',
    query: {
      count: 200,
      include_rts: false,
      exclude_replies: true,
      trim_user: true
    }
  };
}


//public methods

Twitter.prototype.fetchTweetsSinceForList = function(usernames, sinceDate, cb) {
  var _this = this;

  var tweets = {};

  async.each(
    usernames,
    function(username, _cb) {
      _this.fetchTweetsSince(username, sinceDate, function(err, userTweets) {
        if (err) { return _cb(err, null); }

        tweets[username] = userTweets;

        return _cb(null, null);
      });
    },
    function(err) {
      if (err) { return cb(err, null); }
      return cb(null, tweets);
    });
};

Twitter.prototype.fetchTweetsSince = function(username, sinceDate, cb) {
  if (!username || !sinceDate || typeof cb !== 'function') {
    throw new Error('username, sinceDate and a callback are required');
  }

  var _this = this;

  var tweets = [];
  var maxId;

  var testMethod = function() {
    if (tweets.length === 0) {
      return false;
    }

    // the tweets must have at least one tweet older than the since date
    // so that we know that we have looked at the last two weeks
    for (var i = 0; i < tweets.length; i++) {
      if (new Date(tweets[i].created_at) < sinceDate) {
        tweets = tweets.slice(0, i + 1);
        return false;
      }
    }

    maxId = _.last(tweets).id;
    return true;
  };

  async.doWhilst(
    function(_cb) {
      _this._getTweets({ username: username, maxId: maxId }, function(err, resultTweets) {
        if (err) { return _cb(err); }

        tweets = tweets.concat(resultTweets);

        return _cb(null, null);
      });
    },
    testMethod,
    function(err, result) {
      return cb(err, tweets);
    }
  );
};


// private methods

Twitter.prototype._getTweets = function(opts, cb) {
  var reqUrl = this._buildUrl(opts.username, opts.since);

  return this.request.get(
    reqUrl,
    this.accessToken,
    this.accessTokenSecret,
    function(err, response) {
      if (err) { return cb(err); }

      try {
        var res = JSON.parse(response);
      } catch (e) {
        return cb(e);
      }

      return cb(null, res);
    }
  );
};


Twitter.prototype._buildUrl = function(username, since) {
  var urlObj = clone(this.baseUrl);

  urlObj.query.screen_name = username;

  if (since) { urlObj.query.since_id = since; }

  return url.format(urlObj);
};


module.exports = Twitter;
