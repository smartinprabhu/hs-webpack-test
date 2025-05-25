/* eslint-disable no-console */
/* eslint-disable radix */
/* eslint-disable array-callback-return */
/* eslint-disable import/no-unresolved */
import React, { useState, useEffect } from 'react';
import {
  Button,
  Col,
  PopoverBody,
  Row,
  Popover,
} from 'reactstrap';
import { useSelector, useDispatch } from 'react-redux';
import * as PropTypes from 'prop-types';
import Draggable from 'react-draggable';
import {
  Tooltip,
} from 'antd';

import close from '@images/icons/closeCircle.svg';
import collapseIcon1 from '@images/chair_pin.png';
import collapseIcon2 from '@images/Green-Dot-Icon.svg';
import {
  extractTextObject, extractNameObject, detectMob, translateText,
} from '../../util/appUtils';
import {
  getAssetDetail,
} from '../equipmentService';
import {
  newBulkDraggableSpaceData, setDiscard, isbulkUpdateData, isdragSpaceUpdate, isOpenPopoverWindow,
} from '../../spaceManagement/spaceService';

const appModels = require('../../util/appModels').default;

const AllocatedSpaces = (props) => {
  const dispatch = useDispatch();
  const isMob = detectMob();
  const {
    spaceIndex, cx, cy, allocatedSpaceInfo, popoverClose, setPopoverClose, getdraggable, onViewChange,
    setNewLatLong, newDraggableSpace, setNewDraggableSpace, setNewBulkDraggavleSpace, updateDrag, setUpdateDrag,
    currentTool, setCurrentTool, setAssetData, assetData, setSpaceDraggable, spaceDraggable, setIsAddData, isSchool, eqData,
  } = props;
  const {
    bulkDraggableSpaces, isDiscard, updateDragSpaces, popoverSpace,
  } = useSelector((state) => state.space);
  const { equipmentCategoryInfo, equipmentsDetails } = useSelector((state) => state.equipment);

  const { userInfo } = useSelector((state) => state.user);

  const collapseIcon = isSchool ? collapseIcon2 : collapseIcon1;

  const ceid = equipmentsDetails && equipmentsDetails.data && equipmentsDetails.data.length ? equipmentsDetails.data[0].id : false;

  const [popoverOpen, setPopoverOpen] = useState(false);
  const [target, setTarget] = useState(false);
  const [onClickUpdate, setOnClickUpdate] = useState(false);
  const [categoryImage, setCategoryImage] = useState(false);
  const [reloadImage, setReloadImage] = useState(false);

  const openPopover = () => {
    const obj = {
      previous: {
        name: newDraggableSpace && newDraggableSpace.current && newDraggableSpace.current.name,
        index: newDraggableSpace && newDraggableSpace.current && newDraggableSpace.current.index,
      },
      current: {
        name: allocatedSpaceInfo.name,
        index: spaceIndex,
      },
      render: true,
    };
    setNewDraggableSpace(obj);
    setPopoverClose(true);
    setPopoverOpen(true);
    setCurrentTool(false);
  };

  const openSchoolPopover = () => {
    const obj = {
      previous: {
        name: newDraggableSpace && newDraggableSpace.current && newDraggableSpace.current.name,
        index: newDraggableSpace && newDraggableSpace.current && newDraggableSpace.current.index,
      },
      current: {
        name: allocatedSpaceInfo.name,
        index: spaceIndex,
      },
      render: true,
    };
    setNewDraggableSpace(obj);
    setPopoverClose(true);
    setCurrentTool(false);
    dispatch(getAssetDetail(allocatedSpaceInfo.id, appModels.EQUIPMENT, 'school'));
  };

  useEffect(() => {
    if (equipmentCategoryInfo && equipmentCategoryInfo.data && equipmentCategoryInfo.data.length) {
      setCategoryImage(equipmentCategoryInfo.data[0].image_medium);
    } else {
      setCategoryImage(false);
    }
  }, [equipmentCategoryInfo]);

  useEffect(() => {
    if (reloadImage) {
      getdraggable();
      setReloadImage(false);
    }
  }, [reloadImage]);

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
    if (newDraggableSpace && newDraggableSpace.render && newDraggableSpace.previous && newDraggableSpace.previous.name && newDraggableSpace.current && newDraggableSpace.current.name
      && newDraggableSpace.current.index !== newDraggableSpace.previous.index) {
      let spaces = [];
      if (bulkDraggableSpaces && bulkDraggableSpaces.length) {
        spaces = bulkDraggableSpaces.filter((obj) => obj.id === newDraggableSpace.previous.index);
      }
      const asset = assetData && assetData.filter(
        (spaceEquipment) => spaceEquipment.name === newDraggableSpace.previous.name,
      );

      if ((asset && asset.length) && !(spaces && spaces.length)) {
        const oldElement = document.getElementById(newDraggableSpace.previous.index);
        oldElement.setAttribute('x', parseFloat(asset[0].xpos));
        oldElement.setAttribute('y', parseFloat(asset[0].ypos));
        const newElement = oldElement.cloneNode(true);
        oldElement.parentNode.replaceChild(newElement, oldElement);
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
    setCurrentTool(false);
  };

  useEffect(() => {
    if (popoverOpen) {
      setTarget(spaceIndex);
    } else {
      setTarget(false);
    }
  }, [popoverOpen]);

  const relocateValues = () => {
    const asset = assetData && assetData.filter(
      (spaceEquipment) => spaceEquipment.id === allocatedSpaceInfo.id,
    );
    if (asset && asset.length) {
      const oldElement = document.getElementById(spaceIndex);
      oldElement.setAttribute('x', parseFloat(asset[0].xpos));
      oldElement.setAttribute('y', parseFloat(asset[0].ypos));
      if (allocatedSpaceInfo.type && allocatedSpaceInfo.type !== 'add') {
        const newElement = oldElement.cloneNode(true);
        oldElement.parentNode.replaceChild(newElement, oldElement);
        getdraggable();
      }
    }
    setPopoverOpen(false);
    setPopoverClose(false);
    setOnClickUpdate(false);
    setUpdateDrag(false);
  };

  const removeValues = (eqid) => {
    setPopoverOpen(false);
    setSpaceDraggable(false);
    const eData = assetData;
    if (eqid && eqid > 0) {
      const index = eData.findIndex((obj) => (
        obj.id.toString() === eqid.toString()));
      if (index !== -1) {
        eData[index].xpos = '';
        eData[index].ypos = '';
        delete eData[index].type;
      }
      setAssetData(eData);
      setIsAddData(true);
    }
  };

  const discardData = () => {
    if (bulkDraggableSpaces && bulkDraggableSpaces.length) {
      bulkDraggableSpaces.map((asset) => {
        if (parseInt(asset.asset_id) === parseInt(allocatedSpaceInfo.id)) {
          if (allocatedSpaceInfo.type && allocatedSpaceInfo.type === 'add') {
            removeValues(asset.asset_id);
          } else {
            const oldElement = document.getElementById(spaceIndex);
            oldElement.setAttribute('x', parseFloat(asset.actual_longitude));
            oldElement.setAttribute('y', parseFloat(asset.actual_latitude));
            const newElement = oldElement.cloneNode(true);
            oldElement.parentNode.replaceChild(newElement, oldElement);
            getdraggable();
          }
        }
      });
      setUpdateDrag(false);
    }
    setPopoverOpen(false);
    setPopoverClose(false);
    setNewBulkDraggavleSpace([]);
    setOnClickUpdate(false);
    dispatch(newBulkDraggableSpaceData([]));
    setNewLatLong(null);
    dispatch(setDiscard(false));
  };

  const isAddedToUpdate = (equid) => {
    let isAdd = false;
    if (bulkDraggableSpaces && bulkDraggableSpaces.length) {
      bulkDraggableSpaces.map((asset) => {
        if (parseInt(asset.asset_id) === parseInt(equid)) {
          isAdd = true;
        }
      });
    }
    return isAdd;
  };

  useEffect(() => {
    if (isDiscard) {
      discardData();
    }
  }, [isDiscard, bulkDraggableSpaces]);

  useEffect(() => {
    if (popoverOpen) {
      setPopoverClose(true);
    }
  });

  const onUpdate = () => {
    setPopoverOpen(false);
    setOnClickUpdate(Math.random());
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

  const renderTooltip = () => (
    <>
      { /* <span className="font-size-13">
        {translateText('Sensor', userInfo)}
        {' '}
        :
        {' '}
        {allocatedSpaceInfo.name}
        {' '}
        (
        {allocatedSpaceInfo.equipment_seq}
        )
      </span>
        <br /> */}
      <span className="font-size-13">
        Sensor Location
        {' '}
        :
        {' '}
        {isSchool ? extractNameObject(allocatedSpaceInfo.location_id, 'space_name') : extractTextObject(allocatedSpaceInfo.location_id)}
      </span>
    </>
  );

  return (
    <Draggable
      onDrag={closePopoverOnDrag}
      onStop={openPopover}
    >
      <svg
        className="svgPopover"
        xmlns="http://www.w3.org/2000/svg"
        onMouseOver={() => { setCurrentTool(allocatedSpaceInfo.id); }}
        onMouseLeave={() => setCurrentTool(false)}
      >
        {allocatedSpaceInfo
          && cx !== 0
          && cy !== 0
          && cx !== false
          && cy !== false
          && cx !== ''
          && cy !== ''
          && (
          <>
            {isSchool && !isMob && (
            <Tooltip
              title={renderTooltip()}
              // visible={allocatedSpaceInfo.id === currentTool && !popoverOpen}
              placement="top"
              // zIndex="3"
              // overlayStyle={{ maxWidth: '500px' }}
              key={allocatedSpaceInfo.id}
            >

              <image
                id={spaceIndex}
                className={`svg-image-draggable floorMapIcons ${allocatedSpaceInfo.id === ceid && isSchool ? 'blink-image' : 'cursor-pointer'}`}
                xlinkHref={categoryImage ? `data:image/png;base64,${categoryImage}` : collapseIcon}
                x={cx}
                y={cy}
                height="50"
                width="50"
                onClick={openSchoolPopover}
              />

            </Tooltip>
            )}
            {isSchool && isMob && (
            <Tooltip
              title={renderTooltip()}
              // visible={allocatedSpaceInfo.id === currentTool && !popoverOpen}
              placement="top"
              // zIndex="3"
              // overlayStyle={{ maxWidth: '500px' }}
              key={allocatedSpaceInfo.id}
            >
              <image
                id={spaceIndex}
                className={`svg-image-draggable floorMapIcons ${allocatedSpaceInfo.id === ceid && isSchool ? 'blink-image' : 'cursor-pointer'}`}
                xlinkHref={categoryImage ? `data:image/png;base64,${categoryImage}` : collapseIcon}
                x={cx}
                y={cy}
                height="50"
                width="50"
                onTouchStart={openSchoolPopover}
              />
            </Tooltip>
            )}
            {!isSchool && (
            <Tooltip
              title={renderTooltip()}
              visible={allocatedSpaceInfo.id === currentTool && !popoverOpen}
              placement="top"
              zIndex="3"
              overlayStyle={{ maxWidth: '500px' }}
              key={allocatedSpaceInfo.id}
            >
              <image
                id={spaceIndex}
                className={`svg-image-draggable floorMapIcons ${allocatedSpaceInfo.id === ceid && isSchool ? 'blink-image' : ''}`}
                xlinkHref={categoryImage ? `data:image/png;base64,${categoryImage}` : collapseIcon}
                x={cx}
                y={cy}
                height="50"
                width="50"
                onClick={openPopover}
              />
            </Tooltip>
            )}
            <div className="details">
              {target && spaceDraggable && newDraggableSpace && newDraggableSpace.current && newDraggableSpace.current.index && newDraggableSpace.current.index === target && (
              <Popover trigger="legacy" placement="right" isOpen={popoverOpen} target={spaceIndex}>
                <PopoverBody className="bg-lightblue">
                  <div>
                    <h6 className="font-size-0875rem">
                      <img
                        src={categoryImage ? `data:image/png;base64,${categoryImage}` : collapseIcon}
                        height="35"
                        width="35"
                        className="mr-2"
                        alt="assetImage"
                      />
                      {allocatedSpaceInfo.name}
                      {'( '}
                      {' '}
                      {allocatedSpaceInfo.equipment_seq}
                      {' '}
                      {') '}
                      {allocatedSpaceInfo && allocatedSpaceInfo.type && allocatedSpaceInfo.type === 'add'
                        ? '' : (
                          <img
                            src={close}
                            aria-hidden
                            className="float-right cursor-pointer"
                            height="15"
                            width="15"
                            onClick={() => { relocateValues(); closePopoverOnDrag(); }}
                            alt="close"
                          />
                        )}
                    </h6>
                    <h6 className="font-size-0875rem">
                      Category:
                      <small className="light-text">
                        {' '}
                        {extractTextObject(allocatedSpaceInfo.category_id)}
                      </small>
                    </h6>
                    <h6 className="font-size-0875rem">
                      Location:
                      <small className="light-text">
                        {' '}
                        {extractTextObject(allocatedSpaceInfo.location_id)}
                      </small>
                    </h6>
                    <Row>
                      {updateDrag && (
                      <Col sm="12" md="12" lg="12" xs="12">
                        <Button
                          className="bg-white pb-1 pt-1 text-dark text-center w-100 mt-1 popover-button greyButton"
                          size="sm"
                          onClick={onUpdate}
                        >
                          Update Location
                        </Button>
                      </Col>
                      )}
                    </Row>
                    {allocatedSpaceInfo && allocatedSpaceInfo.type && allocatedSpaceInfo.type === 'add' && !isAddedToUpdate(allocatedSpaceInfo.id)
                      ? (
                        <Row>
                          <Col sm="12" md="12" lg="12" xs="12">
                            <Button
                              className="bg-white pb-1 pt-1 text-dark text-center w-100 mt-1 popover-button greyButton"
                              size="sm"
                              onClick={() => { removeValues(allocatedSpaceInfo.id); }}
                            >
                              Remove
                            </Button>
                          </Col>
                        </Row>
                      )
                      : (
                        updateDrag && (
                        <Row>
                          <Col sm="12" md="12" lg="12" xs="12">
                            <Button
                              className="bg-white pb-1 pt-1 text-dark text-center w-100 mt-1 popover-button greyButton"
                              size="sm"
                              onClick={relocateValues}
                            >
                              Reset
                            </Button>
                          </Col>
                        </Row>
                        )
                      )}
                    <Row>
                      <Col sm="12" md="12" lg="12" xs="12">
                        <Button
                          className="bg-white pb-1 pt-1 text-dark text-center w-100 mt-1 popover-button greyButton"
                          size="sm"
                          onClick={() => onViewChange(allocatedSpaceInfo)}
                        >
                          Asset Details
                        </Button>
                      </Col>
                    </Row>
                  </div>
                </PopoverBody>
              </Popover>
              )}
              {!spaceDraggable && !isSchool && (
              <Popover trigger="legacy" placement="right" isOpen={popoverOpen} target={spaceIndex}>
                <PopoverBody className="bg-lightblue">
                  <div>
                    <h6 className="font-size-0875rem">
                      <img
                        src={categoryImage ? `data:image/png;base64,${categoryImage}` : collapseIcon}
                        height="35"
                        width="35"
                        className="mr-2"
                        alt="assetImage"
                      />
                      {allocatedSpaceInfo.name}
                      {'( '}
                      {' '}
                      {allocatedSpaceInfo.equipment_seq}
                      {' '}
                      {') '}
                      <img
                        src={close}
                        aria-hidden
                        className="float-right cursor-pointer"
                        height="15"
                        width="15"
                        onClick={() => { closePopoverOnDrag(); }}
                        alt="close"
                      />
                    </h6>
                    <h6 className="font-size-0875rem">
                      Category:
                      <small className="light-text">
                        {' '}
                        {extractTextObject(allocatedSpaceInfo.category_id)}
                      </small>
                    </h6>
                    <h6 className="font-size-0875rem">
                      Location:
                      <small className="light-text">
                        {' '}
                        {extractTextObject(allocatedSpaceInfo.location_id)}
                      </small>
                    </h6>
                    <Row>
                      <Col sm="12" md="12" lg="12" xs="12">
                        <Button
                          className="bg-white pb-1 pt-1 text-dark text-center w-100 mt-1 popover-button greyButton"
                          size="sm"
                          onClick={() => { onViewChange(allocatedSpaceInfo); }}
                        >
                          Asset Details
                        </Button>
                      </Col>
                    </Row>
                  </div>
                </PopoverBody>
              </Popover>
              )}
            </div>
          </>
          )}
      </svg>
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
  setNewLatLong: PropTypes.func,
  popoverClose: PropTypes.bool.isRequired,
  setPopoverClose: PropTypes.func.isRequired,
  getdraggable: PropTypes.func.isRequired,
  newDraggableSpace: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.bool,
  ]),
  setNewDraggableSpace: PropTypes.func,
  assetData: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.bool,
  ]),
  setNewBulkDraggavleSpace: PropTypes.func,
  setAssetData: PropTypes.func,
  updateDrag: PropTypes.bool,
  currentTool: PropTypes.bool,
  setCurrentTool: PropTypes.func,
  setUpdateDrag: PropTypes.func,
  onViewChange: PropTypes.func.isRequired,
  setIsAddData: PropTypes.func.isRequired,
  setSpaceDraggable: PropTypes.func,
  spaceDraggable: PropTypes.bool,
  isSchool: PropTypes.bool,
  eqData: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.bool,
  ]),
};

AllocatedSpaces.defaultProps = {
  id: undefined,
  updateDrag: false,
  currentTool: false,
  setUpdateDrag: () => { },
  setNewLatLong: () => { },
  newDraggableSpace: {},
  assetData: {},
  spaceDraggable: false,
  setNewDraggableSpace: () => { },
  setNewBulkDraggavleSpace: () => { },
  setAssetData: () => { },
  setSpaceDraggable: () => { },
  setCurrentTool: () => { },
  isSchool: false,
  eqData: false,
};

export default AllocatedSpaces;
