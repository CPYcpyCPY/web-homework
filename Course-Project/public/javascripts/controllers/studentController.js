var studentController = angular.module('studentController', []);

studentController.controller('studentCtrl', ['$scope', '$http', '$location', 'FileUploader', '$rootScope',
    function ($scope, $http, $location, FileUploader, $rootScope) {
        $scope.panelBehave = {
            0: 'panel-info',
            1: 'panel-primary',
            2: 'panel-default'
        };
        $scope.hwStatus = {
            0: 'future',
            1: 'present',
            2: 'end'
        };
        $scope.labelBehave = {
            0: 'label-info',
            1: 'label-success',
            2: 'label-default'
        };
        $scope.allSubmission = {};
        $scope.allHomework = [];
        var homeworkList = ['hw1', 'hw2', 'hw3', 'hw4', 'hw5', 'hw6', 'hw7', 'hw8', 'hw9', 'hw10'];
        var scoreList = [];
        var rankingList = [];
        var constructCharts = false;
        $scope.refreshSubmission = function() {
            $http.get('/api/student/allSubmission').success(function (data) {
                for (var i = 0; i < data.length; ++i) {
                    $scope.allSubmission[data[i].homeworkId] = data[i];
                    if (data[i].remark.score)
                        scoreList.push(parseInt(data[i].remark.score));
                    if (data[i].remark.rank)
                        rankingList.push(parseInt(data[i].remark.rank));
                }
                if (!constructCharts) {// 构建分数排名折线图表
                    constructCharts = true;
                    $(".myScoreRecord").highcharts({
                        title: { text: 'My Score' },
                        credits: { enabled: false },
                        xAxis: { categories: homeworkList },
                        yAxis: {
                            title: { text: 'Score' },
                            max: 100,
                            min: 0,
                            plotLines: [{value: 0,width: 1,color: '#808080'}]
                        },
                        series: [{
                            name: 'Score',
                            data: scoreList
                        }]
                    });
                    $(".myRankRecord").highcharts({
                        title: { text: 'My Rank' },
                        credits: { enabled: false },
                        xAxis: { categories: homeworkList },
                        yAxis: {
                            title: { text: 'Rank' },
                            reversed: true,
                            max: 30,
                            min: 1
                        },
                        series: [{
                            name: 'Rank',
                            color: '#EF6C00',
                            data: rankingList
                        }]
                    });
                }
            });
        };
        $http.get('/api/student/allHomework').success(function (data) {
            if (data.error) {
                if (!$rootScope.user)
                    $location.path('/signin');
                else if ($rootScope.user.authority == 'teacher')
                    $location.path('/teacher');
                else if ($rootScope.user.authority == 'TA')
                    $location.path('/ta');
                else
                    $location.path('/signin');
            }
            $scope.allHomework = data;
        });
        $scope.refreshSubmission();

        $scope.submission = {
            github: "",
            message: ""
        };
        $scope.showForm = function(homeworkId) {
            $scope.submission.homeworkId = homeworkId;
        };
        $scope.uploader = new FileUploader({
            removeAfterUpload: true,
            url: '/api/student/upload'
        });
        // 提交作业
        $scope.submit = function() {
            $http.post('/api/student/submit', $scope.submission).success(function (data) {
                if ($scope.uploader.queue[0])
                    $scope.uploader.queue[0].formData.push(
                        {submissionId:data._id, file:"src"});
                if ($scope.uploader.queue[1])
                    $scope.uploader.queue[1].formData.push(
                        {submissionId:data._id, file:"img"});
                $scope.uploader.uploadAll();
            });
        };
        // 文件发送完毕之后关闭提交表单，更新提交记录
        // 文件发送完毕之后重置uploader,已实现!!!
        // 否则无法在本页面上再次提交文件名与上次提交相同的文件
        // 除非退出当前页面再重新进来, 或者提交不同文件名的文件
        $scope.uploader.onCompleteAll = function() {
            $scope.refreshSubmission();
            $scope.uploader.progress = 0;
            $('.close').click();
            var input = [$('#srcFile'), $('#imgFile')];
            input[0] = $('#srcFile').val('').clone(true);
            input[1] = $('#imgFile').val('').clone(true);
        };
    }]);

// 评论互评
studentController.controller('remarkCtrl', ['$scope', '$http', '$location', 'FileUploader', '$routeParams', '$rootScope',
    function ($scope, $http, $location, FileUploader, $routeParams, $rootScope) {
        // 分页切换
        $('#othersR a').click(function (e) {
            e.preventDefault();
            $(this).tab('show');
        });
        $('#myR a').click(function (e) {
            e.preventDefault();
            $(this).tab('show');
        });
        // 获取最终评分情况
        $scope.myFinalScore = {};
        $http.get('/api/student/myFinalScore/'+$routeParams.homeworkId).success(function (data) {
            if (data.error) {
                if (!$rootScope.user)
                    $location.path('/signin');
                else if ($rootScope.user.authority == 'teacher')
                    $location.path('/teacher');
                else if ($rootScope.user.authority == 'TA')
                    $location.path('/ta');
                else
                    $location.path('/signin');
            }
            $scope.myFinalScore = data;
        });
        // 获取他人给我评分情况
        $scope.othersRemarks = [];
        $http.get('/api/student/othersRemarksToMe/'+$routeParams.homeworkId).success(function (data) {
            $scope.othersRemarks = data;
        });
        // 获取我需要去评分的作业
        $scope.homeworksIShouldRemark = [];
        $http.get('/api/student/homeworksIShouldRemark/'+$routeParams.homeworkId).success(function (data) {
            $scope.homeworksIShouldRemark = data;
        });
        // 这次作业中我的所有对外评价
        $scope.allMyRemarksToOthers = [];
        $http.get('/api/student/allMyRemarksToOthers/'+$routeParams.homeworkId).success(function (data) {
            $scope.allMyRemarksToOthers = data;
        });
        // 提交我对他人作业的评论
        $scope.myRemarkToOthers = {};
        var postData = {};
        $scope.showForm = function (submissionId, user) {
            postData.submissionId = submissionId;
            postData.remarkWhom = user;
            postData.homeworkId = $routeParams.homeworkId;
            for (var i = 0; i < $scope.allMyRemarksToOthers.length; ++i) {
                if ($scope.allMyRemarksToOthers[i].submissionId == submissionId) {
                    $scope.myRemarkToOthers.score = $scope.allMyRemarksToOthers[i].remarkInfo.score;
                    $scope.myRemarkToOthers.message = $scope.allMyRemarksToOthers[i].remarkInfo.message;
                }
            }
        };
        $scope.submitMyRemark = function() {
            postData.remarkInfo = $scope.myRemarkToOthers;
            $http.post('/api/student/myRemarkToOthers', postData).success(function (data) {
                var find = false;
                // 更新我的评论
                for (var i = 0; i < $scope.allMyRemarksToOthers.length; ++i) {
                    if ($scope.allMyRemarksToOthers[i].submissionId === data.submissionId) {
                        $scope.allMyRemarksToOthers[i] = data;
                        find = true;
                        break;
                    }
                }
                if (!find)
                    $scope.allMyRemarksToOthers.push(data);
                // 清空表单并关闭提交页面
                $scope.myRemarkToOthers = {};
                postData = {};
                $(".close").click();
            });
        };
    }]);