import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import * as PropTypes from 'prop-types';
import { Box } from '@mui/system';
import Loader from '@shared/loading';
import AuditDetailInfo from './auditDetailInfo';
import AuditDetailTabs from './auditDetailTabs';

const AuditDetail = ({
  offset, isShow, setQuestionGroupsGlobal, questionGroupsGlobal, savedRecords, setSavedQuestions,
}) => {
  const { slaAuditDetails } = useSelector((state) => state.slaAudit);

  const [currentTab, setActive] = useState('');
  const [value, setValue] = useState(0);

  return (
    <Box>
      {slaAuditDetails && slaAuditDetails.loading && <Loader />}
      {slaAuditDetails && !slaAuditDetails.loading && (
      <>
        <AuditDetailInfo detailData={slaAuditDetails} questionGroupsGlobal={questionGroupsGlobal} savedRecords={savedRecords} offset={offset} />
        <AuditDetailTabs setLastValue={setValue} lastValue={value} setLastActive={setActive} lastActive={currentTab} isShow={isShow} detailData={slaAuditDetails} setQuestionGroupsGlobal={setQuestionGroupsGlobal} setSavedQuestions={setSavedQuestions} />
      </>
      )}
    </Box>
  );
};

AuditDetail.propTypes = {
  offset: PropTypes.number.isRequired,
};

export default AuditDetail;
