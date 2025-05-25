/* eslint-disable import/no-unresolved */
/* eslint-disable react/jsx-props-no-spreading */
import React, { useEffect, useState } from 'react';
import {
  Card,
  CardBody,
  Col,
  Row,
  Spinner,
  FormGroup,
  Label,
} from 'reactstrap';
import {
  Box, Button,
  Dialog, DialogActions, DialogContent, DialogContentText,
} from '@mui/material';
import * as PropTypes from 'prop-types';
import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from '@material-ui/core/IconButton';
import BackspaceIcon from '@material-ui/icons/Backspace';
import SearchIcon from '@material-ui/icons/Search';
import { useSelector, useDispatch } from 'react-redux';
import { ThemeProvider, makeStyles } from '@material-ui/core/styles';
import { Autocomplete } from '@material-ui/lab';
import {
  TextField, CircularProgress, FormHelperText,
} from '@material-ui/core';

import assetDefault from '@images/icons/assetDefault.svg';
import SuccessAndErrorFormat from '@shared/successAndErrorFormat';
import Loader from '@shared/loading';
import {
  faStoreAlt,
} from '@fortawesome/free-solid-svg-icons';
import {
  getDefaultNoValue, generateErrorMessage,
  getAllowedCompanies,
} from '../../../util/appUtils';
import { getSpacesList } from '../../../helpdesk/ticketService';
import {
  equipmentStateChange, getAssetDetail, updateLocationData,
} from '../../equipmentService';
import theme from '../../../util/materialTheme';
import DialogHeader from '../../../commonComponents/dialogHeader';

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

