var userController = angular.module('userController', []);

userController.controller('signinCtrl', ['$scope', '$http', '$location', '$rootScope',
    function ($scope, $http, $location, $rootScope) {
        if ($rootScope.user) {
            if ($rootScope.user.authority == 'Student')
                $location.path('/student');
            else if ($rootScope.user.authority == 'TA')
                $location.path('/ta');
            else if ($rootScope.user.authority == 'teacher')
                $location.path('/teacher');
        }
        $scope.user = {};
        $scope.error = {};
        // 登陆
        $scope.signin = function() {
            $http.post('/api/user/signin', $scope.user).success(function (data) {
                if (!data.error) {
                    $rootScope.user = data.user;
                    if (data.user.authority === 'teacher')
                        $location.path('/teacher');
                    else if (data.user.authority === 'TA')
                        $location.path('/ta');
                    else
                        $location.path('/student');
                } else {
                    $scope.error = data.error;
                }
            });
        };
    }]);

userController.controller('signoutCtrl', ['$http', '$location', '$rootScope',
    function ($http, $location, $rootScope) {
        $http.get('/api/user/signout').success(function() {
            delete $rootScope.user;
            $location.path('/signin');
        });
    }]);