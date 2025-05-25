/* eslint-disable import/no-unresolved */
import React from 'react';
import {
  Col,
  Row,
  Table,
} from 'reactstrap';
import { useSelector } from 'react-redux';

import DetailViewFormat from '@shared/detailViewFormat';

import {
  getDefaultNoValue, extractNameObject, numToFloat,
} from '../../util/appUtils';

const OrderLines = () => {
  const { pantryDetails } = useSelector((state) => state.pantry);

  function getRow(assetData) {
    const tableTr = [];
    for (let i = 0; i < assetData.length; i += 1) {
      tableTr.push(
        <tr key={i}>
          <td className="p-2">{getDefaultNoValue(extractNameObject(assetData[i].product_id, 'name'))}</td>
          <td className="p-2">{numToFloat(assetData[i].ordered_qty)}</td>
          <td className="p-2">{numToFloat(assetData[i].confirmed_qty)}</td>
          <td className="p-2">{numToFloat(assetData[i].delivered_qty)}</td>
          {/* <td className="p-2">{getDefaultNoValue(assetData[i].reason_from_pantry)}</td>
          <td className="p-2">{getDefaultNoValue(assetData[i].notes_from_employee)}</td> */}
        </tr>,
      );
    }
    return tableTr;
  }

  return (
    <Row>
      <Col sm="12" md="12" lg="12" xs="12" className="p-3 products-list-tab comments-list thin-scrollbar product-orders">
        {(pantryDetails && pantryDetails.data) && (
          <div>
            <Table responsive className="mb-0 mt-2 font-weight-400 border-0 assets-table" width="100%">
              <thead>
                <tr>
                  <th className="p-2 min-width-160">
                    Name
                  </th>
                  <th className="p-2 min-width-160">
                    Ordered Quantity
                  </th>
                  <th className="p-2 min-width-160">
                    Confirmed Quantity
                  </th>
                  <th className="p-2 min-width-160">
                    Delivered Quantity
                  </th>
                  {/* <th className="p-2 min-width-160">
                    Reason from Pantry
                  </th>
                  <th className="p-2 min-width-160">
                    Notes from Employee
          </th> */}
                </tr>
              </thead>
              <tbody>
                {getRow(pantryDetails.data.length > 0 ? pantryDetails.data[0].order_lines : [])}
              </tbody>
            </Table>
            <hr className="m-0" />
          </div>
        )}
        <DetailViewFormat detailResponse={pantryDetails} />
      </Col>
    </Row>
  );
};

export default OrderLines;
