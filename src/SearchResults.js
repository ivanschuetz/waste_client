import React, {useState, useEffect} from "react";
import './App.css';
import {useTranslation} from "react-i18next";
import i18n from 'i18next';

const axios = require('axios');

const SearchResults = ({results, onPContainersClick, showPContainersButton}) => {
    const {t} = useTranslation();

    const listItems = () => {
        const containers = results['containers'];
        const pContainers = results['pcontainers'];
        const pickupCompanies = results['companies'];
        const containersListItems = containers.map(container => {
            const color = container["color"];
            const dotClass = color === 'FFFFFF' ? 'dot-bordered' : 'dot';
            return <li className='container-list-item' key={'c' + container.id}>
                <span className={dotClass} style={{backgroundColor: "#" + color, marginRight: 5}}/>
                {container.name}
            </li>
        });

        const pickupCompaniesListItems = pickupCompanies.map(companyResult => {
            const company = companyResult["company"];
            return <li key={'p' + company.id}>
                <a className='pickup-company-name' href={companyResult["website"] || company["website"]} target='_blank'
                   rel='noopener noreferrer'>
                    <span style={{verticalAlign: 'middle'}}>{company.name}</span>
                </a>
                <a className='company-data-link' href={"tel:" + company.phone}>
                    {/*<img src={require('./phone.svg')} style={{ verticalAlign: 'middle', marginRight: 5}} alt='map'/>*/}
                    <span style={{verticalAlign: 'middle'}}>{company.phone}</span>
                </a>
                <a className='company-data-link' href={"mailto:" + company.email} target='_blank'
                   rel='noopener noreferrer'>
                    {/*<img src={require('./email.svg')} style={{ verticalAlign: 'middle', marginRight: 5}} alt='map'/>*/}
                    <span style={{verticalAlign: 'middle'}}>{company.email}</span>
                </a>
                <br/>
                {/*{company.address}*/}
                {/*{companyResult["min_weight"] || ""}<br/>*/}
            </li>;
        });

        const pContainersListItems = [];
        if (pContainers.length > 0) {
            if (showPContainersButton) {
                pContainersListItems.push(
                    <li key='pcont' className='result-header-p-containers'>
                        <div className='p-containers-link' onClick={onPContainersClick}>
                            <div className='p-containers-span'>
                                <img src={require('./map.svg')} style={{verticalAlign: 'middle', marginRight: 5}}
                                     alt='map'/>
                                <span
                                    style={{verticalAlign: 'middle'}}>{t('results_header_public_containers')} ({pContainers.length})</span>
                            </div>
                        </div>
                    </li>
                )
            } else {
                pContainersListItems.push(
                    <li key='pcheader' className='result-header-p-containers'>
                        <div style={{marginTop: 20, fontWeight: 'bold'}}>{t('results_header_public_containers')}</div>
                    </li>
                );
            }
        }

        const containersHeader = <li key='cheader' className='result-header'>{t('results_header_containers')}</li>;
        const pickupCompaniesHeader = <li key='pheader' className='result-header'>{t('results_header_pickup')}</li>;
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
    const [results, setResults] = useState(null);

    useEffect(() => {
        setResults(null); // When selecting a new suggestion, stop showing current results immediately

        const fetchData = async () => {
            const lang = i18n.language;
            const result = await axios('http://localhost:8080/options/' + suggestion.id, {headers: {"lang": lang}});
            // await sleep(2000);

            const finalResult = result.data.hasOwnProperty("containers") ? result.data : null;
            setResults(finalResult);
            onResult(finalResult);
        };
        fetchData();
    }, [suggestion.id]);

    return results && <SearchResults results={results}
                                     onPContainersClick={onPContainersClick}
                                     showPContainersButton={showPContainersButton}/>
};

export default ItemSearch;
