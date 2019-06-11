import React, {useState, useEffect} from "react";
import './App.css';
import {Map, Marker, Popup, TileLayer} from "react-leaflet";
import L from 'leaflet';

const markerIcon = new L.Icon({
    iconUrl: require('./marker.svg'),
    iconRetinaUrl: require('./marker.svg'),
    iconAnchor: null,
    popupAnchor: [-3, -26],
    shadowUrl: null,
    shadowSize: null,
    shadowAnchor: null,
    iconSize: new L.Point(30, 30),
    className: 'leaflet-div-icon'
});

// https://developers.google.com/maps/documentation/urls/guide

const PContainersMap = ({pContainers}) => {
    const [myLoc, setMyLoc] = useState(null);

    const marker = (lat, lon, children) =>
        <Marker position={[lat, lon]} icon={markerIcon}>
            <Popup>
                {children}
            </Popup>
        </Marker>;

    const routeLink = (myLoc, dstLat, dstLon) => {
        const origin = myLoc == null ? "" : `&origin=${myLoc.latitude},${myLoc.longitude}`;
        return `https://www.google.com/maps/dir/?api=1${origin}&destination=${dstLat},${dstLon}&travelmode=driving`;
    };

    const markers = () => pContainers.map(container => {
        const lat = container["lat"];
        const lon = container["lon"];
        return marker(lat, lon, <div>
            {container["name"]}<br/>{container["address"]}<br/>
            <a
                href={routeLink(myLoc)}
                target="_blank"
            >Route</a>
        </div>);
    });

    const map = React.createRef();

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

    return (
        <div>
            <Map center={[52.520008, 13.404954]} zoom={11} ref={map} style={{height: 380}}>
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {markers()}
                {myLoc && marker(myLoc.latitude, myLoc.longitude, <p>Your location!</p>)}
            </Map>
        </div>
    );
};

export default PContainersMap;
