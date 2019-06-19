import React from "react";
import './App.css';
import {useTranslation} from "react-i18next";
import i18n from 'i18next';

const axios = require('axios');

const SearchBox = ({onResults, onInput, searchText}) => {
    const {t} = useTranslation();

    const search = async (text) => {
        if (!text) {
            onResults([]);
            return;
        }

        const lang = i18n.language;
        const result = await axios('http://localhost:8080/search/' + text, {headers: {"lang": lang}});
        const data = result.data;
        // TODO handle http errors (they are returned here, not in onrejected)
        const array = Array.isArray(data) ? data : [];
        onResults(array);
    };

    const onSearchInput = (text) => {
        onInput(text);
        if (text.length > 2) {
            search(text);
        } else {
            onResults([]);
        }
    };

    return (
        <input
            className="searchbox"
            type="text"
            placeholder={t('search_box_placeholder')}
            value={searchText}
            onChange={event => onSearchInput(event.target.value)}
            autoFocus
        />
    );
};

export default SearchBox;
