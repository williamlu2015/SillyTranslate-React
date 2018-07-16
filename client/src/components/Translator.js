import assert from "assert";
import React, {Component} from "react";
import PropTypes from "prop-types";
import {
    Button,
    Card,
    CardBody,
    CardHeader,
    Form,
    FormFeedback,
    FormGroup,
    Input,
    InputGroup,
    InputGroupAddon,
    Label,
    Nav,
    NavItem,
    NavLink,
    Progress,
    TabContent,
    Table,
    TabPane, Tooltip
} from "reactstrap";
import {arrayMove} from "react-sortable-hoc";
import autobind from "class-autobind";
import classnames from "classnames";

import resizeTextareas from "../lib/resizeTextareas.js";

import "./Translator.css";
import LanguagesModal from "./LanguagesModal.js";
import TranslationResultsModal from "./TranslationResultsModal.js";
import last from "../lib/last.js";
import {translateAjax, translateEmail} from "../api/Client.js";
import isWeakInteger from "../lib/isWeakInteger.js";

export const MAX_LENGTH = 1000;

export default class Translator extends Component {
    constructor(props) {
        super(props);

        this.state = {
            activeTab: 0,

            type: 0,
            numLanguages: "",
            customLanguages: [],
            isPublic: true,
            emailAddress: "",

            srcText: "",
            destText: "",
            results: [],

            isLanguagesOpen: false,
            isResultsOpen: false,
            isInProgress: false
        };

        autobind(this);
    }

    // ===============
    // handler methods

    handleChangeTab(tab) {
        this.setState({
            activeTab: tab
        });

        this.forceUpdate(resizeTextareas);
    }

    handleChangeType(type) {
        this.setState({
            type: type
        });
    }

    handleChangeNumLanguages(event) {
        this.setState({
            numLanguages: event.target.value
        });
    }

    addLanguage(langName) {
        let newCustomLanguages = this.state.customLanguages.slice();
        newCustomLanguages.push(langName);

        this.setState({
            customLanguages: newCustomLanguages
        });
    }

    swapLanguages(indices) {
        this.setState({
            customLanguages: arrayMove(
                this.state.customLanguages, indices.oldIndex, indices.newIndex
            )
        });
    }

    removeLanguage(index) {
        let newCustomLanguages = this.state.customLanguages.slice();
        newCustomLanguages.splice(index, 1);

        this.setState({
            customLanguages: newCustomLanguages
        });
    }

    handleChangeIsPublic(event) {
        this.setState({
            isPublic: event.target.checked
        });
    }

    handleChangeEmailAddress(event) {
        this.setState({
            emailAddress: event.target.value
        });
    }

    handleChangeSrcText(event) {
        this.setState({
            srcText: event.target.value
        });

        resizeTextareas();
    }

    async handleSubmit() {
        this.setState({
            isInProgress: true
        });

        let options;
        if (this.state.type === 0) {
            options = this.state.numLanguages;
        } else if (this.state.type === 1) {
            options = null;
        } else {
            assert(this.state.type === 2);
            options = this.state.customLanguages;
        }

        let isAjax = this.state.activeTab === 0;
        if (isAjax) {
            let response = await translateAjax(
                this.state.srcText,
                this.state.type,
                options,
                this.state.isPublic
            );

            this.setState({
                destText: last(response.results)["text"],
                results: response.results
            });

            if (response.translationId !== null) {
                this.props.openPublicAlert(response.translationId);
            }
        } else {
            let emailAddress = this.state.emailAddress;   // we bind a variable
            // to this.state.emailAddress in case this.state.emailAddress
            // changes while translateEmail() is executing

            await translateEmail(
                this.state.srcText,
                this.state.type,
                options,
                this.state.isPublic,
                emailAddress
            );

            this.props.openEmailAlert(emailAddress);   // we use the variable we
            // bound above
        }

        this.setState({
            isInProgress: false
        });

        resizeTextareas();
    }

    handleToggleLanguages() {
        this.setState({
            isLanguagesOpen: !this.state.isLanguagesOpen
        });
    }

    handleToggleResults() {
        this.setState({
            isResultsOpen: !this.state.isResultsOpen
        });
    }

    // =================
    // validator methods

