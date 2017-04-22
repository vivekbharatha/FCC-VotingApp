'use strict';
const angular = require('angular');

/*@ngInject*/
export function pollController() {
  this.message = 'Hello';
}

export default angular.module('voteitApp.poll', [])
  .controller('PollController', pollController)
  .name;
