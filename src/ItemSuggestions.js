import React from "react";
import './App.css';

const ItemSuggestions = ({suggestions, onClick, highlightedIndex, highlightBorder}) => {
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
        )
    };

    const classNames = highlightBorder ? "suggestions suggestions-highlight" : "suggestions";

    return (
        <ul className={classNames}>
            {listItems()}
        </ul>
    );
};

export default ItemSuggestions;
