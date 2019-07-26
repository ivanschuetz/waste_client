import React, {useState} from "react";
import './App.css';
import {useTranslation} from "react-i18next";
import i18n from 'i18next';

const GeolocModal = ({onOk}) => {
    const {t} = useTranslation();
    return (
        <div className="geo-loc-info-container">
            <span>{t('geoloc_info_message')}</span>
            <div className='action-button' onClick={() => onOk()}>
                <span>{t('general_ok')}</span>
            </div>
        </div>
    );
};

export default GeolocModal;
