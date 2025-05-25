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
  getDefaultNoValue, extractNameObject, numToFloat,
} from '../../util/appUtils';

const SpareParts = () => {
  const { workPermitDetail } = useSelector((state) => state.workpermit);

  const loading = workPermitDetail && workPermitDetail.loading;
  const isErr = workPermitDetail && workPermitDetail.err;
  const inspDeata = workPermitDetail && workPermitDetail.data && workPermitDetail.data.length ? workPermitDetail.data[0] : false;
  const isChecklist = (inspDeata && inspDeata.parts_lines && inspDeata.parts_lines.length > 0);

  function getRow(assetData) {
    const tableTr = [];
    for (let i = 0; i < assetData.length; i += 1) {
      tableTr.push(
        <tr key={i}>
          <td className="p-2">{getDefaultNoValue(extractNameObject(assetData[i].parts_id, 'name'))}</td>
          <td className="p-2">{numToFloat(assetData[i].parts_qty)}</td>
          <td className="p-2">{getDefaultNoValue(extractNameObject(assetData[i].parts_uom, 'name'))}</td>
          <td className="p-2">{getDefaultNoValue(assetData[i].name)}</td>
        </tr>,
      );
    }
    return tableTr;
  }

  return (
    <Row>
      <Col sm="12" md="12" lg="12" xs="12" className="p-3 products-list-tab comments-list thin-scrollbar product-orders">
        {isChecklist && (
          <div>
            <Table responsive className="mb-0 mt-2 font-weight-400 border-0 assets-table" width="100%">
              <thead>
                <tr>
                  <th className="p-2 min-width-160">
                    Spare Part
                  </th>
                  <th className="p-2 min-width-160">
                    Quantity
                  </th>
                  <th className="p-2 min-width-160">
                    UOM
                  </th>
                  <th className="p-2 min-width-160">
                    Short Description
                  </th>
                </tr>
              </thead>
              <tbody>
                {getRow(workPermitDetail.data.length > 0 ? workPermitDetail.data[0].parts_lines : [])}
              </tbody>
            </Table>
            <hr className="m-0" />
          </div>
        )}
        <DetailViewFormat detailResponse={workPermitDetail} />
        {!isErr && inspDeata && !isChecklist && !loading && (
        <ErrorContent errorTxt="No Data Found" />
        )}
      </Col>
    </Row>
  );
};

export default SpareParts;
