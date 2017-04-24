'use strict';

export default class LoginController {
  user = {
    name: '',
    email: '',
    password: ''
  };
  errors = {
    login: undefined
  };
  submitted = false;


  /*@ngInject*/
  constructor(Auth, $state, $http) {
    this.Auth = Auth;
    this.$state = $state;
    this.$http = $http;
  }

  login(form) {
    this.submitted = true;

    if(form.$valid) {
      this.Auth.login({
        email: this.user.email,
        password: this.user.password
      })
        .then(() => {
          // Logged in, redirect to home
          this.$state.go('polls');
        })
        .catch(err => {
          this.errors.login = err.message;
        });
    }
  }

  twitterLogin() {
    this.$http.post('/auth/twitter')
      .then(() => {
        // Logged in, redirect to home
        this.$state.go('polls');
      })
      .catch(err => {
        this.errors.login = err.message;
      });
  }
}
