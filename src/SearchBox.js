import React, {useState} from "react";
import './App.css';

const SearchBox = ({onResults}) => {
    const [searchText, setSearchText] = useState("");

    const search = (text) => {
        if (!text) {
            onResults([]);
            return;
        }

        fetch('http://localhost:8080/search/' + text)
            .then(res => res.json())
            .then(
                (result) => {
                    // TODO handle http errors (they are returned here, not in onrejected)
                    const array = Array.isArray(result) ? result : [];
                    onResults(array)
                },
                (error) => {
                    console.error('call rejected: ' + JSON.stringify(error));
                }
            )
    };

    const onSearchInput = (text) => {
        setSearchText(text);
        search(text);
    };

    return (
        <input
            className="searchbox"
            type="text"
            value={searchText}
            onChange={event => onSearchInput(event.target.value)}
        />
    );
};

export default SearchBox;
