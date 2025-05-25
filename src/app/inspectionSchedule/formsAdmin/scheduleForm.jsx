/* eslint-disable import/no-unresolved */
/* eslint-disable camelcase */
/* eslint-disable react/jsx-props-no-spreading */
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Box } from '@mui/system';
import { Typography } from '@mui/material';

import MuiCheckboxField from '../../commonComponents/multipleFormFields/muiCheckbox';
import { AddThemeColor } from '../../themes/theme';

const ScheduleForm = React.memo((props) => {
  const {
    editId,
    reloadData,
    index,
    formData,
    setPartsData,
    partsData,
    setPartsAdd,
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

  return (
    <>
      <Box sx={{ display: 'flex', gap: '6%' }}>
        <Box
          sx={{
            width: '50%',
            marginTop: '20px',
          }}
        >
          <Typography
            sx={AddThemeColor({
              font: 'normal normal medium 20px/24px Suisse Intl',
              letterSpacing: '0.7px',
              fontWeight: 500,
            })}
          >
            Exclude Days
          </Typography>
          <small>Select any days you would like to exclude from the scheduling options</small>
          <Box
            sx={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              gap: '3%',
              flexWrap: 'wrap',
            }}
          >
            <MuiCheckboxField
              setPartsData={setPartsData}
              partsData={partsData}
              setPartsAdd={setPartsAdd}
              index={index}
              formData={formData}
              name={mo.name}
              field={mo.name}
              label={mo.label}
            />
            <MuiCheckboxField
              setPartsData={setPartsData}
              partsData={partsData}
              setPartsAdd={setPartsAdd}
              index={index}
              formData={formData}
              name={tu.name}
              label={tu.label}
            />
            <MuiCheckboxField
              setPartsData={setPartsData}
              partsData={partsData}
              setPartsAdd={setPartsAdd}
              index={index}
              formData={formData}
              name={we.name}
              label={we.label}
            />
            <MuiCheckboxField
              setPartsData={setPartsData}
              partsData={partsData}
              setPartsAdd={setPartsAdd}
              index={index}
              formData={formData}
              name={th.name}
              label={th.label}
            />
            <MuiCheckboxField
              setPartsData={setPartsData}
              partsData={partsData}
              setPartsAdd={setPartsAdd}
              index={index}
              formData={formData}
              name={fr.name}
              label={fr.label}
            />
            <MuiCheckboxField
              setPartsData={setPartsData}
              partsData={partsData}
              setPartsAdd={setPartsAdd}
              index={index}
              formData={formData}
              name={sa.name}
              label={sa.label}
            />
            <MuiCheckboxField
              setPartsData={setPartsData}
              partsData={partsData}
              setPartsAdd={setPartsAdd}
              index={index}
              formData={formData}
              name={su.name}
              label={su.label}
            />
          </Box>
        </Box>
        <Box
          sx={{
            width: '50%',
            marginTop: '20px',
          }}
        >
          <Typography
            sx={AddThemeColor({
              font: 'normal normal medium 20px/24px Suisse Intl',
              letterSpacing: '0.7px',
              fontWeight: 500,
            })}
          >
            Capture Picture
          </Typography>
          <small>Select when to capture a picture during the inspection process</small>
          <Box
            sx={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              gap: '3%',
              flexWrap: 'wrap',
            }}
          >
            <MuiCheckboxField
              setPartsData={setPartsData}
              partsData={partsData}
              setPartsAdd={setPartsAdd}
              index={index}
              formData={formData}
              name={atStart.name}
              label={atStart.label1}
            />
            <MuiCheckboxField
              setPartsData={setPartsData}
              partsData={partsData}
              setPartsAdd={setPartsAdd}
              index={index}
              formData={formData}
              name={atReview.name}
              label={atReview.label1}
            />
            <MuiCheckboxField
              setPartsData={setPartsData}
              partsData={partsData}
              setPartsAdd={setPartsAdd}
              index={index}
              formData={formData}
              name={atDone.name}
              label={atDone.label1}
            />
          </Box>
        </Box>
      </Box>
      <Box sx={{ display: 'flex', gap: '6%' }}>
        <Box
          sx={{
            width: '50%',
            marginTop: '20px',
          }}
        >
          <Typography
            sx={AddThemeColor({
              font: 'normal normal medium 20px/24px Suisse Intl',
              letterSpacing: '0.7px',
              fontWeight: 500,
            })}
          >
            Time Enforcement
          </Typography>
          <small>Select the time enforcement option for your inspection</small>
          <Box
            sx={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              gap: '3%',
              flexWrap: 'wrap',
            }}
          >
            <MuiCheckboxField
              setPartsData={setPartsData}
              partsData={partsData}
              setPartsAdd={setPartsAdd}
              index={index}
              formData={formData}
              name={enforceTime.name}
              label={enforceTime.label}
            />
            {/* <MuiCheckboxField
              setPartsData={setPartsData}
              partsData={partsData}
              setPartsAdd={setPartsAdd}
              index={index}
              formData={formData}
              name={allowFuture.name}
              label={allowFuture.label}
            />
            <MuiCheckboxField
              setPartsData={setPartsData}
              partsData={partsData}
              setPartsAdd={setPartsAdd}
              index={index}
              formData={formData}
              name={allowPast.name}
              label={allowPast.label}
            /> */}
          </Box>
        </Box>
        <Box
          sx={{
            width: '50%',
            marginTop: '20px',
          }}
        >
          <Typography
            sx={AddThemeColor({
              font: 'normal normal medium 20px/24px Suisse Intl',
              letterSpacing: '0.7px',
              fontWeight: 500,
            })}
          >
            QR Scan
          </Typography>
          <small>Choose an QR scan option for your inspection</small>
          <Box
            sx={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              gap: '3%',
              flexWrap: 'wrap',
            }}
          >
            <MuiCheckboxField
              setPartsData={setPartsData}
              partsData={partsData}
              setPartsAdd={setPartsAdd}
              index={index}
              formData={formData}
              name={qrScanStart.name}
              label={qrScanStart.label}
            />
            <MuiCheckboxField
              setPartsData={setPartsData}
              partsData={partsData}
              setPartsAdd={setPartsAdd}
              index={index}
              formData={formData}
              name={qrScanDone.name}
              label={qrScanDone.label}
            />
          </Box>
        </Box>
      </Box>
      <Box
        sx={{
          width: '50%',
          marginTop: '20px',
        }}
      >
        <Typography
          sx={AddThemeColor({
            font: 'normal normal medium 20px/24px Suisse Intl',
            letterSpacing: '0.7px',
            fontWeight: 500,
          })}
        >
          NFC
        </Typography>
        <small>Choose an NFC scan option for your inspection</small>
        <Box
          sx={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            gap: '3%',
            flexWrap: 'wrap',
          }}
        >

          <MuiCheckboxField
            setPartsData={setPartsData}
            partsData={partsData}
            setPartsAdd={setPartsAdd}
            index={index}
            formData={formData}
            name={nfcScanStart.name}
            label={nfcScanStart.label}
          />
          <MuiCheckboxField
            setPartsData={setPartsData}
            partsData={partsData}
            setPartsAdd={setPartsAdd}
            index={index}
            formData={formData}
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
