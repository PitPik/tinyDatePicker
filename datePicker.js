(function (root, factory) { // 15.54 KB, 8.22 KB, 3.21 KB
	if (typeof exports === 'object') {
		module.exports = factory(root, require('calendar'));
	} else if (typeof define === 'function' && define.amd) {
		define('datePicker', ['calendar'], function (Calendar) {
			return factory(root, Calendar);
		});
	} else {
		root.DatePicker = factory(root, root.Calendar);
	}
}(this, function(window, Calendar, undefined) {
	'use strict';

	var DatePicker = function(elements, options) {
			this.options = {
				useCache: false,
				elements: [],
				body: document.body,

				pickerAttribute: 'data-picker',

				datePickerClass: 'date-picker',
				selectedDayClass: 'selected-day',
				disabledClass: 'disabled',
				initCallback: function(elements) {},
				renderCallback: function(container, element, toggled) {
					var bounds = element.getBoundingClientRect();

					container.style.cssText = !this.isOpen ? 'display: none' :
						'left:' + (window.pageXOffset + bounds.left) + 'px;' +
						'top:' + (window.pageYOffset + element.offsetHeight + bounds.top) + 'px;';
				},
				renderValue: function(container, element, value) {
					element.value = value;
				},
				readValue: function(element) {
					return element.value;
				},

				header:
					'<div class="dp-title">' +
						'<button class="dp-prev" type="button"{{disable-prev}}>{{prev}}</button>' +
						'<button class="dp-next" type="button"{{disable-next}}>{{next}}</button>' +
						'<div class="dp-label dp-label-month">{{month}}' +
							'<select class="dp-select dp-select-month" tabindex="-1">' +
								'{{months}}' +
							'</select>' +
						'</div>' +
						'<div class="dp-label dp-label-year">{{year}}' +
							'<select class="dp-select dp-select-year" tabindex="-1">' +
								'{{years}}' +
							'</select>' +
						'</div>' +
					'</div>',
				nextLabel: 'Next month',
				prevLabel: 'Previous month',
				minDate: '1969-01-01',
				maxDate: '2050-12-31',
				minDateAttribute: 'data-mindate',
				maxDateAttribute: 'data-maxdate',
				// classes for event listeners
				nextButtonClass: 'dp-next',
				prevButtonClass: 'dp-prev',
				selectYearClass: 'dp-select-year',
				selectMonthClass: 'dp-select-month',
				footer:
					'<div class="dp-footer">' +
						'<div class="dp-label">{{hour}}' +
							'<select class="dp-select dp-select-hour" tabindex="-1">' +
								'{{hours}}' +
							'</select>' +
						'</div>' +
						'<div class="dp-label">{{minute}}' +
							'<select class="dp-select dp-select-minute" tabindex="-1">' +
								'{{minutes}}' +
							'</select>' +
						'</div>' +
						'<div class="dp-label">{{second}}' +
							'<select class="dp-select dp-select-second" tabindex="-1">' +
								'{{seconds}}' +
							'</select>' +
						'</div>' +
						'<div class="dp-label">{{am-pm}}' +
							'<select class="dp-select dp-select-am-pm" tabindex="-1">' +
								'{{am-pms}}' +
							'</select>' +
						'</div>' +
					'</div>',
				timeFormat: '',
				timeFormatAttribute:'data-timeformat',
				doAMPM: false,
				minuteSteps: 5,
				secondSteps: 10,
				AMPM: ['AM', 'PM'],
				// classes for event listeners
				selectHourClass: 'dp-select-hour',
				selectMinuteClass: 'dp-select-minute',
				selectSecondClass: 'dp-select-second',
				selectAMPMClass: 'dp-select-am-pm',

				rangeStartAttribute: 'data-from',
				rangeEndAttribute: 'data-to'
			}

			initDatePicker(this, elements || [], options || {});
		},
		initDatePicker = function(_this, elements, options) {
			var _toggle = function(e) { // toggle.bind(_this)
					toggle(_this, e);
				};

			options.elements = typeof elements === 'string' ?
				document.querySelectorAll(elements) : elements;

			for (var option in options) {
				_this.options[option] = options[option];
			}

			addEvent(window, 'resize', function(e) {
				_this.isOpen && renderCallback(_this);
			}, false, _this);
			addEvent(document.body, 'focus', _toggle, true, _this);
			addEvent(document.body, 'click', _toggle, false, _this);

			_this.options.initCallback.call(_this, options.elements);
		};

	DatePicker.prototype.destroy = function() {
		removeEvents(this); // removes reliably 'all' event listeners in this instance
		this.datePicker && this.datePicker.parentNode.removeChild(this.datePicker);
		for (var item in this) {
			this[item] = null;
		}
	}

	function toggle(_this, e) {
		var path = e.path || [],
			node = e.target,
			options = _this.options,
			isFocusIn = e.type === 'focus',
			currentPartner = _this.currentPartner,
			values = [],
			value = '',
			date = {},
			timeFormat = '',
			hasAMPM = false,
			isPM = false,
			id = 'datePicker';

		while(!e.path && node) { // in case e.path doesn't exist
			path.push(node); //  && node !== _this.datePicker
			node = node.parentNode;
		}

		if ([].indexOf.call(options.elements, e.target) !== -1) {
			if (_this.isOpen && !isFocusIn) return;
			_this.calendar = _this.calendar || new Calendar(_this.options);
			_this.calendar.removeEvent(id);

			// set correct day / time format TODO: revisit and optimize
			value = options.readValue.call(_this, e.target);
			_this.date = date = getDateObject(value || getDateString(new Date(), true));
			timeFormat = e.target.getAttribute(options.timeFormatAttribute);
			timeFormat = timeFormat !== null ? timeFormat : options.timeFormat;
			if (!value && timeFormat) {
				hasAMPM = /\s+(?:A|P)M/.test(timeFormat);
				isPM = hasAMPM ? +date.hour >= 12 : undefined;
				date.second = /:SS/.test(timeFormat) ? date.second : undefined;
				date.AMPM = hasAMPM ? (isPM ? 'PM' : 'AM') : undefined;
				date.hour = hasAMPM && isPM ? lZ(
					+date.hour === 12 ? 12 : +date.hour - 12
				) : date.hour;
			} else if (!value && !timeFormat) {
				date.hour = undefined; // ignores time rendering
			}

			_this.isOpen = true;
			_this.toggled = _this.currentInput !== e.target;
			_this.currentInput = e.target;
			_this.currentPartner = currentPartner = getPartner(_this, e.target);
			_this.currentDate = getDateObject(assembleDate(date)); // is new object
			// add limiters for date ranges... native and range picker
			values = [
				e.target.getAttribute(options.minDateAttribute) || options.minDate,
				e.target.getAttribute(options.maxDateAttribute) || options.maxDate,
				currentPartner && currentPartner.value.split(' ')[0]];
			values = values[2] ? sortDates(values[2],
				currentPartner.hasAttribute(options.rangeStartAttribute) ?
				values[1] : values[0]) : values;
			_this.minDate = getDateObject(values[0]);
			_this.maxDate = getDateObject(values[1]);
			addDateLimiter(_this, undefined, values[0], id);
			addDateLimiter(_this, values[1], undefined, id);

			renderDatePicker(_this, e.target, date);
			_this.toggled = false;
		} else if (_this.isOpen && _this.datePicker && path.indexOf(_this.datePicker) === -1) {
			_this.isOpen = false;
			_this.toggled = true;
			renderCallback(_this);
			_this.calendar.removeEvent(id);
			_this.currentInput = _this.currentDate = _this.date = undefined;
		}
	}

	function renderDatePicker(_this, element, date) {
		var options = _this.options,
			calendar = _this.calendar,
			container = _this.datePicker = _this.datePicker ||
				options.body.appendChild(document.createElement('div')),
			template = calendar.options.template,
			day,
			// min max calculations
			minDate = _this.minDate,
			maxDate = _this.maxDate,
			minMonth = +date.year <= +minDate.year ? +minDate.month : 1,
			maxMonth = +date.year >= +maxDate.year ? +maxDate.month : 12,
			dateValue = +(date.year + date.month),
			isMinDate = dateValue <= +(minDate.year + minDate.month),
			isMaxDate = dateValue >= +(maxDate.year + maxDate.month);

		if (isMinDate) { // correct dates if exceeded
			date.year = minDate.year;
			date.month = minDate.month;
		} else if (isMaxDate) {
			date.year = maxDate.year;
			date.month = maxDate.month;
		}

		if (!container.innerHTML) { // only once...
			template.row = template.row.replace(/<(.*?)>/, // extend template for picker
				'<$1 ' + options.pickerAttribute + '="{{year}}-{{month}}-{{day}}">');
			container.className = options.datePickerClass;

			addEvent(container, 'click', function(e) {
				onClick(_this, e);
			}, false, _this);
			addEvent(container, 'change', function(e) {
				onChange(_this, e);
			}, false, _this);
		}

		container.innerHTML = !date.year || !date.day ? '' :
			calendar.getMonth(date.year, date.month).html;
		// mark current date
		day = container.querySelector('[' + options.pickerAttribute + '="' +
			(assembleDate(_this.currentDate, true).replace(/-0/g, '-')) + '"]'); // fix lZ problem
		if (day) {
			day.className += ' ' + options.selectedDayClass;
		}

		// render top (month, year selection)
		if (date.year) {
			container.insertAdjacentHTML('afterbegin', options.header.
				replace('{{year}}', date.year).
				replace('{{years}}', getOptionsHTML(
					+minDate.year, +maxDate.year, date.year)).
				replace('{{month}}', calendar.options.months[(date.month) - 1]).
				replace('{{months}}',getOptionsHTML(
					minMonth, maxMonth, date.month, calendar.options.months, 1)).
				replace('{{day}}', date.day).
				replace('{{next}}', options.nextLabel).
				replace('{{prev}}', options.prevLabel).
				replace('{{disable-next}}', isMaxDate ? ' disabled=""' : '').
				replace('{{disable-prev}}', isMinDate ? ' disabled=""' : ''));
		}

		// render bottom (time selection)
		if (date.hour && options.footer) {
			container.insertAdjacentHTML('beforeend', options.footer.
				replace('{{hour}}', date.hour).
				replace('{{hours}}', getOptionsHTML(
					0, options.doAMPM || date.AMPM ? 12 : 24, date.hour)).
				replace('{{minute}}', ' : ' + date.minute).
				replace('{{minutes}}', getOptionsHTML(
					0, 59, date.minute, null, null, options.minuteSteps)).
				replace('{{second}}', date.second ? ' : ' + date.second : '').
				replace('{{seconds}}', date.second ? getOptionsHTML(
					0, 59, date.second, null, null, options.secondSteps) : '').
				replace('{{am-pm}}', date.AMPM || '').
				replace('{{am-pms}}', date.AMPM ? getOptionsHTML(
					0, 1, options.AMPM.indexOf(date.AMPM), options.AMPM) : ''));
		}
		renderCallback(_this);
	}

	function onClick(_this, e) {
		var options = _this.options,
			selectedDate = '',
			date = _this.date,
			day = e.target,
			prev = hasClass(e.target, options.prevButtonClass),
			next = prev ? false : hasClass(e.target, options.nextButtonClass);

		while(!prev && !next && day !== document.body) { // find data attribute
			if (selectedDate = day.getAttribute(options.pickerAttribute)) break;
			day = day.parentNode;
		}

		if (selectedDate && !hasClass(day, options.disabledClass)) { // days in calendar
			selectedDate = getDateObject(selectedDate);
			date.year = selectedDate.year;
			date.month = selectedDate.month;
			date.day = selectedDate.day;
			renderValue(_this);
			toggle(_this, {});
		} else if (prev || next) { // UI buttons in header
			e.stopPropagation();

			date.month = +date.month + (prev ? -1 : next ? 1 : 0);
			date.year =
				date.month === 0 ? lZ(+date.year - 1) :
				date.month === 13 ? lZ(+date.year + 1) :
				date.year;
			date.month =
				date.month === 0 ? '12' :
				date.month === 13 ? '01' :
				lZ(date.month);
			if (!date.day) {
				renderValue(_this);
			}
			renderDatePicker(_this, _this.currentInput, date);
		}
	}

	function onChange(_this, e) {
		var date = _this.date,
			data = ['year', 'month', 'hour', 'minute', 'second', 'AMPM'],
			item = '';

		while ((item = data.shift()) && !hasClass(e.target, _this.options['select' +
			item.charAt(0).toUpperCase() + item.slice(1) + 'Class']));

		date[item] = item === 'AMPM' ? _this.options.AMPM[e.target.value] :
			lZ(e.target.value);

		if (/^(?:ho|mi|se|AM)/.test(item) || !date.day) {
			_this.currentDate[item] = date[item];
			renderValue(_this, assembleDate(_this.currentDate));
		}
		renderDatePicker(_this, _this.currentInput, date);
	}

	function getPartner(_this, element) { // get element by same attr or name like attr
		var options = _this.options,
			fromTo = element.getAttribute(options.rangeStartAttribute) ||
				element.getAttribute(options.rangeEndAttribute),
			elements = document.querySelectorAll(
					'[' + options.rangeStartAttribute + '="' + fromTo + '"],' +
					'[' + options.rangeEndAttribute + '="' + fromTo + '"],' +
					'[name="' + fromTo + '"]');

		for (var n = elements.length; n--; ) {
			if (elements[n] && elements[n] !== element) {
				return elements[n];
			}
		}
	}

	/* ---------- some datePicker based helper functions ---------- */

	function renderValue(_this, value) {
		_this.options.renderValue.call(_this, _this.datePicker,
				_this.currentInput, value || assembleDate(_this.date));
	}

	function renderCallback(_this) {
		_this.options.renderCallback.call(_this, _this.datePicker,
			_this.currentInput, _this.toggled);
	}

	function addDateLimiter(_this, start, end, element) {
		_this.calendar.addEvent({
			className: _this.options.disabledClass,
			type: _this.options.disabledClass,
			start: start ? addDays(_this, start, 1, true) : start,
			end : end ? addDays(_this, end, -1, true) : end
		}, element);
	}

	function addDays(_this, date, add, end) {
		date = _this.calendar.convertDateString(date, end);
		date.setDate(date.getDate() + add);
		return getDateString(date);
	}

	function sortDates(date1, date2) {
		return date1 < date2 ? [date1 || date2, date2] : [date2, date1];
	}

	function getDateObject(date) { // simple version
		date = ((date.indexOf('-') !== -1 ? '' : '--- ') + date).split(/(?:\s+|T)/);
		date[0] = date[0].split('-');
		date[1] = (date[1] || '').split(':');

		return {
			year: date[0][0],
			month: lZ(date[0][1]),
			day: lZ(date[0][2]),
			hour: lZ(date[1][0]), // add value if time is enabled
			minute: lZ(date[1][1]),
			second: lZ(date[1][2]),
			AMPM: date[2]
		}
	}

	function assembleDate(date, dateOnly) { // simple version
		return (
			(date.year ? (date.year + '-' + date.month +
				(date.day ?  '-' + date.day : '')) : '') +
			(date.hour && !dateOnly ? ((date.year ? ' ' : '') +
				date.hour + ':' + date.minute +
				(date.second ? ':' + date.second : '') +
				(date.AMPM ? ' ' + date.AMPM : '')) : ''));
	}

	function getDateString(date, time) {
		return date.getFullYear() + '-' + lZ(date.getMonth() + 1) + '-' +
			lZ(date.getDate()) + (time ? ' ' + date.toTimeString().split(' ')[0] : '');
	}

	function getOptionsHTML(n, m, compare, data, dataOffset, jump) {
		var option = [];

		for ( ; n <= m; n += jump || 1) {
			option.push('<option value="' + n + '"' +
				(+compare === n ? ' selected' : '') + '>' +
				(data ? data[n - (dataOffset || 0)] : n) +
				'</option>');
		}
		return option.join('');
	}

	/* ---------- some general helper functions ---------- */

	function addEvent(element, type, func, cap, _this) {
		addEvent.events = addEvent.events || [];
		addEvent.events.push({ // cache references for reliable removal
			e: element,
			t: type,
			f: func,
			c: cap,
			i: (_this || this)
		});

		element.addEventListener(type, func, cap);
	}

	function removeEvents(_this) { // remoces all events from instance or nameSpace
		for (var item = {}, n = (addEvent.events || []).length; n--; ) {
			item = addEvent.events[n];
			if (item.i === (_this || this)) {
				item.e.removeEventListener(item.t, item.f, item.c);
				addEvent.events.splice(n, 1);
			}
		}
	}

	function hasClass(element, className) {
        return (' ' + element.className + ' ').indexOf(' ' + className + ' ') !== -1;
    }

	function lZ(dig) { // adds leading zero
		return dig ? (+dig + '').replace(/^(\d)$/, '0$1') : undefined;
	}

	return DatePicker;
}));