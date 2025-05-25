import React, { useState, useEffect, useMemo } from 'react';
import { useHistory } from 'react-router';
import {
  Typography, Divider, Menu,
} from '@mui/material';
import { IoLogOutOutline } from 'react-icons/io5';

import IconButton from '@material-ui/core/IconButton';
import Avatar from '@mui/material/Avatar';
import { useDispatch, useSelector } from 'react-redux';
import MenuItem from '@mui/material/MenuItem';

import userImage from '@images/userProfile.jpeg';
import MuiTooltip from '@shared/muiTooltip';

import AuthService from '../../util/authService';
import { logout } from '../../auth/auth';
import { detectMimeType } from '../../util/appUtils';

const appConfig = require('../../config/appConfig').default;

const authService = AuthService();

const HeaderProfile = ({ handleHideHeader }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const { userInfo } = useSelector((state) => state.user);
  const [profileImage, setProfileImage] = useState(false);

  const dispatch = useDispatch();
  const history = useHistory();

  const open = Boolean(anchorEl);

  const WEBAPPAPIURL = `${appConfig.WEBAPIURL}/`;
  const ISAPIGATEWAY = appConfig.IS_USE_APIGATEWAY;

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleRedirect = () => {
    history.push('/user-profile');
    handleHideHeader();
  };

  const convertToBase64 = async (url, headers) => {
    try {
      const response = await fetch(url, { headers });
      if (!response.ok) {
        throw new Error(`Failed to fetch image, status ${response.status}`);
      }
      const blob = await response.blob();

      // Ensure reader is properly awaited
      const base64Data = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });

      // Store base64 data in local storage
      setProfileImage(base64Data);
    } catch (error) {
      console.error('Error converting image to base64:', error);
      setProfileImage(false);
    }
  };

  useMemo(() => {
    if (userInfo && userInfo.data && userInfo.data.image_url) {
      const clogo = userInfo.data.image_url;
      /* const headers = {
        portalDomain: window.location.origin === 'http://localhost:3010' ? 'https://portal-dev.helixsense.com' : window.location.origin,
      };
      convertToBase64(getBaseDomain(clogo), headers); */
      setProfileImage(`data:${detectMimeType(clogo)};base64,${clogo}`);
    } else {
      setProfileImage(false);
    }
  }, [userInfo]);

  const userInformation = userInfo;

  const dispatchLogout = () => {
    if (authService.getGatewaySession() && ISAPIGATEWAY === 'true') {
      history.push({ pathname: '/' });
      const config = {
        method: 'get',
        url: `${WEBAPPAPIURL}auth/logout`,
        withCredentials: true,
        headers: { Authorization: `Bearer ${authService.getAccessToken()}` },
      };
      setLogoutInfo({
        loading: true,
        data: null,
        err: null,
      });
      axios(config)
        .then((response) => {
          dispatch(logout());
          setLogoutInfo({
            loading: false,
            data: true,
            err: null,
          });
        })
        .catch((error) => {
          setLogoutInfo({
            loading: false,
            data: null,
            err: error,
          });
        });
    } else {
      history.push({ pathname: '/' });
      dispatch(logout());
    }
    window.localStorage.setItem('isAllCompany', 'no');
  };

 /* useEffect(() => {
    if (userInfo && userInfo.err) {
      dispatchLogout();
    }
  }, [userInfo]); */

  const handleLogout = () => {
    console.log('logout');
    dispatchLogout();
    /* try {
      if (appConfig.ONESIGNALAPPID && appConfig.ENV && appConfig.WEBAPIURL) {
        window.OneSignal = window.OneSignal || [];
        OneSignal.push(() => {
          OneSignal.getTags((tags) => {
            const oneSignalTags = Object.keys(tags);
            if (oneSignalTags && oneSignalTags.length > 0) {
              OneSignal.deleteTags(oneSignalTags, () => {
                dispatchLogout();
              })
                .then(() => {
                  dispatchLogout();
                })
                .catch(() => {
                  dispatchLogout();
                });
            } else {
              dispatchLogout();
            }
          })
            .then(() => {
              dispatchLogout();
            })
            .catch(() => {
              dispatchLogout();
            });
        });
      } else {
        dispatchLogout();
      }
      dispatchLogout();
    } catch (e) {
      dispatchLogout();
      console.log(e);
    } */
  };

  return (
    <>
      <MuiTooltip title={<Typography>Profile</Typography>}>
        <div onClick={handleClick} className="profile">
          {console.log('profile rendered')}

          <IconButton size="small">
            <Avatar
              sx={{
                height: '35px',
                width: '35px',
              }}
              src={profileImage || userImage}
              alt="profile"
            />
          </IconButton>
          <p className="profile-name">
            {userInformation.data.name ? userInformation.data.name : ''}
          </p>
        </div>
      </MuiTooltip>
      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        PaperProps={{
          elevation: 0,
          sx: {
            // height: "250px",
            width: '150px',
            overflow: 'visible',
            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
            mt: 1,
            '& .MuiAvatar-root': {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1,
            },
            '&:before': {
              content: '""',
              display: 'block',
              position: 'absolute',
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: 'background.paper',
              transform: 'translateY(-50%) rotate(45deg)',
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        {/* <MenuItem
          sx={{
            font: "normal normal normal 15px Suisse Intl",
          }}
          onClick={handleClose}
        >
          My account
        </MenuItem> */}
        <MenuItem
          sx={{
            font: 'normal normal normal 15px Suisse Intl',
          }}
          onClick={handleRedirect}
        >
          Profile
        </MenuItem>
        <Divider />
        <MenuItem
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            font: 'normal normal normal 15px Suisse Intl',
          }}
          onClick={handleLogout}
        >
          Logout
          {' '}
          <IoLogOutOutline size={20} />
        </MenuItem>
      </Menu>
    </>
  );
};

export default HeaderProfile;
