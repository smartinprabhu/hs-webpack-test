import React from 'react';
import { useSelector } from 'react-redux';
import * as PropTypes from 'prop-types';

import WorkPermitDetailInfo from './workPermitDetailInfo';
import WorkPermitDetailTabs from './workPermitDetailTabs';

const WorkPermitDetail = (props) => {
  const {
    openWorkOrder, setViewModal, viewId
  } = props;
  const { workPermitDetail } = useSelector((state) => state.workpermit);

  return (
    <>
      <WorkPermitDetailInfo detailData={workPermitDetail} setViewModal={setViewModal} viewId={viewId} />
      <WorkPermitDetailTabs detailData={workPermitDetail} openWorkOrder={openWorkOrder} />
    </>
  );
};

WorkPermitDetail.propTypes = {
  openWorkOrder: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.bool,
  ]).isRequired,
  setViewModal: PropTypes.func.isRequired,
};

export default WorkPermitDetail;
