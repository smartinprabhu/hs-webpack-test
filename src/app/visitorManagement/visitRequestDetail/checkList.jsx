/* eslint-disable import/no-unresolved */
import React, { useEffect } from 'react';
import {
  Col,
  Row,
  Table,
} from 'reactstrap';
import { useSelector, useDispatch } from 'react-redux';

import DetailViewFormat from '@shared/detailViewFormat';

import { getOrderCheckLists } from '../../workorders/workorderService';
import { getDefaultNoValue, extractTextObject, getCompanyTimezoneDate } from '../../util/appUtils';

const appModels = require('../../util/appModels').default;

const CheckList = () => {
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.user);
  const { visitorRequestDetails } = useSelector((state) => state.visitorManagement);

  const { orderCheckLists } = useSelector((state) => state.workorder);

  useEffect(() => {
    if (visitorRequestDetails && visitorRequestDetails.data && visitorRequestDetails.data.length) {
      const ids = visitorRequestDetails.data.length > 0 ? visitorRequestDetails.data[0].check_list_ids : [];
      dispatch(getOrderCheckLists(ids, appModels.VISITORCHECKLIST));
    }
  }, [visitorRequestDetails]);

  function getRow(checkData) {
    const tableTr = [];
    for (let i = 0; i < checkData.length; i += 1) {
      tableTr.push(
        <tr key={i}>
          <td className="p-2">{getDefaultNoValue(extractTextObject(checkData[i].mro_quest_grp_id))}</td>
          <td className="p-2">{getDefaultNoValue(extractTextObject(checkData[i].mro_activity_id))}</td>
          <td className="p-2">{getDefaultNoValue(checkData[i].answer_common)}</td>
          <td className="p-2">{getDefaultNoValue(extractTextObject(checkData[i].user_id))}</td>
          <td className="p-2">
            {' '}
            {getDefaultNoValue(getCompanyTimezoneDate(checkData[i].write_date, userInfo, 'datetime'))}
          </td>
        </tr>,
      );
    }
    return tableTr;
  }

  return (
      <Row>
        <Col sm="12" md="12" lg="12" xs="12" className="p-3 comments-list thin-scrollbar">
          {(orderCheckLists && orderCheckLists.data) && (
          <div className="viewTicket-orders">
            <Table responsive className="mb-0 mt-2 font-weight-400 border-0 assets-table" width="100%">
              <thead>
                <tr>
                  <th className="p-2 min-width-160">
                    Question Group
                  </th>
                  <th className="p-2 min-width-160">
                    Question
                  </th>
                  <th className="p-2 min-width-100">
                    Answer
                  </th>
                  <th className="p-2 min-width-160">
                    Answered By
                  </th>
                  <th className="p-2 min-width-160">
                    Answered on
                  </th>
                </tr>
              </thead>
              <tbody>
                {getRow(orderCheckLists && orderCheckLists.data ? orderCheckLists.data : [])}
              </tbody>
            </Table>
            <hr className="m-0" />
          </div>
          )}
          <DetailViewFormat detailResponse={orderCheckLists} />
        </Col>
      </Row>
  );
};

export default CheckList;
