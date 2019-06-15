import moment from "moment";

export const nowIsBetween = (start, end) => {
    const now = moment();
    const timeFormat = 'hh:mm';
    const startMoment = moment(start, timeFormat);
    const endMoment = moment(end, timeFormat);
    return now.isBetween(startMoment, endMoment);
};
