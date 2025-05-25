import React from 'react';
import { useSelector } from 'react-redux';

import InboundDetailInfo from './inboundDetailInfo';
// import InboundDetailTabs from './inboundDetailTabs';

const InboundDetail = ({ isEditable }) => {
  const { mailInboundDetail } = useSelector((state) => state.mailroom);

  return (
    <>
      <InboundDetailInfo isEditable={isEditable} detailData={mailInboundDetail} />
     { /* <InboundDetailTabs detailData={mailInboundDetail} /> */}
    </>
  );
};

export default InboundDetail;
