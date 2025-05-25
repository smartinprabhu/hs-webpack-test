/* eslint-disable max-len */
/* eslint-disable import/no-unresolved */
import React, { useState, useEffect, useMemo } from 'react';
import {
  Card,
  CardBody,
  Col,
  Row,
} from 'reactstrap';
import * as PropTypes from 'prop-types';
import { Tabs } from 'antd';
import { useSelector, useDispatch } from 'react-redux';

import Loader from '@shared/loading';
import ErrorContent from '@shared/errorContent';

import tabs from './tabs.json';
import CheckList from './checkList';
import VisitBasicDetails from './visitBasicDetails';
import Documents from '../../helpdesk/viewTicket/documents';
import AuditLog from '../../assets/assetDetails/auditLog';
import StatusLogs from './statusLogs';
import { generateErrorMessage } from '../../util/appUtils';
import { getAssetDetails } from '../visitorManagementService';

const appModels = require('../../util/appModels').default;

const { TabPane } = Tabs;

const detailTabs = (props) => {
  const { detailData, setDetailModal } = props;
  const dispatch = useDispatch();

  const [currentTab, setActive] = useState('Visit Request Overview');
  const {
    assetDetails,
  } = useSelector((state) => state.visitorManagement);

  useEffect(() => {
    setActive('Visit Request Overview');
  }, [detailData]);

  useMemo(() => {
    if (detailData && detailData.data) {
      const ids = detailData && detailData.data && detailData.data.length && detailData.data[0].visitor_assets_ids && detailData.data[0].visitor_assets_ids && detailData.data[0].visitor_assets_ids.length && detailData.data[0].visitor_assets_ids;
      dispatch(getAssetDetails(appModels.ASSETDETAILS, ids, false));
    }
  }, [detailData]);

  const changeTab = (key) => {
    setActive(key);
  };

  const detail = detailData && (detailData.data && detailData.data.length > 0) ? detailData.data[0] : '';

  return (
    <Card className="border-0 bg-lightblue globalModal-sub-cards">
      {detailData && (detailData.data && detailData.data.length > 0) && (
      <CardBody className="pl-0 pr-0">
        <Row>
          <Col md={12} sm={12} xs={12} lg={12} className="pl-1 pr-1">
            <Tabs defaultActiveKey={currentTab} onChange={changeTab}>
              {tabs && tabs.tabsList.map((tabData) => (
                <TabPane tab={tabData.name} key={tabData.name} />
              ))}
            </Tabs>
            <div className="tab-content-scroll hidden-scrollbar">
              {currentTab === 'Visit Request Overview'
                ? <VisitBasicDetails detailData={detail} assetDetails={assetDetails} />
                : ''}
              {currentTab === 'Feedback Check List'
                ? <CheckList detailData={detailData} />
                : ''}
              {currentTab === 'Audit Logs'
                ? <AuditLog ids={detail.message_ids} />
                : ''}
              {currentTab === 'Status Logs'
                ? <StatusLogs />
                : ''}
              {currentTab === 'Attachments'
                ? (
                  <Documents
                    viewId={detailData.data[0].id}
                    ticketNumber={detailData.data[0].name}
                    resModel={appModels.VISITREQUEST}
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

detailTabs.propTypes = {
  detailData: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array,
  ]).isRequired,
};
export default detailTabs;
