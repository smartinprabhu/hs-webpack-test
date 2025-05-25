/* eslint-disable import/no-unresolved */
import React, { useState } from 'react';
import {
  Card,
  CardBody,
  Col,
  Row,
} from 'reactstrap';
import { useDispatch, useSelector } from 'react-redux';
import { Tabs } from 'antd';
import * as PropTypes from 'prop-types';

import Loader from '@shared/loading';
import ErrorContent from '@shared/errorContent';
import tabs from './tabs.json';
import TranferBasicDetails from './transferBasicDetails';
import Products from './products';
import Scraps from './scraps';
import LogNotes from '../../../../assets/assetDetails/logNotes';
import AddScheduleActivity from '../../../utils/addSheduleActivity/addSheduleActivity';
import AuditLog from '../../../../assets/assetDetails/auditLog';
import ScheduleActivities from '../../../../assets/assetDetails/scheduleActivities';
import LogNoteForm from '../../../utils/logNoteForm';
import SendMessageForm from '../../../utils/sendMessageForm';
import { generateErrorMessage } from '../../../../util/appUtils';
import {
  getTransferDetail,
  resetActivityInfo,
} from '../../../purchaseService';
import {
  resetMessage,
} from '../../../../helpdesk/ticketService';
import Documents from '../../../../helpdesk/viewTicket/documents';

const appModels = require('../../../../util/appModels').default;

const { TabPane } = Tabs;
const detailTabs = (props) => {
  const dispatch = useDispatch();
  const resModelId = 235;
  const {
    detail,
  } = props;
  const [currentTab, setActive] = useState('Overview');

  const changeTab = (key) => {
    setActive(key);
  };
  const { transferDetails } = useSelector((state) => state.purchase);
  const {
    createActivityInfo,
  } = useSelector((state) => state.purchase);
  const {
    createMessageInfo,
  } = useSelector((state) => state.ticket);

  const detailData = detail && (detail.data && detail.data.length > 0) ? detail.data[0] : '';

  const cancelLogNote = () => {
    const viewId = detail && detail.data ? detail.data[0].id : '';
    if (createMessageInfo && createMessageInfo.data) {
      dispatch(getTransferDetail(viewId, appModels.STOCK));
    }
    dispatch(resetMessage());
  };

  const cancelActivity = () => {
    const viewId = detail && detail.data ? detail.data[0].id : '';
    if (createActivityInfo && createActivityInfo.data) {
      dispatch(getTransferDetail(viewId, appModels.STOCK));
    }
    dispatch(resetActivityInfo());
  };

  const cancelMessage = () => {
    const viewId = detail && detail.data ? detail.data[0].id : '';
    if (createMessageInfo && createMessageInfo.data) {
      dispatch(getTransferDetail(viewId, appModels.STOCK));
    }
    dispatch(resetMessage());
  };

  return (
    <Card className="border-0 globalModal-sub-cards bg-lightblue">
      {transferDetails && (transferDetails.data && transferDetails.data.length > 0) && (
      <CardBody className="pl-0 pr-0">
        <Row className="">
          <Col md={12} sm={12} xs={12} lg={12} className="pl-1 pr-1">
            <Tabs defaultActiveKey={currentTab} onChange={changeTab}>
              {tabs && tabs.tabsList.map((tabData) => (
                <TabPane tab={tabData.name} key={tabData.name} />
              ))}
            </Tabs>
            <div className="tab-content-scroll hidden-scrollbar">
              {currentTab === 'Overview'
                ? <TranferBasicDetails detail={detail} />
                : ''}
              {currentTab === 'Products'
                ? <Products />
                : ''}
              {currentTab === 'Scraps'
                ? <Scraps />
                : ''}
              {currentTab === 'Attachments'
                ?   
                <Documents
                viewId={detail.data[0].id }
                ticketNumber={detail.data[0].name}
                resModel={ appModels.STOCK}
                model={ appModels.DOCUMENT}
              />
                : ''}
              {currentTab === 'Send Message'
                ? (
                  <div>
                    <SendMessageForm
                      atFinish={() => {
                        cancelMessage();
                      }}
                      modalName={appModels.STOCK}
                      detail={detail}
                    />
                    <br />
                    {' '}
                    <br />
                    <AuditLog ids={detailData.message_ids} />
                  </div>
                )
                : ''}
              {currentTab === 'Audit Log'
                ? (
                  <div>
                    <LogNoteForm
                      atFinish={() => {
                        cancelLogNote();
                      }}
                      modalName={appModels.STOCK}
                      detail={detail}
                    />
                    <br />
                    {' '}
                    <br />
                    <LogNotes ids={detailData.message_ids} />
                  </div>
                )
                : ''}
              {currentTab === 'Schedule Activity'
                ? (
                  <div>
                    <AddScheduleActivity
                      detail={detail}
                      modalName={appModels.STOCK}
                      resModelId={resModelId}
                      afterReset={() => { cancelActivity(); }}
                    />
                    <br />
                    <ScheduleActivities resModalName={appModels.STOCK} resId={detailData.id} />
                  </div>
                )
                : ''}
            </div>
          </Col>
        </Row>
        <br />
      </CardBody>
      )}
      {transferDetails && transferDetails.loading && (
      <CardBody className="mt-4" data-testid="loading-case">
        <Loader />
      </CardBody>
      )}
      {(transferDetails && transferDetails.err) && (
      <CardBody>
        <ErrorContent errorTxt={generateErrorMessage(transferDetails)} />
      </CardBody>
      )}
    </Card>
  );
};

detailTabs.propTypes = {
  detail: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array,
    PropTypes.string,
  ]).isRequired,
};
export default detailTabs;
