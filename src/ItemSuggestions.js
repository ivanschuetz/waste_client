import React from "react";
import './App.css';

const ItemSuggestions = ({suggestions, onClick}) => {

    const listItems = () => {
        console.log('generating listitems suggestions: ' + JSON.stringify(suggestions));
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
