/* eslint-disable import/no-unresolved */
import React from 'react';
import {
  Col,
  Row,
  Table,
} from 'reactstrap';
import * as PropTypes from 'prop-types';

import ErrorContent from '@shared/errorContent';
import {
  getDefaultNoValue,
} from '../../../util/appUtils';

const Logs = React.memo((props) => {
  const { detailData } = props;

  function getRow(logData) {
    const tableTr = [];
    for (let i = 0; i < logData.length; i += 1) {
      tableTr.push(
        <tr key={i}>
          <td className="p-2 pl-0 w-50">{getDefaultNoValue(logData[i].name)}</td>
          <td className="p-2 w-50">{getDefaultNoValue(logData[i].mobile)}</td>
          <td className="p-2 w-50">{getDefaultNoValue(logData[i].age)}</td>
        </tr>,
      );
    }
    return tableTr;
  }

  return (
    <Row className="m-0">
      <Col sm="12" md="12" lg="12" xs="12">
        {detailData && (
          <div className="comments-list thin-scrollbar">
            <Table className="mb-0 font-weight-400 assets-table" width="100%">
              <thead>
                <tr>
                  <th className="p-2 pl-0 min-width-100">
                    Name
                  </th>
                  <th className="p-2 min-width-100">
                    Mobile
                  </th>
                  <th className="p-2 min-width-100">
                    Age
                  </th>
                </tr>
              </thead>
              <tbody>
                {getRow(detailData && detailData.work_technician_ids ? detailData.work_technician_ids : [])}
              </tbody>
            </Table>
            <hr className="m-0" />
          </div>
        )}
        {(detailData && detailData.work_technician_ids && detailData.work_technician_ids.length === 0) && (
          <ErrorContent errorTxt="No Data Found" />
        )}
        {/* {(!ids && detailData && !detailData.err) && (
            <ErrorContent errorTxt="" />
         )} */}
      </Col>
    </Row>
  );
});

Logs.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  ids: PropTypes.array.isRequired,
  detailData: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array,
    PropTypes.bool,
  ]).isRequired,
};

export default Logs;
