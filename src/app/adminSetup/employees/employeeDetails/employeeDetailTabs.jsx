/* eslint-disable import/no-unresolved */
import React, { useState } from 'react';
import * as PropTypes from 'prop-types';
import {
  Card,
  CardBody,
  Col,
  Row,
  Nav,
  NavLink,
} from 'reactstrap';
import { useSelector } from 'react-redux';

import Loader from '@shared/loading';
import ErrorContent from '@shared/errorContent';
import tabs from './tabs.json';
import { generateErrorMessage } from '../../../util/appUtils';
import GeneralInfo from './generalInfo';
import Neighbourhoods from './neighbourhoods';

const EmployeeDetailTabs = (props) => {
  const { isEdit, afterUpdate } = props;
  const [currentTab, setActive] = useState('Contact Information');

  const reload = () => {
    if (afterUpdate) afterUpdate();
  };

  const { employeeDetails } = useSelector((state) => state.setup);

  return (
    <>
      <Row>
        <Col md="12" sm="12" lg="12" xs="12">
          <Card className="border-0 h-100">
            {employeeDetails && (employeeDetails.data && employeeDetails.data.length > 0) && (
            <CardBody>
              <Row>
                <Col md={12} sm={12} xs={12} lg={12}>

                  <Nav>
                    {tabs && tabs.tabsList.map((item) => (
                      <div className="mr-1 ml-2" key={item.id}>
                        <NavLink className="nav-link-item pt-2 pb-1 pl-1 pr-1" active={currentTab === item.name} href="#" onClick={() => setActive(item.name)}>{item.name}</NavLink>
                      </div>
                    ))}
                  </Nav>

                </Col>
              </Row>
              {currentTab === 'Contact Information'
                ? <GeneralInfo isEdit={isEdit} afterUpdate={() => reload()} />
                : ''}
                {currentTab === 'Neighbourhoods'
                  ? <Neighbourhoods />
                  : ''}
            </CardBody>
            )}
            {employeeDetails && employeeDetails.loading && (
            <CardBody className="mt-4" data-testid="loading-case">
              <Loader />
            </CardBody>
            )}

            {(employeeDetails && employeeDetails.err) && (
            <CardBody>
              <ErrorContent errorTxt={generateErrorMessage(employeeDetails)} />
            </CardBody>
            )}
          </Card>
        </Col>
      </Row>
    </>
  );
};

EmployeeDetailTabs.propTypes = {
  isEdit: PropTypes.bool.isRequired,
  afterUpdate: PropTypes.func.isRequired,
};

export default EmployeeDetailTabs;
