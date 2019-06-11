import React, {useState} from "react";
import './App.css';
import SearchBox from "./SearchBox";
import ItemSuggestions from "./ItemSuggestions";
import ItemSearch from "./SearchResults";
import { Map, TileLayer, Marker, Popup } from "react-leaflet";
import L from 'leaflet';

const markerIcon = new L.Icon({
    iconUrl: require('./marker.svg'),
    iconRetinaUrl: require('./marker.svg'),
    iconAnchor: null,
    popupAnchor: null,
    shadowUrl: null,
    shadowSize: null,
    shadowAnchor: null,
    iconSize: new L.Point(30, 30),
    className: 'leaflet-div-icon'
});

const App = () => {
    const [suggestions, setSuggestions] = useState([]);
    const [selectedSuggestion, setSelectedSuggestion] = useState(null);

    const handleSuggestions = suggestions => {
        console.log('suggestions: ' + JSON.stringify(suggestions));
        setSuggestions(suggestions)
    };

    const onSuggestionClick = suggestion => {
        console.log('clicked suggestion: ' + JSON.stringify(suggestion));
        setSelectedSuggestion(suggestion)
    };

    return (
        <div className="App">
            <SearchBox onResults={handleSuggestions}/>
            <ItemSuggestions suggestions={suggestions} onClick={onSuggestionClick} />
            {selectedSuggestion && <ItemSearch suggestion={selectedSuggestion} />}
            <Map center={[51.505, -0.09]} zoom={13} style={{height: 380}}>
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker position={[51.505, -0.09]} opacity={1} icon={markerIcon}>
                    <Popup>
                        A pretty CSS3 popup. <br /> Easily customizable.
                    </Popup>
                </Marker>
            </Map>
        </div>);
};

export default App;
