/* eslint-disable react/jsx-no-useless-fragment */
/* eslint-disable no-unused-vars */
/* eslint-disable no-plusplus */
/* eslint-disable array-callback-return */
/* eslint-disable import/no-unresolved */
import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import {
  Card,
  CardBody,
  Col,
  Row,
} from 'reactstrap';
import { useSelector, useDispatch } from 'react-redux';
import * as PropTypes from 'prop-types';
import Select from 'react-select';

import plusCircleGrey from '@images/plusCircleGrey.svg';
import addSpace from '@images/addSpace.png';
import fullyAssign from '@images/fullyAssign.png';
import tools from '@images/tools.svg';
import ErrorContent from '@shared/errorContent';
import unavailableIcon from '@images/empty.svg';
import Loader from '../shared/loading';
import PopOverSpace from './popOverSpace';
import './space.scss';
import {
  getTotalCount, getAssigned, getUnAssigned, getAllocatedSpaces,
} from './utils/utils';
import { generateErrorMessage, getListOfModuleOperations } from '../util/appUtils';
import actionCodes from './data/spaceManagementActionCodes.json';
import SaveSpacesModalWindow from './saveModalWindow';
import { newBulkDraggableSpaceData, clearDropdownData, setCategoryInfo } from './spaceService';
import categoryIcons from './utils/categoryIcons.json';

// eslint-disable-next-line no-unused-vars
const appConfig = require('../config/appConfig').default;

