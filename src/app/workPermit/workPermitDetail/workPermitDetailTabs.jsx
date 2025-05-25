/* eslint-disable no-unused-expressions */
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
import { useSelector } from 'react-redux';

import Loader from '@shared/loading';
import ErrorContent from '@shared/errorContent';
import Documents from '../../helpdesk/viewTicket/documents';
import WorkPermitBasicDetails from './workPermitBasicDetails/workPermitBasicDetails';
import WorkOrderChecklists from './checklists';
import WorkOrderPreparedChecklists from './preparednessChecklist';
import SpareParts from './spareParts';
import StatusLogs from './statusLogs';
import tabs from './tabs.json';
import { generateErrorMessage } from '../../util/appUtils';

const appModels = require('../../util/appModels').default;

const { TabPane } = Tabs;
const WorkPermitDetailTabs = (props) => {
  const { detailData, openWorkOrder } = props;
  const [currentTab, setActive] = useState('Work Permit Overview');
  const [showFields, setShowFields] = useState([]);

  const { workPermitConfig } = useSelector((state) => state.workpermit);
  const detail = detailData && (detailData.data && detailData.data.length > 0) ? detailData.data[0] : '';
  const wpConfig = workPermitConfig && workPermitConfig.data && workPermitConfig.data.length ? workPermitConfig.data[0] : false;
  const isPreparedRequired = (wpConfig && wpConfig.is_prepared_required);

  useEffect(() => {
    setActive('Work Permit Overview');
  }, [detailData]);

  useEffect(() => {
    const hidden = [];
    tabs && tabs.tabsList.forEach((item) => {
      if (item.id === 2 && isPreparedRequired === true) {
        hidden.push(item);
      } else if (item.id !== 2) {
        hidden.push(item);
      }
      setShowFields(hidden);
    });
  }, [detailData, wpConfig]);

  const changeTab = (key) => {
    setActive(key);
  };

  return (
    <Card className="border-0 globalModal-sub-cards bg-lightblue">
      {detailData && (detailData.data && detailData.data.length > 0) && (
      <CardBody className="pl-0 pr-0">
        <Row>
          <Col md={12} sm={12} xs={12} lg={12} className="pl-1 pr-1">
            <Tabs defaultActiveKey={currentTab} onChange={changeTab}>
              {showFields && showFields.map((tabData) => (
                <TabPane tab={tabData.name} key={tabData.name} />
              ))}
            </Tabs>
            <div className="thin-scrollbar">
              {currentTab === 'Work Permit Overview'
                ? <WorkPermitBasicDetails detailData={detailData} openWorkOrder={openWorkOrder} />
                : ''}
              {currentTab === 'Work Checklist'
                ? <WorkOrderChecklists detailData={detailData} />
                : ''}
              {currentTab === 'Preparedness Checklist'
                ? <WorkOrderPreparedChecklists detailData={detailData} />
                : ''}
              {currentTab === 'Spare Parts'
                ? <SpareParts />
                : ''}
              {currentTab === 'Status Logs'
                ? <StatusLogs />
                : ''}
              {currentTab === 'Attachments'
                ? (
                  <Documents
                    viewId={detailData.data[0].id}
                    ticketNumber={detailData.data[0].name}
                    resModel={appModels.WORKPERMIT}
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
  openWorkOrder: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.bool,
  ]).isRequired,
};

export default WorkPermitDetailTabs;
