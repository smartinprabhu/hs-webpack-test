import React from 'react';
import { useSelector } from 'react-redux';

import SchedulerDetailInfo from './schedulerDetailInfo';
import SchedulerDetailTabs from './schedulerDetailTabs';

const ExpensesDetails = () => {
  const { expensesDetailInfo } = useSelector((state) => state.maintenance);

  return (
    <>
      <SchedulerDetailInfo detailData={expensesDetailInfo} />
      <SchedulerDetailTabs detailData={expensesDetailInfo} />
    </>
  );
};

export default ExpensesDetails;
