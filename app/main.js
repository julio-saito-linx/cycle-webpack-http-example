import Cycle from '@cycle/core';
import Rx from 'rx';
import {div, p, a, hr, makeDOMDriver} from '@cycle/dom';
import {makeHTTPDriver} from '@cycle/http';
import _ from 'lodash';
import './style.css';

function main(sources) {
  const FIREBASE_URL = 'https://tweet-stream-app3.firebaseio.com/tweets.json';
  const getJson$ = Rx.Observable.of({
    url: FIREBASE_URL,
    method: 'GET'
  });

  const allTweets$ = sources.HTTP
    .filter(res$ => res$.request.url.indexOf(FIREBASE_URL) === 0)
    .mergeAll()
    .map(res => res.body)
    .startWith(null);

  function renderUsers(allTweets) {
    if (!allTweets) {
      return null;
    }

    const html = [];
    const searchTopics = _.keys(allTweets);

    searchTopics.forEach((topicName) => {
      const subject = allTweets[topicName];
      const divResults = _.map(subject, (tweet) => {
        return div('.tweet-details', [
          p('.tweet-topic', topicName),
          p('.tweet-name', tweet.user),
          p('.tweet-text', tweet.text),
          a('.tweet-website', {
            href: `${tweet.link}`,
            target: '_blank',
          }, 'link'),
          hr(),
        ]);
      });
      html.push(divResults);
    });

    return html;
  }

  const vtree$ = allTweets$.map(allTweets =>
    div('.container', [
      div('.tweets', [
        renderUsers(allTweets)
      ])
    ])
  );

  return {
    DOM: vtree$,
    HTTP: getJson$
  };
}

Cycle.run(main, {
  DOM: makeDOMDriver('#main-container'),
  HTTP: makeHTTPDriver()
});
