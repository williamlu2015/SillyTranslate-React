import React from "react";
import PropTypes from "prop-types";
import {Button, Card, CardHeader} from "reactstrap";

import "./Header.css";

function Header(props) {
    return (
        <Card inverse className="header-card">
            <CardHeader className="app-title">
                SillyTranslate
                <Button className="recent-translations-button"
                        color="primary"
                        onClick={props.openRecentTranslations}>
                    Recent translations
                </Button>
            </CardHeader>
        </Card>
    );
}

Header.propTypes = {
    openRecentTranslations: PropTypes.func.isRequired
};

export default Header;
