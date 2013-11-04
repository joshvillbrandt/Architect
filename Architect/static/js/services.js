'use strict';

//http://docs.angularjs.org/tutorial/step_11
//http://docs.angularjs.org/api/ngResource.$resource

/* Services */
var services = angular.module('app.services', ['ngResource']);

services.value('version', '0.1');

var tastypieDataTransformer = function ($http) {
    return $http.defaults.transformResponse.concat([
        function (data, headersGetter) {
            var result = data.objects;
            result.meta = data.meta;
            return result;
        }
    ])
};

services.factory('Task', ['$resource', '$log', '$http', 'taskURI',
    function($resource, $log, $http, taskURI) {
        return $resource(taskURI+'/api/dev/task/:taskID?format=json',
            {taskID:'@id'}, {
                all: {
                    method: 'GET',
                    isArray: true,
                    transformResponse: tastypieDataTransformer($http)
                }
            });
    }]);


services.factory('WindowManager', ['$log', '$location',
    function($log, $location) {
        var windowCategories = [
            '_app_', // special category
            'part',
            'channel',
            'cable',
            'connector'
        ];

        var windowMap = {
            '/home': {
                route: '/home',
                icon: 'glyphicon glyphicon-home',
                title: 'Home',
                subtitle: '',
                category: '_app_'
            },
            '/browse-library': {
                route: '/browse-library',
                icon: 'glyphicon glyphicon-search',
                title: 'Browse Library',
                subtitle: '',
                category: '_app_'
            },
            '/usage-guide': {
                route: '/usage-guide',
                icon: 'glyphicon glyphicon-info-sign',
                title: 'Usage Guide',
                subtitle: '',
                category: '_app_'
            }
        };

        var windows = [
            windowMap['/home'],
            windowMap['/browse-library'],
            windowMap['/usage-guide']
        ];

        function addWindow() {
            var push = !windowMap.hasOwnProperty('/connector/1');
            windowMap['/connector/1'] = {
                route: '/connector/1',
                title: 'My Part',
                subtitle: '00012345-501 Rev 1',
                category: 'part'
            };
            if(push) windows.push(windowMap['/connector/1']);
        }

        function closeWindow(route) {
            windows.splice(windows.indexOf(windowMap[route]), 1);
            delete windowMap[route];

            if(route = $location.path()) $location.path('/');
        }

        return {
            windowCategories: windowCategories,
            windows: windows,
            addWindow: addWindow,
            closeWindow: closeWindow,
        };
    }]);
