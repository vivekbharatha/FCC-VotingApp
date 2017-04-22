'use strict';
const angular = require('angular');

const uiRouter = require('angular-ui-router');

import routes from './poll.routes';

export class PollController {

  polls = [];
  newPoll= { title: '', optionsString: [] };
  vote = {option: ''};

  heading = 'List of all polls in VoteIt';

  errors = {
    addPoll: undefined,
    votePoll: undefined
  };

  showOptionCreation = false;


  /*@ngInject*/
  constructor($http, $state, Auth) {
    this.$http = $http;
    this.$state = $state;
    this.isLoggedIn = Auth.isLoggedInSync;
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
            this.heading = 'List of all your polls';
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
          })
          .catch(error => {
            if (error.data.name === 'CastError') {
              return this.$state.go('polls');
            }
          });
        break;
      case 'default':
    }

  }

  // Creating a poll
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

  // Submit a vote to a poll
  submitVote(voteForm) {
    this.submitted = true;
    this.errors.votePoll = undefined;

    if (voteForm.$valid) {

      if ((!this.vote.option && this.showOptionCreation && !this.vote.newOption) || (!this.vote.option && !this.showOptionCreation)) {
        return this.errors.votePoll = 'Choose one option or create new option';
      }

      this.$http.post('/api/polls/vote/' + this.poll._id, { option: this.vote.option || this.vote.newOption })
        .then((response) => {
          this.$state.reload();
        })
        .catch(err => {
          this.errors.votePoll = err.data.message;
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
