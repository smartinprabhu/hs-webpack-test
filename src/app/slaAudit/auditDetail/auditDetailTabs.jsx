/* eslint-disable react/jsx-no-useless-fragment */
/* eslint-disable import/no-unresolved */
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as PropTypes from 'prop-types';
import { Spin } from 'antd';
import { Box } from '@mui/system';

import {
  TabPanel,
} from '../../util/appUtils';
import AuditLog from '../../assets/assetDetails/auditLog';
import LogNotes from './logNotes';
import AuditBasicDetails from './additionalDetails/auditBasicDetails';
import Assessments from './assessments';
import {
  getSlaAuditDetail,
  getSlaSummaryDetailsInfo,
} from '../auditService';
import ScoreCard from './scorecard';
import DetailViewTab from '../../commonComponents/detailViewTab';

const appModels = require('../../util/appModels').default;

const AuditDetailTabs = (props) => {
  const dispatch = useDispatch();
  const {
    detailData, isShow, setQuestionGroupsGlobal, setSavedQuestions,
    setLastValue,
    lastValue,
    setLastActive,
    lastActive,
  } = props;
  const [currentTab, setActive] = useState(lastActive);
  const [value, setValue] = useState(lastValue);
  const [manualTab, setManualTab] = useState('');
  const detail = detailData && (detailData.data && detailData.data.length > 0) ? detailData.data[0] : '';
  const { slaSummaryDetails } = useSelector((state) => state.slaAudit);

  const tabs = ['Summary', 'SLA/KPI', 'Audit Log', 'Additional Info'];
  const draftTabs = ['SLA/KPI', 'Audit Log', 'Additional Info'];

  const [tabsList, setTabsList] = useState([]);

  useEffect(() => {
    if (!isShow) {
      setManualTab('');
    }
  }, [isShow]);

  useEffect(() => {
    if (detail && !manualTab) {
      setTabsList(detail && (detail.state === 'Submitted' || detail.state === 'Reviewed' || detail.state === 'Approved') ? tabs : draftTabs);
      if (!lastActive) {
        setActive(detail && (detail.state === 'Submitted' || detail.state === 'Reviewed' || detail.state === 'Approved') ? 'Summary' : 'SLA/KPI');
      }
    } else if (detail && detail.state === 'Draft' && manualTab && !lastActive) {
      setActive('SLA/KPI');
    }
  }, [detailData, lastActive]);

  useEffect(() => {
    if (currentTab === 'Summary') {
      dispatch(getSlaSummaryDetailsInfo(detail.id, appModels.SLAAUDIT, 'nosla'));
    }
  }, [detailData, currentTab]);

  const handleTabChange = (event, newValue) => {
    const isCoverage = detail && detail.sla_audit_lines && detail.sla_audit_lines.length > 0;
    setValue(newValue);
    setLastValue(newValue);
    setManualTab(Math.random());
    setActive(event.target.textContent);
    setLastActive(event.target.textContent);
    if (newValue === 1 && !isCoverage) {
      dispatch(getSlaAuditDetail(detail.id, appModels.SLAAUDIT));
    }
  };

  return (
    <>
      <Box
        sx={{
          width: '100%',
          display: 'flex',
          height: '100%',
        }}
      >
        <Box
          sx={{
            width: '100%',
          }}
        >
          <DetailViewTab
            value={value}
            handleChange={handleTabChange}
            tabs={tabsList}
          />

          {currentTab === 'Summary' ? (
            <TabPanel value={value} index={value}>
              <>
                <Spin spinning={!!(slaSummaryDetails && slaSummaryDetails.loading)}>
                  <ScoreCard auditDetails={slaSummaryDetails && slaSummaryDetails.data && slaSummaryDetails.data.length ? slaSummaryDetails.data[0] : detail} />
                </Spin>
              </>
            </TabPanel>
          ) : ''}
          {currentTab === 'SLA/KPI' ? (
            <TabPanel value={value} index={value}>
              <Assessments detailData={detailData} setQuestionGroupsGlobal={setQuestionGroupsGlobal} setSavedQuestions={setSavedQuestions} />
            </TabPanel>
          ) : ''}
          {currentTab === 'Audit Log' ? (
            <TabPanel value={value} index={value}>
              <LogNotes />
              <AuditLog ids={detail.message_ids} />
            </TabPanel>
          ) : ''}
          {currentTab === 'Additional Info' ? (
            <TabPanel value={value} index={value}>
              <AuditBasicDetails detailData={detail} />
            </TabPanel>
          ) : ''}
        </Box>
      </Box>
    </>
  );
};

AuditDetailTabs.propTypes = {
  detailData: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.bool,
  ]).isRequired,
};

export default AuditDetailTabs;
