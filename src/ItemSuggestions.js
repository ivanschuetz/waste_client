import React from "react";
import './App.css';
import {useTranslation} from "react-i18next";

const ItemSuggestions = ({suggestions, searchText, onClick, highlightedIndex}) => {
    const { t } = useTranslation();

    const suggestionClassName = (index) => {
        if (index === highlightedIndex) {
            return "suggestion-highlighted"
        } else {
            return "suggestion"
        }
    };

    const listItems = () => {
        return suggestions.map((suggestion, index) =>
            <li key={suggestion.id} className="suggestion-item">
                <div className={suggestionClassName((index))} onClick={() => onClick(suggestion)}>{suggestion.name}</div>
            </li>
        ).concat(
            <li className="missingItemListItem" key='suggestion_not_found'>
                <a className="missingItemLink" href= {
                    // "mailto:contact@woentsorgen.de?subject=" + searchText + "&body=" + searchText
                    "mailto:contact@woentsorgen.de?subject="
                    + t('email_missing_item_subject') + searchText + "&body="
                    + t('email_missing_item_body')
                }
                   target="_blank">{t('suggestion_not_found')}</a>
            </li>
        );
    };

    return (
        <ul className="suggestions">
            {listItems()}
        </ul>
    );
};

export default ItemSuggestions;
