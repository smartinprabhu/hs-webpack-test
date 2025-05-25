/* eslint-disable import/no-unresolved */
import React, { useEffect } from 'react';
import {
  Col,
  Row,
  Table,
} from 'reactstrap';
import { useSelector, useDispatch } from 'react-redux';

import DetailViewFormat from '@shared/detailViewFormat';
import ErrorContent from '@shared/errorContent';

import { getStatusLogs } from '../visitorManagementService';
import { getDefaultNoValue, getCompanyTimezoneDate } from '../../util/appUtils';

const appModels = require('../../util/appModels').default;

const CheckList = () => {
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.user);
  const { visitorRequestDetails, statusLogs } = useSelector((state) => state.visitorManagement);

  useEffect(() => {
    if (visitorRequestDetails && visitorRequestDetails.data && visitorRequestDetails.data.length) {
      const ids = visitorRequestDetails.data.length > 0 ? visitorRequestDetails.data[0].visitor_log_entries : [];
      dispatch(getStatusLogs(ids, appModels.VISITSTATUSLOGS, ids.length));
    }
  }, [visitorRequestDetails]);

  const loading = statusLogs && statusLogs.loading;
  const isErr = statusLogs && statusLogs.err;
  const inspDeata = statusLogs && statusLogs.data && statusLogs.data.length ? statusLogs.data : false;

  function getRow(assetData) {
    const tableTr = [];
    for (let i = 0; i < assetData.length; i += 1) {
      tableTr.push(
        <tr key={i}>
          <td className="p-2">{getDefaultNoValue(assetData[i].status)}</td>
          <td className="p-2">
            {' '}
            {getDefaultNoValue(getCompanyTimezoneDate(assetData[i].date, userInfo, 'datetime'))}
          </td>
          <td className="p-2">{getDefaultNoValue(assetData[i].description)}</td>
        </tr>,
      );
    }
    return tableTr;
  }

  return (
    <Row>
      <Col sm="12" md="12" lg="12" xs="12" className="pr-3 pl-3 pb-3 pt-2 products-list-tab form-modal-scroll thin-scrollbar product-orders">
        {inspDeata && (
          <div>
            <Table responsive className="mb-0 mt-0 font-weight-400 border-0 assets-table" width="100%">
              <thead>
                <tr>
                  <th className="p-2 min-width-160">
                    Status
                  </th>
                  <th className="p-2 min-width-160">
                    Date
                  </th>
                  <th className="p-2 min-width-160">
                    Description
                  </th>
                </tr>
              </thead>
              <tbody>
                {getRow(inspDeata)}
              </tbody>
            </Table>
            <hr className="m-0" />
          </div>
        )}
        <DetailViewFormat detailResponse={statusLogs} />
        {!isErr && !inspDeata && statusLogs && statusLogs.data && !loading && (
        <ErrorContent errorTxt="No Data Found" />
        )}
      </Col>
    </Row>
  );
};

export default CheckList;
