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
        var elements = [];

        this.each(function(idx, elm) { // prevent cross references
            elements.push(elm);
        });
        this.datePicker = new DatePicker(elements, options);

        return this;
    };

    $.fn.datePicker.destroy = function() {
        this.datePicker.destroy();
    };
}));