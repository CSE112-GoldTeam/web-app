'use strict';

angular.module('webAppApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('business', {
        url: '/business',
        templateUrl: 'app/business/business.html',
        controller: 'BusinessCtrl'
      });
  });