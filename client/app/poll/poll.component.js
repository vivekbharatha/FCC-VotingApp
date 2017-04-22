'use strict';
const angular = require('angular');

const uiRouter = require('angular-ui-router');

import routes from './poll.routes';

export class PollController {

  polls = [];
  newPoll= { title: '', options: [] };

  /*@ngInject*/
  constructor($http, $scope) {
    this.$http = $http;
  }

  $onInit() {
    this.$http.get('/api/polls')
      .then(response => {
        this.polls = response.data;
      });
  }
}

export default angular.module('voteitApp.poll', [uiRouter])
  .config(routes)
  .component('poll', {
    template: require('./poll.html'),
    controller: PollController,
    controllerAs: 'pollCtrl'
  })
  .name;
