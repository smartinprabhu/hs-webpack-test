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
  generateErrorMessage,
} from '../../util/appUtils';

import PhotoRequired from './photoRequired';
import QrInfo from './qrInfo';
import NfcInfo from './nfcInfo';

const Options = () => {
  const { ppmDetail } = useSelector((state) => state.ppm);

  return (
    <>
      {ppmDetail && (ppmDetail.data && ppmDetail.data.length > 0) && (
        <div>
          <Row className="p-0 options-tabs">
            <Col sm="12" md="4" xs="12" lg="4" className="mb-2 pb-1 pr-04">
              <Card className="h-100">
                <p className="ml-3 mb-1 mt-2 font-weight-600 text-pale-sky font-size-13">PHOTO REQUIRED</p>
                <hr className="mb-0 mt-0 mr-2 ml-2" />
                <CardBody className="p-0">
                  <div className="mt-1 pl-3">
                    <PhotoRequired detailData={ppmDetail} />
                  </div>
                </CardBody>
              </Card>
            </Col>

            <Col sm="12" md="4" xs="12" lg="4" className="mb-2 pb-1 pr-04">
              <Card className="h-100">
                <p className="ml-3 mb-1 mt-2 font-weight-600 text-pale-sky font-size-13">QR</p>
                <hr className="mb-0 mt-0 mr-2 ml-2" />
                <CardBody className="p-0">
                  <div className="mt-1 pl-3">
                    <QrInfo detailData={ppmDetail} />
                  </div>
                </CardBody>
              </Card>
            </Col>
            <Col sm="12" md="4" xs="12" lg="4" className="mb-2 pb-1 pr-04">
              <Card className="h-100">
                <p className="ml-3 mb-1 mt-2 font-weight-600 text-pale-sky font-size-13">NFC</p>
                <hr className="mb-0 mt-0 mr-2 ml-2" />
                <CardBody className="p-0">
                  <div className="mt-1 pl-3">
                    <NfcInfo detailData={ppmDetail} />
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>

          {/*  <Row className="mb-4 ml-1 mr-1 mt-3">
            <Col
              sm="12"
              md="12"
              xs="12"
              lg={ppmDetail.data[0].recurrency
                ? '6' : '12'}
            >
              <Row className="m-0">
                <span className="m-0 p-0 font-weight-400">Recurrent</span>
              </Row>
              <Row className="m-0">
                <span className="m-0 p-0 mt-2 font-weight-800 font-tiny text-capital">{ppmDetail.data[0].recurrency ? 'Yes' : 'No'}</span>
              </Row>
              <hr className="mt-2" />
            </Col>
            {ppmDetail.data[0].recurrency
              ? (
                <Col sm="12" md="12" xs="12" lg="6">
                  <Row className="m-0">
                    <span className="m-0 p-0 font-weight-400">Repeat Every</span>
                  </Row>
                  <Row className="m-0">

                    <span className="m-0 p-0 mt-2 font-weight-800 font-tiny">
                      {getDefaultNoValue(ppmDetail.data[0].interval ? ppmDetail.data[0].interval : '')}
                      {getDefaultNoValue(getRuleTypeLabel(ppmDetail.data[0].rrule_type ? ppmDetail.data[0].rrule_type : ''))}
                    </span>
                  </Row>
                  <hr className="mt-2" />
                </Col>
              ) : ''}
            {(ppmDetail.data[0].rrule_type && ppmDetail.data[0].rrule_type === 'weekly') && (
              <Col sm="12" md="12" xs="12" lg="6">
                <Row className="m-0">
                  <span className="m-0 p-0 font-weight-400">Day</span>
                </Row>
                <Row className="m-0">
                  <span className="m-0 p-0 mt-2 font-weight-800 font-tiny">
                    {getSelectedDays(ppmDetail.data[0].mo, ppmDetail.data[0].tu, ppmDetail.data[0].we,
                      ppmDetail.data[0].th, ppmDetail.data[0].fr, ppmDetail.data[0].sa, ppmDetail.data[0].su).length > 0
                      ? getSelectedDays(
                        ppmDetail.data[0].mo, ppmDetail.data[0].tu, ppmDetail.data[0].we, ppmDetail.data[0].th, ppmDetail.data[0].fr, ppmDetail.data[0].sa, ppmDetail.data[0].su,
                      )
                      : 'Not Assigned'}
                  </span>
                </Row>
                <hr className="mt-2" />
              </Col>
            )}
            {(ppmDetail.data[0].rrule_type && ppmDetail.data[0].rrule_type === 'monthly') && (
              <>
                <Col sm="12" md="12" xs="12" lg="6">
                  <Row className="m-0">
                    <span className="m-0 p-0 font-weight-400">Month By</span>
                  </Row>
                  <Row className="m-0">
                    <span className="m-0 p-0 mt-2 font-weight-800 font-tiny">
                      {getDefaultNoValue(ppmDetail.data[0].month_by ? getMonthRuleTextLabel(ppmDetail.data[0].month_by) : '')}
                    </span>
                  </Row>
                  <hr className="mt-2" />
                </Col>
                {(ppmDetail.data[0].month_by && ppmDetail.data[0].month_by === 'date') && (
                  <Col sm="12" md="12" xs="12" lg="6">
                    <Row className="m-0">
                      <span className="m-0 p-0 font-weight-400">Date of Month</span>
                    </Row>
                    <Row className="m-0">
                      <span className="m-0 p-0 mt-2 font-weight-800 font-tiny">
                        {getDefaultNoValue(ppmDetail.data[0].day ? ppmDetail.data[0].day : '')}
                      </span>
                    </Row>
                    <hr className="mt-2" />
                  </Col>
                )}
                {(ppmDetail.data[0].month_by && ppmDetail.data[0].month_by === 'day') && (
                  <Col sm="12" md="12" xs="12" lg="6">
                    <Row className="m-0">
                      <span className="m-0 p-0 font-weight-400">Day of Month</span>
                    </Row>
                    <Row className="m-0">
                      <span className="m-0 p-0 mt-2 font-weight-800 font-tiny">
                        {getDefaultNoValue(ppmDetail.data[0].byday ? getDayRuleTextLabel(ppmDetail.data[0].byday) : '')}
                      </span>
                      {(ppmDetail.data[0].month_by && ppmDetail.data[0].byday) && (
                      <span className="ml-3 mt-2 font-weight-800 font-tiny">
                        {getDefaultNoValue(ppmDetail.data[0].week_list ? getWeekListsTextLabel(ppmDetail.data[0].week_list) : '')}
                      </span>
                      )}
                    </Row>
                    <hr className="mt-2" />
                  </Col>
                )}
              </>
            )}
            <Col sm="12" md="12" xs="12" lg="12">
              <h6>Photo Required</h6>
            </Col>
            <Col sm="12" md="12" xs="12" lg="6">
              <Row className="m-0">
                <span className="m-0 p-0 font-weight-400">At Start</span>
              </Row>
              <Row className="m-0">
                <span className="m-0 mt-2 font-weight-800 font-tiny">
                  {ppmDetail.data[0].at_start_mro ? 'Yes' : 'No'}
                </span>
              </Row>
              <hr className="mt-2" />
              <Row className="m-0">
                <span className="m-0 p-0 font-weight-400">At Review</span>
              </Row>
              <Row className="m-0">
                <span className="m-0 mt-2 font-weight-800 font-tiny">
                  {ppmDetail.data[0].at_review_mro ? 'Yes' : 'No'}
                </span>
              </Row>
              <hr className="mt-2" />
            </Col>
            <Col sm="12" md="12" xs="12" lg="6">
              <Row className="m-0">
                <span className="m-0 p-0 font-weight-400">At Done</span>
              </Row>
              <Row className="m-0">
                <span className="m-0 mt-2 font-weight-800 font-tiny">
                  {ppmDetail.data[0].at_done_mro ? 'Yes' : 'No'}
                </span>
              </Row>
              <hr className="mt-2" />
              <Row className="m-0">
                <span className="m-0 p-0 font-weight-400">Enforce Time</span>
              </Row>
              <Row className="m-0">
                <span className="m-0 mt-2 font-weight-800 font-tiny">
                  {ppmDetail.data[0].enforce_time ? 'Yes' : 'No'}
                </span>
              </Row>
              <hr className="mt-2" />
            </Col>
            <Col sm="12" md="12" xs="12" lg="6">
              <h6>QR</h6>
              <Row className="m-0">
                <span className="m-0 p-0 font-weight-400">QR Scan At Start</span>
              </Row>
              <Row className="m-0">
                <span className="m-0 mt-2 font-weight-800 font-tiny">
                  {ppmDetail.data[0].qr_scan_at_start ? 'Yes' : 'No'}
                </span>
              </Row>
              <hr className="mt-2" />
              <Row className="m-0">
                <span className="m-0 p-0 font-weight-400">QR Scan At Done</span>
              </Row>
              <Row className="m-0">
                <span className="m-0 mt-2 font-weight-800 font-tiny">
                  {ppmDetail.data[0].qr_scan_at_done ? 'Yes' : 'No'}
                </span>
              </Row>
              <hr className="mt-2" />
            </Col>
            <Col sm="12" md="12" xs="12" lg="6">
              <h6>NFC</h6>
              <Row className="m-0">
                <span className="m-0 p-0 font-weight-400">NFC Scan At Start</span>
              </Row>
              <Row className="m-0">
                <span className="m-0 mt-2 font-weight-800 font-tiny">
                  {ppmDetail.data[0].nfc_scan_at_start ? 'Yes' : 'No'}
                </span>
              </Row>
              <hr className="mt-2" />
              <Row className="m-0">
                <span className="m-0 p-0 font-weight-400">NFC Scan At Done</span>
              </Row>
              <Row className="m-0">
                <span className="m-0 mt-2 font-weight-800 font-tiny">
                  {ppmDetail.data[0].nfc_scan_at_done ? 'Yes' : 'No'}
                </span>
              </Row>
              <hr className="mt-2" />
            </Col>
          </Row> */}
        </div>
      )}
      {ppmDetail.loading && (
        <Card>
          <CardBody className="mt-4">
            <Loader />
          </CardBody>
        </Card>
      )}

      {(ppmDetail && ppmDetail.err) && (
        <Card>
          <CardBody>
            <ErrorContent errorTxt={generateErrorMessage(ppmDetail)} />
          </CardBody>
        </Card>
      )}
    </>
  );
};
export default Options;
