/* eslint-disable import/no-unresolved */
/* eslint-disable react/jsx-props-no-spreading */
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import {
  Typography, Grid, TextField, CircularProgress, FormHelperText,
} from '@material-ui/core';
import { ThemeProvider } from '@material-ui/core/styles';

import {
  Row, Col,
} from 'reactstrap';

import { FormikAutocomplete, SelectField } from '@shared/formFields';
import { getEmployee } from './spaceService';
import spaceStatusList from './data/spaceActions.json';
import theme from '../util/materialTheme';
import { generateErrorMessage, getAllowedCompanies } from '../util/appUtils';

const appModels = require('../util/appModels').default;

const UpdateSpaceForm = (props) => {
  const {
    formField: {
      spaceStatus,
      bookingAllowed,
      assignEmployee,
    },
    formValues,
    updateResult,
  } = props;
  const dispatch = useDispatch();
  const options = [];
  const [open, setOpen] = useState(false);
  const [keyword, setKeyword] = useState('');
  const loading = open && options.length === 0;

  const { userInfo } = useSelector((state) => state.user);
  const companies = getAllowedCompanies(userInfo);
  const { employeeList } = useSelector((state) => state.space);

  useEffect(() => {
    (async () => {
      if (userInfo && userInfo.data && open) {
        await dispatch(getEmployee(companies, appModels.EMPLOYEE, keyword));
      }
    })();
  }, [loading, keyword]);

  const onKeywordChange = (event) => {
    setKeyword(event.target.value);
  };

  let employeeOptions = [];

  if (employeeList && employeeList.loading) {
    employeeOptions = [{ name: 'Loading..' }];
  }
  if (employeeList && employeeList.data) {
    employeeOptions = employeeList.data;
  }

  let bookAllowed;

  if (formValues && formValues.is_booking_allowed) {
    bookAllowed = spaceStatusList.booking[0].value;
  } else if (formValues && !formValues.is_booking_allowed) {
    bookAllowed = spaceStatusList.booking[1].value;
  } else {
    bookAllowed = '';
  }
  return (
    <>
      <Row className="px-3">
        <ThemeProvider theme={theme}>
          <Col lg="12">
            {formValues.name ? (
              <Grid item container direction="column" xs={12} sm={6}>
                <Grid container>
                  <>
                    <Grid item xs={5}>
                      <Typography gutterBottom>Name</Typography>
                    </Grid>
                    <Grid item xs={1}>
                      <Typography gutterBottom> : </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography gutterBottom>{formValues.name ? formValues.name : ''}</Typography>
                    </Grid>
                  </>
                </Grid>
              </Grid>
            ) : ''}
          </Col>
          <Col lg="12">
            {formValues.sequence_asset_hierarchy ? (
              <Grid item container direction="column" xs={12} sm={6}>
                <Grid container>
                  <>
                    <Grid item xs={5}>
                      <Typography gutterBottom>Space Number </Typography>
                    </Grid>
                    <Grid item xs={1}>
                      <Typography gutterBottom> : </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography gutterBottom>{formValues.sequence_asset_hierarchy ? formValues.sequence_asset_hierarchy : ''}</Typography>
                    </Grid>
                  </>
                </Grid>
              </Grid>
            ) : ''}
          </Col>
          {formValues.asset_category_id ? (
            <Col lg="12">
              <Grid item container direction="column" xs={12} sm={6}>
                <Grid container>
                  <>
                    <Grid item xs={5}>
                      <Typography gutterBottom>Space Category </Typography>
                    </Grid>
                    <Grid item xs={1}>
                      <Typography gutterBottom> : </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography gutterBottom>{formValues.asset_category_id ? formValues.asset_category_id[1] : ''}</Typography>
                    </Grid>
                  </>
                </Grid>
              </Grid>
            </Col>
          ) : ''}
          {formValues.asset_subcategory_id ? (
            <Col lg="12">
              <Grid item container direction="column" xs={12} sm={6}>
                <Grid container>
                  <>
                    <Grid item xs={5}>
                      <Typography gutterBottom>Sub Category </Typography>
                    </Grid>
                    <Grid item xs={1}>
                      <Typography gutterBottom> : </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography gutterBottom>{formValues.asset_subcategory_id ? formValues.asset_subcategory_id[1] : ''}</Typography>
                    </Grid>
                  </>
                </Grid>
              </Grid>
            </Col>
          ) : ''}
          {formValues.maintenance_team_id ? (
            <Col lg="12">
              <Grid item container direction="column" xs={12} sm={6}>
                <Grid container>
                  <>
                    <Grid item xs={5}>
                      <Typography gutterBottom>Maintained by </Typography>
                    </Grid>
                    <Grid item xs={1}>
                      <Typography gutterBottom> : </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography gutterBottom>{formValues.maintenance_team_id ? formValues.maintenance_team_id[1] : ''}</Typography>
                    </Grid>
                  </>
                </Grid>
              </Grid>
            </Col>
          ) : ''}
          {formValues.area_sqft ? (
            <Col lg="12">
              <Grid item container direction="column" xs={12} sm={6}>
                <Grid container>
                  <>
                    <Grid item xs={5}>
                      <Typography gutterBottom>Area </Typography>
                    </Grid>
                    <Grid item xs={1}>
                      <Typography gutterBottom> : </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography gutterBottom>{formValues.area_sqft ? formValues.area_sqft : ''}</Typography>
                    </Grid>
                  </>
                </Grid>
              </Grid>
            </Col>
          ) : ''}
          {formValues.max_occupancy ? (
            <Col lg="12">
              <Grid item container direction="column" xs={12} sm={6}>
                <Grid container>
                  <>
                    <Grid item xs={5}>
                      <Typography gutterBottom>Max Occupancy </Typography>
                    </Grid>
                    <Grid item xs={1}>
                      <Typography gutterBottom> : </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography gutterBottom>{formValues.max_occupancy ? formValues.max_occupancy : ''}</Typography>
                    </Grid>
                  </>
                </Grid>
              </Grid>
            </Col>
          ) : ''}
          {formValues.type_id ? (
            <Col lg="12">
              <Grid item container direction="column" xs={12} sm={6}>
                <Grid container>
                  <>
                    <Grid item xs={5}>
                      <Typography gutterBottom>Space Type </Typography>
                    </Grid>
                    <Grid item xs={1}>
                      <Typography gutterBottom> : </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography gutterBottom>{formValues.type_id ? formValues.type_id[1] : ''}</Typography>
                    </Grid>
                  </>
                </Grid>
              </Grid>
            </Col>
          ) : ''}
          {formValues.sub_type_id ? (
            <Col lg="12">
              <Grid item container direction="column" xs={12} sm={6}>
                <Grid container>
                  <>
                    <Grid item xs={5}>
                      <Typography gutterBottom>Sub Type </Typography>
                    </Grid>
                    <Grid item xs={1}>
                      <Typography gutterBottom> : </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography gutterBottom>{formValues.sub_type_id ? formValues.sub_type_id[1] : ''}</Typography>
                    </Grid>
                  </>
                </Grid>
              </Grid>
            </Col>
          ) : ''}
          <Col lg="12">
            <SelectField
              name={spaceStatus.name}
              value={formValues.space_status ? formValues.space_status : ''}
              label={spaceStatus.label}
              data={spaceStatusList.space}
              fullWidth
              disabled={!!(updateResult && updateResult.status)}
            />
          </Col>
          <br />
          <Col xs={12} sm={12}>
            <FormikAutocomplete
              name={assignEmployee.name}
              value={formValues.employee_id ? formValues.employee_id[1] : ''}
              label={assignEmployee.label}
              open={open}
              size="small"
              onOpen={() => {
                setOpen(true);
              }}
              onClose={() => {
                setOpen(false);
              }}
              disabled={!!(updateResult && updateResult.status)}
              loading={employeeList && employeeList.loading}
              getOptionSelected={(option, value) => option.name === value.name}
              getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
              options={employeeOptions}
              renderInput={(params) => (
                <TextField
                  {...params}
                  onChange={onKeywordChange}
                  variant="outlined"
                  placeholder="Search & Select"
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <>
                        {employeeList && employeeList.loading ? <CircularProgress color="inherit" size={20} /> : null}
                        {params.InputProps.endAdornment}
                      </>
                    ),
                  }}
                />
              )}
            />
            {(employeeList && employeeList.err) && (<FormHelperText><span className="text-danger">{generateErrorMessage(employeeList)}</span></FormHelperText>)}
          </Col>
          <Col xs={12} sm={12}>
            <SelectField
              name={bookingAllowed.name}
              value={bookAllowed}
              label={bookingAllowed.label}
              data={spaceStatusList.booking}
              fullWidth
              disabled={!!(updateResult && updateResult.status)}
            />
          </Col>
        </ThemeProvider>
      </Row>
    </>
  );
};

UpdateSpaceForm.propTypes = {
  formField: PropTypes.objectOf(PropTypes.object).isRequired,
  updateResult: PropTypes.shape({
    status: '',
  }),
  formValues: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.number,
    PropTypes.bool,
    PropTypes.string,
  ]).isRequired,
};
UpdateSpaceForm.defaultProps = {
  updateResult: {},
};

export default UpdateSpaceForm;
