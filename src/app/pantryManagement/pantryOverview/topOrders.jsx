/* eslint-disable import/no-unresolved */
/* eslint-disable array-callback-return */
import React from 'react';
import { useSelector } from 'react-redux';
import {
  Card,
  CardBody,
  CardTitle,
  Col,
  Row,
} from 'reactstrap';

import barchartBlueIcon from '@images/icons/barchartBlue.svg';
import pantryOrderBlue from '@images/icons/pantry/pantryOrderBlue.svg';
import ErrorContent from '@shared/errorContent';
import Loader from '@shared/loading';
import { generateErrorMessage, getDashboardDataStructure } from '../../util/appUtils';

const TopOrders = () => {
  const { userInfo } = useSelector((state) => state.user);
  const { pantryDashboard } = useSelector((state) => state.pantry);

  function arraysort(category) {
    const categoryList = [];
    if (category) {
      for (let i = 0; i < category.length; i += 1) {
        if (category[i].label) {
          categoryList.push(category[i]);
        }
      }
    }
    return categoryList.sort((a, b) => b.label - a.label);
  }

  const isUserError = userInfo && userInfo.err;
  const isUserLoading = userInfo && userInfo.loading;
  const userErrorMsg = generateErrorMessage(userInfo);
  const errorMsg = (pantryDashboard && pantryDashboard.err) ? generateErrorMessage(pantryDashboard) : userErrorMsg;
  const loading = ((pantryDashboard && pantryDashboard.loading) || (isUserLoading));

  const dashboardData = arraysort(getDashboardDataStructure(pantryDashboard, 'TIBO'));
  let teamsIndex = 1;

  return (
    <Card className="p-2 pantry-top-orders border-0 h-100">
      <CardTitle>
        <h6>
          <img src={barchartBlueIcon} className="mr-2" alt="maintenanceTeams" height="20" width="20" />
          TOP ITEMS BY ORDER
        </h6>
      </CardTitle>
      <CardBody className="pt-1">
        {loading && (
          <div className="mb-4 mt-4">
            <Loader />
          </div>
        )}
        {((pantryDashboard && pantryDashboard.err) || (isUserError)) && (
          <ErrorContent errorTxt={errorMsg.includes('No data') ? 'No text' : errorMsg} />
        )}
        {dashboardData && dashboardData.length > 0 && dashboardData.map((actions, index) => (
          <Row
            className="p-0 mb-2"
            // eslint-disable-next-line no-plusplus
            key={teamsIndex++}
          >

            <Col lg="6" xs="8" sm="8" md="6" className="p-1 text-left bg-med-blue">
              <span className="font-weight-bold font-medium mr-2">
                {index + 1}
                .
              </span>
              {actions.value}
            </Col>
            <Col lg="6" xs="3" sm="3" md="6" className="p-1 text-right bg-med-blue">
              <Row>
                <Col lg="8" xs="12" sm="12" md="8" />
                <Col lg="1" xs="12" sm="12" md="1">
                  <img src={pantryOrderBlue} width="20" height="20" alt={actions.label} />
                </Col>
                <Col lg="3" xs="12" sm="12" md="3" className="text-left p-1">
                  {actions.label}
                  <span className="ml-1">
                    Units
                  </span>
                </Col>
              </Row>
            </Col>
          </Row>
        ))}
        {(dashboardData && !dashboardData.length && (!loading)) && (
          <ErrorContent errorTxt="No text" />
        )}
      </CardBody>
    </Card>
  );
};
export default TopOrders;