const StoreInWarehouse = (props) => {
  const {
    equipmentsDetails, storeModal, atFinish,
  } = props;
  const dispatch = useDispatch();
  const classes = useStyles();
  const storeValue = 'wh';
  const [modal, setModal] = useState(storeModal);
  const [stateType, setStateType] = useState('');
  const [selectedLocation, setSelectedLocation] = useState(false);
  const [spaceKeyword, setSpaceKeyword] = useState('');
  const [spaceOpen, setSpaceOpen] = useState(false);
  const toggle = () => {
    setModal(!modal);
    atFinish();
  };
  const { userInfo } = useSelector((state) => state.user);
  const companies = getAllowedCompanies(userInfo);
  const { stateChangeInfo, updateLocationInfo } = useSelector((state) => state.equipment);
  const { spacesInfo } = useSelector((state) => state.ticket);

  useEffect(() => {
    const viewId = equipmentsDetails && equipmentsDetails.data ? equipmentsDetails.data[0].id : '';
    if (viewId && (updateLocationInfo && updateLocationInfo.data)) {
      dispatch(getAssetDetail(viewId, appModels.EQUIPMENT, false));
    }
  }, [updateLocationInfo]);

  useEffect(() => {
    const viewId = equipmentsDetails && equipmentsDetails.data ? equipmentsDetails.data[0].id : '';
    if ((userInfo && userInfo.data) && viewId && (stateChangeInfo && stateChangeInfo.data) && selectedLocation) {
      const postData = { location_id: selectedLocation.id };
      dispatch(updateLocationData(viewId, postData, appModels.EQUIPMENT));
    } else {
      const vId = equipmentsDetails && equipmentsDetails.data ? equipmentsDetails.data[0].id : '';
      if (viewId && (stateChangeInfo && stateChangeInfo.data)) {
        dispatch(getAssetDetail(vId, appModels.EQUIPMENT, false));
      }
    }
  }, [userInfo, stateChangeInfo]);

  useEffect(() => {
    (async () => {
      if (userInfo && userInfo.data) {
        await dispatch(getSpacesList(companies, appModels.SPACE, spaceKeyword));
      }
    })();
  }, [userInfo, spaceKeyword]);

  const equipmentData = equipmentsDetails && (equipmentsDetails.data && equipmentsDetails.data.length > 0) ? equipmentsDetails.data[0] : '';
  const locationSpaceId = equipmentsDetails && equipmentsDetails.data && equipmentsDetails.data[0].location_id ? equipmentsDetails.data[0].location_id : '';

  const handleStateChange = (id, state, type) => {
    dispatch(equipmentStateChange(id, state, appModels.EQUIPMENT));
    setStateType(type);
  };

  const onChange = (e, value) => {
    setSelectedLocation(value);
  };

  const onSpaceKeywordClear = () => {
    setSpaceKeyword(null);
    setSelectedLocation('');
    setSpaceOpen(false);
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
    <Dialog maxWidth="md" open={storeModal}>
      <DialogHeader title="Store in Warehouse" onClose={toggle} response={stateChangeInfo} fontAwesomeIcon={faStoreAlt} />
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          <Box
            sx={{
              width: '100%',
              height: '100%',
              backgroundColor: '#F6F8FA',
              padding: '20px',
              display: 'flex',
              flexDirection: 'column',
              gap: '10%',
              fontFamily: 'Suisse Intl',
            }}
          >
            <Card className="border-5 mt-3 ml-4 mb-4 mr-4 border-secondary rounded-0 border-top-0 border-right-0 border-bottom-0">
              {equipmentsDetails && (equipmentsDetails.data && equipmentsDetails.data.length > 0) && (
              <CardBody data-testid="success-case" className="bg-lightblue p-3">
                <Row>
                  <Col md="2" xs="2" sm="2" lg="2">
                    <img src={assetDefault} alt="asset" className="mt-2" width="45" height="45" />
                  </Col>
                  <Col md="8" xs="8" sm="8" lg="8" className="ml-2">
                    <Row>
                      <h6 className="mb-1">{equipmentData.name}</h6>
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
              )}
            </Card>
            <Card className="ml-2 mr-2  border-0">
              <CardBody className="m-0 p-3">
                <Row>
                  <ThemeProvider theme={theme}>
                    <Col xs="12" md="12" sm="12" lg="12">
                      {!(stateChangeInfo && stateChangeInfo.data) && (
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
                          }}
                          classes={{
                            option: classes.option,
                          }}
                          onChange={onChange}
                          value={selectedLocation && selectedLocation.path_name ? selectedLocation.path_name : ''}
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
                              placeholder="Search & Select"
                              value={spaceKeyword}
                              className={((selectedLocation && selectedLocation.id) || (spaceKeyword && spaceKeyword.length > 0))
                                ? 'without-padding custom-icons' : 'without-padding custom-icons2'}
                              InputProps={{
                                ...params.InputProps,
                                endAdornment: (
                                  <>
                                    {spacesInfo && spacesInfo.loading ? <CircularProgress color="inherit" size={20} /> : null}
                                    <InputAdornment position="end">
                                      {((selectedLocation && selectedLocation.id) || (spaceKeyword && spaceKeyword.length > 0)) && (
                                      <IconButton
                                        aria-label="toggle password visibility"
                                        onClick={onSpaceKeywordClear}
                                      >
                                        <BackspaceIcon fontSize="small" />
                                      </IconButton>
                                      )}
                                      <IconButton
                                        aria-label="toggle search visibility"
                                        edge="end"
                                      >
                                        <SearchIcon fontSize="small" />
                                      </IconButton>
                                    </InputAdornment>
                                  </>
                                ),
                              }}
                            />
                          )}
                        />
                        {(spacesInfo && spacesInfo.err) && (<FormHelperText><span className="text-danger">{generateErrorMessage(spacesInfo)}</span></FormHelperText>) }
                      </FormGroup>
                      )}
                    </Col>
                  </ThemeProvider>
                </Row>
              </CardBody>
            </Card>
            <Row className="justify-content-center">
              {stateChangeInfo && stateChangeInfo.data && (updateLocationInfo && !updateLocationInfo.loading) && (equipmentsDetails && !equipmentsDetails.loading) && (
              <SuccessAndErrorFormat response={stateChangeInfo} successMessage="This asset has been stored in warehouse successfully.." />
              )}
              {stateChangeInfo && stateChangeInfo.err && (
              <SuccessAndErrorFormat response={stateChangeInfo} />
              )}
              {updateLocationInfo && updateLocationInfo.err && (
              <SuccessAndErrorFormat response={stateChangeInfo} />
              )}
              {((equipmentsDetails && equipmentsDetails.loading) || (updateLocationInfo && updateLocationInfo.loading)) && (
              <CardBody className="mt-4" data-testid="loading-case">
                <Loader />
              </CardBody>
              )}
            </Row>
          </Box>
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        {equipmentData.state === storeValue
          ? ''
          : (
            <Button
              type="button"
              variant='contained'
              className="submit-btn"
              onClick={() => handleStateChange(equipmentData.id, 'action_put_warehouse', 'store')}
            >
              {(stateChangeInfo && stateChangeInfo.loading && stateType === 'store') ? (
                <Spinner size="sm" color="light" className="mr-2" />
              ) : ''}
              {' '}
              Confirm
            </Button>
          )}
        {(equipmentData.state === storeValue) && (
          <Button
            type="button"
            variant='contained'
            className="submit-btn"
            onClick={toggle}
          >
            Ok
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

StoreInWarehouse.propTypes = {
  equipmentsDetails: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array,
  ]).isRequired,
  storeModal: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.string,
  ]).isRequired,
  atFinish: PropTypes.func.isRequired,
};
export default StoreInWarehouse;
