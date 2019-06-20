import React from "react";
import './App.css';
import {useTranslation} from "react-i18next";

const ItemSuggestions = ({suggestions, onClick}) => {
    const { t } = useTranslation();

    const listItems = () => {
        return suggestions.map(suggestion =>
            <li key={suggestion.id} className="suggestion-item">
                <div className="suggestion" onClick={() => onClick(suggestion)}>{suggestion.name}</div>
            </li>
        ).concat(
            <li className="missingItemListItem">
                <a className="missingItemLink" href="mailto:ivanschuetz@gmail.com&su=fooo" target="_blank">{t('suggestion_not_found')}</a>
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
