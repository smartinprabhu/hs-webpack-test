import React from 'react';
import { Box } from '@mui/system';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { a11yProps } from '../util/appUtils';

import { DetailViewTabsBackground, DetailViewTabsIndicator, DetailViewTabsColor } from '../themes/theme';

const DetailViewTab = (props) => {
  const { value, handleChange, tabs } = props;
  return (
    <Box sx={{
      borderBottom: 1, borderColor: 'divider', position: 'sticky', top: 0, zIndex: 1000,
    }}
    >
      <Tabs
        value={value}
        onChange={handleChange}
        aria-label="basic tabs example"
        sx={DetailViewTabsBackground({
          height: '50px',
        })}
        textColor="secondary"
        TabIndicatorProps={{
          sx: DetailViewTabsIndicator({
            height: '5px',
          }),
        }}
      >
        {tabs
                    && tabs.length
                    && tabs.map((tab) => (
                      <Tab
                        sx={DetailViewTabsColor({
                          textTransform: 'capitalize',
                        })}
                        label={tab}
                        {...a11yProps(0)}
                      />
                    ))}
      </Tabs>
    </Box>
  );
};

export default DetailViewTab;
