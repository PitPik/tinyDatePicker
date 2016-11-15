(function (root, factory) { // 8.65 KB, 4.09 KB, 1.85 KB
	if (typeof exports === 'object') {
		module.exports = factory(root);
	} else if (typeof define === 'function' && define.amd) {
		define('calendar', [], function () {
			return factory(root);
		});
	} else {
		root.Calendar = factory(root);
	}
}(this, function(window, undefined) {
	'use strict';

	var _noop = function() {return ''},
		Calendar = function(options) {
			this.options = {
				sundayBased: true,
				renderWeekNo: false,
				renderDaysOfWeek: true,
				equalHight: false,
				useCache: true,

				months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
					'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
				weekDays: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
				workingDays: [1, 2, 3, 4, 5], // Date() based; 0 = Sun
				events: [], // [{start: '2016-12-28 00:00', end: '', at: '', className: '', ...}, ...],

				template: {
					start: function() {return '<table class="cal-month">{{days}}<tbody><tr>'},
					daysOfWeekStart: '<thead><tr>',
					daysOfWeek: '<th class="">{{day}}</th>',
					daysOfWeekEnd: '</tr></thead>',
					daysOfWeekHead: '',
					colGlue: '</tr><tr>',
					weekNo: '<td class="">{{day}}</td>',
					row: '<td class="">{{day}}</td>',
					end: function() {return '</tr></tbody></table>'},
					today: _noop, // replaces {{today}}
					day: _noop, // replaces {{day-event}}
					event: _noop, // replaces {{event}}
				},

				todayClass: 'today',
				weekEndClass: 'week-end',
				weekDayClass: 'week-day',
				prevMonthClass: 'previous-month',
				nextMonthClass: 'next-month',
				currentMonthClass: 'current-month',
				weekNoClass: 'week-no'
			};

			initCalendar(this, options || {});
		},
		offset = '',
		initCalendar = function(_this, options) {
			for (var option in options) {
				var opt = options[option],
					start = '';

				if (option === 'events') {
					for (var n = opt.length; n--; ) {
						convertEvent(opt[n], opt[n]._id || n);
					}
				}
				if (option === 'template') {
					for (var item in opt) {
						_this.options[option][item] = opt[item];
					}
				} else {
					_this.options[option] = opt;
				}
			}
			offset = (-(new Date().getTimezoneOffset() / 60) + '')
				.replace(/([-]*)(\d)(\d*)/, function($1, $2, $3, $4) {
					return ($2 || '+') + ($4 ? $3 + $4 : '0' + $3);
				}) + ':00';
			_this.html = {};
		};

	Calendar.prototype.addEvent = function(event, id) {
		this.options.events.push(convertEvent(event, id));
	}

	Calendar.prototype.removeEvent = function(id) {
		var events = this.options.events;

		for (var n = events.length; n--; ) {
			if (events[n]._id === id) {
				events.splice(n, 1);
			}
		}
	}

	Calendar.prototype.getMonth = function(year, month, week) {
		var date = new Date(+year, +month - 1, 1),
			key = year + '-' + month + (week ? '-' + week : ''),
			html = this.html[key] || _assembleMonth(date, week, this);

		if (this.options.useCache) {
			this.html[key] = html;
		}

		return {
			html: html,
			date: key
		}
	};

	Calendar.prototype.getWeekNumber = _getWeekNumber;
	Calendar.prototype.convertDateString = _convertDateString;

	/* ---------------------- */

	function convertEvent(event, id) {
		var start = event.at || event.start;

		event._start = start ? _convertDateString(start).valueOf() : -1e15;
		event._end = event.at ? _convertDateString(start, true).valueOf() :
			event.end ? _convertDateString(event.end,
				event.end.split(' ')[1] ? false : true).valueOf() : 1e15;
		event._id = id;
		return event;
	}

	function _removeWhitespace(string) { // maybe without...
		return string.replace(/(:?^\s+|\s+$)/g, '').replace(/(?:\s\s+)/g, ' ');
	}

	function _convertDateString(string, end) {
		var parts = string.split(' '),
			time = parts[1] || (end ? '23:59:59.999' : '00:00:00');

		return new Date(Date.parse(parts[0] + 'T' + time + offset));
	}

	function _getWeekNumber(date) { // ISO 8601
		var day = new Date(date.getDate && date.valueOf() || date),
			weekDay = (date.getDay() + 6) % 7,
			firstThursday;

		day.setDate(day.getDate() - weekDay + 3);
		firstThursday = day.valueOf();
		day.setMonth(0, 1);
		if (day.getDay() !== 4) {
			day.setMonth(0, 1 + ((4 - day.getDay()) + 7) % 7);
		}

		return 1 + Math.ceil((firstThursday - day) / 604800000);
	}

	function _renderDaysOfWeek(options) {
		var template = options.template,
			dayOfWeek = 0,
			col = [];

		for (var n = options.renderWeekNo ? -1 : 0; n < 7; n++) { // week days
			dayOfWeek = n + (options.sundayBased ? 0 : (n === 6 ? -6 : 1));
			col.push(template.daysOfWeek.replace(/class="(.*?)"/, function($1, $2) {
				return 'class="' + _removeWhitespace($2 + ' ' +
					(n < 0 ? '' : options.weekDayClass || '') + ' ' +
					(n < 0 ? '' : (options.workingDays.indexOf(dayOfWeek) === -1 ?
					options.weekEndClass : ''))) + '"';
			}).replace(/{{day}}/g, n < 0 ? template.daysOfWeekHead :
				options.weekDays[dayOfWeek]));
		}
		return template.daysOfWeekStart + col.join('') + template.daysOfWeekEnd;
	}

	function _assembleMonth(date, weekNo, _this) { // use day for week display
		var delta = (delta = date.getDay() - // data.date = 1st of month
				!_this.options.sundayBased) < 0 ? 7 + delta : delta,
			options = _this.options,
			rows = options.equalHight ? 6 : Math.ceil((delta +
				new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()) / 7),
			template = options.template,
			renderWeekNo = options.renderWeekNo,
			today = new Date().toDateString(),
			row = [],
			col = [],
			isWeekNo = false,
			isPreviousMonth = false,
			displayedDay = 0,
			currentDate = date,
			currentMonth = currentDate.getMonth(),
			currentYear = currentDate.getFullYear(),
			currentDateValue = 0,
			currentDateValuePlusDay = 0,
			isToday = false,
			eventCollection = [],
			events = options.events,
			displayedMonth = null,
			className = [],
			_count = 0;

		currentDate.setDate(-delta); // days in prev. month
		for (var n = 0; n < rows; n++) { // weeks
			if (weekNo && weekNo !== n + 1) { // skip weeks
				currentDate.setDate(currentDate.getDate() + 7);
				continue;
			}
			row = [];
			for (var m = 0, cols = renderWeekNo ? 8 : 7; m < cols; m++) { // days
				currentDate.setDate(currentDate.getDate() + 1);
				isWeekNo = renderWeekNo && m === 0;
				if (!isWeekNo) { // only to speed it up
					displayedDay = currentDate.getDate();
					displayedMonth = currentDate.getMonth();
					isToday = (currentDate.toDateString() === today);
					isPreviousMonth = displayedMonth < currentMonth &&
						!(displayedMonth === 0 && currentMonth === 11) || // dec
						(displayedMonth === 11 && currentMonth === 0) // jan
					if (events) { // collecting events
						eventCollection = []; // reset
						currentDateValue = currentDate.valueOf(); // 00:00:00
						currentDateValuePlusDay = currentDateValue + 86399000;
						className = [];
						for (var x = 0, y = events.length; x < y; x++) { // can this be optimized?
							if ((events[x]._start <= currentDateValue &&
									events[x]._end >= currentDateValuePlusDay) ||
									(events[x]._start >= currentDateValue &&
									events[x]._end <= currentDateValuePlusDay)) {
								eventCollection.push(events[x]);
								className.push(events[x].className || '');
							}
						}
					}
				}

				row.push(template[isWeekNo ? 'weekNo' : 'row'].
					replace(/class="(.*?)"/, function($1, $2) { // revisit
						return 'class="' + _removeWhitespace($2 + ' ' +
						(isWeekNo ? options.weekNoClass : // week no
						(displayedMonth === currentMonth ? options.currentMonthClass : // day type
							isPreviousMonth ? options.prevMonthClass :
							options.nextMonthClass) + ' ' +
							(className.join(' ').replace(/(\b\w+\s+)*\1/g, "$1") || '') + ' ' + // events
						(isToday ? options.todayClass : '') + ' ' + // today
						(options.workingDays.indexOf(currentDate.getDay()) === -1 ? // working day
							options.weekEndClass : ''))) + '"'}).
					replace(/{{day}}/g, isWeekNo ? _getWeekNumber(currentDate) : displayedDay).
					replace(/{{day-event}}/g, displayedDay && template.day.call(
						_this, displayedDay, currentDate, eventCollection) || displayedDay).
					replace(/{{month}}/g, displayedMonth + 1).
					replace(/{{year}}/g, currentDate.getFullYear()).
					replace(/{{today}}/g, isToday && template.today.call(
						_this, displayedDay, currentDate) || '').
					replace(/{{event}}/g, eventCollection.length && template.event.call(
						_this, displayedDay, currentDate, eventCollection) || ''));

				if (isWeekNo) { // set back
					currentDate.setDate(currentDate.getDate() - 1);
				}
			}
			col.push(row.join(''));
		}

		return template.start.call(_this, currentMonth + 1, currentYear, weekNo).
				replace('{{days}}', options.renderDaysOfWeek ? _renderDaysOfWeek(options) : '') +
			col.join(template.colGlue) +
			template.end.call(_this, currentMonth + 1, currentYear, weekNo);
	}

	return Calendar;
}));