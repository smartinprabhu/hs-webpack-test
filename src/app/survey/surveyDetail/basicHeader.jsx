/* eslint-disable new-cap */
/* eslint-disable import/no-unresolved */
import React, { useEffect, useState } from 'react';
import {
  Button,
  Col,
  Spinner,
} from 'reactstrap';
import { useSelector, useDispatch } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCopy, faFilePdf, faQrcode,
} from '@fortawesome/free-solid-svg-icons';
import { Tooltip, Drawer } from 'antd';
import * as PropTypes from 'prop-types';
import QRCode from 'qrcode.react';

import chartIcon from '@images/chart.svg';
import listIcon from '@images/list.svg';
import {
  savePdfContentData,
  copyToClipboard, getListOfModuleOperations, truncate,
} from '../../util/appUtils';

import {
  setActive,
} from '../surveyService';
import actionCodes from '../data/actionCodes.json';
import AnswerDetails from './answerDetails';
import {
  setInitialValues,
} from '../../purchase/purchaseService';

const appConfig = require('../../config/appConfig').default;

const WEBAPPAPIURL = `${window.location.origin}/`;

const BasicHeader = (props) => {
  const dispatch = useDispatch();
  const {
    afterReset, viewAnswers, detail, setViewModal,
  } = props;
  const [copySuccess, setCopySuccess] = useState(false);

  const [summaryModal, showSummaryModal] = useState(false);
  const [exportType, setExportType] = useState();
  const [pdfFileName, setPdfFileName] = useState();
  const { userRoles, userInfo } = useSelector((state) => state.user);
  const { surveyAnswerReport, surveyDetails } = useSelector((state) => state.survey);
  const [pdfLoader, setPDFLoader] = useState(false);

  const detailData = detail && (detail.data && detail.data.length > 0) ? detail.data[0] : '';
  const companyName = userInfo && userInfo.data ? userInfo.data.company.name : '';

  const allowedOperations = getListOfModuleOperations(userRoles && userRoles.data ? userRoles.data.allowed_modules : [], 'Survey', 'code');

  const isAnswers = allowedOperations.includes(actionCodes['View Answers']);

  const sizeValue = 400;

  const handleAnswerView = () => {
    if (afterReset) afterReset();
  };

  // const handleAnswerPrint = (htmlId, fileName) => {
  //   const div = document.getElementById(htmlId);
  //   // Create a window object.
  //   const win = window.open('', '_blank'); // Open the window. Its a popup window.
  //   document.title = fileName;
  //   win.document.write(div.outerHTML); // Write contents in the new window.
  //   win.document.close();
  //   /* setTimeout(() => {
  //     const r = win.confirm('Do you want to print this document ?');
  //     if (r === true) {
  //       win.print();
  //     }
  //   }, 1500); */
  //   win.print(); // Finally, print the contents.
  // };

  useEffect(() => {
    const questionsLength = surveyAnswerReport && surveyAnswerReport.data && surveyAnswerReport.data.survey_dict
    && surveyAnswerReport.data.survey_dict.page_ids.length && surveyAnswerReport.data.survey_dict.page_ids[0] && surveyAnswerReport.data.survey_dict.page_ids[0].question_ids && surveyAnswerReport.data.survey_dict.page_ids[0].question_ids.length;
    setTimeout(() => {
      setPDFLoader(false);
    }, questionsLength * 1000);
  }, [pdfLoader]);

  useEffect(() => {
    if (exportType === 'pdf') {
      const surveyTitle = surveyDetails && (surveyDetails.data && surveyDetails.data.length > 0) ? truncate(surveyDetails.data[0].title, 35) : 'Survey';
      savePdfContentData(`${surveyTitle}-Answer Summary Report `, 'Survey-Answers-Summary', 'answer-elements', 'tables', 'print-survey-report-pdf', surveyAnswerReport, companyName);
    }
    setExportType();
    setPDFLoader(false);
  }, [exportType]);

  const onReset = () => {
    dispatch(setActive('This month'));
  };

  const handleQrPrint = () => {
    setTimeout(() => {
      /* const content = document.getElementById('print_qr_survey_link');
      const pri = document.getElementById('print_qr_survey_link_frame').contentWindow;
      pri.document.open();
      pri.document.write(content.innerHTML); */

      const div = document.getElementById('print_qr_survey_link');
      // Create a window object.
      const win = window.open('', '_blank'); // Open the window. Its a popup window.
      document.title = 'QR Code';
      win.document.write(div.outerHTML); // Write contents in the new window.
      win.document.close();
      /* setTimeout(() => {
        const r = win.confirm('Do you want to print this document ?');
        if (r === true) {
          win.print();
        }
      }, 1500); */
      win.print();
      // pri.document.close();
      // pri.focus();
      // pri.print();
    }, 500);
  };

  const uuid = detailData.uuid ? detailData.uuid : false;
  const currentStatus = detailData && detailData.stage_id && detailData.stage_id.length > 0 ? detailData.stage_id[1] : false;

  function exportTableToExcel() {
    try {
      const dataType = 'application/vnd.ms-excel';
      const tableSelect = document.getElementById('print-survey-report-excel');
      const tableHTML = tableSelect.outerHTML;

      // Specify file name
      const fileName = 'Survey-Answers-Summary.xls';

      // Create download link element
      const downloadLink = document.createElement('a');

      document.body.appendChild(downloadLink);

      const blob = new Blob(['\ufeff', tableHTML], { type: dataType });

      if (window.navigator.msSaveOrOpenBlob) {
        window.navigator.msSaveBlob(blob, fileName);
      } else {
        const elem = window.document.createElement('a');
        elem.href = window.URL.createObjectURL(blob);
        elem.download = fileName;
        document.body.appendChild(elem);
        elem.click();
        document.body.removeChild(elem);
      }
    } catch (e) {
      // eslint-disable-next-line no-console
      console.log(e);
    }
  }

  function handlePdfDownload(detailData) {
    setPDFLoader(true);
    setExportType('pdf');
    setPdfFileName(detailData.title);
  }

  return (
    <>
      {detailData && (
        <>
          {viewAnswers && (currentStatus !== 'Draft') && detail && !detail.loading && (
            <>
              {surveyAnswerReport && surveyAnswerReport.data && (
              <Button
                color="secondary"
                onClick={() => { handlePdfDownload(detailData); }}
                size="sm"
                className="pb-05 pt-05 font-11 border-primary bg-white text-primary mb-1 mr-2"
              >
                <FontAwesomeIcon className="mr-2" color="primary" size="sm" icon={faFilePdf} />
                <span className="mr-2">PDF Download</span>
                {pdfLoader === true ? (
                  <Spinner size="sm" color="light" className="mr-2" />
                ) : ('')}
              </Button>
              )}
              {/* <Button
                color="secondary"
                onClick={() => exportTableToExcel()}
                size="sm"
                className="pb-05 pt-05 font-11 border-primary bg-white text-primary mb-1 mr-2"
              >
                <FontAwesomeIcon className="mr-2" color="primary" size="sm" icon={faFileExcel} />
                <span className="mr-2">Excel Download</span>
              </Button> */}
            </>
          )}
          {!viewAnswers && detail && !detail.loading && (
            <>
              {isAnswers && (currentStatus !== 'Draft') && (
                <>
                  <Button
                    color="secondary"
                    onClick={() => handleAnswerView()}
                    size="sm"
                    className="pb-05 pt-05 font-11 border-primary bg-white text-primary mb-1 mr-2"
                  >
                    <img src={chartIcon} className="cursor-pointer mr-1 pb-1" alt="close" aria-hidden="true" height={18} width={18} />
                    <span className="mr-2">Answers Summary</span>
                  </Button>
                  <Button
                    color="secondary"
                    onClick={() => { showSummaryModal(true); setViewModal(false); }}
                    size="sm"
                    className="pb-05 pt-05 font-11 border-primary bg-white text-primary mb-1 mr-2"
                  >
                    <img src={listIcon} className="cursor-pointer mr-1" alt="close" aria-hidden="true" height={15} width={15} />
                    <span className="mr-2">View Answers</span>
                  </Button>
                </>
              )}
              {(currentStatus !== 'Draft' && currentStatus !== 'Closed') && (
                <>
                  <Button
                    color="secondary"
                    onClick={() => handleQrPrint()}
                    size="sm"
                    className="pb-05 pt-05 font-11 border-primary bg-white text-primary mb-1 mr-2"
                  >
                    <FontAwesomeIcon className="mr-2" color="primary" size="sm" icon={faQrcode} />
                    <span className="mr-2">Print QR</span>
                  </Button>

                  <Tooltip placement="bottom" title={copySuccess ? 'Copied!' : 'Copy URL'}>
                    <Button
                      color="secondary"
                      size="sm"
                      onMouseLeave={() => setCopySuccess(false)}
                      onClick={() => { copyToClipboard(uuid, 'survey'); setCopySuccess(true); }}
                      className="pb-05 pt-05 font-11 border-primary bg-white text-primary mb-1 mr-2"
                    >
                      <FontAwesomeIcon className="mr-2" color="primary" size="sm" icon={faCopy} />
                      <span className="mr-2">Copy URL</span>
                    </Button>
                  </Tooltip>
                </>
              )}
            </>
          )}
          <Col md="12" sm="12" lg="12" className="d-none">
            <div id="print_qr_survey_link">
              <div style={{ textAlign: 'center' }}>
                <QRCode value={`${WEBAPPAPIURL}survey/${uuid}`} renderAs="svg" includeMargin level="H" size={sizeValue} />
                <p>
                  Link :
                  {' '}
                  {`${WEBAPPAPIURL}survey/${uuid}`}
                </p>
              </div>
            </div>
            <iframe name="print_qr_survey_link_frame" title="Export" id="print_qr_survey_link_frame" width="0" height="0" frameBorder="0" src="about:blank" />
          </Col>
        </>
      )}
      {summaryModal && (
      <Drawer
        title=""
        closable={false}
        width="90%"
        className="drawer-bg-lightblue-no-scroll"
        visible={summaryModal}
      >
        {/* <DrawerHeader
          title="Answers"
          imagePath={false}
          closeDrawer={() => { showSummaryModal(false); setViewModal(true); onReset(); }}
        /> */}
        {/* <span className="p-0 mr-2 font-weight-800 font-medium">
        Answers
      </span> */}
        <AnswerDetails afterReset={() => dispatch(setInitialValues(false, false, false, false))} closeDrawer={() => { showSummaryModal(false); setViewModal(true); }} />
      </Drawer>
      )}
    </>
  );
};

BasicHeader.propTypes = {
  afterReset: PropTypes.func.isRequired,
  setViewModal: PropTypes.func.isRequired,
  viewAnswers: PropTypes.bool.isRequired,
  detail: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array,
  ]).isRequired,
};

export default BasicHeader;
