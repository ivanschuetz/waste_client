import React from "react";
import './App.css';

const ItemSuggestions = ({suggestions, onClick}) => {

    const listItems = () => {
        console.log('generating listitems suggestions: ' + JSON.stringify(suggestions));
        return suggestions.map(suggestion =>
            <li key={suggestion.id}><a onClick={() => onClick(suggestion)}>{suggestion.name}</a></li>
        );
    };

    return (
        <ul>
            {listItems()}
        </ul>
    );
};

export default ItemSuggestions;
