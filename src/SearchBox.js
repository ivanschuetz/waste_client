import React from "react";
import './App.css';
import {useTranslation} from "react-i18next";
import i18n from 'i18next';
import https from 'https';

const axios = require('axios');

let delayTimer;

const SearchBox = ({onResults, onInput, searchText, onRequest}) => {
    const {t} = useTranslation();

    const search = async (text) => {
        if (!text) {
            onResults([]);
            return;
        }

        const lang = i18n.language;

        clearTimeout(delayTimer);
        delayTimer = setTimeout(async function() {
            onRequest();

            // const result = await axios('https://woentsorgen.de:8443/search/' + text, {
            const result = await axios('https://localhost:8443/search/' + text, {
                headers: {"lang": lang},
                httpsAgent: new https.Agent({
                    rejectUnauthorized: false
                })
            });
            // await sleep(2000);

            const data = result.data;
            // TODO handle http errors (they are returned here, not in onrejected)
            const array = Array.isArray(data) ? data : [];
            onResults(array);

        }, 300); // Delay a little, to not send a request on each keystroke
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
