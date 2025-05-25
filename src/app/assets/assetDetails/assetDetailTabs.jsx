/* eslint-disable import/no-unresolved */
import React, { useState } from 'react';
import {
  Card,
  CardBody,
  Col,
  Row,
} from 'reactstrap';
import { useSelector } from 'react-redux';
import * as PropTypes from 'prop-types';

import { Tabs } from 'antd';

import Loader from '@shared/loading';
import ErrorContent from '@shared/errorContent';
import AssetBasicDetails from './assetBasicDetails/assetBasicDetails';
import Transactions from './transactions';
import AuditLog from './auditLog';
import Comments from './comments';
import Readings from './readings';
import HistoryCard from './historycard';
import AdditionalInfo from './additionalInfo';
import Documents from '../../helpdesk/viewTicket/documents';
import tabs from './tabs.json';
import { generateErrorMessage } from '../../util/appUtils';

const appModels = require('../../util/appModels').default;

const { TabPane } = Tabs;

const AssetDetailTabs = (props) => {
  const {
    setViewModal,
    viewModal,
    setEquipmentDetails,
    isEquipmentDetails,
    isITAsset,
  } = props;
  const [currentTab, setActive] = useState('Asset Overview');

  const changeTab = (key) => {
    setActive(key);
  };
  const { equipmentsDetails } = useSelector((state) => state.equipment);

  return (

    <Card className="border-0 bg-lightblue globalModal-sub-cards">
      {equipmentsDetails && (equipmentsDetails.data && equipmentsDetails.data.length > 0) && (
      <CardBody className="pl-0 pr-0">
        <Row>
          <Col md={12} sm={12} xs={12} lg={12} className="pl-1 pr-1">
            <Tabs defaultActiveKey={currentTab} onChange={changeTab}>
              {tabs && tabs.tabsList.map((tabData) => (
                <TabPane tab={tabData.name} key={tabData.name} />
              ))}
            </Tabs>
            <div className="tab-content-scroll hidden-scrollbar">
              {currentTab === 'Asset Overview'
                ? <AssetBasicDetails detailData={equipmentsDetails} isITAsset={isITAsset} />
                : ''}
              {currentTab === 'Transactions'
                ? <Transactions detailData={equipmentsDetails} setViewModal={setViewModal} viewModal={viewModal} setEquipmentDetails={setEquipmentDetails} isEquipmentDetails={isEquipmentDetails} />
                : ''}
              {currentTab === 'Additonal Info'
                ? <AdditionalInfo />
                : ''}
              {currentTab === 'Notes'
                ? <Comments />
                : ''}
              {currentTab === 'Readings'
                ? <Readings ids={equipmentsDetails.data[0].reading_lines_ids} viewId={equipmentsDetails.data[0].id} type="equipment" />
                : ''}
              {currentTab === 'Audit Log'
                ? (
                  <>
                    <Comments />
                    <AuditLog ids={equipmentsDetails.data[0].message_ids} />
                  </>
                )
                : ''}
              {currentTab === 'Asset History'
                ? (
                  <HistoryCard
                    ids={equipmentsDetails.data[0].history_card_ids}
                    viewId={equipmentsDetails.data[0].id}
                    type="equipment"
                    setViewModal={setViewModal}
                    viewModal={viewModal}
                    setEquipmentDetails={setEquipmentDetails}
                    isEquipmentDetails={isEquipmentDetails}
                    isITAsset={isITAsset}
                  />
                )
                : ''}
              {currentTab === 'Documents'
                ? (
                  <Documents
                    viewId={equipmentsDetails.data[0].id}
                    ticketNumber={equipmentsDetails.data[0].name}
                    resModel={appModels.EQUIPMENT}
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
      {equipmentsDetails && equipmentsDetails.loading && (
      <CardBody className="mt-4" data-testid="loading-case">
        <Loader />
      </CardBody>
      )}
      {(equipmentsDetails && equipmentsDetails.err) && (
      <CardBody>
        <ErrorContent errorTxt={generateErrorMessage(equipmentsDetails)} />
      </CardBody>
      )}
    </Card>
  );
};
AssetDetailTabs.propTypes = {
  setViewModal: PropTypes.func.isRequired,
  viewModal: PropTypes.bool.isRequired,
  setEquipmentDetails: PropTypes.func.isRequired,
  isEquipmentDetails: PropTypes.bool.isRequired,
  isITAsset: PropTypes.bool,
};

AssetDetailTabs.defaultProps = {
  isITAsset: false,
};
export default AssetDetailTabs;
