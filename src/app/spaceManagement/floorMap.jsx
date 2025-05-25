/* eslint-disable react/jsx-no-useless-fragment */
/* eslint-disable no-param-reassign */
/* eslint-disable camelcase */
/* eslint-disable no-unused-vars */
/* eslint-disable import/no-cycle */
/* eslint-disable no-const-assign */
/* eslint-disable no-unused-expressions */
/* eslint-disable react/no-array-index-key */
/* eslint-disable import/no-unresolved */
/* eslint-disable react/jsx-props-no-spreading */
import React, { useEffect, useState } from 'react';
import {
  Alert,
  Card,
  CardBody,
  Col,
  Row,
  UncontrolledTooltip,
} from 'reactstrap';
import * as PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faInfoCircle,
} from '@fortawesome/free-solid-svg-icons';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';

import plusIcon from '@images/plusIcon.png';
import minusIcon from '@images/minusIcon.png';
import resetIcon from '@images/reset.png';
import ErrorContent from '@shared/errorContent';
import unavailableIcon from '@images/empty.svg';
import AllocatedSpaces from './allocatedSpaces';
import Loader from '../shared/loading';
import categoryIcons from './utils/categoryIcons.json';
import {
  getAllocatedSpaces,
  // getUnAssigned,
} from './utils/utils';
import {
  getSelectSpace, setCategoryInfo, newBulkDraggableSpaceData, isbulkUpdateData, isdragSpaceUpdate,
} from './spaceService';
import './space.scss';
import { generateErrorMessage, apiURL } from '../util/appUtils';
import PopOverSpace from './popOverSpace';
// import SaveSpacesModalWindow from './saveModalWindow';
// import SpaceDetail from './spaceDetail';

const appConfig = require('../config/appConfig').default;

