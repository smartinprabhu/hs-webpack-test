import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Box,
} from '@mui/material';

import Assets from './assets';
import SpaceBookingInfo from './spaceBookingInfo';
import Gauges from '../assetDetails/gauges';
import Meters from '../assetDetails/meters';
import Readings from '../assetDetails/readings';
import { setInitialValues } from '../../purchase/purchaseService';
import { TabPanel } from '../../util/appUtils';
import DetailViewTab from '../../commonComponents/detailViewTab';
import LocationDetailInfo from './locationDetailInfo';

const LocationDetailTabs = () => {
  const dispatch = useDispatch();
  const [currentTab, setActive] = useState('Assets');
  const { getSpaceInfo } = useSelector((state) => state.equipment);

  const navTabs = (item) => {
    dispatch(setInitialValues(false, false, false, false));
    if (item.name !== 'Notes') {
      setActive(item.name);
    } else {
      return null;
    }
  }
  const [value, setValue] = useState(0);

  const tabs = ['BASIC INFORMATION', 'ASSETS', 'READINGS', 'SPACE BOOKING']

  const handleTabChange = (event, newValue) => {
    setValue(newValue);
  };
  return (
    <>
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
          <TabPanel value={value} index={0} sx={{ background: 'white', border: '1px solid lightgrey',height:'1000px' }}>
            <LocationDetailInfo />
          </TabPanel>
          <TabPanel value={value} index={1} sx={{ background: 'white', border: '1px solid lightgrey',height:'1000px' }}>
            <Assets />
          </TabPanel>
          <TabPanel value={value} index={2} sx={{ background: 'white', border: '1px solid lightgrey',height:'1000px' }}>
            <Readings ids={getSpaceInfo?.data?.[0]?.reading_lines_ids} viewId={(getSpaceInfo && getSpaceInfo.data && getSpaceInfo.data.length > 0) ? getSpaceInfo.data[0].id : ''} type="space" />
          </TabPanel>
          <TabPanel value={value} index={3} sx={{ background: 'white', border: '1px solid lightgrey' ,height:'1000px'}}>
            <SpaceBookingInfo />
          </TabPanel>
          <TabPanel value={value} index={4} sx={{ background: 'white', border: '1px solid lightgrey' ,height:'1000px'}}>
            <Gauges ids={getSpaceInfo?.data?.[0]?.gauge_lines_ids} type="space" />
          </TabPanel>
          <TabPanel value={value} index={5} sx={{ background: 'white', border: '1px solid lightgrey' ,height:'1000px'}}>
            <Meters ids={getSpaceInfo?.data?.[0]?.meter_lines_ids} type="space" />
          </TabPanel>
        </Box>
      </Box>
    </>
  );
};

export default LocationDetailTabs;
