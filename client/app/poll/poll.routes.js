'use strict';

export default function($stateProvider) {
  'ngInject';
  $stateProvider
    .state('poll', {
      url: '/',
      template: '<poll></poll>'
    });
}
