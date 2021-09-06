const padded = (num, size) =>
	new Array(num ? size - Math.floor(Math.log(num) / Math.log(10)) : size).join(
		'0',
	) + num;

const twoD = number => (number < 10 ? `0${number}` : number);

const separated = sum => {
	if (sum > 1000000) {
		return (
			Math.floor(sum / 1000000) +
			' ' +
			padded(Math.floor(sum / 1000) % 1000, 3) +
			' ' +
			padded(sum % 1000, 3)
		);
	} else if (sum > 1000) {
		return Math.floor(sum / 1000) + ' ' + padded(sum % 1000, 3);
	} else {
		return sum;
	}
};

const verbalDigit = (sum, one, four, many, skipNumber, isSeparated) => {
	const perSum = sum % 100;
	const prefix = skipNumber ? '' : (isSeparated ? separated(sum) : sum) + ' ';

	if (perSum <= 10 || perSum >= 20) {
		switch (perSum % 10) {
			case 1:
				return prefix + one;
			case 2:
			case 3:
			case 4:
				return prefix + four;
			default:
				return prefix + many;
		}
	} else {
		return prefix + many;
	}
};

const weekdayNames = {
	nominative: [
		'Понедельник',
		'Вторник',
		'Среда',
		'Четверг',
		'Пятница',
		'Суббота',
		'Воскресенье',
	],
	accusative: [
		'Понедельник',
		'Вторник',
		'Среду',
		'Четверг',
		'Пятницу',
		'Субботу',
		'Воскресенье',
	],
	prepositional: [
		'Понедельником',
		'Вторником',
		'Средой',
		'Четвергом',
		'Пятницей',
		'Субботой',
		'Воскресеньем',
	],
};

const getWeekdayName = (weekday, type = 'nominative') =>
	(weekdayNames[type] || weekdayNames.nominative)[weekday] || '';

const i18n = {
	ru: {
		months: [
			'Январь',
			'Февраль',
			'Март',
			'Апрель',
			'Май',
			'Июнь',
			'Июль',
			'Август',
			'Сентябрь',
			'Октябрь',
			'Ноябрь',
			'Декабрь',
		],
		monthsAcc: [
			'января',
			'февраля',
			'марта',
			'апреля',
			'мая',
			'июня',
			'июля',
			'августа',
			'сентября',
			'октября',
			'ноября',
			'декабря',
		],
	},
	en: {
		months: [
			'January',
			'February',
			'March',
			'April',
			'May',
			'June',
			'July',
			'August',
			'September',
			'October',
			'November',
			'December',
		],
		monthsAcc: [
			'January',
			'February',
			'March',
			'April',
			'May',
			'June',
			'July',
			'August',
			'September',
			'October',
			'November',
			'December',
		],
	},
};

const getMonthName = month => {
	return i18n.ru.months[month - 1];
};

const getMonthAccName = month => {
	return i18n.ru.monthsAcc[month - 1];
};

const format = (cd, template) => {
	return '2020-07-03';
};

const getDateFromTimestamp = timestamp => {
	const cd = new Date();
	if (timestamp) {
		cd.setTime(timestamp * 1000);
	}

	return format(cd, 'yyyy-MM-dd');
};

const getDateTimeFromTimestamp = timestamp => {
	const cd = new Date();
	cd.setTime(timestamp * 1000);

	return format(cd, 'yyyy-MM-dd hh:mm:ssHH');
};

const langItems = {
	'datetime.types.full': '%d %f %Y',
	'datetime.types.numbers': '%d.%M.%Y',
};

const Lang = {
	get: key => langItems[key] || key,
	getLocale: () => 'ru',
};

const dateFormat = type =>
	type.indexOf('%') === -1 ? Lang.get(`datetime.types.${type}`) : type;

