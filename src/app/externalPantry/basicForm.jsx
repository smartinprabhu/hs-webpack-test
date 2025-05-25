/* eslint-disable radix */
/* eslint-disable camelcase */
/* eslint-disable react/forbid-prop-types */
/* eslint-disable react/jsx-no-useless-fragment */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable import/no-unresolved */
import React, { useEffect, useState } from 'react';
import {
  Col,
  Row,
} from 'reactstrap';
import * as PropTypes from 'prop-types';
import {
  Box,
  ListItemText,
  TextField,
  Typography,
} from '@material-ui/core'
import { useFormikContext } from 'formik';
import axios from 'axios';
import { makeStyles } from '@material-ui/core/styles';

import Loader from '@shared/loading';

import { InputField, FormikAutocomplete } from '../shared/formFields';
import MuiTextField from '../commonComponents/formFields/muiTextField';
import MuiAutoComplete from '../commonComponents/formFields/muiAutocomplete';
import {
  noSpecialChars,
  getColumnArrayById,
  extractTextObject,
} from '../util/appUtils';
import { AddThemeColor } from '../themes/theme';
import PantryProducts from './pantryProducts';

const useStyles = makeStyles({
  option: {
    padding: 5,
    margin: 5,
    display: 'flow-root',
    '& > span': {
      marginRight: 10,
    },
  },
  root: {
    // input label when focused
    '& label.Mui-focused': {
      color: AddThemeColor({}).color,
    },
    // focused color for input with variant='standard'
    '& .MuiInput-underline:after': {
      borderBottomColor: AddThemeColor({}).color,
    },
    // focused color for input with variant='filled'
    '& .MuiFilledInput-underline:after': {
      borderBottomColor: AddThemeColor({}).color,
    },
    // focused color for input with variant='outlined'
    '& .MuiOutlinedInput-root': {
      '&.Mui-focused fieldset': {
        borderColor: AddThemeColor({}).color,
      },
    },
  },
});

