/* eslint-disable import/no-unresolved */
import InfoIcon from '@mui/icons-material/Info';
import {
  Tooltip,
} from '@mui/material';
import * as PropTypes from 'prop-types';
import React from 'react';
import {
  Card,
  CardBody,
} from 'reactstrap';

import ErrorContent from '@shared/errorContent';
import Loader from '@shared/loading';
import { getDefinitonByLabel } from '../../../../assets/utils/utils';
import {
  extractTextObject,
  generateErrorMessage,
  getDefaultNoValue,
} from '../../../../util/appUtils';

import DetailViewLeftPanel from '../../../../commonComponents/detailViewLeftPanel';
import Products from './products';

const TranferBasicDetails = (props) => {
  const {
    isEdit, detail, transferCode,
  } = props;

  const detailData = detail && (detail.data && detail.data.length > 0) ? detail.data[0] : '';

  function getItemData(type) {
    let res = detailData.asset_id;
    if (type === 'Location') {
      res = detailData.space_id;
    } else if (type === 'Employee') {
      res = detailData.employee_id;
    } else if (type === 'Department') {
      res = detailData.department_id;
    }
    return res;
  }

  const infoValue = (fieldname, fieldValue) => {
    if (fieldname) {
      return (
        <div>
          {fieldname}
          <span className="info">
            <Tooltip title={getDefinitonByLabel(fieldValue)} placement="right">
              <span className="ml-2">
                <InfoIcon color="info" sx={{ fontSize: 15 }} />
              </span>
            </Tooltip>
          </span>
        </div>
      );
    }
    return '';
  };

  return (
    <>
      {transferCode === 'internal'
        ? (
          <DetailViewLeftPanel
            panelData={[
              {
                header: 'GENERAL INFORMATION',
                leftSideData:
                [
                  {
                    property: infoValue('From Location', 'location_id'),
                    value: getDefaultNoValue(extractTextObject(detailData.location_id)),
                  },

                  {
                    property: 'Use In',
                    value: getDefaultNoValue(detailData.use_in),
                  },

                  {
                    property: 'Description',
                    value: getDefaultNoValue(detailData.note),
                  },

                ],
                rightSideData:
                [
                  {
                    property: infoValue('To Location', 'location_dest_id'),
                    value: getDefaultNoValue(extractTextObject(detailData.location_dest_id)),
                  },
                  {
                    property: getDefaultNoValue(detailData.use_in),
                    value: getDefaultNoValue(extractTextObject(getItemData(detailData.use_in), 'name')),
                  },
                  (detailData.cancel_comment) && (
                    {
                      property: 'Reason For Rejection',
                      value: getDefaultNoValue(detailData.cancel_comment),
                    }),
                ],
              },
              {
                header: 'PRODUCTS',
                leftSideData:
              [
                {
                  property: infoValue('Product Category', 'product_categ_id'),
                  value: getDefaultNoValue(extractTextObject(detailData.product_categ_id)),
                },
              ],
              },

            ]}
          />
        )
        : (
          <DetailViewLeftPanel
            panelData={[
              {
                header: 'GENERAL INFORMATION',
                leftSideData:
                [
                  {
                    property: infoValue('From Location', 'location_id'),
                    value: getDefaultNoValue(extractTextObject(detailData.location_id)),
                  },

                  {
                    property: 'DC#',
                    value: getDefaultNoValue(detailData.dc_no),
                  },

                  {
                    property: 'Description',
                    value: getDefaultNoValue(detailData.note),
                  },

                ],
                rightSideData:
                [
                  {
                    property: infoValue('To Location', 'location_dest_id'),
                    value: getDefaultNoValue(extractTextObject(detailData.location_dest_id)),
                  },
                  {
                    property: 'PO#',
                    value: getDefaultNoValue(detailData.po_no),
                  },
                  (detailData.cancel_comment) && (
                    {
                      property: 'Reason For Rejection',
                      value: getDefaultNoValue(detailData.cancel_comment),
                    }),
                ],
              },
              {
                header: 'PRODUCTS',
                leftSideData:
              [
                {
                  property: infoValue('Product Category', 'product_categ_id'),
                  value: getDefaultNoValue(extractTextObject(detailData.product_categ_id)),
                },
              ],
              },

            ]}
          />
        )}

      <Products isEdit={isEdit} />
      {/* detail && (
        <div>
          <Row className="p-0">
           <Col sm="12" md="4" xs="12" lg="4" className="mb-2 pb-1 pr-04">
              <Card className="h-100 transfer-overview-tabs">
                <p className="ml-3 mb-1 mt-2 font-weight-600 text-pale-sky font-size-13">GENERAL INFORMATION</p>
                <hr className="mb-0 mt-0 mr-2 ml-2" />
                <CardBody className="p-0">
                  <div className="mt-1 pl-3">
                    <GeneralInfo detail={detail} />
                  </div>
                </CardBody>
              </Card>
            </Col>
            <Col sm="12" md="8" xs="12" lg="8" className="mb-2 pb-1 pl-04">
              <Card className="h-100 transfer-overview-tabs">
                <p className="ml-3 mb-1 mt-2 font-weight-600 text-pale-sky font-size-13">PRODUCTS</p>
                <hr className="mb-0 mt-0 mr-2 ml-2" />
                <CardBody className="p-0">
                  <div className="mt-1 pl-3 pr-3">
                    <Products />
                  </div>
                </CardBody>
                </Card>
            </Col>
           <Col sm="12" md="4" xs="12" lg="4" className="mb-2 pb-1 pr-04">
              <Card className="h-100 transfer-overview-tabs">
                <p className="ml-3 mb-1 mt-2 font-weight-600 text-pale-sky font-size-13">ADDITIONAL INFORMATION</p>
                <hr className="mb-0 mt-0 mr-2 ml-2" />
                <CardBody className="p-0">
                  <div className="mt-1 pl-3">
                    <AdditionalInfo detail={detail} />
                  </div>
                </CardBody>
              </Card>
            </Col>
            <Col sm="12" md="4" xs="12" lg="4" className="mb-2 pb-1 pl-04 pr-04">
              <Card className="h-100">
                <p className="ml-3 mb-1 mt-2 font-weight-600 text-pale-sky font-size-13">PURCHASE INFORMATION</p>
                <hr className="mb-0 mt-0 mr-2 ml-2" />
                <CardBody className="p-0">
                  <div className="mt-1 pl-3">
                    <PurchaseInfo detailData={equipmentData} />
                  </div>
                </CardBody>
              </Card>
            </Col>
            <Col sm="12" md="4" xs="12" lg="4" className="mb-2 pb-1 pl-04">
              <Card className="h-100">
                <p className="ml-3 mb-1 mt-2 font-weight-600 text-pale-sky font-size-13">WARRANTY INFORMATION</p>
                <hr className="mb-0 mt-0 mr-2 ml-2" />
                <CardBody className="p-0">
                  <div className="mt-1 pl-3">
                    <WarrantyInfo detailData={equipmentData} />
                  </div>
                </CardBody>
              </Card>
      </Col>
          </Row>
        </div>
      ) */}
      {detail && detail.loading && (
        <Card>
          <CardBody className="mt-4">
            <Loader />
          </CardBody>
        </Card>
      )}

      {(detail && detail.err) && (
        <Card>
          <CardBody>
            <ErrorContent errorTxt={generateErrorMessage(detail)} />
          </CardBody>
        </Card>
      )}
    </>
  );
};

TranferBasicDetails.propTypes = {
  detail: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array,
    PropTypes.bool,
  ]).isRequired,
};

export default TranferBasicDetails;
