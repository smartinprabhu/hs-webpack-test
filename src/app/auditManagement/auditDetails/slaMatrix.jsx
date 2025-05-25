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

const SlaMatrix = () => {
  const { hxAuditDetailsInfo } = useSelector((state) => state.hxAudits);
  const { userInfo } = useSelector((state) => state.user);

  const loading = hxAuditDetailsInfo && hxAuditDetailsInfo.loading;
  const isErr = hxAuditDetailsInfo && hxAuditDetailsInfo.err;
  const inspDeata = hxAuditDetailsInfo && hxAuditDetailsInfo.data && hxAuditDetailsInfo.data.length ? hxAuditDetailsInfo.data[0] : false;
  const isChecklist = (inspDeata && inspDeata.escalation_matrix_ids && inspDeata.escalation_matrix_ids.length > 0);

  function getRow(assetData) {
    const tableTr = [];
    for (let i = 0; i < assetData.length; i += 1) {
      tableTr.push(
        <tr key={i}>
          <td className="p-2">{getDefaultNoValue(assetData[i].type)}</td>
          <td className="p-2">{getDefaultNoValue(assetData[i].level)}</td>
          <td className="p-2">
            {' '}
            {getDefaultNoValue(getCompanyTimezoneDate(assetData[i].level_date, userInfo, 'date'))}
          </td>
          <td className="p-2">{getDefaultNoValue(extractNameObject(assetData[i].recipients_id, 'name'))}</td>
        </tr>,
      );
    }
    return tableTr;
  }

  return (
    <Row>
      <Col sm="12" md="12" lg="12" xs="12" className="p-3 products-list-tab form-modal-scroll thin-scrollbar product-orders">
        {isChecklist && (
          <div>
            <Table responsive className="mb-0 mt-2 font-weight-400 border-0 assets-table" width="100%">
              <thead>
                <tr>
                  <th className="p-2 min-width-160">
                    Type
                  </th>
                  <th className="p-2 min-width-160">
                    Level
                  </th>
                  <th className="p-2 min-width-160">
                    Level Date
                  </th>
                  <th className="p-2 min-width-160">
                    Recipients
                  </th>
                </tr>
              </thead>
              <tbody>
                {getRow(hxAuditDetailsInfo.data.length > 0 ? hxAuditDetailsInfo.data[0].escalation_matrix_ids : [])}
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

export default SlaMatrix;
