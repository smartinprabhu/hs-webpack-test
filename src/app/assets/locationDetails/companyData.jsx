/* eslint-disable import/no-unresolved */
import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import * as PropTypes from 'prop-types';
import {
  IconButton, Typography, Menu, Box, MenuItem, Dialog, DialogContent,
} from '@mui/material';
import { BsThreeDotsVertical } from 'react-icons/bs';

import companyBuilding from '@images/building.jpg';
import locationIcon from '@images/icons/locationBlack.svg';
import ErrorContent from '@shared/errorContent';
import CompanyDataInfo from './companyDataInfo';
import { getDefaultNoValue, TabPanel, generateErrorMessage } from '../../util/appUtils';
import {
  resetCreateSpace,
} from '../equipmentService';

import DetailViewHeader from '../../commonComponents/detailViewHeader';
import DetailViewTab from '../../commonComponents/detailViewTab';
import DetailViewLeftPanel from '../../commonComponents/detailViewLeftPanel';
import { AddThemeColor } from '../../themes/theme';
import DialogHeader from '../../commonComponents/dialogHeader';
import AddLocation from './addLocation';
import { detailViewHeaderClass } from '../../commonComponents/utils/util';

const CompanyData = ({ collapse }) => {
  const dispatch = useDispatch();

  const { userInfo } = useSelector((state) => state.user);
  const { companyDetail } = useSelector((state) => state.setup);
  const { createSpaceInfo } = useSelector((state) => state.equipment);

  const isUserError = (userInfo && userInfo.err) || (companyDetail && companyDetail.err);
  const isUserLoading = (userInfo && userInfo.loading) || (companyDetail && companyDetail.loading);
  const userErrorMsg = generateErrorMessage(userInfo);
  const errorMsg = (companyDetail && companyDetail.err) ? generateErrorMessage(companyDetail) : userErrorMsg;

  const [anchorEl, setAnchorEl] = useState(null);
  const [value, setValue] = useState(0);
  const [addLocationModal, showAddLocationModal] = useState(false);

  const tabs = ['BASIC INFORMATION']

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleTabChange = (event, newValue) => {
    setValue(newValue);
  };
  const onReset = () => {
    dispatch(resetCreateSpace());
  };
  const open = Boolean(anchorEl);

  const companyInfoArray = [
    {
      property: 'Company Name',
      value: getDefaultNoValue(companyDetail.data[0].name)
    },
    {
      property: 'Address',
      value: getDefaultNoValue(companyDetail.data[0].street)
    },
    {
      property: 'Category',
      value: getDefaultNoValue(companyDetail.data[0].res_company_categ_id[1])
    },
    {
      property: 'Currency',
      value: getDefaultNoValue(companyDetail.data[0].currency_id[1])
    },
    {
      property: 'Time Zone',
      value: getDefaultNoValue(companyDetail.data[0].company_tz)
    },
    {
      property: 'Website',
      value: getDefaultNoValue(companyDetail.data[0].website)
    }
  ]
  return (
    <>
      <Box>
        <DetailViewHeader
          mainHeader={`Site Overview - ${companyDetail.data[0].name} (${companyDetail.data[0].code})`}
          subHeader={companyDetail.data[0].name}
          extraHeader={companyDetail.data[0].code}
          actionComponent={(
            <Box>
              <IconButton
                sx={{
                  margin: '0px 5px 0px 5px',
                }}
                id="demo-positioned-button"
                aria-controls={open ? 'demo-positioned-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
                onClick={handleMenuClick}
              >
                <BsThreeDotsVertical color="#ffffff" />
              </IconButton>
              <Menu
                id="demo-positioned-menu"
                aria-labelledby="demo-positioned-button"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'left',
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'left',
                }}
              >
                <MenuItem
                  sx={{
                    font: 'normal normal normal 15px Suisse Intl',
                  }}
                  id="switchAction"
                  className="pl-2"
                  onClick={() => { showAddLocationModal(true); handleClose() }}
                >
                  Add New Location
                </MenuItem>
              </Menu>
            </Box>
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
            <TabPanel value={value} index={0} sx={{ background: 'white', border: '1px solid lightgrey', height: '1000px' }}>

              <DetailViewLeftPanel
                panelData={[{
                  header: 'COMPANY INFO',
                  leftSideData: companyInfoArray
                }
                ]}
              />
              <Typography
                sx={detailViewHeaderClass}
              >
                COMPANY IMAGE
              </Typography>
              <img src={companyDetail.data[0].logo ? `data:image/png;base64,${companyDetail.data[0].logo}` : companyBuilding} alt="logo" width="100" height="100" />
            </TabPanel>
          </Box>
        </Box>
        <Dialog size="lg" fullWidth={createSpaceInfo && createSpaceInfo.data?false:true} open={addLocationModal}>
          <DialogHeader title={"Add Location"} imagePath={locationIcon} onClose={() => { showAddLocationModal(false); onReset(); }} />
          <DialogContent>
            <AddLocation
              spaceCategory={false}
              afterReset={() => { showAddLocationModal(false); onReset(); }}
              spaceId={false}
              pathName={companyDetail && companyDetail.data ? companyDetail.data[0].code : false}
            />
          </DialogContent>
        </Dialog>
      </Box>
    </>
  );
};
CompanyData.propTypes = {
  collapse: PropTypes.bool,
};
CompanyData.defaultProps = {
  collapse: false,
};

export default CompanyData;
