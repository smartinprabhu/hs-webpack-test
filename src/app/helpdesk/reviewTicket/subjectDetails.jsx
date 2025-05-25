/* eslint-disable react/no-danger */
/* eslint-disable camelcase */
import React from 'react';
import PropTypes from 'prop-types';
import {
  Col, Row,
} from 'reactstrap';

import {
  getDefaultNoValue,
} from '../../util/appUtils';

const SubjectDetails = (props) => {
  const { formValues } = props;

  return (
    <>
      <span className="d-inline-block pb-1 mb-2 font-weight-bold">Subject</span>
      <Row>
        <Col xs={12} sm={12} md={12} lg={12}>
          <Row className="m-0">
            <span className="m-1 bw-2 font-weight-500">{getDefaultNoValue(formValues.subject)}</span>
          </Row>
          <hr className="m-1" />
        </Col>
      </Row>
    </>
  );
};

SubjectDetails.propTypes = {
  formValues: PropTypes.shape({
    subject: PropTypes.string,
    description: PropTypes.string,
  }).isRequired,
};

export default SubjectDetails;
