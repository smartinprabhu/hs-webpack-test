/* eslint-disable import/no-unresolved */
import React, { useEffect } from 'react';
import {
  Col,
  Row,
  Table,
} from 'reactstrap';
import { useSelector, useDispatch } from 'react-redux';

import DetailViewFormat from '@shared/detailViewFormat';

import { getMoveProducts } from '../../../purchase/purchaseService';
import { getDefaultNoValue, extractTextObject, numToFloat } from '../../../util/appUtils';

const appModels = require('../../../util/appModels').default;

const ProductsAdjustments = () => {
  const dispatch = useDispatch();

  const { adjustmentDetail } = useSelector((state) => state.inventory);
  const { moveProducts } = useSelector((state) => state.purchase);

  useEffect(() => {
    if (adjustmentDetail && adjustmentDetail.data) {
      const ids = adjustmentDetail.data.length > 0 ? adjustmentDetail.data[0].move_ids : [];
      dispatch(getMoveProducts(ids, appModels.STOCKMOVE));
    }
  }, [adjustmentDetail]);

  function getRow(assetData) {
    const tableTr = [];
    for (let i = 0; i < assetData.length; i += 1) {
      tableTr.push(
        <tr key={i}>
          <td className="p-2">{getDefaultNoValue(extractTextObject(assetData[i].product_id))}</td>
          <td className="p-2">{getDefaultNoValue(extractTextObject(assetData[i].location_id))}</td>
          <td className="p-2">{getDefaultNoValue(extractTextObject(assetData[i].location_dest_id))}</td>
          <td className="p-2">{numToFloat(assetData[i].quantity_done)}</td>
          <td className="p-2">{getDefaultNoValue(extractTextObject(assetData[i].product_uom))}</td>
        </tr>,
      );
    }
    return tableTr;
  }

  return (
    <Row>
      <Col sm="12" md="12" lg="12" xs="12" className="p-3 products-list-tab comments-list thin-scrollbar">
        {(moveProducts && moveProducts.data) && (
          <div>
            <Table responsive className="mb-0 mt-2 font-weight-400 border-0 assets-table" width="100%">
              <thead>
                <tr>
                  <th className="p-2 min-width-160">
                    Product
                  </th>
                  <th className="p-2 min-width-160">
                    From
                  </th>
                  <th className="p-2 min-width-160">
                    To
                  </th>
                  <th className="p-2 min-width-100">
                    Quantity Done
                  </th>
                  <th className="p-2 min-width-100">
                    UOM
                  </th>
                </tr>
              </thead>
              <tbody>
                {getRow(moveProducts && moveProducts.data ? moveProducts.data : [])}
              </tbody>
            </Table>
            <hr className="m-0" />
          </div>
        )}
        <DetailViewFormat detailResponse={moveProducts} />
      </Col>
    </Row>
  );
};

export default ProductsAdjustments;
