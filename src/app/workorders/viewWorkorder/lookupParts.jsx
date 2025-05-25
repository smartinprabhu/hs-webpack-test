/* eslint-disable import/no-unresolved */
/* eslint-disable react/no-danger */
import React, { useEffect } from 'react';
import {
  Table,
} from 'reactstrap';
import { useSelector, useDispatch } from 'react-redux';
import { Box } from '@material-ui/core';

import Loader from '@shared/loading';
import ErrorContent from '@shared/errorContent';
import { getOrderParts } from '../workorderService';
import { getDefaultNoValue, generateErrorMessage } from '../../util/appUtils';

const appModels = require('../../util/appModels').default;

const LookupParts = () => {
  const dispatch = useDispatch();

  const { workorderDetails, orderParts } = useSelector((state) => state.workorder);

  useEffect(() => {
    if (workorderDetails && workorderDetails.data) {
      const ids = workorderDetails.data.length > 0 ? workorderDetails.data[0].parts_lines : [];
      dispatch(getOrderParts(ids, appModels.PARTLINES));
    }
  }, [workorderDetails]);

  function getRow(assetData) {
    const tableTr = [];
    for (let i = 0; i < assetData.length; i += 1) {
      tableTr.push(
        <tr key={i}>
          <td className="p-2">{getDefaultNoValue(assetData[i].parts_id ? assetData[i].parts_id[1] : '')}</td>
          <td className="p-2">{getDefaultNoValue(assetData[i].parts_qty)}</td>
          <td className="p-2">{getDefaultNoValue(assetData[i].display_name)}</td>
          <td className="p-2">{getDefaultNoValue(assetData[i].parts_type)}</td>
          <td className="p-2">{getDefaultNoValue(assetData[i].parts_categ_id ? assetData[i].parts_categ_id[1] : '')}</td>
        </tr>,
      );
    }
    return tableTr;
  }

  return (
    <Box
      sx={{
        fontFamily: "Suisse Intl",
      }}
    >
      <div sm="12" md="12" lg="12" xs="12" className="p-3 comments-list thin-scrollbar">
        <div>
          <h6>Planned Parts</h6>
          <Table responsive className="mb-0 mt-2 bg-white font-weight-400 border-0 assets-table" width="100%">
            <thead>
              <tr>
                <th className="p-2 min-width-160">
                  Parts
                </th>
                <th className="p-2 min-width-160">
                  Quantity
                </th>
                <th className="p-2 min-width-160">
                  Description
                </th>
                <th className="p-2 min-width-160">
                  Product Type
                </th>
                <th className="p-2 min-width-160">
                  Product Category
                </th>
              </tr>
            </thead>
            <tbody>
              {getRow(orderParts && orderParts.data ? orderParts.data : [])}
            </tbody>
          </Table>
          <hr className="m-0" />
        </div>
        {orderParts && orderParts.loading && (
          <Loader />
        )}
        {(orderParts && orderParts.err) && (
          <ErrorContent errorTxt={generateErrorMessage(orderParts)} />
        )}
      </div>
    </Box>
  );
};

export default LookupParts;
