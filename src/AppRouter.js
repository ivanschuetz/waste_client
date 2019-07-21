import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import Terms from "./Terms";
import App from "./App";

function AppRouter() {
    return (
        <Router>
            <div>
                <Route exact path="/" component={App} />
                <Route path="/terms" component={Terms} />
            </div>
        </Router>
    );
}

export default AppRouter;
