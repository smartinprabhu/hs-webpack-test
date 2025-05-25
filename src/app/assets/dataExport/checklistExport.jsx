/* eslint-disable react/forbid-prop-types */
/* eslint-disable import/no-unresolved */
import React, { useState } from 'react';
import {
  Button,
  Col,
  FormFeedback,
  Row,
  Spinner,
} from 'reactstrap';
import * as PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faFilePdf, faFileExcel,
} from '@fortawesome/free-solid-svg-icons';
import moment from 'moment-timezone';
import { DatePicker } from 'antd';

import SuccessAndErrorFormat from '@shared/successAndErrorFormat';
import CustomModalMessage from '@shared/customModalMessage';

import {
  resetInspectionOrders,
  getInspectionOrders,
  getTypeId,
} from '../../preventiveMaintenance/ppmService';
import { getArrayByInteger } from '../../util/appUtils';
import { setInitialValues } from '../../purchase/purchaseService';
import ChecklistPrint from '../../preventiveMaintenance/reports/reportList/checklistPrint';

const { RangePicker } = DatePicker;

const ChecklistExport = (props) => {
  const {
    afterReset, rows,
  } = props;
  const dispatch = useDispatch();

  const { userInfo } = useSelector((state) => state.user);

  const {
    inspectionOrders,
    typeId,
  } = useSelector((state) => state.ppm);

  const [date, changeDate] = useState(false);
  const [datesValue, setDatesValue] = useState([]);

  const disabledDate = (current) => {
    if (!datesValue || datesValue.length === 0) {
      return false;
    }
    const tooLate = datesValue[0] && current.diff(datesValue[0], 'days') > 30;
    const tooEarly = datesValue[1] && datesValue[1].diff(current, 'days') > 30;
    return tooEarly || tooLate;
  };

  function exportTableToExcel(tableID, fileTitle = '') {
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
  }

  const handlePdfExport = () => {
    const div = document.getElementById('print-checklist-report');
    // Create a window object.
    const win = window.open('', '', 'height=700,width=700'); // Open the window. Its a popup window.
    document.title = 'Inspection Checklist Trport';
    win.document.write(div.outerHTML); // Write contents in the new window.
    win.document.close();
    dispatch(setInitialValues(false, false, false, false));
    if (afterReset) afterReset();
  };

  const handleExcelExport = () => {
    exportTableToExcel('export-checklist-report', 'Inspection Checklist Report');
    dispatch(resetInspectionOrders());
    dispatch(setInitialValues(false, false, false, false));
    if (afterReset) afterReset();
  };

  const onDateRangeChange = (dates) => {
    changeDate(dates);
    if (dates && dates.length && rows) {
      const preventiveFor = 'e';
      const timeZone = userInfo.data.timezone ? userInfo.data.timezone : 'Asia/Kolkata';

      const start = `${moment(dates[0]).utc().tz(timeZone).format('YYYY-MM-DD')} 00:00:00`;
      const end = `${moment(dates[1]).utc().tz(timeZone).format('YYYY-MM-DD')} 23:59:59`;

      dispatch(getTypeId({
        preventiveFor: 'e',
        date: dates,
        spaceValue: false,
        equipValue: rows,
      }));
      dispatch(getInspectionOrders(start, end, preventiveFor, getArrayByInteger(rows)));
    }
  };

  const isData = inspectionOrders && inspectionOrders.data && inspectionOrders.data.data && inspectionOrders.data.data.length ? inspectionOrders.data.data[0] : false;
  const isError = inspectionOrders && inspectionOrders.data ? !inspectionOrders.data.status : false;

  return (
    <Row>
      <Col md="12" sm="12" lg="12" xs="12">
        <div>
          <RangePicker
            onCalendarChange={(val) => {setDatesValue(val); changeDate(val);}}
            onChange={onDateRangeChange}
            disabledDate={disabledDate}
            value={date}
            format="DD-MM-y"
            size="small"
            className="mt-1 mx-wd-210"
          />
          {!date && (
          <FormFeedback className="text-info m-1 text-info font-tiny display-block">Maximum Date Range upto 30 days</FormFeedback>
          )}
          <br />
          {' '}
          <br />
        </div>
      </Col>
      {date && date.length > 0 && (
        <>
          <Col md="4" sm="4" lg="4" xs="12">
            <div className="p-1 text-center">
              <FontAwesomeIcon className="fa-3x" size="lg" icon={faFilePdf} />
              <p className="mb-0">PDF</p>
              <Button
                type="button"
                color="dark"
                className="bg-zodiac"
                disabled={(inspectionOrders && inspectionOrders.loading) || !isData || isError}
                onClick={() => {
                  handlePdfExport();
                }}
              >
                {(inspectionOrders && inspectionOrders.loading) ? (
                  <Spinner size="sm" color="light" className="mr-2" />
                ) : (<span />)}
                {' '}
                Download
              </Button>
            </div>
          </Col>
          <Col md="4" sm="4" lg="4" xs="12">
            <div className="p-1 text-center">
              <FontAwesomeIcon className="fa-3x" size="lg" icon={faFileExcel} />
              <p className="mb-0">Excel</p>
              <Button
                type="button"
                color="dark"
                className="bg-zodiac"
                disabled={(inspectionOrders && inspectionOrders.loading) || !isData || isError}
                onClick={() => {
                  handleExcelExport();
                }}
              >
                {(inspectionOrders && inspectionOrders.loading) ? (
                  <Spinner size="sm" color="light" className="mr-2" />
                ) : (<span />)}
                {' '}
                Download
              </Button>
            </div>
          </Col>
        </>
      )}
      {(date && date.length > 0) && inspectionOrders && inspectionOrders.err && (
        <Col md="12" sm="12" lg="12" xs="12">
          <SuccessAndErrorFormat response={inspectionOrders} />
        </Col>
      )}
      {(date && date.length > 0) && !isData && isError && (
        <Col md="12" sm="12" lg="12" xs="12">
          <CustomModalMessage errorMessage="No Data" />
        </Col>
      )}
      <Col md="12" sm="12" lg="12" className="d-none">
        <ChecklistPrint typeId={typeId} inspectionOrders={inspectionOrders} />
      </Col>
    </Row>
  );
};

ChecklistExport.propTypes = {
  afterReset: PropTypes.func.isRequired,
  rows: PropTypes.array.isRequired,
};

export default ChecklistExport;
