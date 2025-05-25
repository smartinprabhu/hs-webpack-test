/* eslint-disable import/no-unresolved */
/* eslint-disable react/no-danger */
import React, { useEffect } from 'react';
import {
  Table,
} from 'reactstrap';
import { useSelector, useDispatch } from 'react-redux';
import { Box } from '@material-ui/core';
import Loader from '@shared/loading';
import ErrorContent from '@shared/errorContent';
import { getOrderTimeSheets } from '../workorderService';
import {
  calculateTimeDifference, getDefaultNoValue, generateErrorMessage, convertNumToTime,
  convertFloatToTime,
  getCompanyTimezoneDate,
} from '../../util/appUtils';

const appModels = require('../../util/appModels').default;

const Timesheets = () => {
  const dispatch = useDispatch();

  const { workorderDetails, orderTimeSheets } = useSelector((state) => state.workorder);
  const { userInfo } = useSelector((state) => state.user);

  useEffect(() => {
    if (workorderDetails && workorderDetails.data) {
      const ids = workorderDetails.data.length > 0 ? workorderDetails.data[0].mro_timesheet_ids : [];
      dispatch(getOrderTimeSheets(ids, appModels.TIMESHEET));
    }
  }, [workorderDetails]);

  function getHoursOfDates(startDate, endDate) {
    let res = 0.00;
    if (startDate && endDate) {
      const decimalHours = parseFloat(calculateTimeDifference(startDate, endDate));
      if (decimalHours > 1) {
        res = `${convertNumToTime(decimalHours)} (${convertFloatToTime(decimalHours)})`;
      } else {
        res = convertNumToTime(decimalHours);
      }
    }
    return res;
  }

  function getRow(assetData) {
    const tableTr = [];
    for (let i = 0; i < assetData.length; i += 1) {
      tableTr.push(
        <tr key={i}>
          <td className="p-2">{getDefaultNoValue(getCompanyTimezoneDate(assetData[i].start_date, userInfo, 'datetime'))}</td>
          <td className="p-2">{getDefaultNoValue(getCompanyTimezoneDate(assetData[i].end_date, userInfo, 'datetime'))}</td>
          <td className="p-2">{getDefaultNoValue(assetData[i].reason)}</td>
          <td className="p-2">{getDefaultNoValue(assetData[i].latitude)}</td>
          <td className="p-2">{getDefaultNoValue(assetData[i].longitude)}</td>
          <td className="p-2">
            {getHoursOfDates(assetData[i].start_date, assetData[i].end_date)}
          </td>
        </tr>,
      );
    }
    return tableTr;
  }

  const createNewArray = (array) => {
    if (array.length < 2) {
      return array;
    }

    const firstObject = array[0];
    const lastObject = array[array.length - 1];

    return [
      {
        ...lastObject,
        start_date: firstObject.start_date,
      },
    ];
  };

  const TotalHours = () => (
    <>
      Total Hours
      {' '}
      <span className="font-10">(Approx. ±1 min)</span>
    </>
  );

  return (
    <Box
      sx={{
        fontFamily: 'Suisse Intl',
      }}
    >
      <div className="p-3 comments-list thin-scrollbar">
        <div>
          <Table responsive className="mb-0 mt-2 border-0 bg-white assets-table" width="100%">
            <thead>
              <tr>
                <th className="p-2 min-width-200">
                  Start Date
                </th>
                <th className="p-2 min-width-200">
                  End Date
                </th>
                <th className="p-2 min-width-100">
                  Reason
                </th>
                <th className="p-2 min-width-100">
                  Latitude
                </th>
                <th className="p-2 min-width-100">
                  Longitude
                </th>
                <th className="p-2 min-width-200">
                  {TotalHours()}
                </th>
              </tr>
            </thead>
            <tbody>
              {getRow(orderTimeSheets && orderTimeSheets.data ? createNewArray(orderTimeSheets.data) : [])}
            </tbody>
          </Table>
          <hr className="m-0" />
        </div>
        {orderTimeSheets && orderTimeSheets.loading && (
          <Loader />
        )}
        {(orderTimeSheets && orderTimeSheets.err) && (
          <ErrorContent errorTxt={generateErrorMessage(orderTimeSheets)} />
        )}
      </div>
    </Box>
  );
};

export default Timesheets;
