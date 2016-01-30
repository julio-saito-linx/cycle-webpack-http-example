import Cycle from '@cycle/core';
import {div, button, h4, p, a, ul, li, makeDOMDriver} from '@cycle/dom';
import {makeHTTPDriver} from '@cycle/http';
import './style.css';

function main(sources) {
  const USERS_URL = 'http://jsonplaceholder.typicode.com/users/';
  const getAllUsers$ = sources.DOM.select('.get-users').events('click')
    .map(() => {
      return {
        url: USERS_URL,
        method: 'GET'
      };
    });

  const users$ = sources.HTTP
    .filter(res$ => res$.request.url.indexOf(USERS_URL) === 0)
    .mergeAll()
    .map(res => res.body)
    /**/.do((x) => console.log('body', x))/* -debug- */
    .startWith(null);

  const vtree$ = users$.map(users =>
    div('.container', [
      div('.row', [
        div('.col-xs-6', [
          div('.users', [
            button('.get-users', 'Fetch users'),
          ]),
          ul('.users-results', users && users.map(user =>
            li('.user-details', [
              a({
                className: '.user-id',
                href: '#',
              }, `${user.name} [id: ${user.id.toString()}]`),
              // p('.user-email', user.email.toLowerCase()),
              // a('.user-website', {
              //   href: 'http://' + user.website,
              //   target: '_blank',
              // }, user.website)
            ])
          )),
        ]),
        div('.col-xs-6', [
          'TODO: users detail'
        ]),
      ])
    ])
  );

  return {
    DOM: vtree$,
    HTTP: getAllUsers$
  };
}

Cycle.run(main, {
  DOM: makeDOMDriver('#main-container'),
  HTTP: makeHTTPDriver()
});
