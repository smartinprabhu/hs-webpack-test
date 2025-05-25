import React from 'react';
import { useSelector } from 'react-redux';

import OutboundDetailInfo from './outboundDetailInfo';
// mport OutboundDetailTabs from './outboundDetailTabs';

const InboundDetail = () => {
  const { mailOutboundDetail, isEditable } = useSelector((state) => state.mailroom);

  return (
    <>
      <OutboundDetailInfo isEditable={isEditable} detailData={mailOutboundDetail} />
      { /* <OutboundDetailTabs detailData={mailOutboundDetail} /> */}
    </>
  );
};

export default InboundDetail;
