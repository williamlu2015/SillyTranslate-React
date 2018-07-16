import React, {Component} from "react";
import PropTypes from "prop-types";
import {
    Button, ButtonDropdown, Card, CardBody,
    DropdownItem, DropdownMenu, DropdownToggle,
    Modal,
    ModalBody,
    ModalFooter,
    ModalHeader
} from "reactstrap";
import {
    SortableContainer,
    SortableElement
} from "react-sortable-hoc";

import "./LanguagesModal.css";

export default class LanguagesModal extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isDropdownOpen: false
        };

        this.bindHandlers();
    }

    bindHandlers() {
        this.handleToggleDropdown = this.handleToggleDropdown.bind(this);
    }

    handleToggleDropdown() {
        this.setState({
            isDropdownOpen: !this.state.isDropdownOpen
        });
    }

    render() {
        return (
            <Modal isOpen={this.props.isOpen}>
                <ModalHeader>
                    Select custom languages
                    {this.renderAddLanguageDropdown()}
                </ModalHeader>
                <ModalBody>
                    <SortableList items={this.props.customLanguages}
                                  onSortEnd={this.props.swapLanguages}
                                  handleClick={this.props.removeLanguage} />
                </ModalBody>
                <ModalFooter>
                    <Button color="primary"
                            onClick={this.props.handleToggleLanguages}
                    >Save</Button>
                </ModalFooter>
            </Modal>
        );
    }

    renderAddLanguageDropdown() {
        const MODIFIERS = {
            setMaxHeight: {
                enabled: true,
                order: 890,
                fn: function(data) {
                    return {
                        ...data,
                        styles: {
                            ...data.styles,
                            overflow: "auto",
                            maxHeight: "2000%"
                        }
                    };
                }
            }
        };

        return (
            <ButtonDropdown className="custom-languages-dropdown"
                            isOpen={this.state.isDropdownOpen}
                            toggle={this.handleToggleDropdown}>
                <DropdownToggle caret>
                    Add language
                </DropdownToggle>
                <DropdownMenu modifiers={MODIFIERS}
                              style={{"z-index": "100000"}}>
                    {this.props.supportedLangNames.map((langName, index) => {
                        return (
                            <DropdownItem
                                key={index}
                                onClick={() => this.props.addLanguage(langName)}
                            >
                                {langName}
                            </DropdownItem>
                        );
                    })}
                </DropdownMenu>
            </ButtonDropdown>
        );
    }
}

LanguagesModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    supportedLangNames: PropTypes.array.isRequired,
    customLanguages: PropTypes.array.isRequired,
    addLanguage: PropTypes.func.isRequired,
    swapLanguages: PropTypes.func.isRequired,
    removeLanguage: PropTypes.func.isRequired,
    handleToggleLanguages: PropTypes.func.isRequired
};

const SortableList = SortableContainer(({items, handleClick}) => {
    return (
        <div>
            {items.map(function(value, index) {
                return (
                    <SortableItem key={index}
                                  index={index}
                                  value={value}
                                  handleClick={handleClick}
                    />
                );
            })}
        </div>
    );
});

SortableList.propTypes = {
    items: PropTypes.array.required,
    handleClick: PropTypes.func.required
};

const SortableItem = SortableElement(({index, value, handleClick}) => {
    return (
        <Card id="sortable-card">
            <CardBody id="sortable-card-body">
                {value}
                <Button className="remove-button"
                        color="link" onClick={() => handleClick(index)}>X</Button>
            </CardBody>
        </Card>
    );
});

SortableItem.propTypes = {
    index: PropTypes.number.required,
    value: PropTypes.any.required,
    handleClick: PropTypes.func.required
};
