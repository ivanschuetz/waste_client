import React, {useState, useEffect} from "react";
import './App.css';
import {useTranslation} from "react-i18next";
import i18n from 'i18next';
import {groupBy, routeLink} from "./Utils";
import {isOpenNow} from "./Time";
import OpeningHours from "./OpeningHours";

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

    const categories = results['categories'];
    const containers = results['containers'];
    const recipients = results['recipients'];

    const recipientsByIdMap = Object.assign({}, ...recipients.map(r => ({[r["id"]]: false})));
    const [expandedRecipientsState, setExpandedRecipientsState] = useState(recipientsByIdMap);

    // Add open field to recipients for quick access when sorting
    recipients.forEach((recipient) => {
        // We show open status only when closed. So we use "open" as default - which means we have to mark "unknown" as "open"
        // Note that ideally there should be no unknowns. We should ensure that the db has the opening times of everything.
        recipient["isOpen"] = recipient["openType"] === "u";
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

    const tips = results['tips'];

    const groupedRecipients = groupBy(recipients, 'type');

    const allUnsortedDisposalPlaces = (groupedRecipients[0] || []).filter((place) => place["hasInPlace"]);
    const allUnsortedDonationPlaces = (groupedRecipients[1] || []);
    const allUnsortedSecondHandPlaces = (groupedRecipients[2] || []);
    const allUnsortedPickupCompanies = recipients.filter((recipient) => recipient["hasPickup"]);

    const sortByDistance = (recipients) => recipients.sort((a, b) => {
        const aIsOpenInt = a['isOpen'] ? 1 : 0;
        const bIsOpenInt = b['isOpen'] ? 1 : 0;
        const isOpenRes = aIsOpenInt - bIsOpenInt;
        if (isOpenRes !== 0)   {
            return isOpenRes;
        } else if (a.hasOwnProperty('distance') && b.hasOwnProperty('distance')) {
            return a['distance'] - b['distance']
        } else if (!a.hasOwnProperty('distance') && !b.hasOwnProperty('distance')) {
            return 0;
        } else {
            throw Error("Invalid state: Either all objects have distance or none");
        }
    });

    const disposalPlaces = sortByDistance(allUnsortedDisposalPlaces).slice(0, maxDisposalPlacesLength);
    const donationPlaces = sortByDistance(allUnsortedDonationPlaces).slice(0, maxDonationPlacesLength);
    const secondHandPlaces = sortByDistance(allUnsortedSecondHandPlaces).slice(0, maxSecondHandPlacesLength);
    const pickupCompanies = sortByDistance(allUnsortedPickupCompanies).slice(0, maxPickupCompaniesLength);

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

        // If an item has "electro" and "small electro" show only electro. This is just to make the UI less verbose as showing both seems pointless.
        // This is a hack, though not sure what the proper solution would be. Seems ok for now to solve client side like this.
        let categoriesToShow = JSON.parse(JSON.stringify(categories));
        const electroCategoryId = 5; // Backend
        const smallElectroCategoryId = 100013; // Backend
        if (categoriesToShow.some((c) => c["id"] === electroCategoryId) && categoriesToShow.some((c) => c["id"] === smallElectroCategoryId)) {
            categoriesToShow = categoriesToShow.filter ((category) => category["id"] !== smallElectroCategoryId) // Remove small electro
        }

        const categoriesHeaderTranslationKey = categoriesToShow.length > 1 ? 'results_header_categories_plural' : 'results_header_categories_singular';
        const categoryListItem =
            <li key='category' className="list-item-categories">
                <span className="categories-tag">
                    {t(categoriesHeaderTranslationKey)}:&nbsp;
                    <span className="categories-string">{categoriesToShow.map((category) => category.name).join(", ")}</span>
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
                    if (color === 'FFFFFF') {
                        dotClass = 'dot-bordered';
                    }
                    dotClass = color === 'FFFFFF' ? 'dot-bordered' : 'dot';
                    break;
                case 2:
                    const color1 = colors[0];
                    const color2 = colors[1];
                    background = "linear-gradient( -45deg, #" + color1 + ", #" + color1 + " 49%, white 49%, white 51%, #" + color2 + " 51% )";
                    break;
                default:
                    console.log(`Invalid color string: ${colorsStr}`)
            }
            return <li className='container-list-item' key={'c' + container.id}>
                <span className={dotClass} style={{background: background, marginRight: 5}}/>
                {container.name}
            </li>
        });

        const recipientsTableRows = (recipients) => recipients.flatMap(recipient => {
            const isOpen = recipient["isOpen"];

            const phoneElement = () => {
                if (recipient["phone"]) {
                    return <a className={isOpen ? 'recipient-data-link' : 'recipient-data-link-closed'} href={"tel:" + recipient["phone"]}>
                        {/*<img src={require('./phone.svg')} style={{ verticalAlign: 'middle', marginRight: 5}} alt='map'/>*/}
                        <span style={{verticalAlign: 'middle'}}>{recipient["phone"]}</span>
                    </a>
                } else {
                    return <span/>
                }
            };
            const emailElement = () => {
                if (recipient["email"]) {
                    return <a className={isOpen ? 'recipient-data-link' : 'recipient-data-link-closed'} href={"mailto:" + recipient["email"]} target='_blank'
                              rel='noopener noreferrer'>
                        {/*<img src={require('./email.svg')} style={{ verticalAlign: 'middle', marginRight: 5}} alt='map'/>*/}
                        <span style={{verticalAlign: 'middle'}}>Email</span>
                    </a>
                } else {
                    return <span/>
                }
            };

            const nameElement = () => {
                const nameToShow = recipient["name"].trunc(40);
                const fullText = isOpen ? nameToShow : nameToShow + ' (' + t('results_recipient_closed') + ')';
                const fullTextElement = <span style={{verticalAlign: 'middle'}} title={recipient["address"]}>{fullText}</span>;
                if (recipient["url"]) {
                    return <a className={isOpen ? 'recipient-name' : 'recipient-name-closed'} href={recipient["url"]} target='_blank'
                              rel='noopener noreferrer'>
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
                        className={isOpen ? 'results-distance-link' : 'results-distance-link-closed'}
                        rel='noopener noreferrer'>
                        {distance.toFixed(1)} {t('result_distance_km')}
                    </a>
                }
            };

            const recipientRowClicked = () => {
                const expandedState = JSON.parse(JSON.stringify(expandedRecipientsState));
                expandedState[recipient["id"]] = !expandedState[recipient["id"]];
                setExpandedRecipientsState(expandedState);
            };

            const rows = [
                <tr key={'p' + recipient["id"]} className="recipient-row" onClick={() => recipientRowClicked()}>
                    <td> {nameElement()} </td>
                    <td> {phoneElement()} </td>
                    <td> {emailElement()} </td>
                    <td> {distanceElement()} </td>
                    {/*{company.address}*/}
                </tr>
            ];
            if (recipient["open"] && recipient["open"]["hours"]) {
                const className = (expandedRecipientsState[recipient["id"]] ? "results-details-row-expanded" : "results-details-row-collapsed");
                rows.push(<tr key={'pdetails' + recipient['id']}>
                    <td colSpan={4}>
                        <div className={className}>
                            <OpeningHours openingHoursList={recipient["open"]["hours"]}/>
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
                                <img src={require('./map.svg')} style={{verticalAlign: 'middle', marginRight: 5}}
                                     alt='map'/>
                                <span
                                    style={{verticalAlign: 'middle'}}>{t('results_header_public_containers')} ({recipientsWithGeoLocation.length})</span>
                            </div>
                        </div>
                    </li>

            } else {
                recipientsWithGeolocationHeader =
                    <li key='pcontcheader' className='result-header-p-containers'>
                        <div style={{marginTop: 20, fontWeight: 'bold'}}>{t('results_header_public_containers')}</div>
                    </li>;
            }
        }

        const tipsListItems = tips.map((tip, index) =>
            <li key={'tip' + index} className="list-item-tip">
                <img src={require('./check.svg')} style={{verticalAlign: 'middle', marginRight: 5}} alt='map'/>
                <span>{tip["text"]}</span>
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

        const containersHeader = <li key='contheader' className='result-header'>{t('results_header_containers')}</li>;
        const pickupCompaniesHeader = <li key='pickheader' className='result-header'>
            <img src={require('./car.svg')} style={{verticalAlign: 'middle', marginRight: 5, marginTop: -3}}
                 alt='map'/>
            <span> {t('results_header_pickup')} </span>
        </li>;
        const donationPlacesHeader = <li key='donationheader'
                                         className='result-header'>
            <img src={require('./heart.svg')} style={{verticalAlign: 'middle', marginRight: 5, marginTop: -3}}
                 alt='map'/>
            <span> {t('results_header_donations')} </span>
        </li>;
        const trashPlacesHeader = <li key='trashplacesheader'
                                      className='result-header'>
            <div>
                <img src={require('./trash.svg')} style={{verticalAlign: 'middle', marginRight: 5, marginTop: -3}}
                     alt='map'/>
                <span> {t('results_header_trash_places')} </span>
            </div>
        </li>;
        const secondHandPlacesHeader = <li key='secondhandplacesheader'
                                           className='result-header'>
            <img src={require('./money.svg')} style={{verticalAlign: 'middle', marginRight: 5, marginTop: -3}}
                 alt='map'/>
            <span> {t('results_header_second_hand')} </span>
        </li>;
        const tipsHeader = <li key='tipheader' className='result-header'>{t('results_header_tips')}</li>;

        const categorylistItemList = [categoryListItem];
        const containersHeaderList = containersListItems.length > 0 ? [containersHeader] : [];
        const pickupCompaniesHeaderList = pickupCompanies.length > 0 ? [pickupCompaniesHeader] : [];
        const donationPlacesHeaderList = donationPlaces.length > 0 ? [donationPlacesHeader] : [];
        const trashPlacesHeaderList = disposalPlaces.length > 0 ? [trashPlacesHeader] : [];
        const secondHandPlacesHeaderList = secondHandPlaces.length > 0 ? [secondHandPlacesHeader] : [];
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
            .concat(pickupCompaniesHeaderList)
            .concat(pickupCompaniesListItem)
            .concat(trashPlacesHeaderList)
            .concat(trashPlacesListItem)
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
            // const result = await axios('https://localhost:8443/options/' + suggestion.id, {
                headers: {"lang": lang},
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
