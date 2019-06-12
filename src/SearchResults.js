import React, {useState, useEffect} from "react";
import './App.css';
const axios = require('axios');

const SearchResults = ({results}) => {
    console.log('rendering search results: ' + JSON.stringify(results));

    const listItems = () => {
        const containers = results['containers'];
        const pContainers = results['pcontainers'];
        const pickupCompanies = results['companies'];
        const containersListItems = containers.map(container =>
            <li key={'c' + container.id}>
                <span className="dot" style={{backgroundColor: "#" + container.color}}/>
                {container.name}
            </li>
        );
        const pContainersListItems = pContainers.map(pContainer =>
            <li key={'p' + pContainer.id}>{pContainer.name} {pContainer.address}</li>
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
        return containersListItems.concat(pContainersListItems).concat(pickupCompaniesListItems)
    };

    return (
        <ul>
            {listItems()}
        </ul>
    );
};

const ItemSearch = ({suggestion, onResult}) => {
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
            onResult(finalResult)
        };
        fetchData();
    }, [suggestion.id]);

    return results && <SearchResults results={results}/>
};

export default ItemSearch;
