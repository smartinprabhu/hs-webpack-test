import React from 'react';
import {
  Col,
  Row,
} from 'reactstrap';
import * as PropTypes from 'prop-types';

import EmployeeInfo from './employeeInfo';
import GeneralInfo from './generalInfo';

const EmployeeDetail = (props) => {
  const {
    isEdit, afterUpdate, showFilter,
  } = props;
  const reload = () => {
    if (afterUpdate) afterUpdate();
  };

  return (
    <Row className="m-0">
      <Col sm="12" md="12" lg="4" xs="12" className="p-2">
        <EmployeeInfo />
      </Col>
      <Col sm="12" md="12" lg="8" xs="12" className="p-2">
        <GeneralInfo isEdit={isEdit} showFilter={showFilter} afterUpdate={() => reload()} />
      </Col>
    </Row>
  );
};

EmployeeDetail.propTypes = {
  isEdit: PropTypes.bool.isRequired,
  afterUpdate: PropTypes.func.isRequired,
  showFilter: PropTypes.func.isRequired,
};

export default EmployeeDetail;
