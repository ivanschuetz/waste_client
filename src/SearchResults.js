import React, {useState, useEffect} from "react";
import './App.css';
import {useTranslation} from "react-i18next";
import i18n from 'i18next';
const axios = require('axios');

const SearchResults = ({results, onPContainersClick, showPContainersButton}) => {
    const {t} = useTranslation();

    const listItems = () => {
        const categories = results['categories'];
        const containers = results['containers'];
        const pContainers = results['pcontainers'];
        const pickupCompanies = results['companies'];

        const categoryListItem = <li className="list-item-categories">{categories.map((category) => category.name).join(", ")}</li>;

        const containersListItems = containers.map(container => {
            const colorsStr = container["color"];
            const colors = colorsStr.split(",");

            let background= "";
            let dotClass = "dot";
            switch (colors.length) {
                case 1:
                    const color = colors[0];
                    background = "#" + colors;
                    if (color === 'FFFFFF')  {
                        dotClass = 'dot-bordered';
                    }
                    dotClass = color === 'FFFFFF' ? 'dot-bordered' : 'dot';
                    break;
                case 2:
                    const color1 = colors[0];
                    const color2 = colors[1];
                    background = "linear-gradient( -45deg, #" + color1 + ", #" + color1 + " 49%, white 49%, white 51%, #" + color2 + " 51% )";
                    break;
                default: console.log(`Invalid color string: ${colorsStr}`)
            }
            return <li className='container-list-item' key={'c' + container.id}>
                <span className={dotClass} style={{background: background, marginRight: 5}}/>
                {container.name}
            </li>
        });

        const pickupCompaniesListItems = pickupCompanies.map(companyResult => {
            const company = companyResult["company"];
            return <tr key={'p' + company.id} className="p-company-row">
                <td>
                    <a className='pickup-company-name' href={companyResult["website"] || company["website"]} target='_blank'
                       rel='noopener noreferrer'>
                        <span style={{verticalAlign: 'middle'}}>{company.name}</span>
                    </a>
                </td>
                <td>
                    <a className='company-data-link' href={"tel:" + company.phone}>
                        {/*<img src={require('./phone.svg')} style={{ verticalAlign: 'middle', marginRight: 5}} alt='map'/>*/}
                        <span style={{verticalAlign: 'middle'}}>{company.phone}</span>
                    </a>
                </td>
                <td>
                    <a className='company-data-link' href={"mailto:" + company.email} target='_blank'
                       rel='noopener noreferrer'>
                        {/*<img src={require('./email.svg')} style={{ verticalAlign: 'middle', marginRight: 5}} alt='map'/>*/}
                        <span style={{verticalAlign: 'middle'}}>Email</span>
                    </a>
                </td>
                {/*{company.address}*/}
                {/*{companyResult["min_weight"] || ""}<br/>*/}
            </tr>;
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

        const pickupCompaniesListItem = <li key='p-companies'><table className="p-company-table"><tbody>{ pickupCompaniesListItems }</tbody></table></li>;

        const categoriesHeaderTranslationKey = categories.length > 1 ? 'results_header_categories_plural' : 'results_header_categories_singular';
        const categoriesHeader = <li key='cheader' className='result-header'>{t(categoriesHeaderTranslationKey)}</li>;
        const containersHeader = <li key='cheader' className='result-header'>{t('results_header_containers')}</li>;
        const pickupCompaniesHeader = <li key='pheader' className='result-header'>{t('results_header_pickup')}</li>;
        const categoriesHeaderList = [categoriesHeader];
        const containersHeaderList = containersListItems.length > 0 ? [containersHeader] : [];
        const pickupCompaniesHeaderList = pickupCompaniesListItems.length > 0 ? [pickupCompaniesHeader] : [];

        return categoriesHeaderList
            .concat(categoryListItem)
            .concat(containersHeaderList)
            .concat(containersListItems)
            .concat(pickupCompaniesHeaderList)
            .concat(pickupCompaniesListItem)
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
            const result = await axios('https://woentsorgen.de:8443/options/' + suggestion.id, {
                // const result = await axios('https://localhost:8443/options/' + suggestion.id, {
                headers: {"lang": lang},
            });
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
