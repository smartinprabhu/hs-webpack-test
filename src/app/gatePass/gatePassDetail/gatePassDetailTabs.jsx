/* eslint-disable import/no-unresolved */
import React, { useEffect, useState } from 'react';
import {
  Card,
  CardBody,
  Col,
  Row,
} from 'reactstrap';
import * as PropTypes from 'prop-types';
import { Tabs } from 'antd';

import Loader from '@shared/loading';
import ErrorContent from '@shared/errorContent';
import Documents from '../../helpdesk/viewTicket/documents';
import GatePassBasicDetails from './gatePassBasicDetails/gatePassBasicDetails';
import ReturnInfo from './returnInfo';
import AssetInfo from './assetInfo';
import AuditLog from '../../assets/assetDetails/auditLog';
import tabs from './tabs.json';
import { generateErrorMessage } from '../../util/appUtils';

const appModels = require('../../util/appModels').default;

const { TabPane } = Tabs;
const WorkPermitDetailTabs = (props) => {
  const { detailData } = props;
  const [currentTab, setActive] = useState('Requestor and Bearer Info');

  useEffect(() => {
    setActive('Requestor and Bearer Info');
  }, [detailData]);

  const changeTab = (key) => {
    setActive(key);
  };

  const detail = detailData && (detailData.data && detailData.data.length > 0) ? detailData.data[0] : '';

  return (
    <Card className="border-0 globalModal-sub-cards bg-lightblue">
      {detailData && (detailData.data && detailData.data.length > 0) && (
      <CardBody className="pl-0 pr-0">
        <Row>
          <Col md={12} sm={12} xs={12} lg={12} className="pl-1 pr-1">
            <Tabs defaultActiveKey={currentTab} onChange={changeTab}>
              {tabs && tabs.tabsList.map((tabData) => (
                <TabPane tab={tabData.name} key={tabData.name} />
              ))}
            </Tabs>
            <div className="thin-scrollbar">
              {currentTab === 'Requestor and Bearer Info'
                ? <GatePassBasicDetails detailData={detailData} />
                : ''}
              {currentTab === 'Items Info'
                ? <AssetInfo detailData={detailData} />
                : ''}
              {currentTab === 'In/Out Info'
                ? <ReturnInfo detailData={detailData} />
                : ''}
              {currentTab === 'Audit Logs'
                ? <AuditLog ids={detail.message_ids} />
                : ''}
              {currentTab === 'Attachments'
                ? (
                  <Documents
                    viewId={detailData.data[0].id}
                    ticketNumber={detailData.data[0].name}
                    resModel={appModels.GATEPASS}
                    model={appModels.DOCUMENT}
                  />
                )
                : ''}
            </div>
          </Col>
        </Row>
        <br />
      </CardBody>
      )}
      {detailData && detailData.loading && (
      <CardBody className="mt-4" data-testid="loading-case">
        <Loader />
      </CardBody>
      )}
      {(detailData && detailData.err) && (
      <CardBody>
        <ErrorContent errorTxt={generateErrorMessage(detailData)} />
      </CardBody>
      )}
    </Card>
  );
};

WorkPermitDetailTabs.propTypes = {
  detailData: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.bool,
  ]).isRequired,
};

export default WorkPermitDetailTabs;
