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
  const { incidentDetailsInfo } = useSelector((state) => state.hazards);
  const { userInfo } = useSelector((state) => state.user);

  const loading = incidentDetailsInfo && incidentDetailsInfo.loading;
  const isErr = incidentDetailsInfo && incidentDetailsInfo.err;
  const inspDeata = incidentDetailsInfo && incidentDetailsInfo.data && incidentDetailsInfo.data.length ? incidentDetailsInfo.data[0] : false;
  const isChecklist = (inspDeata && inspDeata.status_logs && inspDeata.status_logs.length > 0);

  function getRow(assetData) {
    const tableTr = [];
    for (let i = 0; i < assetData.length; i += 1) {
      tableTr.push(
        <tr key={i}>
          <td className="p-2">{getDefaultNoValue(assetData[i].from_state)}</td>
          <td className="p-2">{getDefaultNoValue(assetData[i].to_state)}</td>
          <td className="p-2">{getDefaultNoValue(extractNameObject(assetData[i].performed_by_id, 'name'))}</td>
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
      <Col sm="12" md="12" lg="12" xs="12" className="pr-3 pl-3 pb-3 pt-2 products-list-tab form-modal-scroll thin-scrollbar product-orders">
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
                {getRow(incidentDetailsInfo.data.length > 0 ? incidentDetailsInfo.data[0].status_logs : [])}
              </tbody>
            </Table>
            <hr className="m-0" />
          </div>
        )}
        <DetailViewFormat detailResponse={incidentDetailsInfo} />
        {!isErr && inspDeata && !isChecklist && !loading && (
        <ErrorContent errorTxt="No Data Found" />
        )}
      </Col>
    </Row>
  );
};

export default LogNotes;
