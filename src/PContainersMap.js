import React, {useState, useEffect, useRef} from "react";
import './App.css';
import {Map, Marker, Popup, TileLayer} from "react-leaflet";
import L from 'leaflet';
import Supercluster from 'supercluster';
import OpeningHours from "./OpeningHours";
import {currentWeekdayIndex, isOpenNow, nowIsBetween, weekdayIndex} from "./Time";
import {useTranslation} from "react-i18next";

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

const markerClosedIcon = makeIcon(require('./marker_closed.svg'), [15, 27], new L.Point(30, 30), [0, -30]);
const markerOpenIcon = makeIcon(require('./marker_open.svg'), [15, 27], new L.Point(30, 30), [0, -30]);
const myLocMarkerIcon = makeIcon(require('./my_loc.svg'), null, new L.Point(20, 20), [0, -15]);

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

const PContainersMap = ({pContainers}) => {
    const [myLoc, setMyLoc] = useState(null);
    const [zoom, setZoom] = useState(11);
    const myRef = useRef(null);
    const {t} = useTranslation();

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

    const routeLink = (myLoc, dstLat, dstLon, travelmode) => {
        const origin = myLoc == null ? "" : `&origin=${myLoc.latitude},${myLoc.longitude}`;
        return `https://www.google.com/maps/dir/?api=1${origin}&destination=${dstLat},${dstLon}&travelmode=${travelmode}`;
    };

    const transportImg = (src, alt, link) =>
        <a href={link} target="_blank" rel="noopener noreferrer" key={alt}>
            <img src={src} alt={alt} style={{width: 20, height: 20, marginRight: 20}}/>
        </a>;

    const points = pContainers.map((container) => {
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
                return <OpeningHours openingHoursList={open["hours"]}/>;
            default:
                console.log('Unknown openType value: ' + JSON.stringify(openType));
        }
    };

    const isOpen = (container) => {
        switch (container["openType"]) {
            case "a":
                return true;
            case "u":
                return true;
            case "h":
                const hours = container["open"]["hours"];
                return isOpenNow(hours);
            default:
                console.log('Unknown openType value: ' + JSON.stringify(container["openType"]));
                return false;
        }
    };

    const pointMarker = (container) => {
        const lat = container["lat"];
        const lon = container["lon"];
        const phone = container["phone"];

        return marker(lat, lon, isOpen(container) ? markerOpenIcon : markerClosedIcon, <div style={{minWidth: 200}}>
            <a className="p-container-popup-title" href={container["url"]} target="_blank" rel="noopener noreferrer">
                {container["name"]}
            </a><br/>
            {container["address"]}<br/>
            {phone ? <span>{container["phone"]}</span> : <span/>}
            {openElement(container["openType"], container["open"])}
            {/*<a className="p-container-popup-company" href={container["url"]} target="_blank">*/}
            {/*    {container["company"]}*/}
            {/*</a>*/}
            <div className="p-container-popup-routes"/>
            <span style={{float: "left", marginRight: 5}}>Route:</span>
            {[
                transportImg(require("./walk.svg"), "Walking", routeLink(myLoc, lat, lon, "walking")),
                transportImg(require("./bike.svg"), "Bike", routeLink(myLoc, lat, lon, "bicycling")),
                transportImg(require("./transit.svg"), "Transit", routeLink(myLoc, lat, lon, "transit")),
                transportImg(require("./car.svg"), "Car", routeLink(myLoc, lat, lon, "driving")),
            ]}
        </div>);
    };

    const clusterMarker = (result) => {
        const coords = result["geometry"]["coordinates"];
        const lat = coords[0];
        const lng = coords[1];
        const count = result["properties"]["point_count"];
        const countText = count > 999 ? "+" : count;
        return <Marker position={[lat, lng]} onClick={() => onClusterClick(result)}
                       icon={createClusterIcon(countText)}/>
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

    return (
        <div className='map-container' ref={myRef}>
            <Map center={[52.520008, 13.404954]} zoom={zoom} maxZoom={18} ref={map} style={{height: 380}}
                 onZoomend={onZoomEvent}>
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {markers}
                {myLoc && marker(myLoc.latitude, myLoc.longitude, myLocMarkerIcon, <p>{t('map_your_location')}</p>)}
            </Map>
        </div>
    );
};

export default PContainersMap;
