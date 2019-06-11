import React, {useState} from "react";
import './App.css';
import SearchBox from "./SearchBox";
import ItemSuggestions from "./ItemSuggestions";
import ItemSearch from "./SearchResults";

import PContainersMap from "./PContainersMap";

const App = () => {
    const [suggestions, setSuggestions] = useState([]);
    const [selectedSuggestion, setSelectedSuggestion] = useState(null);
    const [results, setResults] = useState(null);

    const handleSuggestions = suggestions => {
        console.log('suggestions: ' + JSON.stringify(suggestions));
        setSuggestions(suggestions)
    };

    const onSuggestionClick = suggestion => {
        console.log('clicked suggestion: ' + JSON.stringify(suggestion));
        setSelectedSuggestion(suggestion)
    };

    const handleResults = results => {
        console.log('results: ' + JSON.stringify(results));
        setResults(results)
    };

    return (
        <div className="App">
            <SearchBox onResults={handleSuggestions}/>
            <ItemSuggestions suggestions={suggestions} onClick={onSuggestionClick} />
            {selectedSuggestion && <ItemSearch suggestion={selectedSuggestion} onResult={handleResults}/>}
            {results && <PContainersMap pContainers={results["pcontainers"]}/>}
        </div>);
};

export default App;
