/* eslint-disable import/no-unresolved */
/* eslint-disable react/jsx-props-no-spreading */
import React, { useEffect, useState } from 'react';
import {
  Card,
  CardBody,
  Col,
  Row,
  Spinner,
} from 'reactstrap';
import {
  Button,
  Dialog, DialogActions, DialogContent, DialogContentText,

  Box,
} from '@mui/material';
import * as PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import { Cascader, Divider } from 'antd';
import 'antd/dist/antd.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faArrowsAltH, faCheckCircle, faTimesCircle, faSpinner,
} from '@fortawesome/free-solid-svg-icons';

import assetDefault from '@images/icons/assetDefault.svg';
import ErrorContent from '@shared/errorContent';
import Loader from '@shared/loading';
import {
  generateErrorMessage, getDefaultNoValue,
  getAllowedCompanies, preprocessData,
} from '../../../util/appUtils';
import { addParents, addChildrens } from '../../../helpdesk/utils/utils';
import { getCascader } from '../../../helpdesk/ticketService';
import {
  moveAssetLocation, getAssetDetail, getBuildings, getAllSpaces,
} from '../../equipmentService';
import { last } from '../../../util/staticFunctions';
import DialogHeader from '../../../commonComponents/dialogHeader';

const appModels = require('../../../util/appModels').default;

