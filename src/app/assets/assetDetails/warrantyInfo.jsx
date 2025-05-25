/* eslint-disable import/no-unresolved */
import React from 'react';
import {
  Col,
  Row,
  Card,
  CardBody,
} from 'reactstrap';
import { useSelector } from 'react-redux';

import Loader from '@shared/loading';
import ErrorContent from '@shared/errorContent';
import {
  getDefaultNoValue, getCompanyTimezoneDate, getDifferenceInDays,
  generateErrorMessage,
} from '../../util/appUtils';
import { getAMCText, getTagText } from '../utils/utils';

const WarrantyInfo = () => {
  const { equipmentsDetails } = useSelector((state) => state.equipment);
  const { userInfo } = useSelector((state) => state.user);

  return (
    <>
      {equipmentsDetails && (equipmentsDetails.data && equipmentsDetails.data.length > 0) && (
        <div>
          <Row className="mb-4 ml-1 mr-1 mt-3">
            <Col sm="12" md="12" xs="12" lg="6">
              <Row className="m-0">
                <span className="m-0 p-0 font-weight-400">Manufacturer</span>
              </Row>
              <Row className="m-0">
                <span className="m-0 p-0 font-weight-800 text-capital">{getDefaultNoValue(equipmentsDetails.data[0].manufacturer_id ? equipmentsDetails.data[0].manufacturer_id[1] : '')}</span>
              </Row>
              <hr className="mt-3" />
              <Row className="m-0">
                <span className="m-0 p-0 font-weight-400">Warranty Start date</span>
              </Row>
              <Row className="m-0">
                <span className="m-0 p-0 font-weight-800 text-capital">{getDefaultNoValue(getCompanyTimezoneDate(equipmentsDetails.data[0].warranty_start_date, userInfo, 'date'))}</span>
              </Row>
              <hr className="mt-3" />
              <Row className="m-0">
                <span className="m-0 p-0 font-weight-400">AMC Type</span>
              </Row>
              <Row className="m-0">
                <span className="m-0 p-0 font-weight-800 text-capital">{getDefaultNoValue(getAMCText(equipmentsDetails.data[0].amc_type))}</span>
              </Row>
              <hr className="mt-3" />
              <Row className="m-0">
                <span className="m-0 p-0 font-weight-400">Period (Days)</span>
              </Row>
              <Row className="m-0">
                <span className="m-0 p-0 font-weight-800 text-capital">{getDefaultNoValue(getDifferenceInDays(equipmentsDetails.data[0].warranty_end_date))}</span>
              </Row>
              <hr className="mt-3" />
              <Row className="m-0">
                <span className="m-0 p-0 font-weight-400">Purchase date</span>
              </Row>
              <Row className="m-0">
                <span className="m-0 p-0 font-weight-800 text-capital">{getDefaultNoValue(getCompanyTimezoneDate(equipmentsDetails.data[0].purchase_date, userInfo, 'date'))}</span>
              </Row>
              <hr className="mt-3" />
              <Row className="m-0">
                <span className="m-0 p-0 font-weight-400">Reference Number</span>
              </Row>
              <Row className="m-0">
                <span className="m-0 p-0 font-weight-800 text-capital">{getDefaultNoValue(equipmentsDetails.data[0].asset_id)}</span>
              </Row>
              <hr className="mt-3" />
              <Row className="m-0">
                <span className="m-0 p-0 font-weight-400">Validated On</span>
              </Row>
              <Row className="m-0">
                <span className="m-0 p-0 font-weight-800 text-capital">{getDefaultNoValue(getCompanyTimezoneDate(equipmentsDetails.data[0].validated_on, userInfo, 'datetime'))}</span>
              </Row>
              <hr className="mt-3" />
              <Row className="m-0">
                <span className="m-0 p-0 font-weight-400">AMC Start Date</span>
              </Row>
              <Row className="m-0">
                <span className="m-0 p-0 font-weight-800">
                  {getDefaultNoValue(getCompanyTimezoneDate(equipmentsDetails.data[0].amc_start_date ? equipmentsDetails.data[0].amc_start_date : '', userInfo, 'date'))}
                </span>
              </Row>
              <hr className="mt-3" />
              <Row className="m-0">
                <span className="m-0 p-0 font-weight-400">Comment</span>
              </Row>
              <Row className="m-0">
                <span className="m-0 p-0 font-weight-800 text-capital">{getDefaultNoValue(equipmentsDetails.data[0].comment)}</span>
              </Row>
              <hr className="mt-3" />
            </Col>
            <Col sm="12" md="12" xs="12" lg="6">
              <Row className="m-0">
                <span className="m-0 p-0 font-weight-400">Vendor</span>
              </Row>
              <Row className="m-0">
                <span className="m-0 p-0 font-weight-800">{getDefaultNoValue(equipmentsDetails.data[0].vendor_id ? equipmentsDetails.data[0].vendor_id[1] : '')}</span>
              </Row>
              <hr className="mt-3" />
              <Row className="m-0">
                <span className="m-0 p-0 font-weight-400">Warranty End date</span>
              </Row>
              <Row className="m-0">
                <span className="m-0 p-0 font-weight-800 text-capital">{getDefaultNoValue(getCompanyTimezoneDate(equipmentsDetails.data[0].warranty_end_date, userInfo, 'date'))}</span>
              </Row>
              <hr className="mt-3" />
              <Row className="m-0">
                <span className="m-0 p-0 font-weight-400">Customer</span>
              </Row>
              <Row className="m-0">
                <span className="m-0 p-0 font-weight-800 text-capital">
                  {getDefaultNoValue(equipmentsDetails.data[0].customer_id[1])}
                </span>
              </Row>
              <hr className="mt-3" />
              <Row className="m-0">
                <span className="m-0 p-0 font-weight-400">Purchase Value</span>
              </Row>
              <Row className="m-0">
                <span className="m-0 p-0 font-weight-800">{equipmentsDetails.data[0].purchase_value ? `${equipmentsDetails.data[0].purchase_value}.00` : '0.00'}</span>
              </Row>
              <hr className="mt-3" />
              <Row className="m-0">
                <span className="m-0 p-0 font-weight-400">Validation Status</span>
              </Row>
              <Row className="m-0">
                <span className="m-0 p-0 font-weight-800 text-capital">{getDefaultNoValue(equipmentsDetails.data[0].validation_status)}</span>
              </Row>
              <hr className="mt-3" />
              <Row className="m-0">
                <span className="m-0 p-0 font-weight-400">Validated By</span>
              </Row>
              <Row className="m-0">
                <span className="m-0 p-0 font-weight-800">{getDefaultNoValue(equipmentsDetails.data[0].validated_by ? equipmentsDetails.data[0].validated_by[1] : '')}</span>
              </Row>
              <hr className="mt-3" />
              <Row className="m-0">
                <span className="m-0 p-0 font-weight-400">Tag Status</span>
              </Row>
              <Row className="m-0">
                <span className="m-0 p-0 font-weight-800 text-capital">{getDefaultNoValue(getTagText(equipmentsDetails.data[0].tag_status))}</span>
              </Row>
              <hr className="mt-3" />
              <Row className="m-0">
                <span className="m-0 p-0 font-weight-400">AMC End Date</span>
              </Row>
              <Row className="m-0">
                <span className="m-0 p-0 font-weight-800">
                  {getDefaultNoValue(getCompanyTimezoneDate(equipmentsDetails.data[0].amc_end_date ? equipmentsDetails.data[0].amc_end_date : '', userInfo, 'date'))}
                </span>
              </Row>
              <hr className="mt-3" />
            </Col>
          </Row>
        </div>
      )}
      {equipmentsDetails.loading && (
      <Card>
        <CardBody className="mt-4">
          <Loader />
        </CardBody>
      </Card>
      )}

      {(equipmentsDetails && equipmentsDetails.err) && (
        <Card>
          <CardBody>
            <ErrorContent errorTxt={generateErrorMessage(equipmentsDetails)} />
          </CardBody>
        </Card>
      )}
    </>
  );
};
export default WarrantyInfo;
