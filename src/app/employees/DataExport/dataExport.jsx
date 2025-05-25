/* eslint-disable react/jsx-boolean-value */
/* eslint-disable default-case */
/* eslint-disable max-len */
/* eslint-disable func-names */
import {
  GridComponent, Inject, Toolbar, PdfExport, ExcelExport,
} from '@syncfusion/ej2-react-grids';
import React, { useRef } from 'react';
import {
} from 'reactstrap';
import { useSelector } from 'react-redux';
import DataTable from '@shared/dataTable';
import tableFieldsEmployee from './tableFieldsEmployees.json';

const DataExport = () => {
  const employeeColumns = tableFieldsEmployee.fields;
  const {
    employeeExportInfo,
  } = useSelector((state) => state.employee);
  const { userInfo } = useSelector((state) => state.user);

  // sync fusion code-----
  let gridInstance = useRef();
  const toolbarOptions = ['PdfExport', 'ExcelExport'];

  const toolbarClick = (args) => {
    switch (args.item.text) {
      case 'Excel Export':
        gridInstance.excelExport();
        break;
      case 'PDF Export':
        gridInstance.pdfExport();
        break;
    }
  };

  return (
    <div>
      {/* <Col md="6" sm="6" lg="6" xs="6" className="p-0"> */}
      <div className="text-center">
        {/* <h5>PDF</h5> */}
        <GridComponent
          // eslint-disable-next-line no-return-assign
          ref={(grid) => gridInstance = grid}
          height="2"
          dataSource={employeeExportInfo.data}
          allowPdfExport={true}
          allowExcelExport={true}
          toolbar={toolbarOptions}
          toolbarClick={toolbarClick}
        >
          <Inject services={[Toolbar, PdfExport, ExcelExport]} />
        </GridComponent>
        <div className="hidden-div" id="print_report">
          <table>
            <tbody>
              <tr>
                <td>Site:</td>
                <td><b>{userInfo && userInfo && userInfo.data && userInfo.data.company ? userInfo.data.company.name : 'Company'}</b></td>
              </tr>
            </tbody>
          </table>
          <DataTable columns={employeeColumns} data={employeeExportInfo && employeeExportInfo.data ? employeeExportInfo.data : []} propertyAsKey="id" />
        </div>
        <iframe name="print_frame" title="Ticket_Export" id="print_frame" width="0" height="0" frameBorder="0" src="about:blank" />
      </div>
    </div>
  );
};
DataExport.propTypes = {
  // afterReset: PropTypes.func.isRequired,
};

export default DataExport;
