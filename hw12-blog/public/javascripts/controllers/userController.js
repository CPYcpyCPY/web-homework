var userController = angular.module('userController', []);

// 登陆
userController.controller('signinCtrl', ['$scope', '$http', '$location', '$rootScope',
    function($scope, $http, $location, $rootScope) {
        $rootScope.title = '登陆';
        $scope.user = {};
        $scope.error = {};
        $scope.signin = function() {
            $http.post('/api/signin', $scope.user).success(function(data) {
                if (data.error === false) {
                    if (data.message === 'admin')
                        $location.path('/admin');
                    else
                        $location.path('/home');
                } else {
                    $scope.error = data.error;
                }
            });
        };
        $scope.clear = function() {
            $scope.user = {};
            $scope.error = {};
        };
    }]);

// 注册
userController.controller('signupCtrl', ['$scope', '$http', '$location', '$rootScope',
    function($scope, $http, $location, $rootScope) {
        $rootScope.title = '注册';
        $scope.user = {};
        $scope.error = {};
        $scope.signup = function() {
            if ($scope.user.password !== $scope.passwordAgain) {
                $scope.error.passwordError2 = '两次密码不一致';
                return;
            }
            $http.post('/api/signup', $scope.user).success(function(data) {
                if (data.error == false)
                    $location.path('/detail/'+$scope.user.username);
                else
                    $scope.error = data.error;
            });
        };
        $scope.clear = function() {
            $scope.user = {};
            $scope.error = {};
            $scope.passwordAgain = '';
        }
    }]);

// 用户详情
userController.controller('detailCtrl', ['$scope', '$http', '$routeParams', '$location', '$rootScope',
    function($scope, $http, $routeParams, $location, $rootScope) {
        $rootScope.title = '用户详情';
        $scope.user = {};
        $http.get('/api/detail').success(function(data) {
            if (data.message == 'not signin') {
                $location.path('/signin');
            } else {
                $scope.user = data.user;
            }
        });
    }]);

// 退出
userController.controller('signoutCtrl', ['$http', '$location',
    function($http, $location) {
        $http.get('/api/signout').success(function(data) {
            $location.path('/signin');
        });
    }]);
