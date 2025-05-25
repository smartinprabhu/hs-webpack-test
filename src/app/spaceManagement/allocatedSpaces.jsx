/* eslint-disable array-callback-return */
/* eslint-disable no-unused-vars */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable import/no-unresolved */
import React, { useState, useEffect } from 'react';
import {
  Col,
  PopoverBody,
  Row,
  Popover,
  Modal,
  ModalBody,
  ModalFooter,
  Spinner,
} from 'reactstrap';
import Button from '@mui/material/Button';
import useStyles from './styles';
import { useSelector, useDispatch } from 'react-redux';
import * as PropTypes from 'prop-types';
import Draggable from 'react-draggable';
// import { Tooltip } from 'antd';
import { getFloorsList } from '../assets/equipmentService';
import ModalHeaderComponent from '@shared/modalHeaderComponent';
import Tooltip from '@material-ui/core/Tooltip';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faTimes } from '@fortawesome/free-solid-svg-icons';

import close from '@images/circleClose.svg';
import UpdateSpaceModel from './updateSpaceModel';
import { getListOfModuleOperations } from '../util/appUtils';
import actionCodes from './data/spaceManagementActionCodes.json';
import SaveSpaceModalWindow from './saveModalWindow';
import {
  newBulkDraggableSpaceData, setDiscard, isbulkUpdateData, isdragSpaceUpdate, isOpenPopoverWindow, getFloorChild, updateSpaceDetails,
} from './spaceService';

