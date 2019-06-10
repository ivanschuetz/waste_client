import React, {useState} from "react";
import './App.css';
import SearchBox from "./SearchBox";
import ItemSuggestions from "./ItemSuggestions";
import ItemSearch from "./SearchResults";

const App = () => {
    console.log('redering app');

    const [suggestions, setSuggestions] = useState([]);
    const [selectedSuggestion, setSelectedSuggestion] = useState(null);

    const handleSuggestions = suggestions => {
        console.log('suggestions: ' + JSON.stringify(suggestions));
        setSuggestions(suggestions)
    };

    const onSuggestionClick = suggestion => {
        console.log('clicked suggestion: ' + JSON.stringify(suggestion));
        setSelectedSuggestion(suggestion)
    };

    const bar = selectedSuggestion && <ItemSearch item={selectedSuggestion} />
    console.log('selectedSuggestion: ' + selectedSuggestion);
    console.log('bar: ' + bar);

    return (
        <div className="App">
            <SearchBox onResults={handleSuggestions}/>
            <ItemSuggestions suggestions={suggestions} onClick={onSuggestionClick} />
            {selectedSuggestion && <ItemSearch suggestion={selectedSuggestion} />}
        </div>);
};

export default App;
