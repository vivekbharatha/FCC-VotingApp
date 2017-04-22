'use strict';

import angular from 'angular';
import {
  UtilService
} from './util.service';

export default angular.module('voteit.util', [])
  .factory('Util', UtilService)
  .name;
