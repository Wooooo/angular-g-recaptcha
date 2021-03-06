/* global
    angular,
    $greLanguageCodes,
    $grecaptchaProvider,
    grecaptchaDirective,
    TinyEmitterFactory
*/

/**
 * @ngdoc overview
 * @name wo.grecaptcha
 * 
 * @description
 * A module for grecaptcha
 */
var app = angular.module('wo.grecaptcha', []) /*jshint ignore:line */
.constant('$greLanguageCodes', $greLanguageCodes)
.provider('$grecaptcha', $grecaptchaProvider)
.directive('grecaptcha', grecaptchaDirective)
.factory('TinyEmitterFactory', TinyEmitterFactory);