const FloorMap = (props) => {
  const dispatch = useDispatch();
  const {
    id,
    imgSizes,
    imgvalidate,
    catagories,
    setCatagories,
    reload,
    setReload,
    spaceDraggable,
    setSpaceDraggable,
    isSaveData,
    setIsSaveData,
    setRemove,
    remove,
    indexInfo,
    setIndexInfo,
    isBulkFilteredData,
    setIsBulkFilteredData,
    setPopoverOpen,
    popoverOpen,
    spaceCategories,
  } = props;

  const {
    floorView, updateFloor, spaceCategory, spaceChilds, spaceSelected, categoryInfo, isUpdateSpaces, isDiscard, updateDragSpaces,
  } = useSelector((state) => state.space);

  const [visible, setVisible] = useState(true);
  const [newLatLong, setNewLatLong] = useState(null);
  const [allocatedSpace, setAllocatedSpace] = useState([]);
  const [popoverClose, setPopoverClose] = useState(false);
  const [newDraggableSpace, setNewDraggableSpace] = useState({});
  const [newBulkDraggableSpace, setNewBulkDraggableSpace] = useState([]);
  const [spaceDraggability, setSpaceDraggability] = useState(false);
  const [updateDrag, setUpdateDrag] = useState(false);
  // const [popoverOpen, setPopoverOpen] = useState(false);
  const [coordinates, setCoordinates] = useState(null);
  const [isOpenModal, openUpdateModal] = useState(false);
  const [updateResult, setUpdateResult] = useState({});
  const [result, setResult] = useState('');
  const [panning, setPanning] = useState(true);
  const [viewboxCal, setViewBoxCal] = useState('0 0 840 606');

  const [resetElement, setResetElement] = useState(false);
  const [resetTrue, setResetTrue] = useState(false);
  const onDismiss = () => setVisible(false);

  const [xAxis, setXAxis] = useState(0);
  const [yAxis, setYAxis] = useState(0);
  const [scale, setScale] = useState(0);
  const [newScale, setNewScale] = useState(0.9);
  const [iconHeight, setIconHeight] = useState(20);
  const [iconWidth, setIconWidth] = useState(20);

  const svg = document.querySelector('#svg-drag');
  const elements = svg && svg.querySelectorAll('.floorMapIcons');
  let viewboxArrayValues = [];

  const getdraggable = () => {
    function getMousePosition(evt) {
      let viewboxValues = viewboxCal.split(' ');
      let i = 0;
      while (i < viewboxValues.length) {
        viewboxArrayValues[i] = parseInt(viewboxValues[i]);
        i++;
      }
      const CTM = svg.getScreenCTM();
      return {
        x: (evt.clientX - CTM.e) / CTM.a,
        y: (evt.clientY - CTM.f) / CTM.d,
      };
    }
    let selectedElement; let
      offset;

    function startDrag(evt) {
      evt.preventDefault();
      setPanning(true);
      if (evt.target.classList.contains('floorMapIcons')) {
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
        setSpaceDraggability(true);
        setUpdateDrag(true);
      }
    }

    function endDrag(evt) {
      evt.preventDefault();
      setPanning(false);
      const coord = getMousePosition(evt);
      const name = evt.target.getAttributeNS(null, 'space');
      const long = parseFloat(evt.target.getAttributeNS(null, 'x'));
      const lat = parseFloat(evt.target.getAttributeNS(null, 'y'));
      if (evt.target.classList.contains('floorMapIcons')) {
        if (evt.target.id !== '' && evt.target.id !== 'new' && offset) {
          const indexValue = evt.target.id.split(/(\d+)/);
          const index = allocatedSpace.findIndex(
            (obj) => (obj.id === indexValue[1]),
          );
          selectedElement.setAttributeNS(null, 'path_name', allocatedSpace[indexValue[1]].path_name);
          selectedElement.setAttributeNS(null, 'space_id', allocatedSpace[indexValue[1]].id);
          selectedElement.setAttributeNS(null, 'actual_longitude', allocatedSpace[indexValue[1]].longitude);
          selectedElement.setAttributeNS(null, 'actual_latitude', allocatedSpace[indexValue[1]].latitude);
          selectedElement.setAttributeNS(null, 'space_name', allocatedSpace[indexValue[1]].space_name);
          if (index !== -1) {
            allocatedSpace[indexValue[1]].longitude = coord.x - offset.x;
            allocatedSpace[indexValue[1]].latitude = coord.y - offset.y;
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
      if ((lat >= viewboxArrayValues[0] && long >= viewboxArrayValues[1]) && (long <= viewboxArrayValues[2]-20 && lat <= viewboxArrayValues[3]-20)) {
        selectedElement = null;
        setSpaceDraggability(false);
      } else {
        setPopoverOpen(false);
        setPopoverClose(false);
      }
    }

    function getUpdate(evt) {
      evt.preventDefault();
      if (evt.target.classList.contains('floorMapIcons')) {
        const dId = evt.target.id;
        const long = parseFloat(evt.target.getAttributeNS(null, 'x'));
        const lat = parseFloat(evt.target.getAttributeNS(null, 'y'));
        const pname = evt.target.getAttributeNS(null, 'path_name');
        const spname = evt.target.getAttributeNS(null, 'space_name');
        const sId = evt.target.getAttributeNS(null, 'space_id');
        const act_long = parseFloat(evt.target.getAttributeNS(null, 'actual_longitude'));
        const act_lat = parseFloat(evt.target.getAttributeNS(null, 'actual_latitude'));
        setNewLatLong({
          space_id: sId, id: dId, latitude: lat, longitude: long, space_name: spname, path_name: pname, actual_longitude: act_long, actual_latitude: act_lat,
        });
        setSpaceDraggability(true);
      }
    }
    // add event listeners
    if (!spaceDraggable) {
      setNewLatLong(null);
      setSpaceDraggability(false);
      elements && elements.forEach((el) => {
        const newElement = el.cloneNode(true);
        el.parentNode.replaceChild(newElement, el);
      });
    } else {
      elements && elements.forEach((el) => {
        el.addEventListener('mousedown', startDrag);
        window.addEventListener('mousemove', drag);
        el.addEventListener('mouseup', endDrag);
        el.addEventListener('click', getUpdate, false);
      });
    }
  };

  useEffect(() => {
    if (updateDrag) {
      dispatch(isdragSpaceUpdate(updateDrag));
    }
  }, [updateDrag]);

  useEffect(() => {
    if (!spaceDraggable && newDraggableSpace && newDraggableSpace.render) {
      setNewDraggableSpace({});
    }
  }, [spaceDraggable, newDraggableSpace]);

  useEffect(() => {
    if (spaceChilds && spaceChilds.data && spaceChilds.data.length && !spaceDraggable) {
      setPopoverClose(true);
      getdraggable();
    }
  }, [spaceDraggable]);

  useEffect(() => {
    if(floorView && floorView.data) {
      newBulkDraggableSpaceData([]);
      setSpaceDraggable(false);
    }
  }, [floorView])

  useEffect(() => {
    if (isUpdateSpaces) {
      if (spaceDraggability && newLatLong !== null) {
        const array = newBulkDraggableSpace;
        if (newBulkDraggableSpace && newBulkDraggableSpace.length) {
          const bulkindex = newBulkDraggableSpace.findIndex((spaceId) => spaceId.id === newLatLong.id);
          if (bulkindex !== -1) {
            array[bulkindex] = newLatLong;
            setNewBulkDraggableSpace(array);
          } else {
            array.push(newLatLong);
            setNewBulkDraggableSpace(array);
          }
        } else {
          array.push(newLatLong);
          setNewBulkDraggableSpace(array);
        }
      }
      dispatch(newBulkDraggableSpaceData(newBulkDraggableSpace));
    }
  }, [spaceDraggability, newLatLong, isUpdateSpaces]);

  useEffect(() => {
    if (isUpdateSpaces) {
      dispatch(isbulkUpdateData(false));
    }
  }, [isUpdateSpaces]);

  useEffect(() => {
    if (isDiscard) {
      setNewBulkDraggableSpace([]);
    }
  }, [isDiscard]);

  useEffect(() => {
    if (reload) {
      if (floorView
        && floorView.data
        && spaceChilds
        && spaceChilds.data
        && spaceCategory
        && spaceCategory.data) {
        setAllocatedSpace(getAllocatedSpaces(spaceCategory.data, spaceChilds.data));
        dispatch(getSelectSpace(allocatedSpace));
      }
      setReload(false);
    }
  }, [floorView, spaceChilds, spaceCategory, reload]);

  useEffect(() => {
    if (spaceChilds && spaceChilds.data && spaceChilds.data.length && spaceSelected && spaceSelected.statuses && spaceDraggable) {
      getdraggable();
    }
  }, [spaceDraggable]);

  useEffect(() => {
    if (floorView
      && floorView.data
      && spaceChilds
      && spaceChilds.data
      && spaceCategory
      && spaceCategory.data) {
      setAllocatedSpace(getAllocatedSpaces(spaceCategory.data, spaceChilds.data));
      dispatch(getSelectSpace(allocatedSpace));
      setCatagories([]);
      reset();
    }
  }, [floorView, spaceChilds, spaceCategory]);

  let key = 1;

  const renderSvg = (child) => {
    // eslint-disable-next-line no-unreachable-loop
    for (let i = 0; i < child; i += 1) {
      // eslint-disable-next-line no-plusplus
      return (<svg className="svgPopover" xmlns="http://www.w3.org/2000/svg" id="svg" key={key++} />);
    }
    return undefined;
  };

  const wheels = (e) => {
    if (e !== undefined) {
      setScale((e.state.scale).toFixed(1));
    }
    if (scale > newScale) {
      if (iconHeight > 5) {
        elements && elements.forEach((newElement) => {
          newElement.setAttribute('height', iconHeight - 1.5);
          newElement.setAttribute('width', iconWidth - 1.5);
          newElement.style.transform = `translate(${xAxis + 0.06}em , ${yAxis + 0.06}em)`;
        });
        setIconHeight(iconHeight - 1.5);
        setIconWidth(iconWidth - 1.5);
        setXAxis(xAxis + 0.06);
        setYAxis(yAxis + 0.06);
      }
      setNewScale(scale);
    } else {
      if (iconHeight < 20) {
        setIconHeight(iconHeight + 1.5);
        setIconWidth(iconWidth + 1.5);
        elements && elements.forEach((newElement) => {
          newElement.setAttribute('height', iconHeight + 1.5);
          newElement.setAttribute('width', iconWidth + 1.5);
          newElement.style.transform = `translate(${xAxis - 0.06}em , ${yAxis - 0.06}em)`;
        });
        setXAxis(xAxis - 0.06);
        setYAxis(yAxis - 0.06);
      }
      setNewScale(scale);
    }
  };

  const scaleUp = () => {
    if (iconHeight > 5) {
      setIconHeight(iconHeight - 3);
      setIconWidth(iconWidth - 3);
      elements && elements.forEach((newElement) => {
        newElement.setAttribute('height', iconHeight - 3);
        newElement.setAttribute('width', iconWidth - 3);
        newElement.style.transform = `translate(${xAxis + 0.12}em , ${yAxis + 0.12}em)`;
      });
      setXAxis(xAxis + 0.12);
      setYAxis(yAxis + 0.12);
    }
  };

  const scaleDown = () => {
    if (iconHeight < 20) {
      setIconHeight(iconHeight + 3);
      setIconWidth(iconWidth + 3);
      elements && elements.forEach((newElement) => {
        newElement.setAttribute('height', iconHeight + 3);
        newElement.setAttribute('width', iconWidth + 3);
        newElement.style.transform = `translate(${xAxis - 0.12}em , ${yAxis - 0.12}em)`;
      });
      setXAxis(xAxis - 0.12);
      setYAxis(yAxis - 0.12);
    }
  };

  const reset = () => {
    setXAxis(0);
    setYAxis(0);
    setScale(0);
    elements && elements.forEach((newElement) => {
      newElement.setAttribute('height', 20);
      newElement.setAttribute('width', 20);
      newElement.style.transform = `translate(${0}em , ${0}em)`;
    });
    setNewScale(0.9);
    setIconHeight(20);
    setIconWidth(20);
  };

  const draggable = () => {
    const draggableElements = svg && svg.querySelectorAll('.draggableIcons');
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
      setPanning(true);
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
      setPanning(false);
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

    draggableElements && draggableElements.length && draggableElements.forEach((el) => {
      el.addEventListener('mousedown', startDrag);
      window.addEventListener('mousemove', drag);
      el.addEventListener('mouseup', endDrag);
      el.addEventListener('click', getUpdate, false);
    });
  };
  useEffect(() => {
    if (categoryInfo) {
      draggable();
    }
  });
  const closePopoverOnZoom = () => {
    setPopoverOpen(false);
    if (resetElement) {
      setResetTrue(true);
    }
  };

  const loader = floorView && floorView.loading;

  useEffect(() => {
    let isMounted = true;
    if (floorView && floorView.data && floorView.data.length > 0
      && floorView && !floorView.loading && updateFloor && !updateFloor.loading) {
      if (floorView.data[0].file_path
        && floorView.data[0].file_path !== '') {
        const filepath = floorView.data[0].file_path.includes('https')
          ? floorView.data[0].file_path
          : `${apiURL}${`${floorView.data[0].file_path.replace('+xml', '')}`}`;
        setResult(
          <Col lg="12" sm="12" md="12" onDoubleClick={() => { setPanning(false); closePopoverOnZoom(); }}>
            <TransformWrapper
              centerOnInit
              onZoomStart={() => {
                setPanning(false);
                closePopoverOnZoom();
              }}
              onPanningStart={() => {
                closePopoverOnZoom();
              }}
              panning={{ disabled: panning }}
              onZoom={wheels}
            >
              {({
                zoomIn, zoomOut, resetTransform, ...rest
              }) => (
                <>
                  <div className="zommcontrols floormap-zoom">
                    <div>
                      <img
                        src={plusIcon}
                        className="outline-none cursor-pointer mb-2"
                        onClick={() => {
                          zoomIn();
                          scaleUp();
                          setPanning(false);
                          closePopoverOnZoom();
                        }}
                        id="zoomin"
                        alt="zoomIn"
                        aria-hidden="true"
                      />
                      <UncontrolledTooltip placement="right" target="zoomin">
                        zoomIn
                      </UncontrolledTooltip>
                    </div>
                    <div>
                      <img
                        src={minusIcon}
                        className="outline-none cursor-pointer mb-2"
                        id="zoomout"
                        onClick={() => {
                          zoomOut();
                          setPanning(false);
                          closePopoverOnZoom();
                          scaleDown();
                        }}
                        alt="zoomOut"
                        aria-hidden="true"
                      />
                      <UncontrolledTooltip
                        placement="right"
                        target="zoomout"
                      >
                        zoomOut
                      </UncontrolledTooltip>
                    </div>
                    <div>
                      <img
                        src={resetIcon}
                        className="outline-none cursor-pointer"
                        id="reset"
                        onClick={() => {
                          resetTransform();
                          setPanning(true);
                          closePopoverOnZoom();
                          reset();
                        }}
                        alt="reset"
                        aria-hidden="true"
                      />
                      <UncontrolledTooltip placement="right" target="reset">
                        Reset
                      </UncontrolledTooltip>
                    </div>
                  </div>
                  <TransformComponent>
                    <div className="p-1 thin-scrollbar" id="containerImageSpace">
                      <div
                        id="contBox"
                        className="svgContainer"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox={viewboxCal}
                          className="injected-svg"
                          id="svg-drag"
                        >
                          <image href={filepath} height="100%" width="100%" />
                          {allocatedSpace.map((spaces, i) => (
                            <AllocatedSpaces
                              id={id}
                              key={i}
                              spaceIndex={`space${i}`}
                              cx={spaces.longitude}
                              spaceCategories={spaceCategories}
                              removeCategoryData={removeCategoryData}
                              allocatedSpaceInfo={spaces}
                              cy={spaces.latitude}
                              newLatLong={newLatLong}
                              setPopoverClose={setPopoverClose}
                              popoverClose={popoverClose}
                              getdraggable={getdraggable}
                              setSpaceDraggable={setSpaceDraggable}
                              setNewLatLong={setNewLatLong}
                              newDraggableSpace={newDraggableSpace}
                              setNewDraggableSpace={setNewDraggableSpace}
                              spaceDraggable={spaceDraggable}
                              updateDrag={updateDrag}
                              setUpdateDrag={setUpdateDrag}
                              setResetElement={setResetElement}
                              resetTrue={resetTrue}
                              setResetTrue={setResetTrue}
                              resetElement={resetElement}
                              iconHeight={iconHeight}
                              iconWidth={iconWidth}
                              xAxis={xAxis}
                              yAxis={yAxis}
                            />
                          ))}
                          {/* {spaceCategory
                              && spaceCategory.data
                              && spaceCategory.data.length > 0
                              && spaceCategory.data.map((category) => (
                                getUnAssigned(
                                  category.id,
                                  spaceChilds.data,
                                )
                                  ? renderSvg(getUnAssigned(category.id, spaceChilds.data)) : ''
                              ))} */}
                          {catagories && catagories.length && catagories.map((item, index) => (
                            <svg className="svgPopover" xmlns="http://www.w3.org/2000/svg" key={index}>
                              <image
                                className="svg-image-draggable"
                                href={item.imgready}
                                x={item.longitude}
                                y={item.latitude}
                                height={iconHeight}
                                width={iconWidth}
                                style={{ transform: `translate(${xAxis}em , ${yAxis}em)` }}
                              />
                            </svg>
                          ))}
                          {categoryInfo && (
                          <svg className="svgPopover" xmlns="http://www.w3.org/2000/svg" id="svg">
                            <image
                              className="svg-image-draggable draggableIcons"
                              xlinkHref={categoryIcons.categoryIcons[indexInfo] && categoryIcons.categoryIcons[indexInfo].image ? categoryIcons.categoryIcons[indexInfo].image : unavailableIcon}
                              x={10}
                              y={20}
                              height={iconHeight}
                              width={iconWidth}
                              style={{ transform: `translate(${xAxis}em , ${yAxis}em)` }}
                              id={`${'Popover-'}${categoryInfo.id}`}
                            />
                          </svg>
                          )}
                        </svg>
                      </div>
                    </div>
                  </TransformComponent>
                </>
              )}
            </TransformWrapper>
          </Col>,
        );
      } else if (floorView.data[0].file_path === false) {
        setResult((
          <Alert color="primary" className="mt-3 text-center">
            <FontAwesomeIcon size="sm" icon={faInfoCircle} />
            {' '}
            {' '}
            No Data Found...
          </Alert>
        ));
      }
    }
    return () => { isMounted = false; };
  }, [floorView, catagories, updateFloor, newLatLong, iconWidth, xAxis, scale, yAxis, iconHeight, spaceDraggable, categoryInfo, panning, popoverClose, isSaveData, remove, resetElement, resetTrue]);

  const removeCategoryData = () => {
    if (categoryInfo) {
      setPopoverOpen(false);
      setIndexInfo(false);
      dispatch(setCategoryInfo(false));
    }
  };

  useEffect(() => {
    if (loader) {
      setResult(false);
    }
  }, [floorView, updateFloor]);

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
    if (categoryInfo) {
      dispatch(setCategoryInfo(false));
      setIndexInfo(false);
    }
    setPopoverOpen(false);
  };
  return (
    <Card className="h-100 border-0 space-deatails">
      <CardBody className="pt-0 mt-1 pl-1">
        <Row>
          <Col md="12" lg="12" xs="12">
            {loader ? (
              <div className="mt-5 text-center">
                <Loader />
              </div>
            ) : ''}
            {(floorView && floorView.err) && (
            <ErrorContent errorTxt={generateErrorMessage(floorView)} />
            )}
            {!loader && (<>{result}</>)}
            {categoryInfo && popoverOpen && (
            <PopOverSpace
              parentId={id}
              popoverOpen
              categoryList={categoryInfo}
              removeCategoryData={removeCategoryData}
              openModal={openModal}
              catagories={catagories}
              setCatagories={setCatagories}
              setPopoverOpen={setPopoverOpen}
            />
            )}
          </Col>
        </Row>
      </CardBody>
    </Card>
  );
};
FloorMap.propTypes = {
  id: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string,
    PropTypes.bool,
  ]),
  imgSizes: PropTypes.bool.isRequired,
  imgvalidate: PropTypes.bool.isRequired,
  spaceDraggable: PropTypes.bool,
  catagories: PropTypes.arrayOf(
    PropTypes.shape({}),
  ),
  spaceCategories: PropTypes.arrayOf(
    PropTypes.shape({}),
  ),
  setCatagories: PropTypes.func.isRequired,
  reload: PropTypes.bool,
  setReload: PropTypes.func.isRequired,
  setSpaceDraggable: PropTypes.func,
  isBulkFilteredData: PropTypes.bool,
  setIsBulkFilteredData: PropTypes.func.isRequired,
  indexInfo: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string,
    PropTypes.bool,
  ]),
  setIndexInfo: PropTypes.func,
  isSaveData: PropTypes.bool,
  setIsSaveData: PropTypes.func,
  setRemove: PropTypes.func,
  remove: PropTypes.bool,
  popoverOpen: PropTypes.bool,
  setPopoverOpen: PropTypes.func.isRequired,
};

FloorMap.defaultProps = {
  spaceDraggable: false,
  catagories: [],
  spaceCategories: [],
  reload: false,
  popoverOpen: false,
  isBulkFilteredData: false,
  id: undefined,
  indexInfo: false,
  isSaveData: false,
  remove: false,
  setIsSaveData: () => { },
  setIndexInfo: () => { },
  setRemove: () => { },
  setSpaceDraggable: () => { },
};

export default FloorMap;
