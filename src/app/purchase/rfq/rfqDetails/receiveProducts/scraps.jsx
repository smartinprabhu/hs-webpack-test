/* eslint-disable import/no-unresolved */
/* eslint-disable react/no-danger */
import React, { useEffect } from 'react';
import {
  Col,
  Row,
  Table,
} from 'reactstrap';
import { useSelector, useDispatch } from 'react-redux';

import Loader from '@shared/loading';
import ErrorContent from '@shared/errorContent';
import { getScrapProducts } from '../../../purchaseService';
import {
  getDefaultNoValue, generateErrorMessage, extractTextObject, numToFloat,
} from '../../../../util/appUtils';
import { getStateLabel } from '../../../../inventory/scrap/utils/utils';

const appModels = require('../../../../util/appModels').default;

const Scraps = () => {
  const dispatch = useDispatch();

  const { transferDetails, scrapProducts } = useSelector((state) => state.purchase);

  useEffect(() => {
    if (transferDetails && transferDetails.data) {
      const id = transferDetails.data.length > 0 ? transferDetails.data[0].id : [];
      dispatch(getScrapProducts(id, appModels.STOCKSCRAP));
    }
  }, [transferDetails]);

  function getRow(assetData) {
    const tableTr = [];
    for (let i = 0; i < assetData.length; i += 1) {
      tableTr.push(
        <tr key={i}>
          <td className="p-2">{getDefaultNoValue(extractTextObject(assetData[i].product_id))}</td>
          <td className="p-2">{getDefaultNoValue(extractTextObject(assetData[i].product_uom_id))}</td>
          <td className="p-2">{getDefaultNoValue(extractTextObject(assetData[i].location_id))}</td>
          <td className="p-2">{getDefaultNoValue(extractTextObject(assetData[i].scrap_location_id))}</td>
          <td className="p-2">{numToFloat(assetData[i].scrap_qty)}</td>
          <td className="p-2">{getDefaultNoValue(getStateLabel(assetData[i].state))}</td>
        </tr>,
      );
    }
    return tableTr;
  }

  return (
    <>
      <Row>
        <Col sm="12" md="12" lg="12" xs="12" className="p-3 comments-list thin-scrollbar">
          {(scrapProducts && scrapProducts.data) && (
          <div>
            <Table responsive className="mb-0 mt-2 font-weight-400 border-0 assets-table" width="100%">
              <thead>
                <tr>
                  <th className="p-2 min-width-100">
                    Product
                  </th>
                  <th className="p-2 min-width-100">
                    UOM
                  </th>
                  <th className="p-2 min-width-160">
                    Location
                  </th>
                  <th className="p-2 min-width-160">
                    Scrap Location
                  </th>
                  <th className="p-2 min-width-100">
                    Quantity
                  </th>
                  <th className="p-2 min-width-100">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {getRow(scrapProducts && scrapProducts.data ? scrapProducts.data : [])}
              </tbody>
            </Table>
            <hr className="m-0" />
          </div>
          )}
          {scrapProducts && scrapProducts.loading && (
          <Loader />
          )}
          {(scrapProducts && scrapProducts.err) && (
          <ErrorContent errorTxt={generateErrorMessage(scrapProducts)} />
          )}
        </Col>
      </Row>

    </>
  );
};

export default Scraps;
