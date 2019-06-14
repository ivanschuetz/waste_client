import React, {useState, useEffect, useRef} from "react";
import './App.css';
import {Map, Marker, Popup, TileLayer} from "react-leaflet";
import L from 'leaflet';
import MarkerClusterGroup from 'react-leaflet-markercluster';
import Supercluster from 'supercluster';

const markerIcon = new L.Icon({
    iconUrl: require('./marker.svg'),
    iconRetinaUrl: require('./marker.svg'),
    iconAnchor: null,
    popupAnchor: [0, -26],
    shadowUrl: null,
    shadowSize: null,
    shadowAnchor: null,
    iconSize: new L.Point(30, 30),
    className: 'leaflet-div-icon'
});

const clusterIcon = new L.Icon({
    iconUrl: require('./cluster.svg'),
    iconRetinaUrl: require('./cluster.svg'),
    iconAnchor: null,
    popupAnchor: [0, -26],
    shadowUrl: null,
    shadowSize: null,
    shadowAnchor: null,
    iconSize: new L.Point(30, 30),
    className: 'leaflet-div-icon'
});

const myLocMarkerIcon = new L.Icon({
    iconUrl: require('./my_loc.svg'),
    iconRetinaUrl: require('./my_loc.svg'),
    iconAnchor: null,
    popupAnchor: [0, -26],
    shadowUrl: null,
    shadowSize: null,
    shadowAnchor: null,
    iconSize: new L.Point(20, 20),
    className: 'leaflet-div-icon'
});

// https://developers.google.com/maps/documentation/urls/guide

const PContainersMap = ({pContainers}) => {
    const [myLoc, setMyLoc] = useState(null);
    const [zoom, setZoom] = useState(11);
    const myRef = useRef(null);

    // Scroll such that maps becomes fully visible when loading component
    useEffect(() => myRef.current && window.scrollTo(0, myRef.current.offsetTop));

    const marker = (lat, lon, markerIcon, children) =>
        <Marker position={[lat, lon]} icon={markerIcon}>
            <Popup>
                {children}
            </Popup>
        </Marker>;

    const routeLink = (myLoc, dstLat, dstLon, travelmode) => {
        const origin = myLoc == null ? "" : `&origin=${myLoc.latitude},${myLoc.longitude}`;
        return `https://www.google.com/maps/dir/?api=1${origin}&destination=${dstLat},${dstLon}&travelmode=${travelmode}`;
    };

    const transportImg = (src, alt, link) =>
        <a href={link} target="_blank"><img src={src} alt={alt} style={{width: 20, height: 20, marginRight: 20}}/></a>;


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

    const index = new Supercluster({
        radius: 40,
        maxZoom: 18
    });
    index.load(points);
    const clusteringResults = index.getClusters([-180, -85, 180, 85], zoom);
    // console.log('points: ' + JSON.stringify(points));
    // console.log('clusters: ' + JSON.stringify(clusters));


    console.log('calculated new clusters: ' + clusteringResults.length);

    const onClusterClick = (cluster) => {
        const zoom = index.getClusterExpansionZoom(cluster["id"]);
        console.log('setting zoom to:' + zoom);
        setZoom(zoom);
    };

    const pointMarker = (container) => {
        const lat = container["lat"];
        const lon = container["lon"];
        const phone = container["phone"];
        return marker(lat, lon, markerIcon, <div style={{minWidth: 200}}>
            <a className="p-container-popup-title" href={container["url"]} target="_blank">
                {container["name"]}
            </a><br/>
            {container["address"]}<br/>
            {phone ? <p>phone</p> : <span/>}
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
        return <Marker position={[lat, lng]} onClick={() => onClusterClick(result)} icon={clusterIcon} />
    };

    const markers = () => clusteringResults.map((result) => {
        if (result.hasOwnProperty("type")) { // cluster
            // return
            {/*<MarkerClusterGroup>*/}
            return clusterMarker(result);
                // return <Marker position={[lat, lng]} onClick={() => onClusterClick(result)} />
            // </MarkerClusterGroup>
        } else { // point
            return pointMarker(result["properties"]["container"]);
            // return <Marker position={[lat, lng]}/>
        }
    });


    // const markers = () => pContainers.map(container => {
    //     const lat = container["lat"];
    //     const lon = container["lon"];
    //     const phone = container["phone"];
    //     return marker(lat, lon, markerIcon, <div style={{minWidth: 200}}>
    //         <a className="p-container-popup-title" href={container["url"]} target="_blank">
    //             {container["name"]}
    //         </a><br/>
    //         {container["address"]}<br/>
    //         {phone ? <p>phone</p> : <span/>}
    //         {/*<a className="p-container-popup-company" href={container["url"]} target="_blank">*/}
    //         {/*    {container["company"]}*/}
    //         {/*</a>*/}
    //         <div className="p-container-popup-routes"/>
    //         <span style={{float: "left", marginRight: 5}}>Route:</span>
    //         {[
    //             transportImg(require("./walk.svg"), "Walking", routeLink(myLoc, lat, lon, "walking")),
    //             transportImg(require("./bike.svg"), "Bike", routeLink(myLoc, lat, lon, "bicycling")),
    //             transportImg(require("./transit.svg"), "Transit", routeLink(myLoc, lat, lon, "transit")),
    //             transportImg(require("./car.svg"), "Car", routeLink(myLoc, lat, lon, "driving")),
    //         ]}
    //     </div>);
    // });

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
        <div className='map-container' ref={myRef}>
            <Map center={[52.520008, 13.404954]} zoom={zoom} maxZoom={18} ref={map} style={{height: 380}}>

                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {/*<MarkerClusterGroup>*/}
                {/*    <Marker position={[49.8397, 24.0297]}/>*/}
                {/*    <Marker position={[52.2297, 21.0122]}/>*/}
                {/*    <Marker position={[51.5074, -0.0901]}/>*/}
                {/*</MarkerClusterGroup>*/}

                {markers()}
                {myLoc && marker(myLoc.latitude, myLoc.longitude, myLocMarkerIcon, <p>Your location!</p>)}
            </Map>
        </div>
    );
};

export default PContainersMap;
