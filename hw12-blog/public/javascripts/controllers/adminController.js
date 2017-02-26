var adminController = angular.module('adminController', []);

// 管理员
adminController.controller('adminCtrl', ['$scope', '$http', '$location', '$rootScope',
    function($scope, $http, $location, $rootScope) {
        $rootScope.title = '网站管理';
        $scope.allUser = [];
        $scope.onesblog = {};
        $scope.comments = [];

        // 获取网站已注册的用户
        $http.get('/api/admin/alluser').success(function(data) {
            if (data.message === 'not admin')
                $location.path('/home');
            else
                $scope.allUser = data.users;
        });

        // 查看某个用户的博客
        $scope.watch = function(username) {
            $http.get('/api/admin/onesblog/'+username).success(function(data) {
                $scope.onesblog = {
                    username:username,
                    blogs:data.blogs
                };
            });
        };

        // 查看某篇博客的评论
        $scope.seeComment = function(blogId) {
            $http.get('/api/comment/'+blogId).success(function(data) {
                $scope.comments = data.comments;
            });
        };

        // 隐藏博客
        $scope.hideBlog = function(id, index) {
            $http.get('/api/admin/hideblog/'+id).success(function() {
                $scope.onesblog.blogs[index].blog.text = '该内容已被管理员隐藏';
            });
        };

        // 隐藏评论
        $scope.hideComment = function(id, index) {
            $http.get('/api/admin/hidecomment/'+id).success(function() {
                $scope.comments[index].comment.commentText = '该内容已被管理员隐藏';
            });
        };
    }]);