const SpaceDetailInfo = ({
  id,
  setSelectedId,
  data,
  isSaveData,
  setIsSaveData,
  catagories,
  setCatagories,
  setReload,
  setRemove,
  remove,
  indexInfo,
  setIndexInfo,
  spaceDraggable,
  setSpaceDraggable,
}) => {
  const {
    floorView, spaceCategory, spaceChilds, categoryInfo, bulkDraggableSpaces, isIcon,
  } = useSelector((state) => state.space);
  const [floorOptions, setFloorOptions] = useState();
  const [catagory, setCatagory] = useState(false);
  const [isOpenModal, openUpdateModal] = useState(false);

  const [allocatedSpace, setAllocatedSpace] = useState([]);
  const [coordinates, setCoordinates] = useState(null);
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [updateResult, setUpdateResult] = useState({});

  const dispatch = useDispatch();
  const onChangeFloor = (event) => {
    setPopoverOpen(false);
    setSelectedId(event.id);
  };

  const { userRoles } = useSelector((state) => state.user);
  const allowedOperations = getListOfModuleOperations(userRoles && userRoles.data ? userRoles.data.allowed_modules : [], 'HSpace - Space Management', 'code');

  useEffect(() => {
    if (data) {
      setFloorOptions(data.map((floor) => ({
        ...floor, value: floor.space_name, label: floor.space_name,
      })));
    }
  }, [data]);
  useEffect(() => {
    if (floorView && floorView.data) {
      setSelectedId(floorView.data[0].id);
      setCatagories([]);
      dispatch(newBulkDraggableSpaceData({}));
    }
  }, [floorView]);

  useEffect(() => {
    dispatch(clearDropdownData());
    setSelectedId(false);
  }, []);

  const openModal = (modalData) => {
    const spaceData = modalData;
    spaceData.longitude = coordinates.longitude;
    spaceData.latitude = coordinates.latitude;
    const spaces = [...catagories];
    spaces.push(modalData);
    setReload(true);
    openUpdateModal(true);
    setIsSaveData(false);
    setCatagories(spaces);
    if (catagory) {
      setCatagory(false);
      setIndexInfo(false);
    }
    setPopoverOpen(false);
    ReactDOM.unmountComponentAtNode(document.getElementById('svg'));
  };

  const draggable = () => {
    const svg = document.querySelector('#svg-drag');
    const elements = svg.querySelectorAll('#svg');
    function getMousePosition(evt) {
      const CTM = svg.getScreenCTM();
      return {
        x: (evt.clientX - CTM.e) / CTM.a,
        y: (evt.clientY - CTM.f) / CTM.d,
      };
    }
    let selectedElement; let
      offset;

    function startDrag(evt) {
      setPopoverOpen(false);
      evt.preventDefault();
      if (evt.target.classList.contains('draggableIcons')) {
        selectedElement = evt.target;
        offset = getMousePosition(evt);
        offset.x -= parseFloat(selectedElement.getAttributeNS(null, 'x'));
        offset.y -= parseFloat(selectedElement.getAttributeNS(null, 'y'));
      }
    }

    function drag(evt) {
      evt.preventDefault();
      if (selectedElement) {
        const coord = getMousePosition(evt);
        selectedElement.setAttributeNS(null, 'x', coord.x - offset.x);
        selectedElement.setAttributeNS(null, 'y', coord.y - offset.y);
      }
    }

    function endDrag(evt) {
      evt.preventDefault();
      const coord = getMousePosition(evt);
      const name = evt.target.getAttributeNS(null, 'space');
      if (evt.target.classList.contains('draggableIcons')) {
        if (evt.target.id !== '' && evt.target.id !== 'new') {
          const index = allocatedSpace.findIndex((obj) => (
            obj.id.toString() === evt.target.id.toString()));
          if (index !== -1) {
            allocatedSpace[index].longitude = coord.x - offset.x;
            allocatedSpace[index].latitude = coord.y - offset.y;
          } else {
            allocatedSpace.push({
              id: evt.target.id,
              space_name: name,
              longitude: coord.x - offset.x,
              latitude: coord.y - offset.y,
            });
          }
        }
      }
      setPopoverOpen(true);

      selectedElement = null;
    }

    function getUpdate(evt) {
      evt.preventDefault();
      if (evt.target.classList.contains('draggableIcons')) {
        const dId = evt.target.id;
        const long = parseFloat(evt.target.getAttributeNS(null, 'x'));
        const lat = parseFloat(evt.target.getAttributeNS(null, 'y'));
        setCoordinates({ id: dId, latitude: lat, longitude: long });
      }
    }

    elements.forEach((el) => {
      el.addEventListener('mousedown', startDrag);
      window.addEventListener('mousemove', drag);
      el.addEventListener('mouseup', endDrag);
      el.addEventListener('click', getUpdate, false);
    });
  };
  const onClick = (catagoryData, index) => {
    setSpaceDraggable(false);
    if ((!catagory) || (!categoryInfo)) {
      dispatch(setCategoryInfo(catagoryData));
      setCatagory(catagoryData);
      setIndexInfo(index);
    }
  };

  const removeCategoryData = () => {
    if (catagory) {
      setPopoverOpen(false);
      setCatagory(false);
      setIndexInfo(false);
      ReactDOM.unmountComponentAtNode(document.getElementById('svg'));
    }
  };

  const getCatagory = () => {
    const svg = document.getElementById('svg');
    const element = (
      <image
        x="10"
        y="10"
        className="svg-image-draggable draggableIcons"
        xlinkHref={indexInfo && categoryIcons.categoryIcons[indexInfo] && categoryIcons.categoryIcons[indexInfo].image ? categoryIcons.categoryIcons[indexInfo].image : unavailableIcon}
        height="20"
        width="20"
        id={`${'Popover-'}${catagory.id}`}
      />
    );
    ReactDOM.render(element, svg);
  };
  // useEffect(() => {
  //   if (catagory) {
  //     // openUpdateModal(true)
  //     draggable();
  //   }
  // }, [catagory]);

  // useEffect(() => {
  //   if (catagory && catagory.id) {
  //     getCatagory(catagory);
  //   }
  // }, [catagory]);

  useEffect(() => {
    if (floorView
      && floorView.data
      && spaceChilds
      && spaceChilds.data
      && spaceCategory
      && spaceCategory.data) {
      setAllocatedSpace(getAllocatedSpaces(spaceCategory.data, spaceChilds.data));
      openUpdateModal(false);
    }
  }, [floorView, spaceChilds, spaceCategory]);

  useEffect(() => {
    if (isSaveData) {
      setPopoverOpen(false);
    }
  }, [isSaveData]);

  return (
    <>
      <Col sm="12" md="12" lg="12" xs="12">
        <Card className="border-0 h-100 space-deatails">
          {((floorView && floorView.loading) || (spaceCategory && spaceCategory.loading)) && (
            <span className="mt-5 text-center"><Loader /></span>
          )}
          {floorView && (floorView.data && floorView.data.length > 0) && (
            <CardBody>
              <Row>
                <Col md="10" xs="10" sm="10" lg="10">
                  <Select
                    defaultValue={floorView.data[0].space_name ? {
                      ...floorView.data[0],
                      label: floorView.data[0].space_name,
                      value: floorView.data[0].space_name,
                    } : {}}
                    name="floors"
                    classNamePrefix="react-select"
                    className="react-select-container"
                    placeholder="Select Floor"
                    onChange={onChangeFloor}
                    options={floorOptions}
                    isClearable={false}
                  />
                </Col>
                <Col md="2" xs="2" sm="2" lg="2" className="p-0 mt-1">
                  <img src={tools} alt="tools" height="30" width="30" />
                </Col>
              </Row>
              <Row className="mb-1 ml-0">
                <span className="font-weight-600 mb-1 mt-2">FLOOR INFO</span>
              </Row>
              <Row className="pb-2">
                <Col sm="12" md="12" lg="12" xs="12">
                  <Card className="bg-lightblue">
                    <CardBody className="p-1 space-bg">
                      <small className="font-weight-600 mr-1">
                        Location :
                      </small>
                      <small className="font-weight-400">
                        {floorView.data[0].path_name}
                      </small>
                    </CardBody>
                  </Card>
                </Col>
              </Row>
              <Row className="pb-2">
                <Col sm="12" md="12" lg="12" xs="12">
                  <Card className="bg-lightblue">
                    <CardBody className="space-bg p-1">
                      <small className="font-weight-600 mr-1">
                        Square Feet :
                      </small>
                      <small className="font-weight-400">
                        {floorView.data[0].area_sqft}
                      </small>
                    </CardBody>
                  </Card>
                </Col>
              </Row>
              <Row className="pb-2">
                <Col sm="12" md="12" lg="12" xs="12">
                  <Card className="bg-lightblue">
                    <CardBody className="p-1">
                      <small className="font-weight-600 space-bg mr-1">
                        Max Occupancy :
                      </small>
                      <small className="font-weight-400">
                        {floorView.data[0].max_occupancy}
                      </small>
                    </CardBody>
                  </Card>
                </Col>
              </Row>
              <Row className="mb-1 ml-0 mr-0 border-bottom">
                <span className="font-weight-600  mb-1 mt-3 col-12 pl-0">FLOOR LAYOUT</span>
              </Row>
              <Row className="">
                {spaceCategory
                  && spaceCategory.data
                  && spaceCategory.data.length > 0
                  && spaceCategory.data.map((category, index) => (
                    <Col lg="12" sm="12" md="12" xs="12" className="mb-2 floor-layout" key={category.name}>
                      <Card className={index === (spaceCategory.data.length - 1) ? 'border-bottom-0' : ''}>
                        <CardBody className="p-1">
                          <Row className="pb-2">
                            <Col lg="3" sm="2" md="2" xs="3" className="text-left d-none d-sm-block ">
                              <img
                                src={categoryIcons.categoryIcons[index].image ? categoryIcons.categoryIcons[index].image : ''}
                                height="40"
                                width="40"
                                alt="category"
                              />
                            </Col>
                            <Col lg="9" sm="10" md="10" xs="12" className="pl-0 mt-2">
                              <h6 className={getUnAssigned(
                                category.id,
                                spaceChilds.data,
                              ) === 0 ? 'mb-1 font-size-0875rem' : 'mb-0 font-size-0875rem'}
                              >
                                {category.name}
                                {getUnAssigned(category.id, spaceChilds.data) ? (
                                  <>
                                    {allowedOperations.includes(actionCodes['Add Space']) && (
                                      <img
                                        src={bulkDraggableSpaces && bulkDraggableSpaces.length ? plusCircleGrey : addSpace}
                                        alt="space"
                                        onClick={() => { if (!bulkDraggableSpaces.length) { onClick(category, index); } }}
                                        height="17"
                                        width="17"
                                        className="ml-1 mb-1 cursor-pointer"
                                        aria-hidden="true"
                                      />
                                    )}
                                  </>
                                ) : ''}
                              </h6>
                              <Col lg="12" sm="12" md="12" xs="12" className="p-0 mb-2">
                                <small className="border p-1 bg-white d-block">
                                  Total Spots :
                                  <span className="ml-1">{getTotalCount(category.id, spaceChilds.data)}</span>
                                </small>
                              </Col>
                              <Row className="m-0">
                                <Col className="border p-0">
                                  <small className="bg-white text-success ml-2">
                                    {getUnAssigned(category.id, spaceChilds.data) === 0
                                      ? (
                                        <>
                                          <img src={fullyAssign} alt="full" height="15" width="15" className="mr-1 mb-1" />
                                          Fully Assigned
                                        </>
                                      ) : (
                                        <>
                                          Assigned :
                                          {' '}
                                          <span className="ml-1">{getAssigned(category.id, spaceChilds.data)}</span>
                                        </>
                                      )}
                                  </small>
                                </Col>
                                <Col
                                  className="border p-0 ml-1"
                                >
                                  <small className={getUnAssigned(
                                    category.id,
                                    spaceChilds.data,
                                  ) === 0 ? 'ml-2 bg-white floor-text' : 'ml-2 bg-white text-danger'}
                                  >
                                    Not Assigned :
                                    <span className="ml-1">{getUnAssigned(category.id, spaceChilds.data)}</span>
                                  </small>
                                </Col>
                              </Row>
                            </Col>
                          </Row>
                        </CardBody>
                      </Card>
                    </Col>
                  ))}
              </Row>
            </CardBody>
          )}
          {(floorView && floorView.err) && (
            <ErrorContent errorTxt={generateErrorMessage(floorView)} />
          )}
          {(spaceCategory && spaceCategory.err) && (
            <ErrorContent errorTxt={generateErrorMessage(spaceCategory)} />
          )}
          {catagory && popoverOpen && !bulkDraggableSpaces && (
            <PopOverSpace
              parentId={id}
              popoverOpen
              categoryList={catagory}
              removeCategoryData={removeCategoryData}
              openModal={openModal}
              catagories={catagories}
              setCatagories={setCatagories}
              spaceDraggable={spaceDraggable}
              setSpaceDraggable={setSpaceDraggable}
            />
          )}
        </Card>
      </Col>
      {isOpenModal && isSaveData
        && (
          <SaveSpacesModalWindow
            // setIsSaveData={setIsSaveData}
            catagories={catagories}
            setReload={setReload}
            setCatagories={setCatagories}
            id={id}
            // isSaveData={isSaveData}
            setRemove={setRemove}
            remove={remove}
            setUpdateResult={setUpdateResult}
            updateResult={updateResult}
          />
        )}
    </>
  );
};
SpaceDetailInfo.propTypes = {
  setSelectedId: PropTypes.func.isRequired,
  id: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string,
    PropTypes.bool,
  ]),
  isSaveData: PropTypes.bool,
  setIsSaveData: PropTypes.func.isRequired,
  spaceDraggable: PropTypes.bool,
  setSpaceDraggable: PropTypes.func.isRequired,
  catagories: PropTypes.arrayOf(
    PropTypes.shape({}),
  ),
  setCatagories: PropTypes.func.isRequired,
  setReload: PropTypes.func.isRequired,
  setRemove: PropTypes.func.isRequired,
  remove: PropTypes.bool,
  indexInfo: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string,
    PropTypes.bool,
  ]),
  setIndexInfo: PropTypes.func,
  // eslint-disable-next-line react/forbid-prop-types
  data: PropTypes.any.isRequired,
};
SpaceDetailInfo.defaultProps = {
  id: undefined,
  isSaveData: false,
  spaceDraggable: false,
  catagories: [],
  remove: false,
  indexInfo: false,
  setIndexInfo: () => { },
};
export default SpaceDetailInfo;
