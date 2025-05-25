import React, { useState, useEffect } from 'react';
import {
    Button,
    Col,
    Row,
} from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faFilePdf, faFileExcel,
} from '@fortawesome/free-solid-svg-icons';
import 'jspdf-autotable';
import { getExportFileName } from '../../../util/getDynamicClientData';

const DataExport = ({afterReset}) => {
    const [exportType, setExportType] = useState('');
    const exportFileName = getExportFileName('Employee_Pantry_Orders')

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

    const handleAnswerPrint = (htmlId, fileName) => {
        const content = document.getElementById(htmlId);
        document.title = fileName;
        const pri = document.getElementById('print_frame').contentWindow;
        pri.document.open();
        pri.document.write(content.innerHTML);
        pri.document.close();
        setTimeout(() => {
            pri.focus();
            pri.print();
        }, 1000);
    };

    useEffect(() => {
        if (exportType === 'pdf') {
            handleAnswerPrint('print-employee-pantry-report', exportFileName)
            afterReset()
        } else if (exportType === 'excel') {
            exportTableToExcel('export-employee-pantry-orders', exportFileName);
            afterReset()
        }
    }, [exportType]);

    return (
        <>
            <Row>
                <Col md="12" sm="12" lg="6">
                    <div className="p-3 text-center">
                        <FontAwesomeIcon className="fa-3x" size="lg" icon={faFilePdf} />
                        <h5>PDF</h5>
                        <Button
                            type="button"
                            color="dark"
                            className="bg-zodiac"
                            onClick={() => {
                                setExportType('pdf');
                            }}
                        >
                            Download
                        </Button>
                    </div>
                </Col>
                <Col md="12" sm="12" lg="6">
                    <div className="p-3 text-center">
                        <FontAwesomeIcon className="fa-3x" size="lg" icon={faFileExcel} />
                        <h5>Excel</h5>
                        <Button
                            type="button"
                            color="dark"
                            className="bg-zodiac"
                            onClick={() => {
                                setExportType('excel');
                            }}
                        >
                            Download
                        </Button>
                    </div>
                </Col>
            </Row>
        </>
    )
}
export default DataExport