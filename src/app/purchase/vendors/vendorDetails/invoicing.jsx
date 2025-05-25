/* eslint-disable import/no-unresolved */
import React, { useEffect } from 'react';
import {
  Col,
  Row,
  Card,
  CardBody,
  Table,
} from 'reactstrap';
import { useSelector, useDispatch } from 'react-redux';
import * as PropTypes from 'prop-types';

import Loader from '@shared/loading';
import ErrorContent from '@shared/errorContent';
import {
  getDefaultNoValue,
  generateErrorMessage,
} from '../../../util/appUtils';
import { getVendorBanks } from '../../purchaseService';

const appModels = require('../../../util/appModels').default;

const Invoicing = (props) => {
  const { ids } = props;
  const dispatch = useDispatch();

  const { vendorBanks, vendorDetails } = useSelector((state) => state.purchase);

  useEffect(() => {
    if (ids) {
      dispatch(getVendorBanks(ids, appModels.BANKS));
    }
  }, [ids]);

  function getRow(assetData) {
    const tableTr = [];
    for (let i = 0; i < assetData.length; i += 1) {
      tableTr.push(
        <tr key={i}>
          <td className="p-2">{getDefaultNoValue(assetData[i].bank_id ? assetData[i].bank_id[1] : '')}</td>
          <td className="p-2">{getDefaultNoValue(assetData[i].acc_number)}</td>
        </tr>,
      );
    }
    return tableTr;
  }

  return (
    <>
      {vendorDetails && (vendorDetails.data && vendorDetails.data.length > 0) && (
        <div>
          <Row className="mb-4 ml-1 mr-1 mt-3">
            <Col sm="12" md="12" xs="12" lg="12" className="mb-4">
              <h6 className="mb-3">Bank Accounts</h6>
              {(vendorBanks && vendorBanks.data) && (
              <div>
                <Table responsive className="mb-0 mt-2 font-weight-400 border-0 assets-table" width="100%">
                  <thead>
                    <tr>
                      <th className="p-2 min-width-100">
                        Bank
                      </th>
                      <th className="p-2 min-width-100">
                        Account Number
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {getRow(vendorBanks && vendorBanks.data ? vendorBanks.data : [])}
                  </tbody>
                </Table>
                <hr className="m-0" />
              </div>
              )}
              {vendorBanks && vendorBanks.loading && (
              <Loader />
              )}
              {(vendorBanks && vendorBanks.err) && (
              <ErrorContent errorTxt={generateErrorMessage(vendorBanks)} />
              )}
            </Col>
            <Col sm="12" md="12" xs="12" lg="12">
              <h6 className="mb-3">Accounting Entries</h6>
              <Row className="m-0">
                <span className="m-0 p-0 font-weight-400">Account Receivable</span>
              </Row>
              <Row className="m-0">
                <span className="m-0 p-0 font-weight-800">
                  {getDefaultNoValue(vendorDetails.data[0].property_account_receivable_id ? vendorDetails.data[0].property_account_receivable_id[1] : '')}
                </span>
              </Row>
              <hr className="mt-3" />
              <Row className="m-0">
                <span className="m-0 p-0 font-weight-400">Account Payable</span>
              </Row>
              <Row className="m-0">
                <span className="m-0 p-0 font-weight-800">{getDefaultNoValue(vendorDetails.data[0].property_account_payable_id ? vendorDetails.data[0].property_account_payable_id[1] : '')}</span>
              </Row>
              <hr className="mt-3" />
            </Col>
          </Row>
        </div>
      )}
      {vendorDetails && vendorDetails.loading && (
      <Card>
        <CardBody className="mt-4">
          <Loader />
        </CardBody>
      </Card>
      )}

      {(vendorDetails && vendorDetails.err) && (
        <Card>
          <CardBody>
            <ErrorContent errorTxt={generateErrorMessage(vendorDetails)} />
          </CardBody>
        </Card>
      )}
    </>
  );
};

Invoicing.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  ids: PropTypes.array.isRequired,
};

export default Invoicing;
