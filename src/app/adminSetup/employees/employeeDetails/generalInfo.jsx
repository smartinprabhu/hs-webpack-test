/* eslint-disable import/no-unresolved */
/* eslint-disable react/jsx-props-no-spreading */
import React, { useState, useEffect } from 'react';
import {
  Col,
  Row,
  Card,
  CardBody,
  Table,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from 'reactstrap';
import Button from '@mui/material/Button';
import { useSelector, useDispatch } from 'react-redux';
import * as PropTypes from 'prop-types';
import { Formik, Form } from 'formik';
import { ThemeProvider } from '@material-ui/core/styles';
import { Autocomplete } from '@material-ui/lab';
import { TextField, CircularProgress, FormHelperText } from '@material-ui/core';

import closeCircleWhiteIcon from '@images/icons/closeCircleWhite.svg';
import SuccessAndErrorFormat from '@shared/successAndErrorFormat';
import Loader from '@shared/loading';
import ErrorContent from '@shared/errorContent';
import { InputField } from '@shared/formFields';
import {
  getEmployeeDetail, getNeighbourhoods, updateEmployeeData, resetEmployeeData,
  loadNeighbourhoods,
} from '../employeeService';
import theme from '../../../util/materialTheme';
import {
  getDefaultNoValue, generateErrorMessage,
  usMobile, getColumnArrayById, isArrayColumnExists,
  trimJsonObject,
} from '../../../util/appUtils';
import {
  getArrayFromIds,
} from '../utils/utils';
import formFields from './formFields.json';
import neighbourhoodValidationSchema from './neighbourhoodValidationSchema';

const appModels = require('../../../util/appModels').default;

const currentValidationSchema = neighbourhoodValidationSchema;

const GeneralInfo = (props) => {
  const { isEdit, afterUpdate } = props;
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [isEditable, setEditable] = useState(isEdit);
  const [updateValues, setUpdateValues] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const [spaceList, setSpaces] = useState([]);
  const [sortBy, setSortBy] = useState('DESC');
  const [sortField, setSortField] = useState('create_date');

  const {
    employeeDetails, employeeNeighbours, updateEmployee, neighbourSpacesInfo,
  } = useSelector((state) => state.setup);
  const { userInfo } = useSelector((state) => state.user);

  useEffect(() => {
    setEditable(isEdit);
  }, [isEdit]);

  useEffect(() => {
    if (employeeDetails && employeeDetails.data) {
      const ids = employeeDetails.data.length > 0 ? employeeDetails.data[0].space_neighbour_ids : [];
      dispatch(getNeighbourhoods(ids, appModels.SPACE));
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
      if (userInfo && userInfo.data) {
        await dispatch(loadNeighbourhoods(userInfo.data.company.id, appModels.SPACE, sortBy, sortField));
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
    setShowPreview(false);
    dispatch(resetEmployeeData());
    const viewId = employeeDetails && employeeDetails.data && employeeDetails.data.length > 0 ? employeeDetails.data[0].id : '';
    dispatch(getEmployeeDetail(viewId, appModels.EMPLOYEE));
    if (afterUpdate) afterUpdate();
  };

  const keyHandle = (e) => {
    // eslint-disable-next-line no-console
    console.log(e);
  };

  function handleSubmit(values) {
    setUpdateValues(values);
    setShowPreview(true);
  }

  const onUpdate = () => {
    if (updateValues) {
      let postData = {
        work_email: updateValues.work_email,
        work_phone: updateValues.work_phone,
        work_location: updateValues.work_location,
        job_title: updateValues.job_title,
      };

      if (isArrayColumnExists(updateValues.space_neighbour_ids, 'id')) {
        postData = {
          work_email: updateValues.work_email,
          work_phone: updateValues.work_phone,
          work_location: updateValues.work_location,
          job_title: updateValues.job_title,
          space_neighbour_ids: [[6, false, getColumnArrayById(updateValues.space_neighbour_ids, 'id')]],
        };
      }
      const id = employeeDetails && employeeDetails.data ? employeeDetails.data[0].id : '';
      dispatch(updateEmployeeData(id, postData, appModels.EMPLOYEE));
    }
  };

  function getRow(assetData) {
    const neighbourLocations = [];
    for (let i = 0; i < assetData.length; i += 1) {
      neighbourLocations.push(
        <tr key={i}>
          <td className="p-2 min-width-160 text-info font-weight-700">{getDefaultNoValue(assetData[i].path_name)}</td>
          <td className="p-2 min-width-160">{getDefaultNoValue(assetData[i].space_name)}</td>
        </tr>,
      );
    }
    return neighbourLocations;
  }

  function getUpdatedNeighbours(assetData) {
    const neighbourLocations = [];
    for (let i = 0; i < assetData.length; i += 1) {
      neighbourLocations.push(
        <tr key={i}>
          <td className="p-2 font-weight-700">{getDefaultNoValue(assetData[i].path_name)}</td>
          <td className="p-2">{getDefaultNoValue(assetData[i].space_name)}</td>
        </tr>,
      );
    }
    return neighbourLocations;
  }

  return (
    <>
      {employeeDetails && (employeeDetails.data && employeeDetails.data.length > 0) && (
      <Row>
        <Col md="12" sm="12" lg="12" xs="12">
          <Card className="border-0 h-100">
            <CardBody>
              {!isEditable && (
                <>
                  <Card className="table-head">
                    <CardBody className="p-0 bg-gray-light">
                      <p className="ml-2 mb-1 mt-1 font-weight-800 font-side-heading">GENERAL INFORMATION</p>
                    </CardBody>
                  </Card>
                  <Row className="mb-4  mt-3">
                    <Col sm="12" md="12" xs="12" lg="6">
                      <Row className="m-0">
                        <span className="m-0 p-0 font-weight-400">Work Address</span>
                      </Row>
                      <Row className="m-0">
                        <span className="m-0 p-0 font-weight-800 text-capital">{getDefaultNoValue(employeeDetails.data[0].address_id ? employeeDetails.data[0].address_id[1] : '')}</span>
                      </Row>
                      <hr className="mt-3" />
                    </Col>
                    <Col sm="12" md="12" xs="12" lg="6">
                      <Row className="m-0">
                        <span className="m-0 p-0 font-weight-400">Onboarded</span>
                      </Row>
                      <Row className="m-0">
                        <span className="m-0 p-0 font-weight-800 text-capital">{getDefaultNoValue(employeeDetails.data[0].company_id ? employeeDetails.data[0].company_id[1] : '')}</span>
                      </Row>
                      <hr className="mt-3" />
                    </Col>
                    <Col sm="12" md="12" xs="12" lg="6">
                      <Row className="m-0">
                        <span className="m-0 p-0 font-weight-400">Work Phone</span>
                      </Row>
                      <Row className="m-0">
                        <span className="m-0 p-0 font-weight-800">{getDefaultNoValue(employeeDetails.data[0].work_phone)}</span>
                      </Row>
                      <hr className="mt-3" />
                    </Col>
                    <Col sm="12" md="12" xs="12" lg="6">
                      <Row className="m-0">
                        <span className="m-0 p-0 font-weight-400">Job Title</span>
                      </Row>
                      <Row className="m-0">
                        <span className="m-0 p-0 font-weight-800">{getDefaultNoValue(employeeDetails.data[0].job_title)}</span>
                      </Row>
                      <hr className="mt-3" />
                    </Col>
                    <Col sm="12" md="12" xs="12" lg="6">
                      <Row className="m-0">
                        <span className="m-0 p-0 font-weight-400">Work Email</span>
                      </Row>
                      <Row className="m-0">
                        <span className="m-0 p-0 font-weight-800">{getDefaultNoValue(employeeDetails.data[0].work_email)}</span>
                      </Row>
                      <hr className="mt-3" />
                    </Col>
                  </Row>
                  <Card className="table-head">
                    <CardBody className="p-0 bg-gray-light">
                      <p className="ml-2 mb-1 mt-1 font-weight-800 font-side-heading">NEIGHBOURHOODS</p>
                    </CardBody>
                  </Card>
                  <Row className="mb-4 ml-0 mt-0">
                    <Col sm="12" md="12" lg="12" xs="12" className="p-3">
                      {(employeeNeighbours && employeeNeighbours.data) && (
                      <div>
                        <Table responsive className="mb-0 mt-2 font-weight-400 border-0 assets-table" width="100%">
                          <thead>
                            <tr>
                              <th className="p-2">
                                Full Path Name
                              </th>
                              <th className="p-2 min-width-100">
                                Space Name
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {getRow(employeeNeighbours && employeeNeighbours.data ? employeeNeighbours.data : [])}
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
              )}
              {isEditable && (
              <>
                <Formik
                  initialValues={trimJsonObject(employeeDetails.data[0])}
                  validationSchema={currentValidationSchema}
                  onSubmit={handleSubmit}
                >
                  {({
                    setFieldValue, setFieldTouched, isValid, values, errors, touched,
                  }) => (
                    <Form id="filter_frm">
                      <ThemeProvider theme={theme}>
                        <Card className="table-head">
                          <CardBody className="p-0 bg-gray-light">
                            <p className="ml-2 mb-1 mt-1 font-weight-800 font-side-heading">GENERAL INFORMATION</p>
                          </CardBody>
                        </Card>
                        <Row className="mb-4 mt-3">
                          {formFields && formFields.fields && formFields.fields.map((fields) => (
                            <React.Fragment key={fields.id}>
                              {fields.type !== 'array' && (
                              <Col sm="12" md="12" xs="12" lg="6">
                                <InputField
                                  name={fields.name}
                                  label={fields.label}
                                  type={fields.type}
                                  readOnly={fields.readonly}
                                  onKeyPress={fields.name === 'work_phone' ? usMobile : keyHandle}
                                />
                              </Col>
                              )}
                            </React.Fragment>
                          ))}
                        </Row>
                        <Card className="table-head">
                          <CardBody className="p-0 bg-gray-light">
                            <p className="ml-2 mb-1 mt-1 font-weight-800 font-side-heading">NEIGHBOURHOODS</p>
                          </CardBody>
                        </Card>
                        <Row className="mb-4 mt-3">
                          <Col sm="12" md="12" xs="12" lg="12">
                            <Autocomplete
                              multiple
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
                              getOptionLabel={(option) => (typeof option === 'string' ? option : option.path_name)}
                              defaultValue={employeeNeighbours && employeeNeighbours.data ? employeeNeighbours.data : []}
                              onChange={(e, data) => setFieldValue('space_neighbour_ids', data)}
                              onBlur={() => setFieldTouched('space_neighbour_ids', true)}
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  variant="outlined"
                                  placeholder="Select Space"
                                  InputProps={{
                                    ...params.InputProps,
                                    endAdornment: (
                                      <>
                                        {neighbourSpacesInfo && neighbourSpacesInfo.loading ? <CircularProgress color="inherit" size={20} /> : null}
                                        {params.InputProps.endAdornment}
                                      </>
                                    ),
                                  }}
                                />
                              )}
                            />
                            {(neighbourSpacesInfo && neighbourSpacesInfo.err && !neighbourSpacesInfo.loading && !neighbourSpacesInfo.data) && (
                            <FormHelperText><span className="text-danger">Failed to Load..</span></FormHelperText>
                            )}
                            {(errors.space_neighbour_ids && touched.space_neighbour_ids) && (
                            <FormHelperText><span className="text-danger">Neighbourhoods Required</span></FormHelperText>
                            )}
                          </Col>
                        </Row>
                      </ThemeProvider>
                      <hr />
                      <div className="float-right">
                        <Button
                          disabled={(!(isValid)) || !(values && isArrayColumnExists(values.space_neighbour_ids, 'id'))}
                          type="submit"
                           variant="contained"
                        >
                          Update
                        </Button>
                      </div>
                    </Form>
                  )}
                </Formik>
                <Modal className="border-radius-50px lookupModal" isOpen={showPreview}>
                  <ModalHeader className="modal-justify-header">
                    <Row>
                      <Col sm="12" md="12" lg="12" xs="12" className="pr-0">
                        <Button
                           variant="contained"
                          size="sm"
                          onClick={() => toggle()}
                          className="bg-white pb-1 pt-1 tab_nav_link rounded-pill border-color-red-gray float-right mb-1 mr-3"
                        >
                          Cancel
                          <img className="ml-2" src={closeCircleWhiteIcon} alt="cancel" width="15" height="15" />
                        </Button>

                        <h4 className="font-weight-800 mb-0">
                          Neighbourhood Update
                        </h4>

                      </Col>
                    </Row>
                  </ModalHeader>
                  <ModalBody>
                    <Row>
                      <Col sm="12" md="12" lg="12" xs="12">
                        {(updateValues && updateValues.space_neighbour_ids) && (
                        <div className="p-2 mb-4">
                          <Table responsive className="mb-0 mt-0 font-weight-400 border-0 assets-table" width="100%">
                            <thead className="bg-gray-light">
                              <tr>
                                <th className="p-2 min-width-100">
                                  <span aria-hidden="true" className="sort-by cursor-pointer" onClick={() => { setSortField('path_name'); setSortBy(sortBy === 'ASC' ? 'DESC' : 'ASC'); }}>
                                    Full Path Name
                                  </span>
                                </th>
                                <th className="p-2 min-width-100">
                                  <span aria-hidden="true" className="sort-by cursor-pointer" onClick={() => { setSortField('space_name'); setSortBy(sortBy === 'ASC' ? 'DESC' : 'ASC'); }}>
                                    Space Name
                                  </span>
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              {getUpdatedNeighbours(updateValues && isArrayColumnExists(updateValues.space_neighbour_ids, 'id')
                                ? getArrayFromIds(neighbourSpacesInfo && neighbourSpacesInfo.data ? neighbourSpacesInfo.data : [], getColumnArrayById(updateValues.space_neighbour_ids, 'id')) : [])}
                            </tbody>
                          </Table>
                          <hr className="m-0" />
                        </div>
                        )}
                        {updateEmployee && updateEmployee.loading && (
                        <div className="text-center mt-3">
                          <Loader />
                        </div>
                        )}
                        {(updateEmployee && updateEmployee.err) && (
                        <SuccessAndErrorFormat response={updateEmployee} />
                        )}
                        {(updateEmployee && updateEmployee.data) && (
                        <SuccessAndErrorFormat response={updateEmployee} successMessage="Employee updated successfully.." />
                        )}
                      </Col>
                    </Row>
                  </ModalBody>
                  <ModalFooter>
                    {!((updateEmployee && updateEmployee.err) || (updateEmployee && updateEmployee.data)) && (
                    <>
                      <Button  variant="contained" className="btn-cancel mr-3" onClick={() => toggle()}>Cancel</Button>
                      <Button  variant="contained" onClick={() => onUpdate()}>Confirm</Button>
                    </>
                    )}
                    {((updateEmployee && updateEmployee.err) || (updateEmployee && updateEmployee.data)) && (
                    <Button  variant="contained" onClick={() => toggle()}>Ok</Button>
                    )}
                  </ModalFooter>
                </Modal>
              </>
              )}
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
};

export default GeneralInfo;
