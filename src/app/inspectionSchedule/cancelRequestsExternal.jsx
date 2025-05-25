/* eslint-disable import/no-unresolved */
import React from 'react';
import { useLocation } from 'react-router-dom';


import AuthService from '../util/authService';

import AccountIdLogin from '../auth/accountIdLogin';
import CancelRequests from './cancelRequests';

const CancelRequestsExternal = (props) => {
  const { match } = props;
  const { params } = match;
  const { uuid } = params;


  const authService = AuthService();
  const isAuthenticated = authService.getRefreshToken();

  const location = useLocation();
  const path = location.pathname;


  return (
    <>
      {(!isAuthenticated && uuid) && (
      <AccountIdLogin redirectLink={path} />
      )}
      {isAuthenticated && (
      <CancelRequests uuid={uuid} />
      )}
    </>
  );
};

export default CancelRequestsExternal;
