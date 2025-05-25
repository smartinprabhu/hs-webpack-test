import React from 'react';
import {
  Col,
  Row,
} from 'reactstrap';
import * as PropTypes from 'prop-types';

import EmployeeInfo from './employeeInfo';
import GeneralInfo from './generalInfo';

const EmployeeDetail = (props) => {
  const { isEdit, afterUpdate } = props;
  const reload = () => {
    if (afterUpdate) afterUpdate();
  };

  return (
    <>
      <Row className="m-0 bg-lightblue">
        <Col sm="12" md="12" lg="4" xs="12" className="p-2">
          <EmployeeInfo />
        </Col>
        <Col sm="12" md="12" lg="8" xs="12" className="p-2">
          <GeneralInfo isEdit={isEdit} afterUpdate={() => reload()} />
        </Col>
      </Row>
    </>
  );
};

EmployeeDetail.propTypes = {
  isEdit: PropTypes.bool.isRequired,
  afterUpdate: PropTypes.func.isRequired,
};

export default EmployeeDetail;
