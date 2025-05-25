/* eslint-disable import/no-unresolved */
/* eslint-disable react/jsx-props-no-spreading */
import React, { useEffect, useState } from 'react';
import {
  Card,
  CardBody,
  Col,
  FormGroup,
  Row,
} from 'reactstrap';
import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from '@material-ui/core/IconButton';
import BackspaceIcon from '@material-ui/icons/Backspace';
import SearchIcon from '@material-ui/icons/Search';
import { Autocomplete } from '@material-ui/lab';
import * as PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import {
  TextField, CircularProgress, FormHelperText,
} from '@material-ui/core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faRandom, faCheckCircle, faTimesCircle, faSpinner,
} from '@fortawesome/free-solid-svg-icons';
import { ThemeProvider, makeStyles } from '@material-ui/core/styles';

import assetDefault from '@images/icons/assetDefault.svg';
import Loader from '@shared/loading';
import {
  Box, Button,
  Dialog, DialogActions, DialogContent, DialogContentText,
} from '@mui/material';
import {
  getDefaultNoValue, generateErrorMessage,
  getAllowedCompanies,
} from '../../../util/appUtils';
import { getTrimmedArray } from '../../../workorders/utils/utils';
import { getEquipmentList } from '../../../helpdesk/ticketService';
import { moveAssetLocation, getAssetDetail } from '../../equipmentService';
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

