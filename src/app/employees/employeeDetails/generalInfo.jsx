/* eslint-disable no-unused-expressions */
/* eslint-disable import/no-unresolved */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable no-console */
import React, { useState, useEffect } from 'react';
import {
  Col,
  Row,
  Card,
  CardBody,
  Table,
  Modal,
  ModalBody,
} from 'reactstrap';
import Button from '@mui/material/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import { useSelector, useDispatch } from 'react-redux';
import * as PropTypes from 'prop-types';
import { Formik, Form } from 'formik';
import { ThemeProvider } from '@material-ui/core/styles';
import { Autocomplete } from '@material-ui/lab';
import { TextField, CircularProgress, FormHelperText } from '@material-ui/core';

import Loader from '@shared/loading';
import ErrorContent from '@shared/errorContent';
import { InputField } from '@shared/formFields';
import ModalHeaderComponent from '@shared/modalHeaderComponent';

import {
  getEmployeeDetail, getNeighbourhoods, updateEmployeeData, resetEmployeeData,
  loadNeighbourhoods,
} from '../employeeService';
import theme from '../../util/materialTheme';
import {
  getDefaultNoValue, generateErrorMessage,
  getColumnArrayById, isArrayColumnExists,
  trimJsonObject,
} from '../../util/appUtils';
import formFields from './formFields.json';
import neighbourhoodValidationSchema from './neighbourhoodValidationSchema';

const appModels = require('../../util/appModels').default;

const currentValidationSchema = neighbourhoodValidationSchema;

