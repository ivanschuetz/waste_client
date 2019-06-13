import React, {useState} from "react";
import './App.css';
import SearchBox from "./SearchBox";
import ItemSuggestions from "./ItemSuggestions";
import ItemSearch from "./SearchResults";
import PContainersMap from "./PContainersMap";
import Modal from "./Modal";
import ProgressBar from "./ProgressBar";

const App = () => {
    const [suggestions, setSuggestions] = useState([]);
    const [selectedSuggestion, setSelectedSuggestion] = useState(null);
    const [showingSuggestions, setShowingSuggestions] = useState(false);
    const [results, setResults] = useState(null);
    const [showMap, setShowMap] = useState(false);
    const [showAboutModal, setShowAboutModal] = useState(false);
    const [searchText, setSearchText] = useState("");
    const [showProgressBar, setShowProgressBar] = useState(false);

    const searchBoxRef = React.createRef();

    const handleSuggestions = suggestions => {
        console.log('suggestions: ' + JSON.stringify(suggestions));
        setShowingSuggestions(true);
        setSuggestions(suggestions);
    };

    const onSuggestionClick = suggestion => {
        console.log('clicked suggestion: ' + JSON.stringify(suggestion));
        setSelectedSuggestion(suggestion);
        setSearchText(suggestion.name);
        setShowingSuggestions(false);
        setShowProgressBar(true);
    };

    const handleResults = results => {
        setResults(results);
        setShowProgressBar(false);
    };

    const handleSearchBoxInput = text => {
        // Note that the search is performed inside the search box bomponent. Probably this should be restructured.
        setSearchText(text);
    };

    const onPContainersClick = () => setShowMap(true);

    return (
        <div className="App">
            {showProgressBar && <ProgressBar/>}
            <div className="top">
                <div className="page-title">Wohin damit?</div>
                <SearchBox onResults={handleSuggestions} onInput={handleSearchBoxInput} ref={searchBoxRef}
                           searchText={searchText}/>
            </div>
            {showingSuggestions && <ItemSuggestions suggestions={suggestions} onClick={onSuggestionClick}/>}
            <div className="all-results">
                {selectedSuggestion && <ItemSearch suggestion={selectedSuggestion} onResult={handleResults}
                                                   onPContainersClick={onPContainersClick}
                                                   showPContainersButton={!showMap}
                />}
                {results && showMap && <PContainersMap pContainers={results["pcontainers"]}/>}
            </div>
            <div className="footer">
                <a href="mailto:ivanschuetz@gmail.com">Feedback</a> | <a
                onClick={() => setShowAboutModal(!showAboutModal)}>Impressum</a>
            </div>
            {showAboutModal &&
            <Modal>
                <p>Ivan Schütz</p>
                <p>Birkenstraße 15</p>
                <p>10559 Berlin</p>
                <p>Deutschland</p>
                <button onClick={() => setShowAboutModal(false)}>Close</button>
            </Modal>}
        </div>);
};

export default App;
