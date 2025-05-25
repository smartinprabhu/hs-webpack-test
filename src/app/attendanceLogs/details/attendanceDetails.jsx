/* eslint-disable max-len */
import { Box } from '@mui/system';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import DetailViewHeader from '../../commonComponents/detailViewHeader';
import DetailViewLeftPanel from '../../commonComponents/detailViewLeftPanel';
import DetailViewTab from '../../commonComponents/detailViewTab';
import {
  TabPanel,
  extractNameObject,
  getBoolean,
  getDefaultNoValue,
  truncate,
} from '../../util/appUtils';

const AttendanceDetails = () => {
  const {
    attendanceDetailsInfo,
  } = useSelector((state) => state.attendance);
  const [value, setValue] = useState(0);

  const tabs = ['Attendance Overview'];

  const detailedData = attendanceDetailsInfo && attendanceDetailsInfo.data && attendanceDetailsInfo.data.length
    ? attendanceDetailsInfo.data[0]
    : false;

  const handleTabChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    detailedData && (
    <Box>
      <DetailViewHeader
        mainHeader={getDefaultNoValue(detailedData.employee_id && detailedData.employee_id[1])}
        subHeader={getDefaultNoValue(detailedData.type)}
        extraHeader={(
          <>
            Time Stamp
            -
            {' '}
            {getDefaultNoValue((detailedData.timestamp))}
          </>
              )}
      />
      <Box
        sx={{
          width: '100%',
          display: 'flex',
          height: '100%',
        }}
      >
        <Box
          sx={{
            width: '100%',
          }}
        >
          <DetailViewTab
            value={value}
            handleChange={handleTabChange}
            tabs={tabs}
          />
          <TabPanel value={value} index={0}>
            <DetailViewLeftPanel
              panelData={[
                {
                  header: 'General Information',
                  leftSideData:
                          [
                            {
                              property: 'Attendance Device',
                              value: getDefaultNoValue(detailedData.device_id && detailedData.device_id[1]),
                            },
                            {
                              property: 'Vendor',
                              value: getDefaultNoValue(detailedData.vendor_id && detailedData.vendor_id[1]),
                            },
                          ],
                  rightSideData:
                          [
                            {
                              property: 'Department',
                              value: getBoolean(detailedData.department_id),
                            },
                          ],
                },
              ]}
            />
          </TabPanel>
        </Box>
      </Box>
    </Box>
    )
  );
};
export default AttendanceDetails;
