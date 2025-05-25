/* eslint-disable import/no-unresolved */
import React, { useState, useEffect } from 'react';
import {
  Card,
  CardBody,
  Row,
  Col,
} from 'reactstrap';
import { useSelector } from 'react-redux';
import { Tabs } from 'antd';
import * as PropTypes from 'prop-types';

import ErrorContent from '@shared/errorContent';
import Loader from '@shared/loading';
import Comments from './comments';
import Parts from './parts';
import LookupParts from './lookupParts';
import Tools from './tools';
import CheckLists from './checkLists';
import Timesheets from './timesheets';
import WorkOrderInfo from './workOrderInfo';
import AuditLog from '../../assets/assetDetails/auditLog';
import Documents from '../../helpdesk/viewTicket/documents';
import tabs from './tabs.json';
import { generateErrorMessage } from '../../util/appUtils';

const appModels = require('../../util/appModels').default;

const { TabPane } = Tabs;

const OrderSegments = (props) => {
  const { setViewModal } = props;

  const [currentTab, setActive] = useState('Work Order Overview');
  const { userInfo } = useSelector((state) => state.user);
  const {
    workorderDetails,
  } = useSelector((state) => state.workorder);

  const isUserError = userInfo && userInfo.err;
  const userErrorMsg = generateErrorMessage(userInfo);
  const errorMsg = (workorderDetails && workorderDetails.err) ? generateErrorMessage(workorderDetails) : userErrorMsg;

  useEffect(() => {
    setActive('Work Order Overview');
  }, [workorderDetails]);

  const changeTab = (key) => {
    setActive(key);
  };

  return (
    <Card className="border-0 globalModal-sub-cards bg-lightblue">
      {(workorderDetails && (workorderDetails.data && workorderDetails.data.length > 0)) && (
        <CardBody className="pl-0 pr-0">
          <Row>
            <Col md={12} sm={12} xs={12} lg={12} className="pl-1 pr-1">
              <Tabs defaultActiveKey={currentTab} onChange={changeTab}>
                {tabs && tabs.tabsList.map((tabData) => (
                  <TabPane tab={tabData.name} key={tabData.name} />
                ))}
              </Tabs>
              <div className="tab-content-scroll hidden-scrollbar">
                {currentTab === 'Work Order Overview'
                  ? <WorkOrderInfo detailData={workorderDetails} setViewModal={setViewModal} />
                  : ''}
                {currentTab === 'Comments'
                  ? <Comments />
                  : ''}
                {currentTab === 'Parts'
                  ? <Parts />
                  : ''}
                {currentTab === 'Audit Logs'
                  ? (
                    <>
                      <Comments />
                      <AuditLog ids={workorderDetails.data[0].message_ids} />
                    </>
                  )
                  : ''}
                {currentTab === 'Lookup Parts'
                  ? <LookupParts />
                  : ''}
                {currentTab === 'Tools'
                  ? <Tools />
                  : ''}
                {currentTab === 'Check List'
                  ? <CheckLists />
                  : ''}
                {currentTab === 'Attachments'
                  ? (
                    <Documents
                      viewId={workorderDetails.data[0].id}
                      ticketId={workorderDetails.data[0].help_desk_id ? workorderDetails.data[0].help_desk_id[0] : false}
                      ticketNumber={workorderDetails.data[0].name}
                      resModel={appModels.ORDER}
                      model={appModels.DOCUMENT}
                    />
                  )
                  : ''}
                {currentTab === 'Timesheet'
                  ? <Timesheets />
                  : ''}
              </div>
            </Col>
          </Row>
        </CardBody>
      )}
      {workorderDetails && workorderDetails.loading && (
        <CardBody className="mt-4" data-testid="loading-case">
          <Loader />
        </CardBody>
      )}

      {((workorderDetails && workorderDetails.err) || (isUserError)) && (
        <CardBody>
          <ErrorContent errorTxt={errorMsg} />
        </CardBody>
      )}
    </Card>
  );
};

OrderSegments.propTypes = {
  setViewModal: PropTypes.func.isRequired,
};

export default OrderSegments;
