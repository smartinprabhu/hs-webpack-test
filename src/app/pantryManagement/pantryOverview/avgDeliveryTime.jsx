/* eslint-disable import/no-unresolved */
import React from 'react';
import {
  Card,
  CardBody,
  CardTitle,
  Col,
  Table,
  Row,
} from 'reactstrap';
import { useSelector } from 'react-redux';

import clockBlueIcon from '@images/icons/clockBlue.svg';
import ErrorContent from '@shared/errorContent';
import Loader from '@shared/loading';

import './visitorOverview.scss';
import {
  generateErrorMessage, getDashboardDataStructure, getCompanyTimezoneDate, getDefaultNoValue,
} from '../../util/appUtils';

const AvgDeliveryTime = () => {
  const { userInfo } = useSelector((state) => state.user);
  const { pantryDashboard } = useSelector((state) => state.pantry);

  const isUserError = userInfo && userInfo.err;
  const isUserLoading = userInfo && userInfo.loading;
  const loading = ((pantryDashboard && pantryDashboard.loading) || (isUserLoading));
  const userErrorMsg = generateErrorMessage(userInfo);
  const errorMsg = (pantryDashboard && pantryDashboard.err) ? generateErrorMessage(pantryDashboard) : userErrorMsg;

  const dashboardData = getDashboardDataStructure(pantryDashboard, 'ADT');

  function getRow(assetData) {
    const tableTr = [];
    for (let i = 0; i < assetData.length; i += 1) {
      tableTr.push(
        <tr key={i}>
          <td className="p-2">{getDefaultNoValue(getCompanyTimezoneDate(assetData[i].label, userInfo, 'datetime'))}</td>
          <td className="p-2">{getDefaultNoValue(getCompanyTimezoneDate(assetData[i].value, userInfo, 'datetime'))}</td>
          <td className="p-2">{assetData[i].id ? parseFloat(assetData[i].id).toFixed(2) : ''}</td>
        </tr>,
      );
    }
    return tableTr;
  }

  return (
    <Card className="p-2 border-0 h-100">
      <CardTitle>
        <h6>
          <img src={clockBlueIcon} className="mr-2" width="20" height="20" alt="serviceresponse" />
          AVERAGE DELIVERY TIME
        </h6>
      </CardTitle>
      <CardBody className="p-0">
        {((pantryDashboard && pantryDashboard.loading) || (isUserLoading)) && (
        <div className="mb-4 mt-2 p-4">
          <Loader />
        </div>
        )}
        {((pantryDashboard && pantryDashboard.err) || (isUserError)) && (
          <ErrorContent errorTxt={errorMsg} />
        )}
        <Row className="pb-2 m-0">
          <Col md="12" sm="12" xs="12" lg="12" className="m-0 p-0">
            {(dashboardData && !loading && dashboardData.length > 0 && pantryDashboard && pantryDashboard.data) && (
            <div className="comments-list thin-scrollbar">
              <Table responsive className="mb-0 mt-2 font-weight-400 border-0 assets-table" width="100%">
                <thead>
                  <tr>
                    <th className="p-2 min-width-160">
                      Confirmed On
                    </th>
                    <th className="p-2 min-width-160">
                      Delivered On
                    </th>
                    <th className="p-2 min-width-200">
                      Delivered Due (Minutes)
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {getRow(dashboardData)}
                </tbody>
              </Table>
              <hr className="m-0" />
            </div>
            )}
          </Col>
        </Row>
        <Row>
          <Col md="12" sm="12" xs="12" lg="12">
            {(dashboardData && !dashboardData.length && (!loading)) && (
            <ErrorContent errorTxt="No Data" />
            )}
          </Col>
        </Row>
      </CardBody>
    </Card>
  );
};
export default AvgDeliveryTime;
