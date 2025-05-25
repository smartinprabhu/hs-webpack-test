/* eslint-disable no-underscore-dangle */
/* eslint-disable react/no-array-index-key */
/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable jsx-a11y/anchor-has-content */
/* eslint-disable no-plusplus */
/* eslint-disable no-param-reassign */
/* eslint-disable import/no-unresolved */
/* eslint-disable radix */
import React, { useState, useEffect } from 'react';
import {
  Card, CardBody
  ,
} from 'reactstrap';
import axios from 'axios';
import * as PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import map from 'lodash/map';
import pick from 'lodash/pick';
import uniqBy from 'lodash/lodash';

import ErrorContent from '@shared/errorContent';
import Loader from '@shared/loading';
import AuthService from '../../util/authService';

import {
  generateErrorMessage,
  getColumnArrayById,
  getCompanyTimezoneDate,
  getDefaultNoValue,
  savePdfContentBlob,
  savePdfContent,
} from '../../util/appUtils';
import {
  resetCteateExport, resetExportLink,
} from '../attendanceService';
import { setInitialValues } from '../../purchase/purchaseService';
// import DataExport from './dataExport/dataExportConsumption';

const useStyles = makeStyles((theme) => ({
  root: {
    '& > *': {
      marginTop: theme.spacing(2),
    },
  },
}));

