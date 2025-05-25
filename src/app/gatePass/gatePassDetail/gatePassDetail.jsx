import React from 'react';
import { useSelector } from 'react-redux';
import * as PropTypes from 'prop-types';

import GatePassDetailInfo from './gatePassDetailInfo';
import GatePassDetailTabs from './gatePassDetailTabs';

const GatePassDetail = (props) => {
  const {
    setViewModal,
  } = props;
  const {
    gatePassDetails,
  } = useSelector((state) => state.gatepass);

  return (
    <>
      <GatePassDetailInfo detailData={gatePassDetails} setViewModal={setViewModal} />
      <GatePassDetailTabs detailData={gatePassDetails} />
    </>
  );
};

GatePassDetail.propTypes = {
  setViewModal: PropTypes.func.isRequired,
};

export default GatePassDetail;
