import React from "react";
import './App.css';
import {isNowInTimeInterval, isOpenNow} from "./Time";
import {useTranslation} from "react-i18next";

const OpeningHours = ({openingHoursList}) => {
    const { t } = useTranslation();

    openingHoursList = sortOpeningHours(openingHoursList);

    const isOpen = isOpenNow(openingHoursList);

    const closedText = (isHoliday) => {
        const currentlyClosed = t('map_currently_closed');
        if (isHoliday) {
            return currentlyClosed + ' ' + t('results_recipient_closed_holiday')
        } else {
            return currentlyClosed;
        }
    };

    return <div>
        {!isOpen.isOpen ?
            <div className="opening-times-status-closed">{closedText(isOpen.isHoliday)}</div> :
            <div className="opening-times-status-open">{t('map_currently_open')}</div>
        }
        <div className="opening-times-title">{t('map_opening_times')}</div>
        <OpeningHoursTable openingHoursList={openingHoursList}/>
    </div>;
};

const sortOpeningHours = (openingHoursList) => openingHoursList.sort((a, b) => toInternalIndex(a["weekday"]) - toInternalIndex(b["weekday"]));

const OpeningHoursTable = ({openingHoursList}) => <table className="opening-times-table">
    <tbody>
        {openingHoursList.map((openingHours) => OpeningHoursRow(openingHours))}
    </tbody>
</table>;

const OpeningHoursRow = (openingHours) => {
    const { t } = useTranslation();
    return <tr className={rowClassName(openingHours)} key={openingHours["weekday"]}>
        <td>{t(formatWeekdayStr(openingHours["weekday"]))}</td>
        <td>{formatTime(openingHours["start"])} - {formatTime(openingHours["end"])}</td>
    </tr>;
};

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
            return "weekday_monday";
        case "TU":
            return "weekday_tuesday";
        case "WE":
            return "weekday_wednesday";
        case "TH":
            return "weekday_thursday";
        case "FR":
            return "weekday_friday";
        case "SA":
            return "weekday_saturday";
        case "SU":
            return "weekday_sunday";
        default:
            console.log("Bad weekday str: " + weekdayStr);
    }
};

const toInternalIndex = (weekdayStr) => {
    switch (weekdayStr) {
        case "MO":
            return 0;
        case "TU":
            return 1;
        case "WE":
            return 2;
        case "TH":
            return 3;
        case "FR":
            return 4;
        case "SA":
            return 5;
        case "SU":
            return 6;
        default:
            console.log("Bad weekday str: " + weekdayStr);
    }
};

export default OpeningHours;
