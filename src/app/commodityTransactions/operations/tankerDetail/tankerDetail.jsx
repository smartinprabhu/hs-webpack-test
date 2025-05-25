import React from 'react';
import { useSelector } from 'react-redux';

import TankerDetailInfo from './tankerDetailInfo';
import TankerDetailTabs from './tankerDetailTabs';

const TankerDetail = ({ offset, isTanker }) => {
  const { tankerTransactionDetail } = useSelector((state) => state.tanker);

  return (
    <>
      <TankerDetailInfo offset={offset} detailData={tankerTransactionDetail} isTanker={isTanker}/>
    </>
  );
};

export default TankerDetail;