const ReplaceAsset = (props) => {
  const {
    equipmentsDetails, replaceModal, atFinish, isITAsset,
  } = props;
  const dispatch = useDispatch();
  const classes = useStyles();
  const [modal, setModal] = useState(replaceModal);
  const [equipmentOpen, setEquipmentOpen] = useState(false);
  const [equipmentKeyword, setEquipmentKeyword] = useState('');
  const [assetId, setAssetId] = useState('');
  const [oldAssetId, setOldAssetId] = useState(['0', 'Not Assigned']);
  const toggle = () => {
    setModal(!modal);
    atFinish();
  };
  const { userInfo } = useSelector((state) => state.user);
  const companies = getAllowedCompanies(userInfo);
  const {
    moveAssetInfo,
  } = useSelector((state) => state.equipment);
  const { equipmentInfo } = useSelector((state) => state.ticket);

  useEffect(() => {
    (async () => {
      if (userInfo && userInfo.data && equipmentOpen) {
        await dispatch(getEquipmentList(companies, appModels.EQUIPMENT, equipmentKeyword, isITAsset));
      }
    })();
  }, [equipmentOpen, equipmentKeyword]);

  useEffect(() => {
    const viewId = equipmentsDetails && equipmentsDetails.data ? equipmentsDetails.data[0].id : '';
    if ((userInfo && userInfo.data) && viewId && (moveAssetInfo && moveAssetInfo.data)) {
      dispatch(getAssetDetail(viewId, appModels.EQUIPMENT, false));
    }
  }, [userInfo, moveAssetInfo]);

  const handleReplaceAsset = () => {
    const postData = { name: assetId && assetId.name ? assetId.name : '', method: 'action_scrap' };
    const id = equipmentsDetails && equipmentsDetails.data ? equipmentsDetails.data[0].id : '';
    dispatch(moveAssetLocation(id, postData, appModels.EQUIPMENT));
  };

  let actionResults;

  if (moveAssetInfo && moveAssetInfo.loading) {
    actionResults = (
      <FontAwesomeIcon className="ml-2 mr-2 tab_nav_link" size="sm" icon={faSpinner} />
    );
  } else if (moveAssetInfo && moveAssetInfo.data) {
    actionResults = (
      <FontAwesomeIcon className="ml-2 mr-2" size="sm" icon={faCheckCircle} />
    );
  } else if (moveAssetInfo && moveAssetInfo.err) {
    actionResults = (
      <FontAwesomeIcon className="ml-2 mr-2" size="sm" icon={faTimesCircle} />
    );
  } else {
    actionResults = (
      <FontAwesomeIcon className="ml-2 mr-2 tab_nav_link" size="sm" icon={faCheckCircle} />
    );
  }

  const onEquipmentKeywordChange = (event) => {
    setEquipmentKeyword(event.target.value);
  };

  const onEquipmentChange = (e, data) => {
    setAssetId(data);
    setOldAssetId(equipmentsDetails && equipmentsDetails.data ? equipmentsDetails.data[0].name : []);
  };

  const onEquipmentKeywordClear = () => {
    setEquipmentKeyword(null);
    setAssetId('');
    setEquipmentOpen(false);
  };

  let equipmentOptions = [];

  if (equipmentInfo && equipmentInfo.loading) {
    equipmentOptions = [{ name: 'Loading..' }];
  }
  if (equipmentInfo && equipmentInfo.data) {
    const assetName = equipmentsDetails && equipmentsDetails.data ? equipmentsDetails.data[0].name : '';
    equipmentOptions = getTrimmedArray(equipmentInfo.data, 'name', assetName);
  }

  return (
    <Dialog maxWidth="md" open={modal}>
      <DialogHeader title="Replace Asset" subtitle="Please follow these steps to replace the asset" onClose={toggle} response={moveAssetInfo} fontAwesomeIcon={faRandom} />
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
            <Row className="mr-4">
              <Col sm="6" md="6" lg="6" xs="12">
                <Card className="border-0 ml-4 location-card">
                  <CardBody className="p-2 ml-2">
                    <Row>
                      <Col sm="12" md="12" lg="12" xs="12">
                        <p className="font-weight-700 font-11 mt-3">
                          <FontAwesomeIcon className="ml-2 mr-2" size="sm" icon={faCheckCircle} />
                          Replace an asset with new asset.
                        </p>
                        <p className="font-weight-700 font-11">
                          {actionResults}
                          {moveAssetInfo && moveAssetInfo.err ? 'Asset has been replaced failed' : 'Asset has been replaced successfully..'}
                        </p>
                      </Col>
                    </Row>
                  </CardBody>
                </Card>
              </Col>
              <Col sm="6" md="6" lg="6" xs="12">
                {equipmentsDetails && equipmentsDetails.data && (
                  <Card className="bg-lightblue border-0">
                    <CardBody className="p-3">
                      <Row>
                        <Col sm="9" md="9" lg="9" xs="12">
                          <p className="font-weight-800 font-side-heading mb-1">
                            {!(moveAssetInfo && moveAssetInfo.data)
                              ? getDefaultNoValue(equipmentsDetails && equipmentsDetails.data ? equipmentsDetails.data[0].name : '') : oldAssetId}
                          </p>
                          <p className="font-weight-500 font-side-heading mb-1">
                            #
                            {getDefaultNoValue(equipmentsDetails && equipmentsDetails.data && equipmentsDetails.data[0].location_id[1] ? equipmentsDetails.data[0].location_id[1] : '')}
                          </p>
                          <span className="font-weight-800 font-side-heading mr-1">
                            Category :
                          </span>
                          {' '}
                          {getDefaultNoValue(equipmentsDetails && equipmentsDetails.data && equipmentsDetails.data[0].category_id[1] ? equipmentsDetails.data[0].category_id[1] : '')}
                        </Col>
                        <Col sm="3" md="3" lg="3" xs="12">
                          <img src={assetDefault} alt="ticket" width="25" className="mr-2 float-right" />
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
                <br />
                {!(moveAssetInfo && moveAssetInfo.data) && (
                  <ThemeProvider theme={theme}>
                    <FormGroup className="mt-3">
                      <Autocomplete
                        name="equipment_id"
                        label="Asset"
                        open={equipmentOpen}
                        size="small"
                        onOpen={() => {
                          setEquipmentOpen(true);
                        }}
                        onClose={() => {
                          setEquipmentOpen(false);
                          setEquipmentKeyword('');
                        }}
                        classes={{
                          option: classes.option,
                        }}
                        value={assetId ? assetId.name : ''}
                        onChange={onEquipmentChange}
                        loading={equipmentInfo && equipmentInfo.loading}
                        getOptionSelected={(option, value) => option.name === value.name}
                        getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
                        renderOption={(option) => (
                          <>
                            <h6>{option.name}</h6>
                            <p className="float-left">
                              {option.location_id && (
                                <>
                                  {option.location_id ? option.location_id[1] : ''}
                                </>
                              )}
                            </p>
                          </>
                        )}
                        options={equipmentOptions}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            onChange={onEquipmentKeywordChange}
                            variant="outlined"
                            value={equipmentKeyword}
                            className={((assetId && assetId.id) || (equipmentKeyword && equipmentKeyword.length > 0))
                              ? 'without-padding custom-icons' : 'without-padding custom-icons2'}
                            placeholder="Search & Select"
                            InputProps={{
                              ...params.InputProps,
                              endAdornment: (
                                <>
                                  {equipmentInfo && equipmentInfo.loading ? <CircularProgress color="inherit" size={20} /> : null}
                                  <InputAdornment position="end">
                                    {((assetId && assetId.id) || (equipmentKeyword && equipmentKeyword.length > 0)) && (
                                      <IconButton
                                        aria-label="toggle password visibility"
                                        onClick={onEquipmentKeywordClear}
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
                      {(equipmentInfo && equipmentInfo.err) && (<FormHelperText><span className="text-danger">{generateErrorMessage(equipmentInfo)}</span></FormHelperText>)}
                    </FormGroup>
                  </ThemeProvider>
                )}
              </Col>
              {(moveAssetInfo && moveAssetInfo.data) && (equipmentsDetails && !equipmentsDetails.loading) && (equipmentsDetails && equipmentsDetails.data) && (
                <>
                  <Col sm="6" md="6" lg="6" xs="12" />
                  <Col sm="6" md="6" lg="6" xs="12">
                    <p className="mb-3 mt-1 font-weight-800 text-center">Replaced to</p>
                    <Card className="bg-lightblue border-0">
                      <CardBody className="p-3">
                        <Row>
                          <Col sm="9" md="9" lg="9" xs="12">
                            <p className="font-weight-800 font-side-heading mb-1">
                              {getDefaultNoValue(equipmentsDetails && equipmentsDetails.data ? equipmentsDetails.data[0].name : '')}
                            </p>
                            <p className="font-weight-500 font-side-heading mb-1">
                              #
                              {getDefaultNoValue(equipmentsDetails && equipmentsDetails.data && equipmentsDetails.data[0].location_id[1] ? equipmentsDetails.data[0].location_id[1] : '')}
                            </p>
                            <span className="font-weight-800 font-side-heading mr-1">
                              Category :
                            </span>
                            {' '}
                            {getDefaultNoValue(equipmentsDetails && equipmentsDetails.data && equipmentsDetails.data[0].category_id[1] ? equipmentsDetails.data[0].category_id[1] : '')}
                          </Col>
                          <Col sm="3" md="3" lg="3" xs="12">
                            <img src={assetDefault} alt="ticket" width="25" className="mr-2 float-right" />
                          </Col>
                        </Row>
                      </CardBody>
                    </Card>
                  </Col>
                </>
              )}
            </Row>
          </Box>
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        {!(moveAssetInfo && moveAssetInfo.data) ? (
          <Button
            disabled={(!assetId || (moveAssetInfo && moveAssetInfo.loading))}
            type="button"
            variant='contained'
            className="submit-btn"
            onClick={() => handleReplaceAsset()}
          >
            Confirm
          </Button>
        )
          : (
            <Button
              type="button"
              variant='contained'
              className="submit-btn"
              onClick={() => { setAssetId(''); toggle(); }}
            >
              Ok
            </Button>
          )}
      </DialogActions>
    </Dialog>
  );
};

ReplaceAsset.defaultProps = {
  isITAsset: false,
};

ReplaceAsset.propTypes = {
  equipmentsDetails: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array,
  ]).isRequired,
  replaceModal: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.string,
  ]).isRequired,
  atFinish: PropTypes.func.isRequired,
  isITAsset: PropTypes.bool,
};
export default ReplaceAsset;
