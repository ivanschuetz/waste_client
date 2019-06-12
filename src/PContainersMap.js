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

    const routeLink = (myLoc, dstLat, dstLon, travelmode) => {
        const origin = myLoc == null ? "" : `&origin=${myLoc.latitude},${myLoc.longitude}`;
        return `https://www.google.com/maps/dir/?api=1${origin}&destination=${dstLat},${dstLon}&travelmode=${travelmode}`;
    };

    const transportImg = (src, alt, link) => {
        return <a href={link} target="_blank"><img src={src} alt={alt} style={{width: 20, height: 20, marginRight: 20}}/></a>
    };

    const markers = () => pContainers.map(container => {
        const lat = container["lat"];
        const lon = container["lon"];
        const phone = container["phone"];
        return marker(lat, lon, <div>
            {container["name"]}
            <a href={container["url"]} target="_blank">
                <img src={require("./external_url.svg")} alt={"Go to link"} style={{width: 15, height: 15}}/>
            </a><br/>
            {container["address"]}<br/>
            {phone ? <p>phone</p> : <span/>}
            {container["company"]}<br/>
            {[
                transportImg(require("./walk.svg"), "Walking", routeLink(myLoc, lat, lon, "walking")),
                transportImg(require("./bike.svg"), "Bike", routeLink(myLoc, lat, lon, "bicycling")),
                transportImg(require("./transit.svg"), "Transit", routeLink(myLoc, lat, lon, "transit")),
                transportImg(require("./car.svg"), "Car", routeLink(myLoc, lat, lon, "driving")),
            ]}
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
