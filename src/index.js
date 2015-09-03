// Lib for fetching data from twitter api

var url = require('url');

var clone = require('clone');
var OAuth = require('OAuth');

function Twitter(opts) {
  if (typeof opts.applicationSecret !== 'string') {
    throw new Error('opts.applicationSecret must be a string');
  }

  if (typeof opts.consumerKey !== 'string') {
    throw new Error('opts.consumerKey must be a string');
  }

  this.request = new OAuth.OAuth(
    'https://api.twitter.com/oauth/request_token',
    'https://api.twitter.com/oauth/access_token',
    opts.consumerKey,
    opts.applicationSecret,
    '1.0A',
    null,
    'HMAC-SHA1'
  );

  this.baseUrl = {
    protocol: 'https',
    host: 'api.twitter.com',
    pathname: '/1.1/statuses/user_timeline.json',
    query: {
      count: 200
    }
  };
}


//public methods
Twitter.prototype.fetchTweetsSince = function(sinceDate, cb) {
  return cb();
};


// private methods
Twitter.prototype._getTweetsForUser = function() {};



Twitter.prototype.buildUrl = function(username, since) {
  var urlObj = clone(this.baseUrl);

  urlObj.query.screen_name = username;

  if (since) { urlObj.query.since = since; }

  return url.format(urlObj);
};


module.exports = Twitter;
