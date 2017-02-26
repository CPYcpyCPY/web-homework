var blogController = angular.module('blogController', []);

// 主页
blogController.controller('homeCtrl', ['$scope', '$http', '$location', '$rootScope', 'NgTableParams',
    function($scope, $http, $location, $rootScope, NgTableParams) {
        $rootScope.title = '主页';
        $scope.blogs = [];
        $scope.displayBlog = [];
        // 获取博客数据
        $http.get('/api/allblog').success(function(data) {
            if (data.message === 'not signin') {
                $location.path('/signin');
            } else {
                $scope.blogs = data.blogs;
                $rootScope.username = data.username;
                for (var i = 0; i < $scope.blogs.length; ++i) {
                    if ($scope.blogs[i].blog.text.length > 80) {
                        $scope.blogs[i].blog.text = $scope.blogs[i].blog.text.slice(0,80) + ' ...';
                    }
                }
                // 分页表格
                $scope.myTable = new NgTableParams({count:3},
                    {counts:[], dataset:$scope.blogs});
            }
        });
        // 用于删除博客的函数
        $scope.deleteblog = function(id, index) {
            $http.get('/api/deleteblog/'+id).success(function(data) {
                $scope.blogs.splice(index, 1);
            });
        };
    }]);

// 添加博客
blogController.controller('addblogCtrl', ['$scope', '$http', '$location', '$rootScope',
    function($scope, $http, $location, $rootScope) {
        $rootScope.title = '写博客';
        $scope.blog = {};
        $scope.addBlog = function() {
            $http.post('/api/addblog', $scope.blog).success(function(data) {
                if (data.message === 'not signin')
                    $location.path('/signin');
                else
                    $location.path('/home');
            });
        };
    }]);

// 阅读更多,包含评论
blogController.controller('readmoreCtrl', ['$scope', '$http', '$location', '$routeParams', '$rootScope',
    function($scope, $http, $location, $routeParams, $rootScope) {
        $rootScope.title = '博客详情';
        $scope.blog = {};
        $scope.comments = [];
        $http.get('/api/blog/'+$routeParams.id).success(function(data) {
            if (data.message === 'not signin')
                $location.path('/signin');
            else
                $scope.blog = data.blog;
        });
        $http.get('/api/comment/'+$routeParams.id).success(function(data) {
            if (data.message === 'not signin')
                $location.path('/signin');
            else
                $scope.comments = data.comments;
        });
        $scope.commentText = '';
        // 发评论
        $scope.comment = function() {
            if ($scope.commentText.length == 0) return;
            $http.post('/api/addcomment/'+$routeParams.id, {text : $scope.commentText})
            .success(function(data) {
                if (data.message === 'not signin') {
                    $location.path('/signin');
                } else {
                    $scope.commentText = '';
                    $scope.comments.push(data.comment);
                }
            });
        };
        // 修改评论
        $scope.newComment = {};
        $scope.changeComment = function(id, index) {
            $http.post('/api/changecomment/'+id, $scope.newComment)
            .success(function(data) {
                if (data.message === 'not signin') {
                    $location.path('/signin');
                } else {
                    $scope.comments[index].comment.commentText = $scope.newComment.text;
                    $scope.comments[index].checked = false;
                    $scope.newComment.text = '';
                }
            });
        };
        // 删除评论
        $scope.deleteComment = function(id, index) {
            $http.get('/api/deletecomment/'+id).success(function(data) {
                console.log(index);
                $scope.comments.splice(index, 1);
            });
        };
    }]);

// 修改博客内容
blogController.controller('changeblogCtrl', ['$scope', '$http', '$location', '$routeParams', '$rootScope',
    function($scope, $http, $location, $routeParams, $rootScope) {
        $rootScope.title = '修改博客';
        $scope.blog = {};
        $http.get('/api/blog/'+$routeParams.id).success(function(data) {
            if (data.message === 'not signin')
                $location.path('/signin');
            else
                $scope.blog = data.blog.blog;
        });
        $scope.change = function() {
            $http.post('/api/changeblog/'+$routeParams.id, $scope.blog).success(function(){
                $location.path('/home');
            })
        };
    }]);
