(function(window, events, undefined){
	'use strict';

	/* ------------------------------------------------------ */
	/* -------- initial options for monthly calendar  -------- */
	/* ------------------------------------------------------ */
	var options = {
			monthsLong: ['January', 'February', 'March', 'April', 'May', 'June',
				'July', 'August', 'September', 'October', 'November', 'December'],
			// sundayBased: false,
			template: {
				start: function(month, year) {
					return '<div class="month">Flights in ' +
						this.options.monthsLong[month - 1] + ' ' + year + '</div>';
				},
				row: '<div class="flight">{{day-event}}</div>',
				day: function(day, date, event) { // rendering every day
					event = event[0] || { // assume only 1 or 0 event
						className: '',
						_id: '',
						text: ''
					};

					return this.options.weekDays[date.getDay()] + '., ' +
						this.options.months[date.getMonth()] + '. ' + day +
						'<span class="item ' + event.className +
						'" data-uuid="' + event._id + '">' + event.text + '</span>';
				}
			},
			events: [{
				at: '2016-08-07',
				className: 'available',
				text: 'for <span>€96.00</span>'
			},{
				at: '2016-08-09',
				className: 'available',
				text: 'for <span>€76.00</span>'
			},{
				at: '2016-08-10',
				className: 'available',
				text: 'for <span>€53.00</span>'
			},{
				at: '2016-08-11',
				className: 'not-available',
				text: 'No flights available'
			},{
				at: '2016-08-12',
				className: 'available',
				text: 'for <span>€114.00</span>'
			},{
				at: '2016-08-13',
				className: 'not-available',
				text: 'No flights available'
			},{
				at: '2016-08-14',
				className: 'available',
				text: 'for <span>€96.00</span>'
			}]
		};

	// draw flight calendar
	var div = document.createElement('div');
	var myFlights = new Calendar(options);

	div.className = 'cal-wrapper flights';
	div.innerHTML = myFlights.getMonth(2016, 8, 2).html;
	document.body.appendChild(div);


})(window, window.events);