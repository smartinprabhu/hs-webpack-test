/* eslint-disable import/no-unresolved */
/* eslint-disable react/no-danger */
import React, { useEffect } from 'react';
import {
  Col,
  Row,
  Table,
} from 'reactstrap';
import { useSelector, useDispatch } from 'react-redux';
import * as PropTypes from 'prop-types';

import Loader from '@shared/loading';
import ErrorContent from '@shared/errorContent';
import { getSpaceLineValues } from '../equipmentService';
import { getDefaultNoValue, generateErrorMessage } from '../../util/appUtils';

const appModels = require('../../util/appModels').default;

const spaceLines = (props) => {
  const { ids } = props;
  const dispatch = useDispatch();

  const { spaceLineValues } = useSelector((state) => state.equipment);

  useEffect(() => {
    if (ids) {
      dispatch(getSpaceLineValues(ids, appModels.SPACELABELLINES));
    }
  }, [ids]);

  function getRow(assetData) {
    const tableTr = [];
    for (let i = 0; i < assetData.length; i += 1) {
      tableTr.push(
        <tr key={i}>
          <td className="p-2">{getDefaultNoValue(assetData[i].space_label_id ? assetData[i].space_label_id[1] : '')}</td>
          <td className="p-2">{getDefaultNoValue(assetData[i].space_value)}</td>
        </tr>,
      );
    }
    return tableTr;
  }

  return (
    <>
      <Row>
        <Col sm="12" md="12" lg="12" xs="12" className="p-3 comments-list thin-scrollbar">
          {(spaceLineValues && spaceLineValues.data) && (
          <div>
            <Table responsive className="mb-0 mt-2 font-weight-400 border-0 assets-table" width="100%">
              <thead>
                <tr>
                  <th className="p-2 min-width-100">
                    Label
                  </th>
                  <th className="p-2 min-width-100">
                    Value
                  </th>
                </tr>
              </thead>
              <tbody>
                {getRow(spaceLineValues && spaceLineValues.data ? spaceLineValues.data : [])}
              </tbody>
            </Table>
            <hr className="m-0" />
          </div>
          )}
          {spaceLineValues && spaceLineValues.loading && (
          <Loader />
          )}
          {(spaceLineValues && spaceLineValues.err) && (
          <ErrorContent errorTxt={generateErrorMessage(spaceLineValues)} />
          )}
        </Col>
      </Row>

    </>
  );
};

spaceLines.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  ids: PropTypes.array.isRequired,
};

export default spaceLines;