const BasicForm = (props) => {
  const {
    setFieldValue,
    detailData,
    visitorDetails,
    partsData,
    setPartsData,
    setDomainValidation,
    domainValidation,
    accid,
    sid,
    formField: {
      nameValue,
      email,
      pantry,
      space,
    },
  } = props;
  const { values: formValues } = useFormikContext();
  const {
    employee_email,
    pantry_id,
    space_id,
  } = formValues;

  const classes = useStyles();

  const WEBAPPAPIURL = `${window.location.origin === 'http://localhost:3010' ? 'http://localhost:3000' : window.location.origin}/`;

  const [pantryOpen, setPantryOpen] = useState(false);
  const [spaceOpen, setSpaceOpen] = useState(false);
  const [pantryProductsInfo, setPantryProducts] = useState({ loading: false, data: null, err: null });

  useEffect(() => {
    if (sid) {
      if (pantry_id && pantry_id.name && pantry_id.spaces && pantry_id.spaces.length) {
        const fData = pantry_id.spaces.filter((item) => parseInt(item.id) === parseInt(sid));
        if (fData && fData.length) {
          setFieldValue('space_id', fData[0]);
        } else {
          setFieldValue('space_id', sid);
        }
      } else {
        setFieldValue('space_id', sid);
      }
    }
  }, [pantry_id, sid]);

  useEffect(() => {
    setFieldValue('employee_email', visitorDetails && visitorDetails.employee_email ? visitorDetails.employee_email : '');
    setFieldValue('employee_name', visitorDetails && visitorDetails.employee_name ? visitorDetails.employee_name : '');
  }, [visitorDetails]);

  useEffect(() => {
    if (detailData) {
      setFieldValue('has_employee_email', detailData.has_employee_email);
      setFieldValue('has_employee_name', detailData.has_employee_name);
    }
  }, [detailData]);

  useEffect(() => {
    if (detailData && detailData.pantry && detailData.pantry.length && detailData.pantry.length === 1) {
      setFieldValue('pantry_id', detailData.pantry[0]);
    }
  }, [detailData]);

  useEffect(() => {
    if (detailData && detailData.pantry && detailData.pantry.length && detailData.pantry.length === 1 && !(pantry_id && pantry_id.name)) {
      setFieldValue('pantry_id', detailData.pantry[0]);
    }
  }, [detailData, pantry_id]);

  useEffect(() => {
    if (pantry_id && pantry_id.name && pantry_id.spaces && pantry_id.spaces.length && pantry_id.spaces.length === 1 && !sid) {
      setFieldValue('space_id', pantry_id.spaces[0]);
    }
  }, [pantry_id, sid]);

  useEffect(() => {
    if (pantry_id && pantry_id.name && pantry_id.spaces && pantry_id.spaces.length > 1) {
      setFieldValue('has_space_required', 'Required');
    }
  }, [pantry_id]);

  useEffect(() => {
    if (!(pantry_id && pantry_id.name) && !sid) {
      setFieldValue('space_id', '');
    }
  }, [pantry_id, sid]);

  useEffect(() => {
    if (pantry_id && pantry_id.name && pantry_id.spaces && !pantry_id.spaces.length && !sid) {
      setFieldValue('space_id', '');
      setFieldValue('has_space_required', 'None');
    }
  }, [pantry_id, sid]);

  useEffect(() => {
    if (pantry_id && pantry_id.id) {
      // dispatch(getVpConfig(uuid));
      setPantryProducts({
        loading: true, data: null, count: 0, err: null,
      });
      const config = {
        method: 'get',
        url: `${WEBAPPAPIURL}public/api/v4/items/pantry?pantry_id=${pantry_id.id}&portalDomain=${window.location.origin}`,
        headers: {
          portalDomain: window.location.origin,
          accountId: accid,
        },
      };
      axios(config)
        .then((response) => setPantryProducts({
          loading: false, data: response.data.data, count: response.data.length, err: null,
        }))
        .catch((error) => {
          setPantryProducts({
            loading: false, data: null, count: 0, err: error,
          });
        });
    }
  }, [pantry_id]);

  useEffect(() => {
    if (detailData && employee_email && employee_email.length > 2 && employee_email.includes('@')) {
      const whitelist = detailData.allowed_domains_host_ids ? getColumnArrayById(detailData.allowed_domains_host_ids, 'name') : [];
      if (whitelist && whitelist.length) {
        const userHasAccess = whitelist.some(
          (domain) => {
            const emailSplit = employee_email.split('@');
            return emailSplit[emailSplit.length - 1].toLowerCase() === domain;
          },
        );

        if (userHasAccess) {
          setDomainValidation(false);
        } else {
          setDomainValidation(true);
        }
      }
    }
  }, [detailData, employee_email]);

  return (
    <>
      <Row>
        {detailData.has_employee_name && detailData.has_employee_name !== 'None' && (
        <Col md="12" sm="12" lg="12" xs="12">
          <MuiTextField
            sx={{
              marginTop: 'auto',
              marginBottom: '10px',
            }}
            name={nameValue.name}
            label={nameValue.label}
            isRequired={detailData.has_employee_name && detailData.has_employee_name === 'Required'}
            type="text"
            customClassName="bg-lightblue"
            labelClassName="m-0"
            formGroupClassName="m-1"
            inputProps={{
              maxLength: 50,
            }}
            onKeyPress={noSpecialChars}
          />
        </Col>
        )}
        {detailData.has_employee_email && detailData.has_employee_email !== 'None' && (
        <Col md="12" sm="12" lg="12" xs="12">
          <MuiTextField
            sx={{
              marginTop: 'auto',
              marginBottom: '10px',
            }}
            name={email.name}
            label={email.label}
            isRequired={detailData.has_employee_email && detailData.has_employee_email === 'Required'}
            type="email"
            customClassName="bg-lightblue"
            labelClassName="m-0"
            formGroupClassName="m-1"
            customError={domainValidation ? 'Email ID does not have a valid domain' : false}
            inputProps={{
              maxLength: 50,
            }}
          />
        </Col>
        )}
        {detailData && detailData.pantry && detailData.pantry.length > 1 && (
        <Col md="12" sm="12" lg="12" xs="12">
          <MuiAutoComplete
            sx={{
              marginBottom: '20px',
            }}
            name={pantry.name}
            label={pantry.label}
            isRequired
            fullwidth
            labelClassName="m-0"
            formGroupClassName="m-1"
            open={pantryOpen}
            size="small"
            classes={{
              root: classes.root,
            }}
            onOpen={() => {
              setPantryOpen(true);
            }}
            onClose={() => {
              setPantryOpen(false);
            }}
            getOptionSelected={(option, value) => option.name === value.name}
            getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
            options={detailData && detailData.pantry ? detailData.pantry : []}
            renderInput={(params) => (
              <TextField
                {...params}
                variant="standard"
                label={pantry.label}
                className="bg-lightblue without-padding"
                placeholder="Select"
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <>
                      {params.InputProps.endAdornment}
                    </>
                  ),
                }}
              />
            )}
          />
        </Col>
        )}
        {pantry_id && pantry_id.name && pantry_id.spaces && pantry_id.spaces.length > 1 && !sid && (
        <Col md="12" sm="12" lg="12" xs="12">
          <MuiAutoComplete
            sx={{
              marginBottom: '20px',
            }}
            name={space.name}
            label={space.label}
            isRequired
            labelClassName="m-0"
            formGroupClassName="m-1"
            classes={{
              root: classes.root,
            }}
            open={spaceOpen}
            size="small"
            onOpen={() => {
              setSpaceOpen(true);
            }}
            onClose={() => {
              setSpaceOpen(false);
            }}
            getOptionSelected={(option, value) => option.space_name === value.space_name}
            getOptionLabel={(option) => (typeof option === 'string' ? option : option.space_name)}
            options={pantry_id.spaces}
            renderOption={(props, option) => (
              <ListItemText
                {...props}
                primary={(
                  <>
                    <Box>
                      <Typography
                        sx={{
                          font: 'Suisse Intl',
                          fontWeight: 800,
                          fontSize: '15px',
                        }}
                      >
                        {option.name || option.space_name}
                      </Typography>
                    </Box>
                    {option?.path_name && (
                      <Box>
                        <Typography
                          sx={{
                            font: 'Suisse Intl',
                            fontSize: '12px',
                          }}
                        >
                          {option?.path_name}
                        </Typography>
                      </Box>
                    )}
                    {option?.asset_category_id && (
                      <Box>
                        <Typography
                          sx={{
                            font: 'Suisse Intl',
                            fontSize: '12px',
                          }}
                        >
                          <span>
                            {' '}
                            {option.asset_category_id && (
                            <>
                              {extractTextObject(option.asset_category_id)}
                            </>
                            )}
                          </span>
                        </Typography>
                      </Box>
                    )}
                  </>
                )}
              />
            )}
            renderInput={(params) => (
              <TextField
                {...params}
                variant="standard"
                label={space.label}
                className="bg-lightblue without-padding"
                placeholder="Select"
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <>
                      {params.InputProps.endAdornment}
                    </>
                  ),
                }}
              />
            )}
          />
        </Col>
        )}
        <Col md="12" sm="12" lg="12" xs="12">
          {detailData && detailData.pantry && detailData.pantry.length > 0 && detailData.pantry.length === 1 && pantry_id && pantry_id.name && (
          <p className="text-info ml-2 mt-2 font-weight-800">
            Pantry :
            {'  '}
            {pantry_id.name}
          </p>
          )}
        </Col>
        <Col md="12" sm="12" lg="12" xs="12">
          {pantry_id && pantry_id.name && pantry_id.spaces && pantry_id.spaces.length > 0 && pantry_id.spaces.length === 1 && space_id && space_id.space_name && !sid && (
          <p className="text-info font-weight-800">
            Space :
            {'  '}
            {space_id.space_name}
          </p>
          )}
        </Col>
        <Col md="12" sm="12" lg="12" xs="12">
          {space_id && space_id.space_name && sid && (
          <p className="text-info font-weight-800">
            Space :
            {'  '}
            {space_id.space_name}
          </p>
          )}
        </Col>
      </Row>
      {pantryProductsInfo && pantryProductsInfo.loading && (
        <div className="text-center mt-3">
          <Loader />
        </div>
      )}
      {pantryProductsInfo && pantryProductsInfo.err && (
        <div className="text-center mt-3">
          <p className="text-danger">No Products Found.</p>
        </div>
      )}
      {pantry_id && pantry_id.name && pantryProductsInfo && pantryProductsInfo.data && (
      <PantryProducts setFieldValue={setFieldValue} partsData={partsData} setPartsData={setPartsData} pantryId={pantry_id && pantry_id.id} pantryProducts={pantryProductsInfo.data} />
      )}
    </>
  );
};

BasicForm.propTypes = {
  formField: PropTypes.objectOf(PropTypes.object).isRequired,
  setFieldValue: PropTypes.oneOfType([PropTypes.func, PropTypes.string]).isRequired,
  detailData: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array,
  ]).isRequired,
  visitorDetails: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.object,
    PropTypes.array,
  ]).isRequired,
};

export default BasicForm;
