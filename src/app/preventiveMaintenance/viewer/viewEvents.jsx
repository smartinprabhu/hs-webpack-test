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

import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import Button from '@mui/material/Button';
import DialogActions from '@mui/material/DialogActions';
import Box from '@mui/material/Box';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import isoWeek from 'dayjs/plugin/isoWeek';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faTrashAlt,
} from '@fortawesome/free-solid-svg-icons';

dayjs.extend(isoWeek);

const ViewEvents = React.memo(({
  setFieldValue, readOnly, events, onClose, deadline,
}) => {
  const [partsData, setPartsData] = useState(events);
  const [triggerChange, setTriggerChange] = useState('');
  const [orgData, setOriginal] = useState(JSON.stringify(events));

  /* useEffect(() => {
    setFieldValue('bulk_events', partsData);
  }, [triggerChange]); */

  useEffect(() => {
    setOriginal(JSON.stringify(events));
  }, [events]);

  const removeData = (e, index) => {
    const newItems = [...partsData];
    newItems.splice(index, 1);
    setPartsData(newItems);
    setTriggerChange(Math.random());
  };

  const onReset = () => {
    setPartsData(JSON.parse(orgData));
    setTriggerChange(Math.random());
  };

  const onSave = () => {
    setFieldValue(partsData);
    onClose();
  };

  const onPlannedStartChange = (e, index) => {
    const newData = partsData;
    const weekStart = dayjs(e).startOf('isoWeek');
    const weekEnd = dayjs(e).endOf('isoWeek');
    newData[index].start = weekStart;
    newData[index].end = weekEnd;
    setPartsData(newData);
    setTriggerChange(Math.random());
  };

  const onPlannedEndChange = (e, index) => {
    const newData = partsData;
    const weekEnd = dayjs(e).endOf('isoWeek');
    const weekStart = dayjs(e).startOf('isoWeek');
    newData[index].start = weekStart;
    newData[index].end = weekEnd;
    setPartsData(newData);
    setTriggerChange(Math.random());
  };

  return (
    <>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          <Box
            sx={{
              width: '100%',
              height: '100%',
              padding: '20px',
              display: 'flex',
              flexDirection: 'column',
              gap: '10%',
              fontFamily: 'Suisse Intl',
            }}
          >

            <Row>
              <Col xs={12} sm={12} md={12} lg={12} className="">
                <Table id="spare-part">
                  <thead className="bg-lightblue">
                    <tr>
                      <th className="p-2 border-0">
                        #
                      </th>
                      <th className="p-2 min-width-250 border-0">
                        Planned Start Date
                      </th>
                      <th className="p-2 min-width-250 border-0">
                        Planned End Date
                      </th>
                      {!readOnly && (
                      <th className="p-2 min-width-100 border-0">
                        <span className="">Delete</span>
                      </th>
                      )}
                    </tr>
                  </thead>
                  <tbody>

                    {(partsData && partsData.length > 0 && partsData.map((pl, index) => (

                      <tr key={index}>
                        <td className="p-2">
                          {index + 1}
                        </td>
                        <td className="p-2">
                          <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DemoContainer components={['DatePicker']} sx={{ overflow: 'hidden' }}>
                              <DatePicker
                                minDate={dayjs(new Date())}
                                maxDate={dayjs(deadline)}
                                localeText={{ todayButtonLabel: 'Now' }}
                                slotProps={{
                                  actionBar: {
                                    actions: ['accept'],
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
                                disablePast
                                disabled={!!readOnly}
                                name="Planned Start Date"
                                label="Planned Start Date"
                                format="DD/MM/YYYY"
                                value={dayjs(pl.start)}
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
                                minDate={dayjs(pl.start)}
                                maxDate={dayjs(new Date(deadline))}
                                localeText={{ todayButtonLabel: 'Now' }}
                                slotProps={{
                                  actionBar: {
                                    actions: ['accept'],
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
                                disabled={!!readOnly}
                                disablePast
                                name="Planned End Date"
                                label="Planned End Date"
                                format="DD/MM/YYYY"
                                value={dayjs(pl.end)}
                                onChange={(e) => onPlannedEndChange(e, index)}
                                ampm={false}
                              />
                            </DemoContainer>
                          </LocalizationProvider>
                        </td>
                        {!readOnly && (
                        <td className="p-2">
                          <span className="font-weight-400 d-inline-block" />
                          <FontAwesomeIcon className="mr-1 mt-3 ml-1 cursor-pointer" size="sm" icon={faTrashAlt} onClick={(e) => { removeData(e, index); }} />
                        </td>
                        )}
                      </tr>

                    )))}
                  </tbody>
                </Table>
              </Col>
            </Row>

          </Box>
        </DialogContentText>
      </DialogContent>
      {!readOnly && (
      <DialogActions>
        <Button
          type="button"
          variant="contained"
          className="reset-btn mr-2"
          onClick={() => onReset()}
        >
          Reset

        </Button>
        <Button
          type="button"
          variant="contained"
          className="submit-btn"
          onClick={() => onSave()}
        >
          Save

        </Button>
      </DialogActions>
      )}
    </>
  );
});

export default ViewEvents;
