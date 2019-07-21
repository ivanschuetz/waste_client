import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import App from "./App";
import TermsEN from "./TermsEN";
import TermsDE from "./TermsDE";

function AppRouter() {
    return (
        <Router>
            <div>
                <Route exact path="/" component={App} />
                <Route path="/terms_en" component={TermsEN} />
                <Route path="/terms_de" component={TermsDE} />
            </div>
        </Router>
    );
}

export default AppRouter;
