import React, { useEffect, useState } from "react";
import './App.css';
import SearchBox from "./SearchBox";
import ItemSuggestions from "./ItemSuggestions";
import ItemSearch from "./SearchResults";
import RecipientsMap from "./RecipientsMap";
import Modal from "./Modal";
import ProgressBar from "./ProgressBar";
import { useTranslation } from "react-i18next";
import i18n from 'i18next';
import Legal from "./Legal";
import * as ReactGA from 'react-ga'
import Helmet from "react-helmet/es/Helmet";
import { auth } from "./globals";

import Logo from './logo/Logo';
import Social from "./Social";
import {FacebookIcon, TwitterIcon} from "react-share";

require('react-leaflet-markercluster/dist/styles.min.css');

const axios = require('axios');

let cancelSuggestionResponseProcessing = false; // This doesn't work well as hook so here

const App = () => {
    const [suggestions, setSuggestions] = useState([]);
    const [selectedSuggestion, setSelectedSuggestion] = useState(null);
    const [showingSuggestions, setShowingSuggestions] = useState(false);
    const [results, setResults] = useState(null);
    const [showMap, setShowMap] = useState(false);
    const [showNoResults, setShowNoResults] = useState(false);
    const [showAboutModal, setShowAboutModal] = useState(false);
    const [showLangModal, setShowLangModal] = useState(false);
    const [showSocialModal, setShowSocialModal] = useState(false);
    const [searchText, setSearchText] = useState("");
    const [showProgressBar, setShowProgressBar] = useState(false);
    const [showLegalModal, setShowLegalModal] = useState(false);
    const [lastSearchText, setLastSearchText] = useState("");
    const [searchBoxFocused, setSearchBoxFocused] = useState(false);

    const [highlightedIndex, setHighlightedIndex] = useState(-1);
    const keepInBounds = (newIndex) => Math.max(Math.min(newIndex, suggestions.length - 1), 0);

    const { t } = useTranslation();

    useEffect(() => {
        const keyDownListener = ({ key }) => {
            if (key === "ArrowDown") {
                setHighlightedIndex(keepInBounds(highlightedIndex + 1));
            } else if (key === "ArrowUp") {
                setHighlightedIndex(keepInBounds(highlightedIndex - 1));
            } else if (key === "Enter") {
                if (highlightedIndex >= 0 && highlightedIndex < suggestions.length) {
                    onSuggestionClick(suggestions[highlightedIndex]);
                } else {
                    search(searchText)
                }
            } else if (key === "Escape") {
                onSuggestionEscape();
            }
        };

        window.addEventListener('keydown', keyDownListener);
        // Remove event listeners on cleanup
        return () => {
            window.removeEventListener('keydown', keyDownListener);
        };
    }, [highlightedIndex, suggestions, searchText, selectedSuggestion]); // Empty array ensures that effect is only run on mount and unmount

    const lang = i18n.language;

    const search = async (text) => {
        setShowingSuggestions(false);

        if (!text || (selectedSuggestion && text.toLowerCase() === selectedSuggestion.name.toLowerCase())) {
            return;
        }

        setLastSearchText(text);

        handleSearchRequest();

        const result = await axios('https://wohin-mit.de:8443/search/' + text, {
        // const result = await axios('http://localhost:8080/search/' + text, {
            headers: { "lang": lang },
            auth: auth
        });
        // await sleep(2000);

        const data = result.data;
        // TODO handle http errors (they are returned here, not in onrejected)
        handleSearchResult(data);
    };

    const handleSuggestions = items => {
        if (cancelSuggestionResponseProcessing) return;

        setShowProgressBar(false);
        setShowingSuggestions(true);
        setSuggestions(items);
        // Hide the suggestions box when there are no results, otherwise the border will show below the search box
        if (items && items.length === 0) {
            setShowingSuggestions(false);
        }
    };

    const onSuggestionClick = suggestion => {
        setSearchText(suggestion.name);
        setShowingSuggestions(false);
        setHighlightedIndex(-1);
        if (selectedSuggestion && suggestion["id"] === selectedSuggestion["id"]) {
            return;
        }
        setSelectedSuggestion(suggestion);
        setShowProgressBar(true);
        setShowMap(false);

        ReactGA.event({ category: 'Search', action: 'Clicked suggestion', label: suggestion.name });
    };

    const handleSearchResult = item => {
        if (item) {
            setShowNoResults(false);
            onSuggestionClick(item);
        } else {
            setShowingSuggestions(false);
            setHighlightedIndex(-1);
            setShowProgressBar(false);
            setShowNoResults(true);
            clearResults();
        }
    };

    const onSuggestionEscape = suggestion => {
        setShowingSuggestions(false);
        setHighlightedIndex(-1);
    };

    const clearResults = () => {
        setSelectedSuggestion(null);
        setResults(null);
        setShowMap(false);
    };

    const handleResults = results => {
        setShowNoResults(false);
        setResults(results);
        setShowProgressBar(false);
    };

    const handleSearchBoxInput = text => {
        // Note that the search is performed inside the search box bomponent. Probably this should be restructured.
        setSearchText(text);
        // Always when there's a key stroke, allow processing the suggestions (to exit possible cancelled state set by search)
        cancelSuggestionResponseProcessing = false;
    };

    const handleSuggestionsRequest = () => {
        if (!cancelSuggestionResponseProcessing) {
            // console.log('suggestions request: showing pr');
            setShowProgressBar(true);
        }

    };

    const handleSearchRequest = () => {
        setShowProgressBar(true);
        // Don't process results of a possible suggestions request
        cancelSuggestionResponseProcessing = true;
    };

    const onPContainersClick = () => {
        setShowMap(true);
        ReactGA.event({ category: 'Navigation', action: 'Opened public containers' });
    };

    const setLanguage = async (lang) => {
        await i18n.changeLanguage(lang, null);
        ReactGA.event({ category: 'Settings', action: 'Changed language', label: lang });
    };

    const toggleLegalModal = () => {
        const newShow = !showLegalModal;
        setShowLegalModal(newShow);
        if (newShow) {
            ReactGA.event({ category: 'Navigation', action: 'Opened legal modal' });
        }
    };

    /*<a className="social-option" href="https://twitter.com/intent/tweet?text=Hello%20world">*/
    const shareOnTwitterHref = () => 'https://twitter.com/intent/tweet?text=' + t('social_share_subject');

    const logoImgName = (lang) => {
        if (lang.startsWith('de')) {
            return 'logo-de';
        } else {
            return 'logo-en'
        }
    };

    const beta1x = require('./icons/beta1x.png');
    const beta2x = require('./icons/beta2x.png');
    const beta4x = require('./icons/beta4x.png');
    const beta8x = require('./icons/beta8x.png');

    const BetaImage = () => (
        <img src={beta2x} srcSet={`${beta1x} 1x, ${beta2x} 2x, ${beta4x} 4x, ${beta8x} 8x`} className="beta-icon" />
    );

    return (
        <div className="App">
            <Helmet>
                <title>{t('meta_page_title')}</title>
            </Helmet>
            {showProgressBar && <ProgressBar />}

            <BetaImage />

            <div className="Wrapper">

                <div className="top">
                    <div className="page-title">
                        {/* <img width={300} src={require('./logo.png')} alt={t('app_title')} /> */}
                        <Logo name={logoImgName(lang)} width="300px" height="100%" className="page-title-icon" />
                    </div>
                    <SearchBox onSuggestions={handleSuggestions}
                        onInput={handleSearchBoxInput}
                        searchText={searchText}
                        onSuggestionsRequest={handleSuggestionsRequest}
                        isShowingSuggestions={showingSuggestions}
                        onFocus={() => setSearchBoxFocused(true)}
                        onBlur={() => setSearchBoxFocused(false)}
                    />
                </div>
                {showingSuggestions && <ItemSuggestions suggestions={suggestions}
                    onClick={onSuggestionClick}
                    highlightedIndex={highlightedIndex}
                    highlightBorder={searchBoxFocused}/>}
                <div className="all-results">
                    {selectedSuggestion && <ItemSearch suggestion={selectedSuggestion} onResult={handleResults}
                        onPContainersClick={onPContainersClick}
                        showPContainersButton={!showMap}
                    />}
                    {results && showMap &&
                        <RecipientsMap recipients={(results['itemRecipients'].concat(results['categoryRecipients'])).filter((r) =>
                            r["lat"] && r["lon"])
                        } />}
                </div>
                {showNoResults &&
                    <div>{t('search_no_results')}
                        <div className="no-results-search-text">{lastSearchText}</div>
                        <a className="request-item-link" href={
                            // "mailto:contact@wohin-mit.de?subject=" + searchText + "&body=" + searchText
                            "mailto:contact@wohin-mit.de?subject="
                            + t('email_missing_item_subject') + searchText + "&body="
                            + t('email_missing_item_body')
                        }
                            target="_blank">{t('search_empty_result_request_item')}</a>
                        {/*<a className="feedback-link" href="mailto:contact@wohin-mit.de" target="_blank" rel="noopener noreferrer">Request</a>*/}
                    </div>
                }
                <div className="footer">
                    <a className="feedback-link" href="mailto:contact@wohin-mit.de" target="_blank" rel="noopener noreferrer">
                        {t('link_feedback')}
                    </a> |&nbsp;
                    <span className="about-link" onClick={() => toggleLegalModal()} rel="noopener noreferrer">
                        {t('link_legal')}
                    </span> |&nbsp;
                    <span className="social-link"
                        onClick={() => setShowSocialModal(!showSocialModal)}>{t('link_social')}
                    </span> |&nbsp;
                    <span className="lang-link" onClick={() => setShowLangModal(!showLangModal)}>{t('link_lang')}
                    </span>
                    <a className="social-option" href="https://www.facebook.com/wohinmitapp" target="_blank"
                       rel="noopener noreferrer">
                        <FacebookIcon size={32} round/>
                    </a>
                    <a className="social-option" href="https://twitter.com/wohinmit" target="_blank"
                       rel="noopener noreferrer">
                        <TwitterIcon size={32} round/>
                    </a>
                </div>
                {showAboutModal &&
                    <Modal onCloseClick={() => setShowAboutModal(false)}>
                    </Modal>}
                {showLegalModal &&
                    <Modal title={t('legal_modal_title')} onCloseClick={() => setShowLegalModal(false)}>
                        <Legal />
                    </Modal>}
                {showLangModal &&
                    <Modal title={t('lang_modal_title')} onCloseClick={() => setShowLangModal(false)}>
                        <p className={(i18n.language.startsWith("de")) ? 'lang-selected' : 'lang'}
                            onClick={() => setLanguage("de")}>Deutsch</p>
                        <p className={(i18n.language.startsWith("en")) ? 'lang-selected' : 'lang'}
                            onClick={() => setLanguage("en")}>English</p>
                    </Modal>}
                {showSocialModal &&
                    <Modal title={t('social_modal_title')} onCloseClick={() => setShowSocialModal(false)}>
                        <Social/>
                    </Modal>}
            </div>
        </div>);
};

export default App;
