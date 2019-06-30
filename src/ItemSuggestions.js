import React from "react";
import './App.css';

const ItemSuggestions = ({suggestions, onClick, highlightedIndex}) => {
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

    return (
        <ul className="suggestions">
            {listItems()}
        </ul>
    );
};

export default ItemSuggestions;
