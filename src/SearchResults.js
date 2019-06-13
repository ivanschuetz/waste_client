import React, {useState, useEffect} from "react";
import './App.css';
const axios = require('axios');

const SearchResults = ({results, onPContainersClick, showPContainersButton}) => {
    console.log('rendering search results: ' + JSON.stringify(results));

    const listItems = () => {
        const containers = results['containers'];
        const pContainers = results['pcontainers'];
        const pickupCompanies = results['companies'];
        const containersListItems = containers.map(container =>
            <li key={'c' + container.id}>
                <span className="dot" style={{backgroundColor: "#" + container.color, marginRight: 5}}/>
                {container.name}
            </li>
        );

        const pickupCompaniesListItems = pickupCompanies.map(companyResult => {
            const company = companyResult["company"];
            return <li key={'p' + company.id}>
                {company.name} {company.address}<br/>
                {company.phone} {company.email}<br/>
                {companyResult["website"] || company["website"]}<br/>
                {companyResult["min_weight"] || ""}<br/>
            </li>;
        });

        const pContainersListItems = [];
        if (pContainers.length > 0 && showPContainersButton) {
            pContainersListItems.push(
                <li key='pcont' className='result-header-p-containers'>
                    <a className='p-containers-link' onClick={onPContainersClick}>
                        <div className='p-containers-span'>
                            <img src={require('./map.svg')} style={{ verticalAlign: 'middle', marginRight: 5}} alt='map'/>
                            <span style={{ verticalAlign: 'middle'}}>Public containers({pContainers.length})</span>
                        </div>
                    </a>
                </li>
            )
        }

        const containersHeader = <li key='cheader' className='result-header'>Containers</li>;
        const pickupCompaniesHeader = <li key='pheader' className='result-header'>Pickup companies</li>;
        const containersHeaderList = containersListItems.length > 0 ? [containersHeader] : [];
        const pickupCompaniesHeaderList = pickupCompaniesListItems.length > 0 ? [pickupCompaniesHeader] : [];

        return containersHeaderList
            .concat(containersListItems)
            .concat(pickupCompaniesHeaderList)
            .concat(pickupCompaniesListItems)
            .concat(pContainersListItems)
    };

    return (
        <ul className='results-list'>
            {listItems()}
        </ul>
    );
};

const ItemSearch = ({suggestion, onResult, onPContainersClick, showPContainersButton}) => {
    console.log('rendering items search');
    const [results, setResults] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            const result = await axios(
                'http://localhost:8080/options/' + suggestion.id,
            );
            const finalResult = result.data.hasOwnProperty("containers") ? result.data : null;
            console.log('finalResult: ' + JSON.stringify(result));
            setResults(finalResult);
            // setResults(result.data);
            onResult(finalResult);
        };
        fetchData();
    }, [suggestion.id]);

    return results && <SearchResults results={results}
                                     onPContainersClick={onPContainersClick}
                                     showPContainersButton={showPContainersButton}/>
};

export default ItemSearch;
