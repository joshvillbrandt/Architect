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


services.factory('WindowManager', ['$log',
    function($log) {
        var windowCategories = [
            'app',
            'part',
            'channel',
            'cable',
            'connector'
        ];

        var windows = [{
            part: '',
            name: 'Open Component',
            category: 'app',
            active: true
        },{
            part: '12345678-501',
            name: 'Super Draco Controller',
            category: 'part',
            active: false
        }];

        function addWindow() {
            windows.push({
                part: '',
                name: 'test',
                category: 'app',
                active: false
            });
        }

        return {
            windowCategories: windowCategories,
            windows: windows,
            addWindow: addWindow,
        };
    }]);
