import React, { useEffect } from "react";
import './App.css';
import { useTranslation } from "react-i18next";
import i18n from 'i18next';
import {auth} from "./globals";

const axios = require('axios');

let delayTimer;

const SearchBox = ({ onSuggestions, onInput, searchText, onSuggestionsRequest, isShowingSuggestions, onBlur }) => {
    const { t } = useTranslation();

    const suggestions = async (text) => {
        if (!text) {
            onSuggestions([]);
            return;
        }

        const lang = i18n.language;

        clearTimeout(delayTimer);
        delayTimer = setTimeout(async function () {
            onSuggestionsRequest();

            const result = await axios('https://wohin-mit.de:8443/suggestions/' + text, {
            // const result = await axios('http://localhost:8080/suggestions/' + text, {
                headers: {"lang": lang},
                auth: auth
            });
            // await sleep(2000);

            const data = result.data;
            // TODO handle http errors (they are returned here, not in onrejected)
            const array = Array.isArray(data) ? data : [];
            onSuggestions(array);
        }, 300); // Delay a little, to not send a request on each keystroke
    };

    const onSearchInput = (text) => {
        onInput(text);
        if (text.length > 2) {
            suggestions(text);
        } else {
            onSuggestions([]);
        }
    };

    const searchboxClass = () => isShowingSuggestions ? "searchbox no-border" : "searchbox";

    return (
        <input
            // Add class no-border to remove borders when suggestions box is displayed
            className={searchboxClass()}
            type="text"
            placeholder={t('search_box_placeholder')}
            value={searchText}
            onChange={event => onSearchInput(event.target.value)}
            autoFocus
            onBlur={() => onBlur()}
        />
    );
};

export default SearchBox;
