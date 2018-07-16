import React from "react";
import PropTypes from "prop-types";
import {Modal, ModalBody, ModalHeader} from "reactstrap";

import TranslationResults from "./TranslationResults.js";

function TranslationResultsModal(props) {
    return (
        <Modal className="narrow-element"
               isOpen={props.isOpen} >
            <ModalHeader toggle={props.handleToggleResults}>
                Translation results
            </ModalHeader>
            <ModalBody>
                <TranslationResults results={props.results} />
            </ModalBody>
        </Modal>
    );
}

TranslationResultsModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    handleToggleResults: PropTypes.func.isRequired,
    results: PropTypes.array.isRequired
};

export default TranslationResultsModal;
