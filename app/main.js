import Cycle from '@cycle/core';
import {div, button, h1, h4, a, makeDOMDriver} from '@cycle/dom';
import {makeHTTPDriver} from '@cycle/http';
import './style.css';

function main(sources) {
  const USERS_URL = 'http://jsonplaceholder.typicode.com/users/';
  const getRandomUser$ = sources.DOM.select('.get-random').events('click')
    .map(() => {
      const randomNum = Math.round(Math.random() * 9) + 1;
      const urlPath = USERS_URL + String(randomNum);
      /**/console.log('\n>>---------\n urlPath:\n', urlPath, '\n>>---------\n');/*-debug-*/
      return {
        url: urlPath,
        method: 'GET'
      };
    });

  const user$ = sources.HTTP
    .filter(res$ => res$.request.url.indexOf(USERS_URL) === 0)
    .mergeAll()
    .map(res => res.body)
    /**/.do((x) => console.log('body', x))/*-debug-*/
    .startWith(null);

  const vtree$ = user$.map(user =>
    div('.container', [
      div('.users', [
        button('.get-random', 'Get random user'),
        user === null ? null : div('.user-details', [
          h1('.user-name', user.name),
          h4('.user-email', user.email),
          a('.user-website', {
            href: 'http://' + user.website,
            target: '_blank',
          }, user.website)
        ])
      ])
    ])
  );

  return {
    DOM: vtree$,
    HTTP: getRandomUser$
  };
}

Cycle.run(main, {
  DOM: makeDOMDriver('#main-container'),
  HTTP: makeHTTPDriver()
});
