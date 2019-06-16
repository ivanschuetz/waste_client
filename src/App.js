import React, {useState} from "react";
import './App.css';
import SearchBox from "./SearchBox";
import ItemSuggestions from "./ItemSuggestions";
import ItemSearch from "./SearchResults";
import PContainersMap from "./PContainersMap";
import Modal from "./Modal";
import ProgressBar from "./ProgressBar";
require('react-leaflet-markercluster/dist/styles.min.css');

const App = () => {
    const [suggestions, setSuggestions] = useState([]);
    const [selectedSuggestion, setSelectedSuggestion] = useState(null);
    const [showingSuggestions, setShowingSuggestions] = useState(false);
    const [results, setResults] = useState(null);
    const [showMap, setShowMap] = useState(false);
    const [showAboutModal, setShowAboutModal] = useState(false);
    const [searchText, setSearchText] = useState("");
    const [showProgressBar, setShowProgressBar] = useState(false);

    const handleSuggestions = suggestions => {
        console.log('suggestions: ' + JSON.stringify(suggestions));
        setShowingSuggestions(true);
        setSuggestions(suggestions);
        // Hide the suggestions box when there are no results, otherwise the border will show below the search box
        if (suggestions && suggestions.length === 0) {
            setShowingSuggestions(false);
        }
    };

    const onSuggestionClick = suggestion => {
        setSearchText(suggestion.name);
        setShowingSuggestions(false);
        if (selectedSuggestion && suggestion["id"] === selectedSuggestion["id"]) {
            return;
        }
        setSelectedSuggestion(suggestion);
        setShowProgressBar(true);
        setShowMap(false);
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
                <SearchBox onResults={handleSuggestions} onInput={handleSearchBoxInput}
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
                <a className="feedback-link" href="mailto:ivanschuetz@gmail.com" target="_blank" rel="noopener noreferrer">Feedback</a> |&nbsp;
                <span className="about-link" onClick={() => setShowAboutModal(!showAboutModal)} rel="noopener noreferrer">Impressum</span>
            </div>
            {showAboutModal &&
            <Modal onCloseClick={() => setShowAboutModal(false)}>
                <p>Ivan Schütz</p>
                <p>Birkenstraße 15</p>
                <p>10559 Berlin</p>
                <p>Deutschland</p>
            </Modal>}
        </div>);
};

export default App;
