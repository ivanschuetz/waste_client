import React from "react";
import './App.css';
import {useTranslation} from "react-i18next";

const SearchBox = ({onResults, onInput, searchText}) => {
    const { t } = useTranslation();

    const search = (text) => {
        if (!text) {
            onResults([]);
            return;
        }

        fetch('http://localhost:8080/search/' + text)
            .then(res => res.json())
            .then(
                (result) => {
                    // TODO handle http errors (they are returned here, not in onrejected)
                    const array = Array.isArray(result) ? result : [];
                    onResults(array)
                },
                (error) => {
                    console.error('call rejected: ' + JSON.stringify(error));
                }
            )
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