    canSubmit() {
        return this.isValidOptions()
            && this.isValidEmail()
            && this.isValidSrcText();
    }

    isValidOptions() {
        return (this.state.type === 0 && this.isValidNumLanguages())
            || this.state.type === 1
            || (this.state.type === 2 && this.isValidCustomLanguages());
    }

    isValidNumLanguages() {
        if (!isWeakInteger(this.state.numLanguages)) {
            return false;
        }

        let integer = parseInt(this.state.numLanguages, 10);
        return integer >= 1;
    }

    isValidCustomLanguages() {
        return this.state.customLanguages.length >= 1;
    }

    isValidEmail() {
        return this.state.activeTab === 0
            || (this.state.activeTab === 1
                && this.isValidEmailAddress());
    }

    isValidEmailAddress() {
        return this.state.emailAddress.length >= 1;
    }

    isValidSrcText() {
        return this.state.srcText.length >= 1
            && this.state.srcText.length <= MAX_LENGTH;
    }

    hasResults() {
        return this.state.results.length > 0;
    }

    // ================
    // renderer methods

    render() {
        return (
            <Card>
                <CardHeader>
                    <Nav pills>
                        {this.renderTab(0, "Translate in browser")}
                        {this.renderTab(1, "Send results to email")}
                    </Nav>
                </CardHeader>
                <CardBody>
                    {this.renderOptions()}
                    <TabContent activeTab={this.state.activeTab}>
                        <TabPane tabId={0}>
                            {this.renderBrowserDisplay()}
                        </TabPane>
                        <TabPane tabId={1}>
                            {this.renderEmailDisplay()}
                        </TabPane>
                    </TabContent>
                    <LanguagesModal
                        isOpen={this.state.isLanguagesOpen}
                        supportedLangNames={this.props.supportedLangNames}
                        customLanguages={this.state.customLanguages}
                        addLanguage={this.addLanguage}
                        swapLanguages={this.swapLanguages}
                        removeLanguage={this.removeLanguage}
                        handleToggleLanguages={this.handleToggleLanguages}
                    />
                    <TranslationResultsModal
                        isOpen={this.state.isResultsOpen}
                        handleToggleResults={this.handleToggleResults}
                        results={this.state.results}
                    />
                </CardBody>
            </Card>
        );
    }

    renderTab(id, text) {
        return (
            <NavItem>
                <NavLink
                    className={classnames({
                        active: this.state.activeTab === id
                    })}
                    onClick={() => this.handleChangeTab(id)}
                >
                    {text}
                </NavLink>
            </NavItem>
        );
    }

    renderOptions() {
        return (
            <div>
                {this.renderType0()}
                {this.renderType1()}
                {this.renderType2()}
                {this.renderIsPublic()}
            </div>
        );
    }

    renderType0() {
        return (
            <Form inline className="input-row">
                <Input type="radio"
                       checked={this.state.type === 0}
                       onClick={() => this.handleChangeType(0)} />
                <Label className="left-label-button">Translate the source text through</Label>
                <FormGroup>
                    <Input type="text"
                           invalid={this.state.type === 0 && !this.isValidNumLanguages()}
                           value={this.state.numLanguages}
                           placeholder="#"
                           onChange={this.handleChangeNumLanguages}
                           disabled={this.state.type !== 0}
                           size="sm"
                           className="number-text"
                    />
                    <FormFeedback invalid={this.state.type === 0 && !this.isValidNumLanguages()}
                                  tooltip
                                  className="feedback-tooltip">
                        Enter a positive integer
                    </FormFeedback>
                </FormGroup>
                <Label className="right-label-button">random foreign languages</Label>
            </Form>
        );
    }

    renderType1() {
        return (
            <Form inline className="input-row">
                <Input type="radio"
                       checked={this.state.type === 1}
                       onClick={() => this.handleChangeType(1)} />
                <Label>Translate the source text through a random permutation of
                    all foreign languages (warning: slow)</Label>
            </Form>
        );
    }

