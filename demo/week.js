(function(window, events, undefined){
	'use strict';

	// ------ some helper function used in callbacks later on

	// Collects events and stores them into _this._events[day].day and _this._events[day].time
	var processEvent = function(_this, day, date, event, delta) {
			var start = event.START = event.START || new Date(event._start);
			var end = event.END = event.END || new Date(event._end);

			if (event.start && event.end && ((event._end - event._start) < 86399000)) { // assume time event
				event.top = start.getHours() * 60 + start.getMinutes() - (delta * 60); // minute based
				event.bottom = end.getHours() * 60 + end.getMinutes() - (delta * 60); // minute based

				event.left = event.width = 0; // will be filled in checkForCollissions();
				_this._events[day].time.push(event);
			} else {
				_this._events[day].day.push(event);
			}
		},
		// add left and width to elements if they collide
		checkForCollissions = function(elements) {
			// http://jsbin.com/detefuveta/edit?html,js,output
			var columns = [];
			var lastEventEnding = null;

			elements = elements.sort(function(e1,e2) {
				if (e1.top < e2.top) return -1;
				if (e1.top > e2.top) return 1;
				if (e1.bottom < e2.bottom) return -1;
				if (e1.bottom > e2.bottom) return 1;
				return 0;
			});

			for (var n = 0, m = elements.length; n < m; n++) {
				if (lastEventEnding !== null && elements[n].top >= lastEventEnding) {
					PackEvents(columns);
					columns = [];
					lastEventEnding = null;
				}

				var placed = false;
				for (var i = 0, j = columns.length; i < j; i++) {                   
					if (!collidesWith(columns[i][columns[i].length - 1], elements[n]) ) {
						columns[i].push(elements[n]);
						placed = true;
						break;
					}
				}

				if (!placed) {
					columns.push([elements[n]]);
				}

				if (lastEventEnding === null || elements[n].bottom > lastEventEnding) {
					lastEventEnding = elements[n].bottom;
				}
			}

			if (columns.length > 0) {
				PackEvents(columns);
			}

			function PackEvents(columns) {
				for (var i = 0, n = columns.length; i < n; i++) {
					for (var j = 0, m = columns[i].length; j < m; j++) {
						columns[i][j].left = (i / n) * 100;
						columns[i][j].width = 100 * ExpandEvent(columns[i][j], i, columns) / n;
					}
				}
			}

			function collidesWith(a, b) {
				return a.bottom > b.top && a.top < b.bottom;
			}

			function ExpandEvent(ev, iColumn, columns) {
				var colSpan = 1;

				for (var i = iColumn + 1, n = columns.length; i < n; i++) {
					for (var j = 0, m = columns[i].length; j < m; j++) {
						if (collidesWith(ev, columns[i][j])) {
							return colSpan;
						}
					}
					colSpan++;
				}
				return colSpan;
			}
		};


	// ------ options for weekly calendar
	var options = {
			weekDays: ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'],
			months: ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni',
				'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'],
			sundayBased: false,
			template: {
				colGlue: '</tr><tr>',
				weekNo: '<td class="">{{day}}</td>',
				row: '<td class=""><span class=""{{event}}>{{day-event}}{{today}}</span></td>',
				day: function(day, date, event) {
					return this.options.weekDays[date.getDay()] + '., ' + day + '.';
				},
				event: function(day, date, event) {
					// collect all events for later rendering (end()); no rendering here
					this._events = this._events || {};
					this._events[day] = this._events[day] || {
						"day": [],
						"time": []
					};

					for (var n = 0, m = event.length; n < m; n++) {
						processEvent(this, day, date, event[n], this.options.dayStartTime);
					}
					checkForCollissions(this._events[day].time);
				},
				start: function(month, year, week) {
					return '<table class="cal-month"><tbody><tr><td></td>'; // extra col on beginning
				},
				end: function(month, year, week) { // renders the time raster incl. events and time
					var html = ['</tr><tr><td class="day-expl">' + this.options.dayEventText + '</td>']; // extra col on beginning
					var elm = {};
					var day = 0;
					var date = new Date(year, month - 1, (week - 1) * 7);

					date.setDate(date.getDate() - date.getDay() + +!this.options.sundayBased); // first day in this week
					for (var n = 7; n--; ) { // whole day events
						html.push('<td class="whole-day">');
						day = date.getDate();
						if (this._events && this._events[day]) {
							for (var o = 0, p = this._events[day].day.length; o < p; o++) {
								elm = this._events[day].day[o];
								elm.text && html.push(
									'<div class="day-event ' + elm.className +
									'" data-uuid="' + elm._id + '">' +
									elm.text + '</div>'
								);
							}
						}
						date.setDate(date.getDate() + 1);
						html.push('</td>');
					}

					var times = []; // draw hours in first column; simple version
					var time = this.options.dayStartTime;
					var endTime = (this.options.dayEndTime - time) * 2;
					var sign = this.options.display24h ? '' : this.options.timeAM;
					for (var n = 0; n < endTime; n++) {
						if (n % 2) {
							time++;
							if (time > 12 && !this.options.display24h) { // start over with 1
								time = 1;
								sign = this.options.timePM;
							}
							times.push('<div class="slot">' + time + ':00 <span>' + sign + '</span></div>');
						} else {
							times.push('<div class="slot"><span>' + time + ':30</span></div>');
						}
					}

					html.push('</tr><tr><td class="day-times">' + times.join('') + '</td>'); // extra col on beginning

					date.setDate(date.getDate() - 7); // set back
					for (var n = 7; n--; ) { // time based events
						html.push('<td class="day-hours"><div class="day-hours-wrapper">');
						day = date.getDate();
						if (this._events && this._events[day]) {
							for (var o = 0, p = this._events[day].time.length; o < p; o++) {
								elm = this._events[day].time[o];
								html.push(
									'<div class="time-event ' + elm.className + '" style="' +
									'top: ' + elm.top + 'px;' +
									'height: ' + (elm.bottom - elm.top) + 'px;' +
									'width: calc(' + (Math.round(elm.width * 100) / 100) + '% - 4px);' +
									'left: calc(' + (Math.round(elm.left * 100) / 100) + '% + 4px);"' +
									' data-uuid="' + elm._id + '">' +
									elm.text + '</div>'
								);
							}
						}
						date.setDate(date.getDate() + 1);
						html.push('</div></td>');
					}

					return html.join('') + '</tr></tbody></table>';
				}
			},
			events: events,

			todayClass: 'w-today',
			weekEndClass: 'w-week-end',
			prevMonthClass: 'w-previous-month',
			nextMonthClass: 'w-next-month',
			currentMonthClass: 'w-current-month',
			// optional options
			dayStartTime: 8, // only full steps
			dayEndTime: 18, // only full steps
			timeAM: 'am',
			timePM: 'pm',
			display24h: false,
			dayEventText: 'Ganztägig'
		};


	// ------ set up week calendar and draw
	var week = 2,
		month = 6,
		year = 2016,
		myCalendar = window.myWeekCalendar = new Calendar(options),
		data = myCalendar.getMonth(year, month, week),
		date = data.date.split('-'), // YYYY-MM(-WW)
		div = document.createElement('div');

	div.innerHTML =
		'<div class="cal-w-box">' +
		'<div class="month">' + myCalendar.options.months[date[1] - 1] + ' - ' + date[0] + '</div>' +
		data.html +
		'<div class="now"></div>' +
		'</div>';
	div.className = 'cal-wrapper';
	document.body.appendChild(div);


	// ------ draw now-line; it's hacky!!!
	var options = myCalendar.options,
		maxHours = options.dayEndTime - options.dayStartTime,
		nowBar = div.querySelector('.now'),
		leftCol = div.querySelector('.day-times'),
		table = div.querySelector('.cal-month'),
		offset = {
			left: leftCol.offsetWidth,
			top: leftCol.offsetTop + table.offsetTop // ??? fake...
		},
		setNow = function() {
			var now = new Date();
			var delta = (now.getHours() - options.dayStartTime) * 60 + now.getMinutes();
			nowBar.style.cssText =
				'display: ' + (delta < 0 || delta > maxHours * 60 ? 'none;' : ';') +
				'left: ' + offset.left + 'px;' +
				'width: calc(100% - ' + offset.left + 'px);' +
				'top: ' + (offset.top + delta) + 'px;';
		};

	setNow();
	setInterval(setNow, 1000 * 10); // every 10 sec

	/* ------------------------------------------------------ */
	/* ------------------- event handling  ------------------ */
	/* ------------------------------------------------------ */
	// experimental click handler (event delegation) $(div).on('click.cal', '[data-uuid]', function() {...});
	div.addEventListener('click', function(e) {
		var target = e.target.hasAttribute('data-uuid') ? e.target :
				e.target.querySelector('[data-uuid]');
		
		if (target) {
			console.log(myCalendar.options.events[target.getAttribute('data-uuid')]);
			// do something with this data...
		}
	});


})(window, window.events);