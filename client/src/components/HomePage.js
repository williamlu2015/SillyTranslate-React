import React, {Component} from "react";
import {Alert} from "reactstrap";
import autobind from "class-autobind";

import RecentTranslations from "./RecentTranslations.js";
import Header from "./Header.js";
import Translator from "./Translator.js";

import {getRecentTranslations, getSupportedLangNames} from "../api/Client.js";

class HomePage extends Component {
    constructor(props) {
        super(props);

        this.state = {
            supportedLangNames: [],
            recentTranslations: [],
            translationId: "",
            emailAddress: "",

            isPublicAlertOpen: false,
            isEmailAlertOpen: false,
            isRecentTranslationsOpen: false
        };

        autobind(this);
    }

    openPublicAlert(translationId) {
        this.setState({
            translationId: translationId,
            isPublicAlertOpen: true
        });
    }

    dismissPublicAlert() {
        this.setState({
            isPublicAlertOpen: false
        });
    }

    openEmailAlert(emailAddress) {
        this.setState({
            emailAddress: emailAddress,
            isEmailAlertOpen: true
        });
    }

    dismissEmailAlert() {
        this.setState({
            isEmailAlertOpen: false
        });
    }

    openRecentTranslations() {
        this.setState({
            isRecentTranslationsOpen: true
        });
    }

    closeRecentTranslations() {
        this.setState({
            isRecentTranslationsOpen: false
        });
    }

    async componentDidMount() {
        let supportedLangNamesPromise = this.initSupportedLangNames();
        let recentTranslationsPromise = this.initRecentTranslations();

        await supportedLangNamesPromise;
        await recentTranslationsPromise;
    }

    async initSupportedLangNames() {
        let supportedLangNames = await getSupportedLangNames();
        this.setState({
            supportedLangNames: supportedLangNames
        });
    }

    async initRecentTranslations() {
        let recentTranslations = await getRecentTranslations();
        this.setState({
            recentTranslations: recentTranslations
        });
    }

    render() {
        return (
            <div id="outer-container">
                <RecentTranslations
                    recentTranslations={this.state.recentTranslations}
                    isOpen={this.state.isRecentTranslationsOpen}
                    handleClose={this.closeRecentTranslations} />
                <main id="page-wrap" className="padded-element">
                    <Alert color="info"
                           isOpen={this.state.isPublicAlertOpen}
                           toggle={this.dismissPublicAlert} >
                        Share this translation by linking to { }
                        <a href={"translations/" + this.state.translationId}>
                            /translations/{this.state.translationId}
                        </a>
                    </Alert>
                    <Alert color="success"
                           isOpen={this.state.isEmailAlertOpen}
                           toggle={this.dismissEmailAlert} >
                        Results will be emailed to {this.state.emailAddress}
                    </Alert>
                    <Header openRecentTranslations={this.openRecentTranslations} />
                    <Translator
                        supportedLangNames={this.state.supportedLangNames}
                        openPublicAlert={this.openPublicAlert}
                        openEmailAlert={this.openEmailAlert} />
                </main>
            </div>
        );
    }
}

export default HomePage;
