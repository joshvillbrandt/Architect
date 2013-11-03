'use strict';


// Declare app level module which depends on filters, and services
var app = angular.module('app', [
    'ngRoute',
    'app.filters',
    'app.services',
    'app.directives',
    'app.controllers',
    'ui.bootstrap',
    'ldap.services',
    'siyfion.sfTypeahead',
]);

app.value('ldapURI', '//jvillbrandt-ubuntu:8008');
app.value('taskURI', '//jvillbrandt-ubuntu:8007');

app.config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/open', {templateUrl: '/static/partials/open.html', controller: 'TaskCtrl'});
    $routeProvider.when('/connector/:id', {templateUrl: '/static/partials/connector.html', controller: 'TaskCtrl'});
    $routeProvider.otherwise({redirectTo: '/open'});
}]);

app.config(['$httpProvider', function($httpProvider) {
    $httpProvider.defaults.useXDomain = true;
    delete $httpProvider.defaults.headers.common['X-Requested-With'];
}]);