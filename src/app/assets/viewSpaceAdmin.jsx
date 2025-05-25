/* eslint-disable import/no-unresolved */
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Col, Row, UncontrolledTooltip,
} from 'reactstrap';

import filterIcon from '@images/filter.png';
import SideCollapse from './sidebar/sideCollapse';
import { getBuildings } from './equipmentService';
import LocationDetails from './locationDetails/locationDetail';
import CompanyData from './locationDetails/companyData';
import {
  getAllCompanies,
} from '../util/appUtils';

const appModels = require('../util/appModels').default;

const ViewSpaceAdmin = () => {
  const dispatch = useDispatch();

  const [collapse, setCollapse] = useState(false);

  const { userInfo, userRoles } = useSelector((state) => state.user);
  const { buildingsInfo } = useSelector((state) => state.equipment);
  const { companyDetail } = useSelector((state) => state.setup);

  useEffect(() => {
    if (userInfo && userInfo.data) {
      const companies = getAllCompanies(userInfo, userRoles);
      dispatch(getBuildings(companies, appModels.SPACE));
    }
  }, [userInfo]);

  return (

    <Row className="pt-4">
      <Col md="12" sm="12" lg={collapse ? 1 : 3} xs="12" className="mt-2">
        {collapse ? (
          <>
            <img src={filterIcon} height="30px" aria-hidden="true" width="30px" alt="filters" onClick={() => setCollapse(!collapse)} className="cursor-pointer" id="filters" />
            <UncontrolledTooltip target="filters" placement="right">
              Filters
            </UncontrolledTooltip>
          </>
        ) : (
          <SideCollapse
            title="Locations"
            data={buildingsInfo && buildingsInfo.data ? buildingsInfo.data : []}
            setCollapse={setCollapse}
            collapse={collapse}
          />
        )}
      </Col>
      <Col md="12" sm="12" lg={collapse ? 11 : 9} xs="12" className={collapse ? 'filter-margin-left pt-2' : 'pt-2'}>
        {companyDetail && companyDetail.data
          ? (
            <CompanyData collapse={collapse} />
          )
          : (
            <LocationDetails collapse={collapse} />
          )}
      </Col>
    </Row>

  );
};

export default ViewSpaceAdmin;
