var blogApp = angular.module('blogApp', [
    'ngRoute',
    'ngAnimate',
    'ngTable',
    'userController',
    'adminController',
    'blogController'
]);

blogApp.config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/', {
        redirectTo: '/signin'
    }).when('/signin', {
        templateUrl: 'partials/signin',
        controller: 'signinCtrl'
    }).when('/signup', {
        templateUrl: 'partials/signup',
        controller: 'signupCtrl'
    }).when('/detail', {
        templateUrl: 'partials/detail',
        controller: 'detailCtrl'
    }).when('/signout', {
        templateUrl: '/partials/signout',
        controller: 'signoutCtrl'
    }).when('/home', {
        templateUrl: 'partials/home',
        controller: 'homeCtrl'
    }).when('/addblog', {
        templateUrl: 'partials/addblog',
        controller: 'addblogCtrl'
    }).when('/more/:id', {
        templateUrl: 'partials/readmore',
        controller: 'readmoreCtrl'
    }).when('/changeblog/:id', {
        templateUrl: 'partials/changeblog',
        controller: 'changeblogCtrl'
    }).when('/admin', {
        templateUrl: 'partials/admin',
        controller: 'adminCtrl'
    }).otherwise({
        redirectTo: '/home'
    });
}]);
