/* eslint-disable import/no-unresolved */
import React from 'react';
import {
  Col,
  Row,
  Table,
} from 'reactstrap';
import * as PropTypes from 'prop-types';
import { useSelector } from 'react-redux';

import ErrorContent from '@shared/errorContent';

import {
  getDefaultNoValue, getCompanyTimezoneDate,
  extractNameObject,
} from '../../util/appUtils';

const Nonconformities = (props) => {
  const {
    content,
  } = props;

  const { userInfo } = useSelector((state) => state.user);

  function getRow(assetData) {
    const tableTr = [];
    for (let i = 0; i < assetData.length; i += 1) {
      tableTr.push(
        <tr key={i}>
          <td className="p-2">{getDefaultNoValue(assetData[i].name)}</td>
          <td className="p-2">{getDefaultNoValue(getCompanyTimezoneDate(assetData[i].date, userInfo, 'date'))}</td>
          <td className="p-2">{getDefaultNoValue(getCompanyTimezoneDate(assetData[i].create_date, userInfo, 'date'))}</td>
          <td className="p-2">{getDefaultNoValue(assetData[i].reference)}</td>
          <td className="p-2">{getDefaultNoValue(extractNameObject(assetData[i].system_id, 'name'))}</td>
          <td className="p-2">{getDefaultNoValue(extractNameObject(assetData[i].company_id, 'name'))}</td>
        </tr>,
      );
    }
    return tableTr;
  }

  return (
    <Row>
      <Col sm="12" md="12" lg="12" xs="12" className="p-3 bg-white comments-list thin-scrollbar">
        {(content && content.length > 0) && (
          <div>
            <Table responsive className="mb-0 mt-2 font-weight-400 border-0 assets-table" width="100%">
              <thead>
                <tr>
                  <th className="p-2 min-width-160">
                    Name
                  </th>
                  <th className="p-2 min-width-160">
                    Date
                  </th>
                  <th className="p-2 min-width-160">
                    Created On
                  </th>
                  <th className="p-2 min-width-160">
                    Reference
                  </th>
                  <th className="p-2 min-width-160">
                    System
                  </th>
                  <th className="p-2 min-width-160">
                    Company
                  </th>
                </tr>
              </thead>
              <tbody>
                {getRow(content)}
              </tbody>
            </Table>
            <hr className="m-0" />
          </div>
        )}
        {!content.length && (
          <ErrorContent errorTxt="No Data Found" />
        )}
      </Col>
    </Row>
  );
};

Nonconformities.propTypes = {
  content: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.bool,
  ]).isRequired,
};

export default Nonconformities;
