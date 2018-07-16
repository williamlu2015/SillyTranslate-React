import React from "react";
import PropTypes from "prop-types";
import {push as PushMenu} from "react-burger-menu";
import RecentTranslation from "./RecentTranslation.js";
import {Button, Card, CardHeader} from "reactstrap";

import "./RecentTranslations.css";

function RecentTranslations(props) {
    return (
        <PushMenu right width="50%" disableCloseOnEsc disableOverlayClick
                  customBurgerIcon={false} customCrossIcon={false}
                  pageWrapId="page-wrap"
                  outerContainerId="outer-container"
                  isOpen={props.isOpen} >
            <Card inverse className="header-card">
                <CardHeader className="section-title">
                    Recent translations
                    <Button className="close-button"
                            color="primary"
                            onClick={props.handleClose}>
                        X
                    </Button>
                </CardHeader>
            </Card>
            {props.recentTranslations.map(function(translation, index) {
                return (
                    <RecentTranslation key={index}
                                       translation={translation} />
                );
            })}
        </PushMenu>
    );
}

RecentTranslations.propTypes = {
    recentTranslations: PropTypes.array.isRequired,
    isOpen: PropTypes.bool.isRequired,
    handleClose: PropTypes.func.isRequired
};

export default RecentTranslations;
