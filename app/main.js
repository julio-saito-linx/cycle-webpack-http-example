import Cycle from '@cycle/core';
import {div, a, img, makeDOMDriver} from '@cycle/dom';
import FirebaseDriver from './firebase-driver';
import './style.css';

function main(sources) {
  const tweetList = [];

  // const allTweets$ = require('rx').Observable.of(require('../fixtures/data.json'));
  const allTweets$ = sources.Firebase.startWith(null);

  function getExtendedImages(tweet) {
    return a({
      href: `https://twitter.com/${tweet.user.screen_name}/status/${tweet.id_str}`,
      target: '_blank',
      className: 'tweet-link',
    }, img({
      src: tweet.extended_entities.media[0].media_url,
      className: 'img-thumbnail',
    }));
  }

  const photos$ = allTweets$
  /**/.do(() => console.log('tweet')) /* -debug-*/
  .filter((x) => x !== null &&
                 x.extended_entities &&
                 x.extended_entities.media &&
                 x.extended_entities.media.length > 0)
  /**/.do(() => console.log('filtered')) /* -debug-*/
  .distinct((x) => x.extended_entities.media[0].media_url)
  /**/.do((tweet) => console.log(tweet.extended_entities.media[0].media_url)) /* -debug-*/
  .map((tweet) => {
    return getExtendedImages(tweet);
  })
  .scan((array, imgEle) => {
    array.push(imgEle);
    return array;
  }, [])
  ;

  const vtree$ = photos$.map(allTweets =>
    div('.container', [
      div(allTweets)
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
