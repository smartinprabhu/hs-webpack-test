import React from 'react';

import BreakdownDetailInfo from './breakdownDetailInfo';
import BreakdownDetailTabs from './breakdownDetailTabs';

const detailInfo = ({
  offset,
}) => (
  <>
    <BreakdownDetailInfo offset={offset} />
    <BreakdownDetailTabs />
  </>
);

export default detailInfo;
