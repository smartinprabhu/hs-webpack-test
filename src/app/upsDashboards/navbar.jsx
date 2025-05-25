/* eslint-disable react/jsx-no-useless-fragment */
/* eslint-disable import/no-unresolved */
import React from 'react';
import * as PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';

import searchActiveIcon from '@images/icons/search.svg';
// import cleanWhite from '@images/icons/assetBlue.svg';
import { getMenuItems } from '../util/appUtils';

const faIcons = {
  Insights: searchActiveIcon,
  InsightssACTIVE: searchActiveIcon,
};

const Navbar = (props) => {
  const { id } = props;
  const { userRoles } = useSelector((state) => state.user);
  const menuList = getMenuItems(userRoles && userRoles.data ? userRoles.data.allowed_modules : [], 'UPS', 'name');

  const history = useHistory();

  const handleChange = (event, newValue) => {
    if (newValue === 0) {
      history.push({ pathname: '/ups-summary-overview' });
    } else if (newValue === 1) {
      history.push({ pathname: '/ups-120kva-overview' });
    } else if (newValue === 2) {
      history.push({ pathname: '/ups1-20kva-overview' });
    } else if (newValue === 3) {
      history.push({ pathname: '/ups2-20kva-overview' });
    }
  };

  function a11yProps(index) {
    return {
      id: `simple-tab-${index}`,
      'aria-controls': `simple-tabpanel-${index}`,
    };
  }

  return (

    <>

      <Tabs
        value={id}
        onChange={handleChange}
        textColor="primary"
        indicatorColor="primary"
        aria-label="secondary tabs example"
        sx={{
          borderBottom: '1px solid #efefef',
        }}
      >
        {menuList && menuList.map((menu, index) => (
          <Tab
            sx={{
              textTransform: 'capitalize',
              fontFamily: 'Suisse Intl',
              fontWeight: '600',
            }}
            label={menu}
            {...a11yProps(index)}
          />
        ))}
      </Tabs>
    </>
  );
};

Navbar.propTypes = {
  id: PropTypes.number.isRequired,
};

export default Navbar;
