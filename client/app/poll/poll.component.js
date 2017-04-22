'use strict';
const angular = require('angular');

const uiRouter = require('angular-ui-router');

import routes from './poll.routes';

export class PollController {

  polls = [];
  newPoll= { title: '', optionsString: [] };

  errors = {
    addPoll: undefined
  };

  /*@ngInject*/
  constructor($http, $state) {
    this.$http = $http;
    this.$state = $state;
  }

  submitted = false;

  $onInit() {
    if(this.$state.current.name === 'polls') {
      this.$http.get('/api/polls')
        .then(response => {
          this.polls = response.data;
        });
    }
  }

  addPoll(addPollForm) {
    this.submitted = true;
    this.errors.addPoll = undefined;

    if (addPollForm.$valid) {
      const options = this.newPoll.optionsString.split(',');
      if (options.length <= 1) {
        return this.errors.addPoll = 'Please add minimum two options by comma separated ","';
      }

      this.$http.post('/api/polls', { title: this.newPoll.title, options })
        .then((response) => {
          console.log(response);
          this.$state.go('my-polls');
        })
        .catch(err => {
          this.errors.addPoll = err.message;
        });

    }

    /*this.newPoll = $scope
    this.$http.post('/api/polls', newPoll)*/
  }
}

export default angular.module('voteitApp.poll', [uiRouter])
  .config(routes)
  .component('poll', {
    template: require('./poll.html'),
    controller: PollController,
    controllerAs: 'pc'
  })
  .component('addPoll', {
    template: require('./add-poll.html'),
    controller: PollController,
    controllerAs: 'pc'
  })
  .component('myPoll', {
    template: require('./my-polls.html'),
    controller: PollController,
    controllerAs: 'pc'
  })
  .name;
