import React from 'react';
import { useSelector } from 'react-redux';

import Tracker from '../consumptionTracker/trackers';
import {
  getColumnArrayByIdCase,
} from '../util/appUtils';

const ESGTracker = () => {
  const { userRoles } = useSelector((state) => state.user);

  const menuNames = getColumnArrayByIdCase(
    userRoles && userRoles.data ? userRoles.data.allowed_modules : [],
    'name',
  );

  return (
    <Tracker esgModule={menuNames.includes('esg tracker') ? 'ESG Tracker' : 'ESG'} />
  );
};
export default ESGTracker;
