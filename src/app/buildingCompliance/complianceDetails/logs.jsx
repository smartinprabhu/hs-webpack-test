/* eslint-disable import/no-unresolved */
import React, { useEffect } from 'react';
import {
  Col,
  Row,
  Table,
} from 'reactstrap';
import { useSelector, useDispatch } from 'react-redux';
import * as PropTypes from 'prop-types';

import Loader from '@shared/loading';
import ErrorContent from '@shared/errorContent';
import {
  getDefaultNoValue,
  generateErrorMessage, getCompanyTimezoneDate,
} from '../../util/appUtils';
import { getComplianceLogs } from '../complianceService';
import { getComplianceStateColor, getStatusLabel } from '../utils/utils';

const appModels = require('../../util/appModels').default;

const Logs = React.memo((props) => {
  const { ids } = props;
  const dispatch = useDispatch();

  const { userInfo } = useSelector((state) => state.user);
  const { complianceLogs } = useSelector((state) => state.compliance);

  useEffect(() => {
    if (ids) {
      dispatch(getComplianceLogs(ids, appModels.COMPLIANCELOGS));
    }
  }, [ids]);

  function getRow(logData) {
    const tableTr = [];
    for (let i = 0; i < logData.length; i += 1) {
      tableTr.push(
        <tr key={i}>
          <td className="p-2">{getDefaultNoValue(getCompanyTimezoneDate(logData[i].log_date, userInfo, 'datetime'))}</td>
          <td className="p-2">{getDefaultNoValue(logData[i].user_id ? logData[i].user_id[1] : '')}</td>
          <td className="p-2 w-50">{getDefaultNoValue(logData[i].description)}</td>
          <td className="p-2">
            <span className={`text-${getComplianceStateColor(logData[i].stage)}`}>
              {getDefaultNoValue(getStatusLabel(logData[i].stage))}
            </span>
          </td>
        </tr>,
      );
    }
    return tableTr;
  }

  return (
    <>
      <Row>
        <Col sm="12" md="12" lg="12" xs="12" className="p-3 bg-white comments-list thin-scrollbar">
          {(complianceLogs && complianceLogs.data) && (
          <div>
            <Table responsive className="mb-0 mt-2 font-weight-400 border-0 assets-table" width="100%">
              <thead>
                <tr>
                  <th className="p-2 min-width-160">
                    Date Time
                  </th>
                  <th className="p-2 min-width-100">
                    User
                  </th>
                  <th className="p-2 min-width-200">
                    Description
                  </th>
                  <th className="p-2 min-width-160">
                    Stage
                  </th>
                </tr>
              </thead>
              <tbody>
                {getRow(complianceLogs && complianceLogs.data ? complianceLogs.data : [])}
              </tbody>
            </Table>
            <hr className="m-0" />
          </div>
          )}
          {complianceLogs && complianceLogs.loading && (
          <Loader />
          )}
          {(complianceLogs && complianceLogs.err) && (
          <ErrorContent errorTxt={generateErrorMessage(complianceLogs)} />
          )}
          {(!ids && complianceLogs && !complianceLogs.err) && (
            <ErrorContent errorTxt="" />
          )}
        </Col>
      </Row>

    </>
  );
});

Logs.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  ids: PropTypes.array.isRequired,
};

export default Logs;
