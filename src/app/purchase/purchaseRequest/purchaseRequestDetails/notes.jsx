/* eslint-disable import/no-unresolved */
import React, { useState } from 'react';
import {
  Col,
  Row,
} from 'reactstrap';
import * as PropTypes from 'prop-types';
import { Tabs } from 'antd';
import { useDispatch, useSelector } from 'react-redux';

import DetailViewFormat from '@shared/detailViewFormat';

import {
  getPurchaseRequestDetail,
  resetActivityInfo,
} from '../../purchaseService';
import {
  resetMessage,
} from '../../../helpdesk/ticketService';

import {
  getDefaultNoValue,
} from '../../../util/appUtils';
import AuditLog from '../../../assets/assetDetails/auditLog';
import LogNotes from '../../../assets/assetDetails/logNotes';
import ScheduleActivities from '../../../assets/assetDetails/scheduleActivities';
import AddScheduleActivity from '../../utils/addSheduleActivity/addSheduleActivity';
import LogNoteForm from '../../utils/logNoteForm';
import SendMessageForm from '../../utils/sendMessageForm';
import tabs from './tabs.json';

const appModels = require('../../../util/appModels').default;

const { TabPane } = Tabs;

const Notes = (props) => {
  const {
    detail,
  } = props;
  const dispatch = useDispatch();
  const resModelId = 989;
  const [currentTab, setActive] = useState('Audit Logs');

  const {
    createActivityInfo,
  } = useSelector((state) => state.purchase);
  const {
    createMessageInfo,
  } = useSelector((state) => state.ticket);

  const changeTab = (key) => {
    setActive(key);
  };

  const cancelLogNote = () => {
    const viewId = detail && detail.data ? detail.data[0].id : '';
    if (createMessageInfo && createMessageInfo.data) {
      dispatch(getPurchaseRequestDetail(viewId, appModels.PURCHASEREQUEST));
    }
    dispatch(resetMessage());
  };

  const cancelActivity = () => {
    const viewId = detail && detail.data ? detail.data[0].id : '';
    if (createActivityInfo && createActivityInfo.data) {
      dispatch(getPurchaseRequestDetail(viewId, appModels.PURCHASEREQUEST));
    }
    dispatch(resetActivityInfo());
  };

  const cancelMessage = () => {
    const viewId = detail && detail.data ? detail.data[0].id : '';
    if (createMessageInfo && createMessageInfo.data) {
      dispatch(getPurchaseRequestDetail(viewId, appModels.PURCHASEREQUEST));
    }
    dispatch(resetMessage());
  };

  const detailData = detail && (detail.data && detail.data.length > 0) ? detail.data[0] : '';

  return (
    <Row>
      {detailData && (
        <Col sm="12" md="12" lg="12" xs="12">
          <Row className="ml-1 mr-1 mt-3">
            <Col sm="12" md="12" xs="12" lg="12">
              <Row className="m-0">
                <span className="m-1 p-1">{getDefaultNoValue(detailData.note)}</span>
              </Row>
              <hr className="mt-0" />
              <Tabs defaultActiveKey={currentTab} onChange={changeTab}>
                {tabs && tabs.notesList.map((tabData) => (
                  <TabPane tab={tabData.name} key={tabData.name} />
                ))}
              </Tabs>
              <br />
              {currentTab === 'Audit Logs'
                ? (
                  <div>
                    <SendMessageForm
                      atFinish={() => {
                        cancelMessage();
                      }}
                      modalName={appModels.PURCHASEREQUEST}
                      detail={detail}
                    />
                    <br />
                    {' '}
                    <br />
                    <AuditLog ids={detailData.message_ids} />
                  </div>
                )
                : ''}
              {currentTab === 'Log Note'
                ? (
                  <div>
                    <LogNoteForm
                      atFinish={() => {
                        cancelLogNote();
                      }}
                      modalName={appModels.PURCHASEREQUEST}
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
                      modalName={appModels.PURCHASEREQUEST}
                      resModelId={resModelId}
                      afterReset={() => { cancelActivity(); }}
                    />
                    <br />
                    <ScheduleActivities resModalName={appModels.PURCHASEREQUEST} resId={detailData.id} />
                  </div>
                )
                : ''}
            </Col>
          </Row>
        </Col>
      )}
      <DetailViewFormat detailResponse={detail} />
    </Row>
  );
};

Notes.propTypes = {
  detail: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array,
  ]).isRequired,
};
export default Notes;
