/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable jsx-a11y/anchor-has-content */
/* eslint-disable no-plusplus */
/* eslint-disable no-param-reassign */
/* eslint-disable import/no-unresolved */
/* eslint-disable radix */
import React, { useState, useEffect } from 'react';
import {
  Button, Card, CardBody, Col, Row, Table,
  Modal,
  ModalBody, ModalFooter, Spinner,
} from 'reactstrap';
import * as PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';

import ModalHeaderComponent from '@shared/modalHeaderComponent';
import ErrorContent from '@shared/errorContent';
import Loader from '@shared/loading';
import { generateErrorMessage, getDefaultNoValue, extractTextObject } from '../../../util/appUtils';
import { getPrintReport, resetPurchaseState, resetPrint } from '../../../purchase/purchaseService';

import {
  getReportId, getTypeId, resetDetailChecklistReport, resetChecklistReport, resetCreateChecklistReport,
} from '../../ppmService';

const appModels = require('../../../util/appModels').default;

const reportChecklist = (props) => {
  const {
    afterReset, reportName, collapse,
  } = props;
  const dispatch = useDispatch();

  const { userInfo } = useSelector((state) => state.user);
  const {
    checkListReportList, checkListReportDetail, selectedReportDate, typeId, addChecklistReport,
  } = useSelector((state) => state.ppm);
  const {
    printReportInfo, stateChangeInfo,
  } = useSelector((state) => state.purchase);
  const [modalAlert, setModalAlert] = useState(false);
  const [checklistIndex, setChecklistIndex] = useState('');

  const toggleAlert = () => {
    setModalAlert(false);
  };

  useEffect(() => {
    if (printReportInfo && printReportInfo.data) {
      const pdfBase64 = printReportInfo.data.content;
      const dlnk = document.getElementById('dwnldLnkEmail');
      dlnk.href = `data:application/octet-stream;base64,${pdfBase64}`;
      dlnk.click();
      setChecklistIndex('');
      dispatch(resetPrint());
    }
  }, [printReportInfo]);

  const redirectToAllReports = () => {
    dispatch(getReportId());
    dispatch(getTypeId());
    setChecklistIndex('');
    dispatch(resetCreateChecklistReport());
    dispatch(resetPurchaseState());
    dispatch(resetDetailChecklistReport());
    dispatch(resetChecklistReport());
    dispatch(resetPrint());
    if (afterReset) afterReset();
  };

  const downloadReport = (id, parentId, dailyCount) => {
    setModalAlert(false);
    dispatch(resetPrint());
    const viewId = parentId && parentId.length && parentId.length > 0 ? parentId[0] : false;
    if (dailyCount > 0) {
      if (id) {
        if (typeId && typeId !== null && typeId.preventiveFor === 'e') {
          const options = { context: { active_model: appModels.CHECKLISTREPORTLIST, active_id: id, active_ids: [id] } };
          dispatch(getPrintReport(viewId, appModels.CHECKLISTPRINTEQUIPMENT, options));
        } else {
          const options = { context: { active_model: appModels.CHECKLISTREPORTSPACELIST, active_id: id, active_ids: [id] } };
          dispatch(getPrintReport(viewId, appModels.CHECKLISTPRINTSPACE, options));
        }
      }
    } else {
      setModalAlert(true);
    }
  };

  const loading = (userInfo && userInfo.loading)
    || (addChecklistReport && addChecklistReport.loading)
    || (stateChangeInfo && stateChangeInfo.loading)
    || (checkListReportDetail && checkListReportDetail.loading)
    || (checkListReportList && checkListReportList.loading);
  const userErrorMsg = generateErrorMessage(userInfo);
  const errorMsg = (checkListReportList && checkListReportList.err) ? generateErrorMessage(checkListReportList) : userErrorMsg;

  let errorText = <div />;
  if (!loading
    && ((addChecklistReport && addChecklistReport.err) || (checkListReportDetail && checkListReportDetail.err) || (checkListReportList && checkListReportList.err))) {
    errorText = '';
  } else if (!loading && typeId && typeId.selectedDate && typeId.selectedDate === '%(custom)s' && ((typeId.date && !typeId.date.length) || typeId.date === null)) {
    errorText = (
      <ErrorContent errorTxt="START DATE AND END DATE IS REQUIRED" />
    );
  } else if (!loading && typeId && typeId.preventiveFor && typeId.preventiveFor === 'ah' && (typeId.locationId && typeId.locationId.length <= 0)) {
    errorText = (
      <ErrorContent errorTxt="Space is required" />
    );
  } else if (!loading && typeId && typeId.preventiveFor && typeId.preventiveFor === 'e' && (typeId.equipmentId && typeId.equipmentId.length <= 0)) {
    errorText = (
      <ErrorContent errorTxt="Equipment is required" />
    );
  }

  return (
    <>
      <a id="dwnldLnkEmail" aria-hidden="true" download="Inspection Checklist Report.pdf" className="d-none" />
      <Card className={collapse ? 'filter-margin-right side-filters-list p-1 bg-lightblue h-100' : 'side-filters-list p-1 bg-lightblue h-100'}>
        <CardBody className="p-1 bg-color-white m-0">
          <Row className="p-2">
            <Col md="9" xs="12" sm="12" lg="12">
              <div className="content-inline">
                <span className="p-0 mr-2 font-medium">
                  <>
                    <span onClick={() => redirectToAllReports()} aria-hidden="true" className="cursor-pointer font-weight-800">
                      All Reports
                      {' '}
                      /
                      {' '}
                    </span>
                    <span className="font-weight-500">
                      {reportName}
                      {' '}
                    </span>
                    <span className={reportName ? 'ml-5 font-weight-800 font-size-13' : 'font-weight-800'}>
                      Report Date :
                      {' '}
                      {selectedReportDate}
                    </span>
                  </>
                </span>
              </div>
            </Col>
          </Row>
          {(checkListReportList && checkListReportList.data) && (
            <div>
              <Table responsive>
                <thead className="bg-gray-light">
                  <tr>
                    <th className="min-width-160">
                      {typeId && typeId !== null && typeId.preventiveFor === 'e'
                        ? (
                          <span aria-hidden="true" className="cursor-pointer">
                            Equipment
                          </span>
                        )
                        : (
                          <span aria-hidden="true" className="cursor-pointer">
                            Space
                          </span>
                        )}
                    </th>
                    <th className="min-width-160">
                      <span aria-hidden="true" className="cursor-pointer">
                        Daily
                      </span>
                    </th>
                    <th className="min-width-100">
                      <span>
                        Action
                      </span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {checkListReportList.data.map((ppm, index) => (
                    <tr key={ppm.id}>
                      {typeId && typeId !== null && typeId.preventiveFor === 'e'
                        ? <td><span className="font-weight-400">{getDefaultNoValue(extractTextObject(ppm.equipment_id))}</span></td>
                        : <td><span className="font-weight-400">{getDefaultNoValue(extractTextObject(ppm.space_id))}</span></td>}
                      <td><span className="font-weight-400">{ppm.daily}</span></td>
                      <td>
                        <span className="font-weight-400 cursor-pointer text-info" onClick={() => { setChecklistIndex(index); downloadReport(ppm.id, ppm.check_list, ppm.daily); }} aria-hidden="true">
                          View/Download
                          {(printReportInfo && printReportInfo.loading && checklistIndex === index) ? (
                            <Spinner animation="border" size="sm" className="text-primary ml-3" variant="secondary" />
                          ) : ''}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          )}
          {loading && (
            <div className="mb-3 mt-3 text-center">
              <Loader />
            </div>
          )}
          {(addChecklistReport && addChecklistReport.err) && (
            <ErrorContent errorTxt={generateErrorMessage(addChecklistReport)} />
          )}
          {(checkListReportDetail && checkListReportDetail.err) && (
            <ErrorContent errorTxt={generateErrorMessage(checkListReportDetail)} />
          )}
          {(checkListReportList && checkListReportList.err) && (
            <ErrorContent errorTxt={errorMsg} />
          )}
          {errorText}
        </CardBody>
      </Card>
      <Modal isOpen={modalAlert} toggle={toggleAlert} size="sm">
        <ModalHeaderComponent size="sm" title="Alert" closeModalWindow={toggleAlert} />
        <hr className="m-0" />
        <ModalBody>
          No data found.
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={() => { setModalAlert(false); }}>Ok</Button>
        </ModalFooter>
      </Modal>
    </>
  );
};

reportChecklist.propTypes = {
  collapse: PropTypes.bool,
};
reportChecklist.defaultProps = {
  collapse: false,
};

export default reportChecklist;
