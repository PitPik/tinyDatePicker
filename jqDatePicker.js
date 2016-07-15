(function (root, factory) {
    if (typeof exports === 'object') {
        module.exports = factory(root, require('jquery'), require('datePicker'));
    } else if (typeof define === 'function' && define.amd) {
        define(['jquery', 'datePicker'], function (jQuery, DatePicker) {
            return factory(root, jQuery, DatePicker);
        });
    } else {
        factory(root, root.jQuery, root.DatePicker);
    }
}(this, function(window, $, DatePicker, undefined) {
    'use strict';

    // this is just a wrapper to use DatePicker as jQuery plugin
    $.fn.datePicker = function(options) {
        this.datePicker = new DatePicker(this, options); // .filter('*')

        return this;
    };
}));