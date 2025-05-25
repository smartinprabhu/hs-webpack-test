import React from 'react';
import * as PropTypes from 'prop-types';

import BasicInfo from './basicInfo';
import OrderSegments from './orderSegments';

const OrderDetail = (props) => {
  const { setViewModal } = props;
  return (
    <>
      <BasicInfo />
      <OrderSegments setViewModal={setViewModal} />
    </>
  );
};

OrderDetail.propTypes = {
  setViewModal: PropTypes.func.isRequired,
};

export default OrderDetail;
