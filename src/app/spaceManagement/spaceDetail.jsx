/* eslint-disable react/jsx-no-useless-fragment */
/* eslint-disable array-callback-return */
/* eslint-disable arrow-body-style */
/* eslint-disable import/no-cycle */
/* eslint-disable no-unused-vars */
/* eslint-disable import/no-unresolved */
/* eslint-disable no-nested-ternary */
import React, { useEffect, useState } from 'react';
import {
  Card,
  CardTitle,
  Col,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Row,
  Spinner,
} from 'reactstrap';
import Button from '@mui/material/Button';
import * as PropTypes from 'prop-types';
import Switch from '@material-ui/core/Switch';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons';
import ReactFileReader from 'react-file-reader';
import { useDispatch, useSelector } from 'react-redux';
import discard from '@images/icons/discard.svg';
import select from '@images/select.svg';
import location from '@images/location.png';
import ModalHeaderComponent from '@shared/modalHeaderComponent';

import { Tooltip } from 'antd';
import {
  getFloorChild, getFloorView, uploadFloorImage, setDiscard, newBulkDraggableSpaceData, setCategoryInfo, clearUpdateMapData
} from './spaceService';
import { bytesToSize } from '../util/staticFunctions';
import FloorMap from './floorMap';
import SpaceDetailInfo from './spaceDetailInfo';
import { getListOfModuleOperations } from '../util/appUtils';
import actionCodes from './data/spaceManagementActionCodes.json';
import SaveSpaceModalWindow from './saveModalWindow';
import AllocatedSpaces from './allocatedSpaces';

const appModels = require('../util/appModels').default;

