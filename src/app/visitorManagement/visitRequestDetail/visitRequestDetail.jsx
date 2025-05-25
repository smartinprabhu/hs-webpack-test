import React from 'react';
import { useSelector } from 'react-redux';

import VisitRequestDetailInfo from './detailInfo';
import VisitRequestDetailTabs from './detailTabs';

const VisitRequestDetail = () => {
  const { visitorRequestDetails } = useSelector((state) => state.visitorManagement);

  return (
    <>
      <VisitRequestDetailInfo detailData={visitorRequestDetails} />
      <VisitRequestDetailTabs detailData={visitorRequestDetails} />
    </>
  );
};

export default VisitRequestDetail;
