import React from "react";
import {BrowserRouter, Route, Switch} from "react-router-dom";

import HomePage from "./HomePage.js";
import Translation from "./Translation.js";
import NoMatch from "./NoMatch.js";

import "./App.css";

export default function App() {
    return (
        <BrowserRouter>
            <Switch>
                <Route exact path="/"
                       component={HomePage} />
                <Route exact path="/translations/:translationId"
                       component={Translation} />
                <Route component={NoMatch} />
            </Switch>
        </BrowserRouter>
    );
}
