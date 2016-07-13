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

    $.fn.datePicker = function(options) {
        options = $.extend({
            elements: this
        }, options);

        this.datePicker = new DatePicker(options);

        return this;
    };

    $.fn.datePicker.destroy = function() {
        this.destroy();
    };
}));