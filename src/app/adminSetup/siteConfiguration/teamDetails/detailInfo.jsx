/* eslint-disable import/no-unresolved */
import React from 'react';
import {
  Card,
  CardBody,
  Col,
  Row,
} from 'reactstrap';
import * as PropTypes from 'prop-types';

import DetailViewFormat from '@shared/detailViewFormat';
import {
  getDefaultNoValue,
  numToFloat,
  extractTextObject,
} from '../../../util/appUtils';

const DetailInfo = (props) => {
  const {
    detail,
  } = props;

  const detailData = detail && (detail.data && detail.data.length > 0) ? detail.data[0] : '';

  return (
    <Col>
      {detailData && (

      <Row className="p-0 TicketsSegments-cards">
        <Col sm="12" md="4" xs="12" lg="4" className="mb-2 pb-1 pr-04 pl-0">
          <Card className="h-100">
            <p className="ml-3 mb-1 mt-2 font-weight-600 text-pale-sky font-size-13">GENERAL INFORMATION</p>
            <hr className="mb-0 mt-0 mr-2 ml-2" />
            <CardBody className="p-0">
              <div className="mt-1 pl-3">
                <Row className="ml-1 mr-1 mt-3">
                  <Col sm="12" md="12" xs="12" lg="12" className="pl-0">
                    <Row className="m-0">
                      <span
                        className="m-0 p-0 light-text"
                        aria-hidden
                      >
                        Maintenance Costs Analytic Account
                      </span>
                    </Row>
                    <Row className="m-0">
                      <span className="m-0 p-0 font-weight-700 text-capital">{getDefaultNoValue(extractTextObject(detailData.maintenance_cost_analytic_account_id))}</span>
                    </Row>
                    <p className="mt-2" />
                    <Row className="m-0">
                      <span
                        className="m-0 p-0 light-text"
                        aria-hidden
                      >
                        Working Time
                      </span>
                    </Row>
                    <Row className="m-0">
                      <span className="m-0 p-0 font-weight-700 text-capital">{getDefaultNoValue(extractTextObject(detailData.resource_calendar_id))}</span>
                    </Row>
                    <p className="mt-2" />
                    <Row className="m-0">
                      <span
                        className="m-0 p-0 light-text"
                        aria-hidden
                      >
                        Hourly Labour Cost
                      </span>
                    </Row>
                    <Row className="m-0">
                      <span className="m-0 p-0 font-weight-700 text-capital">{numToFloat(detailData.labour_cost_unit)}</span>
                    </Row>
                    <p className="mt-2" />
                    <Row className="m-0">
                      <span
                        className="m-0 p-0 light-text"
                        aria-hidden
                      >
                        Responsible
                      </span>
                    </Row>
                    <Row className="m-0">
                      <span className="m-0 p-0 font-weight-700 text-capital">{getDefaultNoValue(extractTextObject(detailData.responsible_id))}</span>
                    </Row>
                    <p className="mt-2" />
                    {/* <Row className="m-0 pb-2">
                      <span
                        aria-hidden="true"
                        id="switchAction"
                        className="pl-0 cursor-pointer"
                      >
                        <img
                          className="mr-2"
                          src={documentsIcon}
                          alt="documents"
                        />
                        Documents
                      </span>
                      <span className="ml-2 text-warning">
                        {detailData.doc_count}
                      </span>
                      <span
                        aria-hidden="true"
                        id="switchAction"
                        className="pl-3 cursor-pointer"
                      >
                        <img
                          className="mr-2"
                          src={equipmentsIcon}
                          alt="equipments"
                        />
                        Equipments
                      </span>
                      <span className="ml-2 text-warning">
                        {detailData.mroequi_count}
                      </span>
                    </Row> */}
                  </Col>
                </Row>
              </div>
            </CardBody>
          </Card>
        </Col>
      </Row>
      )}
      <DetailViewFormat detailResponse={detail} />
    </Col>
  );
};

DetailInfo.propTypes = {
  detail: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array,
  ]).isRequired,
};
export default DetailInfo;
