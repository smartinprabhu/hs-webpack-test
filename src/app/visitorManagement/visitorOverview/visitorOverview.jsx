import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Col,
  Row,
} from 'reactstrap';
import { Redirect } from 'react-router-dom';

import './visitorOverview.scss';
import Notifications from '../../dashboard/alerts';
import Insights from './insights';
import VisitorByCompany from './visitorByCompany';
import CheckedByCompany from './checkedByCompany';
import { getMenuItems } from '../../util/appUtils';
import {
  getVmsConfigurationData
} from '../visitorManagementService';
import SharedDashboard from '../../shared/sharedDashboard';

const appModels = require('../../util/appModels').default;

const visitorOverview = () => {
  const subMenu = 'Insights';
  const module = 'Visitor Management'
  const dispatch = useDispatch();
  const [isOldDashboard, setOldDashboard] = useState(false)

  const { userRoles } = useSelector((state) => state.user);
  const { userInfo } = useSelector((state) => state.user);
  const {
    vmsConfigList,
  } = useSelector((state) => state.visitorManagement);

  /* useEffect(() => {
    if (userInfo && userInfo.data) {
      dispatch(getVmsConfigInfo(userInfo.data.company.id, appModels.VMSCONFIGURATION));
    }
  }, [userInfo]); */

  useEffect(() => {
    if (userInfo && userInfo.data && userInfo.data.company) {
      dispatch(getVmsConfigurationData(userInfo.data.company.id, appModels.VMSCONFIGURATION));
    }
  }, [userInfo]);

  const menuList = getMenuItems(userRoles && userRoles.data ? userRoles.data.allowed_modules : [], 'Visitor Management', 'name');

  const menuData = menuList.filter((item) => item === subMenu);
  const isMenu = !!(menuData && menuData.length);

  if (!isMenu) {
    return (<Redirect to="/visitormanagement/visitrequest" />);
  }

  return (
    <Row className={`ml-1 mr-1 mt-2 mb-2 p-2 border ${isOldDashboard ? 'visitorOverview' : 'bg-med-blue-dashboard'}`}>
      <Col sm="12" md="12" lg="12" xs="12">
        <Row className={`p-1 ${isOldDashboard ? 'visitorOverview-main' : ''}`}>
          <Col sm="12" md={isOldDashboard ? 8 : 12} lg={isOldDashboard ? 8 : 12} xs="12" className={`p-0 ${isOldDashboard ? 'visitor-pass' : ''}`}>
            <SharedDashboard
              moduleName={module}
              menuName={subMenu}
              setOldDashboard={setOldDashboard}
              isOldDashboard={isOldDashboard}
            />
            {isOldDashboard && (
              <>
                <Insights />
                <Row className="m-0 p-3 visitorOverview-graphs">
                  <Col sm="12" md="12" lg="6" xs="12" className="p-0 visitorOverview-VisitorByCompany">
                    <VisitorByCompany />
                  </Col>
                  <Col sm="12" md="12" lg="6" xs="12" className="p-0 visitorOverview-CheckedByCompany">
                    <CheckedByCompany />
                  </Col>
                </Row>
              </>
            )}
          </Col>
          {isOldDashboard && (
            <Col sm="12" md="12" lg="4" className="p-0 visitor-alarms asset-insight-notifications">
              <Row className="pb-1 pt-2">
                <Col sm="12" md="12" lg="12">
                  <Notifications modelName={appModels.VISITREQUEST} />
                </Col>
              </Row>
            </Col>
          )}
        </Row>
      </Col>
    </Row>
  );
};
export default visitorOverview;
