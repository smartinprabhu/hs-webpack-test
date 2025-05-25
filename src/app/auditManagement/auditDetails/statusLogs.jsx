/* eslint-disable import/no-unresolved */
import React from 'react';
import {
  Col,
  Row,
  Table,
} from 'reactstrap';
import { useSelector } from 'react-redux';

import DetailViewFormat from '@shared/detailViewFormat';
import ErrorContent from '@shared/errorContent';

import {
  getDefaultNoValue, extractNameObject, getCompanyTimezoneDate,
} from '../../util/appUtils';

const LogNotes = () => {
  const { hxAuditDetailsInfo } = useSelector((state) => state.hxAudits);
  const { userInfo } = useSelector((state) => state.user);

  const loading = hxAuditDetailsInfo && hxAuditDetailsInfo.loading;
  const isErr = hxAuditDetailsInfo && hxAuditDetailsInfo.err;
  const inspDeata = hxAuditDetailsInfo && hxAuditDetailsInfo.data && hxAuditDetailsInfo.data.length ? hxAuditDetailsInfo.data[0] : false;
  const isChecklist = (inspDeata && inspDeata.status_logs && inspDeata.status_logs.length > 0);

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
                {getRow(hxAuditDetailsInfo.data.length > 0 ? hxAuditDetailsInfo.data[0].status_logs : [])}
              </tbody>
            </Table>
            <hr className="m-0" />
          </div>
        )}
        <DetailViewFormat detailResponse={hxAuditDetailsInfo} />
        {!isErr && inspDeata && !isChecklist && !loading && (
        <ErrorContent errorTxt="No Data Found" />
        )}
      </Col>
    </Row>
  );
};

export default LogNotes;
