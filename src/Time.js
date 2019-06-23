import moment from "moment";

export const nowIsBetween = (start, end) => {
    const startFormatted = formatTime(start);
    const endFormatted = formatTime(end);
    const now = moment();
    const timeFormat = 'hh:mm';
    const startMoment = moment(startFormatted, timeFormat);
    const endMoment = moment(endFormatted, timeFormat);
    return now.isBetween(startMoment, endMoment);
};

const currentWeekdayIndex = () => moment().weekday();

const formatTime = (time) => `${time["hours"]}:${time["minutes"]}`;

export const isOpenNow = (hours) => hours.some((h) => isNowInTimeInterval(h["weekday"], h["start"], h["end"]));

export const isNowInTimeInterval = (weekday, start, end) => {
    const weekdayIndex = currentWeekdayIndex();
    const currentWeekdayApiIndentifier = toWeekdayApiIndentifier(weekdayIndex);
    return weekday === currentWeekdayApiIndentifier && nowIsBetween(start, end);
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
