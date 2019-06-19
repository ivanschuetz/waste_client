import React from "react";
import './App.css';
import {isNowInTimeInterval, isOpenNow, nowIsBetween} from "./Time";

const OpeningHours = ({openingHoursList}) => <div>
    {!isOpenNow(openingHoursList) ?
        <div className="opening-times-status-closed">Derzeit geschlossen!</div> : <div className="opening-times-status-open">Geöffnet!</div>}
    <div className="opening-times-title">Öffnungszeiten</div>
    <OpeningHoursTable openingHoursList={openingHoursList}/>
</div>;

const OpeningHoursTable = ({openingHoursList}) => <table className="opening-times-table">
    <tbody>
        {openingHoursList.map((openingHours) => OpeningHoursRow(openingHours))}
    </tbody>
</table>;

const OpeningHoursRow = (openingHours) =>
    <tr className={rowClassName(openingHours)} key={openingHours["weekday"]}>
        <td>{formatWeekdayStr(openingHours["weekday"])}</td>
        <td>{formatTime(openingHours["start"])} - {formatTime(openingHours["end"])}</td>
    </tr>;

const rowClassName = (hour) => {
    if (isNowInTimeInterval(hour["weekday"], hour["start"], hour["end"])) {
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

export default OpeningHours;
