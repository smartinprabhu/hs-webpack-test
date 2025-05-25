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
import { getOrderTools } from '../workorderService';
import { getDefaultNoValue, generateErrorMessage } from '../../util/appUtils';

const appModels = require('../../util/appModels').default;

const Tools = () => {
  const dispatch = useDispatch();

  const { workorderDetails, orderTools } = useSelector((state) => state.workorder);

  useEffect(() => {
    if (workorderDetails && workorderDetails.data) {
      const ids = workorderDetails.data.length > 0 ? workorderDetails.data[0].tool_ids : [];
      dispatch(getOrderTools(ids, appModels.ORDERTOOLS));
    }
  }, [workorderDetails]);

  function getRow(assetData) {
    const tableTr = [];
    for (let i = 0; i < assetData.length; i += 1) {
      tableTr.push(
        <tr key={i}>
          <td className="p-2">{getDefaultNoValue(assetData[i].tool_id ? assetData[i].tool_id[1] : '')}</td>
          <td className="p-2">{getDefaultNoValue(assetData[i].order_id ? assetData[i].order_id[1] : '')}</td>
        </tr>,
      );
    }
    return tableTr;
  }

  return (
    <>
      <Row className="tools-tabs">
        <Col sm="12" md="12" lg="12" xs="12" className="p-3 comments-list thin-scrollbar">
          {orderTools && orderTools.data && (
          <div>
            <Table responsive className="mb-0 mt-2 font-weight-400 border-0 bg-white assets-table" width="100%">
              <thead>
                <tr>
                  <th className="p-2 min-width-160">
                    Tools
                  </th>
                  <th className="p-2 min-width-160">
                    Other Maintenance Order
                  </th>
                </tr>
              </thead>
              <tbody>
                {getRow(orderTools && orderTools.data ? orderTools.data : [])}
              </tbody>
            </Table>
            <hr className="m-0" />
          </div>
          )}
          {orderTools && orderTools.loading && (
          <Loader />
          )}
          {(orderTools && orderTools.err) && (
          <ErrorContent errorTxt={generateErrorMessage(orderTools)} />
          )}
        </Col>
      </Row>

    </>
  );
};

export default Tools;
