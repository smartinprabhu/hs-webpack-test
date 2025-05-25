/* eslint-disable import/no-unresolved */
import React, { useEffect } from 'react';
import {
  Col,
  Row,
  Table,
} from 'reactstrap';
import { useDispatch, useSelector } from 'react-redux';

import DetailViewFormat from '@shared/detailViewFormat';
import ErrorContent from '@shared/errorContent';

import {
  getDefaultNoValue, getCompanyTimezoneDate,
} from '../../../util/appUtils';

import { getPPMStatusLogs } from '../../ppmService';

const appModels = require('../../../util/appModels').default;

const LogNotes = ({ detaildata }) => {
  const {
    ppmStatusLogs,
  } = useSelector((state) => state.ppm);
  const { userInfo } = useSelector((state) => state.user);

  const dispatch = useDispatch();

  useEffect(() => {
    if (detaildata && detaildata.id) {
      dispatch(getPPMStatusLogs(detaildata.id, appModels.PPMSTATUSLOGS));
    }
  }, [detaildata]);

  const loading = ppmStatusLogs && ppmStatusLogs.loading;
  const isErr = ppmStatusLogs && ppmStatusLogs.err;
  const inspDeata = ppmStatusLogs && ppmStatusLogs.data && ppmStatusLogs.data.length ? ppmStatusLogs.data : false;
  const isChecklist = (ppmStatusLogs && ppmStatusLogs.data && ppmStatusLogs.data.length > 0);

  function getRow(assetData) {
    const tableTr = [];
    for (let i = 0; i < assetData.length; i += 1) {
      tableTr.push(
        <tr key={i}>
          <td className="p-2">{getDefaultNoValue(assetData[i].from_state)}</td>
          <td className="p-2">{getDefaultNoValue(assetData[i].to_state)}</td>
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
        {isChecklist && (
          <div>
            <Table responsive className="mb-0 mt-0 font-weight-400 border-0 assets-table" width="100%">
              <thead>
                <tr>
                  <th className="p-2 min-width-160">
                    From State
                  </th>
                  <th className="p-2 min-width-160">
                    To State
                  </th>
                  <th className="p-2 min-width-160">
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
                {getRow(ppmStatusLogs.data)}
              </tbody>
            </Table>
            <hr className="m-0" />
          </div>
        )}
        <DetailViewFormat detailResponse={ppmStatusLogs} />
        {!isErr && !isChecklist && !loading && (
        <ErrorContent errorTxt="No Data Found" />
        )}
      </Col>
    </Row>
  );
};

export default LogNotes;
