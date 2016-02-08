import Cycle from '@cycle/core';
import {div, p, br, a, hr, makeDOMDriver} from '@cycle/dom';
import FirebaseDriver from './firebase-driver';
import './style.css';

function main(sources) {
  const allTweets$ = sources.Firebase
    .startWith(null);

  const tweetList = [];

  function addTweet(tweet) {
    if (!tweet) {
      return null;
    }

    tweetList.push(
      div('.col-md-12', [
        p('.tweet-name', [
          a({
            href: `${tweet.link}`,
            target: '_blank',
            className: 'tweet-username',
          }, tweet.user),
          a('.tweet-website', {
            href: `${tweet.link}`,
            target: '_blank',
          }, 'link'),
        ]),
        p('.tweet-text', tweet.text.replace(/\n/g, '<br>')),
        hr(),
      ])
    );

    return tweetList;
  }

  const vtree$ = allTweets$.map(allTweets =>
    div('.container-fluid', [
      div('.row', [
        addTweet(allTweets)
      ])
    ])
  );

  return {
    DOM: vtree$
  };
}

Cycle.run(main, {
  DOM: makeDOMDriver('#main-container'),
  Firebase: FirebaseDriver('https://afhajksfhdajksfh.firebaseio.com')
  // HTTP: makeHTTPDriver()
});
