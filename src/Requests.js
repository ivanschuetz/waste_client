import i18n from 'i18next';
import {auth} from "./globals";

const axios = require('axios');

export const requestSuggestions = async (text, onRequest) => {
    if (!text) {
        return [];
    }

    onRequest();

    const lang = i18n.language;

    const result = await axios('https://wohin-mit.de:8443/suggestions/' + text, {
    // const result = await axios('http://localhost:8080/suggestions/' + text, {
        headers: {"lang": lang},
        auth: auth
    });
    // await sleep(2000);

    const data = result.data;
    // TODO handle http errors (they are returned here, not in onrejected)
    return Array.isArray(data) ? data : [];
};
