import React from "react";
import PropTypes from "prop-types";
import {Card, CardBody, CardHeader} from "reactstrap";
import last from "../lib/last.js";

function RecentTranslation({translation}) {
    return (
        <Card>
            <CardHeader>
                {translation.results[0]["text"]}
            </CardHeader>
            <CardBody className="equal-height-card-body">
                {last(translation.results)["text"]}
            </CardBody>
        </Card>
    );
}

RecentTranslation.propTypes = {
    key: PropTypes.number.isRequired,
    translation: PropTypes.object.isRequired
};

export default RecentTranslation;
