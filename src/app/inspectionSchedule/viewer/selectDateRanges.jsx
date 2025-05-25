/* eslint-disable radix */
/* eslint-disable react/prop-types */
/* eslint-disable max-len */
/* eslint-disable import/no-unresolved */
/* eslint-disable react/jsx-props-no-spreading */
import React, { useEffect, useState } from 'react';
import {
  Col,
  Row,
  Table,
} from 'reactstrap';

import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faTrashAlt,
} from '@fortawesome/free-solid-svg-icons';
import { useSelector } from 'react-redux';
import Checkbox from '@mui/material/Checkbox';

import addIcon from '@images/icons/plusCircleBlue.svg';

import { getListOfOperations } from '../../util/appUtils';
import actionCodes from '../data/actionCodes.json';

const ViewEvents = React.memo(({
  events, setEvents,
}) => {
  const [partsData, setPartsData] = useState(events);
  const [triggerChange, setTriggerChange] = useState('');
  const [orgData, setOriginal] = useState(JSON.stringify(events));

  const { inspectionCommenceInfo } = useSelector((state) => state.inspection);

  const { userRoles } = useSelector((state) => state.user);

  const allowedOperations = getListOfOperations(
    userRoles && userRoles.data ? userRoles.data.allowed_modules : [],
    'code',
  );

  const canUpcoming = allowedOperations.includes(actionCodes['Allow Cancel Upcoming Request']);

  const configData = inspectionCommenceInfo && inspectionCommenceInfo.data && inspectionCommenceInfo.data.length ? inspectionCommenceInfo.data[0] : false;

  const isPast = configData && configData.is_allow_cancellation_of_past_days;

  useEffect(() => {
    setOriginal(JSON.stringify(events));
  }, [events]);

  useEffect(() => {
    setPartsData(events);
  }, [events]);

  useEffect(() => {
    setEvents(partsData);
  }, [triggerChange]);

  const loadEmptyTd = () => {
    const newItems = [...partsData];
    newItems.push({
      from_date: null, to_date: null, is_all_upcoming: false,
    });
    setPartsData(newItems);
    setTriggerChange(Math.random());
  };

  const removeData = (e, index) => {
    const newItems = [...partsData];
    newItems.splice(index, 1);
    setPartsData(newItems);
    setTriggerChange(Math.random());
  };

  const onPlannedStartChange = (e, index) => {
    const newData = partsData;
    newData[index].from_date = e;
    newData[index].to_date = e;
    setPartsData(newData);
    setTriggerChange(Math.random());
  };

  const onPlannedEndChange = (e, index) => {
    const newData = partsData;
    newData[index].to_date = e;
    setPartsData(newData);
    setTriggerChange(Math.random());
  };

  const handleTableCellChange = (event, index) => {
    const { checked } = event.target;
    const newData = partsData;
    if (checked) {
      newData[index].is_all_upcoming = true;
      const currentToDate = new Date(newData[index].to_date);

      const allDates = newData.map((item) => new Date(item.to_date));
      const maxDate = new Date(Math.max(...allDates));
      const minDate = new Date(Math.min(...allDates));

      let filteredData;

      if (currentToDate.getTime() === maxDate.getTime()) {
      // Case 1: Largest date — keep all
        filteredData = [...newData];
      } else if (currentToDate.getTime() === minDate.getTime()) {
      // Case 2: Smallest date — keep only that row
        filteredData = [newData[index]];
      } else {
      // Case 3: In between — remove rows with to_date > current
        filteredData = newData.filter((item) => new Date(item.to_date) <= currentToDate);
      }

      setPartsData(filteredData);
      setTriggerChange(Math.random());
    } else {
      newData[index].is_all_upcoming = false;
      setPartsData(newData);
      setTriggerChange(Math.random());
    }
  };

  const isNoUpcoming = (datas) => {
    let res = true;
    if (datas && datas.length) {
      const data = datas.filter((item) => item.is_all_upcoming);
      if (data && data.length) {
        res = false;
      }
    } else {
      res = true;
    }
    return res;
  };

  const rowHeight = partsData.length && partsData.length === 1 ? 84 : 80; // Approximate height of a single row in pixels
  // const maxHeight = window.innerHeight - 300; // Max height based on viewport
  const rowCount = partsData ? partsData.length + 1 : 1;
  // Calculate the height
  const tableHeight = partsData.length ? Math.min(rowCount * rowHeight, 350) : 110;

  return (

    <Row className="thin-scrollbar ml-1" style={{ height: `${tableHeight}px`, overflowX: 'hidden', overflowY: 'auto' }}>
      <Col xs={12} sm={12} md={12} lg={12} className="">
        <Table id="spare-part" className="w-100">
          <thead className="bg-lightblue">
            <tr>
              <th className="p-2 border-0 font-14 font-family-tab table-column z-Index-1060">
                #
              </th>
              <th className="p-2 min-width-140 font-14 font-family-tab border-0 table-column z-Index-1060">
                Start Date
              </th>
              <th className="p-2 min-width-140 font-14 font-family-tab border-0 table-column z-Index-1060">
                End Date
              </th>
              {canUpcoming && (
              <th className="p-2 min-width-140 font-14 font-family-tab border-0 table-column z-Index-1060">
                All Upcoming
              </th>
              )}
              <th className="p-2 min-width-100 font-14 border-0 table-column z-Index-1060">
                <span className="">Manage</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {isNoUpcoming(partsData) && (
            <tr>
              <td colSpan={canUpcoming ? 5 : 4} className="text-left">
                <div aria-hidden="true" className="font-weight-800 text-lightblue cursor-pointer mt-1 mb-1" onClick={loadEmptyTd}>
                  <img src={addIcon} className="mr-2 mb-1" alt="addequipment" height="15" width="15" />
                  <span className="mr-5 font-family-tab font-14">Add Range</span>
                </div>
              </td>
            </tr>
            )}
            {(partsData && partsData.length > 0 && partsData.map((pl, index) => (

              <tr key={index}>
                <td className="p-2">
                  {index + 1}
                </td>
                <td className="p-2">
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DemoContainer components={['DatePicker']} sx={{ overflow: 'hidden' }}>
                      <DatePicker
                        minDate={
                            index === 0
                              ? (isPast ? undefined : dayjs()) // or just `dayjs().startOf('day')` if same-day is fine
                              : dayjs(partsData[index - 1].to_date).add(1, 'day')
                          }
                        // maxDate={index === 0 ? undefined : dayjs(deadline)}
                        localeText={{ todayButtonLabel: 'Now' }}
                        slotProps={{
                          actionBar: {
                            actions: ['accept'],
                          },
                          popper: {
                            modifiers: [
                              {
                                name: 'flip',
                                options: {
                                  fallbackPlacements: ['top'],
                                },
                              },
                              {
                                name: 'preventOverflow',
                                options: {
                                  boundary: 'window',
                                  altAxis: true,
                                },
                              },
                            ],
                          },
                          textField: {
                            inputRef: (input) => {
                              if (input) {
                                input.setAttribute('readonly', 'true');
                                input.onkeydown = (e) => e.preventDefault();
                              }
                            },
                          },
                        }}
                        disablePast={!isPast}
                        name="Start Date"
                        label="Start Date"
                        format="DD/MM/YYYY"
                        value={dayjs(pl.from_date)}
                        onChange={(e) => onPlannedStartChange(e, index)}
                        ampm={false}
                      />
                    </DemoContainer>
                  </LocalizationProvider>
                </td>
                <td className="p-2">
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DemoContainer components={['DatePicker']} sx={{ overflow: 'hidden' }}>
                      <DatePicker
                        minDate={dayjs(pl.from_date)}
                       // maxDate={dayjs(new Date(deadline))}
                        localeText={{ todayButtonLabel: 'Now' }}
                        slotProps={{
                          actionBar: {
                            actions: ['accept'],
                          },
                          popper: {
                            modifiers: [
                              {
                                name: 'flip',
                                options: {
                                  fallbackPlacements: ['top'],
                                },
                              },
                              {
                                name: 'preventOverflow',
                                options: {
                                  boundary: 'window',
                                  altAxis: true,
                                },
                              },
                            ],
                          },
                          textField: {
                            inputRef: (input) => {
                              if (input) {
                                input.setAttribute('readonly', 'true');
                                input.onkeydown = (e) => e.preventDefault();
                              }
                            },
                          },
                        }}
                        disablePast={!isPast}
                        disabled={pl.is_all_upcoming}
                        name="End Date"
                       // label="End Date"
                        format="DD/MM/YYYY"
                        value={pl.is_all_upcoming ? null : dayjs(pl.to_date)}
                        onChange={(e) => onPlannedEndChange(e, index)}
                        ampm={false}
                      />
                    </DemoContainer>
                  </LocalizationProvider>
                </td>
                {canUpcoming && (
                <td className="p-2" style={{ verticalAlign: 'middle' }}>
                  <Checkbox
                    sx={{
                      transform: 'scale(0.9)',
                      padding: '0px',
                    }}
                    className="ml-2"
                    disabled={!pl.from_date}
                    checked={pl.is_all_upcoming}
                    onChange={(e) => handleTableCellChange(e, index)}
                  />
                </td>
                )}
                <td className="p-2">
                  <span className="font-weight-400 d-inline-block" />
                  <FontAwesomeIcon className="mr-1 mt-3 ml-1 cursor-pointer" size="sm" icon={faTrashAlt} onClick={(e) => { removeData(e, index); }} />
                </td>
              </tr>

            )))}
          </tbody>
        </Table>
      </Col>
    </Row>

  );
});

export default ViewEvents;
