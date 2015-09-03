var moment = require('moment');
var _ = require('underscore');

var Twitter = require('./');

var testTwitter = new Twitter({
  consumerSecret: 'dsqEWHgvwAwaUus2w52MZbq5hPeDxpIWvqJfG77caA',
  consumerKey: 'Fr8hknlt7BJrPWrdQziA',
  accessToken: '1238826264-ndXU69TndDZNyEnpiWhZ3JPJY3t03ZuvcC6PQbg',
  accessTokenSecret: '0lq4TFFiahARw1IzQAuIMOJJXLv4mypbOVVueRszyOj3i'
});


var getStats = function(cb) {
  var twoWeeksAgo = moment().subtract(2, 'weeks');

  var usernames = [
    'pay_by_phone',
    'PayByPhone',
    'PayByPhone_UK'
  ];

  //var usernames = [ 'belfordz' ]
  testTwitter.fetchTweetsSinceForList(usernames, new Date(twoWeeksAgo), function(err, tweets) {
    if (err) { return cb(err, null); }

    var stats = {
      counts: {},
      mentions: {}
    };

    var tweetSet = [];

    _.each(tweets, function(tweets, username) {
      stats.counts[username] = tweets.length;
      stats.mentions[username] = _.reduce(tweets, function(sum, tweet) {
        tweetSet.push({
          account: username,
          tweet: tweet.text,
          createdAt: new Date(tweet.created_at)
        });

        return sum + tweet.text.split('@').length - 1;
      }, 0);
    });

    tweetSet = _.sortBy(tweetSet, 'createdAt');

    return cb(null, {
      stats: stats,
      tweets: tweetSet
    });
  });
};

module.exports = getStats;
