import React from 'react';
import { useFormikContext } from 'formik';
import { Row, Col } from 'reactstrap';
import moment from 'moment';

import {
  getDefaultNoValue,
} from '../../util/appUtils';
import { getSelectedPhoto } from '../../preventiveMaintenance/utils/utils';

const PreviewInspectionSchedule = () => {
  const { values: formValues } = useFormikContext();

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
      <Row className="mb-3 ml-0 pl-0">
        <Col xs={12} sm={6} md={6} lg={6}>
          <Row className="m-0 ml-0 pl-0">
            <span className="text-label-blue m-1">Group</span>
          </Row>
          <Row className="m-0 ml-0 pl-0">
            <span className="m-1 font-weight-500">{getDefaultNoValue(formValues.group_id ? formValues.group_id.name : '')}</span>
          </Row>
          <hr className="m-1" />
        </Col>
      </Row>
      <Row className="mb-3 ml-0 pl-0">
        <Col xs={12} sm={6} md={6} lg={6}>
          <span className="d-inline-block pb-1 mb-2 font-weight-bold">Asset info</span>
          <Row className="m-0">
            <span className="text-label-blue m-1">Type</span>
          </Row>
          <Row className="m-0">
            <span className="m-1 font-weight-500">{getDefaultNoValue(formValues.category_type ? formValues.category_type.label : '')}</span>
          </Row>
          <hr className="m-1" />
          {formValues.category_type.value === 'Space'
            ? (
              <>
                <Row className="m-0">
                  <span className="text-label-blue m-1">Space</span>
                </Row>
                <Row className="m-0">
                  <span className="m-1 font-weight-500">{getDefaultNoValue(formValues.space_id ? formValues.space_id.path_name : '')}</span>
                </Row>
                <hr className="m-1" />
              </>
            )
            : (
              <>
                <Row className="m-0">
                  <span className="text-label-blue m-1">Equipment</span>
                </Row>
                <Row className="m-0">
                  <span className="m-1 font-weight-500">{getDefaultNoValue(formValues.equipment_id && formValues.equipment_id.name ? formValues.equipment_id.name : '')}</span>
                </Row>
                <hr className="m-1" />
              </>
            )}
        </Col>
        <Col xs={12} sm={6} md={6} lg={6}>
          <span className="d-inline-block pb-1 mb-2 font-weight-bold">Maintenance Info</span>
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
            <span className="text-label-blue m-1">Checklist</span>
          </Row>
          <Row className="m-0">
            <span className="m-1 font-weight-500">{getDefaultNoValue(formValues.check_list_id ? formValues.check_list_id.name : '')}</span>
          </Row>
          <hr className="m-1" />
          <Row className="m-0">
            <span className="text-label-blue m-1">Start At (Hours)</span>
          </Row>
          <Row className="m-0">
            <span className="m-1 font-weight-500">{getDefaultNoValue(formValues.starts_at ? formValues.starts_at : '')}</span>
          </Row>
          <hr className="m-1" />
          <Row className="m-0">
            <span className="text-label-blue m-1">Duration (Hours)</span>
          </Row>
          <Row className="m-0">
            <span className="m-1 font-weight-500">{getDefaultNoValue(formValues.duration ? formValues.duration : '')}</span>
          </Row>
          <hr className="m-1" />
          <Row className="m-0">
            <span className="text-label-blue m-1">Exclude Holidays?</span>
          </Row>
          <Row className="m-0">
            <span className="m-1 font-weight-500">{getDefaultNoValue(formValues.is_exclude_holidays ? 'Yes' : 'No')}</span>
          </Row>
          <hr className="m-1" />
        </Col>
      </Row>
      <Row className="mb-3 ml-0 pl-0">
        <Col xs={12} sm={6} md={6} lg={6}>
          <span className="d-inline-block pb-1 mb-2 font-weight-bold">Schedule Info</span>
          <Row className="m-0">
            <span className="text-label-blue m-1">Priority</span>
          </Row>
          <Row className="m-0">
            <span className="m-1 font-weight-500">{getDefaultNoValue(formValues.priority ? formValues.priority.label : '')}</span>
          </Row>
          <hr className="m-1" />
          <Row className="m-0">
            <span className="text-label-blue m-1">Commences On</span>
          </Row>
          <Row className="m-0">
            <span className="m-1 font-weight-500">{moment(formValues.commences_on).format('YYYY-MM-DD HH:mm:ss')}</span>
          </Row>
          <hr className="m-1" />
          <Row className="m-0">
            <span className="text-label-blue m-1">End On</span>
          </Row>
          <Row className="m-0">
            <span className="m-1 font-weight-500">{moment(formValues.ends_on).format('YYYY-MM-DD HH:mm:ss')}</span>
          </Row>
          <hr className="m-1" />
        </Col>
        <Col xs={12} sm={6} md={6} lg={6}>
          <Row className="m-0">
            <span className="text-label-blue m-1">Description</span>
          </Row>
          <Row className="m-0">
            <span className="m-1 font-weight-500">{getDefaultNoValue(formValues.description ? formValues.description : '')}</span>
          </Row>
          <hr className="m-1" />
        </Col>
        <Col xs={12} sm={6} md={6} lg={6}>
          <span className="d-inline-block pb-1 mb-2 font-weight-bold">Notifications</span>
          <Row className="m-0">
            <span className="text-label-blue m-1">Remind Before (Hours)</span>
          </Row>
          <Row className="m-0">
            <span className="m-1 font-weight-500">{getDefaultNoValue(formValues.remind_before ? formValues.remind_before : '')}</span>
          </Row>
          <hr className="m-1" />
          <Row className="m-0">
            <span className="text-label-blue m-1">Missed Alert?</span>
          </Row>
          <Row className="m-0">
            <span className="m-1 font-weight-500">{getDefaultNoValue(formValues.is_missed_alert ? 'Yes' : 'No')}</span>
          </Row>
          <hr className="m-1" />
          <Row className="m-0">
            <span className="text-label-blue m-1">Recipients</span>
          </Row>
          <Row className="m-0">
            <span className="m-1 font-weight-500">{getDefaultNoValue(formValues.check_list_id ? formValues.check_list_id.name : '')}</span>
          </Row>
          <hr className="m-1" />
        </Col>
      </Row>
      <span className="d-inline-block pb-1 mb-2 font-weight-bold">Inspection Options</span>
      <Row className="mb-3 ml-0 pl-0">
        <Col xs={12} sm={6} md={6} lg={6}>
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
          <Row className="m-0">
            <span className="text-label-blue m-1 m-1">Allow Future?</span>
          </Row>
          <Row className="m-0">
            <span className="m-1">{getDefaultNoValue(formValues.is_allow_future ? 'Yes' : 'No')}</span>
          </Row>
          <hr className="m-1" />
          <Row className="m-0">
            <span className="text-label-blue m-1 m-1">Allow Past?</span>
          </Row>
          <Row className="m-0">
            <span className="m-1">{getDefaultNoValue(formValues.is_allow_past ? 'Yes' : 'No')}</span>
          </Row>
          <hr className="m-1" />
        </Col>
        <Col xs={12} sm={6} md={6} lg={6}>
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

export default PreviewInspectionSchedule;
