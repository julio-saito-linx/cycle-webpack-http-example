// import Rx from 'rx';
import Cycle from '@cycle/core';
import {div, p, a, hr, img, span, makeDOMDriver} from '@cycle/dom';
import FirebaseDriver from './firebase-driver';
import moment from 'moment';
import './style.css';

function main(sources) {
  const firebase$ = sources.Firebase.startWith(null);

  function getExtendedPropertiesMedia(tweet, extendedEntitiesName, extendedEntitiesField) {
    if (tweet.extended_entities &&
        tweet.extended_entities[extendedEntitiesName] &&
        tweet.extended_entities[extendedEntitiesName].length > 0) {
      return tweet.extended_entities[extendedEntitiesName].reduce((prev, curr) => {
        prev.push(img({src: curr[extendedEntitiesField]}));
        return prev;
      }, []);
    }
    return null;
  }

  function getEntity(tweet, entityName, entityField) {
    if (tweet.entities &&
        tweet.entities[entityName] &&
        tweet.entities[entityName].length > 0) {
      return tweet.entities[entityName].reduce((prev, curr) => {
        prev.push(span('.entity-' + entityField, '#' + curr[entityField]));
        return prev;
      }, []);
    }
    return null;
  }

  function getEntityLink(tweet, entityName, entityField) {
    if (tweet.entities &&
        tweet.entities[entityName] &&
        tweet.entities[entityName].length > 0) {
      return tweet.entities[entityName].reduce((prev, curr) => {
        prev.push(a({
          className: 'entity-' + entityField,
          href: curr[entityField],
          target: '_blank',
        }, curr[entityField]));
        return prev;
      }, []);
    }
    return null;
  }

  function addTweet(tweet) {
    return div('.tweet', [
      div('.row', [
        div('.col-sm-1', [
          img({src: tweet.user.profile_image_url}),
        ]),
        div('.col-sm-11', [
          span('.tweet-user-name', tweet.user.name),
          a({
            className: 'tweet-username',
            href: `https://twitter.com/${tweet.user.screen_name}`,
            target: '_blank',
            title: tweet.user.description
          }, `@${tweet.user.screen_name}`),
          a({
            className: 'tweet-header-info',
            href: `https://twitter.com/${tweet.user.screen_name}/status/${tweet.id_str}`,
            target: '_blank',
          }, `${moment(new Date(tweet.created_at)).format('HH:mm') }`),
          span('.tweet-header-info', [`(`]),
          span('.tweet-header-info', [`${tweet.user.followers_count}`]),
          span('.tweet-header-info', [`${tweet.user.friends_count}`]),
          span('.tweet-header-info', [`)`]),
          span('.tweet-header-info', [`${tweet.user.lang}`]),
          span('.tweet-header-info', [`${tweet.id}`]),
        ]),
      ]),
      div('.row', [
        div('.col-sm-1', [
          ''
        ]),
        div('.col-sm-11', [
          p('.tweet-text', tweet.text),
          getEntity(tweet, 'hashtags', 'text'),
          getEntityLink(tweet, 'urls', 'expanded_url'),
          getExtendedPropertiesMedia(tweet, 'media', 'media_url'),
        ]),
      ]),
      hr(),
    ]);
  }

  const list$ = firebase$
    .filter((x) => x !== null)
    .scan((acc, curr) => acc.concat(addTweet(curr)), []);

  const vtree$ = list$.map((all) => {
    return div('.container', all);
  });

  return {
    DOM: vtree$
  };
}

Cycle.run(main, {
  DOM: makeDOMDriver('#main-container'),
  Firebase: FirebaseDriver('https://afhajksfhdajksfh.firebaseio.com')
});
