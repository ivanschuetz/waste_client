import React, { useState, useEffect, useRef } from "react";
import './App.css';
import { Map, Marker, Popup, TileLayer } from "react-leaflet";
import L from 'leaflet';
import Supercluster from 'supercluster';
import OpeningHours from "./OpeningHours";
import { isOpenNow } from "./Time";
import { useTranslation } from "react-i18next";
import { routeLink } from "./Utils";

const makeIcon = (path, iconAnchor, iconSize, popupAnchor) => new L.Icon({
    iconUrl: path,
    iconRetinaUrl: path,
    iconAnchor: iconAnchor,
    popupAnchor: popupAnchor,
    shadowUrl: null,
    shadowSize: null,
    shadowAnchor: null,
    iconSize: iconSize,
    className: 'leaflet-div-icon'
});

const myLocMarkerIcon = makeIcon(require('./icons/onsite-target.svg'), null, new L.Point(20, 20), [0, -15]);
const disposalPlaceOpenMarkerIcon = makeIcon(require('./icons/public-disposal.svg'), null, new L.Point(20, 20), [0, -15]);
const disposalPlaceClosedMarkerIcon = makeIcon(require('./icons/public-disposal-closed.svg'), null, new L.Point(20, 20), [0, -15]);
const donationsPlaceOpenMarkerIcon = makeIcon(require('./icons/heart.svg'), null, new L.Point(20, 20), [0, -15]);
const donationsPlaceClosedMarkerIcon = makeIcon(require('./icons/heart-closed.svg'), null, new L.Point(20, 20), [0, -15]);
const secondHandPlaceOpenMarkerIcon = makeIcon(require('./icons/2nd-hand.svg'), null, new L.Point(20, 20), [0, -15]);
const secondHandPlaceClosedMarkerIcon = makeIcon(require('./icons/2nd-hand-closed.svg'), null, new L.Point(20, 20), [0, -15]);
const retailerOpenMarkerIcon = makeIcon(require('./icons/online-shop-retailer.svg'), null, new L.Point(20, 20), [0, -15]);
const retailerClosedMarkerIcon = makeIcon(require('./icons/online-shop-retailer-closed.svg'), null, new L.Point(20, 20), [0, -15]);

const createClusterIcon = (count) => {
    return new L.DivIcon({
        className: 'my-div-icon',
        iconAnchor: [12, 12],
        iconSize: new L.Point(20, 20),
        html:
            `<div class="cluster-cont">` +
            `<img class="cluster-img" src=${require('./cluster.svg')} />` +
            `<span class="cluster-label">${count}</span>` +
            `</div>`
    });
};

// https://developers.google.com/maps/documentation/urls/guide

