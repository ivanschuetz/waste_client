import moment from "moment";

const now = () => moment();

export const isBetween = (time, start, end) => {
    const startFormatted = formatTime(start);
    const endFormatted = formatTime(end);
    const timeFormat = 'hh:mm';
    const startMoment = moment(startFormatted, timeFormat);
    const endMoment = moment(endFormatted, timeFormat);
    return time.isBetween(startMoment, endMoment);
};

export const isOpenNow = (hours) => {
    const nowVal = now();
    const isHolidayConst = isHoliday(nowVal);
    if (isHolidayConst) {
        return { isOpen: false, isHoliday: true };
    } else {
        return hours.some((h) => isInTimeInterval(nowVal, h["weekday"], h["start"], h["end"])) ?
            { isOpen: true, isHoliday: false } : { isOpen: false, isHoliday: false };
    }
};

export const isHoliday = (date) => {
    return isSameDayMonthYear(date, 3, 9, 2019) || // Tag der deutschen Einheit
    isSameDayMonthYear(date, 24, 11, 2019) || // Heiliger Abend
    isSameDayMonthYear(date, 25, 11, 2019) || // 1 Weihnachten
    isSameDayMonthYear(date, 26, 11, 2019) || // 2 Weihnachten
    isSameDayMonthYear(date, 31, 11, 2019) || // Silvester
    isSameDayMonthYear(date, 1, 0, 2020) || // Neujahr
    isSameDayMonthYear(date, 10, 3, 2020) || // Karfreitag
    isSameDayMonthYear(date, 12, 3, 2020) || // Ostersonntag
    isSameDayMonthYear(date, 13, 3, 2020) || // Ostermontag
    isSameDayMonthYear(date, 1, 4, 2020) || // Tag der Arbeit
    isSameDayMonthYear(date, 21, 4, 2020) || // Christi Himmelfahrt
    isSameDayMonthYear(date, 31, 4, 2020) || // Christi Pfingstsonntag
    isSameDayMonthYear(date, 1, 5, 2020) || // Pfingstmontag
    isSameDayMonthYear(date, 3, 9, 2020) || // Tag der deutschen Einheit
    isSameDayMonthYear(date, 24, 11, 2020) || // Heiliger Abend
    isSameDayMonthYear(date, 25, 11, 2020) || // 1 Weihnachten
    isSameDayMonthYear(date, 26, 11, 2020) || // 2 Weihnachten
    isSameDayMonthYear(date, 31, 11, 2020); // 1 Silvester
};

const isSameDayMonthYear = (date, day, month, year) =>
    date.date === day && date.month() === month && date.year() === year;

export const isNowInTimeInterval = (weekday, start, end) => isInTimeInterval(now(), weekday, start, end);

const currentWeekdayIndex = () => moment().weekday();

const formatTime = (time) => `${time["hours"]}:${time["mins"]}`;

const isInTimeInterval = (time, weekday, start, end) => {
    const weekdayIndex = currentWeekdayIndex();
    const currentWeekdayApiIndentifier = toWeekdayApiIndentifier(weekdayIndex);
    return weekday === currentWeekdayApiIndentifier && isBetween(time, start, end);
};

const toWeekdayApiIndentifier = (weekdayIndex) => {
    switch (weekdayIndex) {
        case 1: return "MO";
        case 2: return "TU";
        case 3: return "WE";
        case 4: return "TH";
        case 5: return "FR";
        case 6: return "SA";
        case 0: return "SU";
        default: throw Error(`Invalid weekday index: ${weekdayIndex}`)
    }
};
