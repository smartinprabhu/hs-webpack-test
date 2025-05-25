import React from 'react';
import { useSelector } from 'react-redux';

import OpportunityDetailInfo from './opportunityDetailInfo';
import OpportunityDetailTabs from './opportunityDetailTabs';

const OpportunitiesDetail = () => {
  const { opportunitiesDetails } = useSelector((state) => state.audit);

  return (
    <>
      <OpportunityDetailInfo detailData={opportunitiesDetails} />
      <OpportunityDetailTabs detailData={opportunitiesDetails} />
    </>
  );
};

export default OpportunitiesDetail;
