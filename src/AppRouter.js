import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import App from "./App";
import TermsEN from "./TermsEN";
import TermsDE from "./TermsDE";
import {useTranslation} from "react-i18next";

const isIE = /*@cc_on!@*/false || !!document.documentMode;

function AppRouter() {
    const {t} = useTranslation();
    if (isIE) {
        return <div style={{marginLeft: 20, marginRight: 20, marginTop: 20}}>{t("browser_ie_note")}</div>;
    } else {
        return <Router>
            <div>
                <Route exact path="/" component={App} />
                <Route path="/terms_en" component={TermsEN} />
                <Route path="/terms_de" component={TermsDE} />
            </div>
        </Router>;
    }
}

export default AppRouter;
