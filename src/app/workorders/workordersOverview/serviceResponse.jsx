/* eslint-disable import/no-unresolved */
import React from 'react';
import {
  Card,
  CardBody,
  CardTitle,
  Col,
  Row,
} from 'reactstrap';
import { Doughnut } from 'react-chartjs-2';
import { useSelector } from 'react-redux';

import ticketBlack from '@images/icons/ticketBlack.svg';
import clockBlueIcon from '@images/icons/clockBlue.svg';
import ErrorContent from '@shared/errorContent';
import Loader from '@shared/loading';
import './workordersOverview.scss';
import { getDatasets, getClassNameBorder, getClassNameText } from '../utils/utils';
import ServiceCharts from './data/serviceCharts.json';
import { generateErrorMessage, getDashboardDataStructure } from '../../util/appUtils';

const ServiceResponse = () => {
  const { userInfo } = useSelector((state) => state.user);
  const { workorderDashboard } = useSelector((state) => state.workorder);

  const isUserError = userInfo && userInfo.err;
  const isUserLoading = userInfo && userInfo.loading;
  const loading = ((workorderDashboard && workorderDashboard.loading) || (isUserLoading));
  const userErrorMsg = generateErrorMessage(userInfo);
  const errorMsg = (workorderDashboard && workorderDashboard.err) ? generateErrorMessage(workorderDashboard) : userErrorMsg;

  const dashboardData = getDashboardDataStructure(workorderDashboard, 'ASRR');

  const isCodeData = workorderDashboard && workorderDashboard.data ? workorderDashboard.data.filter((item) => item.code === 'ASRR') : false;
  const isCodeExists = !!(isCodeData && isCodeData.length);

  return (
    <>
      {isCodeExists && (
      <Card className="p-2 border-0 h-100 service-card" >
        <CardTitle>
          <h6>
            <img src={clockBlueIcon} className="mr-2" width="20" height="20" alt="serviceresponse" />
            AVERAGE SERVICE RESPONSE RATE
          </h6>
        </CardTitle>
        <CardBody className="p-0">
          {((workorderDashboard && workorderDashboard.loading) || (isUserLoading)) && (
          <div className="mb-4 mt-2 p-4">
            <Loader />
          </div>
          )}
          {((workorderDashboard && workorderDashboard.err) || (isUserError)) && (
          <ErrorContent errorTxt={errorMsg.includes('No data') ? 'No text' : errorMsg} />
          )}
          <Row className="pb-2 m-0 row-eq-height">
            {
           (workorderDashboard && workorderDashboard.data) && (dashboardData && dashboardData.length > 0) && workorderDashboard.data.map((actions) => (
             actions.code === 'ASRR' && (
               actions.datasets && actions.datasets.length > 0
                 ? (
                   <Col md="6" sm="6" xs="6" lg="3" className="m-4 p-0" key={actions.name}>
                     <div className="imagehead">
                       <div className="icon" />
                       <Doughnut
                         options={ServiceCharts.options}
                         data={getDatasets(actions.datasets)}
                       />
                     </div>
                   </Col>
                 )
                 : ''
             )
           ))
          }

            <Col md="6" sm="6" xs="6" lg="7" className="m-0 p-0">
              {dashboardData && dashboardData.length > 0 && dashboardData.map((sets, index) => (
                <React.Fragment key={sets.id}>
                  <Card className={getClassNameBorder(index)}>
                    <CardBody className="p-1">
                      <span className={getClassNameText(index)}>
                        {sets.value}
                      </span>
                      <span className="float-right">
                        <img src={ticketBlack} className="mr-1" alt="issuecategory" height="12" />
                        <small className="font-weight-bold">
                          {sets.label}
                        </small>
                      </span>
                      <br />
                      <small>{sets.id}</small>
                    </CardBody>
                  </Card>
                </React.Fragment>
              ))}
            </Col>
          </Row>
          <Row>
            <Col md="12" sm="12" xs="12" lg="12">
              {(dashboardData && !dashboardData.length && (!loading)) && (
              <ErrorContent errorTxt="No text" />
              )}
            </Col>
          </Row>
        </CardBody>
      </Card>
      )}
    </>
  );
};
export default ServiceResponse;