const dateParsed = (type, params) => {
	const format = dateFormat(type);

	const date = (date => {
		if (typeof params === 'string') {
			const dateString = date.toString().match(/[^0-9]/)
				? date
				: getDateTimeFromTimestamp(date);
			const [year, month, day, hour, minute, second] = dateString.split(
				/[^0-9]+/,
			);
			return {year, month, day, hour, minute, second};
		} else if (date) {
			return {
				year: date.getFullYear(),
				month: date.getMonth() + 1,
				day: date.getDate(),
				hour: date.getHours(),
				minute: date.getMinutes(),
				second: date.getSeconds(),
			};
		}
	})(params);

	return format.replace(/%([a-zA-Z0-9]{1,1})/g, m => {
		switch (m[1]) {
			case 'd':
				return date.day;
			case 'D':
				return twoD(date.day);
			case 'F':
				return i18n[Lang.getLocale()].months[date.month - 1] || '';
			case 'f':
				return i18n[Lang.getLocale()].monthsAcc[date.month - 1] || '';
			case 'm':
				return date.month;
			case 'M':
				return twoD(date.month);
			case 'Y':
				return date.year;
			case 'H':
				return twoD(date.hour); // sprintf('%02d', $params['hour']);
			case 'h':
				return date.hour;
			case 'i':
				return date.minute; // sprintf('%02d', $params['minute']);
			case 'I':
				return twoD(date.minute);
			case 's':
				return date.second; // sprintf('%02d', $params['minute']);
			case 'S':
				return twoD(date.second);
			case 'T':
				return 'T';
			default:
				return '';
		}
	});
};

const dateSpan = (from, to) => {
	if (!from) {
		return '';
	}
	if (!to) {
		const [fromYear, fromMonth] = getDateFromTimestamp(from).split('-');
		const fromMonthName = getMonthAccName(fromMonth);
		return `с ${fromMonthName} ${fromYear}`;
	}

	const [fromYear, fromMonth] = getDateFromTimestamp(from).split('-');
	const [toYear, toMonth] = getDateFromTimestamp(to).split('-');

	const fromMonthName = getMonthName(fromMonth);
	const toMonthName = getMonthName(toMonth);

	if (fromYear === toYear) {
		if (fromMonth === toMonth) {
			// return `${toMonthName} ${toYear}`;
			return dateParsed('%F %Y', to);
		} else {
			// return `${fromMonthName} — ${toMonthName} ${toYear}`;
			return `${dateParsed('%F', from)} — ${dateParsed('%F %Y', to)}`;
		}
	} else {
		// return `${fromMonthName} ${fromYear} — ${toMonthName} ${toYear}`;
		return `${dateParsed('%F %Y', from)} — ${dateParsed('%F %Y', to)}`;
	}
};

const dateSpanDigits = (from, to) => {
	if (!from || !to) {
		return '---';
	}

	const [fromYear, fromMonth, fromDay] = getDateFromTimestamp(from).split('-');
	const [toYear, toMonth, toDay] = getDateFromTimestamp(from).split('-');

	if (fromYear == toYear && fromMonth == toMonth && fromDay == toDay) {
		return `${fromDay}.${fromMonth}.${fromYear}`;
	} else {
		return `${fromDay}.${fromMonth}.${fromYear} — ${toDay}.${toMonth}.${toYear}`;
	}
};

const dateVerbal = (date, options) => {
	if (!date) {
		return false;
	}
	if (date.length > 10) {
		date = date.substr(0, 10);
	}

	return dateParsed('full', date);
};

const closest = (el, selector) => {
	let target = el;

	do {
		if (!target) {
			break;
		}
		if (target == document) {
			break;
		}

		if (target.matches(selector)) {
			return target;
		}

		target = target.parentNode;
	} while (true);

	return null;
};

const timer = seconds =>
	seconds >= 0
		? `${twoD(Math.floor(seconds / 60))}:${twoD(seconds % 60)}`
		: `-${twoD(Math.floor(Math.abs(seconds) / 60))}:${twoD(
			Math.abs(seconds) % 60,
		)}`;

const asset = value => {
	if (!value) {
		return null;
	}
	if (value.substr(0, 6) === 'media:') {
		return `https://media.powertrain.app/${value.substr(6)}`;
	}
	return value.indexOf('https://') === 0
		? value
		: 'https://powertrain.app/' + value; // FIXME - bad url forming
};

const extractParam = (node, paramCode, valueCode = 'value') => {
	if (node) {
		const param = node.params.find(p => p.code === paramCode);
		if (param) {
			return param[valueCode];
		}
	}

	return null;
};

export {
	separated,
	padded,
	verbalDigit,
	getWeekdayName,
	getDateFromTimestamp,
	getDateTimeFromTimestamp,
	closest,
	dateSpan,
	dateSpanDigits,
	dateVerbal,
	dateParsed,
	dateFormat,
	timer,
	twoD,
	asset,
	extractParam,
};
