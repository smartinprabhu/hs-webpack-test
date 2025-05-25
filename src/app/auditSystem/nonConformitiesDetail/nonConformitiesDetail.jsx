import * as PropTypes from 'prop-types';
import React from 'react';
import { useSelector } from 'react-redux';

import NonConformitiesInfo from './nonConformitiesInfo';

const NonConformitiesDetail = ({ setViewModal }) => {
  const { nonConformitieDetail } = useSelector((state) => state.audit);

  return (
    <>
      <NonConformitiesInfo detailData={nonConformitieDetail} setDetailModal={setViewModal} />
    </>
  );
};

NonConformitiesDetail.propTypes = {
  setViewModal: PropTypes.func.isRequired,
};

export default NonConformitiesDetail;
