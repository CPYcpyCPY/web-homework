var teacherController = angular.module('teacherController', []);

teacherController.controller('teacherCtrl', ['$scope', '$http', '$location', '$rootScope',
    function ($scope, $http, $location, $rootScope) {
        $scope.showPage = [false, false, false, false, false];
        $scope.show = function(pageIndex) {
            for (var i = 0; i < 5; ++i)
                $scope.showPage[i] = false;
            $scope.showPage[pageIndex] = true;
        };

        $scope.currentTAs = [];
        $scope.currentStudents = [];
        $scope.currentHomeworks = [];
        $http.get('/api/teacher/getAll/TA').success(function (data) {
            if (data.error) {
                if (!$rootScope.user)
                    $location.path('/signin');
                else if ($rootScope.user.authority == 'Student')
                    $location.path('/student');
                else if ($rootScope.user.authority == 'TA')
                    $location.path('/ta');
                else
                    $location.path('/signin');
            } else {
                $scope.currentTAs = data;
            }
        });
        $http.get('/api/teacher/getAll/Student').success(function (data) {
            if (data.error) {
                if (!$rootScope.user)
                    $location.path('/signin');
                else if ($rootScope.user.authority == 'Student')
                    $location.path('/student');
                else if ($rootScope.user.authority == 'TA')
                    $location.path('/ta');
                else
                    $location.path('/signin');
            } else {
                $scope.currentStudents = data;
            }
        });
        $http.get('/api/teacher/getAllHomework').success(function (data) {
            if (data.error) {
                $location.path('/signin');
            } else {
                $scope.currentHomeworks = data;
            }
        });

        $scope.TA = {};
        $scope.homework = {};
        $scope.student = {};
        // 添加助教
        $scope.addTA = function() {
            var postData = {
                info: $scope.TA,
                authority: 'TA'
            };
            $http.post('/api/teacher/addUser', postData).success(function (data) {
                $scope.currentTAs.push(data);
                $scope.TA = {};
            });
        };
        // 添加学生
        $scope.addStudent = function() {
            var postData = {
                info: $scope.student,
                authority: 'Student'
            };
            $http.post('api/teacher/addUser', postData).success(function (data) {
                $scope.currentStudents.push(data);
                $scope.student = {};
            });
        };
        // 发布作业
        $scope.publishHomework = function() {
            console.log($scope.homework);
            $http.post('api/teacher/publishHomework', $scope.homework).success(function (data) {
                $scope.currentHomeworks.push(data);
                $scope.homework = {};
            });
        };
        // 查看作业完成情况
        $scope.allSubmission = [];
        $scope.finishDetail = function (homeworkId) {
            $http.get('/api/teacher/finishDetail/'+homeworkId).success(function (data) {
                $scope.allSubmission = data;
            });
        };
        // 教师重改分数
        $scope.remarkInfo = {};
        $scope.remark = function () {
            $http.post('/api/teacher/remark', $scope.remarkInfo).success(function () {
                for (var i = 0; i < $scope.allSubmission.length; ++i) {
                    if ($scope.allSubmission[i]._id == $scope.remarkInfo.submissionId) {
                        $scope.allSubmission[i].remark = $scope.remarkInfo;
                        break;
                    }
                }
                $('.close').click();
            });
        };
        // 作业最终分数确定
        $scope.confirmScore = function(submissionId) {
            $http.get('/api/teacher/confirmScore/'+submissionId).success(function () {
                for (var i = 0; i < $scope.allSubmission.length; ++i) {
                    if ($scope.allSubmission[i]._id == submissionId) {
                        $scope.allSubmission[i].isConfirm = true;
                        break;
                    }
                }
            });
        };
        // 自动添加A班学生
        $scope.autoAddStudents = function() {
            var group = 0, i = 14330000, j = 0;
            var timer = setInterval(function() {
                if (parseInt(j%2) === 0)
                    ++group;
                var sid = i.toString();
                $scope.student.username = sid;
                $scope.student.name = '学生'+sid[5]+sid[6]+sid[7];
                $scope.student.password = sid;
                $scope.student.groups = group.toString();
                $scope.student.class = 'A';
                $scope.addStudent();
                ++i; ++j;
                if (i === 14330010)
                    clearInterval(timer);
            }, 500);
        };
        // 自动添加A班TA
        $scope.autoAddTA = function() {
            var groups = [[1,2,3], [4,5]], i = 13330000, j = 0;
            var timer = setInterval(function() {
                var sid = i.toString();
                $scope.TA.username = sid;
                $scope.TA.name = '助教'+sid[5]+sid[6]+sid[7];
                $scope.TA.password = sid;
                $scope.TA.groups = '['+groups[j].toString()+']';
                $scope.TA.class = 'A';
                $scope.addTA();
                ++i;
                ++j;
                if (i === 13330002)
                    clearInterval(timer);
            }, 500);
        };
        // 一键排名
        $scope.ranking = function(homeworkId) {
            $http.get('/api/teacher/ranking/'+homeworkId).success(function (data) {
                //...
            });
        };
        // 修改作业状态
        $scope.changeHomeworkStatus = function(homeworkId) {
            $http.get('/api/teacher/changeHomeworkStatus/'+homeworkId).success(function (data) {
                for (var i = 0; i < $scope.currentHomeworks.length; ++i) {
                    if ($scope.currentHomeworks[i]._id == homeworkId) {
                        $scope.currentHomeworks[i].status = data;
                    }
                }
            });
        };
    }]);
