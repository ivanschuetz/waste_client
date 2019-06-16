import React from "react";
import './App.css';

const ItemSuggestions = ({suggestions, onClick}) => {

    const listItems = () => {
        return suggestions.map(suggestion =>
            <li key={suggestion.id} className="suggestion-item">
                <div className="suggestion" onClick={() => onClick(suggestion)}>{suggestion.name}</div>
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
