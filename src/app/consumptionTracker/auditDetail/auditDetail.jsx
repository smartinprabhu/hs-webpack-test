import React from 'react';
import { useSelector } from 'react-redux';
import * as PropTypes from 'prop-types';
import { Box } from "@mui/system";

import AuditDetailInfo from './auditDetailInfo';
import AuditDetailTabs from './auditDetailTabs';

const AuditDetail = ({ offset, savedRecords, setSavedQuestions }) => {
  const { ctDetailsInfo } = useSelector((state) => state.consumptionTracker);

  return (
    <>
      <Box>
        <AuditDetailInfo detailData={ctDetailsInfo} savedRecords={savedRecords} offset={offset} />
        <AuditDetailTabs detailData={ctDetailsInfo} setSavedQuestions={setSavedQuestions} />
      </Box>
    </>
  );
};

AuditDetail.propTypes = {
  offset: PropTypes.number.isRequired,
};

export default AuditDetail;