    renderType2() {
        return (
            <Form inline className="input-row">
                <Input type="radio"
                       checked={this.state.type === 2}
                       onClick={() => this.handleChangeType(2)} />
                <Label>Translate the source text through a</Label>
                <Button id="languages-button"
                        className="button-text"
                        onClick={this.handleToggleLanguages}
                        disabled={this.state.type !== 2}
                        color="link">custom sequence</Button>
                <Label>of foreign languages</Label>
                <Tooltip className="validation-tooltip"
                         hideArrow={true}
                         placement="bottom"
                         isOpen={this.state.type === 2 && !this.isValidCustomLanguages() && !this.state.isLanguagesOpen}
                         target="languages-button"
                         toggle={() => null}>
                    Select at least one language
                </Tooltip>
            </Form>
        );
    }

    renderIsPublic() {
        return (
            <Form inline className="input-row">
                <Input type="checkbox"
                       checked={this.state.isPublic}
                       onChange={this.handleChangeIsPublic}>
                </Input>
                <Label>Add translation results to Recent Translations, and generate a shareable URL</Label>
            </Form>
        );
    }

    renderBrowserDisplay() {
        return (
            <Table borderless className="display-table">
                {this.renderBrowserDisplayButtons()}
                {this.renderBrowserDisplayTextareas()}
            </Table>
        );
    }

    renderBrowserDisplayButtons() {
        return (
            <tr>
                <td className="left-cell">
                    {this.state.isInProgress ?
                        <Progress animated value="100" /> :
                        <Button color="primary"
                                onClick={this.handleSubmit}
                                disabled={!this.canSubmit()} >
                            Submit
                        </Button>
                    }
                </td>
                <td className="right-cell">
                    <Button color="primary"
                            onClick={this.handleToggleResults}
                            disabled={!this.hasResults()} >
                        View results
                    </Button>
                </td>
            </tr>
        );
    }

    renderBrowserDisplayTextareas() {
        return (
            <tr>
                <td className="left-cell">
                    <FormGroup>
                        <Input type="textarea"
                               valid={this.isValidSrcText()}
                               invalid={!this.isValidSrcText()}
                               value={this.state.srcText}
                               placeholder="Source text..."
                               onChange={this.handleChangeSrcText}
                               className="display-textarea" />
                        <FormFeedback valid={this.isValidSrcText()}
                                      invalid={!this.isValidSrcText()} >
                            {this.state.srcText.length} / {MAX_LENGTH} characters
                        </FormFeedback>
                    </FormGroup>
                </td>
                <td className="right-cell">
                    <Input type="textarea"
                           value={this.state.destText}
                           placeholder="Translated text..."
                           readOnly
                           className="display-textarea" />
                </td>
            </tr>
        );
    }

    renderEmailDisplay() {
        return (
            <Table borderless className="display-table">
                {this.renderEmailDisplayButtons()}
                {this.renderEmailDisplayTextarea()}
            </Table>
        );
    }

    renderEmailDisplayButtons() {
        return (
            <tr>
                <td className="one-cell">
                    <InputGroup>
                        <InputGroupAddon addonType="prepend">
                            <Button color="primary"
                                    onClick={this.handleSubmit}
                                    disabled={!this.canSubmit()}>
                                Submit
                            </Button>
                        </InputGroupAddon>
                        <Input type="text"
                               invalid={!this.isValidEmailAddress()}
                               value={this.state.emailAddress}
                               placeholder="Email address"
                               onChange={this.handleChangeEmailAddress} />
                    </InputGroup>
                </td>
            </tr>
        );
    }

    renderEmailDisplayTextarea() {
        return (
            <tr>
                <td className="one-cell">
                    <FormGroup>
                        <Input type="textarea"
                               valid={this.isValidSrcText()}
                               invalid={!this.isValidSrcText()}
                               value={this.state.srcText}
                               placeholder="Source text..."
                               onChange={this.handleChangeSrcText}
                               className="display-textarea" />
                        <FormFeedback valid={this.isValidSrcText()}
                                      invalid={!this.isValidSrcText()} >
                            {this.state.srcText.length} / {MAX_LENGTH} characters
                        </FormFeedback>
                    </FormGroup>
                </td>
            </tr>
        );
    }
}

Translator.propTypes = {
    supportedLangNames: PropTypes.array.isRequired,
    openPublicAlert: PropTypes.func.isRequired,
    openEmailAlert: PropTypes.func.isRequired
};
