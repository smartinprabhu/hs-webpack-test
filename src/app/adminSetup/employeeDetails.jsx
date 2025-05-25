/* eslint-disable import/no-unresolved */
/* eslint-disable prefer-destructuring */
import React, { useEffect, useState } from 'react';
import {
  Row, Col, Card, CardBody, Button,
} from 'reactstrap';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import FormControl from '@material-ui/core/FormControl';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import PropTypes from 'prop-types';

import Loader from '@shared/loading';
import {
  getAllowedNeighbourhood, getNotInAllowedNeighbourhood,
} from '../dashboard/dashboardService';

const appModels = require('../util/appModels').default;

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    width: '100%',
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
}));

const EmployeeDetails = ({ setEmployeeDetails }) => {
  const classes = useStyles();
  const {
    employeeDetails, allowedNeighbourhood, allowedNotInNeighbourhood,
  } = useSelector((state) => state.config);
  const [fieldEditable, setFieldEditable] = useState(false);

  const dispatch = useDispatch();

  let empDetails;
  if (employeeDetails && employeeDetails.data && employeeDetails.data[0]) empDetails = employeeDetails.data[0];

  useEffect(() => {
    if (empDetails && empDetails.space_neighbour_ids && empDetails.space_neighbour_ids.length > 0) {
      dispatch(getAllowedNeighbourhood(empDetails.space_neighbour_ids, appModels.SPACE, empDetails.id));
    }
  }, [empDetails]);

  const editEmployeeDetails = () => {
    setFieldEditable(true);
    dispatch(getNotInAllowedNeighbourhood(empDetails.space_neighbour_ids, appModels.SPACE, empDetails.id));
  };

  const discardEdit = () => {
    setFieldEditable(false);
  };

  const saveEmployeeInfo = {
    space_neighbour_ids: [],
    empData: empDetails,
  };

  const [age, setAge] = useState('');

  const handleChange = (event, space) => {
    setAge(event.target.value);
    saveEmployeeInfo.empData[event.target.name].push(space.id);
  };

  const saveNeighbourhood = (data) => {
    // eslint-disable-next-line no-console
    console.log(data);
  };

  return (
    <Row>
      <Col sm="12" md="12" lg="12">
        <Row>
          <Col sm="12" md="12" lg="12" className="p-2 h-100 table-scrollable thin-scrollbar bg-lightblue border border-0">
            <span className="font-weight-800 mr-1 font-medium link-text">
              <Link to="/site-configuration">Admin Setup</Link>
              {' '}
              /
            </span>
            <span aria-hidden="true" className="font-weight-800 font-medium link-text">
              <Link onClick={() => setEmployeeDetails(false)} to="/site-configuration/employee-list">Employees</Link>
              {' '}
              /
            </span>
            <span className="text-lightgray ml-1 font-medium">
              {empDetails && empDetails.display_name}
            </span>
            <hr className="my-1" />
            <Row className="mt-3">
              <Col sm="4">
                <Card className="border-0 h-100">
                  <CardBody>
                    {empDetails && (
                      <>
                        <h4>
                          <span className="no-border-radius btn-navyblue text-capitalize font-weight-800 font-medium badge badge-secondary badge-pill">
                            {empDetails && empDetails.display_name}
                          </span>
                        </h4>
                        <h5 className="mt-3">
                          Employee Info
                        </h5>
                        <Card className="bg-lightblue">
                          <CardBody className="p-1">
                            <div>
                              <span className="font-weight-800">
                                First Name :
                              </span>
                              {' '}
                              <span>
                                {empDetails && empDetails.first_name}
                              </span>
                            </div>
                          </CardBody>
                        </Card>
                        <Card className="bg-lightblue mt-2">
                          <CardBody className="p-1">
                            <div>
                              <span className="font-weight-800">
                                Last Name :
                              </span>
                              {' '}
                              <span>
                                {empDetails && empDetails.last_name}
                              </span>
                            </div>
                          </CardBody>
                        </Card>
                        <Card className="bg-lightblue mt-2">
                          <CardBody className="p-1">
                            <div>
                              <span className="font-weight-800">
                                Gender :
                              </span>
                              {' '}
                              <span className="text-capitalize">
                                {empDetails && empDetails.gender}
                              </span>
                            </div>
                          </CardBody>
                        </Card>
                        <Card className="bg-lightblue mt-2">
                          <CardBody className="p-1">
                            <div>
                              <span className="font-weight-800">
                                Marital Status :
                              </span>
                              {' '}
                              <span className="text-capitalize">
                                {empDetails && empDetails.marital}
                              </span>
                            </div>
                          </CardBody>
                        </Card>
                        <Card className="bg-lightblue mt-2">
                          <CardBody className="p-1">
                            <div>
                              <span className="font-weight-800">
                                Number of Children :
                              </span>
                              {' '}
                              <span className="text-capitalize">
                                {empDetails && empDetails.child_all_count}
                              </span>
                            </div>
                          </CardBody>
                        </Card>
                        <Card className="bg-lightblue mt-2">
                          <CardBody className="p-1">
                            <div>
                              <span className="font-weight-800">
                                Nationality (Country) :
                              </span>
                              {' '}
                              <span className="text-capitalize">
                                {empDetails && empDetails.gender}
                              </span>
                            </div>
                          </CardBody>
                        </Card>
                        <Card className="bg-lightblue mt-2">
                          <CardBody className="p-1">
                            <div>
                              <span className="font-weight-800">
                                Identification :
                              </span>
                              {' '}
                              <span className="text-capitalize">
                                {empDetails && !empDetails.identification_id && (
                                  <>No</>
                                )}
                              </span>
                            </div>
                          </CardBody>
                        </Card>
                        <Card className="bg-lightblue mt-2">
                          <CardBody className="p-1">
                            <div>
                              <span className="font-weight-800">
                                Passport :
                              </span>
                              {' '}
                              <span className="text-capitalize">
                                {empDetails && !empDetails.passport_id && (
                                  <>No</>
                                )}
                              </span>
                            </div>
                          </CardBody>
                        </Card>
                      </>
                    )}
                    {employeeDetails && employeeDetails.loading && (
                      <Loader className="text-center" />
                    )}
                  </CardBody>
                </Card>
              </Col>
              <Col sm="8" className="pl-2">
                <Card className="border-0">
                  <CardBody>
                    {empDetails && (
                      <>
                        <Card className="table-head">
                          <CardBody className="p-0 bg-gray-light">
                            <p className="ml-2 mb-1 mt-1 font-weight-800 font-side-heading">CONTACT INFORMATION</p>
                          </CardBody>
                        </Card>
                        <Row className="mb-4 ml-1 mr-1 mt-3">
                          <Col sm="12" md="12" xs="12" lg="6">
                            <Row>
                              <span className="m-0 p-0">Work Address</span>
                            </Row>
                            <Row>
                              <span className="m-0 p-0 font-weight-400 text-capital">{empDetails && empDetails.company_id[1]}</span>
                            </Row>
                            <hr className="mt-2" />
                            <Row>
                              <span className="m-0 p-0">Work Location</span>
                            </Row>
                            <Row>
                              <span className="m-0 p-0 font-weight-400 text-capital">{empDetails && empDetails.company_id[1]}</span>
                            </Row>
                            <hr className="mt-2" />
                            <Row>
                              <span className="m-0 p-0">Work Email</span>
                            </Row>
                            <Row>
                              <span className="m-0 p-0 font-weight-400 text-capital">{empDetails && empDetails.work_email}</span>
                            </Row>
                            <hr className="mt-2" />
                            <Row>
                              <span className="m-0 p-0">Work Mobile</span>
                            </Row>
                            <Row>
                              <span className="m-0 p-0 font-weight-400 text-capital">{empDetails && empDetails.work_phone}</span>
                            </Row>
                            <hr className="mt-2" />
                            <Row>
                              <span className="m-0 p-0">Work Phone</span>
                            </Row>
                            <Row>
                              <span className="m-0 p-0 font-weight-400 text-capital">{empDetails && empDetails.work_phone}</span>
                            </Row>
                            <hr className="mt-2" />
                            <Row>
                              <span className="m-0 p-0">Registration Status</span>
                            </Row>
                            <Row>
                              <span className="m-0 p-0 font-weight-400 text-capital">{empDetails && empDetails.registration_status}</span>
                            </Row>
                            <hr className="mt-2" />
                            <Row>
                              <span className="m-0 p-0">Onboarded</span>
                            </Row>
                            <Row>
                              <span className="m-0 p-0 font-weight-400 text-capital">{empDetails && empDetails.company_id[1]}</span>
                            </Row>
                          </Col>
                          <Col sm="12" md="12" lg="6" />
                        </Row>
                        <Card className="table-head">
                          <CardBody className="p-0 bg-gray-light">
                            <p className="ml-2 mb-1 mt-1 font-weight-800 font-side-heading">Neighbourhoods</p>
                          </CardBody>
                        </Card>
                        <Row className="mb-4 ml-1 mr-1 mt-3">
                          <Col sm="12" md="12" xs="12" lg="6">
                            <Row>
                              <span className="m-0 p-0">Allowed Neighbourhoods</span>
                            </Row>
                            {allowedNeighbourhood && allowedNeighbourhood.data && allowedNeighbourhood.data.length > 0 && allowedNeighbourhood.data.map((neighbour) => (
                              <React.Fragment key={`${neighbour.id}`}>
                                <Row className="mt-2">
                                  <span className="no-border-radius btn-navyblue text-capitalize font-weight-800 font-medium badge badge-secondary badge-pill">
                                    {neighbour.display_name}
                                  </span>
                                </Row>
                                <hr className="mt-2" />
                              </React.Fragment>
                            ))}
                            {fieldEditable && (
                              <FormControl className={classes.formControl}>
                                <Select
                                  labelId="demo-simple-select-label"
                                  id="demo-simple-select"
                                  value={age}
                                  onChange={handleChange}
                                  name="space_neighbour_ids"
                                >
                                  {allowedNotInNeighbourhood && allowedNotInNeighbourhood.data && allowedNotInNeighbourhood.data.length > 0 && allowedNotInNeighbourhood.data.map((neighbour) => (
                                    <MenuItem key={`${neighbour.id}`} name="space_neighbour_ids" value={neighbour.display_name}>{neighbour.display_name}</MenuItem>
                                  ))}
                                </Select>
                              </FormControl>
                            )}
                          </Col>
                        </Row>
                      </>
                    )}
                    {employeeDetails && employeeDetails.loading && (
                      <Loader className="text-center" />
                    )}
                  </CardBody>
                </Card>
              </Col>
            </Row>
          </Col>
        </Row>
      </Col>
      <Col sm="12" className="mt-3">
        <span className="float-right">
          {fieldEditable && allowedNotInNeighbourhood && allowedNotInNeighbourhood.data && (
            <>
              <Button  variant="contained" className="mr-2" onClick={saveNeighbourhood}>
                Save
              </Button>
              <Button  variant="contained" onClick={discardEdit}>
                Discard
              </Button>
            </>
          )}
          {!fieldEditable && allowedNotInNeighbourhood && !allowedNotInNeighbourhood.data && (
            <>
              <Button  variant="contained" className="mr-2" onClick={editEmployeeDetails}>
                Edit
              </Button>
            </>
          )}
        </span>
      </Col>
    </Row>
  );
};
EmployeeDetails.propTypes = {
  setEmployeeDetails: PropTypes.func.isRequired,
};
export default EmployeeDetails;
