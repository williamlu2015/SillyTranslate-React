import React from "react";
import PropTypes from "prop-types";
import {Card, CardBody, CardHeader} from "reactstrap";

function TranslationResults({results}) {
    return (
        <div>
            {results.map(function(entry, index) {
                return (
                    <Card key={index}>
                        <CardHeader>
                            {entry["langName"]}
                        </CardHeader>
                        <CardBody className="equal-height-card-body">
                            {entry["text"]}
                        </CardBody>
                    </Card>
                );
            })}
        </div>
    );
}

TranslationResults.propTypes = {
    results: PropTypes.array.isRequired
};

export default TranslationResults;
