/* eslint-disable import/no-unresolved */
import React, { useEffect, useMemo } from 'react';
import {
  Col,
  Row,
  Table,
} from 'reactstrap';
import { useDispatch, useSelector } from 'react-redux';

import DetailViewFormat from '@shared/detailViewFormat';
import ErrorContent from '@shared/errorContent';

import {
  getDefaultNoValue, extractNameObject, getCompanyTimezoneDate,
} from '../../util/appUtils';
import { getStatusLogs } from '../ticketService';

const LogNotes = ({ ids }) => {
  const { statusLogsInfo } = useSelector((state) => state.ticket);
  const { userInfo } = useSelector((state) => state.user);

  const dispatch = useDispatch();

  useMemo(() => {
    dispatch(getStatusLogs(ids));
  }, [ids]);

  const loading = statusLogsInfo && statusLogsInfo.loading;
  const isErr = statusLogsInfo && statusLogsInfo.err;
  const inspDeata = statusLogsInfo && statusLogsInfo.data && statusLogsInfo.data.length ? statusLogsInfo.data : false;
  const isChecklist = !!inspDeata;

  function getRow(assetData) {
    const tableTr = [];
    for (let i = 0; i < assetData.length; i += 1) {
      tableTr.push(
        <tr key={i}>
          <td className="p-2">{getDefaultNoValue(assetData[i].from_state)}</td>
          <td className="p-2">{getDefaultNoValue(assetData[i].to_state)}</td>
          {/*<td className="p-2">{getDefaultNoValue(extractNameObject(assetData[i].performed_by_id, 'name'))}</td>*/}
          <td className="p-2">{getDefaultNoValue(assetData[i].performed_by)}</td>
          <td className="p-2">
            {' '}
            {getDefaultNoValue(getCompanyTimezoneDate(assetData[i].performed_on, userInfo, 'datetime'))}
          </td>
          <td className="p-2">{getDefaultNoValue(assetData[i].description)}</td>
        </tr>,
      );
    }
    return tableTr;
  }

  return (
    <Row>
      <Col sm="12" md="12" lg="12" xs="12" className="pr-3 pl-3 pb-3 pt-2">
        {!loading && isChecklist && (
          <div>
            <Table responsive className="mb-0 mt-0 font-weight-400 border-0 assets-table" width="100%">
              <thead>
                <tr>
                  <th className="p-2 min-width-100">
                    From State
                  </th>
                  <th className="p-2 min-width-100">
                    To State
                  </th>
                  <th className="p-2 min-width-100">
                    Performed By
                  </th>
                  <th className="p-2 min-width-160">
                    Performed On
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
        <DetailViewFormat detailResponse={statusLogsInfo} />
        {!isErr && inspDeata && !isChecklist && !loading && (
          <ErrorContent errorTxt="No Data Found" />
        )}
      </Col>
    </Row>
  );
};

export default LogNotes;
