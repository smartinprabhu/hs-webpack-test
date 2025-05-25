import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import IconButton from '@material-ui/core/IconButton';
import { Container } from '@mui/system';
import { useSelector, useDispatch } from 'react-redux';

import {
  Button, Dialog, Divider, Typography, DialogContent, DialogContentText, DialogActions,
} from '@mui/material';
import { IoCloseOutline } from 'react-icons/io5';

import userSwitchCompany from './headerService';

const SwitchLcationConfirmationComponent = (
  { switchLocationModalWindowopen, setSwitchLocationModalOpen, switchCompanyDetails },
) => {
  const { userInfo } = useSelector((state) => state.user);
  const { switchCompanyInfo } = useSelector((state) => state.header);
  const dispatch = useDispatch();

  const isSuccess = switchCompanyInfo && switchCompanyInfo.data && (switchCompanyInfo.data.data || switchCompanyInfo.data.status);

  const switchLocation = () => {
    const switchLocationObj = {
      user_id: userInfo.data.id,
      company_id: switchCompanyDetails.id,
    };
    dispatch(userSwitchCompany(switchLocationObj));
  };
  const successSwitchLocation = () => {
    window.location.reload();
  };

  useEffect(() => {
    if (switchCompanyInfo && switchCompanyInfo.data && (switchCompanyInfo.data.data || switchCompanyInfo.data.status)) {
      successSwitchLocation();
    }
  }, [switchCompanyInfo]);

  return (
    <Dialog
      sx={{
        '& .MuiDialog-container': {
          "& .MuiPaper-root": {
            width: "100%",
            maxWidth: "500px",  // Set your width here
          },
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-start',
        },
      }}
      open={switchLocationModalWindowopen}
    >
      <Container
        sx={{
          '&.MuiContainer-root': {
            padding: '0px 0px 0px 15px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          },
        }}
      >
        <Typography
          sx={{
            font: 'normal normal normal 20px Suisse Intl',
            fontWeight: '600',
          }}
        >
          Switch Company
        </Typography>

        <IconButton onClick={setSwitchLocationModalOpen}>
          <IoCloseOutline />
        </IconButton>
      </Container>
      <DialogContent>
        <DialogContentText id="alert-dialog-description" >
          {!isSuccess && (
            <>
              <Typography
                sx={{
                  font: 'normal normal normal 16px Suisse Intl',
                  fontweight: '600',
                  padding: '10px',
                  textAlign: 'center'
                }}
              >
                Are you sure, you want to switch to
              </Typography>

              <Typography
                sx={{
                  font: 'normal normal normal 25px Suisse Intl',
                  padding: '10px',
                  fontWeight: '600',
                  textAlign: 'center'
                }}
              >
                {switchCompanyDetails.name}
              </Typography>
            </>
          )}
          {switchCompanyInfo && switchCompanyInfo.error && switchCompanyInfo.error.message && (
            <p className="text-center error-msg">
              {switchCompanyInfo.error.message}
            </p>
          )}
          {isSuccess && (
            <p className="text-center text-success">
              You&apos;re now in
              {' '}
              {switchCompanyDetails.name}
            </p>
          )}
        </DialogContentText>
      </DialogContent>
      <Divider />
      <DialogActions>
        {!isSuccess &&
          <Button
            onClick={switchLocation}
            variant='contained'
            className="normal-btn"
            disabled={switchCompanyInfo && switchCompanyInfo.loading}
          >
            Confirm
          </Button>
        }

      </DialogActions>
    </Dialog >
  );
};

SwitchLcationConfirmationComponent.propTypes = {
  switchLocationModalWindowopen: PropTypes.bool.isRequired,
  setSwitchLocationModalOpen: PropTypes.func.isRequired,
  switchCompanyDetails: PropTypes.shape({
    id: PropTypes.number,
    locality: PropTypes.string,
    name: PropTypes.string,
    postal_code: PropTypes.string,
    street_address: PropTypes.string,
  }).isRequired,
};

export default SwitchLcationConfirmationComponent;
