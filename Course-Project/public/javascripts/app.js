var myAchievements = angular.module('myAchievements', [
    'ngRoute',
    'ngAnimate',
    'angularFileUpload',
    'userController',
    'teacherController',
    'studentController',
    'taController'
]);

myAchievements.config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/', {
        redirectTo: '/signin'
    }).when('/signin', {
        templateUrl: 'partials/signin',
        controller: 'signinCtrl'
    }).when('/signout', {
        templateUrl: 'partials/signout',
        controller: 'signoutCtrl'
    }).when('/teacher', {
        templateUrl: 'partials/teacher',
        controller: 'teacherCtrl'
    }).when('/student', {
        templateUrl: 'partials/student',
        controller: 'studentCtrl'
    }).when('/ta', {
        templateUrl: 'partials/ta',
        controller: 'taCtrl'
    }).when('/remark/:homeworkId', {
        templateUrl: 'partials/remark',
        controller: 'remarkCtrl'
    }).otherwise({
        redirectTo: '/signin'
    });
}]);
