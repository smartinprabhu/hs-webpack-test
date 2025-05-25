/* eslint-disable no-nested-ternary */
/* eslint-disable max-len */
/* eslint-disable react/jsx-no-useless-fragment */
/* eslint-disable import/no-unresolved */
import React, { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Table, Col,
} from 'reactstrap';
import * as PropTypes from 'prop-types';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Tooltip } from 'antd';
import {
  getDefaultNoValue,
  getCompanyTimezoneDate,
} from '../../../util/appUtils';
import {
  getTicketSlaDetail, getSlaLevel1Detail, getSlaLevel2Detail, getSlaLevel3Detail,
} from '../../ticketService';

const appModels = require('../../../util/appModels').default;

const SlaLevelInfo = React.memo((props) => {
  const {
    detailData,
  } = props;
  const dispatch = useDispatch();
  const {
    ticketSlaDetail, ticketSla1Detail, ticketSla2Detail, ticketSla3Detail,
  } = useSelector((state) => state.ticket);
  const { userInfo } = useSelector((state) => state.user);

  useEffect(() => {
    (async () => {
      if (detailData && detailData.id) {
        await dispatch(getTicketSlaDetail(detailData.id, appModels.TICKETSSLATRACKER));
      }
    })();
  }, []);

  const ticketData = ticketSlaDetail && ticketSlaDetail.data && ticketSlaDetail.data.length ? ticketSlaDetail.data[0] : '';
  const slaLevel1 = ticketSla1Detail && ticketSla1Detail.data && ticketSla1Detail.data.length ? ticketSla1Detail.data[0] : '';
  const slaLevel2 = ticketSla2Detail && ticketSla2Detail.data && ticketSla2Detail.data.length ? ticketSla2Detail.data[0] : '';
  const slaLevel3 = ticketSla3Detail && ticketSla3Detail.data && ticketSla3Detail.data.length ? ticketSla3Detail.data[0] : '';

  useMemo(() => {
    if (detailData && detailData.id && ticketSlaDetail && ticketSlaDetail.data && ticketSlaDetail.data.length) {
      const l1Id = ticketSlaDetail && ticketSlaDetail.data && ticketData && ticketData.l1_id ? ticketData.l1_id.id : '';
      const l2Id = ticketSlaDetail && ticketSlaDetail.data && ticketData && ticketData.l2_id ? ticketData.l2_id.id : '';
      const l3Id = ticketSlaDetail && ticketSlaDetail.data && ticketData && ticketData.l3_id ? ticketData.l3_id.id : '';
      if (ticketData && ticketData.l1_id && ticketData.l1_id.id) {
        dispatch(getSlaLevel1Detail(l1Id, appModels.ESCALATIONLEVEL));
      }
      if (ticketData && ticketData.l2_id && ticketData.l2_id.id) {
        dispatch(getSlaLevel2Detail(l2Id, appModels.ESCALATIONLEVEL));
      }
      if (ticketData && ticketData.l2_id && ticketData.l3_id.id) {
        dispatch(getSlaLevel3Detail(l3Id, appModels.ESCALATIONLEVEL));
      }
    }
  }, [ticketSlaDetail]);

  return (
    <>
      { ticketSlaDetail && ticketSlaDetail.data && ticketSlaDetail.data.length > 0
        ? (
          <>
            {(ticketData && ticketData.l1_datetime && ticketData.l1_id && ticketData.l1_id.name) || (ticketData && ticketData.l2_datetime && ticketData.l2_id && ticketData.l2_id.name) || (ticketData && ticketData.l3_datetime && ticketData.l3_id && ticketData.l3_id.name)
              ? (
                <>
                  <p className="mt-2" />
                  <Col sm="8" md="8" lg="12" xs="8">
                    <Table responsive>

                      <thead>
                        <tr>
                          <th className="p-2 m-0 light-text">
                            Level
                          </th>
                          <th className="p-2 m-0 light-text">
                            Date Time
                          </th>
                          <th className="p-2 m-0 light-text">
                            Escalate To
                          </th>
                          <th className="p-2 m-0 light-text">
                            Status
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {ticketData && ticketData.l1_datetime && ticketData.l1_id && ticketData.l1_id.name
                          ? (
                            <tr className="border-bottom">
                              <td className="p-2 border-0">
                                Level I
                              </td>
                              <td className="p-2 border-0">
                                {ticketData && ticketData.l1_datetime ? getDefaultNoValue(getCompanyTimezoneDate(ticketData.l1_datetime, userInfo, 'datetime')) : '-'}
                              </td>
                              <td className="p-2 border-0">
                                <Tooltip title={(
                                  <div style={{ whiteSpace: 'pre-line' }}>
                                    <span>
                                      {' '}
                                      <span>
                                        <h6 className="recipienthover">Recipients</h6>
                                        {(slaLevel1 && slaLevel1.recipients_ids && slaLevel1.recipients_ids.length > 0) ? slaLevel1.recipients_ids.map((e) => `${e.name}\n`) : ''}
                                        {(slaLevel1 && slaLevel1.alarm_recipients_ids && slaLevel1.alarm_recipients_ids.length > 0) ? slaLevel1.alarm_recipients_ids.map((e) => `${e.name}\n`) : ''}
                                      </span>
                                    </span>

                                  </div>
                              )}
                                >
                                  <p>{getDefaultNoValue(ticketData.l1_id.name)}</p>
                                </Tooltip>

                              </td>
                              <td className="p-2 border-0">
                                {(ticketData && ticketData.laste_scalation_level === 'l1') || (ticketData && ticketData.laste_scalation_level === 'done') ? <FontAwesomeIcon size="lg" color="green" inverse transform="shrink-6" icon="check" /> : ticketData.l1_id.name ? <FontAwesomeIcon size="lg" color="green" inverse transform="shrink-6" icon="fa-times" /> : '-'}
                              </td>
                            </tr>
                          )
                          : ''}
                        {ticketData && ticketData.l2_datetime && ticketData.l2_id && ticketData.l2_id.name
                          ? (
                            <tr className="border-bottom">
                              <td className="p-2 border-0">
                                Level II
                              </td>
                              <td className="p-2 border-0">
                                {ticketData && ticketData.l2_datetime ? getDefaultNoValue(getCompanyTimezoneDate(ticketData.l2_datetime, userInfo, 'datetime')) : '-'}
                              </td>
                              <td className="p-2 border-0">
                                <Tooltip title={(
                                  <div style={{ whiteSpace: 'pre-line' }}>
                                    <span>
                                      <h6 className="recipienthover">Recipients</h6>
                                      {(slaLevel2 && slaLevel2.recipients_ids && slaLevel2.recipients_ids.length > 0) ? slaLevel2.recipients_ids.map((e) => `${e.name}\n`) : ''}
                                      {(slaLevel2 && slaLevel2.alarm_recipients_ids && slaLevel2.alarm_recipients_ids.length > 0) ? slaLevel2.alarm_recipients_ids.map((e) => `${e.name}\n`) : ''}
                                    </span>
                                  </div>
                              )}
                                >
                                  <p>{getDefaultNoValue(ticketData.l2_id.name)}</p>
                                </Tooltip>
                              </td>
                              <td className="p-2 border-0">
                                {(ticketData && ticketData.laste_scalation_level === 'l2') || (ticketData && ticketData.laste_scalation_level === 'done') ? <FontAwesomeIcon size="lg" color="green" inverse transform="shrink-6" icon="check" /> : ticketData.l2_id.name ? <FontAwesomeIcon size="lg" color="green" inverse transform="shrink-6" icon="fa-times" /> : '-'}
                              </td>
                            </tr>
                          ) : ''}
                        {ticketData && ticketData.l3_datetime && ticketData.l3_id && ticketData.l3_id.name
                          ? (
                            <tr className="border-bottom">
                              <td className="p-2 border-0">
                                Level III
                              </td>
                              <td className="p-2 border-0">
                                {ticketData && ticketData.l3_datetime ? getDefaultNoValue(getCompanyTimezoneDate(ticketData.l3_datetime, userInfo, 'datetime')) : '-'}
                              </td>
                              <td className="p-2 border-0">

                                <>
                                  <div className="mr-3 mb-3">
                                    <Tooltip title={(
                                      <div style={{ whiteSpace: 'pre-line' }}>
                                        <span>
                                          <h6 className="recipienthover">Recipients</h6>
                                          {(slaLevel3 && slaLevel3.recipients_ids && slaLevel3.recipients_ids.length > 0) ? slaLevel3.recipients_ids.map((e) => `${e.name}\n`) : ''}
                                          {(slaLevel3 && slaLevel3.alarm_recipients_ids && slaLevel3.alarm_recipients_ids.length > 0) ? slaLevel3.alarm_recipients_ids.map((e) => `${e.name}\n`) : ''}
                                        </span>
                                      </div>
                                  )}
                                    >
                                      <p>{getDefaultNoValue(ticketData.l3_id.name)}</p>
                                    </Tooltip>
                                  </div>
                                </>

                              </td>
                              <td className="p-2 border-0">
                                {(ticketData && ticketData.laste_scalation_level === 'l3') || (ticketData && ticketData.laste_scalation_level === 'done') ? <FontAwesomeIcon size="lg" color="green" inverse transform="shrink-6" icon="check" /> : ticketData.l3_id.name ? <FontAwesomeIcon size="lg" color="green" inverse transform="shrink-6" icon="fa-times" /> : '-'}
                              </td>
                            </tr>
                          ) : ''}
                      </tbody>
                    </Table>
                  </Col>
                </>
              )
              : (
                <div className="p-3 m-0 light-text text-center font-weight-700 text-capital">
                  <p>No Data Found.</p>
                </div>
              )}

          </>
        )
        : (
          <div className="p-3 m-0 light-text text-center font-weight-700 text-capital">
            <p>No Data Found.</p>
          </div>
        )}
    </>
  );
});

SlaLevelInfo.propTypes = {
  detailData: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array,
    PropTypes.bool,
  ]).isRequired,
};

export default SlaLevelInfo;
