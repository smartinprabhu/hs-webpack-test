import React, { useState } from 'react';
import { Box } from '@mui/system';
import {
  IconButton, Divider, Typography, Menu, MenuItem,
} from '@mui/material';
import { IoClose, IoArrowBackOutline, IoArrowForwardOutline } from 'react-icons/io5';
import { BsStars, BsThreeDotsVertical } from 'react-icons/bs';

import MuiTooltip from '@shared/muiTooltip';

import { AddThemeColor } from '../themes/theme';
import { useTheme } from '../ThemeContext';

const DrawerHeader = (props) => {
  const {
    headerName, isAI, clearHistory, isNoCloseButton, onClose, imagePath, onNext, onPrev, loading, subTitle,
  } = props;
  const { themes } = useTheme();

  const [anchorEl, setAnchorEl] = useState(null);

  const open = Boolean(anchorEl);

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <Box
        sx={{
          padding: '15px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          width: '100%',
        }}
      >
        <Typography
          sx={{
            font: isAI ? 'normal normal normal 18px/29px Suisse Intl' : 'normal normal normal 22px/29px Suisse Intl',
            letterSpacing: '0px',
            color: '#000000DE',
          }}
          className="drawer-header-title"
        >
          {imagePath && (
          <img
            alt={headerName}
            width="25"
            height="25"
            className="mr-2 font-weight-700"
            src={imagePath}
          />
          )}
          {isAI && (
            <BsStars size={20} color={themes === 'light' ? '#000000' : AddThemeColor({}).color} className="mr-2" />
          )}
          <span>{headerName}</span>
          {subTitle && (
          <Typography
            sx={{
              font: 'normal normal normal 22px/29px Suisse Intl',
              fontSize: '12px',
              marginLeft: imagePath ? '30px' : '2px',
              letterSpacing: '0px',
              color: '#000000DE',
            }}
          >
            {subTitle}
          </Typography>
          )}
        </Typography>
        <span className="float-right">
          {!loading && onNext && (
          <>
            <MuiTooltip title={<Typography>Prev</Typography>}>
              <IconButton onClick={onPrev}>
                <IoArrowBackOutline />
              </IconButton>
            </MuiTooltip>
            <MuiTooltip title={<Typography>Next</Typography>}>
              <IconButton onClick={onNext}>
                <IoArrowForwardOutline />
              </IconButton>
            </MuiTooltip>
          </>

          )}
          {isAI && (
            <>
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
                <BsThreeDotsVertical />
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
                  onClick={() => { clearHistory(); handleClose(); }}
                >
                  Clear History
                </MenuItem>

              </Menu>
            </>
          )}
          {!isNoCloseButton && (
          <MuiTooltip title={<Typography>Close</Typography>}>
            <IconButton onClick={onClose}>
              <IoClose />
            </IconButton>
          </MuiTooltip>
          )}
        </span>
      </Box>
      {isAI && (
      <Divider sx={{ borderWidth: '1px ' }} />
      )}
      {/* <Divider /> */}
    </>
  );
};

export default DrawerHeader;
