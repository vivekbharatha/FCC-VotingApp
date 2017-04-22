'use strict';

export default function($stateProvider) {
  'ngInject';
  $stateProvider
    .state('polls', {
      url: '/',
      template: '<poll></poll>'
    })
    .state('poll', {
      url: '/polls/{id}',
      template: '<poll-view></poll-view>'
    })
    .state('my-polls', {
      url: '/my-polls',
      template: '<poll></poll>',
      authenticate: true
    })
    .state('add-poll', {
      url: '/add-poll',
      template: '<add-poll></add-poll>',
      authenticate: true
    });
}
