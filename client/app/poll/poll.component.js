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

  showOptionCreation = false;


  /*@ngInject*/
  constructor($http, $state) {
    this.$http = $http;
    this.$state = $state;
  }

  submitted = false;

  $onInit() {
    switch (this.$state.current.name) {
      case 'polls':
        this.$http.get('/api/polls')
          .then(response => {
            this.polls = response.data;
          });
            break;
      case 'my-polls':
            this.$http.get('/api/polls/fetch')
              .then(response => {
                this.polls = response.data;
              });
            break;
      case 'poll':
        if (this.$state.params.id === '') return this.$state.go('polls');
        this.$http.get('/api/polls/' + this.$state.params.id)
          .then(response => {
            this.poll = response.data;
          });
        break;
      case 'default':
    }

  }

  addPoll(addPollForm) {
    this.submitted = true;
    this.errors.addPoll = undefined;

    if (addPollForm.$valid) {
      let options = this.newPoll.optionsString.split(',');

      // Empty option filtering
      options = options.filter(option => option);

      if (options.length <= 1) {
        return this.errors.addPoll = 'Please add minimum two options by comma separated ","';
      }

      this.$http.post('/api/polls', { title: this.newPoll.title, options })
        .then((response) => {
          this.$state.go('my-polls');
        })
        .catch(err => {
          this.errors.addPoll = err.message;
        });

    }
  }
}

export default angular.module('voteitApp.poll', [uiRouter])
  .config(routes)
  .component('poll', {
    template: require('./polls.html'),
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
  .component('pollView', {
    template: require('./poll-view.html'),
    controller: PollController,
    controllerAs: 'pc'
  })
  .name;