const ReportDownload = React.memo((props) => {
  const {
    afterReset, reportName, collapse, empDates, employees, setEmpdates, setEmployees, selectedDate, setSelectedDate, setGlobalVendor, globalType, globalVendor, setGlobalType, exportTrue, exportType,
  } = props;
  const dispatch = useDispatch();
  const {
    createExportInfo,
    exportLinkInfo,
  } = useSelector((state) => state.attendance);

  const { userInfo } = useSelector((state) => state.user);

  const { filterInitailValues } = useSelector((state) => state.purchase);

  const [pdfHeader, setPdfHeader] = useState([]);
  const [finishDownload, setFinishDownload] = useState(false);
  const [downloadLoading, setLoading] = useState(false);
  const [pdfBody, setPdfBody] = useState([]);
  const [pdfBlob, setPdfBlob] = useState(false);
  const companyName = userInfo && userInfo.data ? userInfo.data.company.name : '';
  const dateFilter = empDates && empDates.length > 1 ? `Date From: ${getCompanyTimezoneDate(empDates[0], userInfo, 'date')} - To: ${getCompanyTimezoneDate(empDates[1], userInfo, 'date')} , ` : '';
  const empFilter = employees && employees.length > 1 ? `Employess: ${getColumnArrayById(employees, 'name')}` : '';
  const appliedFilters = dateFilter + empFilter;

  const redirectToAllReports = () => {
    dispatch(resetCteateExport());
    dispatch(resetExportLink());
    setSelectedDate('');
    setGlobalVendor('');
    setGlobalType('');
    setEmpdates('');
    setEmployees('');
    dispatch(setInitialValues(false, false, false, false));
    if (afterReset) afterReset();
  };

  const excelData = exportLinkInfo && exportLinkInfo.data && exportLinkInfo.data.data && exportLinkInfo.data.data.data && exportLinkInfo.data.data.data.form && exportLinkInfo.data.data.data.form.attendances ? exportLinkInfo.data.data.data.form.attendances : false;

  const isData = exportLinkInfo && exportLinkInfo.data && exportLinkInfo.data.data && exportLinkInfo.data.data.url ? exportLinkInfo.data.data.url : false;

  const dataFields = [
    { heading: 'Employee Name', property: 'name' },
    { heading: 'Barcode', property: 'barcode' },
    { heading: 'Check In', property: 'check_in' },
    { heading: 'Check Out', property: 'check_out' },
    { heading: 'Date', property: 'date' },
    { heading: 'Department', property: 'department_id' },
    { heading: 'Duration', property: 'total' },
  ];

  useEffect(() => {
    if (exportLinkInfo && exportLinkInfo.data && excelData && reportName === 'Employee wise biometric report') {
      const dataFieldArray = dataFields;
      let pdfHeaderObj = '';
      const uniqFieldsArray = [];
      dataFieldArray.map((item) => {
        pdfHeaderObj = {
          header: item.heading,
          dataKey: item.property,
        };
        uniqFieldsArray.push(pdfHeaderObj);
      });
      setPdfHeader(uniqBy(uniqFieldsArray, 'header'));
    }
  }, [exportLinkInfo]);

  useEffect(() => {
    if (pdfHeader && pdfHeader.__wrapped__ && pdfHeader.__wrapped__.length > 0) {
      const extractHeaderkeys = map(pdfHeader.__wrapped__, 'dataKey');
      if (excelData && excelData.length > 0) {
        excelData.map((data) => {
          data.date = getCompanyTimezoneDate(data.date, userInfo, 'date');
          const buildBodyObj = pick(data, extractHeaderkeys);
          Object.keys(buildBodyObj).map((bodyData) => {
            if (Array.isArray(buildBodyObj[bodyData])) {
              buildBodyObj[bodyData] = buildBodyObj[bodyData][1];
            } else {
              buildBodyObj[bodyData] = getDefaultNoValue(buildBodyObj[bodyData]);
            }
            return null;
          });
          setPdfBody((state) => [...state, buildBodyObj]);
        });
      }
    }
  }, [pdfHeader, exportLinkInfo]);

  const downloadPdfReport = () => {
    dispatch(setInitialValues(false, false, false, false));
    const pdfHeaders = pdfHeader && pdfHeader.__wrapped__ && pdfHeader.__wrapped__.length > 0 ? pdfHeader.__wrapped__ : [];
    savePdfContent('Employee Bio Metric', pdfHeaders, pdfBody, 'Employee-Bio-Metric.pdf', companyName, appliedFilters);
  };

  function documentDownloadLink(link, filename) {
    if (link) {
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

  const authService = AuthService();

  const fetchImage = async (path) => {
    const WEBAPPAPIURL = `${window.location.origin === 'http://localhost:3010' ? 'http://localhost:3000' : window.location.origin}/`;
    try {
      setLoading(true);
      const response = await axios.get(`${WEBAPPAPIURL}${path}`, {
        headers: {
          endpoint: window.localStorage.getItem('api-url'),
          Authorization: `Bearer ${authService.getAccessToken()}`,
        },
        responseType: 'arraybuffer',
        withCredentials: true,
      });

      const blob = new Blob([response.data], { type: 'application/vnd.ms-excel' });
      const objectURL = URL.createObjectURL(blob);
      documentDownloadLink(objectURL, reportName);
    } catch (error) {
      setLoading(false);
      console.error('Error fetching image:', error);
    }
  };

  const downloadReport = (path) => {
    dispatch(setInitialValues(false, false, false, false));
    fetchImage(path);
  };

  useEffect(() => {
    if (exportType === 'pdf') {
      downloadPdfReport();
    } else if (exportType === 'excel') {
      downloadReport(isData);
    }
  }, [exportTrue, exportType]);

  const loading = (createExportInfo && createExportInfo.loading) || (exportLinkInfo && exportLinkInfo.loading);
  const isError = (exportLinkInfo && exportLinkInfo.data && !exportLinkInfo.data.status) || (exportLinkInfo && exportLinkInfo.err);
  let errorText = <div />;
  if (!loading && !isData && !isError && (reportName === 'Monthly Attendance Details' || reportName === 'Form XXVI' || reportName === 'Daily Attendance Details' || reportName === 'Monthly Biometric')) {
    if (!selectedDate) {
      errorText = (
        <ErrorContent errorTxt={`PLEASE SELECT ${reportName === 'Daily Attendance Details' ? 'DATE' : 'MONTH'}`} />
      );
    } else if (!globalType) {
      errorText = (
        <ErrorContent errorTxt="PLEASE SELECT TYPE" />
      );
    } else if (!globalVendor) {
      errorText = (
        <ErrorContent errorTxt="PLEASE SELECT VENDOR" />
      );
    } else {
      errorText = '';
    }
  }

  if (!loading && !isData && !isError && (reportName === 'Employee wise biometric report')) {
    if (!(empDates && empDates.length > 1)) {
      errorText = (
        <ErrorContent errorTxt="PLEASE SELECT START AND END DATE" />
      );
    } else if (!(employees && employees.length)) {
      errorText = (
        <ErrorContent errorTxt="PLEASE SELECT EMPLOYEE" />
      );
    } else {
      errorText = '';
    }
  }

  const onClose = () => {
    dispatch(setInitialValues(false, false, false, false));
  };

  const apiUrl = window.localStorage.getItem('api-url');

  const officeViewerApiLink = 'https://view.officeapps.live.com/op/embed.aspx';

  return (
    <Card className={collapse ? 'filter-margin-right reports p-1 bg-lightblue h-100' : 'reports p-1 bg-lightblue h-100'}>
      <CardBody className="p-1 bg-color-white m-0">

        {!loading && isData && (
        <iframe src={`${officeViewerApiLink}?src=${`${apiUrl}/${isData}`}`} width="100%" title={reportName} height="565px" frameBorder="0"> </iframe>
        )}

        {excelData && (
        <iframe src={savePdfContentBlob('Employee Bio Metric', pdfHeader && pdfHeader.__wrapped__ && pdfHeader.__wrapped__.length > 0 ? pdfHeader.__wrapped__ : [], pdfBody, 'Employee-Bio-Metric.pdf', companyName, appliedFilters)} width="100%" title={reportName} height="565px" frameBorder="0"> </iframe>
        )}

        {loading && (
        <div className="mb-3 mt-3 text-center">
          <Loader />
        </div>
        )}
        {!loading && (exportLinkInfo && exportLinkInfo.err) && (
        <ErrorContent errorTxt={generateErrorMessage(exportLinkInfo)} />
        )}
        {!loading && exportLinkInfo && exportLinkInfo.data && !exportLinkInfo.data.status && (
        <ErrorContent errorTxt="No Data Found" />
        )}
        {errorText}
      </CardBody>
    </Card>
  );
});

ReportDownload.propTypes = {
  collapse: PropTypes.bool,
  afterReset: PropTypes.func.isRequired,
  reportName: PropTypes.string.isRequired,
};
ReportDownload.defaultProps = {
  collapse: false,
};

export default ReportDownload;