const SpaceDetail = (props) => {
  const dispatch = useDispatch();
  const { title, data } = props;

  const [viewId, setViewId] = useState('');
  const {
    bulkDraggableSpaces, bulkDraggableSpaceCount, categoryInfo, spaceCategory,
  } = useSelector((state) => state.space);
  const { getFloorsInfo } = useSelector((state) => state.equipment);

  const [imgValidation, setimgValidation] = useState(false);
  const [imgSize, setimgSize] = useState(false);
  const [fileDataImage, setFileDataImage] = useState(false);
  const [fileImageSize, setFileImageSize] = useState(false);
  const [spaceDraggable, setSpaceDraggable] = useState(false);
  const [timeCache, setTimeCache] = useState('');
  const [modal, setModal] = useState(false);
  const [finish, setFinish] = useState(false);
  const [isSaveData, setIsSaveData] = useState(false);
  const [isUpdateData, setIsUpdateData] = useState(false);
  const [catagories, setCatagories] = useState([]);
  const [bulkCatagories, setBulkCatagories] = useState([]);
  const [id, setId] = useState();
  const [tooltipOpen, setTooltipOpen] = useState(false);
  const [reload, setReload] = useState(false);
  const [remove, setRemove] = useState(false);
  const [isDiscards, setIsDiscards] = useState(false);
  const [isBulkFilteredData, setIsBulkFilteredData] = useState(false);
  const [indexInfo, setIndexInfo] = useState(false);
  const [switchIcon, setSwitchIcon] = useState(false);
  const [tooltipName, setTooltipName] = useState('');
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [spaceCategories, setSpaceCategories] = useState([]);
  const toggleEdit = () => setTooltipOpen(!tooltipOpen);

  useEffect(() => {
    if ((data && data.length > 0)) {
      setViewId(data[0].id);
      setId(data[0].id);
    }
  }, [data]);

  useEffect(() => {
    if (spaceCategory && spaceCategory.data) {
      spaceCategory.data.map((key) => {
        const categoryName = key.name;
        spaceCategories.push(categoryName);
      });
    }
    if ((getFloorsInfo && getFloorsInfo.data) && viewId) {
      if (spaceCategory && spaceCategory.data) {
        dispatch(getFloorView(viewId, appModels.SPACE));
        dispatch(getFloorChild(viewId, appModels.SPACE, spaceCategories));
      }
      setSpaceDraggable(false);
      dispatch(newBulkDraggableSpaceData([]));
      setIsDiscards(true);
    }
  }, [getFloorsInfo, viewId, spaceCategory]);

  const toggle = () => {
    setModal(!modal);
    if (!modal) {
      setFinish(false);
    }
  };

  const {
    floorView, updateFloor,
  } = useSelector((state) => state.space);

  const { userRoles } = useSelector((state) => state.user);
  const allowedOperations = getListOfModuleOperations(userRoles && userRoles.data ? userRoles.data.allowed_modules : [], 'HSpace - Space Management', 'code');

  useEffect(() => {
    if (id) {
      setTimeCache((new Date()).getTime());
      dispatch(getFloorView(id, appModels.SPACE));
      dispatch(getFloorChild(id, appModels.SPACE, spaceCategories));
      setCatagories([]);
      dispatch(setCategoryInfo(false));
      setPopoverOpen(false);
      setSpaceDraggable(false);
      dispatch(newBulkDraggableSpaceData([]));
      setIsDiscards(true);
    }
  }, [id, spaceCategory]);

  useEffect(() => {
    if (finish) {
      if (bytesToSize(fileImageSize)) {
        setTimeCache('');
        dispatch(uploadFloorImage(id, fileDataImage));
      } else {
        setimgSize(true);
      }
    }
  }, [finish]);

  const handleFiles = (files) => {
    setimgValidation(false);
    setimgSize(false);
    setFinish(false);
    if (files) {
      const { name } = files.fileList[0];
      if (name && !name.match(/.(jpg|jpeg|svg|png)$/i)) {
        setimgValidation(true);
      } else {
        const remfile = `data:${files.fileList[0].type};base64,`;
        const fileData = files.base64.replace(remfile, '');
        const fileSize = files.fileList[0].size;
        setFileDataImage(fileData);
        setFileImageSize(fileSize);
        setModal(true);
      }
    }
  };

  const setSelectedId = (mapId) => {
    setId(mapId);
    setimgValidation(false);
  };

  const discardCatagories = () => {
    setSpaceDraggable(false);
    setCatagories([]);
    dispatch(getFloorChild(id, appModels.SPACE, spaceCategories));
  };

  const saveSpaces = () => {
    const space = bulkDraggableSpaces;
    setBulkCatagories(space);
    setIsBulkFilteredData(true);
    setIsUpdateData(true);
    setIsDiscards(false);
  };

  useEffect(() => {
    if (isDiscards) {
      dispatch(setDiscard(isDiscards));
      setIsDiscards(false);
    }
  }, [isDiscards]);

  useEffect(() => {
    if ((catagories && catagories.length) || categoryInfo) {
      setSwitchIcon(true);
      setSpaceDraggable(false);
    } else {
      setSwitchIcon(false);
      setTooltipOpen(tooltipOpen);
    }
  }, [catagories, switchIcon, tooltipOpen, categoryInfo]);

  const onSave = () => {
    setIsSaveData(true);
    setSpaceDraggable(false);
    setIsDiscards(false);
  };

  useEffect(() => {
    if (spaceDraggable) {
      setTooltipName('Spaces editable.');
    } else {
      setTooltipName('Click here to edit spaces.');
    }
  }, [spaceDraggable, tooltipName]);

  const onClose = () => {
    setTimeCache((new Date()).getTime());
    document.getElementById('fileUpload').value = null;
    setFinish(false);
    if (updateFloor && updateFloor.data) {
      dispatch(getFloorView(id, appModels.SPACE));
    }
    dispatch(clearUpdateMapData())
    setModal(false);
    setimgValidation(false)
    setimgSize(false)
  }

  const filePath = floorView && (floorView.data && floorView.data.length > 0) && floorView.data[0].file_path

  return (
    <Card>
      <Row className="m-0 space-bg">
        <Col sm="12" md="12" lg="12" xs="12">
          <Card className="space-bg border-0 pl-2">
            <CardTitle className="mt-2 mb-0 row">
              <Col xs="12" sm="7" md="7" lg="7">
                <span>
                  <span className="font-weight-800">{title}</span>
                  {' '}
                  /
                  {' '}
                  <span className="font-weight-500 mr-1">
                    {floorView
                      && (floorView.data
                        && floorView.data.length > 0) ? floorView.data[0].space_name : ''}
                  </span>
                </span>
              </Col>
              
              <Col xs="12" sm="5" md="5" lg="5">
                {(catagories && catagories.length) || (bulkDraggableSpaces && bulkDraggableSpaces.length) ? '' : (
                  <span className="float-right d-inline-block cursor-pointer">
                    <ReactFileReader
                      multiple
                      elementId="fileUpload"
                      handleFiles={handleFiles}
                      fileTypes="image/*"
                      base64
                    >
                      {floorView && !floorView.loading && (
                        <>
                          {allowedOperations.includes(actionCodes['Upload Map']) && (
                            <Button
                              variant="contained"
                              size="sm"
                              className="replace-btn pb-1 pt-1 text-dark rounded-pill float-right mt-1 cursor-pointer greyButton"
                            >
                              <FontAwesomeIcon className="mr-1" size="sm" icon={faMapMarkerAlt} />
                              {filePath ? 'Replace Map' : 'Upload Map'}
                            </Button>
                          )}
                        </>
                      )}
                    </ReactFileReader>
                  </span>
                )}
                {(catagories && catagories.length) || (bulkDraggableSpaces && bulkDraggableSpaces.length) ? '' : (
                  <>
                    {floorView && !floorView.loading && spaceCategory && !spaceCategory.loading && allowedOperations.includes(actionCodes['Edit Space']) && (
                      <Tooltip
                        placement="top"
                        isOpen={tooltipOpen}
                        target="spaceEdit"
                        toggle={toggleEdit}
                        title={tooltipName}
                      >
                        <Switch color="primary" checked={spaceDraggable} disabled={switchIcon} onClick={() => { setSpaceDraggable(!spaceDraggable); }} id="spaceEdit" className="float-right" />
                      </Tooltip>
                    )}
                  </>
                )}
                {catagories && catagories.length ? (
                  <>
                    {allowedOperations.includes(actionCodes['Add Space']) && (
                      <Button
                        variant="contained"
                        size="sm"
                        className="rounded-pill save-btn float-right mt-1 mr-2"
                        onClick={() => onSave()}
                      >
                        <img src={select} alt="select" className="mr-2 mb-1" />
                      Save
                      </Button>
                    )}
                  </>
                ) : ''}
                {catagories && catagories.length ? (
                  <Button
                    variant="contained"
                    size="sm"
                    className="rounded-pill float-right mt-1 mr-2 discard-btn"
                    onClick={() => discardCatagories()}
                  >
                    <img src={discard} alt="discard" className="mr-2 mb-1" />
                    Discard
                  </Button>
                ) : ''}
                {catagories && catagories.length ? (
                  <span
                    color="primary"
                    size="sm"
                    className="float-right mt-1 mr-2 pt-1 pb-1 pl-2 pr-2 block-example"
                  >
                    <img src={location} alt="location" className="mr-2 mb-1" height="15" width="15" />
                    {' '}
                    You have added
                    {' '}
                    {catagories.length}
                    {' '}
                    {catagories.length === 1 ? 'location' : catagories.length > 1 ? 'locations' : ''}
                  </span>
                ) : ''}
                {bulkDraggableSpaces && bulkDraggableSpaces.length ? (
                  <Button
                    variant="contained"
                    size="sm"
                    className="update-btn rounded-pill float-right mt-1 mr-2"
                    onClick={() => saveSpaces()}
                  >
                    <img src={select} alt="select" className="mr-2 mb-1" />
                    Update
                  </Button>
                ) : ''}
                {bulkDraggableSpaces && bulkDraggableSpaces.length ? (
                  <Button
                    variant="contained"
                    size="sm"
                    className="rounded-pill float-right mt-1 mr-2 discard-btn "
                    onClick={() => setIsDiscards(true)}
                  >
                    <img src={discard} alt="discard" className="mr-2 mb-1" />
                    Discard
                  </Button>
                ) : ''}
                {bulkDraggableSpaces && bulkDraggableSpaces.length ? (
                  <span
                    color="primary"
                    size="sm"
                    className="float-right mt-1 mr-2 pt-1 pb-1 pl-2 pr-2 block-example text-primary"
                  >
                    <img src={location} alt="location" className="mr-2 mb-1" height="15" width="15" />
                    {' '}
                    You have added
                    {' '}
                    {bulkDraggableSpaces.length}
                    {' '}
                    {bulkDraggableSpaces === 1 ? 'location' : bulkDraggableSpaces > 1 ? 'locations' : ''}
                  </span>
                ) : ''}
              </Col>
            </CardTitle>
            <hr className="mt-1 mb-1" />
          </Card>
        </Col>
      </Row>
      <Row className="m-0 space-bg" id="space-management">
        <Col sm="12" md="12" lg="4" xs="12" className="p-2">
          <SpaceDetailInfo
            id={id}
            setSelectedId={setSelectedId}
            data={data}
            isSaveData={isSaveData}
            setIsSaveData={setIsSaveData}
            catagories={catagories}
            setCatagories={setCatagories}
            setReload={setReload}
            remove={remove}
            setRemove={setRemove}
            spaceDraggable={spaceDraggable}
            setSpaceDraggable={setSpaceDraggable}
            indexInfo={indexInfo}
            setIndexInfo={setIndexInfo}
            switchIcon={switchIcon}
            setSwitchIcon={setSwitchIcon}
          />
        </Col>
        <Col sm="12" md="12" lg="8" xs="12" className="p-2">
          <FloorMap
            id={id}
            timeCacheImg={timeCache}
            imgvalidate={imgValidation}
            imgSizes={imgSize}
            spaceDraggable={spaceDraggable}
            catagories={catagories}
            setCatagories={setCatagories}
            reload={reload}
            setReload={setReload}
            remove={remove}
            setRemove={setRemove}
            data={data}
            setSpaceDraggable={setSpaceDraggable}
            isBulkFilteredData={isBulkFilteredData}
            setIsBulkFilteredData={setIsBulkFilteredData}
            isSaveData={isSaveData}
            setIsSaveData={setIsSaveData}
            indexInfo={indexInfo}
            setIndexInfo={setIndexInfo}
            setPopoverOpen={setPopoverOpen}
            popoverOpen={popoverOpen}
            spaceCategories={spaceCategories}
          />
          {(isSaveData || isUpdateData) && (
            <SaveSpaceModalWindow
              spaceCategories={spaceCategories}
              setIsSaveData={setIsSaveData}
              isSaveData={isSaveData}
              setIsUpdateData={setIsUpdateData}
              isUpdateData={isUpdateData}
              remove={remove}
              setRemove={setRemove}
              id={id}
              catagories={catagories}
              setCatagories={setCatagories}
              reload={reload}
              setReload={setReload}
              bulkCatagories={bulkCatagories}
              setBulkCatagories={setBulkCatagories}
            />
          )}
        </Col>
      </Row>
      <Modal className="replace-map-alert" isOpen={modal} size="sm">
        <ModalHeaderComponent title={filePath ? 'Replace Map' : 'Upload Map'} closeModalWindow={onClose} response={updateFloor} />
        <hr className="m-0" />
        <ModalBody>
          {updateFloor && !updateFloor.data && !updateFloor.err && !imgValidation && !imgSize && (
            <>
              Are you sure, you want to {filePath ? 'replace' : 'upload'} the map?
          </>
          )}
          {imgValidation || imgSize
            ? (
              <div color="danger" className="text-center text-danger mt-2 font-size-17px">
                {imgValidation && 'Upload Image only..'}
                {imgSize && 'Upload files less than 20 MB'}
              </div>
            )
            : ''}

          {updateFloor && updateFloor.data && (
            <div className="text-center text-success">
              Map {filePath ? 'replaced' : 'uploaded'} successfully
            </div>
          )}
          {updateFloor && updateFloor.err && (
            <div className="text-center text-danger">
              {updateFloor.err.error && updateFloor.err.error.message}
            </div>
          )}

        </ModalBody>
        <ModalFooter>
          {updateFloor && !updateFloor.data && !imgValidation && !imgSize && (
            <Button variant="contained" disabled={updateFloor && updateFloor.loading} onClick={() => { setFinish(true); }}>
              {updateFloor && updateFloor.loading && (
                <Spinner size="sm" color="light" className="mr-2" />
              )}
              {filePath ? 'Replace' : 'Upload'}
            </Button>
          )}
          {updateFloor && (updateFloor.data || updateFloor.err || imgValidation || imgSize) && (
            <Button variant="contained" onClick={onClose}>Ok</Button>
          )}
        </ModalFooter>
      </Modal>
    </Card>
  );
};

SpaceDetail.propTypes = {
  title: PropTypes.string.isRequired,
  data: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.string,
        PropTypes.bool,
      ]),
      space_name: PropTypes.string,
    }),
  ).isRequired,
};

export default SpaceDetail;
