import React, {useState, useEffect} from "react";
import './App.css';
import {useTranslation} from "react-i18next";

const ItemSuggestions = ({suggestions, onClick}) => {
    const { t } = useTranslation();
    const [highlightedIndex, setHighlightedIndex] = useState(0);

    const keepInBounds = (newIndex) => Math.max(Math.min(newIndex, suggestions.length - 1), 0);

    useEffect(() => {
        const keyDownListener = ({key}) => {
            if (key === "ArrowDown") {
                setHighlightedIndex(keepInBounds(highlightedIndex + 1));
            } else if (key === "ArrowUp") {
                setHighlightedIndex(keepInBounds(highlightedIndex - 1));
            } else if (key === "Enter") {
                onClick(suggestions[highlightedIndex])
            }
        };

        window.addEventListener('keydown', keyDownListener);
        // Remove event listeners on cleanup
        return () => {
            window.removeEventListener('keydown', keyDownListener);
        };
    }, [highlightedIndex]); // Empty array ensures that effect is only run on mount and unmount

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
                <a className="missingItemLink" href="mailto:contact@woentsorgen.de&su=fooo" target="_blank">{t('suggestion_not_found')}</a>
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
