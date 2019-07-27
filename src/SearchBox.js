import React from "react";
import './App.css';
import { useTranslation } from "react-i18next";
import {requestSuggestions} from "./Requests";

let delayTimer;

const SearchBox = ({ onSuggestions, onInput, searchText, onSuggestionsRequest, isShowingSuggestions, onFocus, onBlur }) => {
    const { t } = useTranslation();

    const suggestions = async (text) => {
        clearTimeout(delayTimer);
        delayTimer = setTimeout(async function () {
            onSuggestions(await requestSuggestions(text, onSuggestionsRequest));
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
            autoComplete="off"
            autoCapitalize="off"
            autoCorrect="off"
            aria-autocomplete="none"
            onFocus={() => onFocus()}
            onBlur={() => onBlur()}
        />
    );
};

export default SearchBox;