const AllocatedSpaces = (props) => {
  const dispatch = useDispatch();
  const {
    id, spaceIndex, cx, cy, allocatedSpaceInfo, newLatLong, popoverClose, setPopoverClose, getdraggable, setSpaceDraggable, setNewLatLong, newDraggableSpace, setNewDraggableSpace, spaceDraggable,
    setResetElement, resetTrue, setResetTrue, newBulkDraggableSpace, setNewBulkDraggableSpace, updateDrag, setUpdateDrag, iconHeight, iconWidth, xAxis, yAxis, spaceCategories, removeCategoryData,
  } = props;

  const {
    spaceChilds, bulkDraggableSpaces, isDiscard, isUpdateSpaces, updateDragSpaces, popoverSpace, employeeList, updateSpace,
  } = useSelector((state) => state.space);
  const { userRoles } = useSelector((state) => state.user);
  const allowedOperations = getListOfModuleOperations(userRoles && userRoles.data ? userRoles.data.allowed_modules : [], 'HSpace - Space Management', 'code');

  const [tooltipOpen, setTooltipOpen] = useState(false);
  const [openUpdateModal, setOpenUpdateModal] = useState(false);
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [isSaveData, setIsSaveData] = useState(false);
  const [catagories, setCatagories] = useState(false);
  const [target, setTarget] = useState(false);
  const [isUpdateData, setIsUpdateData] = useState(false);
  const [bulkCatagories, setBulkCatagories] = useState([]);
  const [onClickUpdate, setOnClickUpdate] = useState(false);
  const [open, setOpen] = useState(false);
  const [onClickUpdateData, setOnClickUpdateData] = useState(false);
  const { userInfo } = useSelector((state) => state.user);
  const [openSpaceModal, setOpenSpaceModal] = useState(false);
  const classes = useStyles();

  const appModels = require('../util/appModels').default;

  const toggle = () => setTooltipOpen(!tooltipOpen);
  const openPopover = () => {
    const obj = {
      previous: {
        name: newDraggableSpace && newDraggableSpace.current && newDraggableSpace.current.name,
        index: newDraggableSpace && newDraggableSpace.current && newDraggableSpace.current.index,
      },
      current: {
        name: allocatedSpaceInfo.space_name,
        index: spaceIndex,
      },
      render: true,
    };
    setResetElement({ space: allocatedSpaceInfo, index: spaceIndex });
    setNewDraggableSpace(obj);
    setPopoverClose(true);
    setPopoverOpen(true);
    setTooltipOpen(false);
    setOpen(false);
  };

  useEffect(() => {

  })

  useEffect(() => {
    if (popoverClose) {
      setTarget(false);
    }
  }, [popoverClose]);

  useEffect(() => {
    if (popoverOpen) {
      dispatch(isOpenPopoverWindow(popoverOpen));
    }
  }, [popoverOpen]);

  useEffect(() => {
    setOpen(false);
    if (newDraggableSpace && newDraggableSpace.render && newDraggableSpace.previous && newDraggableSpace.previous.name && newDraggableSpace.current && newDraggableSpace.current.name
      && newDraggableSpace.current.index !== newDraggableSpace.previous.index) {
      let spaces = [];
      if (bulkDraggableSpaces && bulkDraggableSpaces.length) {
        spaces = bulkDraggableSpaces.filter((obj) => obj.id === newDraggableSpace.previous.index);
      }
      const space = spaceChilds.data.filter(
        (spaceChild) => spaceChild.space_name === newDraggableSpace.previous.name,
      );
      if ((space && space.length) && !(spaces && spaces.length)) {
        const oldElement = document.getElementById(newDraggableSpace.previous.index);
        oldElement.setAttribute('x', parseFloat(space[0].longitude));
        oldElement.setAttribute('y', parseFloat(space[0].latitude));
        const newElement = oldElement.cloneNode(true);
        // oldElement.parentNode.replaceChild(newElement, oldElement);
        getdraggable();
      }
      setPopoverOpen(false);
      setPopoverClose(false);
      const obj = newDraggableSpace;
      obj.render = false;
      setNewDraggableSpace(obj);
    }
  }, [newDraggableSpace, bulkDraggableSpaces]);

  const closePopoverOnDrag = () => {
    setPopoverClose(false);
    setPopoverOpen(false);
    setTooltipOpen(false);
  };
  const openModal = () => {
    setPopoverClose(false);
    setPopoverOpen(false);
    setOpenUpdateModal(true);
    setOnClickUpdate(false);
    setUpdateDrag(false);
  };

  useEffect(() => {
    if (popoverOpen) {
      setTarget(spaceIndex);
    } else {
      setTarget(false);
    }
  }, [popoverOpen]);

  const relocateValues = () => {
    const space = spaceChilds.data.filter(
      (spaceChild) => spaceChild.space_name === allocatedSpaceInfo.space_name,
    );
    const oldElement = document.getElementById(spaceIndex);

    if (space && space.length && oldElement) {
      oldElement.setAttribute('x', parseFloat(space[0].longitude));
      oldElement.setAttribute('y', parseFloat(space[0].latitude));
      const newElement = oldElement.cloneNode(true);
      // oldElement.parentNode.replaceChild(newElement, oldElement);
      getdraggable();
    }
    setPopoverOpen(false);
    setPopoverClose(false);
    setOnClickUpdate(false);
    setUpdateDrag(false);
  };

  const removeLatAndLong = () => {
    setOpenSpaceModal(true);
  };

  const removeLatAndLongSpace = () => {
    const space = spaceChilds.data.filter(
      (spaceChild) => spaceChild.space_name === allocatedSpaceInfo.space_name,
   );
   const postData = {};
   postData.latitude = false;
   postData.longitude = false;
   const spaceID = space[0].id;
   const payload = postData;
   dispatch(updateSpaceDetails(spaceID, payload));
  };
  
  const confirmButton = () => {
   setOpenSpaceModal(false); 
   dispatch(getFloorsList(userInfo && userInfo.company && userInfo.company.id, appModels.SPACE));
  };

  useEffect(() => {
    if(updateSpace && updateSpace.data === true){
       dispatch(getFloorChild(id, appModels.SPACE, spaceCategories));
     }
  }, [spaceChilds]);

  useEffect(() => {
    if(openSpaceModal && popoverOpen){
      setOpen(false);
      setPopoverOpen(false);
    }
  }, [openSpaceModal, open, popoverOpen]);

  const cancelWindow = () => {
    setOpenSpaceModal(false);
  };

  useEffect(() => {
    if (popoverOpen && resetTrue) {
      setPopoverOpen(false);
      setPopoverClose(false);
      setOnClickUpdate(false);
      setUpdateDrag(false);
      setResetTrue(false);
      setResetElement(false);
    }
  }, [popoverOpen, resetTrue]);

  const discardData = () => {
    if (bulkDraggableSpaces && bulkDraggableSpaces.length) {
      bulkDraggableSpaces.map((space) => {
        if (space.space_name === allocatedSpaceInfo.space_name) {
          const oldElement = document.getElementById(spaceIndex);
          oldElement.setAttribute('x', parseFloat(space.actual_longitude));
          oldElement.setAttribute('y', parseFloat(space.actual_latitude));
          const newElement = oldElement.cloneNode(true);
          // oldElement.parentNode.replaceChild(newElement, oldElement);
          getdraggable();
        }
      });
      setUpdateDrag(false);
    }
    setResetElement(false);
    setPopoverOpen(false);
    setPopoverClose(false);
    setBulkCatagories([]);
    setNewBulkDraggableSpace([]);
    setIsUpdateData(false);
    setOnClickUpdate(false);
    dispatch(newBulkDraggableSpaceData([]));
    setNewLatLong(null);
    dispatch(setDiscard(false));
  };

  useEffect(() => {
    if (isDiscard) {
      discardData();
    }
  }, [isDiscard, bulkDraggableSpaces]);

  useEffect(() => {
    if (openUpdateModal) {
      setPopoverOpen(false);
    }
  }, [openUpdateModal]);

  useEffect(() => {
    if (popoverOpen) {
      setPopoverClose(true);
      setOpen(false);
    }
  });
  const onSave = () => {
    setPopoverOpen(false);
    const space = allocatedSpaceInfo;
    space.longitude = newLatLong.longitude;
    space.latitude = newLatLong.latitude;
    setCatagories([space]);
    setIsSaveData(true);
    setIsUpdateData(false);
  };

  const onUpdate = () => {
    setPopoverOpen(false);
    setOnClickUpdate(true);
    setResetElement(false);
    setOnClickUpdateData(true);
    if (onClickUpdateData) {
      setUpdateDrag(false);
      dispatch(isbulkUpdateData(onClickUpdate));
    }
  };

  const handleClose = () => {
    if (!popoverOpen) {
      setOpen(false);
    }
  };

  const handleOpen = () => {
    setOpen(true);
  };

  useEffect(() => {
    if (!updateDragSpaces) {
      setUpdateDrag(false);
      dispatch(isdragSpaceUpdate(updateDrag));
    }
  }, [updateDrag, updateDragSpaces]);

  useEffect(() => {
    if (onClickUpdate) {
      setUpdateDrag(false);
      dispatch(isbulkUpdateData(onClickUpdate));
    }
  }, [onClickUpdate]);

  useEffect(() => {
    if (!popoverSpace) {
      setPopoverOpen(false);
      setPopoverClose(false);
    }
  }, [popoverSpace]);

  return (
    <Draggable
      onDrag={closePopoverOnDrag}
      onStop={openPopover}
    >
      <Tooltip title={allocatedSpaceInfo.space_name} placement={popoverOpen ? 'right' : 'left'} open={open} onClose={handleClose} onOpen={handleOpen} arrow>
        <svg className="svgPopover" xmlns="http://www.w3.org/2000/svg">
          {allocatedSpaceInfo
          && allocatedSpaceInfo.space_status
          && cx !== 0
          && cy !== 0
          && cx !== false
          && cy !== false
          && (
            <><>
              <image
                id={spaceIndex}
                className="svg-image-draggable floorMapIcons"
                xlinkHref={allocatedSpaceInfo.imgready}
                x={cx}
                y={cy}
                onClick={() => { if (spaceDraggable) { openPopover(); } } }
                height={iconHeight}
                width={iconWidth}
                style={{ transform: `translate(${xAxis}em , ${yAxis}em)` }} />
              <div className="details">
                {target && newDraggableSpace && newDraggableSpace.current && newDraggableSpace.current.index && newDraggableSpace.current.index === target && (
                  <Popover className="assign-popover" trigger="legacy" placement="right" isOpen={popoverOpen} target={spaceIndex}>
                    <PopoverBody>
                      <div>
                        <h6 className="font-size-0875rem">
                          <img
                            src={allocatedSpaceInfo.imgready}
                            height="30"
                            width="30"
                            className="mr-2"
                            alt="spaceImage" />
                          {allocatedSpaceInfo.space_name}
                          <img
                            src={close}
                            className="float-right cursor-pointer"
                            height="15"
                            width="15"
                            onClick={() => { relocateValues(); closePopoverOnDrag(); } }
                            alt="close" />
                        </h6>
                        <h6 className="font-size-0875rem">
                          Location:
                          <small className="light-text">
                            {' '}
                            {allocatedSpaceInfo.path_name}
                          </small>
                        </h6>
                        <Row>
                          {/* {allowedOperations.includes(actionCodes['Edit Space']) && (
                               <Col sm="6" md="6" lg="6" xs="6" className="float-left">
                                <Button
                                   className="bg-white pb-1 pt-1 text-dark float-left mt-1 popover-button"
                                   size="sm"
                                   onClick={openModal}
                                >
                                Go to Assets
                                </Button>
                                </Col>
                          )} */}
                          {allowedOperations.includes(actionCodes['Edit Space']) && (
                            <Col sm="12" md="12" lg="12" xs="12">
                              <Button
                              variant="contained"
                                className="bg-white pb-1 pt-1 text-dark text-center w-100 mt-1 popover-button greyButton"
                                size="sm"
                                onClick={openModal}
                              >
                                Assign to Employee
                              </Button>
                            </Col>
                          )}
                          {updateDrag && (
                            <Col sm="12" md="12" lg="12" xs="12">
                              <Button
                              variant="contained"
                                className="bg-white pb-1 pt-1 text-dark text-center w-100 mt-1 popover-button greyButton"
                                size="sm"
                                onClick={onUpdate}
                              >
                                Add to Update
                              </Button>
                            </Col>
                          )}
                        </Row>
                        <Row>
                          <Col sm="12" md="12" lg="12" xs="12">
                            <Button
                            variant="contained"
                              className="bg-white pb-1 pt-1 text-dark text-center w-100 mt-1 popover-button greyButton"
                              size="sm"
                              onClick={relocateValues}
                            >
                              Reset
                            </Button>
                          </Col>
                          <Col sm="12" md="12" lg="12" xs="12">
                            <Button
                            variant="contained"
                              className="bg-white pb-1 pt-1 text-dark text-center w-100 mt-1 popover-button greyButton"
                              size="sm"
                              onClick={removeLatAndLong}
                            >
                              Remove Space
                            </Button>
                          </Col>
                          {/* {(newLatLong && newLatLong.longitude && newLatLong.latitude) && !(bulkDraggableSpaces && bulkDraggableSpaces.length) && (
                             <Col sm="12" md="12" lg="12" xs="12">
                               <Button
                                 className="bg-white pb-1 pt-1 text-dark text-center w-100 mt-1 popover-button greyButton"
                                 size="sm"
                                 onClick={onSave}
                               >
                               Save
                               </Button>
                              </Col>
                          )} */}
                        </Row>
                      </div>
                    </PopoverBody>
                  </Popover>
                )}
                {openUpdateModal && newLatLong && newLatLong.latitude && newLatLong.longitude && (
                  <UpdateSpaceModel
                    atFinish={() => { } }
                    open={open}
                    setOpen={setOpen}
                    parentId={allocatedSpaceInfo.parentId}
                    id={allocatedSpaceInfo.id}
                    name={allocatedSpaceInfo.name}
                    latitude={newLatLong.latitude}
                    longitude={newLatLong.longitude}
                    setPopoverOpen={setPopoverOpen}
                    popoverOpen={popoverOpen}
                    setOpenUpdateModal={setOpenUpdateModal}
                    openUpdateModal={openUpdateModal}
                    setPopoverClose={setPopoverClose}
                    setSpaceDraggable={setSpaceDraggable} />
                )}
                {isSaveData && (
                  <SaveSpaceModalWindow
                    setIsSaveData={setIsSaveData}
                    catagories={catagories}
                    setCatagories={setCatagories}
                    isSaveData={isSaveData}
                    id={id}
                    setSpaceDraggable={setSpaceDraggable}
                    setPopoverOpen={setPopoverOpen}
                    popoverOpen={popoverOpen}
                    setIsUpdateData={setIsUpdateData}
                    isUpdateData={isUpdateData}
                    bulkCatagories={bulkCatagories}
                    setTooltipOpen={setTooltipOpen}
                    // popoverClose={popoverClose}
                    setPopoverClose={setPopoverClose}
                    setBulkCatagories={setBulkCatagories}
                    updateDrag={updateDrag}
                    setUpdateDrag={setUpdateDrag} />
                )}
              </div>
            </>
              <Modal isOpen={openSpaceModal} size="sm" className="removespace-popover">
                <ModalHeaderComponent closeModalWindow={cancelWindow} title="Remove a Space" response={updateSpace} />
                <ModalBody className="mt-0 pt-2">
                  {!(updateSpace && updateSpace.data) && !(updateSpace && updateSpace.err) && (
                    <span>Do you really want to remove the Space</span>
                  )}
                  {updateSpace && updateSpace.err && (
                    <h5 className="text-center text-danger" data-testid="error-case">
                      <FontAwesomeIcon size="lg" className="action-fa-button-lg" icon={faTimes} />
                      {' '}
                      {' '}
                      Space update failed.
                    </h5>
                  )}
                  {!(updateSpace && updateSpace.data) && !(updateSpace && updateSpace.err) && (
                    <div className={`${classes.wrapper} float-right`}>
                      <Button
                      variant="contained"
                        onClick={cancelWindow}
                        className={`${classes.button} roundCorners button-cancel`}
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        variant="contained"
                        onClick={() => removeLatAndLongSpace()}
                        className={`${classes.button} update-btn roundCorners btn-removeButton`}
                      >
                        {updateSpace && updateSpace.loading && (
                          <Spinner size="sm" color="light" className="mr-2" />
                        )}
                        Remove
                      </Button>
                    </div>
                  )}
                  {updateSpace && updateSpace.data && (
                    // eslint-disable-next-line react/jsx-no-comment-textnodes
                    <h5 className="text-center text-success font-size-0875rem " data-testid="success-case">
                      <FontAwesomeIcon size="lg" className="action-fa-button-lg" icon={faCheck} />
                      {' '}
                      {' '}
                      Space Removed successfully.
                    </h5>
                  )}
                  {updateSpace && (updateSpace.data || updateSpace.err) && (
                    <Button variant="contained" onClick={() => { confirmButton(); }} className={`${classes.button} float-right roundCorners ok-btn mt-0`}>
                      Ok
                    </Button>
                  )}
                </ModalBody>
              </Modal>
            </>
          )}
        </svg>
      </Tooltip>
    </Draggable>
  );
};

