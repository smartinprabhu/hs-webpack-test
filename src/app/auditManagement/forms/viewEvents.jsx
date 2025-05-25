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

import moment from 'moment';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import Button from '@mui/material/Button';
import DialogActions from '@mui/material/DialogActions';
import Box from '@mui/material/Box';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faTrashAlt,
} from '@fortawesome/free-solid-svg-icons';

const ViewEvents = React.memo(({
  setFieldValue, events, onClose, deadline,
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
    setFieldValue('bulk_events', partsData);
    onClose();
  };

  const onPlannedStartChange = (e, index) => {
    const newData = partsData;
    newData[index].planned_start_date = e;
    setPartsData(newData);
    setTriggerChange(Math.random());
  };

  const onPlannedEndChange = (e, index) => {
    const newData = partsData;
    newData[index].planned_end_date = e;
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

                      <th className="p-2 min-width-100 border-0">
                        <span className="">Delete</span>
                      </th>
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
                            <DemoContainer components={['DateTimePicker']} sx={{ overflow: 'hidden' }}>
                              <DateTimePicker
                                minDateTime={dayjs(new Date())}
                                maxDateTime={dayjs(deadline)}
                                localeText={{ todayButtonLabel: 'Now' }}
                                slotProps={{
                                  actionBar: {
                                    actions: ['accept'],
                                  },
                                }}
                                disablePast
                                name="Planned Start Date"
                                label="Planned Start Date"
                                format="DD/MM/YYYY HH:mm:ss"
                                value={dayjs(pl.planned_start_date)}
                                onChange={(e) => onPlannedStartChange(e, index)}
                                ampm={false}
                              />
                            </DemoContainer>
                          </LocalizationProvider>
                        </td>
                        <td className="p-2">
                          <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DemoContainer components={['DateTimePicker']} sx={{ overflow: 'hidden' }}>
                              <DateTimePicker
                                minDateTime={dayjs(pl.planned_start_date)}
                                maxDateTime={dayjs(new Date(deadline))}
                                localeText={{ todayButtonLabel: 'Now' }}
                                slotProps={{
                                  actionBar: {
                                    actions: ['accept'],
                                  },
                                }}
                                disablePast
                                name="Planned Start Date"
                                label="Planned End Date"
                                format="DD/MM/YYYY HH:mm:ss"
                                value={dayjs(pl.planned_end_date)}
                                onChange={(e) => onPlannedEndChange(e, index)}
                                ampm={false}
                              />
                            </DemoContainer>
                          </LocalizationProvider>
                        </td>

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

          </Box>
        </DialogContentText>
      </DialogContent>
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

    </>
  );
});

export default ViewEvents;
