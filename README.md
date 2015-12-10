# Twitter-stats

Gives you real shitty stats about a twitter account via shitty rest api
example stats:
```
stats: {
  counts: { // number of tweets made by configurable array of twitter accounts
    PayByPhone: 7,
    PayByPhone_UK: 21,
    pay_by_phone: 34
  },
  mentions: { // number of times the accounts were mentioned by other tweets
    PayByPhone: 4,
    PayByPhone_UK: 5,
    pay_by_phone: 13
  }
}
```

Also returns a list of last tweets

To run:

set env variables:

```
export consumerSecret=
export consumerKey=
export accessToken=
export accessTokenSecret=
```

then

`npm install && npm start`

then

`localhost:8080/`