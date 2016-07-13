
# tinyDatePicker and calendar

Looking for tiny foot print, fast, scaleable, flexible and pluggable...<br>
This 4.91KB (gZip; 11.79KB minified) small date/time picker provides a lot of hooks for developers to write plugins, calendars, agendas, etc.

##Demo
See **demo** at [dematte.at/tinyDatePicker](http://dematte.at/tinyDatePicker)

## Usage

```javascript
<script type="text/javascript" src="jqDatePicker.min.js"></script>
<script type="text/javascript">
    $('.date').datePicker(/* optinal options */); // that's it
</script>
```
```jqDatePicker.min.js``` (the jQuery version) holds all necessary data such as calendar.js, datePicker.js and jqDatePicker.js. So, it is not needed to include anything else than this file.<br>
If you need to debug things for development, you can also use ```calendar.js```, the month/week rendering module, ```datePicker.js```, the javascript UI and picker module and ```jqDatePicker.js```, the jQuery wrapper seperately.
```javascript
<script type="text/javascript" src="calendar.js"></script>
<script type="text/javascript" src="datePicker.js"></script>
<script type="text/javascript" src="jqDatePicker.js"></script>
<script type="text/javascript">
    $('.date').datePicker(/* optinal options */);
</script>
```
If you don't want a jQuery dependency just use ```datePicker.min.js``` (the javascript version):
```javascript
<script type="text/javascript" src="datePicker.min.js"></script>
<script type="text/javascript">
    var myDates = new DatePicker('.date' /* or optinal options including {elements: '.date'} */);
</script>
```
or for debugging:
```javascript
<script type="text/javascript" src="calendar.js"></script>
<script type="text/javascript" src="datePicker.js"></script>
<script type="text/javascript">
    var myDates = new DatePicker('.date' /* or optinal options including {elements: '.date'} */);
</script>
```
```datePicker.js``` and ```jqDatePicker.js``` don't render anything, don't install event listeners for the UI and don't initialize Caledar until you first use it (focusing / clicking an input field) to save memory and keep markup as small as possible.

## AMD / CommonJS wrapper
tinyDatePicker supports AMD and CommonJS import in all, the minified versions and the single fies (```calendar.js```, ```datePicker.js``` and ```jqDatePicker.js```).

```javascript
// example for requirejs configuration
requirejs.config({
    baseUrl: 'scripts',
    paths: {
        jquery: 'lib/jquery-2.2.1.min'
    },
    shim: {
        'datePicker': {
            deps: [ 'jquery' ],
            exports: 'jQuery.fn.datePicker'
        }
    }
});

// then use tinyDatePicker in your module...
(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define(['jquery', 'jqDatePicker'], function (jQuery) {
            return factory(root, jQuery);
        });
    } else {
        factory(root, root.jQuery);
    }
}(this, function(window, $){
    $('.date').datePicker(options);
}));
```

## Bower support (not yet)
tinyColorPicker will be receivable via bower soon:

```javascript
bower install tinyDatePicker
```

## jqDatePicker.js

```jqDatePicker.js``` is a jQuery plugin and uses an instance of Calendar (from ```calendar.js```) for rendering months and weeks. It passes the options to that instance, so some values might be the same when inspecting...

```javascript
$('.date').datePicker({
    // the datePicker options
    useCache: false, // disables calenda's cash for use with ranges
    elements: '.date', // the selector for the input fields using datePicker
    body: document.body, // element the picker should be depended on
    pickerAttribute: 'data-picker', // attribute used for internal date transfer
    datePickerClass: 'date-picker', // class name of the datePicker wrapper
    selectedDayClass: 'selected-day', // class name for date representing the value of input field
    disabledClass: 'disabled', // class name for disabled events
    initCallback: function(elements) {}, // callback used right after datePicker is instanciated (no calendar available)
    // the following callbacks hold standard routines that can be overwritten
    renderCallback: function(container, element, toggled) {}, // every time the picker gets toggled or redrawn (by UI action)
    renderValue: function(container, element, value) {}, // when date is picked, the value needs to be transferred to input
    readValue: function(element) {}, // when toggling the datePicker, this will pick up the value of the input field
    header: 'some HTML', // the HTML rendered before the display of the month. The following strings will be replaced:
        // {{disable-prev}}, {{prev}}, {{disable-next}}, {{next}}, {{day}}, {{month}}, {{months}}, {{year}}, {{years}}
        // look at the code (original option HTML) and it's clear what all those placeholders mean
    nextLabel: 'Next month', // text written instead of {{next}}
    prevLabel: 'Previous month', // text written instaed of {{prev}}
    minDate: '1969-01-01', // standard minimal displayable date
    maxDate: '2050-12-31', // standard maximal displayable date
    minDateAttribute: 'data-mindate', // attribute that could hold minimal displayable date data
    maxDateAttribute: 'data-maxdate', // attribute that could hold maximal displayable date data
    // classes for event listeners (click)
    nextButtonClass: 'dp-next', // next month button class name
    prevButtonClass: 'dp-prev', // previous month button class name
    selectYearClass: 'dp-select-year', // select year element class name
    selectMonthClass: 'dp-select-month', // select month element class name
    footer:'some HTML', // the HTML rendered after the display of the month. The following strings will be replaced:
        // {{hour}}, {{hours}}, {{minute}}, {{minutes}}, {{second}}, {{seconds}}, {{am-pm}}, {{am-pms}}
    timeFormat: '', // can be HH:MM:SS AM, HH:MM AM, HH:MM:SS or HH:MM 
    timeFormatAttribute:'data-timeformat', // attribute holding the timeFormat information if different from standard
    doAMPM: false, // switch for standard AM / PM rendering
    minuteSteps: 5, // steps of minutes displayed as options in {{minutes}}
    secondSteps: 10, // steps of seconds displayed as options in {{seconds}}
    AMPM: ['AM', 'PM'], // rendered strings in picker options and input fields
    // classes for event listeners (change of selects)
    selectHourClass: 'dp-select-hour', // class name of select for hours
    selectMinuteClass: 'dp-select-minute', // class name of select for minutes
    selectSecondClass: 'dp-select-second', // class name of select for seconds
    selectAMPMClass: 'dp-select-am-pm', // class name of select for AM/PM
    rangeStartAttribute: 'data-from', // attribute holding the name of the other input in a range collective (either rangeEndAttribute or name attribute)
    rangeEndAttribute: 'data-to' // attribute holding the name of the other input in a range collective

    // the Calendar options
    sundayBased: true, // reders weeks starting with monday or sunday
    renderWeekNo: false, // enables / disables rendering of week numbers
    equalHight: false, // renders extra days in next month to keep hights (row count) of all months the same
    useCache: true, // month that has been rendered will be cached on never be calculated again (also events)
    months: ['Jan', ...], // array of strings of all months in a year
    weekDays: ['Su', ...], // array of strings of week days
    workingDays: [1, 2, 3, 4, 5], // Date() based; 0 = Sun; others will be signed as week-end
    events: [], // see below for more information,
    template: { // holds all template based elements:
        start: function() {return '<table class="cal-month"><tbody><tr>'}, // callback that returns the HTML needed for the beginning of a month
        colGlue: '</tr><tr>', // HTML for connecting every week (row)
        weekNo: '<td class="">{{day}}</td>', // HTML used to render a week number
        row: '<td class="">{{day}}</td>', // HTML used to render a regular day
        end: function() {return '</tr></tbody></table>'}, // callback that returns the HTML needed for the end of a month
        today: _noop, // callback that returns the HTML for replacing {{today}} in template.row
        day: _noop, // callback that returns the HTML needed for replacing {{day}} in template.row
        event: _noop, // callback that returns the HTML needed for replacing {{event}} in template.row
    },
    todayClass: 'today', // class name for the current day
    weekEndClass: 'week-end', // class name for week-end day
    prevMonthClass: 'previous-month', // class name for day in previous month
    nextMonthClass: 'next-month', // class name for day in next month
    currentMonthClass: 'current-month', // class name for day in current month
    weekNoClass: 'week-no' // class name for week numbers
});
```
See the following section or the demos on how the callbacks work and what you can do with them...

#### Some tips

The positionCallback ...........
