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
    $routeProvider.when('/home', {templateUrl: '/static/partials/home.html', controller: 'StaticCtrl'});
    $routeProvider.when('/browse-library', {templateUrl: '/static/partials/browse-library.html', controller: 'StaticCtrl'});
    $routeProvider.when('/component-editor', {templateUrl: '/static/partials/component-editor.html', controller: 'ComponentCtrl'});
    $routeProvider.when('/usage-guide', {templateUrl: '/static/partials/usage-guide.html', controller: 'StaticCtrl'});
    $routeProvider.when('/part/:id', {templateUrl: '/static/partials/part.html', controller: 'TaskCtrl'});
    $routeProvider.otherwise({redirectTo: '/home'});
}]);

app.config(['$httpProvider', function($httpProvider) {
    $httpProvider.defaults.useXDomain = true;
    delete $httpProvider.defaults.headers.common['X-Requested-With'];
}]);