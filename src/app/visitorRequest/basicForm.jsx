/* eslint-disable react/forbid-prop-types */
/* eslint-disable react/jsx-no-useless-fragment */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable import/no-unresolved */
import React, { useEffect, useState } from 'react';
import {
  Col,
} from 'reactstrap';
import { Box } from '@mui/system';
import * as PropTypes from 'prop-types';
import {
  TextField,
} from '@material-ui/core';
import { useSelector } from 'react-redux';

import { makeStyles } from '@material-ui/core/styles';
import MuiAutoComplete from '../commonComponents/formFields/muiAutocomplete';
import MuiTextField from '../commonComponents/formFields/muiTextField';
import {
  noSpecialChars,
  integerKeyPress,
  decodeJWT,
  decodeJWTNameValidate,
} from '../util/appUtils';
import { AddThemeColor } from '../themes/theme';

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
    formField: {
      visitorType,
      nameValue,
      mobile,
      email,
    },
  } = props;
  const classes = useStyles();
  const [typeOpen, setTypeOpen] = useState(false);

  const { ssoToken } = useSelector((state) => state.ticket);

  useEffect(() => {
    setFieldValue('phone', visitorDetails && visitorDetails.phone ? visitorDetails.phone : '');
    setFieldValue('email', visitorDetails && visitorDetails.email ? visitorDetails.email : '');
    setFieldValue('visitor_name', visitorDetails && visitorDetails.visitor_name ? visitorDetails.visitor_name : '');
    setFieldValue('type_of_visitor', visitorDetails && visitorDetails.type_of_visitor ? visitorDetails.type_of_visitor : '');
    // let dType = { value: 'Visitor', label: 'Guest' };
    // const vt = visitorDetails && visitorDetails.visitor_type && visitorDetails.visitor_type.value ? visitorDetails.visitor_type.value : false;
    // if (vt) {
    //   if (vt === 'Vendor') {
    //     dType = { value: 'Vendor', label: 'Vendor' };
    //   } else {
    //     dType = { value: 'Visitor', label: 'Guest' };
    //   }
    // }
    // setFieldValue('visitor_type', dType);
  }, [visitorDetails]);

  useEffect(() => {
    if (ssoToken && ssoToken.client && ssoToken.client.account) {
      setFieldValue('email', ssoToken.client.account.userName ? ssoToken.client.account.userName : '');
      setFieldValue('visitor_name', ssoToken.tokens && ssoToken.tokens.accessToken && decodeJWT(ssoToken.tokens.accessToken) ? decodeJWT(ssoToken.tokens.accessToken) : '');
    }
  }, [ssoToken]);

  useEffect(() => {
    if (detailData && detailData.visitor_types && detailData.visitor_types.length && detailData.visitor_types.length === 1) {
      setFieldValue('type_of_visitor', detailData.visitor_types[0]);
    }
  }, [detailData]);

  let visitorTypeOptions = [];
  if (detailData && detailData.visitor_types) {
    visitorTypeOptions = [...detailData.visitor_types];
  }
  if (detailData && detailData.err) {
    visitorTypeOptions = [];
  }

  useEffect(() => {
    if (detailData) {
      setFieldValue('has_visitor_email', detailData.has_visitor_email);
      setFieldValue('has_visitor_mobile', detailData.has_visitor_mobile);
      setFieldValue('has_visitor_type', detailData.has_visitor_type);
      setFieldValue('has_visitor_badge', 'None');
    }
  }, [detailData]);
  return (
    <Box>
      {detailData.has_visitor_type && detailData.has_visitor_type !== 'None' && (
      <Col md="12" sm="12" lg="12" xs="12">
        <MuiAutoComplete
          sx={{
            marginBottom: '20px',
          }}
          name={visitorType.name}
          label={visitorType.label}          
          disabled={detailData && detailData.visitor_types && detailData.visitor_types.length > 0 && detailData.visitor_types.length === 1}
          disableClearable={detailData && detailData.visitor_types && detailData.visitor_types.length > 0 && detailData.visitor_types.length === 1}
          formGroupClassName="m-1"
          open={typeOpen}
          size="small"
          classes={{
            root: classes.root,
          }}
          onOpen={() => {
            setTypeOpen(true);
          }}
          onClose={() => {
            setTypeOpen(false);
          }}
          getOptionSelected={(option, value) => option.name === value.name}
          getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
          options={visitorTypeOptions}
          renderInput={(params) => (
            <TextField
              {...params}
              variant="standard"
              className="without-padding"
              placeholder="Select"
              required={detailData.has_visitor_type && detailData.has_visitor_type === 'Required'}
              label={visitorType.label}
              InputProps={{
                ...params.InputProps,
                endAdornment: (
                  <>
                    {detailData && detailData.visitor_types && detailData.visitor_types.length > 0 && detailData.visitor_types.length === 1 ? null : params.InputProps.endAdornment}
                  </>
                ),
              }}
            />
          )}
        />
      </Col>
      )}
      <Col md="12" sm="12" lg="12" xs="12">
        <MuiTextField
          sx={{
            marginBottom: '20px',
          }}
          name={nameValue.name}
          label={nameValue.label}
          disabled={!!(ssoToken.tokens && ssoToken.tokens.accessToken && decodeJWT(ssoToken.tokens.accessToken))}
          isRequired={nameValue.required}
          customError={ssoToken.tokens && ssoToken.tokens.accessToken && decodeJWTNameValidate(ssoToken.tokens.accessToken)}
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
      {detailData.has_visitor_mobile && detailData.has_visitor_mobile !== 'None' && (
      <Col md="12" sm="12" lg="12" xs="12">
        <MuiTextField
          sx={{
            marginBottom: '20px',
          }}
          name={mobile.name}
          label={mobile.label}
          isRequired={detailData.has_visitor_mobile && detailData.has_visitor_mobile === 'Required'}
          type="text"
          customClassName="bg-lightblue"
          labelClassName="m-0"
          formGroupClassName="m-1"
          inputProps={{
            maxLength: 13,
          }}
          onKeyPress={integerKeyPress}
        />
      </Col>
      )}
      {detailData.has_visitor_email && detailData.has_visitor_email !== 'None' && (
      <Col md="12" sm="12" lg="12" xs="12">
        <MuiTextField
          sx={{
            marginBottom: '20px',
          }}
          name={email.name}
          label={email.label}
          disabled={!!(ssoToken && ssoToken.client && ssoToken.client.account && ssoToken.client.account.userName)}
          isRequired={detailData.has_visitor_email && detailData.has_visitor_email === 'Required'}
          type="email"
          customClassName="bg-lightblue"
          labelClassName="m-0"
          formGroupClassName="m-1"
          inputProps={{
            maxLength: 50,
          }}
        />
      </Col>
      )}
    </Box>
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
