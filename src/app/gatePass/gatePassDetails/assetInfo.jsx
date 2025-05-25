/* eslint-disable import/no-unresolved */
import React from 'react';
import {
  Col,
  Row,
  Table,
} from 'reactstrap';
import * as PropTypes from 'prop-types';
import Tooltip from '@mui/material/Tooltip';

import DetailViewFormat from '@shared/detailViewFormat';
import ErrorContent from '@shared/errorContent';

import {
  getDefaultNoValue, extractNameObject, numToFloat, truncate,
} from '../../util/appUtils';

const AssetInfo = (props) => {
  const {
    detailData,
  } = props;

  const loading = detailData && detailData.loading;
  const isErr = detailData && detailData.err;
  const inspDeata = detailData && detailData.data && detailData.data.length ? detailData.data[0] : false;
  const isChecklist = (inspDeata && inspDeata.order_lines && inspDeata.order_lines.length > 0);

  function getRow(assetData) {
    const tableTr = [];
    for (let i = 0; i < assetData.length; i += 1) {
      tableTr.push(
        <tr key={i}>
          <td className="p-2">{getDefaultNoValue(extractNameObject(assetData[i].asset_id, 'name'))}</td>
          <td className="p-2">{numToFloat(assetData[i].parts_qty)}</td>
          {assetData[i].description && assetData[i].description.length > 50 ? (
            <Tooltip title={getDefaultNoValue(assetData[i].description)} placement="top">
              <td className="p-2">{getDefaultNoValue(truncate(assetData[i].description, 50))}</td>
            </Tooltip>
          ) : (
            <td className="p-2">{getDefaultNoValue(assetData[i].description)}</td>
          )}
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
                    Item
                  </th>
                  <th className="p-2 min-width-160">
                    Quantity
                  </th>
                  <th className="p-2 min-width-160">
                    Description
                  </th>
                </tr>
              </thead>
              <tbody>
                {getRow(detailData.data.length > 0 ? detailData.data[0].order_lines : [])}
              </tbody>
            </Table>
            <hr className="m-0" />
          </div>
        )}
        <DetailViewFormat detailResponse={detailData} />
        {!isErr && inspDeata && !isChecklist && !loading && (
        <ErrorContent errorTxt="No Data Found" />
        )}
      </Col>
    </Row>
  );
};

AssetInfo.propTypes = {
  detailData: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array,
    PropTypes.bool,
  ]).isRequired,
};

export default AssetInfo;
