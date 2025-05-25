/* eslint-disable import/no-unresolved */
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import {
  Col,
  Row,
} from 'reactstrap';
import { Redirect } from 'react-router-dom';

import ErrorContent from '@shared/errorContent';

import Navbar from './navbar/navbar';
import {
  getMenuItems,
} from '../util/appUtils';
import SharedDashboard from '../shared/sharedDashboard';

const Overview = () => {
  const subMenu = 'Insights';
  const module = '52 Week PPM'
  const [isOldDashboard, setOldDashboard] = useState(false)
  const { userRoles } = useSelector((state) => state.user);
  const menuList = getMenuItems(userRoles && userRoles.data ? userRoles.data.allowed_modules : [], module, 'name');

  const menuData = menuList.filter((item) => item === subMenu);
  const isMenu = !!(menuData && menuData.length);

  if (!isMenu) {
    return (<Redirect to="/preventive-viewer" />);
  }

  return (
    <Row className="ml-1 mr-1 mt-2 mb-2 p-2 border bg-med-blue-dashboard">
      <Col sm="12" md="12" lg="12" xs="12">
        <Row className="p-1">
          <Col sm="12" md="12" lg="12" xs="12" className="p-0">
            <SharedDashboard
              moduleName={module}
              menuName={subMenu}
              setOldDashboard={setOldDashboard}
              isOldDashboard={isOldDashboard}
            />
              {isOldDashboard && (
              <ErrorContent errorTxt="Please Contact Admin" />
            )}
          </Col>
        </Row>
      </Col>
    </Row>
  );
};
export default Overview;
