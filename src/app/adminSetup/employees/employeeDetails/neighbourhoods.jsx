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
import { getNeighbourhoods } from '../employeeService';
import { getDefaultNoValue, generateErrorMessage } from '../../../util/appUtils';

const appModels = require('../../../util/appModels').default;

const Neighbourhoods = () => {
  const dispatch = useDispatch();

  const { employeeDetails, employeeNeighbours } = useSelector((state) => state.setup);

  useEffect(() => {
    if (employeeDetails && employeeDetails.data) {
      const ids = employeeDetails.data.length > 0 ? employeeDetails.data[0].space_neighbour_ids : [];
      dispatch(getNeighbourhoods(ids, appModels.SPACE));
    }
  }, [employeeDetails]);

  function getRow(assetData) {
    const tableTr = [];
    for (let i = 0; i < assetData.length; i += 1) {
      tableTr.push(
        <tr key={i}>
          <td className="p-2 min-width-160 text-info font-weight-700">{getDefaultNoValue(assetData[i].path_name)}</td>
          <td className="p-2 min-width-160">{getDefaultNoValue(assetData[i].sequence_asset_hierarchy)}</td>
        </tr>,
      );
    }
    return tableTr;
  }

  return (
    <>
      <Row>
        <Col sm="12" md="12" lg="12" xs="12" className="p-3">
          {(employeeNeighbours && employeeNeighbours.data) && (
          <div>
            <Table responsive className="mb-0 mt-2 font-weight-400 border-0 assets-table" width="100%">
              <thead>
                <tr>
                  <th className="p-2">
                    Full Path Name
                  </th>
                  <th className="p-2 min-width-100">
                    Space Number
                  </th>
                </tr>
              </thead>
              <tbody>
                {getRow(employeeNeighbours && employeeNeighbours.data ? employeeNeighbours.data : [])}
              </tbody>
            </Table>
            <hr className="m-0" />
          </div>
          )}
          {employeeNeighbours && employeeNeighbours.loading && (
          <Loader />
          )}
          {(employeeNeighbours && employeeNeighbours.err) && (
          <ErrorContent errorTxt={generateErrorMessage(employeeNeighbours)} />
          )}
        </Col>
      </Row>

    </>
  );
};

export default Neighbourhoods;
