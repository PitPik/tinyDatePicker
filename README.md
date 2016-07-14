
# tinyDatePicker and calendar

Looking for tiny foot print, fast, scaleable, flexible and pluggable...<br>
This 4.91KB (gZip; 11.79KB minified) small date/time picker provides a lot of hooks for developers to write plugins, calendars, agendas, booking systems, etc. This is not only a picker but a set of modules that can be used to build a date/agenda based app.

##Demo
See **demo** at [dematte.at/tinyDatePicker](http://dematte.at/tinyDatePicker)

## Usage

```javascript
<script type="text/javascript" src="jqDatePicker.min.js"></script>
<script type="text/javascript">
    $('.date').datePicker([options]); // that's it
</script>
```
```jqDatePicker.min.js``` (the jQuery version) holds all necessary files such as calendar.js, datePicker.js and jqDatePicker.js. So, it is not needed to include anything else than this file.<br>
If you need to debug things for development, you can also use ```calendar.js```, the month/week rendering module, ```datePicker.js```, the javascript UI and picker module and ```jqDatePicker.js```, the jQuery wrapper separately.
```javascript
<script type="text/javascript" src="calendar.js"></script>
<script type="text/javascript" src="datePicker.js"></script>
<script type="text/javascript" src="jqDatePicker.js"></script>
<script type="text/javascript">
    $('.date').datePicker([options]);
</script>
```
If you don't want a jQuery dependency just use ```datePicker.min.js``` (the javascript version):
```javascript
<script type="text/javascript" src="datePicker.min.js"></script>
<script type="text/javascript">
    var myDates = new DatePicker('.date', [options]);
</script>
```
or for debugging:
```javascript
<script type="text/javascript" src="calendar.js"></script>
<script type="text/javascript" src="datePicker.js"></script>
<script type="text/javascript">
    var myDates = new DatePicker('.date', [options]);
</script>
```
```datePicker.js``` doesn't render anything or installs event listeners for the UI and doesn't initialize Caledar until you first use it (focusing / clicking an input field) to save memory and keep markup as small as possible.

The standard date/time formats datePicker works with is: 'YYYY-MM-DD HH:MM:SS AM' whereas -DD is optional if no time is set and :SS, AP/PM and the time as such is also optional. It is possible to only set the time though too. Then datePicker works as a time picker only. See also demo on how to use data attributes in input fields to pick up some options from there.

See the Demos at ```/demo/index.html``` or [dematte.at/tinyDatePicker](http://dematte.at/tinyDatePicker) for more examples on how ```calendar.js``` and ```datePicker.js``` can be used. You can also build a whole agenda app with only a fiew options added...

## AMD / CommonJS wrapper
tinyDatePicker supports AMD and CommonJS import in all, the minified versions and the single files (```calendar.js```, ```datePicker.js``` and ```jqDatePicker.js```).

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
    useCache: false, // disables calendar's cash for use with ranges
    elements: '.date', // the selector for the input fields using datePicker
    body: document.body, // element the picker should be depended on
    pickerAttribute: 'data-picker', // attribute used for internal date transfer
    datePickerClass: 'date-picker', // class name of the datePicker wrapper
    selectedDayClass: 'selected-day', // class name for date representing the value of input field
    disabledClass: 'disabled', // class name for disabled events
    initCallback: function(elements) {}, // callback used right after datePicker is instantiated (no calendar available)
    // the following callbacks hold standard routines that can be overwritten
    renderCallback: function(container, element, toggled) {}, // every time the picker gets toggled or redrawn (by UI action)
    renderValue: function(container, element, value) {}, // when date is picked, the value needs to be transferred to input
    readValue: function(element) {}, // when toggling the datePicker, this will pick up the value of the input field
    header: 'some HTML', // the HTML rendered before the display of the month. The following strings will be replaced:
        // {{disable-prev}}, {{prev}}, {{disable-next}}, {{next}}, {{day}}, {{month}}, {{months}}, {{year}}, {{years}}
        // look at the code (original option HTML) and it's clear what all those placeholders mean
    nextLabel: 'Next month', // text written instead of {{next}}
    prevLabel: 'Previous month', // text written instead of {{prev}}
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
    sundayBased: true, // renders weeks starting with Monday or Sunday
    renderWeekNo: false, // enables / disables rendering of week numbers
    equalHight: false, // renders extra days in next month to keep heights (row count) of all months the same
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
        day: _noop, // callback that returns the HTML needed for replacing {{day-event}} in template.row
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

## datePicker.js
```datePicker.js``` works the same way as ```jqDatePicker.js```. It's the javascript only version and has the same options. Only the initialization works differently (See **Usage**)

## Methods

#### datePicker.js

```destroy()```: removes all event listeners, detaches the markup from the document and removes some variables.

#### calendar.js

```addEvent(event, id)```: Adds an event to the list of events and automatically converts the dates to the internal format. See format of events below (**Some tips**). ```id``` marks the events for easy removal later on. Doesn't necessarily be unique.

```removeEvent(id)```: Removes above described events marked by the id attribute.

```getMonth(year, month, week)```: Returns markup described by the template options from a given year / month. If optional week is set (relative to month) you'll only get this week.

```getWeekNumber(date)```: Returns the number of the week described by ISO 8601. ```date``` can be a date object, a number as milliseconds or a string that converts to a date if passed to ```Date```.

```convertDateString(string, end)```: Receives a string ```string```like 'YYYY-MM-DD HH:MM:SS' where the time is optional. ```end``` is a boolean that adds ```23:59:59``` to the date to make it the very end of the day. Returns a date in milliseconds.

See the following section or the demos on how the callbacks work and what you can do with them...

#### Some tips
**Callbacks** from **datePicker.js**

All callbacks deliver ```this``` as a reference to the instance of **DatePicker()**

```initCallback: function(elements) {}``` Is called right after DatePicker() is initialized. Calendar() is not available yet. elements is the list of all elements (for example ```$('.date')```) that are listening to the click or focus events.

```renderCallback: function(container, element, toggled) {}``` Is called every time the picker gets visible, hidden or redrawn. ```toggled``` is true if the picker was just toggled on or off. To determine if it was turned on or off you can read the attribute ```this.isOpen```.

```renderValue: function(container, element, value) {}``` Is a method that gets called when the user clicked on a date on the picker. It gives you access to the ```container```, the picker UI, ```element```, the current input field and ```value```, the choosen value in the format ```YYYY-MM-DD HH:MM:SS AM``` where as -DD, :SS and AM are optional.

```readValue: function(element) {}``` Method called when the picker opens and picks up the value where as ```element``` is the input field that was focused.

Other **Callbacks** from **calendar.js**

```calendar.js``` has some callbacks in its templating engine to return a string that replaces a certain string in the template or get called in the beginning or end of the rendering.

```start: function() {}```, gets called befor the month/week gets rendered. Use this, for example to render the start of a table...

```end: function() {}```, Same as above, just at the end of the rendering.

```today: function() {}```, replaces {{today}} in your ```row``` template

```day: function() {}```, replaces {{day-event}} in your ```row``` template

```event: function() {}```, replaces {{event}} in your ```row``` template

All callbacks are called in the context of ```this```, the instance of its constructor. So, inspect the instance to discover some more helpful properties of the model such as ```date```, the rendered date, ```currentDate``` the value of the current input field, ```currentInput``` and ```currentPartner```, the input field and a possible connected input field for ranges, etc.
