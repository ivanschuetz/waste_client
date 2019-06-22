import React, {useState} from "react";
import './App.css';
import SearchBox from "./SearchBox";
import ItemSuggestions from "./ItemSuggestions";
import ItemSearch from "./SearchResults";
import PContainersMap from "./PContainersMap";
import Modal from "./Modal";
import ProgressBar from "./ProgressBar";
import {useTranslation} from "react-i18next";
import i18n from 'i18next';
import Legal from "./Legal";
import * as ReactGA from 'react-ga'
require('react-leaflet-markercluster/dist/styles.min.css');

const App = () => {
    const [suggestions, setSuggestions] = useState([]);
    const [selectedSuggestion, setSelectedSuggestion] = useState(null);
    const [showingSuggestions, setShowingSuggestions] = useState(false);
    const [results, setResults] = useState(null);
    const [showMap, setShowMap] = useState(false);
    const [showAboutModal, setShowAboutModal] = useState(false);
    const [showLangModal, setShowLangModal] = useState(false);
    const [searchText, setSearchText] = useState("");
    const [showProgressBar, setShowProgressBar] = useState(false);
    const [showLegalModal, setShowLegalModal] = useState(false);
    const { t } = useTranslation();

    const handleSuggestions = suggestions => {
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

        ReactGA.event({ category: 'Search', action: 'Clicked suggestion', label: suggestion.name });
    };

    const onSuggestionEscape = suggestion => {
        setShowingSuggestions(false);
    };

    const handleResults = results => {
        setResults(results);
        setShowProgressBar(false);
    };

    const handleSearchBoxInput = text => {
        // Note that the search is performed inside the search box bomponent. Probably this should be restructured.
        setSearchText(text);
    };

    const onPContainersClick = () => {
        setShowMap(true);
        ReactGA.event({ category: 'Navigation', action: 'Opened public containers' });
    };

    const setLanguage = async (lang) => {
        await i18n.changeLanguage(lang, null);
        ReactGA.event({ category: 'Settings', action: 'Changed language', label: lang });
    };

    const languageName = (code) => {
        switch (code) {
            case "de": return "Deutsch";
            case "en": return "English";
            default:
                console.log("Unexpected language code: " + code + ", returning English.");
                return "English";
        }
    };

    const toggleLegalModal = () => {
        const newShow = !showLegalModal;
        setShowLegalModal(newShow);
        if (newShow) {
            ReactGA.event({ category: 'Navigation', action: 'Opened legal modal' });
        }
    };

    return (
        <div className="App">
            {showProgressBar && <ProgressBar/>}
            <div className="Wrapper">

                <div className="top">
                    <div className="page-title">{t('app_title')}</div>
                    <SearchBox onResults={handleSuggestions} onInput={handleSearchBoxInput}
                               searchText={searchText}/>
                </div>
                {showingSuggestions && <ItemSuggestions suggestions={suggestions}
                                                        onClick={onSuggestionClick}
                                                        onEscape={onSuggestionEscape}/>}
                <div className="all-results">
                    {selectedSuggestion && <ItemSearch suggestion={selectedSuggestion} onResult={handleResults}
                                                       onPContainersClick={onPContainersClick}
                                                       showPContainersButton={!showMap}
                    />}
                    {results && showMap && <PContainersMap pContainers={results["pcontainers"]}/>}
                </div>
                <div className="footer">
                    <a className="feedback-link" href="mailto:contact@woentsorgen.de" target="_blank" rel="noopener noreferrer">
                        {t('link_feedback')}
                    </a> |&nbsp;
                    <span className="about-link" onClick={() => toggleLegalModal()} rel="noopener noreferrer">
                    {t('link_legal')}
                </span> |&nbsp;
                    <span className="lang-link" onClick={() => setShowLangModal(!showLangModal)}>{t('link_lang')}</span>
                </div>
                {showAboutModal &&
                <Modal onCloseClick={() => setShowAboutModal(false)}>
                </Modal>}
                {showLegalModal &&
                <Modal title={t('legal_modal_title')} onCloseClick={() => setShowLegalModal(false)}>
                    <Legal/>
                </Modal>}
                {showLangModal &&
                <Modal title={t('lang_modal_title')} onCloseClick={() => setShowLangModal(false)}>
                    <p className={(i18n.language === "de") ? 'lang-selected' : 'lang'} onClick={() => setLanguage("de")}>Deutsch</p>
                    <p className={(i18n.language === "en") ? 'lang-selected' : 'lang'} onClick={() => setLanguage("en")}>English</p>
                </Modal>}

            </div>
        </div>);
};

export default App;
