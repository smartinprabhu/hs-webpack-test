import React from 'react';
import { useSelector } from 'react-redux';

import { groupByMultiple } from '../../../util/staticFunctions';

const EmployeeReportPrint = ({ reportName, selectedReportDate, getOrderLines, getRow }) => {
    const { reports, selectedReportType } = useSelector((state) => state.pantry);

    let employeeList = [];
    if (reports && reports.data && reports.data.length > 0) {
        employeeList = groupByMultiple(reports.data, (obj) => obj.employee_id.id);
    }
    const { userInfo } = useSelector((state) => state.user);

    return (
        <>
            <div id="print-employee-pantry-report">
                <table align="center" className='d-none'>
                    <tbody>
                        <tr><td style={{ textAlign: 'center' }} colSpan={5}><b>{reportName}{''}-{''}{selectedReportType}</b></td></tr>
                        <tr>
                            <td>Company</td>
                            <td colSpan={15}><b>{userInfo && userInfo.data ? userInfo.data.company.name : 'Company'}</b></td>
                        </tr>
                        <tr>
                            <td>{selectedReportDate && (<span> Report Date :</span>)}</td>
                            <td colSpan={15}><b>{selectedReportDate}</b></td>
                        </tr>
                    </tbody>
                </table>
                <br />
                {employeeList.map((rp) => (
                    <div className="mt-2">
                        <h5 className="pl-2">{rp[0].employee_id.name}</h5>
                        <div className="notification-header thin-scrollbar">
                            <table
                                style={{
                                    border: '1px solid #495057', borderCollapse: 'collapse', marginBottom: '15px',
                                }}
                                className="export-table1"
                                width="100%"
                                align="left"
                                key={rp}
                            >
                                <tbody>
                                    <tr
                                        style={{
                                            border: '1px solid #495057', borderCollapse: 'collapse', marginBottom: '15px',
                                        }}
                                    >
                                        <td className="p-2 min-width-160">
                                            <span style={{ fontWeight: '800' }} >
                                                Product
                                            </span>
                                        </td>
                                        <td className="p-2 min-width-160">
                                            <span style={{ fontWeight: '800' }}>
                                                Ordered
                                            </span>
                                        </td>
                                        <td className="p-2 min-width-160">
                                            <span style={{ fontWeight: '800' }}>
                                                Delivered
                                            </span>
                                        </td>
                                        {selectedReportType === 'Detailed'
                                            ? (
                                                <>
                                                    <td className="p-2 min-width-160">
                                                        <span style={{ fontWeight: '800' }}>
                                                            Ordered On
                                                        </span>
                                                    </td>
                                                    <td className="p-2 min-width-160">
                                                        <span style={{ fontWeight: '800' }}>
                                                            Pantry
                                                        </span>
                                                    </td>
                                                </>
                                            ) : ''}
                                    </tr>
                                    {getRow(getOrderLines(rp[0].employee_id.id))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                ))}
            </div>
            <iframe name="print_frame" title="Export" id="print_frame" width="0" height="0" frameBorder="0" src="about:blank" />
        </>
    )
}
export default EmployeeReportPrint 