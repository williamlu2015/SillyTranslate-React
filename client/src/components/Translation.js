import React, {Component} from "react";
import PropTypes from "prop-types";
import {Card, CardHeader} from "reactstrap";

import NoMatch from "./NoMatch.js";
import TranslationResults from "./TranslationResults.js";

import {getTranslation} from "../api/Client.js";

export default class Translation extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isNotFound: false,
            results: []
        };
    }

    async componentDidMount() {
        let translationId = this.props.match.params.translationId;
        let translation = await getTranslation(translationId);
        if (translation === null) {
            this.setState({
                isNotFound: true
            });
            return;
        }

        this.setState({
            results: translation["results"]
        });
    }

    render() {
        if (this.state.isNotFound) {
            return <NoMatch />;
        }

        return (
            <div className="padded-element">
                <Card inverse className="header-card">
                    <CardHeader className="app-title">
                        Translation results
                    </CardHeader>
                </Card>
                <TranslationResults results={this.state.results} />
            </div>
        );
    }
}

Translation.propTypes = {
    match: PropTypes.shape({
        params: PropTypes.shape({
            translationId: PropTypes.string.isRequired
        })
    })
};
