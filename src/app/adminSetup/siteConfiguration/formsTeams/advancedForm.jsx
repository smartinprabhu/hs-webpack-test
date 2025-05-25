/* eslint-disable no-nested-ternary */
/* eslint-disable import/no-unresolved */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/forbid-prop-types */
import React, { useState, useEffect } from 'react';
import {
  Col,
  Row,
} from 'reactstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useFormikContext } from 'formik';
import {
  TextField, CircularProgress, FormHelperText,
} from '@material-ui/core';
import PropTypes from 'prop-types';

import {
  generateErrorMessage, integerKeyPress, getAllowedCompanies,
} from '../../../util/appUtils';
import { getPartners } from '../../../assets/equipmentService';
import MuiAutoComplete from '../../../commonComponents/formFields/muiAutocomplete';
import MuiTextField from '../../../commonComponents/formFields/muiTextField';

const appModels = require('../../../util/appModels').default;

const AdvancedForm = (props) => {
  const {
    formField,
  } = props;
  const { values } = useFormikContext();
  const dispatch = useDispatch();
  const [responsibleKeyword, setResponsibleKeyword] = useState('');
  const [responsibleOpen, setResponsibleOpen] = useState(false);

  const { userInfo } = useSelector((state) => state.user);
  const companies = getAllowedCompanies(userInfo);
  const { partnersInfo } = useSelector((state) => state.equipment);

  useEffect(() => {
    (async () => {
      if (userInfo && userInfo.data && responsibleOpen) {
        await dispatch(getPartners(companies, appModels.PARTNER, 'customer', responsibleKeyword));
      }
    })();
  }, [userInfo, responsibleKeyword, responsibleOpen]);

  const onResponsibleKeywordChange = (event) => {
    setResponsibleKeyword(event.target.value);
  };

  let responsibleOptions = [];

  if (partnersInfo && partnersInfo.loading) {
    responsibleOptions = [{ name: 'Loading..' }];
  }
  if (partnersInfo && partnersInfo.data) {
    responsibleOptions = partnersInfo.data;
  }

  return (
    <Row>
      <Col md="6" sm="6" lg="6" xs="12">
        <MuiTextField
          name={formField.hourlyLabourCost.name}
          label={formField.hourlyLabourCost.label}
          type="text"
          onKeyPress={integerKeyPress}
        />
      </Col>
      <Col xs={12} sm={6} md={6} lg={6}>
        <MuiAutoComplete
          name={formField.responsible.name}
          label={formField.responsible.label}
          formGroupClassName="m-1 w-100"
          open={responsibleOpen}
          size="small"
          onOpen={() => {
            setResponsibleOpen(true);
            setResponsibleKeyword('');
          }}
          onClose={() => {
            setResponsibleOpen(false);
            setResponsibleKeyword('');
          }}
          value={values.responsible_id && values.responsible_id.length ? values.responsible_id[1] : values.responsible_id && values.responsible_id.name ? values.responsible_id.name : ''}
          getOptionSelected={(option, value) => option.name === value.name}
          getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
          options={responsibleOptions}
          renderInput={(params) => (
            <TextField
              {...params}
              onChange={onResponsibleKeywordChange}
              variant="standard"
              label={formField.responsible.label}
              className="without-padding"
              placeholder="Search & Select"
              InputProps={{
                ...params.InputProps,
                endAdornment: (
                  <>
                    {partnersInfo && partnersInfo.loading && responsibleOpen ? <CircularProgress color="inherit" size={20} /> : null}
                    {params.InputProps.endAdornment}
                  </>
                ),
              }}
            />
          )}
        />
        {(partnersInfo && partnersInfo.err && responsibleOpen) && (<FormHelperText><span className="text-danger">{generateErrorMessage(partnersInfo)}</span></FormHelperText>) }
      </Col>
    </Row>
  );
};

AdvancedForm.propTypes = {
  formField: PropTypes.objectOf(PropTypes.object).isRequired,
};

export default AdvancedForm;