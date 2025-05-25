/* eslint-disable react/jsx-no-useless-fragment */
/* eslint-disable import/no-unresolved */
import React from 'react';
import {
  Col,
  Row,
  Table,
} from 'reactstrap';
import * as PropTypes from 'prop-types';
import { Typography } from '@mui/material';

import {
  getDefaultNoValue, extractNameObject, numToFloat,
} from '../../util/appUtils';
import { AddThemeColor } from '../../themes/theme';

const AssetInfo = (props) => {
  const {
    detailData,
  } = props;

  const inspDeata = detailData && detailData.data && detailData.data.length ? detailData.data[0] : false;
  const isChecklist = (inspDeata && inspDeata.gatepass_type && inspDeata.gatepass_type === 'Item' && inspDeata.order_lines && inspDeata.order_lines.length > 0);

  const isAssets = (inspDeata && inspDeata.gatepass_type && inspDeata.gatepass_type === 'Asset');

  function getRow(assetData) {
    const tableTr = [];
    for (let i = 0; i < assetData.length; i += 1) {
      tableTr.push(
        <tr key={i}>
          <td className="p-2">{getDefaultNoValue(extractNameObject(assetData[i].asset_id, 'name'))}</td>
          <td className="p-2">{numToFloat(assetData[i].parts_qty)}</td>
        </tr>,
      );
    }
    return tableTr;
  }

  function getAssetRow(assetData) {
    const tableTr = [];
    for (let i = 0; i < assetData.length; i += 1) {
      tableTr.push(
        <tr key={i}>
          <td className="p-2">{getDefaultNoValue(extractNameObject(assetData[i].asset_id, 'name'))}</td>
          <td className="p-2">{assetData[i].parts_qty}</td>
          <td className="p-2">{getDefaultNoValue(assetData[i].description)}</td>
          <td className="p-2">{getDefaultNoValue(extractNameObject(assetData[i].asset_id, 'serial'))}</td>
          <td className="p-2">{extractNameObject(extractNameObject(assetData[i].asset_id, 'category_id'), 'name')}</td>
          <td className="p-2">{extractNameObject(extractNameObject(assetData[i].asset_id, 'location_id'), 'path_name')}</td>
          <td className="p-2">{getDefaultNoValue(extractNameObject(assetData[i].asset_id, 'brand'))}</td>
        </tr>,
      );
    }
    return tableTr;
  }

  return (
    <>
      {isChecklist && (
      <>
        <Typography
          sx={AddThemeColor({
            font: 'normal normal medium 20px/24px Suisse Intl',
            fontWeight: 500,
            margin: '10px 0px 10px 10px',
          })}
        >
          Items Info
        </Typography>
        <div className="ml-0 bg-white">
          <Row>
            <Col sm="12" md="12" lg="12" xs="12" className="products-list-tab comments-list thin-scrollbar product-orders">

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
                    </tr>
                  </thead>
                  <tbody>
                    {getRow(detailData.data.length > 0 ? detailData.data[0].order_lines : [])}
                  </tbody>
                </Table>
                <hr className="m-0" />
              </div>
            </Col>
          </Row>
        </div>
      </>
      )}
      {isAssets && (
      <>
        <Typography
          sx={AddThemeColor({
            font: 'normal normal medium 20px/24px Suisse Intl',
            fontWeight: 500,
            margin: '10px 0px 10px 10px',
          })}
        >
          Assets Info
        </Typography>
        <div className="ml-0 bg-white">
          <Row>
            <Col sm="12" md="12" lg="12" xs="12" className="products-list-tab comments-list thin-scrollbar product-orders">

              <div>
                <Table responsive className="mb-0 mt-2 font-weight-400 border-0 assets-table" width="100%">
                  <thead>
                    <tr>
                      <th className="p-2 min-width-160">
                        Name
                      </th>
                      <th className="p-2 min-width-160">
                        Quantity
                      </th>
                      <th className="p-2 min-width-160">
                        Description
                      </th>
                      <th className="p-2 min-width-160">
                        Serial
                      </th>
                      <th className="p-2 min-width-160">
                        Category
                      </th>
                      <th className="p-2 min-width-160">
                        Space
                      </th>
                      <th className="p-2 min-width-160">
                        Brand
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {getAssetRow(inspDeata && inspDeata.asset_lines && inspDeata.asset_lines.length > 0 ? inspDeata.asset_lines : [])}
                  </tbody>
                </Table>
                <hr className="m-0" />
              </div>
            </Col>
          </Row>
        </div>
      </>
      )}
    </>
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
