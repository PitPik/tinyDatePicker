(function(window, events, undefined){
	'use strict';

	// console.time('Calendar incl. init');

	/* ------------------------------------------------------ */
	/* -------- initial options for yearly calendar  -------- */
	/* ------------------------------------------------------ */
	var options = {
			weekDays: ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'],
			months: ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni',
				'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'],

			sundayBased: false,
			renderWeekNo: true,
			weekDayClass: 'week-day', // not standard: used in template.start
			weekDayRowHead: '',
			template: {
				row: '<td class=""><span class=""{{event}} data-day=\'{"day":"{{day}}", "month":"{{month}}", "year":"{{year}}"}\'>{{day-event}}{{today}}</span></td>',
				start: function(month, year) { // rendering week days in table header
					var options = this.options,
						weekDayRow = '<th class="">{{day}}</th>',
						row = [];

					if (options.renderWeekNo) { // week number head
						row.push(weekDayRow.replace(/{{day}}/g, options.weekDayRowHead));
					}

					for (var n = 0, week = 0; n < 7; n++) { // week days
						week = n + (options.sundayBased ? 0 : (n === 6 ? -6 : 1));
						row.push(weekDayRow.replace(/class="(.*?)"/, function($1, $2) {
							return 'class="' + options.weekDayClass + ' ' +
								(options.workingDays.indexOf(week) === -1 ?
								options.weekEndClass : '') + '"';
						}).replace(/{{day}}/g, options.weekDays[week]));
					}
					return '<div class="month">' + options.months[month - 1] + ' - ' + year + '</div>' +
						'<table class="cal-month"><thead><tr>' +
						row.join('') +
						'</tr></thead><tbody><tr>';
				},
				event: function(day, date, event) { // rendering events
					var text = [],
						// container = [],
						// jsonText = [],
						uuids = [],
						someExtra = '';

					for (var n = 0, m = event.length; n < m; n++) {
						event[n].text && text.push('- ' + event[n].text);

						uuids.push(event[n]._id);

						// to JSON string...
						// jsonText = []; // reset
						// for (var x in event[n]) {
						// 	jsonText.push('"' + x + '": "' + event[n][x] + '"');
						// }
						// container.push('{' + jsonText.join(', ') + '}');

						if (event[n].extra) { // extend functionality...
							someExtra = event[n].extra;
						}
					}
					text = text.join("\n");

					return text ? ' title="' + text + '"' +
						' data-uuids=\'[' + uuids.join(', ') + ']\'' +
						// ' data-events=\'[' + container.join(', ') + ']\'' +
						(someExtra ? ' data-name="' + someExtra + '"' : '') : '';
				},
				today: function(day, date) { // rendering today; just for fun...
					return '<span class="today-icon">+</span>';
				},
				day: function(day, date, event) { // rendering every day
					var text = [];

					for (var n = 0, m = event.length; n < m; n++) {
						text.push('<span class="single-event">' + event[n].text + '</span>');
					}
					return day + '. ' + this.options.months[date.getMonth()] +
						text.join('');
				}
			},
			events: events // external data... see events.js
		};

	// draw yearly calendar
	var myMonthCalendar = window.myMonthCalendar = new Calendar(options);
	var div = document.createElement('div');
	div.className = 'cal-wrapper month-cal';
	div.innerHTML = myMonthCalendar.getMonth(2016, 6).html;
	document.body.appendChild(div);

})(window, window.events);