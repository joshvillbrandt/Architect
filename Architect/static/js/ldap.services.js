'use strict';

//http://docs.angularjs.org/tutorial/step_11
//http://docs.angularjs.org/api/ngResource.$resource

/* Services */
var ldapservices = angular.module('ldap.services', []);

ldapservices.factory('Session', ['$http', '$sce', '$log', 'ldapURI',
    function($http, $sce, $log, ldapURI) {
        var session = {
            initialized: false,
            loginerror: false,
            authenticated: false,
            user: {}
        };

        function resume() {
            $http({
                method: 'JSONP',
                url: ldapURI+'/session/?callback=JSON_CALLBACK'
            })
            .success(function(data, status, headers, config) {
                session.initialized = true;
                httpSuccess(data, status, headers, config);
            })
            .error(httpError);
        };

        function logout() {
            // reset the session
            $http({
                method: 'JSONP',
                url: ldapURI+'/session/logout/?callback=JSON_CALLBACK'
            })
            .success(httpSuccess)
            .error(httpError);
        };
       
        function login(username, password) {
            session.loginerror = false;
            $http({
                method: 'JSONP',
                url: ldapURI+'/session/login/?callback=JSON_CALLBACK',
                params: {
                    'username': username,
                    'password': password,
                }
            })
            .success(function(data, status, headers, config) {
                if(!data.authenticated) session.loginerror = true;
                httpSuccess(data, status, headers, config);
            })
            .error(httpError);
        };

        function httpSuccess(data, status, headers, config) {
            session.authenticated = data.authenticated;
            session.user = data.user;
            if(data.message) $log.log(data.message);
            if(data.user.employeeNumber != undefined)
                session.user.img = $sce.trustAsHtml("<img src=\"http://badlands/api/users/" + data.user.employeeNumber + "/avatar?width=32&height=32\">");
        }

        function httpError(data, status, headers, config) {
            $log.error('Error occured while trying to authenticate session.')
        }

        // resume previous session
        resume();

        return {
            session: session,
            login: login,
            logout: logout,
        };
    }]);
