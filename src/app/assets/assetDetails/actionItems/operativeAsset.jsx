/* eslint-disable radix */
/* eslint-disable import/no-unresolved */
/* eslint-disable react/jsx-props-no-spreading */
import React, { useEffect, useState } from 'react';
import {
  Card,
  CardBody,
  Col,
  Modal,
  ModalBody,
  ModalFooter,
  Row,
  Spinner,
  FormGroup,
  Label,
} from 'reactstrap';
import Button from '@mui/material/Button';
import * as PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import { ThemeProvider, makeStyles } from '@material-ui/core/styles';
import { Autocomplete } from '@material-ui/lab';
import {
  TextField, CircularProgress, FormHelperText,
} from '@material-ui/core';
import InputAdornment from '@material-ui/core/InputAdornment';
import BackspaceIcon from '@material-ui/icons/Backspace';
import IconButton from '@material-ui/core/IconButton';
import SearchIcon from '@material-ui/icons/Search';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faTools, faExclamationCircle, faCheckCircle,
} from '@fortawesome/free-solid-svg-icons';
import Loader from '@shared/loading';
import assetDefault from '@images/icons/assetDefault.svg';
import ModalHeaderComponent from '@shared/modalHeaderComponent';
import SuccessAndErrorFormat from '@shared/successAndErrorFormat';
import { getSpacesList } from '../../../helpdesk/ticketService';
import theme from '../../../util/materialTheme';
import {
  getDefaultNoValue, generateErrorMessage,
  getAllCompanies,
} from '../../../util/appUtils';
import {
  equipmentOperativeChange, createAssignmentLocation, getAssetDetail,
} from '../../equipmentService';

const appModels = require('../../../util/appModels').default;

const useStyles = makeStyles({
  option: {
    padding: 5,
    margin: 5,
    display: 'flow-root',
    '& > span': {
      marginRight: 10,
    },
  },
});

