/* eslint-disable no-param-reassign */
/* eslint-disable prefer-destructuring */
/* eslint-disable array-callback-return */
/* eslint-disable import/no-unresolved */
/* eslint-disable no-underscore-dangle */
import React from 'react';
import {
  Button,
  Col,
  Row,
} from 'reactstrap';
import * as PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faFilePdf, faFileExcel,
} from '@fortawesome/free-solid-svg-icons';
import 'jspdf-autotable';

import tableFields from './tableFields.json';

import ChecklistPrint from './checklistPrint';

const dataFields = tableFields.fields;
const dataLogFields = tableFields.logfields;

const DataExport = (props) => {
  const {
    assetsList,
  } = props;

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

  const handleAnswerPrint = (htmlId, fileName) => {
    const div = document.getElementById(htmlId);
    // Create a window object.
    const win = window.open('', '', 'height=700,width=700'); // Open the window. Its a popup window.
    document.title = fileName;
    win.document.write(div.outerHTML); // Write contents in the new window.
    win.document.close();
    win.print();
  };

  return (
    <Row>
      <Col md="6" sm="6" lg="6" xs="12">
        <div className="p-1 text-center">
          <FontAwesomeIcon className="fa-3x" size="sm" icon={faFilePdf} />
          <p className="mb-0">PDF</p>
          <Button
            type="button"
            color="dark"
            className="bg-zodiac"
            disabled={assetsList && !assetsList.length}
            size="sm"
            onClick={() => handleAnswerPrint('print-compliance-report', 'Compliance Report')}
          >
            {' '}
            Download
          </Button>
        </div>
      </Col>
      <Col md="6" sm="6" lg="6" xs="12">
        <div className="p-1 text-center">
          <FontAwesomeIcon className="fa-3x" size="lg" icon={faFileExcel} />
          <p className="mb-0">Excel</p>
          <Button
            type="button"
            color="dark"
            className="bg-zodiac"
            disabled={assetsList && !assetsList.length}
            size="sm"
            onClick={() => exportTableToExcel('export-checklist-report', 'Compliance Report')}
          >
            Download
          </Button>
        </div>
      </Col>
      <Col md="12" sm="12" lg="12" xs="12">
        <div className="hidden-div" id="print_report">
          <Col md="12" sm="12" lg="12" className="d-none">
            <ChecklistPrint fields={dataFields} logFields={dataLogFields} complianceList={assetsList} />
          </Col>
        </div>
      </Col>
      <iframe name="print_frame" title="Equipments_Export" id="print_frame" width="0" height="0" frameBorder="0" src="about:blank" />
    </Row>
  );
};

DataExport.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  assetsList: PropTypes.array.isRequired,
};

export default DataExport;
