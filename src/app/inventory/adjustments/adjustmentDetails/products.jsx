/* eslint-disable import/no-unresolved */
import React, { useEffect } from 'react';
import {
  Col,
  Row,
  Table,
} from 'reactstrap';
import { useSelector, useDispatch } from 'react-redux';

import DetailViewFormat from '@shared/detailViewFormat';

import { getAdjustmentProducts } from '../../inventoryService';
import {
  getDefaultNoValue, extractTextObject, numToFloat, getAllowedCompanies,
} from '../../../util/appUtils';

const appModels = require('../../../util/appModels').default;

const Products = () => {
  const dispatch = useDispatch();

  const { userInfo } = useSelector((state) => state.user);
  const { adjustmentDetail, adjustmentProducts } = useSelector((state) => state.inventory);
  const companies = getAllowedCompanies(userInfo);

  useEffect(() => {
    if (adjustmentDetail && adjustmentDetail.data) {
      const ids = adjustmentDetail.data.length > 0 ? adjustmentDetail.data[0].line_ids : [];
      dispatch(getAdjustmentProducts(companies, ids, appModels.INVENTORYLINE));
    }
  }, [adjustmentDetail]);

  function getRow(assetData) {
    const tableTr = [];
    for (let i = 0; i < assetData.length; i += 1) {
      tableTr.push(
        <tr key={i}>
          <td className="p-2">{getDefaultNoValue(extractTextObject(assetData[i].product_id))}</td>
          <td className="p-2">{getDefaultNoValue(extractTextObject(assetData[i].product_uom_id))}</td>
          <td className="p-2">{getDefaultNoValue(extractTextObject(assetData[i].location_id))}</td>
          <td className="p-2">{numToFloat(assetData[i].theoretical_qty)}</td>
          <td className="p-2">{numToFloat(assetData[i].product_qty)}</td>
        </tr>,
      );
    }
    return tableTr;
  }

  return (
    <>
      <Row>
        <Col sm="12" md="12" lg="12" xs="12" className="p-3 products-list-tab comments-list thin-scrollbar">
          {(adjustmentProducts && adjustmentProducts.data) && (
          <div>
            <Table responsive className="mb-0 mt-2 font-weight-400 border-0 assets-table" width="100%">
              <thead>
                <tr>
                  <th className="p-2 min-width-160">
                    Product
                  </th>
                  <th className="p-2 min-width-100">
                    UOM
                  </th>
                  <th className="p-2 min-width-100">
                    Location
                  </th>
                  <th className="p-2 min-width-160">
                    Theoretical Quantity
                  </th>
                  <th className="p-2 min-width-160">
                    Real Quantity
                  </th>
                </tr>
              </thead>
              <tbody>
                {getRow(adjustmentProducts && adjustmentProducts.data ? adjustmentProducts.data : [])}
              </tbody>
            </Table>
            <hr className="m-0" />
          </div>
          )}
          <DetailViewFormat detailResponse={adjustmentProducts} />
          <div className="mt-4 tab_nav_link">
            <h6>Notes</h6>
            <p className="mb-0">1)Inventory adjustments will be made by comparing the theoretical and the checked quantities.</p>
            <p className="mb-0">2)You can delete lines to ignore some products.</p>
            <p className="mb-0">3)If a product is not at the right place, set the checked quantity to 0 and create a new line with correct location.</p>
          </div>
        </Col>
      </Row>

    </>
  );
};

export default Products;
