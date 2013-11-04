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
        $scope.addWindow = WindowManager.addWindow;
        $scope.closeWindow = WindowManager.closeWindow;
        $scope.currentRoute = $location.path();
        $rootScope.$on('$routeChangeSuccess', function(e, current, pre) {
            $scope.currentRoute = $location.path();
        });
    }]);

controllers.controller('StaticCtrl', ['$scope',
    function ($scope) {
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