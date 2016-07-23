(function(window, events, undefined){
	'use strict';

	// console.time('Calendar incl. init');

	/* ------------------------------------------------------ */
	/* -------  initial options for yearly calendar  -------- */
	/* ------- same options as defined in index.html -------- */
	/* ------------------------------------------------------ */
	var options = {
			weekDays: ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'],
			months: ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni',
				'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'],

			sundayBased: false,
			renderWeekNo: true,
			equalHight: true,
			template: {
				row: '<td class=""><span class=""{{event}} data-day=\'{"day":"{{day}}", "month":"{{month}}", "year":"{{year}}"}\'>{{day-event}}{{today}}</span></td>',
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
					var length = event.length;

					for (var n = length; n--; ) { // check if it's only a 'disabled' event
						if (event[n].type && event[n].type === 'disabled') { // or event[n].disabled
							length--;
						}
					}
					if (length > 1) {
						return day + '<span class="count-icon">' + length + '</span>';
					}
				}
			},
			events: events // external data... see events.js
		};


	/* ------------------------------------------------------ */
	/* ------------------- yearly calendar  ----------------- */
	/* ------------------------------------------------------ */
	Calendar.prototype.getYear = function(year) {
		var html = [],
			data = null,
			date = [];

		for (var n = 1; n <= 12; n++) {
			data = this.getMonth(year,  n); // , 4 for week
			date = data.date.split('-'); // YYYY-MM(-WW)

			html.push('<div class="cal-box">');
			html.push('<div class="month">' + this.options.months[date[1] - 1] +
				' - ' + date[0] + '</div>');
			html.push(data.html);
			html.push('</div>');
		}

		return html.join('');
	}

	// draw yearly calendar
	var myCalendar = window.myCalendar = new Calendar(options);
	var div = document.createElement('div');
	div.className = 'cal-wrapper';
	div.innerHTML = myCalendar.getYear(2016);
	document.body.appendChild(div);


	/* ------------------------------------------------------ */
	/* ------------------- event handling  ------------------ */
	/* ------------------------------------------------------ */
	// experimental click handler (event delegation) $(div).on('click.cal', '[data-day]', function() {...});
	div.addEventListener('click', function(e) {
		var target = e.target.hasAttribute('data-day') ? e.target :
				e.target.querySelector('[data-day]'),
			data = {},
			uuids = [];
		
		if (target) {
			data = JSON.parse(target.getAttribute('data-day'));
			console.log(
				data,
				target.getAttribute('title')
				// JSON.parse(target.getAttribute('data-events'))
			);
			// retreave events via IDs
			uuids = JSON.parse(target.getAttribute('data-uuids')) || [];
			for (var n = 0, m = uuids.length; n < m; n++) {
				console.log(myCalendar.options.events[uuids[n]]);
			}

			// do something with this data...
		}
	});

})(window, window.events);