const RecipientsMap = ({ recipients }) => {
    const [myLoc, setMyLoc] = useState(null);
    const [zoom, setZoom] = useState(11);
    const [filteredRecipients, setFilteredRecipients] = useState(recipients);

    const [filterOptions, setFilterOptions] = useState({
        showDisposalPlaces: true,
        showDonationPlaces: true,
        showSecondHandPlaces: true,
        showRetailers: true,
        showHasPickup: false,
        showHasInPlace: true
    });

    const myRef = useRef(null);
    const { t } = useTranslation();

    // Scroll such that maps becomes fully visible when loading component
    useEffect(() => myRef.current && window.scrollTo(0, myRef.current.offsetTop), []);

    const index = new Supercluster({
        radius: 40,
        maxZoom: 18
    });

    const marker = (lat, lon, markerIcon, children) =>
        <Marker position={[lat, lon]} icon={markerIcon} key={`${lat}${lon}`}>
            <Popup>
                {children}
            </Popup>
        </Marker>;

    const transportImg = (src, alt, link) =>
        <a href={link} target="_blank" rel="noopener noreferrer" key={alt}>
            <img src={src} alt={alt} style={{ width: 20, height: 20, marginRight: 20 }} />
        </a>;

    const points = filteredRecipients.map((container) => {
        return {
            properties: {
                container: container
            },
            geometry: {
                coordinates: [
                    container["lat"],
                    container["lon"]
                ]
            }
        };
    }
    );

    const onClusterClick = (cluster) => {
        const zoom = index.getClusterExpansionZoom(cluster["id"]);
        setZoom(zoom);
    };

    const openElement = (openType, open) => {
        switch (openType) {
            case "a":
                return <div className="always-open-label">{t('map_open_always')}</div>;
            case "u":
                return <div className="always-open-label">{t('map_open_unknown')}</div>;
            case "h":
                return <OpeningHours openingHoursList={open["hours"]} mode="map" />;
            default:
                console.log('Unknown openType value: ' + JSON.stringify(openType));
        }
    };

    const isOpen = (container) => {
        switch (container["openType"]) {
            case "a":
                return { isOpen: true, isHoliday: false };
            case "u":
                return { isOpen: true, isHoliday: false };
            case "h":
                const hours = container["open"]["hours"];
                return isOpenNow(hours);
            default:
                console.log('Unknown openType value: ' + JSON.stringify(container["openType"]));
                return { isOpen: false, isHoliday: false };
        }
    };

    const icon = (recipientType, isOpen, hasPickup) => {
        // For now ignoring hasPickup
        switch (recipientType) {
            case 0: return isOpen ? disposalPlaceOpenMarkerIcon : disposalPlaceClosedMarkerIcon;
            case 1: return isOpen ? donationsPlaceOpenMarkerIcon : donationsPlaceClosedMarkerIcon;
            case 2: return isOpen ? secondHandPlaceOpenMarkerIcon : secondHandPlaceClosedMarkerIcon;
            case 4: return isOpen ? retailerOpenMarkerIcon : retailerClosedMarkerIcon;
            default: console.log("Invalid recipient type: " + recipientType)
        }
    };

    const pointMarker = (container) => {
        const lat = container["lat"];
        const lon = container["lon"];
        const phone = container["phone"];

        return marker(lat, lon, icon(container["type"], isOpen(container).isOpen, container["hasPickup"]), <div style={{ minWidth: 200 }}>
            {/*return marker(lat, lon, isOpen(container) ? markerOpenIcon : markerClosedIcon, <div style={{minWidth: 200}}>*/}
            <a className="p-container-popup-title" href={container["url"]} target="_blank" rel="noopener noreferrer">
                <span className="p-container-popup-title-span">{container["name"]}</span>
            </a><br />
            {container["address"]}<br />
            {phone ? <span>{container["phone"]}</span> : <span />}
            {openElement(container["openType"], container["open"])}
            {/*<a className="p-container-popup-company" href={container["url"]} target="_blank">*/}
            {/*    {container["company"]}*/}
            {/*</a>*/}
            <div className="p-container-popup-routes" />
            <a className="map-popup-route-link"
               href={routeLink(myLoc, lat, lon, "driving")}
               target="_blank"
               rel="noopener noreferrer"
            >Route</a>
            {/*{[*/}
            {/*    transportImg(require("./walk.svg"), "Walking", routeLink(myLoc, lat, lon, "walking")),*/}
            {/*    transportImg(require("./bike.svg"), "Bike", routeLink(myLoc, lat, lon, "bicycling")),*/}
            {/*    transportImg(require("./transit.svg"), "Transit", routeLink(myLoc, lat, lon, "transit")),*/}
            {/*    transportImg(require("./car.svg"), "Car", routeLink(myLoc, lat, lon, "driving")),*/}
            {/*]}*/}
        </div>);
    };

    const clusterMarker = (result) => {
        const coords = result["geometry"]["coordinates"];
        const lat = coords[0];
        const lng = coords[1];
        const count = result["properties"]["point_count"];
        const countText = count > 999 ? "+" : count;
        return <Marker position={[lat, lng]} onClick={() => onClusterClick(result)}
            icon={createClusterIcon(countText)} />
    };

    const onZoomEvent = (event) => {
        setZoom(event.target._zoom);
    };

    const map = React.createRef();

    const displayLocationInfo = (position) => setMyLoc(position.coords);

    index.load(points);
    const clusteringResults = index.getClusters([-180, -85, 180, 85], zoom);

    const markers = clusteringResults.map((result) => {
        if (result.hasOwnProperty("type")) { // cluster
            return clusterMarker(result);
        } else { // point
            return pointMarker(result["properties"]["container"]);
        }
    });

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

    const toNewOptions = (currentOptions, event) => {
        let clone = JSON.parse(JSON.stringify(currentOptions));
        clone[event.target.name] = event.target["checked"];
        return clone;
    };

    const validateOptions = (options) => {
        // For now commented. This is to force to always have a box checked in type/delivery type to prevent confusion
        // if one of the groups has no selection but the other has (in which case there will be no points on the map)
        // UX is slighly annoying with this, when trying to uncheck last box before checking another, so commented.
        // if (!options.showDisposalPlaces && !options.showDonationPlaces && !options.showSecondHandPlaces) {
        //     return false;
        // }
        // if (!options.showHasPickup && !options.showHasInPlace) {
        //     return false;
        // }
        return true;
    };

    const updateFilterOptions = (event) => {
        const newOptions = toNewOptions(filterOptions, event);
        if (validateOptions(newOptions)) {
            const filteredRecipients = recipients.filter((recipient) => {
                const type = recipient["type"];
                const hasActiveType = newOptions.showDisposalPlaces && type === 0
                    || newOptions.showDonationPlaces && type === 1
                    || newOptions.showSecondHandPlaces && type === 2
                    || newOptions.showRetailers && type === 4;
                const hasActiveDeliveryType = newOptions.showHasPickup && recipient["hasPickup"]
                    || newOptions.showHasInPlace && recipient["hasInPlace"];
                return hasActiveType && hasActiveDeliveryType
            });
            setFilteredRecipients(filteredRecipients);
            setFilterOptions(newOptions)
        } else {
            // Do nothing
        }
    };

    return (
        <div className='map-with-filters-container'>
            <div className='map-filters'>
                <div className="map-filters-wrapper">
                    <div>
                        <input
                            id="check-1"
                            name="showDisposalPlaces"
                            type="checkbox"
                            checked={filterOptions.showDisposalPlaces}
                            onChange={updateFilterOptions} />
                        <label className='map-filter' htmlFor="check-1">
                            {t('map_filter_disposal_places')}
                        </label>
                    </div>
                    <div>
                        <input
                            id="check-2"
                            name="showDonationPlaces"
                            type="checkbox"
                            checked={filterOptions.showDonationPlaces}
                            onChange={updateFilterOptions} />
                        <label className='map-filter' htmlFor="check-2">
                            {t('map_filter_donation_places')}

                        </label>
                    </div>
                    <div>
                        <input
                            id="check-3"
                            name="showSecondHandPlaces"
                            type="checkbox"
                            checked={filterOptions.showSecondHandPlaces}
                            onChange={updateFilterOptions} />
                        <label className='map-filter' htmlFor="check-3">
                            {t('map_filter_2hand_places')}
                        </label>
                    </div>
                    <div>
                        <input
                            id="check-4"
                            name="showRetailers"
                            type="checkbox"
                            checked={filterOptions.showRetailers}
                            onChange={updateFilterOptions} />
                        <label className='map-filter' htmlFor="check-4">
                            {t('map_filter_retailers')}
                        </label>
                    </div>
                </div>
                <div style={{ marginTop: 20 }} className="map-filters-wrapper">
                    <div>
                        <input
                            id="check-5"
                            name="showHasPickup"
                            type="checkbox"
                            checked={filterOptions.showHasPickup}
                            onChange={updateFilterOptions} />
                        <label className='map-filter' style={{ marginLeft: 10 }} htmlFor="check-5">
                            {t('map_filter_has_pickup')}
                        </label>
                    </div>
                    <div>
                        <input
                            id="check-6"
                            name="showHasInPlace"
                            type="checkbox"
                            checked={filterOptions.showHasInPlace}
                            onChange={updateFilterOptions} />
                        <label className='map-filter' htmlFor="check-6">
                            {t('map_filter_has_in_place')}
                        </label>
                    </div>
                </div>
            </div>

            <div className='map-container' ref={myRef}>
                <Map center={[52.520008, 13.404954]} zoom={zoom} maxZoom={18} ref={map} style={{ height: 380 }}
                    onZoomend={onZoomEvent}>
                    <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    {markers}
                    {myLoc && marker(myLoc.latitude, myLoc.longitude, myLocMarkerIcon, <p>{t('map_your_location')}</p>)}
                </Map>
            </div>
        </div>
    );
};

export default RecipientsMap;
