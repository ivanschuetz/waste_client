import React from "react";
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
    const markers = () => pContainers.map(container => {
        const lat = container["lat"];
        const lon = container["lon"];
        return <Marker position={[lat, lon]} icon={markerIcon}>
            <Popup>
                {container["name"]}<br/>{container["address"]}<br/>
                <a
                    href={`https://www.google.com/maps/dir/?api=1&origin=52.5283204,13.3569057&destination=${lat},${lon}&travelmode=driving`}
                    target="_blank"
                >Route</a>
            </Popup>
        </Marker>
    });

    const map = React.createRef();

    return (
        <div>
            <Map center={[52.520008, 13.404954]} zoom={11} ref={map} style={{height: 380}}>
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {markers()}
            </Map>
        </div>
    );
};

export default PContainersMap;
