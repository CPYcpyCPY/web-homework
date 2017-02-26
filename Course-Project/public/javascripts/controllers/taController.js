var taController = angular.module('taController', []);

taController.controller('taCtrl', ['$scope', '$http', '$location', '$rootScope',
    function ($scope, $http, $location, $rootScope) {
        $scope.allHomework = [];
        $scope.allSubmission = [];
        $http.get('/api/ta/allHomework').success(function (data) {
            if (data.error) {
                if (!$rootScope.user)
                    $location.path('/signin');
                else if ($rootScope.user.authority == 'Student')
                    $location.path('/student');
                else if ($rootScope.user.authority == 'teacher')
                    $location.path('/teacher');
                else
                    $location.path('/signin');
            }
            $scope.allHomework = data;
        });
        $scope.checkHomework = function (homeworkId) {
            var postData = {
                homeworkId: homeworkId,
                groups: $rootScope.user.groups
            };
            $http.post('/api/ta/checkHomework', postData).success(function (data) {
                $scope.allSubmission = data;
            });
        };

        $scope.remarkInfo = {};
        $scope.remark = function () {
            $http.post('/api/ta/remark', $scope.remarkInfo).success(function () {
                for (var i = 0; i < $scope.allSubmission.length; ++i) {
                    if ($scope.allSubmission[i]._id == $scope.remarkInfo.submissionId) {
                        $scope.allSubmission[i].remark = $scope.remarkInfo;
                        break;
                    }
                }
                $('.close').click();
            });
        };
    }]);