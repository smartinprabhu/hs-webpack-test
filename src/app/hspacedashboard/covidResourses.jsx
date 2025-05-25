/* eslint-disable react/no-danger */

import React from 'react';
import {
  Row,
  Col,
} from 'reactstrap';
import { useSelector } from 'react-redux';

const appConfig = require('@app/config/appConfig').default;

const CovidResources = () => {
  const { userRoles } = useSelector((state) => state.user);


  return (
    <Row className="bg-azure h-100 covid-resources rounded ml-3 m-0 p-0 dashboardTileHeight">
      <Col sm="12" className="px-0">
        {userRoles && userRoles.data && userRoles.data.general && userRoles.data.general.branding && userRoles.data.general.branding.logo_file_path && (
          <img
            src={`${window.location.origin}${userRoles.data.general.branding.logo_file_path}`}
            alt="nttImage"
            height="100%"
            width="100%"
          />
        )}
      </Col>
    </Row>
  );
};

export default CovidResources;