const MoveAsset = (props) => {
  const {
    equipmentsDetails, moveModal, atFinish,
  } = props;
  const dispatch = useDispatch();
  const [modal, setModal] = useState(moveModal);
  const [cascaderValues, setCascaderValues] = useState([]);
  const [childValues, setChildValues] = useState([]);
  const [oldSpaceId, setOldSpaceId] = useState(['0', 'Not Assigned']);
  const [selectedSpace, setSelectedSpace] = useState(false);
  const [parentId, setParentId] = useState('');
  const [spaceId, setSpaceId] = useState(false);
  const toggle = () => {
    setModal(!modal);
    atFinish();
  };
  const { userInfo } = useSelector((state) => state.user);
  const companies = getAllowedCompanies(userInfo);
  const {
    moveAssetInfo, buildingsInfo, buildingSpaces,
  } = useSelector((state) => state.equipment);
  const {
    spaceCascader,
  } = useSelector((state) => state.ticket);

  useEffect(() => {
    if (userInfo && userInfo.data && modal) {
      dispatch(getBuildings(companies, appModels.SPACE));
    }
  }, [userInfo, modal]);

  useEffect(() => {
    if ((userInfo && userInfo.data) && (buildingsInfo && buildingsInfo.data)) {
      setChildValues(addParents(buildingsInfo.data));
    }
  }, [buildingsInfo]);

  useEffect(() => {
    if ((userInfo && userInfo.data) && (buildingSpaces && buildingSpaces.data && buildingSpaces.data.length && parentId)) {
      const childData = addChildrens(childValues, buildingSpaces.data[0].child, parentId);
      setChildValues(childData);
    }
  }, [buildingSpaces, parentId]);

  useEffect(() => {
    const viewId = equipmentsDetails && equipmentsDetails.data ? equipmentsDetails.data[0].id : '';
    if ((userInfo && userInfo.data) && viewId && (moveAssetInfo && moveAssetInfo.data)) {
      dispatch(getAssetDetail(viewId, appModels.EQUIPMENT, false));
    }
  }, [userInfo, moveAssetInfo]);

  const handleMoveAsset = () => {
    const locationId = selectedSpace && selectedSpace.length > 0 ? last(selectedSpace) : false;
    const postData = { location_id: locationId };
    const id = equipmentsDetails && equipmentsDetails.data ? equipmentsDetails.data[0].id : '';
    dispatch(moveAssetLocation(id, postData, appModels.EQUIPMENT));
  };

  useEffect(() => {
    if (childValues) {
      setCascaderValues(childValues);
    }
  }, [childValues]);

  useEffect(() => {
    if (cascaderValues) {
      dispatch(getCascader(cascaderValues));
    }
  }, [cascaderValues, buildingSpaces]);

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

  const isUserError = userInfo && userInfo.err;
  const loading = (userInfo && userInfo.loading) || (buildingsInfo && buildingsInfo.loading) || (buildingSpaces && buildingSpaces.loading);
  const userErrorMsg = generateErrorMessage(userInfo);
  const errorMsg = (buildingsInfo && buildingsInfo.err) ? generateErrorMessage(buildingsInfo) : userErrorMsg;
  const errorMsg1 = (buildingSpaces && buildingSpaces.err) ? generateErrorMessage(buildingSpaces) : userErrorMsg;

  const onChange = (value, selectedOptions) => {
    setParentId('');
    if (selectedOptions && selectedOptions.length) {
      if (!selectedOptions[0].parent_id) {
        setParentId(selectedOptions[0].id);
        setSpaceId(selectedOptions[0].id);
        if (spaceId !== selectedOptions[0].id) {
          dispatch(getAllSpaces(selectedOptions[0].id, companies));
        }
      }
    }
    setOldSpaceId(equipmentsDetails && equipmentsDetails.data && equipmentsDetails.data[0].location_id[1] ? equipmentsDetails.data[0].location_id[1] : '');
    setSelectedSpace(value);
  };

  const dropdownRender = (menus) => (
    <div>
      {menus}
      {loading && (
        <>
          <Divider style={{ margin: 0 }} />
          <div className="text-center p-2" data-testid="loading-case">
            <Spinner animation="border" size="sm" className="text-dark ml-3" variant="secondary" />
          </div>
        </>
      )}
      {((buildingsInfo && buildingsInfo.err) || isUserError) && (
        <>
          <Divider style={{ margin: 0 }} />
          <ErrorContent errorTxt={errorMsg} />
        </>
      )}
      {((buildingSpaces && buildingSpaces.err) || isUserError) && (
        <>
          <Divider style={{ margin: 0 }} />
          <ErrorContent errorTxt={errorMsg1} />
        </>
      )}
    </div>
  );
  const loadData = () => { };

  return (
    <Dialog maxWidth="md" open={modal}>
      <DialogHeader title="Move an Asset" subtitle="Please follow these steps to move the asset" onClose={toggle} response={moveAssetInfo} fontAwesomeIcon={faArrowsAltH} />
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
                <Card className="border-0">
                  <CardBody className="p-2 ml-2">
                    <Row>
                      <Col sm="12" md="12" lg="12" xs="12">
                        <p className="font-weight-700 font-11 mt-3">
                          <FontAwesomeIcon className="ml-2 mr-2" size="sm" icon={faCheckCircle} />
                          Moving an asset to another location
                        </p>
                        <p className="font-weight-700 font-11">
                          {actionResults}
                          {moveAssetInfo && moveAssetInfo.err ? 'Asset has been moved failed' : 'Asset has been moved successfully.'}
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
                        <Col sm="10" md="10" lg="10" xs="12" className="pr-0">
                          <p className="font-weight-800 font-side-heading mb-1">
                            {getDefaultNoValue(equipmentsDetails && equipmentsDetails.data ? equipmentsDetails.data[0].name : '')}
                          </p>
                          <p className="font-weight-500 font-side-heading mb-1">
                            {getDefaultNoValue(equipmentsDetails && equipmentsDetails.data ? equipmentsDetails.data[0].equipment_seq : '')}

                          </p>
                          <span className="font-weight-800 font-side-heading mr-1">
                            {!(moveAssetInfo && moveAssetInfo.data) ? (<>Current</>) : (<>Previous</>)}
                            {' '}
                            Location :
                          </span>
                          <span className="font-weight-400 font-side-heading text-capitalize">
                            {!(moveAssetInfo && moveAssetInfo.data)
                              ? getDefaultNoValue(equipmentsDetails && equipmentsDetails.data && equipmentsDetails.data[0].location_id[1] ? equipmentsDetails.data[0].location_id[1] : '') : oldSpaceId}
                          </span>
                        </Col>
                        <Col sm="2" md="2" lg="2" xs="12" className="p-0 pr-2">
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
                {!(moveAssetInfo && moveAssetInfo.data) && (
                  <div className="mt-3">
                    <Cascader
                      options={preprocessData(spaceCascader && spaceCascader.length > 0 ? spaceCascader : [])}
                      dropdownClassName="custom-cascader-popup"
                      fieldNames={{ label: 'name', value: 'id', children: 'children' }}
                      placeholder="Select the location"
                      notFoundContent="No options"
                      dropdownRender={dropdownRender}
                      onChange={onChange}
                      // loadData={loadData}
                      className="thin-scrollbar font-size-13 w-100"
                      changeOnSelect
                    />
                  </div>
                )}
              </Col>
              {(moveAssetInfo && moveAssetInfo.data) && (equipmentsDetails && !equipmentsDetails.loading) && (equipmentsDetails && equipmentsDetails.data) && (
                <>
                  <Col sm="6" md="6" lg="6" xs="12" />
                  <Col sm="6" md="6" lg="6" xs="12">
                    <p className="mb-3 mt-2 font-weight-800 text-center">Moved to</p>
                    <Card className="bg-lightblue border-0">
                      <CardBody className="p-3">
                        <Row>
                          <Col sm="10" md="10" lg="10" xs="12" className="pr-0">
                            <p className="font-weight-800 font-side-heading mb-1">
                              {getDefaultNoValue(equipmentsDetails && equipmentsDetails.data ? equipmentsDetails.data[0].name : '')}
                            </p>
                            <p className="font-weight-500 font-side-heading mb-1">
                              {getDefaultNoValue(equipmentsDetails && equipmentsDetails.data ? equipmentsDetails.data[0].equipment_seq : '')}
                            </p>
                            <span className="font-weight-800 font-side-heading mr-1">
                              New Location :
                            </span>
                            <span className="font-weight-400 font-side-heading text-capitalize">
                              {getDefaultNoValue(equipmentsDetails && equipmentsDetails.data && equipmentsDetails.data[0].location_id[1] ? equipmentsDetails.data[0].location_id[1] : '')}
                            </span>
                          </Col>
                          <Col sm="2" md="2" lg="2" xs="12" className="p-0 pr-2">
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
            disabled={(!selectedSpace.length || (moveAssetInfo && moveAssetInfo.loading))}
            type="button"
            variant="contained"
            onClick={() => handleMoveAsset()}
            className="submit-btn"
          >
            Confirm
          </Button>
        )
          : (
            <Button
              type="button"
              variant="contained"
              onClick={() => { setSelectedSpace([]); toggle(); }}
              className="submit-btn"
            >
              Ok
            </Button>
          )}
      </DialogActions>
    </Dialog>
  );
};

MoveAsset.propTypes = {
  equipmentsDetails: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array,
  ]).isRequired,
  moveModal: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.string,
  ]).isRequired,
  atFinish: PropTypes.func.isRequired,
};
export default MoveAsset;
