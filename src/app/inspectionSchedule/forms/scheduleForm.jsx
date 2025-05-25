/* eslint-disable import/no-unresolved */
/* eslint-disable camelcase */
/* eslint-disable react/jsx-props-no-spreading */
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Box, } from '@mui/system';
import { Typography } from '@mui/material';

import MuiCheckboxField from '../../commonComponents/formFields/muiCheckbox';
import { AddThemeColor } from '../../themes/theme'

const ScheduleForm = React.memo((props) => {
  const {
    editId,
    reloadData,
    setFieldValue,
    formField: {
      mo,
      tu,
      we,
      th,
      fr,
      sa,
      su,
      atStart,
      atDone,
      atReview,
      enforceTime,
      allowFuture,
      allowPast,
      nfcScanStart,
      nfcScanDone,
      qrScanStart,
      qrScanDone,
    },
  } = props;
  const [refresh, setRefresh] = useState(reloadData);

  useEffect(() => {
    setRefresh(reloadData);
  }, [reloadData]);

  useEffect(() => {
    if (refresh === '1' && !editId) {
      setFieldValue('mo', 0);
      setFieldValue('tu', 0);
      setFieldValue('we', 0);
      setFieldValue('th', 0);
      setFieldValue('fr', 0);
      setFieldValue('sa', 0);
      setFieldValue('su', 0);
    }
  }, [refresh, editId]);

  return (
    <>
      <Box sx={{ display: 'flex' }}>
        <Box
          sx={{
            width: "50%",
            marginTop: "20px",
          }}
        >
          <Typography
            sx={AddThemeColor({
              font: "normal normal medium 20px/24px Suisse Intl",
              letterSpacing: "0.7px",
              fontWeight: 500,
            })}
          >
            Exclude Days
          </Typography>
          <Box
            sx={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              gap: "3%",
              flexWrap: "wrap",
            }}
          >
            <MuiCheckboxField
              name={mo.name}
              label={mo.label}
            />
            <MuiCheckboxField
              name={tu.name}
              label={tu.label}
            />
            <MuiCheckboxField
              name={we.name}
              label={we.label}
            />
            <MuiCheckboxField
              name={th.name}
              label={th.label}
            />
            <MuiCheckboxField
              name={fr.name}
              label={fr.label}
            />
            <MuiCheckboxField
              name={sa.name}
              label={sa.label}
            />
            <MuiCheckboxField
              name={su.name}
              label={su.label}
            />
          </Box>
        </Box>
        <Box
          sx={{
            width: "50%",
            marginTop: "20px",
          }}
        >
          <Typography
            sx={AddThemeColor({
              font: "normal normal medium 20px/24px Suisse Intl",
              letterSpacing: "0.7px",
              fontWeight: 500,
            })}
          >
            Photo Required
          </Typography>
          <Box
            sx={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              gap: "3%",
              flexWrap: "wrap",
            }}
          >
            <MuiCheckboxField
              name={atStart.name}
              label={atStart.label}
            />
            <MuiCheckboxField
              name={atReview.name}
              label={atReview.label}
            />
            <MuiCheckboxField
              name={atDone.name}
              label={atDone.label}
            />
          </Box>
        </Box>
      </Box>
      <Box sx={{ display: 'flex' }}>
        <Box
          sx={{
            width: "50%",
            marginTop: "20px",
          }}
        >
          <Typography
            sx={AddThemeColor({
              font: "normal normal medium 20px/24px Suisse Intl",
              letterSpacing: "0.7px",
              fontWeight: 500,
            })}
          >
            Enforce Time
          </Typography>
          <Box
            sx={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              gap: "3%",
              flexWrap: "wrap",
            }}
          >
            <MuiCheckboxField
              name={enforceTime.name}
              label={enforceTime.label}
            />
            <MuiCheckboxField
              name={allowFuture.name}
              label={allowFuture.label}
            />
            <MuiCheckboxField
              name={allowPast.name}
              label={allowPast.label}
            />
          </Box>
        </Box>
        <Box
          sx={{
            width: "50%",
            marginTop: "20px",
          }}
        >
          <Typography
            sx={AddThemeColor({
              font: "normal normal medium 20px/24px Suisse Intl",
              letterSpacing: "0.7px",
              fontWeight: 500,
            })}
          >
            QR Scan
          </Typography>
          <Box
            sx={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              gap: "3%",
              flexWrap: "wrap",
            }}
          >
            <MuiCheckboxField
              name={qrScanStart.name}
              label={qrScanStart.label}
            />
            <MuiCheckboxField
              name={qrScanDone.name}
              label={qrScanDone.label}
            />
          </Box>
        </Box>
      </Box>
      <Box
        sx={{
          width: "50%",
          marginTop: "20px",
        }}
      >
        <Typography
          sx={AddThemeColor({
            font: "normal normal medium 20px/24px Suisse Intl",
            letterSpacing: "0.7px",
            fontWeight: 500,
          })}
        >
          NFC
        </Typography>
        <Box
          sx={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            gap: "3%",
            flexWrap: "wrap",
          }}
        >

          <MuiCheckboxField
            name={nfcScanStart.name}
            label={nfcScanStart.label}
          />
          <MuiCheckboxField
            name={nfcScanDone.name}
            label={nfcScanDone.label}
          />
        </Box>
      </Box>
    </>
  );
});

ScheduleForm.defaultProps = {
  editId: undefined,
};

ScheduleForm.propTypes = {
  formField: PropTypes.objectOf(PropTypes.object).isRequired,
  setFieldValue: PropTypes.oneOfType([PropTypes.func, PropTypes.string]).isRequired,
  editId: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.string,
    PropTypes.number,
    PropTypes.bool,
  ]),
  reloadData: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
};

export default ScheduleForm;
