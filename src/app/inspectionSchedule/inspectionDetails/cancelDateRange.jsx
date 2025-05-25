/* eslint-disable no-loop-func */
/* eslint-disable import/no-unresolved */
/* eslint-disable react/no-danger */
import * as PropTypes from 'prop-types';
import React from 'react';
import { useSelector } from 'react-redux';
import {
  Col,
  Row,
  Table,
} from 'reactstrap';
import ErrorContent from '@shared/errorContent';
import {
  getCompanyTimezoneDate,
  getDefaultNoValue
} from '../../util/appUtils';

const cancelDateRange = React.memo((props) => {
  const {
    detailData,
  } = props;
  const { userInfo } = useSelector((state) => state.user);

  function getCancelDateRange(assetData) {
    const tableTr = [];
    for (let i = 0; i < assetData.length; i += 1) {
      tableTr.push(
        <tr key={i}>
          <td className="p-2 w-15">
            <span className="word-break-content">
              {getDefaultNoValue(getCompanyTimezoneDate(assetData[i].from_date, userInfo, 'date'))}
            </span>
          </td>
          <td className="p-2 w-15">
            <span className="word-break-content">
              {getDefaultNoValue(getCompanyTimezoneDate(assetData[i].to_date, userInfo, 'date'))}
            </span>
          </td>
          <td className="p-2 w-15">
            <span className="word-break-content">
              {getDefaultNoValue(assetData[i].reason)}
            </span>
          </td>
        </tr>,
      );
    }
    return tableTr;
  }

  return (
    <Row className="asset-history-tab">
      <Col sm="12" md="12" lg="12" xs="12" className="p-3 bg-white comments-list thin-scrollbar">
        {(detailData && detailData.length && detailData.length > 0)
          ? (
            <div>
              <Table responsive className="mb-0 mt-2 font-weight-400 border-0 assets-table" width="100%">
                <thead className="bg-gray-light">
                  <tr>
                    <th className="p-2 w-15">
                      From Date
                    </th>
                    <th className="p-2 W-15">
                      To Date
                    </th>
                    <th className="p-2 W-15">
                      Reason
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {getCancelDateRange(detailData || [])}
                </tbody>
              </Table>
              <hr className="m-0" />
            </div>
          ) : ''}
             {detailData && detailData.length === 0  && (
                    <ErrorContent errorTxt="No Data Found." />
                    )}
      </Col>
    </Row>
  );
});

cancelDateRange.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  detailData: PropTypes.array.isRequired,
};

export default cancelDateRange;
