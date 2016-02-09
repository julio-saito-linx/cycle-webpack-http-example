import Rx from 'rx';
import Cycle from '@cycle/core';
import {div, p, a, hr, img, makeDOMDriver} from '@cycle/dom';
import FirebaseDriver from './firebase-driver';
import './style.css';

function main(sources) {
  const tweetList = [];

  const allTweets$ = Rx.Observable.of(require('../fixtures/data.json'));
  // const allTweets$ = sources.Firebase.startWith(null);

  function getExtendedImages(tweet) {
    if (tweet.extended_entities && tweet.extended_entities.media && tweet.extended_entities.media.length > 0) {
      return img({src: tweet.extended_entities.media[0].media_url});
    }

    return null;
  }

  function addTweet(tweet) {
    if (!tweet) {
      return null;
    }

    tweetList.push(
      div('.col-md-12', [
        div({
          className: 'tweet-name',
          style: {'background': `url(${tweet.user.profile_background_image_url}) right center / cover repeat scroll padding-box padding-box transparent   `},
        }, [
          img({src: tweet.user.profile_image_url}),
          p('.tweet-user-name', tweet.user.name),
          p(`${tweet.user.followers_count} (${tweet.user.friends_count}) ${tweet.user.lang}`),
          a({
            href: `https://twitter.com/${tweet.user.screen_name}`,
            target: '_blank',
            className: 'tweet-username',
            title: tweet.user.description
          }, `@${tweet.user.screen_name}`),
          a({
            href: `https://twitter.com/${tweet.user.screen_name}/status/${tweet.id_str}`,
            target: '_blank',
            className: 'tweet-link',
          }, `${new Date(tweet.created_at).toLocaleTimeString() }`),
          p('.tweet-text', tweet.text),
          getExtendedImages(tweet),
        ]),
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
