import React from "react";
import './App.css';
import {Map, Marker, Popup, TileLayer} from "react-leaflet";
import L from 'leaflet';
import RoutingMachine from './RoutingMachine';

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

const PContainersMap = ({pContainers}) => {
    const markers = () => pContainers.map(container =>
        <Marker position={[container["lat"], container["lon"]]} icon={markerIcon}>
            <Popup>
                {container["name"]}<br/>{container["address"]}
            </Popup>
        </Marker>
    );

    const map = React.createRef();
    const road = [L.latLng(57.74, 11.94), L.latLng(57.6792, 11.949)];

    return (
        <Map center={[57.74, 11.94]} zoom={12} ref={map}  style={{height: 380}}>
            <TileLayer
                attribution="&amp;copy <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {/*{this.road.map((point, index) => <Marker key={index} icon={this.defaultIcon} position={point} />)}*/}
            <RoutingMachine
                color="#000"
                map={map}
                road={road}
            />
        </Map>
        // <div>
        //     <Map center={[52.520008, 13.404954]} zoom={11} style={{height: 380}}>
        //         <TileLayer
        //             url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        //         />
        //         {markers()}
        //         <RoutingMachine
        //             color="#000"
        //         />
        //     </Map>
        //     <div><a>Walking</a> | <a>Car</a> | <a>Public transport</a> | <a>Show all</a></div>
        // </div>
    );
};

export default PContainersMap;
