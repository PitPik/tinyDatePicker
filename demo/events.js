window.events = [{
		end: '2016-03-25', // end only: from -29719-04-06 -> 2016-03-25
		className: 'disabled', // also use className for datePicker option.disabledClass
		type: 'disabled' // optional (all extra properties will be available in callbacks)
	},{
		start: '2016-07-27',
		end: '2016-08-25',
		className: 'brown some-class',
		type: 'disabled'
	},{
		start: '2016-11-25', // start only: 2016-11-25 -> 33658-09-27
		className: 'green',
		type: 'disabled'
	},{
		at: '2016-05-08', // at only: 2016-05-08 00:00:00 -> 2016-05-08 23:59:59
		className: 'event',
		text: 'Someones\' Birthday' // optional
	},{
		start: '2016-05-08 08:00', // time always in 24h HH:MM[:SS] format
		end: '2016-05-08 10:00', // if no time: -> 23:59:59
		className: 'event',
		text: 'Get flowers for Someone'
	},{
		at: '2016-05-12',
		className: 'event',
		text: 'Some event'
	},{
		at: '2016-04-30',
		className: 'event',
		text: 'Some event'
	},{
		start: '2016-05-30',
		end: '2016-06-08',
		className: 'event',
		text: 'Repetitive event with extra long text'
	},{
		start: '2016-06-03',
		end: '2016-06-05',
		className: 'event',
		text: 'Some Volleyball tournament'
	},{
		at: '2016-06-07',
		className: 'event',
		text: 'Whole day event'
	},{
		start: '2016-06-07 10:00',
		end: '2016-06-07 12:15',
		className: 'event',
		text: 'foo - bar 1'
	},{
		start: '2016-06-07 11:00',
		end: '2016-06-07 12:15',
		className: 'event',
		text: 'foo - bar 2'
	},{
		start: '2016-06-07 09:45',
		end: '2016-06-07 13:30',
		className: 'event',
		text: 'foo - bar 3'
	},{
		start: '2016-06-07 13:00',
		end: '2016-06-07 14:15',
		className: 'event',
		text: 'foo - bar overlap below'
	},{
		start: '2016-06-07 14:30',
		end: '2016-06-07 15:30',
		className: 'event',
		text: 'foo - bar below'
	},{
		start: '2016-06-10 12:00',
		end: '2016-06-10 14:30',
		className: 'event',
		text: 'Some event'
	},{
		start: '2016-06-11 11:20',
		end: '2016-06-11 14:50',
		className: 'event',
		text: 'Some event'
	},{
		start: '2016-06-11 12:30',
		end: '2016-06-11 15:30',
		className: 'event',
		text: 'Some event'
	},{
		start: '2016-06-05 10:00',
		end: '2016-06-05 12:00',
		className: 'event',
		text: 'Planning for some vacation'
	},{
		at: '2016-06-05',
		className: 'event',
		text: 'Something else to do...'
	},{
		at: '2016-12-28',
		className: 'event',
		text: 'Some other day',
		extra: 'important' // optional
	},{
		at: '2016-06-28',
		className: 'event',
		text: 'Some other day'
	}
];