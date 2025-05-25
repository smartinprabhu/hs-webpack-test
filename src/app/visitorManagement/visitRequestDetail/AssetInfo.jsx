/* eslint-disable import/no-unresolved */
import React from 'react';
import {
  Row, Col, Table
} from 'reactstrap';
import * as PropTypes from 'prop-types';
import ErrorContent from '@shared/errorContent';
import Loader from '@shared/loading';

import {
  getDefaultNoValue,
  generateErrorMessage,
} from '../../util/appUtils';



const AssetInfo = (props) => {
  const {
    assetDetails
  } = props;

  function getRow(assetData) {
    const tableTr = [];
    for (let i = 0; i < assetData.length; i += 1) {
      tableTr.push(
        <tr key={i}>
          <td className="p-2">
            <p className="m-0">{getDefaultNoValue(assetData[i].visitor_asset_name)}</p>
          </td>
          <td className="p-2">
            {getDefaultNoValue(assetData[i].asset_quantity)}
          </td>
          <td className="p-2">
            {getDefaultNoValue(assetData[i].remarks)}
          </td>
         
        </tr>,
      );
    }
    return tableTr;
  }

  return (assetDetails && (
  <>
    <Row>
      <Col sm="12" md="12" lg="12" xs="12" className="p-2 products-list-tab comments-list thin-scrollbar">
        <div>
          <Table responsive className="mb-0 mt-0 font-weight-400 border-0 assets-table" width="100%">
            <thead>
              <tr>
                <th className="p-2 min-width-100">
                  Asset
                </th>
                <th className="p-2 min-width-100">
                  Quantity
                </th>
                <th className="p-2 min-width-100">
                  Remarks
                </th>
               
              </tr>
            </thead>
            <tbody>
              {getRow(assetDetails && assetDetails.data ? assetDetails.data : [])}
            </tbody>
          </Table>
          <hr className="m-0" />
        </div>
        {assetDetails && assetDetails.loading && (
          <Loader />
        )}
        {(assetDetails && assetDetails.err) && (
          <ErrorContent errorTxt={generateErrorMessage(assetDetails)} />
        )}
      </Col>
    </Row>
    
  </>
  )
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
