import React from 'react';
import { useSelector } from 'react-redux';

import SchedulerDetailInfo from './schedulerDetailInfo';
import SchedulerDetailTabs from './schedulerDetailTabs';

const SchedulerDetail = () => {
  const { inspectionSchedulerDetail } = useSelector((state) => state.inspection);

  return (
    <>
      <SchedulerDetailInfo detailData={inspectionSchedulerDetail} />
      <SchedulerDetailTabs detailData={inspectionSchedulerDetail} />
    </>
  );
};

export default SchedulerDetail;
