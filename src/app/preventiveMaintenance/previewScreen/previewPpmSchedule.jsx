import React from 'react';
import { useFormikContext } from 'formik';
import { Row, Col } from 'reactstrap';
import moment from 'moment';
import PropTypes from 'prop-types';

import {
  getDefaultNoValue, getArrayToCommaValues,
} from '../../util/appUtils';
import { getSelectedDays, getSelectedPhoto } from '../utils/utils';

const PreviewPpmSchedule = (props) => {
  const { type } = props;
  const { values: formValues } = useFormikContext();

  const isInspection = !!(type && type === 'Inspection');

  let QRScanValues = '';
  let nfcValues = '';

  if (formValues.qr_scan_at_start) {
    QRScanValues = 'QR Scan At Start';
  }
  if (formValues.qr_scan_at_done) {
    if (QRScanValues) {
      QRScanValues = `${QRScanValues},QR Scan At Done`;
    } else {
      QRScanValues = `${QRScanValues} QR Scan At Done`;
    }
  }

  if (formValues.nfc_scan_at_start) {
    nfcValues = 'NFC Scan At Start';
  }
  if (formValues.nfc_scan_at_done) {
    if (nfcValues) {
      nfcValues = `${nfcValues},NFC Scan At Done`;
    } else {
      nfcValues = `${nfcValues} NFC Scan At Done`;
    }
  }

  return (
    <>
      <span className="d-inline-block pb-1 mb-2 font-weight-bold">{isInspection ? 'Inspection Information' : 'PPM Information'}</span>
      <Row className="mb-3">
        <Col xs={12} sm={6} md={6} lg={6}>
          <Row className="m-0">
            <span className="text-label-blue m-1">Title</span>
          </Row>
          <Row className="m-0">
            <span className="m-1 font-weight-500">{getDefaultNoValue(formValues.name)}</span>
          </Row>
          <hr className="m-1" />
          <Row className="m-0">
            <span className="text-label-blue m-1">{isInspection ? 'Inspection For' : 'PPM For'}</span>
          </Row>
          <Row className="m-0">
            <span className="m-1 font-weight-500">{getDefaultNoValue(formValues.category_type ? formValues.category_type.label : '')}</span>
          </Row>
          <hr className="m-1" />
          {formValues.category_type.value === 'ah'
            ? (
              <>
                <Row className="m-0">
                  <span className="text-label-blue m-1">Asset Category</span>
                </Row>
                <Row className="m-0">
                  <span className="m-1 font-weight-500">{getDefaultNoValue(formValues.asset_category_id ? formValues.asset_category_id.name : '')}</span>
                </Row>
                <hr className="m-1" />
              </>
            )
            : (
              <>
                <Row className="m-0">
                  <span className="text-label-blue m-1">Equipment Category</span>
                </Row>
                <Row className="m-0">
                  <span className="m-1 font-weight-500">{getDefaultNoValue(formValues.category_id && formValues.category_id.path_name ? formValues.category_id.path_name : '')}</span>
                </Row>
                <hr className="m-1" />
              </>
            )}

          <Row className="m-0">
            <span className="text-label-blue m-1">Scheduled period</span>
          </Row>
          <Row className="m-0">
            <span className="m-1 font-weight-500">{getDefaultNoValue(formValues.time_period ? formValues.time_period.label : '')}</span>
          </Row>
          <hr className="m-1" />

          <Row className="m-0">
            <span className="text-label-blue m-1">{isInspection ? 'Inspection By' : 'PPM By'}</span>
          </Row>
          <Row className="m-0">
            <span className="m-1 font-weight-500">{getDefaultNoValue(formValues.ppm_by ? formValues.ppm_by.label : '')}</span>
          </Row>
          <hr className="m-1" />
        </Col>
        <Col xs={12} sm={6} md={6} lg={6}>
          <Row className="m-0">
            <span className="text-label-blue m-1">Maintenance Team</span>
          </Row>
          <Row className="m-0">
            <span className="m-1 font-weight-500">{getDefaultNoValue(formValues.maintenance_team_id ? formValues.maintenance_team_id.name : '')}</span>
          </Row>
          <hr className="m-1" />
          <Row className="m-0">
            <span className="text-label-blue m-1">Maintenance Operations</span>
          </Row>
          <Row className="m-0">
            <span className="m-1 font-weight-500">{getDefaultNoValue(formValues.task_id ? formValues.task_id.name : '')}</span>
          </Row>
          <hr className="m-1" />

          <Row className="m-0">
            <span className="text-label-blue m-1">Priority</span>
          </Row>
          <Row className="m-0">
            <span className="m-1 font-weight-500">{getDefaultNoValue(formValues.priority ? formValues.priority.label : '')}</span>
          </Row>
          <hr className="m-1" />

          <Row className="m-0">
            <span className="text-label-blue m-1">Type</span>
          </Row>
          <Row className="m-0">
            <span className="m-1 font-weight-500">{getDefaultNoValue(formValues.is_all_records ? formValues.is_all_records : '')}</span>
          </Row>
          <hr className="m-1" />
          <Row className="m-0">
            <span className="text-label-blue m-1">Scheduler Operation Type</span>
          </Row>
          <Row className="m-0">
            <span className="m-1 text-capital">{getDefaultNoValue(formValues.scheduler_operation_type ? formValues.scheduler_operation_type.label : '')}</span>
          </Row>
          <hr className="m-1" />
          <Row className="m-0">
            <span className="text-label-blue m-1">SLA Score Type</span>
          </Row>
          <Row className="m-0">
            <span className="m-1 text-capital">{getDefaultNoValue(formValues.sla_score_type ? formValues.sla_score_type.label : '')}</span>
          </Row>
          <hr className="m-1" />
        </Col>
      </Row>
      <span className="d-inline-block pb-1 mb-2 font-weight-bold">{isInspection ? 'Inspection Details' : 'PPM Details'}</span>
      <Row className="mb-3">
        <Col xs={12} sm={6} md={6} lg={6}>
          <Row className="m-0">
            <span className="text-label-blue m-1">Starting at</span>
          </Row>
          <Row className="m-0">
            <span className="m-1 font-weight-500">{moment(formValues.start_datetime).format('YYYY-MM-DD HH:mm:ss')}</span>
          </Row>
          <hr className="m-1" />
          <Row className="m-0">
            <span className="text-label-blue m-1">End at</span>
          </Row>
          <Row className="m-0">
            <span className="m-1 font-weight-500">{moment(formValues.stop_datetime).format('YYYY-MM-DD HH:mm:ss')}</span>
          </Row>
          <hr className="m-1" />
        </Col>
        <Col xs={12} sm={6} md={6} lg={6}>
          <Row className="m-0">
            <span className="text-label-blue m-1">Duration (Hours)</span>
          </Row>
          <Row className="m-0">
            <span className="m-1 font-weight-500">{getDefaultNoValue(formValues.duration ? formValues.duration : '')}</span>
          </Row>
          <hr className="m-1" />
          <Row className="m-0">
            <span className="text-label-blue m-1">Is Hourly?</span>
          </Row>
          <Row className="m-0">
            <span className="m-1 font-weight-500">{getDefaultNoValue(formValues.is_hourly ? 'Yes' : 'No')}</span>
          </Row>
          <hr className="m-1" />
          {formValues.is_hourly && (
            <>
              <Row className="m-0">
                <span className="text-label-blue m-1">Hourly Configuration</span>
              </Row>
              <Row className="m-0">
                <span className="m-1 font-weight-500">
                  {getDefaultNoValue(formValues.is_hourly && formValues.hours_ids ? getArrayToCommaValues(formValues.hours_ids, 'name') : '')}
                </span>
              </Row>
              <hr className="m-1" />
            </>
          )}
        </Col>
      </Row>
      <span className="d-inline-block pb-1 mb-2 font-weight-bold">{isInspection ? 'Inspection Options' : 'PPM Options'}</span>
      <Row className="mb-3">
        <Col xs={12} sm={6} md={6} lg={6}>
          <Row className="m-0">
            <span className="text-label-blue m-1 m-1">Recurrent</span>
          </Row>
          <Row className="m-0">
            <span className="m-1">{getDefaultNoValue(formValues.recurrency ? 'Yes' : 'No')}</span>
          </Row>
          <hr className="m-1" />
          <Row className="m-0">
            <span className="text-label-blue m-1 m-1">Photo Required</span>
          </Row>
          <Row className="m-0">
            <span className="m-1">
              {getSelectedPhoto(formValues.at_start_mro, formValues.at_done_mro, formValues.at_review_mro).length > 0
                ? getSelectedPhoto(formValues.at_start_mro, formValues.at_done_mro, formValues.at_review_mro) : 'Not Assigned'}
            </span>
          </Row>
          <hr className="m-1" />
          <Row className="m-0">
            <span className="text-label-blue m-1 m-1">Enforce Time</span>
          </Row>
          <Row className="m-0">
            <span className="m-1">{getDefaultNoValue(formValues.enforce_time ? 'Yes' : 'No')}</span>
          </Row>
          <hr className="m-1" />
        </Col>
        <Col xs={12} sm={6} md={6} lg={6}>
          {formValues.recurrency && (
          <>
            <Row className="m-0">
              <span className="text-label-blue m-1 m-1">Repeat Everyday</span>
            </Row>
            <Row className="m-0">
              <span className="m-1">{getDefaultNoValue(formValues.interval ? formValues.interval : '')}</span>
            </Row>
            <hr className="m-1" />
            <Row className="m-0">
              <span className="text-label-blue m-1 m-1">Recurrent Type</span>
            </Row>
            <Row className="m-0">
              <span className="m-1 text-capital">{getDefaultNoValue(formValues.rrule_type ? formValues.rrule_type.value : '')}</span>
            </Row>
            <hr className="m-1" />
            {(formValues.rrule_type && formValues.rrule_type.value === 'weekly') && (
            <>
              <Row className="m-0">

                <span className="text-label-blue m-1 m-1">Day</span>
              </Row>
              <Row className="m-0">

                <span className="m-1">
                  {getSelectedDays(formValues.mo, formValues.tu, formValues.we, formValues.th, formValues.fr, formValues.sa, formValues.su).length > 0
                    ? getSelectedDays(formValues.mo, formValues.tu, formValues.we, formValues.th, formValues.fr, formValues.sa, formValues.su) : 'Not Assigned'}
                </span>
              </Row>
              <hr className="m-1" />
            </>
            )}
            {(formValues.rrule_type && formValues.rrule_type.value === 'monthly') && (
            <>
              <Row className="m-0">

                <span className="text-label-blue m-1 m-1">Month By</span>
              </Row>
              <Row className="m-0">

                <span className="m-1 text-capital">{getDefaultNoValue(formValues.month_by ? formValues.month_by.value : '')}</span>
              </Row>
              <hr className="m-1" />

              {(formValues.month_by && formValues.month_by.value === 'date') && (
              <>
                <Row className="m-0">

                  <span className="text-label-blue m-1 m-1">Date of Month</span>
                </Row>
                <Row className="m-0">

                  <span className="m-1">{getDefaultNoValue(formValues.day ? formValues.day : '')}</span>
                </Row>
                <hr className="m-1" />
              </>
              )}
              {(formValues.month_by && formValues.month_by.value === 'day') && (
              <>
                <Row className="m-0">

                  <span className="text-label-blue m-1 m-1">Day of Month</span>
                </Row>
                <Row className="m-0">

                  <span className="m-1">{getDefaultNoValue(formValues.byday ? formValues.byday.label : '')}</span>
                </Row>
                <hr className="m-1" />
                <Row className="m-0">
                  <span className="m-1">{getDefaultNoValue(formValues.week_list ? formValues.week_list.label : '')}</span>
                </Row>
                <hr className="m-1" />
              </>
              )}
            </>
            )}
          </>
          )}
          <Row className="m-0">
            <span className="text-label-blue m-1 m-1">QR Scan</span>
          </Row>
          <Row className="m-0">
            <span className="m-1">
              {formValues.qr_scan_at_start || formValues.qr_scan_at_done ? QRScanValues : 'Not Assigned'}
            </span>
          </Row>
          <hr className="m-1" />
          <Row className="m-0">
            <span className="text-label-blue m-1 m-1">NFC</span>
          </Row>
          <Row className="m-0">
            <span className="m-1">
              {formValues.nfc_scan_at_start || formValues.nfc_scan_at_done ? nfcValues : 'Not Assigned'}
            </span>
          </Row>
          <hr className="m-1" />
        </Col>
      </Row>
    </>
  );
};

PreviewPpmSchedule.propTypes = {
  type: PropTypes.oneOfType([PropTypes.func, PropTypes.string]),
};

PreviewPpmSchedule.defaultProps = {
  type: false,
};

export default PreviewPpmSchedule;