const GeneralInfo = (props) => {
  const {
    isEdit, afterUpdate, showFilter,
  } = props;
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [isEditable, setEditable] = useState(isEdit);
  const [spaceList, setSpaces] = useState([]);
  const sortBy = 'DESC';
  const sortField = 'create_date';
  const [update, setUpdate] = useState(false);
  const [userName, setUserName] = useState(null);
  const [userEmail, setUserEmail] = useState(null);
  const [employeeNumber, setEmployeeNumber] = useState(null);
  const [neighbourHoods, setNeighbourHoodsData] = useState([]);
  const [mobileNumber, setMobileNumber] = useState(null);
  const {
    employeeDetails, employeeNeighbours, updateEmployee, neighbourSpacesInfo,
  } = useSelector((state) => state.employee);
  const { userInfo } = useSelector((state) => state.user);

  useEffect(() => {
    setEditable(isEdit);
    showFilter(false);
  }, [isEdit]);

  useEffect(() => {
    if (employeeDetails && employeeDetails.data) {
      const ids = employeeDetails.data.length > 0
        ? employeeDetails.data[0].neighbour_groups_ids : [];
      dispatch(getNeighbourhoods(ids, appModels.NEIGHBOURHOODGROUP));
    }
  }, [employeeDetails]);

  useEffect(() => {
    if (employeeNeighbours && employeeNeighbours.data) {
      const arr = [...spaceList, ...employeeNeighbours.data];
      setSpaces([...new Map(arr.map((item) => [item.id, item])).values()]);
    }
  }, [employeeNeighbours]);

  useEffect(() => {
    (async () => {
      if (userInfo && userInfo.data && userInfo.data.company) {
        await dispatch(loadNeighbourhoods(userInfo.data.company.id, appModels.NEIGHBOURHOODGROUP, sortBy, sortField));
      }
    })();
  }, [sortBy, sortField]);

  useEffect(() => {
    if (neighbourSpacesInfo && neighbourSpacesInfo.data) {
      const arr = [...spaceList, ...neighbourSpacesInfo.data];
      setSpaces([...new Map(arr.map((item) => [item.id, item])).values()]);
    }
  }, [neighbourSpacesInfo]);

  const toggle = () => {
    setUpdate(false);
    dispatch(resetEmployeeData());
    const viewId = employeeDetails && employeeDetails.data && employeeDetails.data.length > 0 ? employeeDetails.data[0].id : '';
    dispatch(getEmployeeDetail(viewId, appModels.USERMANAGEMENT));
    if (afterUpdate) afterUpdate();
  };

  const closeModal = () => {
    setUpdate(false);
    if (afterUpdate) afterUpdate();
  };

  const onUpdate = (updateValues) => {
    if (updateValues) {
      const postData = {
        name: `${(userName !== null) ? userName : employeeDetails && employeeDetails.data && employeeDetails.data[0].name}`,
        email: `${(userEmail !== null) ? userEmail : employeeDetails && employeeDetails.data && employeeDetails.data[0].email}`,
        employee_id_seq: `${(employeeNumber !== null) ? employeeNumber : employeeDetails && employeeDetails.data && employeeDetails.data[0].employee_id_seq}`,
        phone_number: `${(mobileNumber !== null) ? mobileNumber : employeeDetails && employeeDetails.data && employeeDetails.data[0].phone_number}`,
      };
      if (isArrayColumnExists(neighbourHoods, 'id')) {
        postData.neighbour_groups_ids = [[6, false, getColumnArrayById(neighbourHoods, 'id')]];
      }
      const id = employeeDetails && employeeDetails.data ? employeeDetails.data[0].id : '';
      dispatch(updateEmployeeData(id, postData, appModels.USERMANAGEMENT));
      setMobileNumber(null);
      setUserName(null);
      setUserEmail(null);
      setEmployeeNumber(null);
      // setJobTitle(null);
      // setWorkLocation(null);
    }
  };

  function handleSubmit(values) {
    onUpdate(values);
    setUpdate(true);
  }

  function getRow(assetData) {
    const neighbourLocations = [];
    for (let i = 0; i < assetData.length; i += 1) {
      neighbourLocations.push(
        <tr key={i}>
          <td className="p-2 min-width-160 text-info font-weight-700">{getDefaultNoValue(assetData[i].id)}</td>
          <td className="p-2 min-width-160">{getDefaultNoValue(assetData[i].name)}</td>
        </tr>,
      );
    }
    return neighbourLocations;
  }

  // function getUpdatedNeighbours(assetData) {
  //   const neighbourLocations = [];
  //   for (let i = 0; i < assetData.length; i += 1) {
  //     neighbourLocations.push(
  //       <tr key={i}>
  //         <td className="p-2 font-weight-700">{getDefaultNoValue(assetData[i].path_name)}</td>
  //         <td className="p-2">{getDefaultNoValue(assetData[i].space_name)}</td>
  //       </tr>,
  //     );
  //   }
  //   return neighbourLocations;
  // }

  function onChangeData(e, fields) {
    if (fields === 'name') {
      setUserName(e.target.value);
    }
    if (fields === 'work_phone') {
      setMobileNumber(e.target.value);
    }
    if (fields === 'email') {
      setUserEmail(e.target.value);
    }
    if (fields === 'employee_id_seq') {
      setEmployeeNumber(e.target.value);
    }
  }

  // eslint-disable-next-line consistent-return
  function keyHandle(e, fields) {
    if (fields === 'work_phone') {
      if (e.which !== 8 && (e.which < 48 || e.which > 57)) {
        e.preventDefault();
        return false;
      }
      if (e.target.value.length >= 12) {
        e.preventDefault();
      }
    } else if (fields === 'name') {
      if (e.target.value.length > 25) {
        e.preventDefault();
      } else {
        return true;
      }
    } else if (fields === 'email') {
      if (e.target.value.length >= 50) {
        e.preventDefault();
      } else {
        return true;
      }
    } else if (fields === 'employee_id_seq') {
      if (e.which !== 8 && (e.which < 48 || e.which > 57)) {
        e.preventDefault();
        return false;
      }
      if (e.target.value.length > 12) {
        e.preventDefault();
      }
    }
  }

  useEffect(() => {
    if (employeeNeighbours && employeeNeighbours.data) {
      const neighbourData = employeeNeighbours && employeeNeighbours.data;
      setNeighbourHoodsData(neighbourData);
    }
  }, [employeeNeighbours.data]);

  function AutoUpdateFields(fieldName) {
    const mobile = employeeDetails && employeeDetails.data && employeeDetails.data[0].phone_number;
    if (fieldName === 'work_phone') {
      return mobile;
    }
    const email = employeeDetails && employeeDetails.data && employeeDetails.data[0].email;
    if (fieldName === 'email') {
      return email;
    }
    const name = employeeDetails && employeeDetails.data && employeeDetails.data[0].name;
    if (fieldName === 'name') {
      return name;
    }
    const employeeId = employeeDetails && employeeDetails.data && employeeDetails.data[0].employee_id_seq;
    if (fieldName === 'employee_id_seq') {
      return employeeId;
    }
  }

  function handleNeighbourHoodsData(e, data) {
    setNeighbourHoodsData(data);
  }

  return (
    <>
      {employeeDetails && (employeeDetails.data && employeeDetails.data.length > 0) && (
        <Row>
          <Col md="12" sm="12" lg="12" xs="12">
            <Card className="border-0 h-100">
              <CardBody>
                <>
                  <Card className="table-head">
                    <CardBody className="p-0 heading ">
                      <p className="ml-2 mb-1 mt-1 font-weight-800 font-side-heading">GENERAL INFORMATION</p>
                    </CardBody>
                  </Card>
                  <Row className="my-3 m-0">
                    <Col sm="12" md="12" xs="12" lg="6" className="pr-0">
                      <Row className="m-0">
                        <span className="m-0 p-0 font-weight-400">Onboarded</span>
                      </Row>
                      <Row className="m-0">
                        <span className="m-0 p-0 font-weight-800 text-capital">{getDefaultNoValue(employeeDetails.data[0].company_id ? employeeDetails.data[0].company_id[1] : '')}</span>
                      </Row>
                      <hr className="mt-3" />
                    </Col>
                  </Row>
                  <Card className="table-head">
                    <CardBody className="p-0 heading">
                      <p className="ml-2 mb-1 mt-1 font-weight-800 font-side-heading">NEIGHBOURHOOD GROUPS</p>
                    </CardBody>
                  </Card>
                  <Row className="mb-4 ml-0 mt-0">
                    <Col sm="12" md="12" lg="12" xs="12" className="pl-0">
                      {(employeeNeighbours && employeeNeighbours.data) && (
                        <div>
                          <Table responsive className="mb-0 font-weight-400 border-0 assets-table" width="100%">
                            <thead>
                              <tr>
                                <th className="p-2 border-top-0">
                                  ID
                                </th>
                                <th className="p-2 min-width-100 border-top-0">
                                  Name
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              {getRow(
                                employeeNeighbours
                                  && employeeNeighbours.data
                                  ? employeeNeighbours.data : [],
                              )}
                            </tbody>
                          </Table>
                          <hr className="m-0" />
                        </div>
                      )}
                      {employeeNeighbours && employeeNeighbours.loading && (
                        <Loader />
                      )}
                      {(employeeNeighbours && employeeNeighbours.err) && (
                        <ErrorContent errorTxt={generateErrorMessage(employeeNeighbours)} />
                      )}
                    </Col>
                  </Row>
                </>
                <Modal className="edit-modal" centered size={updateEmployee && updateEmployee.data ? 'sm' : 'lg'} isOpen={isEditable}>
                  <ModalHeaderComponent title="Edit Employee" closeModalWindow={closeModal} response={updateEmployee} />
                  <ModalBody className="pt-0 mx-3">
                    <Formik
                      initialValues={trimJsonObject(employeeDetails.data[0])}
                      validationSchema={currentValidationSchema}
                      // eslint-disable-next-line react/jsx-no-bind
                      onSubmit={handleSubmit}
                    >
                      {({
                        values, errors,
                      }) => (
                        <Form id="filter_frm">
                          {((updateEmployee && updateEmployee.data)) ? ('') : (
                            <ThemeProvider theme={theme}>
                              <Row className="mb-4 mt-2">
                                {formFields
                                    && formFields.fields
                                    && formFields.fields.map((fields) => (
                                      <React.Fragment key={fields.id}>
                                        {fields.type !== 'array' && (
                                          <Col sm="12" md="12" xs="12" lg="6">
                                            <InputField
                                              className="mt-2 height-40"
                                              name={fields.name}
                                              label={fields.label}
                                              type={fields.type}
                                              defaultValue={AutoUpdateFields(fields.name)}
                                              readOnly={
                                                employeeDetails && employeeDetails.data && employeeDetails.data[0] && employeeDetails.data[0].oauth_uid !== ''
                                                  ? !!(fields.name === 'name' || fields.name === 'email' || fields.name === 'employee_id_seq' || fields.name === 'work_phone' || update) : ''
                                              }
                                              onKeyPress={(e) => keyHandle(e, fields.name)}
                                              onKeyUp={(e) => onChangeData(e, fields.name)}
                                            />
                                          </Col>
                                        )}
                                      </React.Fragment>
                                    ))}
                              </Row>
                              <Card className="table-head">
                                <CardBody className="p-0 bg-gray-light">
                                  <p className="ml-2 mb-1 mt-1 font-weight-800 font-side-heading">
                                    NEIGHBOURHOOD GROUPS
                                    <span className="text-danger"> *</span>
                                  </p>
                                </CardBody>
                              </Card>
                              <Row className="mb-4 mt-3">
                                <Col sm="12" md="12" xs="12" lg="12">
                                  <Autocomplete
                                    multiple
                                    disabled={!!update}
                                    filterSelectedOptions
                                    limitTags={3}
                                    id="tags-filled"
                                    name="space_neighbour_ids"
                                    label="Allowed Neighbourhoods"
                                    open={open}
                                    size="small"
                                    onOpen={() => {
                                      setOpen(true);
                                    }}
                                    onClose={() => {
                                      setOpen(false);
                                    }}
                                    loading={neighbourSpacesInfo && neighbourSpacesInfo.loading}
                                    options={spaceList}
                                    getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
                                    defaultValue={employeeNeighbours && employeeNeighbours.data ? employeeNeighbours.data : []}
                                    onChange={(e, data) => handleNeighbourHoodsData(e, data)}
                                    renderInput={(params) => (
                                      <TextField
                                        {...params}
                                        variant="outlined"
                                        placeholder="Select Space"
                                        InputProps={{
                                          ...params.InputProps,
                                          endAdornment: (
                                            <>
                                              {neighbourSpacesInfo
                                                && neighbourSpacesInfo.loading
                                                ? <CircularProgress color="inherit" size={20} /> : null}
                                              {params.InputProps.endAdornment}
                                            </>
                                          ),
                                        }}
                                      />
                                    )}
                                  />
                                  {(neighbourSpacesInfo
                                      && neighbourSpacesInfo.err
                                      && !neighbourSpacesInfo.loading
                                      && !neighbourSpacesInfo.data) && (
                                        <FormHelperText><span className="text-danger">Failed to Load..</span></FormHelperText>
                                  )}
                                  {(errors.space_neighbour_ids && (values.space_neighbour_ids === null
                                        || (!(employeeNeighbours.data) && values.space_neighbour_ids === undefined))) && (
                                        <FormHelperText><span className="text-danger">Neighbourhood groups required</span></FormHelperText>
                                  )}
                                </Col>
                              </Row>
                            </ThemeProvider>
                          )}
                          {(updateEmployee
                              && updateEmployee.err) && (
                                <div className="text-danger text-center p-3">
                                  {generateErrorMessage(updateEmployee)}
                                </div>
                          )}
                          {(updateEmployee
                              && updateEmployee.data) && (
                                <div className="text-success text-center">
                                  <FontAwesomeIcon size="lg" className="action-fa-button-lg" icon={faCheck} />
                                  {' '}
                                  {' '}
                                  Employee updated successfully.
                                </div>
                          )}
                          <hr />
                          <div className="float-right">
                            {!((updateEmployee && updateEmployee.err)
                              || (updateEmployee && updateEmployee.data)) && (
                                <>
                                  <Button variant="contained" size="sm" className="btn-cancel mr-2" onClick={closeModal}>Cancel</Button>
                                  <Button
                                    disabled={(neighbourHoods === null || errors.work_phone || errors.email || (neighbourHoods && neighbourHoods.length === 0))}
                                    // eslint-disable-next-line react/jsx-no-bind
                                    onClick={handleSubmit}
                                     variant="contained"
                                    size="sm"
                                  >
                                    Update
                                  </Button>
                                </>
                            )}
                          </div>
                          <div className="float-right">
                            {((updateEmployee
                        && updateEmployee.err)
                        || (updateEmployee
                          && updateEmployee.data)) && (
                          <Button  variant="contained" onClick={() => toggle()}>OK</Button>
                            )}
                          </div>
                        </Form>
                      )}
                    </Formik>
                  </ModalBody>
                </Modal>
              </CardBody>
            </Card>
          </Col>
        </Row>
      )}
      {employeeDetails.loading && (
        <Card>
          <CardBody className="mt-4">
            <Loader />
          </CardBody>
        </Card>
      )}

      {(employeeDetails && employeeDetails.err) && (
        <Card>
          <CardBody>
            <ErrorContent errorTxt={generateErrorMessage(employeeDetails)} />
          </CardBody>
        </Card>
      )}
    </>
  );
};

GeneralInfo.propTypes = {
  isEdit: PropTypes.bool.isRequired,
  afterUpdate: PropTypes.func.isRequired,
  showFilter: PropTypes.func.isRequired,
};

export default GeneralInfo;
