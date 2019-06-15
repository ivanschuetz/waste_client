import React from "react";
import './App.css';
import {nowIsBetween} from "./Time";

const OpeningHoursTable = ({openingHoursList}) => <table className="opening-times-table">
    {openingHoursList.map((openingHours) => OpeningHoursRow(openingHours))}
</table>;

const OpeningHoursRow = (openingHours) =>
    <tr className={rowClassName(openingHours["start"], openingHours["end"])}>
        <td>{formatWeekdayStr(openingHours["weekday"])}</td>
        <td>{formatTime(openingHours["start"])} - {formatTime(openingHours["end"])}</td>
    </tr>;

const rowClassName = (start, end) => {
    if (nowIsBetween(start, end))  {
        return 'opening-hours-row-now'
    } else {
        return 'opening-hours-row-default'
    }
};

const formatTime = (time) => `${time["hours"]}:${time["mins"]}`;

const formatWeekdayStr = (weekdayStr) => {
    switch (weekdayStr) {
        case "MO":
            return "Montag";
        case "TU":
            return "Dienstag";
        case "WE":
            return "Mittwoch";
        case "TH":
            return "Donnerstag";
        case "FR":
            return "Freitag";
        case "SA":
            return "Saturday";
        case "SU":
            return "Sunday";
        default:
            console.log("Bad weekday str: " + weekdayStr);
    }
};

export default OpeningHoursTable;
