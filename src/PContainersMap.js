import React from "react";
import './App.css';
import {Map, Marker, Popup, TileLayer} from "react-leaflet";
import L from 'leaflet';
import RoutingMachine from './RoutingMachine';

const axios = require('axios');

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

    const onSelectTransport = async (transport) => {
        const coordsArray = pContainers.map((pContainer) => `${pContainer["lon"]},${pContainer["lat"]}`);
        const coordsArrayStr = coordsArray.join(";");
        console.log('coordsstr: ' + coordsArray);

        if (transport === 'car')  {
            const url = `http://router.project-osrm.org/table/v1/driving/${coordsArrayStr}?sources=0`; // NOTE target has to be first point!
            const result = await axios(url);

            console.log('url: ' + JSON.stringify(url));
            console.log('result: ' + JSON.stringify(result));

            const durations = result.data["durations"][0];
            const min = Math.min.apply(null, durations);

            console.log('durations: ' + JSON.stringify(durations));
            console.log('min duration: ' + JSON.stringify(min));

            return
        }

        const url = ((transport) => {
            switch (transport) {
                case 'foot':
                    // https://routing.openstreetmap.de/routed-foot/route/v1/driving/52.526745,13.311367;52.550884,13.402125;52.580357,13.436043
                    // https://routing.openstreetmap.de/routed-foot/route/v1/driving/13.348148855888,52.5307862;13.346781557193028,52.530676479817835?overview=false&geometries=polyline&steps=true
                    // https://routing.openstreetmap.de/routed-foot/route/v1/driving/13.348148855888,52.5307862;13.346781557193028,52.530676479817835?overview=false&geometries=polyline&steps=true&hints=PgJXgJkEV4CcAAAALgEAAL8BAAAAAAAAaDB8QTh08UGhlDNCAAAAAH0AAADyAAAAegEAAAAAAAAOAAAAn6zLAImNIQM1rcsAYo4hAwQADweT-NIw%3BOwJXgObeZJKgAAAAuwEAALwAAAAAAAAAHVFNQWYNDkKrZ3BBAAAAAGYAAAAcAQAAjAAAAAAAAAAOAAAAKqjLAL2NIQPep8sA9I0hAwMAXw6T-NIw
                    return `https://routing.openstreetmap.de/routed-foot/route/v1/driving/${coordsArrayStr}`;
                    // return `https://routing.openstreetmap.de/routed-foot/route/v1/driving/52.526745,13.311367;52.550884,13.402125`;
                case 'bike':
                    // https://routing.openstreetmap.de/routed-bike/route/v1/driving/13.348148855888,52.5307862;13.346781557193028,52.530676479817835?overview=false&geometries=polyline&steps=true
                    return `https://routing.openstreetmap.de/routed-bike/route/v1/driving/${coordsArrayStr}`;
                default:
                    throw Error("Not supported: " + transport);
            }
        })(transport);

        const result = await axios(url);

        console.log('url: ' + JSON.stringify(url));
        console.log('result: ' + JSON.stringify(result));

        const duration = result.data["routes"][0]["duration"];

        console.log('duration: ' + JSON.stringify(duration));
    };

    const map = React.createRef();

    return (
        <div>
            <Map center={[52.520008, 13.404954]} zoom={11} ref={map} style={{height: 380}}>
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {markers()}
                {pContainers.map(container =>
                    <RoutingMachine
                        color="#000"
                        map={map}
                        road={[L.latLng(52.520008, 13.404954), L.latLng(container["lat"], container["lon"])]}
                    />
                )}
            </Map>
            <div>
                <a onClick={() => onSelectTransport("foot")}>Walking</a> |
                <a onClick={() => onSelectTransport("car")}>Car</a> |
                <a onClick={() => onSelectTransport("bike")}>Bike</a> |
                <a>Show all</a>
            </div>
        </div>
    );
};

export default PContainersMap;
