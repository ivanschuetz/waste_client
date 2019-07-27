import React, {useState, useEffect} from "react";
import './App.css';

const ItemSuggestions = ({suggestions, onClick, highlightedIndex, highlightBorder}) => {
    const [isTouchscreen, setIsTouchscreen] = useState(false);

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

    let classNames = highlightBorder ? "suggestions suggestions-highlight" : "suggestions";

    useEffect(() => {
        window.addEventListener('touchstart', () => {
            // the user touched the screen!
            setIsTouchscreen(!isTouchscreen);
        });
    });

    if (isTouchscreen) {
        classNames = classNames + " suggestions-mobile";
    }

    return (
        <ul className={classNames}>
            {listItems()}
        </ul>
    );
};

export default ItemSuggestions;
