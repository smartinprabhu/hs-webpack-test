/* eslint-disable import/no-unresolved */
import React, { useState } from 'react';
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
import MaintenanceUpdateForm from './maintenanceUpdateForm';
import WarrantyUpdateForm from './warrantyUpdateForm';
import AdditionalUpdateForm from './additionalUpdateForm';
import { generateErrorMessage } from '../../../util/appUtils';

const AssetDetailTabsUpdate = () => {
  const [currentTab, setActive] = useState('Warranty');
  const { equipmentsDetails } = useSelector((state) => state.equipment);

  return (
    <>
      <Row>
        <Col md="12" sm="12" lg="12" xs="12">
          <Card className="border-0 h-100">
            {equipmentsDetails && (equipmentsDetails.data && equipmentsDetails.data.length > 0) && (
            <CardBody className="p-0">
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
              <br />

              {currentTab === 'Maintenance'
                ? <MaintenanceUpdateForm />
                : ''}

              {currentTab === 'Warranty'
                ? <WarrantyUpdateForm />
                : ''}

              {currentTab === 'Additional Info'
                ? <AdditionalUpdateForm />
                : ''}

            </CardBody>
            )}
            {equipmentsDetails && equipmentsDetails.loading && (
            <CardBody className="mt-4" data-testid="loading-case">
              <Loader />
            </CardBody>
            )}

            {(equipmentsDetails && equipmentsDetails.err) && (
            <CardBody>
              <ErrorContent errorTxt={generateErrorMessage(equipmentsDetails)} />
            </CardBody>
            )}
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default AssetDetailTabsUpdate;