AllocatedSpaces.propTypes = {
  allocatedSpaceInfo: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.number,
    PropTypes.bool,
    PropTypes.string,
  ]).isRequired,
  id: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string,
    PropTypes.bool,
  ]),
  cx: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string,
  ]).isRequired,
  cy: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string,
  ]).isRequired,
  spaceIndex: PropTypes.string.isRequired,
  newLatLong: PropTypes.shape({
    latitude: PropTypes.oneOfType([
      PropTypes.number,
      PropTypes.string,
    ]),
    longitude: PropTypes.oneOfType([
      PropTypes.number,
      PropTypes.string,
    ]),
  }),
  xAxis: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string,
  ]).isRequired,
  yAxis: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string,
  ]).isRequired,
  iconHeight: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string,
  ]).isRequired,
  iconWidth: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string,
  ]).isRequired,
  setNewLatLong: PropTypes.func,
  popoverClose: PropTypes.bool.isRequired,
  setPopoverClose: PropTypes.func.isRequired,
  getdraggable: PropTypes.func.isRequired,
  setResetElement: PropTypes.func.isRequired,
  setResetTrue: PropTypes.func.isRequired,
  setSpaceDraggable: PropTypes.func,
  newDraggableSpace: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.bool,
  ]),
  setNewDraggableSpace: PropTypes.func,
  spaceDraggable: PropTypes.bool,
  newBulkDraggableSpace: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.bool,
  ]),
  spaceCategories: PropTypes.arrayOf(
    PropTypes.shape({}),
  ),
  setNewBulkDraggableSpace: PropTypes.func,
  updateDrag: PropTypes.bool,
  resetTrue: PropTypes.bool,
  setUpdateDrag: PropTypes.func,
  removeCategoryData: PropTypes.func.isRequired,
};

AllocatedSpaces.defaultProps = {
  newLatLong: null,
  id: undefined,
  updateDrag: false,
  resetTrue: false,
  spaceCategories: [],
  setUpdateDrag: () => { },
  setSpaceDraggable: () => { },
  setNewLatLong: () => { },
  newDraggableSpace: {},
  setNewDraggableSpace: () => { },
  spaceDraggable: false,
  newBulkDraggableSpace: {},
  setNewBulkDraggableSpace: () => { },
};

export default AllocatedSpaces;
