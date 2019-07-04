import React, {useState, useEffect} from "react";
import './App.css';
import {useTranslation} from "react-i18next";
import i18n from 'i18next';
import {groupBy, routeLink} from "./Utils";
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

const SearchResults = ({results, onPContainersClick, showPContainersButton, myLocation}) => {
    const {t} = useTranslation();
    const [myLoc, setMyLoc] = useState(null);

    const categories = results['categories'];
    const containers = results['containers'];
    const recipients = results['recipients'];

    // Adds distance to recipients if myLoc is set
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
        if (a.hasOwnProperty('distance') && b.hasOwnProperty('distance')) {
            return a['distance'] - b['distance']
        } else if (!a.hasOwnProperty('distance') && !b.hasOwnProperty('distance')) {
            return 0;
        } else {
            throw Error("Invalid state: Either all objects have distance or none");
        }
    });

    const disposalPlaces = sortByDistance(allUnsortedDisposalPlaces).slice(0, 3);
    const donationPlaces = sortByDistance(allUnsortedDonationPlaces).slice(0, 3);
    const secondHandPlaces = sortByDistance(allUnsortedSecondHandPlaces).slice(0, 3);
    const pickupCompanies = sortByDistance(allUnsortedPickupCompanies).slice(0, 3);

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
        const categoryListItem = <li key='category'
                                     className="list-item-categories">{categories.map((category) => category.name).join(", ")}</li>;

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

        const recipientsTableRows = (recipients) => recipients.map(recipient => {
            const phoneElement = () => {
                if (recipient["phone"]) {
                    return <a className='recipient-data-link' href={"tel:" + recipient["phone"]}>
                        {/*<img src={require('./phone.svg')} style={{ verticalAlign: 'middle', marginRight: 5}} alt='map'/>*/}
                        <span style={{verticalAlign: 'middle'}}>{recipient["phone"]}</span>
                    </a>
                } else {
                    return <span/>
                }
            };
            const emailElement = () => {
                if (recipient["email"]) {
                    return <a className='recipient-data-link' href={"mailto:" + recipient["email"]} target='_blank'
                              rel='noopener noreferrer'>
                        {/*<img src={require('./email.svg')} style={{ verticalAlign: 'middle', marginRight: 5}} alt='map'/>*/}
                        <span style={{verticalAlign: 'middle'}}>Email</span>
                    </a>
                } else {
                    return <span/>
                }
            };

            const nameElement = () => {
                if (recipient["url"]) {
                    return <a className='recipient-name' href={recipient["url"]} target='_blank'
                              rel='noopener noreferrer'>
                        <span style={{verticalAlign: 'middle'}}>{recipient["name"]}</span>
                    </a>
                } else {
                    return <span style={{verticalAlign: 'middle'}}>{recipient["name"]}</span>
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
                        className='results-distance-link'
                        rel='noopener noreferrer'>
                        {distance.toFixed(1)} {t('result_distance_km')}
                    </a>
                }
            };

            return <tr key={'p' + recipient["id"]} className="recipient-row">
                <td> {nameElement()} </td>
                <td> {phoneElement()} </td>
                <td> {emailElement()} </td>
                <td> {distanceElement()} </td>
                {/*{company.address}*/}
            </tr>;
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

        const pickupCompaniesListItem = <li key='p-companies'>
            <table className="p-recipients-table">
                <tbody>{recipientsTableRows(pickupCompanies)}</tbody>
            </table>
        </li>;
        const donationsPlacesListItem = <li key='donation-places'>
            <table className="p-recipients-table">
                <tbody>{recipientsTableRows(donationPlaces)}</tbody>
            </table>
        </li>;
        const trashPlacesListItem = <li key='trash-places'>
            <table className="p-recipients-table">
                <tbody>{recipientsTableRows(disposalPlaces)}</tbody>
            </table>
        </li>;
        const secondHandPlacesListItem = <li key='second-hand-places'>
            <table className="p-recipients-table">
                <tbody>{recipientsTableRows(secondHandPlaces)}</tbody>
            </table>
        </li>;

        const categoriesHeaderTranslationKey = categories.length > 1 ? 'results_header_categories_plural' : 'results_header_categories_singular';
        const categoriesHeader = <li key='catheader'
                                     className='result-header-first'>{t(categoriesHeaderTranslationKey)}</li>;
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

        const categoriesHeaderList = [categoriesHeader];
        const containersHeaderList = containersListItems.length > 0 ? [containersHeader] : [];
        const pickupCompaniesHeaderList = pickupCompanies.length > 0 ? [pickupCompaniesHeader] : [];
        const donationPlacesHeaderList = donationPlaces.length > 0 ? [donationPlacesHeader] : [];
        const trashPlacesHeaderList = disposalPlaces.length > 0 ? [trashPlacesHeader] : [];
        const secondHandPlacesHeaderList = secondHandPlaces.length > 0 ? [secondHandPlacesHeader] : [];
        const tipsHeaderList = tipsListItems.length > 0 ? [tipsHeader] : [];

        return categoriesHeaderList
            .concat(categoryListItem)
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

const ItemSearch = ({suggestion, onResult, onPContainersClick, showPContainersButton, myLocation}) => {
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
                                     myLocation={myLocation}/>
};

export default ItemSearch;
