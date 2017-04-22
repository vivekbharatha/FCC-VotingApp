'use strict';

export default function($stateProvider) {
  'ngInject';
  $stateProvider
    .state('polls', {
      url: '/',
      template: '<poll></poll>'
    })
    .state('my-polls', {
      url: '/my-polls',
      template: '<my-poll></my-poll>',
      authenticate: true
    })
    .state('add-poll', {
      url: '/add-poll',
      template: '<add-poll></add-poll>',
      authenticate: true
    });
}
