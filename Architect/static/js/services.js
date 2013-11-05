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


services.factory('WindowManager', ['$rootScope', '$log', '$location',
    function($rootScope, $log, $location) {
        var windowCategories = [
            '_app_', // special category
            'part',
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
            '/component-editor': {
                route: '/component-editor',
                icon: 'glyphicon glyphicon-pencil',
                title: 'Component Editor',
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
            windowMap['/component-editor'],
            windowMap['/usage-guide']
        ];

        // automatically add current window to list
        $rootScope.$on('$routeChangeSuccess', function(e, current, pre) {
            var route = $location.path();
            $log.log(route)
            if(windowMap[$location.path()] == undefined) {
                var parts = route.split('/');
                var windowConfig = {
                        route: route,
                        title: (parts[1] == 'part' ? 'part ' + parts[2] + 'title here' : route),
                        subtitle: (parts[1] == 'part' ? '00000000-000 Rev 0' : ''),
                        category: parts[1]
                    }
                addWindow(windowConfig);
            }
        });

        function addWindow(window) {
            var push = !windowMap.hasOwnProperty(window.route);
            windowMap[window.route] = window;
            if(push) windows.push(windowMap[window.route]);
        }

        function closeWindow(route) {
            windows.splice(windows.indexOf(windowMap[route]), 1);
            if(windowMap[route] != undefined) delete windowMap[route];
            if(scopeMap[route] != undefined) delete scopeMap[route];

            if(route = $location.path()) $location.path('/');
        }

        return {
            windowCategories: windowCategories,
            windows: windows,
            addWindow: addWindow,
            closeWindow: closeWindow,
        };
    }]);
