import React, {Component} from "react";
import {Card, CardHeader} from "reactstrap";

import logo from "../images/react-logo.svg";
import "./NoMatch.css";

export default class NoMatch extends Component {
    componentDidMount() {
        document.title = "404 Not Found";
    }

    render() {
        return (
            <div className="padded-element">
                <Card inverse className="header-card">
                    <CardHeader className="app-title">
                        <span>404 Not Found</span>
                        <br />
                        <img src={logo} className="react-logo" alt="React logo" />
                    </CardHeader>
                </Card>
            </div>
        );
    }
}
