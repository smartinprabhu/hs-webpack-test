/* eslint-disable no-nested-ternary */
/* eslint-disable react/jsx-no-useless-fragment */
import React, { useState, useEffect } from 'react';
import {
  Col,
  Label,
} from 'reactstrap';
import { useDispatch, useSelector } from 'react-redux';
import { Autocomplete } from '@material-ui/lab';
import InputAdornment from '@material-ui/core/InputAdornment';
import BackspaceIcon from '@material-ui/icons/Backspace';
import IconButton from '@material-ui/core/IconButton';
import {
  TextField,
  CircularProgress,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import QRCode from 'react-qr-code';
import { } from 'antd';
import { Button, Tooltip } from '@mui/material';

import Loader from '@shared/loading';

import {
  getPPMVendorGroups, getPPMWeekGroups, getVendorPPMExternalLink, resetVendorPPMExternalLink,
} from '../ppmService';

import { getAllowedCompanies, copyTextToClipboard } from '../../util/appUtils';

const appModels = require('../../util/appModels').default;

const WEBAPPAPIURL = `${window.location.origin}/`;

const useStyles = makeStyles((themeStyle) => ({
  margin: {
    marginBottom: themeStyle.spacing(1.25),
    width: '100%',
  },
  option: {
    padding: 5,
    margin: 5,
    display: 'flow-root',
    '& > span': {
      marginRight: 10,
    },
  },
}));

const CopyExternalUrl = () => {
  const [url, setUrl] = useState(false);
  const [selectData, setSelected] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const [selectOpen, setSelectOpen] = useState(false);

  const [weekOpen, setWeekOpen] = useState(false);
  const [vendorOptions, setVendorOptions] = useState([]);
  const [weekOptions, setWeekOptions] = useState([]);

  const [weekSelected, setWeekSelected] = useState(false);

  const { userInfo } = useSelector((state) => state.user);
  const {
    externalVendorGroups, externalWeekGroups,
    externalVendorLink,
  } = useSelector((state) => state.ppm);

  const dispatch = useDispatch();
  const classes = useStyles();
  const companies = getAllowedCompanies(userInfo);

  useEffect(() => {
    if (externalVendorLink && externalVendorLink.data && externalVendorLink.data.length && externalVendorLink.data[0].uuid) {
      const val = `${WEBAPPAPIURL}52week/external/${externalVendorLink.data[0].uuid}`;
      setUrl(val);
    }
  }, [externalVendorLink]);

  const uuid = externalVendorLink && externalVendorLink.data && externalVendorLink.data.length > 0 && externalVendorLink.data[0].uuid;

  const externalData = externalVendorLink && externalVendorLink.data && externalVendorLink.data.length > 0 && externalVendorLink.data[0];

  useEffect(() => {
    dispatch(getPPMVendorGroups(companies, appModels.PPMEXTERNAL));
    dispatch(resetVendorPPMExternalLink());
  }, []);

  useEffect(() => {
    if (selectData && selectData.value) {
      dispatch(getPPMWeekGroups(companies, appModels.PPMEXTERNAL, selectData.value));
    }
  }, [selectData]);

  useEffect(() => {
    if (!(selectData && selectData.value) || !(weekSelected && weekSelected.value)) {
      dispatch(resetVendorPPMExternalLink());
      setUrl('');
    }
    if (!(selectData && selectData.value)) {
      setWeekSelected('');
    }
  }, [selectData, weekSelected]);

  useEffect(() => {
    if ((selectData && selectData.value) && (weekSelected && weekSelected.value)) {
      dispatch(getVendorPPMExternalLink(companies, selectData && selectData.value, weekSelected && weekSelected.value, appModels.PPMEXTERNAL));
    }
  }, [selectData, weekSelected]);

  useEffect(() => {
    if (externalVendorGroups && externalVendorGroups.data) {
      const newArrData = externalVendorGroups.data.map((cl) => ({
        value: cl.vendor_id && cl.vendor_id.length ? cl.vendor_id[0] : '',
        label: cl.vendor_id && cl.vendor_id.length ? cl.vendor_id[1] : '',
      }));
      setVendorOptions(newArrData);
    } else if (externalVendorGroups.loading) {
      setVendorOptions([{
        value: 'Loading...',
        label: 'Loading...',
      }]);
    } else {
      setVendorOptions([]);
    }
  }, [externalVendorGroups]);

  useEffect(() => {
    if (externalWeekGroups && externalWeekGroups.data) {
      const newArrData = externalWeekGroups.data.map((cl) => ({
        value: cl.week,
        label: cl.week,
      }));
      setWeekOptions(newArrData);
    } else if (externalWeekGroups.loading) {
      setWeekOptions([{
        value: 'Loading...',
        label: 'Loading...',
      }]);
    } else {
      setWeekOptions([]);
    }
  }, [externalWeekGroups]);

  const onSelectChange = (data) => {
    setSelected(data);
    setWeekSelected('');
    setWeekOpen(false);
  };

  const onVendorClear = () => {
    setSelected('');
    setSelectOpen(false);
  };

  const onWeekClear = () => {
    setWeekSelected('');
    setWeekOpen(false);
  };

  const onWeekChange = (data) => {
    setWeekSelected(data);
  };

  const download = () => {
    const s = new XMLSerializer().serializeToString(document.getElementById('svg'));
    const encodedData = window.btoa(s);
    const element = document.createElement('a');
    element.setAttribute('href', `data:image/svg+xml;base64,${encodedData}`);
    element.setAttribute('download', 'QRCode');
    element.setAttribute('id', 'file');

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();
    document.body.removeChild(element);
  };

  const sendEmail = () => {
    const recipient = externalData?.vendor_id?.email || ''; // Safely access the email
    const name = externalData?.vendor_id?.name || 'Vendor'; // Fallback if name is not available
    const subject = 'Vendor PPM';
    const body = `Hi ${name},\n\nUse the following link to perform the PPM: ${url}\n\nBest regards,`;

    if (!recipient) {
      alert('Email address is missing!');
      return;
    }

    // Open the default email client
    window.location.href = `mailto:${recipient}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  const handleQrPrint = () => {
    setTimeout(() => {
      /* const content = document.getElementById('print_qr_survey_link');
      const pri = document.getElementById('print_qr_survey_link_frame').contentWindow;
      pri.document.open();
      pri.document.write(content.innerHTML); */

      const div = document.getElementById('print_qr_external_ppm_link_pdf');
      // Create a window object.
      const win = window.open('', '_blank'); // Open the window. Its a popup window.
      document.title = 'QR Code';
      win.document.write(div.outerHTML); // Write contents in the new window.
      win.document.close();
      /* setTimeout(() => {
        const r = win.confirm('Do you want to print this document ?');
        if (r === true) {
          win.print();
        }
      }, 1500); */
      win.print();
      // pri.document.close();
      // pri.focus();
      // pri.print();
    }, 1000);
  };

  return (
    <>

      <div className="mt-4">

        <Col md={12} sm={12} lg={12} xs={12} className="ml-2 mt-2">
          <Label className="font-family-tab" for="category_id">Vendor</Label>
          <Autocomplete
            name="category_id"
            isRequired
            labelClassName="m-0"
            formGroupClassName="m-1"
            open={selectOpen}
            classes={{
              option: classes.option,
            }}
            onOpen={() => {
              setSelectOpen(true);
            }}
            onClose={() => {
              setSelectOpen(false);
            }}
            disableClearable={!selectData?.label}
            loading={externalVendorGroups.loading}
            value={selectData}
            onChange={(e, data) => onSelectChange(data)}
            renderOption={(option) => (
              <>
                <p className="font-family-tab">{option.label}</p>

              </>
            )}
            getOptionLabel={(option) => (typeof option === 'string' ? option : option && option.label ? option.label : '')}
            options={vendorOptions}
            renderInput={(params) => (
              <TextField
                {...params}
                variant="outlined"
                className="without-padding custom-icons"
                placeholder="Select"
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <>
                      {externalVendorGroups && externalVendorGroups.loading ? <CircularProgress color="inherit" size={20} /> : null}
                      <InputAdornment position="end">
                        {selectData && selectData.value && (
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={onVendorClear}
                        >
                          <BackspaceIcon fontSize="small" />
                        </IconButton>
                        )}

                      </InputAdornment>
                    </>
                  ),
                }}
              />
            )}
          />
        </Col>
        <Col md={12} sm={12} lg={12} xs={12} className="ml-2 mt-2">
          <Label className="font-family-tab" for="category_id">Week</Label>
          <Autocomplete
            name="category_id"
            isRequired
            labelClassName="m-0"
            formGroupClassName="m-1"
            open={weekOpen}
            classes={{
              option: classes.option,
            }}
            onOpen={() => {
              setWeekOpen(true);
            }}
            onClose={() => {
              setWeekOpen(false);
            }}
            disableClearable={!weekSelected?.label}
            loading={externalWeekGroups.loading}
            value={weekSelected}
            onChange={(e, data) => onWeekChange(data)}
            renderOption={(option) => (
              <>
                <p className="font-family-tab">{option.label}</p>

              </>
            )}
            getOptionLabel={(option) => (typeof option === 'string' ? option : option && option.label ? option.label : '')}
            options={weekOptions}
            renderInput={(params) => (
              <TextField
                {...params}
                variant="outlined"
                className="without-padding custom-icons"
                placeholder="Select"
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <>
                      {externalWeekGroups && externalWeekGroups.loading ? <CircularProgress color="inherit" size={20} /> : null}
                      <InputAdornment position="end">
                        {weekSelected && weekSelected.value && (
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={onWeekClear}
                        >
                          <BackspaceIcon fontSize="small" />
                        </IconButton>
                        )}

                      </InputAdornment>
                    </>
                  ),
                }}
              />
            )}
          />
        </Col>
      </div>
      {externalVendorLink && externalVendorLink.loading && (
      <div className="text-center p-3 mt-3">
        <Loader />
      </div>
      )}
      {(selectData && selectData.value) && (weekSelected && weekSelected.value) && uuid && (
      <div className="p-3 mt-4 text-center">
        <QRCode value={url} className="" id="svg" size={150} renderAs="svg" includeMargin level="H" />
      </div>
      )}
      <div className="d-none">
        <div id="print_qr_external_ppm_link_pdf">
          <div style={{ textAlign: 'center' }}>
            <QRCode value={url} renderAs="svg" includeMargin level="H" size={400} />
            <p>
              Link :
              {' '}
              {url}
            </p>
          </div>
        </div>
        <iframe name="print_qr_external_ppm_link_pdf_frame" title="Export" id="print_qr_external_ppm_link_pdf_frame" width="0" height="0" frameBorder="0" src="about:blank" />
      </div>
      <div
        className="text-center"
      >
        {(selectData && selectData.value) && (weekSelected && weekSelected.value) && uuid && (
        <div className="sticky-button-30drawer content-flex-justify-center">
          {uuid && (
          <Tooltip title={copySuccess ? 'Copied!' : 'Copy'} arrow>
            <Button
              variant="contained"
              onMouseLeave={() => setCopySuccess(false)}
              onClick={() => { copyTextToClipboard(uuid, '52week/external', false, false); setCopySuccess(true); }}
            >
              Copy URL
            </Button>
          </Tooltip>
          )}
          <Button
            type="button"
            variant="contained"
            className="ml-2"
            onClick={download}
          >
            Download QR
          </Button>
          {externalData && externalData.vendor_id && externalData.vendor_id.email && (
          <Button
            type="button"
            variant="contained"
            className="ml-2"
            onClick={() => sendEmail()}
          >
            Send Email
          </Button>
          )}
        </div>
        )}
      </div>
    </>
  );
};
export default CopyExternalUrl;
