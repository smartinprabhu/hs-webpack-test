/* eslint-disable import/no-unresolved */
import React, { useEffect } from 'react';
import {
  Col,
  Row,
  Table,
} from 'reactstrap';
import * as PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';

import ErrorContent from '@shared/errorContent';
import Loader from '@shared/loading';

import { getAuditActions } from '../auditService';
import {
  getDefaultNoValue, getCompanyTimezoneDate,
  extractNameObject, generateErrorMessage,
} from '../../util/appUtils';

const appModels = require('../../util/appModels').default;

const NonConformities = (props) => {
  const {
    detailData,
  } = props;

  const dispatch = useDispatch();

  const { userInfo } = useSelector((state) => state.user);

  const { auditActionDetails } = useSelector((state) => state.audit);

  useEffect(() => {
    if (detailData.id) {
      dispatch(getAuditActions(detailData.id, appModels.AUDITACTION, 'non_conformity'));
    }
  }, [detailData]);

  const loading = auditActionDetails && auditActionDetails.loading;
  const isErr = auditActionDetails && auditActionDetails.err;

  function getRow(assetData) {
    const tableTr = [];
    for (let i = 0; i < assetData.length; i += 1) {
      tableTr.push(
        <tr key={i}>
          <td className="p-2">{getDefaultNoValue(assetData[i].name)}</td>
          <td className="p-2">{getDefaultNoValue(extractNameObject(assetData[i].user_id, 'name'))}</td>
          <td className="p-2">{getDefaultNoValue(getCompanyTimezoneDate(assetData[i].date_deadline, userInfo, 'date'))}</td>
        </tr>,
      );
    }
    return tableTr;
  }

  return (
    <>
      <Row>
        <Col sm="12" md="12" lg="12" xs="12" className="p-3 bg-white comments-list thin-scrollbar">
          {(!loading && auditActionDetails && auditActionDetails.data && auditActionDetails.data.length > 0) && (
          <div>
            <Table responsive className="mb-0 mt-2 font-weight-400 border-0 assets-table" width="100%">
              <thead>
                <tr>
                  <th className="p-2 min-width-160">
                    Title
                  </th>
                  <th className="p-2 min-width-160">
                    Responsible
                  </th>
                  <th className="p-2 min-width-160">
                    Deadline
                  </th>
                </tr>
              </thead>
              <tbody>
                {getRow(auditActionDetails && auditActionDetails.data)}
              </tbody>
            </Table>
            <hr className="m-0" />
          </div>
          )}
          {loading && (
          <div className="loader" data-testid="loading-case">
            <Loader />
          </div>
          )}
          {isErr && (
          <ErrorContent errorTxt={generateErrorMessage(isErr)} />
          )}
          {!isErr && auditActionDetails && auditActionDetails.data && auditActionDetails.data.length === 0 && (
          <ErrorContent errorTxt="No Data Found" />
          )}
        </Col>
      </Row>

    </>
  );
};

NonConformities.propTypes = {
  detailData: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array,
    PropTypes.bool,
  ]).isRequired,
};

export default NonConformities;
