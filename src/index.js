import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import * as serviceWorker from './serviceWorker';
import {I18nextProvider} from "react-i18next";
// import { BrowserRouter } from 'react-router-dom';
import i18n from './i18n';
import * as ReactGA from 'react-ga'
import AppRouter from "./AppRouter";

ReactGA.initialize('UA-142482982-1'); // Prod
// ReactGA.initialize('UA-142477399-1', {
//     // debug: true
// }); // Test

const modalRoot = document.createElement('div');
modalRoot.setAttribute('id', 'modal-root');
document.body.append(modalRoot);

ReactDOM.render(
    <I18nextProvider i18n={ i18n }>
        {/*<BrowserRouter>*/}
            <AppRouter />
        {/*</BrowserRouter>*/}
    </I18nextProvider>,
    document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
