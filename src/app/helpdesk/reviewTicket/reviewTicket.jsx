import React from 'react';
import { useFormikContext } from 'formik';
import {
  Row, Col,
} from 'reactstrap';
import PropTypes from 'prop-types';

import SubjectDetails from './subjectDetails';
import RequestorDetails from './requestorDetails';
import AssetDetails from './assetDetails';
import TicketDetails from './ticketDetails';
import DescriptionDetails from './descriptionDetail';
import IncidentDetail from './incidentDetail';

const ReviewTicket = (props) => {
  const { setFieldValue, isIncident, isFITTracker } = props;
  const { values: formValues } = useFormikContext();
  return (
    <Row className="mr-3">
      <Col xs={12} sm={12} lg={12}><SubjectDetails formValues={formValues} /></Col>
      <Col xs={12} sm={12} lg={4}><RequestorDetails isFITTracker={isFITTracker} setFieldValue={setFieldValue} formValues={formValues} /></Col>
      <Col xs={12} sm={12} lg={4}><AssetDetails formValues={formValues} /></Col>
      <Col xs={12} sm={12} lg={4}><TicketDetails formValues={formValues} isIncident={isIncident} /></Col>
      <Col xs={12} sm={12} lg={12}><DescriptionDetails formValues={formValues} isIncident={isIncident} /></Col>
      {isIncident && (
        <Col xs={12} sm={12} lg={12}><IncidentDetail formValues={formValues} /></Col>
      )}

    </Row>
  );
};

ReviewTicket.propTypes = {
  setFieldValue: PropTypes.oneOfType([PropTypes.func, PropTypes.string]).isRequired,
  isIncident: PropTypes.bool,
};
ReviewTicket.defaultProps = {
  isIncident: false,
};

export default ReviewTicket;
