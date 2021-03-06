'use strict';

/* Controllers */

var controllers = angular.module('app.controllers', []);

controllers.controller('NavbarCtrl', ['$scope', '$http', '$location', 'Session',
    function ($scope, $http, $location, Session) {
        $scope.session = Session.session;
        $scope.logout = Session.logout;
        $scope.login = function () {
            Session.login($scope.username, $scope.password);
        };

        $scope.isNavbarActive = function (navBarPath) {
            return navBarPath === $location.path();
        };

        $scope.hasPendingRequests = function () {
            return $http.pendingRequests.length > 0;
        };
    }]);

controllers.controller('SidebarCtrl', ['$rootScope', '$scope', '$log', '$location', 'WindowManager',
    function ($rootScope, $scope, $log, $location, WindowManager) {
        $scope.windowCategories = WindowManager.windowCategories;
        $scope.windows = WindowManager.windows;
        $scope.closeWindow = WindowManager.closeWindow;
        $scope.currentRoute = $location.path();

        // to suppot highlighting the active window
        $rootScope.$on('$routeChangeSuccess', function(e, current, pre) {
            $scope.currentRoute = $location.path();
        });
    }]);

controllers.controller('StaticCtrl', ['$scope',
    function ($scope) {
    }]);

controllers.controller('ComponentCtrl', ['$scope',
    function ($scope) {
        $scope.test = 1;
    }]);

controllers.controller('PartCtrl', ['$scope', '$routeParams', '$log',
    function ($scope, $routeParams, $log) {
        $scope.channelMode = true;
        $scope.root = $routeParams.root;
        $scope.version = $routeParams.version;
  $scope.isCollapsed = false;

        $scope.selectedChild = 0;

        $scope.children = [];
        for(var i = 0; i < 3; i++) {
            var child = {
                id: i,
                name: Math.random(),
            };
            $scope.children.push(child); // sorry kid
        }

        $scope.channels = [];
        for(var i = 0; i < 10; i++) {
            var channel = {
                exposed: Math.round(Math.random()) == 1, // true if this isn't an exposed child's channel
                part: i%3,
                name: Math.random(),
            };
            $scope.channels.push(channel);
        }
    }]);

controllers.controller('TaskCtrl', ['$scope', '$log', '$modal', 'Task', 'Session',
    function($scope, $log, $modal, Task, Session) {
        // testing single Task
        Task.get({taskID: 1}, function(task) {
            $log.log('single...');
            $log.log(task);
        });
        
        $scope.exampleData = {
    name: 'accounts',
    local: ['timtrueman', 'JakeHarding', 'vskarich']
  };
  $scope.multiExample = {
  };

        $scope.priority = 5;
        $scope.tasks = Task.all({}, function(data) {
            $log.log('all...', data);
        });

        $scope.open = function (taskID) {
            var task = {id: 'new', name:'', uid: null, position: null, completed: false}
            if(taskID != 'new') {
                //todo
            }

            var modalInstance = $modal.open({
                templateUrl: '/static/partials/edit-task.html',
                controller: ModalInstanceCtrl,
                resolve: {
                    task: function () {
                        return task;
                    }
                }
            });

            modalInstance.result.then(function (task) {
                task.position = $scope.tasks.length + 1;
                $log.log(task);
                $scope.tasks.push(task);
            }, function () {
                $log.info('Modal dismissed at: ' + new Date());
            });
        };
    }]);

/*angular.module('app.controllers', []).
    controller('EditTaskModalCtrl', ['$scope', '$modalInstance', 'task',
    function($scope, $modalInstance, task) {

        $scope.task = task;
        $scope.selected = {
            item: task
        };

        $scope.ok = function () {
            $modalInstance.close(task);
        };

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };

    }]);*/



var ModalInstanceCtrl = function ($scope, $modalInstance, task) {
    $scope.task = task;

    $scope.save = function () {
        $modalInstance.close($scope.task);
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
};