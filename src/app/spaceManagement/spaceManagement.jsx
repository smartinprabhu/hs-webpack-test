import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Col, Row,
} from 'reactstrap';
import { getFloorsList } from '../assets/equipmentService';
import { getSpaceCategory } from './spaceService';
import SpaceDetail from './spaceDetail';
import SpaceNavbar from './navbar/spaceNavbar';
import {
  getAllowedCompanies,
} from '../util/appUtils';

const appModels = require('../util/appModels').default;

const SpaceManagement = () => {
  const dispatch = useDispatch();
  const subMenu = "Space Management";
  const { userInfo, userRoles } = useSelector((state) => state.user);
  const { getFloorsInfo } = useSelector((state) => state.equipment);
  const companies = getAllowedCompanies(userInfo);

  useEffect(() => {
    if (userInfo && userInfo.data) {
      dispatch(getFloorsList(companies, appModels.SPACE));
      dispatch(getSpaceCategory());
    }
  }, [userInfo]);


  return (
    <Row className="ml-1 mr-1 mt-2 mb-2 p-3 space-management border">
      <Col sm="12" md="12" lg="12" xs="12">
        <SpaceNavbar id={subMenu} />
        <div className="pt-3">
          <SpaceDetail
            title={userInfo && userInfo.data ? userInfo.data.company.name : ''}
            data={getFloorsInfo && getFloorsInfo.data ? getFloorsInfo.data : []}
          />
        </div>
      </Col>
    </Row>
  );
};

export default SpaceManagement;
