/* eslint-disable radix */
/* eslint-disable import/no-unresolved */
import React from 'react';
import { Button, Result } from 'antd';
import { useHistory } from 'react-router';
import { useDispatch } from 'react-redux';

import { CALL_API } from '../../middleware/api';
import AuthService from '../util/authService';

const TimeoutContent = () => {
  const authService = AuthService();

  const history = useHistory();
  const dispatch = useDispatch();

  const [counter, setCounter] = React.useState(10);
  const [isTimer, setTimer] = React.useState(false);
  const [fetchTime, setFetchTime] = React.useState(false);

  React.useEffect(() => {
    const timer = counter > 0 && setInterval(() => setCounter(counter - 1), 1000);
    return () => clearInterval(timer);
  }, [counter]);

  const totalCount = authService.getServerErrorCount() ? authService.getServerErrorCount() : 0;

  function loadFailedApis(endpoint, method, types, payload) {
    return {
      [CALL_API]: {
        endpoint,
        types: [`${types[0]}NO`, types[1], types[2]],
        method,
        payload,
      },
    };
  }

  React.useEffect(() => {
    const api = authService.getServerApis();
    if (api && api.endpoint) {
      const dashboardInterval = 3000;
      const interval = setInterval(() => {
        setTimer(Math.random());
        setFetchTime(new Date(Date.now() - dashboardInterval));
      }, dashboardInterval);
    }
  }, []);

  React.useEffect(() => {
    if (isTimer) {
      const api = authService.getServerApis();
      if (api && api.endpoint) {
        dispatch(loadFailedApis(api.endpoint, api.method, api.types, api.payload));
      }
    }
  }, [isTimer]);

  const onReloadfnButton = () => {
    setCounter(10);
    history.push({ pathname: window.location.pathname });
  };

  const onfnButton = () => {
    if (parseInt(totalCount) === 3) {
      authService.setServerErrorCount(parseInt(totalCount) + 1);
      history.push({ pathname: '/' });
    } else if (parseInt(totalCount) < 3) {
      authService.setServerErrorCount(parseInt(totalCount) + 1);
      history.push({ pathname: window.location.pathname });
    } else if (parseInt(totalCount) > 3) {
      window.location.reload();
    }
  };

  const onfnMsg = () => {
    let res = '';
    if (parseInt(totalCount) === 3) {
      res = 'Go Home';
    } else if (parseInt(totalCount) < 3) {
      res = 'Retry';
    } else if (parseInt(totalCount) > 3) {
      res = 'Reload';
    }
    return res;
  };

  return (
    <Result
      status="warning"
      title="Connection failed. Trying to reconnect."
      subTitle=""
      extra={(
        <>
          {counter === 0 && (
          <Button type="primary" onClick={() => onReloadfnButton()} key="console">
            Retry
          </Button>
          )}
        </>
    )}
    />

  );
};

export default TimeoutContent;
