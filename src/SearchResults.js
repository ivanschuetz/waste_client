import React, {useState, useEffect} from "react";
import './App.css';
import {useTranslation} from "react-i18next";
import i18n from 'i18next';
import {groupBy, routeLink} from "./Utils";
import {isOpenNow} from "./Time";
import OpeningHours from "./OpeningHours";
import {auth} from "./globals";

import SVGIcon from './icons/SVGIcon';
import {useWindowSize} from "./WindowSizeHook";

const axios = require('axios');

const deg2rad = (deg) => {
    return deg * (Math.PI / 180)
};

const getCrowDistanceFromLatLonInKm = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Radius of the earth in km
    const dLat = deg2rad(lat2 - lat1);  // deg2rad below
    const dLon = deg2rad(lon2 - lon1);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c; // Distance in km
    return d;
};

String.prototype.trunc = String.prototype.trunc ||
    function(n){
        return (this.length > n) ? this.substr(0, n-1) + '...' : this;
    };

const SearchResults = ({results, onPContainersClick, showPContainersButton}) => {
    const {t} = useTranslation();
    const [myLoc, setMyLoc] = useState(null);
    const [maxPickupCompaniesLength, setMaxPickupCompaniesLength] = useState(3);
    const [maxDisposalPlacesLength, setMaxDisposalPlacesLength] = useState(3);
    const [maxDonationPlacesLength, setMaxDonationPlacesLength] = useState(3);
    const [maxSecondHandPlacesLength, setMaxSecondHandPlacesLength] = useState(3);
    const [maxOnlineShopsLength, setMaxOnlineShopsLength] = useState(3);
    const [maxRetailersLength, setMaxRetailersLength] = useState(3);
    const windowSize = useWindowSize();

    const categories = results['categories'];
    const containers = results['containers'];
    const itemRecipients = results['itemRecipients'];
    const categoryRecipients = results['categoryRecipients'];

    const recipients = itemRecipients.concat(categoryRecipients);

    const recipientsByIdMap = Object.assign({}, ...recipients.map(r => ({[r["id"]]: false})));
    const [expandedRecipientsState, setExpandedRecipientsState] = useState(recipientsByIdMap);

    // Add open field to recipients for quick access when sorting
    recipients.forEach((recipient) => {
        // We show open status only when closed. So we use "open" as default - which means we have to mark "unknown" as "open"
        // Note that ideally there should be no unknowns. We should ensure that the db has the opening times of everything.
        recipient["isOpen"] = (recipient["openType"] === "u" || recipient["openType"] === "a") ?
            { isOpen: true, isHoliday: false } : { isOpen: false, isHoliday: false };
        const open = recipient["open"];
        if (open) {
            const hours = open["hours"];
            if (hours) {
                recipient["isOpen"] = isOpenNow(hours);
            }
        }
    });

    // Adds distance to recipients if myLoc is set (for quick access when sorting)
    if (myLoc) {
        recipients.forEach((recipient) => {
            const recipientLat = recipient["lat"];
            const recipientLon = recipient["lon"];
            if (recipientLat && recipientLon) {
                recipient["distance"] = getCrowDistanceFromLatLonInKm(myLoc.latitude, myLoc.longitude, recipientLat, recipientLon)
            }
        });
    }

    const itemTips = results['itemTips'];
    const categoryTips = results['categoryTips'];
    const tips = itemTips.concat(categoryTips);

    const groupedRecipients = groupBy(recipients, 'type');

    const allUnsortedDisposalPlaces = (groupedRecipients[0] || []).filter((place) => place["hasInPlace"]);
    const allUnsortedDonationPlaces = (groupedRecipients[1] || []);
    const allUnsortedSecondHandPlaces = (groupedRecipients[2] || []);
    const allUnsortedOnlineShops = (groupedRecipients[3] || []);
    const allUnsortedRetailers = (groupedRecipients[4] || []);
    const allUnsortedPickupCompanies = recipients.filter((recipient) => recipient["hasPickup"]);

    const sortByDistance = (recipients) => recipients.sort((a, b) => {
        const aIsOpenInt = a['isOpen'].isOpen ? 1 : 0;
        const bIsOpenInt = b['isOpen'].isOpen  ? 1 : 0;
        const isOpenRes = bIsOpenInt - aIsOpenInt;
        if (isOpenRes !== 0) { // open shops go before not open shops
            return isOpenRes;
        } else if (a.hasOwnProperty('distance') && b.hasOwnProperty('distance')) { // Shorter distance first
            return a['distance'] - b['distance']
        } else if (a.hasOwnProperty('distance') && !b.hasOwnProperty('distance')) { // Dinstance before no distance
            return -1;
        } else if (!a.hasOwnProperty('distance') && b.hasOwnProperty('distance')) { // Dinstance before no distance
            return 1;
        } else {
            return 0;
        }
    });

    const disposalPlaces = sortByDistance(allUnsortedDisposalPlaces).slice(0, maxDisposalPlacesLength);
    const donationPlaces = sortByDistance(allUnsortedDonationPlaces).slice(0, maxDonationPlacesLength);
    const secondHandPlaces = sortByDistance(allUnsortedSecondHandPlaces).slice(0, maxSecondHandPlacesLength);
    const onlineShops = sortByDistance(allUnsortedOnlineShops).slice(0, maxOnlineShopsLength);
    const pickupCompanies = sortByDistance(allUnsortedPickupCompanies).slice(0, maxPickupCompaniesLength);
    const retailers = sortByDistance(allUnsortedRetailers).slice(0, maxRetailersLength);

    const recipientsWithGeoLocation = recipients.filter((pc) => pc["lat"] && pc["lon"]);

    const displayLocationInfo = (position) => setMyLoc(position.coords);

    useEffect(() => {
        const fetchMyLoc = async () => {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(displayLocationInfo);
            } else {
                // no can do
                console.log('No geolocation available');
            }
        };
        fetchMyLoc();
    }, []);

    const listItems = () => {
        const categoriesHeaderTranslationKey = categories.length > 1 ? 'results_header_categories_plural' : 'results_header_categories_singular';
        const categoryListItem =
            <li key='category' className="list-item-categories">
                <span className="categories-tag">
                    {t(categoriesHeaderTranslationKey)}:&nbsp;
                    <span className="categories-string">{categories.map((category) => category.name).join(", ")}</span>
                </span>
            </li>;

        const containersListItems = containers.map(container => {
            const colorsStr = container["color"];
            const colors = colorsStr.split(",");

            let background = "";
            let dotClass = "dot";
            switch (colors.length) {
                case 1:
                    const color = colors[0];
                    background = "#" + colors;
                    if (color === 'FFFFFF') { // hack... need to check bright colors instead
                        dotClass = 'dot-bordered';
                    }
                    dotClass = color === 'FFFFFF' ? 'dot-bordered' : 'dot';
                    break;
                case 2:
                    const color1 = colors[0];
                    const color2 = colors[1];
                    if (color1 === 'FFA500' && color2 === 'FFFF00') { // hack... need to check bright colors instead
                        dotClass = 'dot-bordered';
                    }
                    background = "linear-gradient( -45deg, #" + color1 + ", #" + color1 + " 49%, white 49%, white 51%, #" + color2 + " 51% )";
                    break;
                default:
                    console.log(`Invalid color string: ${colorsStr}`)
            }
            return <li className='container-list-item' key={'c' + container.id}>
                <span className={dotClass} style={{background: background, marginRight: 12, verticalAlign: "middle"}}/>
                <span style={{verticalAlign: "middle"}}>{container.name}</span>
            </li>
        });

        const recipientsTableRows = (recipients) => recipients.myFlatMap(recipient => {
            const isOpen = recipient["isOpen"];

            const phoneElement = () => {
                if (recipient["phone"]) {
                    return <a className={isOpen.isOpen ? 'recipient-data-link' : 'recipient-data-link-closed'}
                              href={"tel:" + recipient["phone"]}
                              onClick={ (e) => e.stopPropagation() }
                              title={t('results_phone_icon_title')}>
                        {/*<span style={{verticalAlign: 'middle'}}>{recipient["phone"]}</span>*/}
                        <SVGIcon name="phone-2" width="20px" height="20px" className="phone-icon" />
                    </a>
                } else {
                    return <span/>
                }
            };

            const phoneElementForDetails = () => {
                if (recipient["phone"]) {
                    return <div className='recipient-details-data-link-container'>
                        <a className={isOpen.isOpen ? 'recipient-data-link-for-details' : 'recipient-data-link-closed-for-details'}
                              href={"tel:" + recipient["phone"]}
                              title={t('results_phone_icon_title')}>
                            {/*<SVGIcon name="phone-2" width="20px" height="20px" className="phone-icon" />*/}
                            <span style={{verticalAlign: 'middle'}}>{recipient["phone"]}</span>
                        </a>
                    </div>
                } else {
                    return <span/>
                }
            };

            const emailElement = () => {
                if (recipient["email"]) {
                    return <a className={isOpen.isOpen ? 'recipient-data-link' : 'recipient-data-link-closed'}
                           href={"mailto:" + recipient["email"]}
                           target='_blank'
                           onClick={ (e) => e.stopPropagation() }
                           title={t('results_email_icon_title')}
                           rel='noopener noreferrer'>
                            <SVGIcon name="email" width="20px" height="20px" className="map-icon" />
                        </a>
                } else {
                    return <span/>
                }
            };

            const emailElementForDetails = () => {
                if (recipient["email"]) {
                    return <div className='recipient-details-data-link-container'>
                        <a className={isOpen.isOpen ? 'recipient-data-link-for-details' : 'recipient-data-link-closed-for-details'}
                                  href={"mailto:" + recipient["email"]}
                                  target='_blank'
                                  title={t('results_email_icon_title')}
                                  rel='noopener noreferrer'>
                            {/*<SVGIcon name="email" width="20px" height="20px" className="map-icon" />*/}
                            <span style={{verticalAlign: 'middle'}}>{recipient["email"]}</span>
                        </a>
                    </div>
                } else {
                    return <span/>
                }
            };

            const nameElement = () => {
                const name = recipient["name"];
                // This is a little hack to translate a recipient name. Names are not translatable.
                // But in this case, we use the name as a message: "where you bought it".
                // We translate this special case client side instead of changing the backend structure.
                const actualName = name === "seller_translate_clientside" ? t('retailer_name_where_you_bought_it') : name;
                const nameMaxChars = windowSize.width < 400 ? 17 : windowSize < 500 ? 25 : 40;
                const nameToShow = actualName.trunc(nameMaxChars);
                const fullText = isOpen.isOpen ? nameToShow : nameToShow + ' (' + t('results_recipient_closed') + ')';
                const fullTextWithHoliday = isOpen.isHoliday ? fullText + ' (' + t('results_recipient_closed_holiday') + ')' : fullText;
                const fullTextElement = <span style={{verticalAlign: 'middle'}} >{fullTextWithHoliday}</span>;
                if (recipient["url"]) {
                    return <a className={isOpen.isOpen ? 'recipient-name' : 'recipient-name-closed'} href={recipient["url"]} target='_blank'
                              rel='noopener noreferrer' onClick={ (e) => e.stopPropagation() }>
                        { fullTextElement }
                    </a>
                } else {
                    return fullTextElement;
                }
            };

            const distanceElement = () => {
                if (!myLoc) return <span/>;
                const lat = recipient["lat"];
                const lng = recipient["lon"];
                if (lat && lng) {
                    const distance = getCrowDistanceFromLatLonInKm(myLoc.latitude, myLoc.longitude, lat, lng);
                    return <a
                        title={t('result_distance_linear_tooltip')}
                        href={routeLink(myLoc, lat, lng, "driving")}
                        target='_blank'
                        className={isOpen.isOpen ? 'results-distance-link' : 'results-distance-link-closed'}
                        rel='noopener noreferrer'>
                        <span className='result-distance-number'>{distance.toFixed(1)}</span>&nbsp;
                        <span className='result-distance-unit'>{t('result_distance_km')}</span>
                    </a>
                }
            };

            const recipientTypeImagePath = (type, isOpen) => {
                switch (type) {
                    case 0: return isOpen["isOpen"] ? "public-disposal-1" : "public-disposal-1-closed";
                    case 1: return isOpen["isOpen"] ? "heart" : "heart-closed";
                    case 2: return isOpen["isOpen"] ? "2nd-hand" : "2nd-hand-closed";
                    case 3: return isOpen["isOpen"] ? "ebay-laptop" : "ebay-laptop-closed";
                    case 4: return isOpen["isOpen"] ? "online-shop-retailer" : "online-shop-retailer";
                    // case 4: return isOpen ? "online-shop-retailer" : "online-shop-retailer-closed"; // TODO
                    default: return null;
                }
            };

            const recipientTypeTitle = (type) => {
                switch (type) {
                    case 0: return t("results_recipient_type_title_disposal_place");
                    case 1: return t("results_recipient_type_title_donation");
                    case 2: return t("results_recipient_type_title_2hand");
                    case 3: return t("results_recipient_type_title_online_shop");
                    case 4: return t("results_recipient_type_title_retailer");
                    default: return null;
                }
            };

            const recipientTypeElement = () => {
                const type = recipient["type"];
                const imagePath = recipientTypeImagePath(type, recipient["isOpen"]);
                if (imagePath) {
                    return <div title={recipientTypeTitle(type)}><SVGIcon name={imagePath} width="20px" height="20px" /></div>
                } else {
                    return <span />
                }
            };

            const hasPickupElement = () => {
                const hasPickup = recipient["hasPickup"];
                if (hasPickup) {
                    return <div title={t('results_recipient_type_title_has_pickup')}><SVGIcon name="truck" width="20px" height="20px" /></div>
                } else {
                    return <span />
                }
            };

            const recipientRowClicked = () => {
                const expandedState = JSON.parse(JSON.stringify(expandedRecipientsState));
                expandedState[recipient["id"]] = !expandedState[recipient["id"]];
                setExpandedRecipientsState(expandedState);
            };

            const openingHoursElement = () => {
                if (recipient["open"] && recipient["open"]["hours"]) {
                    return <div >
                        <OpeningHours openingHoursList={recipient["open"]["hours"]} mode="list"/>
                    </div>
                } else {
                    return <span/>
                }
            };

            const hasDetails = recipient["address"] || recipient["phone"] || recipient["email"] ||
                (recipient["open"] && recipient["open"]["hours"]);

            const rows = [
                <tr key={'p' + recipient["id"]} className={hasDetails ? "recipient-row-interactive" : "recipient-row"} onClick={() => recipientRowClicked()}>
                    <td> {nameElement()}{phoneElement()}{emailElement()} </td>
                    <td className="recipient-cell-right"> {hasPickupElement()} </td>
                    <td className="recipient-cell-right"> {recipientTypeElement()} </td>
                    <td className="recipient-cell-right"> {distanceElement()} </td>
                    {/*{company.address}*/}
                </tr>
            ];

            if (hasDetails) {
                const className = (expandedRecipientsState[recipient["id"]] ? "results-details-row-expanded" : "results-details-row-collapsed");
                rows.push(<tr key={'pdetails' + recipient['id']}>
                    <td colSpan={4}>
                        <div className={className}>
                            <div className='recipient-details-data-link-container'>
                                {recipient["address"]}
                            </div>
                            {phoneElementForDetails()}
                            {emailElementForDetails()}
                            {openingHoursElement()}
                        </div>
                    </td>
                </tr>);
            }

            return rows;
        });

        let recipientsWithGeolocationHeader;
        if (recipientsWithGeoLocation.length > 0) {
            if (showPContainersButton) {
                recipientsWithGeolocationHeader =
                    <li key='pcont' className='result-header-p-containers'>
                        <div className='p-containers-link' onClick={onPContainersClick}>
                            <div className='p-containers-span'>
                                <SVGIcon name="map" width="20px" height="20px" className="map-icon" />
                                <span
                                    style={{verticalAlign: 'middle'}}>{t('results_header_public_containers')} ({recipientsWithGeoLocation.length})</span>
                            </div>
                        </div>
                    </li>

            } else {
                recipientsWithGeolocationHeader =
                    <li key='pcontcheader' className='result-header-p-containers'>
                        {/*<div style={{marginTop: 20, fontWeight: 'bold', fontSize: 20}}>{t('results_header_public_containers')}</div>*/}
                    </li>;
            }
        }

        const tipsListItems = tips.map((tip, index) =>
            <li key={'tip' + index} className="list-item-tip">
                {/*<img src={require('./check.svg')} style={{verticalAlign: 'middle', marginRight: 5}} alt='map'/>*/}
                <span dangerouslySetInnerHTML={{__html: tip["text"]}}/>
            </li>
        );

        const recipentsSection = (key, recipients, allRecipients, maxRecipientsLength, setMaxRecipientsLength) => {
            return <li key={key}>
                <table className="p-recipients-table">
                    <tbody>{recipientsTableRows(recipients)}</tbody>
                </table>
                { allRecipients.length > maxRecipientsLength ?
                    <div>
                        <div className='show-more' onClick={() => {
                            setMaxRecipientsLength(allRecipients.length)
                        }}>
                            <span>{t('results_recipients_show_more')}</span>
                        </div>
                    </div> : <span/>
                }
            </li>
        };

        const pickupCompaniesListItem = recipentsSection('pickup-companies', pickupCompanies, allUnsortedPickupCompanies,
            maxPickupCompaniesLength, setMaxPickupCompaniesLength);

        const donationsPlacesListItem = recipentsSection('donation-places', donationPlaces, allUnsortedDonationPlaces,
            maxDonationPlacesLength, setMaxDonationPlacesLength);

        const trashPlacesListItem = recipentsSection('trash-places', disposalPlaces, allUnsortedDisposalPlaces,
            maxDisposalPlacesLength, setMaxDisposalPlacesLength);

        const secondHandPlacesListItem = recipentsSection('second-hand-places', secondHandPlaces, allUnsortedSecondHandPlaces,
            maxSecondHandPlacesLength, setMaxSecondHandPlacesLength);

        const onlineShopsListItem = recipentsSection('online-shops', onlineShops, allUnsortedOnlineShops,
            maxOnlineShopsLength, setMaxOnlineShopsLength);

        const retailersListItem = recipentsSection('retailers', retailers, allUnsortedRetailers,
            maxRetailersLength, setMaxRetailersLength);

        const containersHeader = <li key='contheader' className='result-header'>
            <SVGIcon name="container" width="20px" height="20px" className="result-header-icon" />
            <span>{t('results_header_containers')}</span></li>;
        const pickupCompaniesHeader = <li key='pickheader' className='result-header'>
            <SVGIcon name="truck" width="20px" height="20px" className="result-header-icon" />
            <span> {t('results_header_pickup')} </span>
        </li>;
        const donationPlacesHeader = <li key='donationheader'
                                         className='result-header'>
            <SVGIcon name="heart" width="20px" height="20px" className="result-header-icon" />
            <span> {t('results_header_donations')} </span>
        </li>;
        const trashPlacesHeader = <li key='trashplacesheader'
                                      className='result-header'>
            <div>
                <SVGIcon name="public-disposal-1" width="20px" height="20px" className="result-header-icon" />
                <span> {t('results_header_trash_places')} </span>
            </div>
        </li>;
        const secondHandPlacesHeader = <li key='secondhandplacesheader'
                                           className='result-header'>
            <SVGIcon name="2nd-hand" width="20px" height="20px" className="result-header-icon" />
            <span> {t('results_header_second_hand')} </span>
        </li>;
        const onlineShopsHeader = <li key='onlineshopsheader'
                                           className='result-header'>
            <SVGIcon name="ebay-laptop" width="20px" height="20px" className="result-header-icon" />
            <span> {t('results_header_online_shops')} </span>
        </li>;
        const retailersHeader = <li key='retailersshopsheader'
                                      className='result-header'>
            <SVGIcon name="online-shop-retailer" width="20px" height="20px" className="result-header-icon" />
            <span> {t('results_header_retailers')} </span>
        </li>;
        const tipsHeader = <li key='tipheader'
                                className='result-header'>
            <SVGIcon name="tips" width="20px" height="20px" className="result-header-icon" />
            <span>{t('results_header_tips')}</span>
        </li>;

        const categorylistItemList = [categoryListItem];
        const containersHeaderList = containersListItems.length > 0 ? [containersHeader] : [];
        const pickupCompaniesHeaderList = pickupCompanies.length > 0 ? [pickupCompaniesHeader] : [];
        const donationPlacesHeaderList = donationPlaces.length > 0 ? [donationPlacesHeader] : [];
        const trashPlacesHeaderList = disposalPlaces.length > 0 ? [trashPlacesHeader] : [];
        const secondHandPlacesHeaderList = secondHandPlaces.length > 0 ? [secondHandPlacesHeader] : [];
        const onlineShopsHeaderList = onlineShops.length > 0 ? [onlineShopsHeader] : [];
        const retailersHeaderList = retailers.length > 0 ? [retailersHeader] : [];
        const tipsHeaderList = tipsListItems.length > 0 ? [tipsHeader] : [];

        return categorylistItemList
            .concat(containersHeaderList)
            .concat(containersListItems)
            .concat(tipsHeaderList)
            .concat(tipsListItems)
            .concat(donationPlacesHeaderList)
            .concat(donationsPlacesListItem)
            .concat(secondHandPlacesHeaderList)
            .concat(secondHandPlacesListItem)
            .concat(retailersHeaderList)
            .concat(retailersListItem)
            .concat(pickupCompaniesHeaderList)
            .concat(pickupCompaniesListItem)
            .concat(trashPlacesHeaderList)
            .concat(trashPlacesListItem)
            .concat(onlineShopsHeaderList)
            .concat(onlineShopsListItem)
            .concat(recipientsWithGeolocationHeader)
    };

    return (
        <ul className='results-list'>
            {listItems()}
        </ul>
    );
};

const ItemSearch = ({suggestion, onResult, onPContainersClick, showPContainersButton}) => {
    const [results, setResults] = useState(null);

    useEffect(() => {
        setResults(null); // When selecting a new suggestion, stop showing current results immediately

        const fetchData = async () => {
            const lang = i18n.language;
            const result = await axios('https://wohin-mit.de:8443/options/' + suggestion.id, {
            // const result = await axios('http://localhost:8080/options/' + suggestion.id, {
                headers: {"lang": lang},
                auth: auth
            });
            // await sleep(2000);

            const finalResult = result.data.hasOwnProperty("containers") ? result.data : null;
            setResults(finalResult);
            onResult(finalResult);
        };
        fetchData();
    }, [suggestion.id]);

    return results && <SearchResults results={results}
                                     onPContainersClick={onPContainersClick}
                                     showPContainersButton={showPContainersButton}
                                     />
};

export default ItemSearch;
