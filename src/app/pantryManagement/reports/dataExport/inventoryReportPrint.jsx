import React from 'react';
import { useSelector } from 'react-redux';

import { groupByMultiple } from '../../../util/staticFunctions';
import {
    getDefaultNoValue, extractNameObject,
} from '../../../util/appUtils';
import { groupByQuantity } from '../../utils/utils';


const InventoryReportPrint = ({ reportName, selectedReportDate }) => {
    const { reports, selectedReportType } = useSelector((state) => state.pantry);
    const { userInfo } = useSelector((state) => state.user);

    const orderLines = [];
    let orderLinesList = [];
    if (reports && reports.data && reports.data.length > 0) {
        // eslint-disable-next-line no-unused-expressions
        reports.data && reports.data.map((rp) => {
            if (rp.order_lines && rp.order_lines.length > 0) {
                rp.order_lines.map((ol) => (
                    orderLines.push(ol)
                ));
            }
        });
        orderLinesList = groupByMultiple(orderLines, (obj) => obj.product_id.id);
    }
    return (
        <>
            <div id="print-pantry-inventory-report">
                <table align="center" className='d-none'>
                    <tbody>
                        <tr><td style={{ textAlign: 'center' }} colSpan={5}><b>{reportName}</b></td></tr>
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
                <table
                    style={{
                        border: '1px solid #495057', borderCollapse: 'collapse', marginBottom: '15px',
                    }}
                    className="export-table1"
                    width="100%"
                    align="left"
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
                                    Confirmed
                                </span>
                            </td>
                            <td className="p-2 min-width-160">
                                <span style={{ fontWeight: '800' }}>
                                    Delivered
                                </span>
                            </td>
                        </tr>
                        {orderLinesList && orderLinesList.length > 0 ? (
                            orderLinesList.map((rp) => (
                                <tr key={rp[0].id}>
                                    <td className="p-2">{getDefaultNoValue(extractNameObject(rp[0].product_id, 'name'))}</td>
                                    <td className="p-2">{groupByQuantity(orderLines, rp[0].product_id.id, 'ordered_qty')}</td>
                                    <td className="p-2">{groupByQuantity(orderLines, rp[0].product_id.id, 'confirmed_qty')}</td>
                                    <td className="p-2">{groupByQuantity(orderLines, rp[0].product_id.id, 'delivered_qty')}</td>
                                </tr>
                            ))
                        ) : ''}
                    </tbody>
                </table>
            </div>
            <iframe name="print_frame" title="Export" id="print_frame" width="0" height="0" frameBorder="0" src="about:blank" />
        </>
    )
}

export default InventoryReportPrint