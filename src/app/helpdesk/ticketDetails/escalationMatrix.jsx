/* eslint-disable no-nested-ternary */
/* eslint-disable max-len */
/* eslint-disable react/jsx-no-useless-fragment */
/* eslint-disable import/no-unresolved */
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as PropTypes from 'prop-types';
import { Done, Clear } from '@mui/icons-material';
import { Divider, Typography } from '@mui/material';
import { Box } from '@mui/system';

import MuiTooltip from '@shared/muiTooltip';

import {
  getDefaultNoValue,
  getCompanyTimezoneDate,
} from '../../util/appUtils';
import {
  getTicketSlaDetail, getSlaLevel1Detail, getSlaLevel2Detail, getSlaLevel3Detail, getSlaLevel4Detail, getSlaLevel5Detail,
} from '../ticketService';

const appModels = require('../../util/appModels').default;

const slaLevelInfo = (props) => {
  const {
    detailData,
  } = props;
  const dispatch = useDispatch();
  const {
    ticketSlaDetail, ticketSla1Detail, ticketSla2Detail, ticketSla3Detail, ticketSla4Detail, ticketSla5Detail,
  } = useSelector((state) => state.ticket);
  const { userInfo } = useSelector((state) => state.user);

  useEffect(() => {
    (async () => {
      if (detailData) {
        await dispatch(getTicketSlaDetail(detailData.id, appModels.TICKETSSLATRACKER));
      }
    })();
  }, []);

  const ticketData = ticketSlaDetail && ticketSlaDetail.data && ticketSlaDetail.data.length ? ticketSlaDetail.data[0] : '';
  const slaLevel1 = ticketSla1Detail && ticketSla1Detail.data && ticketSla1Detail.data.length ? ticketSla1Detail.data[0] : '';
  const slaLevel2 = ticketSla2Detail && ticketSla2Detail.data && ticketSla2Detail.data.length ? ticketSla2Detail.data[0] : '';
  const slaLevel3 = ticketSla3Detail && ticketSla3Detail.data && ticketSla3Detail.data.length ? ticketSla3Detail.data[0] : '';
  const slaLevel4 = ticketSla4Detail && ticketSla4Detail.data && ticketSla4Detail.data.length ? ticketSla4Detail.data[0] : '';
  const slaLevel5 = ticketSla5Detail && ticketSla5Detail.data && ticketSla5Detail.data.length ? ticketSla5Detail.data[0] : '';

  useEffect(() => {
    (async () => {
      if (ticketSlaDetail) {
        const l1Id = ticketSlaDetail && ticketSlaDetail.data && ticketSlaDetail.data.length > 0 ? ticketData.l1_id.id : '';
        const l2Id = ticketSlaDetail && ticketSlaDetail.data && ticketSlaDetail.data.length > 0 ? ticketData.l2_id.id : '';
        const l3Id = ticketSlaDetail && ticketSlaDetail.data && ticketSlaDetail.data.length > 0 ? ticketData.l3_id.id : '';
        const l4Id = ticketSlaDetail && ticketSlaDetail.data && ticketSlaDetail.data.length > 0 ? ticketData.l4_id.id : '';
        const l5Id = ticketSlaDetail && ticketSlaDetail.data && ticketSlaDetail.data.length > 0 ? ticketData.l5_id.id : '';
        if (ticketData && ticketData.l1_id.id) {
          await dispatch(getSlaLevel1Detail(l1Id, appModels.ESCALATIONLEVEL));
        }
        if (ticketData && ticketData.l2_id.id) {
          await dispatch(getSlaLevel2Detail(l2Id, appModels.ESCALATIONLEVEL));
        }
        if (ticketData && ticketData.l3_id.id) {
          await dispatch(getSlaLevel3Detail(l3Id, appModels.ESCALATIONLEVEL));
        }
        if (ticketData && ticketData.l4_id.id) {
          await dispatch(getSlaLevel4Detail(l4Id, appModels.ESCALATIONLEVEL));
        }
        if (ticketData && ticketData.l5_id.id) {
          await dispatch(getSlaLevel5Detail(l5Id, appModels.ESCALATIONLEVEL));
        }
      }
    })();
  }, []);

  return (
    <>
      {ticketSlaDetail && ticketSlaDetail.data && ticketSlaDetail.data.length > 0
        ? (
          <>
            {(ticketData.l1_datetime && ticketData.l1_id.name) || (ticketData.l2_datetime && ticketData.l2_id.name) || (ticketData.l3_datetime && ticketData.l3_id.name)
              ? (
                <>
                  <Divider />
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      padding: '5px',
                    }}
                  >
                    <Typography
                      sx={{
                        width: '20%',
                        font: 'normal normal normal 14px Suisse Intl',
                      }}
                    >
                      Level
                    </Typography>
                    <Typography
                      sx={{
                        width: '30%',
                        font: 'normal normal normal 14px Suisse Intl',
                      }}
                    >
                      Date Time
                    </Typography>
                    <Typography
                      sx={{
                        width: '40%',
                        font: "normal normal normal 14px Suisse Int'l",
                      }}
                    >
                      Escalate To
                    </Typography>
                    <Typography
                      sx={{
                        width: '10%',
                        font: "normal normal normal 14px Suisse Int'l",
                      }}
                    >
                      Status
                    </Typography>
                  </Box>
                  <Divider />
                  {ticketData.l1_datetime && ticketData.l1_id.name
                    ? (
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          padding: '5px',
                        }}
                      >
                        <Typography
                          sx={{
                            width: '20%',
                            font: "normal normal normal 14px Suisse Int'l",

                          }}
                        >
                          Level I
                        </Typography>
                        <Typography
                          sx={{
                            width: '30%',
                            font: "normal normal normal 14px Suisse Int'l",

                          }}
                        >
                          {ticketData.l1_datetime ? getDefaultNoValue(getCompanyTimezoneDate(ticketData.l1_datetime, userInfo, 'datetime')) : '-'}

                        </Typography>
                        <MuiTooltip title={(
                          <div style={{ whiteSpace: 'pre-line' }}>
                            <Typography>
                              <h6 className="recipienthover">Recipients</h6>
                              {(slaLevel1) && slaLevel1.recipients_ids && slaLevel1.recipients_ids.length && slaLevel1.recipients_ids.map((e) => (
                                <Typography>
                                  {`${e.name}\n`}
                                  {' '}
                                </Typography>
                              ))}
                              {(slaLevel1) && slaLevel1.alarm_recipients_ids && slaLevel1.alarm_recipients_ids.length && slaLevel1.alarm_recipients_ids.map((e) => <Typography>{`${e.name}\n`}</Typography>)}
                            </Typography>
                          </div>
                                                  )}
                        >
                          <Typography
                            sx={{
                              width: '40%',
                              font: "normal normal normal 14px Suisse Int'l",

                            }}
                          >

                            {getDefaultNoValue(ticketData.l1_id.name)}

                          </Typography>
                        </MuiTooltip>
                        <Typography
                          sx={{
                            width: '10%',
                            font: "normal normal normal 14px Suisse Int'l",

                          }}
                        >
                          {(ticketData.laste_scalation_level === 'l1') || (ticketData && ticketData.laste_scalation_level === 'l2') || (ticketData && ticketData.laste_scalation_level === 'l3') || (ticketData && ticketData.laste_scalation_level === 'l4') || (ticketData && ticketData.laste_scalation_level === 'l5') || (ticketData.laste_scalation_level === 'done')
                            ? (
                              <Done
                                size={15}
                                cursor="pointer"
                                style={{ color: 'green' }}
                              />
                            )
                            : ticketData.l1_id.name
                              ? (
                                <Clear
                                  size={15}
                                  cursor="pointer"
                                  style={{ color: 'green' }}
                                />
                              )
                              : '-'}
                        </Typography>
                      </Box>
                    ) : ''}
                  {ticketData.l2_datetime && ticketData.l2_id.name
                    ? (
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          padding: '5px',
                        }}
                      >
                        <Typography
                          sx={{
                            width: '20%',
                            font: "normal normal normal 14px Suisse Int'l",

                          }}
                        >
                          Level II
                        </Typography>
                        <Typography
                          sx={{
                            width: '30%',
                            font: "normal normal normal 14px Suisse Int'l",
                          }}
                        >
                          {ticketData.l2_datetime ? getDefaultNoValue(getCompanyTimezoneDate(ticketData.l2_datetime, userInfo, 'datetime')) : '-'}

                        </Typography>
                        <MuiTooltip title={(
                          <div style={{ whiteSpace: 'pre-line' }}>
                            <Typography>
                              <h6 className="recipienthover">Recipients</h6>
                              {(slaLevel2) && slaLevel2.recipients_ids && slaLevel2.recipients_ids.length && slaLevel2.recipients_ids.map((e) => (
                                <Typography>
                                  {`${e.name}\n`}
                                  {' '}
                                </Typography>
                              ))}
                              {(slaLevel2) && slaLevel2.alarm_recipients_ids && slaLevel2.alarm_recipients_ids.length && slaLevel2.alarm_recipients_ids.map((e) => <Typography>{`${e.name}\n`}</Typography>)}
                            </Typography>
                          </div>
                                                  )}
                        >
                          <Typography
                            sx={{
                              width: '40%',
                              font: "normal normal normal 14px Suisse Int'l",
                            }}
                          >
                            {getDefaultNoValue(ticketData.l2_id.name)}

                          </Typography>
                        </MuiTooltip>
                        <Typography
                          sx={{
                            width: '10%',
                            font: "normal normal normal 14px Suisse Int'l",
                          }}
                        >
                          {(ticketData.laste_scalation_level === 'l2') || (ticketData && ticketData.laste_scalation_level === 'l3') || (ticketData && ticketData.laste_scalation_level === 'l4') || (ticketData && ticketData.laste_scalation_level === 'l5') || (ticketData.laste_scalation_level === 'done')
                            ? (
                              <Done
                                size={15}
                                cursor="pointer"
                                style={{ color: 'green' }}
                              />
                            )
                            : ticketData.l1_id.name
                              ? (
                                <Clear
                                  size={15}
                                  cursor="pointer"
                                  style={{ color: 'green' }}
                                />
                              )
                              : '-'}
                        </Typography>
                      </Box>
                    ) : ''}
                  {ticketData.l3_datetime && ticketData.l3_id.name
                    ? (
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          padding: '5px',
                        }}
                      >
                        <Typography
                          sx={{
                            width: '20%',
                            font: "normal normal normal 14px Suisse Int'l",
                          }}
                        >
                          Level III
                        </Typography>
                        <Typography
                          sx={{
                            width: '30%',
                            font: "normal normal normal 14px Suisse Int'l",
                          }}
                        >
                          {ticketData.l3_datetime ? getDefaultNoValue(getCompanyTimezoneDate(ticketData.l3_datetime, userInfo, 'datetime')) : '-'}

                        </Typography>
                        <MuiTooltip title={(
                          <div style={{ whiteSpace: 'pre-line' }}>
                            <Typography>
                              <h6 className="recipienthover">Recipients</h6>
                              {(slaLevel3) && slaLevel3.recipients_ids && slaLevel3.recipients_ids.length && slaLevel3.recipients_ids.map((e) => (
                                <Typography>
                                  {`${e.name}\n`}
                                  {' '}
                                </Typography>
                              ))}
                              {(slaLevel3) && slaLevel3.alarm_recipients_ids && slaLevel3.alarm_recipients_ids.length && slaLevel3.alarm_recipients_ids.map((e) => <Typography>{`${e.name}\n`}</Typography>)}
                            </Typography>
                          </div>
                                                  )}
                        >
                          <Typography
                            sx={{
                              width: '40%',
                              font: "normal normal normal 14px Suisse Int'l",
                            }}
                          >
                            {getDefaultNoValue(ticketData.l3_id.name)}
                          </Typography>
                        </MuiTooltip>
                        <Typography
                          sx={{
                            width: '10%',
                            font: "normal normal normal 14px Suisse Int'l",
                          }}
                        >
                          {(ticketData.laste_scalation_level === 'l3') || (ticketData && ticketData.laste_scalation_level === 'l4') || (ticketData && ticketData.laste_scalation_level === 'l5') || (ticketData.laste_scalation_level === 'done')
                            ? (
                              <Done
                                size={15}
                                cursor="pointer"
                                style={{ color: 'green' }}
                              />
                            )
                            : ticketData.l1_id.name
                              ? (
                                <Clear
                                  size={15}
                                  cursor="pointer"
                                  style={{ color: 'green' }}
                                />
                              )
                              : '-'}
                        </Typography>
                      </Box>
                    ) : ''}
                  {ticketData.l4_datetime && ticketData.l4_id.name
                    ? (
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          padding: '5px',
                        }}
                      >
                        <Typography
                          sx={{
                            width: '20%',
                            font: "normal normal normal 14px Suisse Int'l",
                          }}
                        >
                          Level IV
                        </Typography>
                        <Typography
                          sx={{
                            width: '30%',
                            font: "normal normal normal 14px Suisse Int'l",
                          }}
                        >
                          {ticketData.l4_datetime ? getDefaultNoValue(getCompanyTimezoneDate(ticketData.l4_datetime, userInfo, 'datetime')) : '-'}

                        </Typography>
                        <MuiTooltip title={(
                          <div style={{ whiteSpace: 'pre-line' }}>
                            <Typography>
                              <h6 className="recipienthover">Recipients</h6>
                              {(slaLevel4) && slaLevel4.recipients_ids && slaLevel4.recipients_ids.length && slaLevel4.recipients_ids.map((e) => (
                                <Typography>
                                  {`${e.name}\n`}
                                  {' '}
                                </Typography>
                              ))}
                              {(slaLevel4) && slaLevel4.alarm_recipients_ids && slaLevel4.alarm_recipients_ids.length && slaLevel4.alarm_recipients_ids.map((e) => <Typography>{`${e.name}\n`}</Typography>)}
                            </Typography>
                          </div>
                                                  )}
                        >
                          <Typography
                            sx={{
                              width: '40%',
                              font: "normal normal normal 14px Suisse Int'l",
                            }}
                          >
                            {getDefaultNoValue(ticketData.l4_id.name)}
                          </Typography>
                        </MuiTooltip>
                        <Typography
                          sx={{
                            width: '10%',
                            font: "normal normal normal 14px Suisse Int'l",
                          }}
                        >
                          {(ticketData.laste_scalation_level === 'l5') || (ticketData && ticketData.laste_scalation_level === 'l4') || (ticketData.laste_scalation_level === 'done')
                            ? (
                              <Done
                                size={15}
                                cursor="pointer"
                                style={{ color: 'green' }}
                              />
                            )
                            : ticketData.l1_id.name
                              ? (
                                <Clear
                                  size={15}
                                  cursor="pointer"
                                  style={{ color: 'green' }}
                                />
                              )
                              : '-'}
                        </Typography>
                      </Box>
                    ) : ''}
                  {ticketData.l5_datetime && ticketData.l5_id.name
                    ? (
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          padding: '5px',
                        }}
                      >
                        <Typography
                          sx={{
                            width: '20%',
                            font: "normal normal normal 14px Suisse Int'l",
                          }}
                        >
                          Level V
                        </Typography>
                        <Typography
                          sx={{
                            width: '30%',
                            font: "normal normal normal 14px Suisse Int'l",
                          }}
                        >
                          {ticketData.l5_datetime ? getDefaultNoValue(getCompanyTimezoneDate(ticketData.l5_datetime, userInfo, 'datetime')) : '-'}

                        </Typography>
                        <MuiTooltip title={(
                          <div style={{ whiteSpace: 'pre-line' }}>
                            <Typography>
                              <h6 className="recipienthover">Recipients</h6>
                              {(slaLevel5) && slaLevel5.recipients_ids && slaLevel5.recipients_ids.length && slaLevel5.recipients_ids.map((e) => (
                                <Typography>
                                  {`${e.name}\n`}
                                  {' '}
                                </Typography>
                              ))}
                              {(slaLevel5) && slaLevel5.alarm_recipients_ids && slaLevel5.alarm_recipients_ids.length && slaLevel5.alarm_recipients_ids.map((e) => <Typography>{`${e.name}\n`}</Typography>)}
                            </Typography>
                          </div>
                                                  )}
                        >
                          <Typography
                            sx={{
                              width: '40%',
                              font: "normal normal normal 14px Suisse Int'l",
                            }}
                          >
                            {getDefaultNoValue(ticketData.l5_id.name)}
                          </Typography>
                        </MuiTooltip>
                        <Typography
                          sx={{
                            width: '10%',
                            font: "normal normal normal 14px Suisse Int'l",
                          }}
                        >
                          {(ticketData.laste_scalation_level === 'l5') || (ticketData.laste_scalation_level === 'done')
                            ? (
                              <Done
                                size={15}
                                cursor="pointer"
                                style={{ color: 'green' }}
                              />
                            )
                            : ticketData.l1_id.name
                              ? (
                                <Clear
                                  size={15}
                                  cursor="pointer"
                                  style={{ color: 'green' }}
                                />
                              )
                              : '-'}
                        </Typography>
                      </Box>
                    ) : ''}
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
};

slaLevelInfo.propTypes = {
  detailData: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array,
    PropTypes.bool,
  ]).isRequired,
};

export default slaLevelInfo;
