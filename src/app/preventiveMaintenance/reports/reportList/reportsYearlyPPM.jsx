/* eslint-disable react/no-array-index-key */
/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable jsx-a11y/anchor-has-content */
/* eslint-disable no-plusplus */
/* eslint-disable no-param-reassign */
/* eslint-disable import/no-unresolved */
/* eslint-disable radix */
import React, { useMemo, useState, useEffect } from 'react';
import moment from 'moment-timezone';
import {
  Card, CardBody, Col, Row,
} from 'reactstrap';
import * as PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';

import ErrorContent from '@shared/errorContent';
import ErrorContentStatic from '@shared/errorContentStatic';
import Loader from '@shared/loading';
import {
  generateErrorMessage
  ,
} from '../../../util/appUtils';
import {
  getReportId, getTypeId, resetPPMYearlyExportLinkInfo,
} from '../../ppmService';
import { setInitialValues } from '../../../purchase/purchaseService';
import './sidebar/stickyTable.css';

const ReportsYearlyPPM = React.memo((props) => {
  const {
    afterReset, reportName, collapse, exportType, exportTrue, setExportType,
  } = props;
  const dispatch = useDispatch();

  const [downloadLoading, setLoading] = useState(false);

  const { userInfo, userRoles } = useSelector((state) => state.user);
  const {
    typeId,
    ppmYearlyExport,
    ppmYearlyReport,
    addPreventiveInfo,
  } = useSelector((state) => state.ppm);

  const redirectToAllReports = () => {
    dispatch(getReportId());
    dispatch(getTypeId());
    dispatch(resetPPMYearlyExportLinkInfo());
    if (afterReset) afterReset();
  };
  const isData = useMemo(() => (ppmYearlyExport && ppmYearlyExport.data && ppmYearlyExport.data.url ? ppmYearlyExport.data.url : false), [ppmYearlyExport]);

  const exportTableToExcel = (tableID, fileTitle = '') => {
    try {
      const dataType = 'application/vnd.ms-excel';
      const tableSelect = document.getElementById(tableID);
      const tableHTML = tableSelect.outerHTML;

      // Specify file name
      const fileName = fileTitle ? `${fileTitle}.xls` : 'excel_data.xls';

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
  };

  function documentDownloadLink(link, filename) {
    if (link) {
      setLoading(false);
      const element = document.createElement('a');
      element.setAttribute('href', link);
      element.setAttribute('download', filename);
      element.setAttribute('id', 'file');

      element.style.display = 'none';
      document.body.appendChild(element);

      element.click();
      // setSelectedDocId(false);
      document.body.removeChild(element);
    }
  }

  const fetchImage = async (path) => {
    const WEBAPPAPIURL = `${window.location.origin === 'http://localhost:3010' ? 'http://localhost:3000' : window.location.origin}/`;
    try {
      setLoading(true);
      const response = await axios.get(`${WEBAPPAPIURL}${path}`, {
        headers: {
          endpoint: window.localStorage.getItem('api-url'),
        },
        responseType: 'arraybuffer',
        withCredentials: true,
      });

      const blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const objectURL = URL.createObjectURL(blob);
      documentDownloadLink(objectURL, `${reportName}-${typeId && typeId.maintenanceYear && typeId.maintenanceYear.year}`);
    } catch (error) {
      setLoading(false);
      console.error('Error fetching image:', error);
    }
  };

  const downloadReport = (path) => {
    dispatch(setInitialValues(false, false, false, false));
    setExportType(false);
    fetchImage(path);
  };

  useEffect(() => {
    if (exportType === 'excel') {
      downloadReport(isData);
    }
  }, [exportTrue, exportType]);

  const loading = (userInfo && userInfo.loading) || (ppmYearlyExport && ppmYearlyExport.loading) || (ppmYearlyReport && ppmYearlyReport.loading) || (addPreventiveInfo && addPreventiveInfo.loading);

  let errorText = <div />;
  if ((!loading)
    && ((ppmYearlyExport && ppmYearlyExport.err) || (ppmYearlyExport && ppmYearlyExport.data && !ppmYearlyExport.data.length))) {
    errorText = '';
  } else if ((!loading) && typeId && typeId !== null && (typeId && !typeId.maintenanceYear)) {
    errorText = (
      <ErrorContentStatic errorTxt="PLEASE SELECT MAINTENANCE YEAR" />
    );
  }

  const apiUrl = window.localStorage.getItem('api-url');

  const officeViewerApiLink = 'https://view.officeapps.live.com/op/embed.aspx';

  return (
    <Card className={collapse ? 'filter-margin-right p-1 bg-lightblue h-100' : 'p-1 bg-lightblue h-100'}>
      <CardBody className="p-1 bg-color-white m-0">
        <Row className="p-2">
          <Col md="12" xs="12" sm="12" lg="12">
            <div className="content-inline">
              <span className="p-0 mr-2 font-medium font-family-tab">
                <span className="font-weight-500">
                  {reportName}
                  {' '}
                </span>
                {typeId && typeId.maintenanceYear && typeId.maintenanceYear.year && (
                  <span className={reportName ? 'ml-5 font-weight-800 font-size-13' : 'font-weight-800'}>
                    Maintenance Year :
                    {' '}
                    {typeId.maintenanceYear.year}
                  </span>
                )}
              </span>
            </div>
          </Col>
        </Row>
        {!loading && isData && (
        <iframe src={`${officeViewerApiLink}?src=${`${apiUrl}/${isData}`}`} width="100%" title={reportName} height="565px" frameBorder="0"> </iframe>
        )}
        <Col md="12" sm="12" lg="12" className="d-none" />
        {loading && (
        <div className="mb-3 mt-3 text-center">
          <Loader />
        </div>
        )}
        {!loading && (ppmYearlyExport && ppmYearlyExport.err) && (
        <ErrorContent errorTxt={generateErrorMessage(ppmYearlyExport)} />
        )}
        {!loading && (ppmYearlyExport && ppmYearlyExport.data && !isData) && (
        <ErrorContentStatic errorTxt="No Data Found" />
        )}
        {!loading && (addPreventiveInfo && addPreventiveInfo.data && !addPreventiveInfo.data.length) && (
        <ErrorContentStatic errorTxt="No Data Found" />
        )}
        {errorText}
      </CardBody>
    </Card>
  );
});

ReportsYearlyPPM.propTypes = {
  collapse: PropTypes.bool,
  afterReset: PropTypes.func.isRequired,
  reportName: PropTypes.string.isRequired,
};
ReportsYearlyPPM.defaultProps = {
  collapse: false,
};

export default ReportsYearlyPPM;