const OperativeAsset = (props) => {
  const {
    equipmentsDetails, operativeModal, atFinish,
  } = props;
  const dispatch = useDispatch();
  const classes = useStyles();
  const [modal, setModal] = useState(operativeModal);
  const [stateType, setStateType] = useState('');
  const [selectedLocation, setSelectedLocation] = useState(false);
  const [spaceKeyword, setSpaceKeyword] = useState('');
  const [spaceOpen, setSpaceOpen] = useState(false);
  const [spaceLocation, setSpaceLocation] = useState('');

  const toggle = () => {
    setModal(!modal);
    setSelectedLocation('');
    atFinish();
  };
  const { addLocationInfo, operativeInfo } = useSelector((state) => state.equipment);
  const { userInfo, userRoles } = useSelector((state) => state.user);
  const companies = getAllCompanies(userInfo, userRoles);
  const { spacesInfo } = useSelector((state) => state.ticket);

  useEffect(() => {
    const viewId = equipmentsDetails && equipmentsDetails.data ? equipmentsDetails.data[0].id : '';
    if ((userInfo && userInfo.data) && viewId && (operativeInfo && operativeInfo.data)) {
      dispatch(getAssetDetail(viewId, appModels.EQUIPMENT, false));
    }
  }, [userInfo, operativeInfo]);

  useEffect(() => {
    if ((addLocationInfo && addLocationInfo.data)) {
      const viewId = equipmentsDetails && equipmentsDetails.data ? equipmentsDetails.data[0].id : '';
      const LocationAssignId = addLocationInfo.data[0] ? addLocationInfo.data[0] : '';
      const state = 'do_assign';
      const activeModel = appModels.EQUIPMENT;
      if (viewId) {
        dispatch(equipmentOperativeChange(LocationAssignId, state, appModels.LOCATIONASSIGNMENT, viewId, activeModel));
      }
    }
  }, [addLocationInfo]);

  const equipmentData = equipmentsDetails && (equipmentsDetails.data && equipmentsDetails.data.length > 0) ? equipmentsDetails.data[0] : '';

  const handleStateChange = (id, state, type) => {
    const orderDoneCount = equipmentsDetails && equipmentsDetails.data && equipmentsDetails.data[0].order_done_count ? equipmentsDetails.data[0].order_done_count : 0;
    const locationEquipmentId = equipmentsDetails && equipmentsDetails.data && equipmentsDetails.data[0].location_id[0] ? equipmentsDetails.data[0].location_id[0] : '';
    const locationId = selectedLocation && selectedLocation.id ? selectedLocation.id : locationEquipmentId;
    const viewId = equipmentsDetails && equipmentsDetails.data ? equipmentsDetails.data[0].id : '';
    const valuesLocation = {
      equipment_id: viewId, location_id: parseInt(locationId), order_done_count: orderDoneCount,
    };
    const payload = { model: appModels.LOCATIONASSIGNMENT, values: valuesLocation };
    dispatch(createAssignmentLocation(payload));
    setStateType(type);
  };

  const orderDoneCountEnable = equipmentsDetails && equipmentsDetails.data && equipmentsDetails.data[0].order_done_count ? equipmentsDetails.data[0].order_done_count : 0;
  const locationSpaceId = equipmentsDetails && equipmentsDetails.data && equipmentsDetails.data[0].location_id ? equipmentsDetails.data[0].location_id : '';
  const oldLocationId = equipmentsDetails && equipmentsDetails.data && equipmentsDetails.data[0].location_id[1] ? equipmentsDetails.data[0].location_id[1] : '';

  useEffect(() => {
    if (oldLocationId) {
      setSpaceLocation(oldLocationId);
    }
  }, [equipmentsDetails]);

  useEffect(() => {
    (async () => {
      if (userInfo && userInfo.data) {
        await dispatch(getSpacesList(companies, appModels.SPACE, spaceKeyword));
      }
    })();
  }, [userInfo, spaceKeyword]);

  const onChange = (e, value) => {
    setSelectedLocation(value);
    setSpaceLocation(value);
  };

  const onSpaceKeywordChange = (event) => {
    setSpaceKeyword(event.target.value);
  };

  let spaceOptions = [];

  if (spacesInfo && spacesInfo.loading) {
    spaceOptions = [{ path_name: 'Loading..' }];
  }
  if (spacesInfo && spacesInfo.data) {
    spaceOptions = spacesInfo.data;
  }
  if (spacesInfo && spacesInfo.data && equipmentsDetails && equipmentsDetails.data) {
    if (locationSpaceId && locationSpaceId.length && locationSpaceId.length > 0) {
      const arr = [...spaceOptions, ...spacesInfo.data];
      const oldSpaceId = [{ id: locationSpaceId[0], path_name: locationSpaceId[1] }];
      const newArr = [...arr, ...oldSpaceId];
      spaceOptions = [...new Map(newArr.map((item) => [item.id, item])).values()];
    } else {
      spaceOptions = [...spaceOptions, ...spacesInfo.data];
    }
  }

  return (
    <Modal size="md" className="border-radius-50px modal-dialog-centered" isOpen={operativeModal}>
      <ModalHeaderComponent fontAwesomeIcon={faTools} closeModalWindow={toggle} title="Operative Asset" response={operativeInfo || addLocationInfo} />
      <ModalBody>

        {equipmentsDetails && (equipmentsDetails.data && equipmentsDetails.data.length > 0) && (
          <Card className="border-5 mt-3 ml-4 mb-4 mr-4 border-secondary rounded-0 border-top-0 border-right-0 border-bottom-0">
            <CardBody data-testid="success-case" className="bg-lightblue p-3">
              <Row>
                <Col md="2" xs="2" sm="2" lg="2">
                  <img src={assetDefault} alt="asset" className="mt-2" width="45" height="45" />
                </Col>
                <Col md="8" xs="8" sm="8" lg="8" className="ml-2">
                  <Row>
                    <h5 className="mb-1">{equipmentData.name}</h5>
                  </Row>
                  <Row>
                    <p className="mb-0 font-weight-500 font-tiny">
                      #
                      {equipmentData.location_id
                        ? equipmentData.location_id[1]
                        : <span>Not Assigned</span>}
                    </p>
                  </Row>
                  <Row>
                    <Col md="12" xs="12" sm="12" lg="12" className="p-0">
                      <span className="font-weight-800 font-side-heading mr-1">
                        Category :
                      </span>
                      <span className="font-weight-400">
                        {getDefaultNoValue(equipmentsDetails && equipmentsDetails.data && equipmentsDetails.data[0].category_id[1] ? equipmentsDetails.data[0].category_id[1] : '')}
                      </span>
                    </Col>
                  </Row>
                </Col>
              </Row>
            </CardBody>
          </Card>
        )}
        {equipmentsDetails && equipmentsDetails.loading && (
          <CardBody className="mt-4" data-testid="loading-case">
            <Loader />
          </CardBody>
        )}
        <Card className="ml-2 mr-2  border-0">
          <CardBody className="m-0 p-3">
            <Row>
              <ThemeProvider theme={theme}>
                <Col xs="12" md="12" sm="12" lg="12">
                  {!(operativeInfo && operativeInfo.data) && (
                    <FormGroup>
                      <Label for="equipment_id">Location</Label>
                      <Autocomplete
                        name="equipment_id"
                        label="Asset"
                        open={spaceOpen}
                        size="small"
                        onOpen={() => {
                          setSpaceOpen(true);
                        }}
                        onClose={() => {
                          setSpaceOpen(false);
                          setSpaceKeyword('');
                        }}
                        classes={{
                          option: classes.option,
                        }}
                        onChange={onChange}
                        value={selectedLocation && selectedLocation.path_name ? selectedLocation.path_name : spaceLocation}
                        loading={spacesInfo && spacesInfo.loading}
                        getOptionSelected={(option, value) => option.path_name === value.path_name}
                        getOptionLabel={(option) => (typeof option === 'string' ? option : option.path_name)}
                        renderOption={(option) => (
                          <>
                            <h6>{option.path_name}</h6>
                            <p className="float-left">
                              {option.space_name && (
                                <>
                                  {option.space_name}
                                </>
                              )}
                            </p>
                            <p className="float-right">
                              {option.asset_category_id && (
                                <>
                                  {option.asset_category_id ? option.asset_category_id[1] : ''}
                                </>
                              )}
                            </p>
                          </>
                        )}
                        options={spaceOptions}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            onChange={onSpaceKeywordChange}
                            variant="outlined"
                            className="without-padding custom-icons"
                            placeholder="Search & Select"
                            InputProps={{
                              ...params.InputProps,
                              endAdornment: (
                                <>
                                  {spacesInfo && spacesInfo.loading ? <CircularProgress color="inherit" size={20} /> : null}
                                  <InputAdornment position="end">
                                    {((selectedLocation && selectedLocation.path_name) || spaceLocation) && (
                                      <IconButton onClick={() => {
                                        setSpaceLocation('');
                                        setSpaceKeyword('');
                                        setSelectedLocation('');
                                      }}
                                      >
                                        <BackspaceIcon fontSize="small" />
                                      </IconButton>
                                    )}
                                    <IconButton>
                                      <SearchIcon fontSize="small" />
                                    </IconButton>
                                  </InputAdornment>
                                </>
                              ),
                            }}
                          />
                        )}
                      />
                      {(spacesInfo && spacesInfo.err) && (<FormHelperText><span className="text-danger">{generateErrorMessage(spacesInfo)}</span></FormHelperText>)}
                    </FormGroup>
                  )}
                </Col>
              </ThemeProvider>
            </Row>
          </CardBody>
        </Card>
        <Row className="justify-content-center pl-3 m-0">
          <Col xs="12" md="12" sm="12" lg="12">
            {((addLocationInfo && addLocationInfo.data) && (equipmentsDetails && !equipmentsDetails.loading) && (operativeInfo && !operativeInfo.loading) && (operativeInfo && !operativeInfo.err)) && (
              <div className="text-success text-center mt-3">
                {' '}
                <FontAwesomeIcon size="sm" className="mr-2 font-size20 mb-n2px text-success" icon={faCheckCircle} />
                {' '}
                The asset has been operative successfully..
              </div>
            )}
            {addLocationInfo && addLocationInfo.err && (
              <SuccessAndErrorFormat response={addLocationInfo} />
            )}
            {operativeInfo && operativeInfo.err && (
              <SuccessAndErrorFormat response={operativeInfo} />
            )}
            {orderDoneCountEnable > 0
              ? (
                <div className="text-danger text-center mt-3">
                  <FontAwesomeIcon className="mr-2 font-size20 mb-n2px" size="lg" icon={faExclamationCircle} />
                  You have
                  {' '}
                  {orderDoneCountEnable && orderDoneCountEnable > 0 ? orderDoneCountEnable : ''}
                  {' '}
                  open maintenance orders. Please complete to make
                  {' '}
                  {equipmentData.name}
                  {' '}
                  operative.
                  {' '}
                </div>
              )
              : ''}
          </Col>
        </Row>
      </ModalBody>
      <ModalFooter className="mr-3 ml-3">
        {(addLocationInfo && addLocationInfo.data) && (operativeInfo && !operativeInfo.loading) && (operativeInfo && !operativeInfo.err) ? (
          <Button
            type="button"
            size="sm"
             variant="contained"
            className="mr-1"
            onClick={toggle}
          >
            Ok
          </Button>
        )
          : (
            <Button
              type="button"
               variant="contained"
              size="sm"
              disabled={!spaceLocation || orderDoneCountEnable > 0}
              className="mr-1"
              onClick={() => handleStateChange(equipmentData.id, 'do_assign', 'operative')}
            >
              {(((addLocationInfo && addLocationInfo.loading) || (operativeInfo && operativeInfo.loading)) && stateType === 'operative') ? (
                <Spinner size="sm" color="light" className="mr-2" />
              ) : ''}
              {' '}
              Confirm
            </Button>
          )}
      </ModalFooter>
    </Modal>
  );
};

OperativeAsset.propTypes = {
  equipmentsDetails: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array,
  ]).isRequired,
  operativeModal: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.string,
  ]).isRequired,
  atFinish: PropTypes.func.isRequired,
};
export default OperativeAsset;
