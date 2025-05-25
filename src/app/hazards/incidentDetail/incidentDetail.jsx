import React from 'react';
import { useSelector } from 'react-redux';
import * as PropTypes from 'prop-types';

import IncidentDetailInfo from './incidentDetailInfo';
import IncidentDetailTabs from './incidentDetailTabs';

const IncidentDetail = ({ offset }) => {
  const { incidentDetailsInfo } = useSelector((state) => state.hxIncident);

  return (
    <>
      <IncidentDetailInfo detailData={incidentDetailsInfo} offset={offset} />
      <IncidentDetailTabs detailData={incidentDetailsInfo} />
    </>
  );
};

IncidentDetail.propTypes = {
  offset: PropTypes.number.isRequired,
};

export default IncidentDetail;
