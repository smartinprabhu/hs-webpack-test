/* eslint-disable react/no-array-index-key */
/* eslint-disable no-unused-expressions */
/* eslint-disable camelcase */
/* eslint-disable import/no-unresolved */
import React, { useState, useEffect } from 'react';
import {
  Card, Col, Row, UncontrolledTooltip,
  Modal,
  ModalBody,
} from 'reactstrap';
import Button from '@mui/material/Button';
import ReactDOM from 'react-dom';
import { useDispatch, useSelector } from 'react-redux';
import * as PropTypes from 'prop-types';
import {
  Drawer,
  Skeleton,
} from 'antd';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';

import resetIcon from '@images/icons/reset.png';
import plusIcon from '@images/plusIcon.png';
import minusIcon from '@images/minusIcon.png';
import assetIcon from '@images/icons/assetDefault.svg';
import ticketBlackIcon from '@images/icons/ticketBlack.svg';

import ModalHeaderComponent from '@shared/modalHeaderComponent';
import DrawerHeader from '@shared/drawerHeader';
import ErrorContent from '@shared/errorContent';
import ModalFormAlert from '@shared/modalFormAlert';

import {
  resetFloorMapEquipments,
  getCategoryDetail,
  setCurrentThreshold,
  resetAssetDetails,
  getAssetDetail, resetUpdateEquipment, getSpaceEquipments,
} from '../equipmentService';
import {
  newBulkDraggableSpaceData, isbulkUpdateData, isdragSpaceUpdate,
} from '../../spaceManagement/spaceService';
import {
  extractTextObject,
  getListOfOperations, getAllCompanies,
  detectMob,
  translateText,
} from '../../util/appUtils';
import '../../spaceManagement/space.scss';
import AssetDetails from '../assetDetails/assetsDetail';
import actionCodes from '../data/assetActionCodes.json';

import {
  resetAddTicket,
} from '../../helpdesk/ticketService';
import AddTicket from '../../helpdesk/addTicket';
import AllocatedSpaces from './allocatedSpaces';
import AssetsDetailUpdate from '../assetDetails/assetUpdate/assetsDetailUpdate';

const appModels = require('../../util/appModels').default;

const MapControl = React.memo((props) => {
  const dispatch = useDispatch();
  const {
    collapse, isEquipmentsView, category, currentEquipmentId,
    assetData, spaceDraggable, setSpaceDraggable, spaceId,
    reload,
    setReload, isAddData, setIsAddData, setAssetData, setIsRemoveData, isRemoveData,
    isSchool, eqData,
  } = props;
  const [currentTool, setCurrentTool] = useState(false);

  const [isEquipmentDetails, setEquipmentDetails] = useState(false);
  const [assetId, setAssetId] = useState(false);
  const [assetName, setAssetName] = useState(false);
  const [ticketModal, showTicketModal] = useState(false);

  const [isEdit, setEdit] = useState(false);
  const [closeUpdate, setCloseUpdate] = useState(false);

  const [floorMapEquipments, setFloorMapEquipments] = useState([]);
  const [spaceDraggability, setSpaceDraggability] = useState(false);

  const [newLatLong, setNewLatLong] = useState(null);
  const [popoverClose, setPopoverClose] = useState(false);
  const [newDraggableSpace, setNewDraggableSpace] = useState({});
  const [updateDrag, setUpdateDrag] = useState(false);
  const [result, setResult] = useState('');
  const [panning, setPanning] = useState(true);
  const sortBy = 'DESC';
  const sortField = 'create_date';

  const { userInfo, userRoles } = useSelector((state) => state.user);
  const {
    getSpaceInfo,
    equipmentsDetails,
    updateEquipment, spaceEquipments,
  } = useSelector((state) => state.equipment);
  const companies = getAllCompanies(userInfo, userRoles);
  const isMob = detectMob();

  const idcss = isMob ? 'containerImageSchoolMobSpace' : 'containerImageSchoolSpace';

  const {
    isUpdateSpaces, isDiscard,
  } = useSelector((state) => state.space);

  const {
    addTicketInfo,
  } = useSelector((state) => state.ticket);

  const allowedOperations = getListOfOperations(userRoles && userRoles.data ? userRoles.data.allowed_modules : [], 'code');

  const [newBulkDraggavleSpace, setNewBulkDraggavleSpace] = useState([]);

  const fileLink = getSpaceInfo && getSpaceInfo.data && getSpaceInfo.data.length && getSpaceInfo.data[0].file_path ? getSpaceInfo.data[0].file_path : false;
  const loading = (getSpaceInfo && getSpaceInfo.loading && spaceEquipments && spaceEquipments.loading);
  const isError = getSpaceInfo && getSpaceInfo.err;
  const spaceType = getSpaceInfo && getSpaceInfo.data && getSpaceInfo.data.length && getSpaceInfo.data[0].asset_category_id ? extractTextObject(getSpaceInfo.data[0].asset_category_id) : false;

  const getdraggable = () => {
    const svg = document.querySelector('#svg-drag');
    const elements = svg && svg.querySelectorAll('.floorMapIcons');
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
      if (evt.target.classList.contains('floorMapIcons')) {
        if (evt.target.id !== '' && evt.target.id !== 'new' && offset) {
          const index = floorMapEquipments.findIndex(
            (obj) => (obj.id.toString() !== evt.target.id.toString()),
          );
          const indexValue = evt.target.id.split(/(\d+)/);
          if (index !== -1) {
            selectedElement.setAttributeNS(null, 'asset_name', floorMapEquipments[indexValue[1]].name);
            selectedElement.setAttributeNS(null, 'asset_id', floorMapEquipments[indexValue[1]].id);
            selectedElement.setAttributeNS(null, 'location', extractTextObject(floorMapEquipments[indexValue[1]].location_id));
            selectedElement.setAttributeNS(null, 'asset_number', floorMapEquipments[indexValue[1]].equipment_seq);
            selectedElement.setAttributeNS(null, 'actual_longitude', floorMapEquipments[indexValue[1]].xpos);
            selectedElement.setAttributeNS(null, 'actual_latitude', floorMapEquipments[indexValue[1]].ypos);
          } else {
            floorMapEquipments.push({
              id: evt.target.id,
              name,
              xpos: coord.x - offset.x,
              ypos: coord.y - offset.y,
            });
          }
        }
      }
      selectedElement = null;
      setSpaceDraggability(false);
    }

    function getUpdate(evt) {
      evt.preventDefault();
      if (evt.target.classList.contains('floorMapIcons')) {
        const dId = evt.target.id;
        const long = parseFloat(evt.target.getAttributeNS(null, 'x'));
        const lat = parseFloat(evt.target.getAttributeNS(null, 'y'));
        const aname = evt.target.getAttributeNS(null, 'asset_name');
        const aId = evt.target.getAttributeNS(null, 'asset_id');
        const lId = evt.target.getAttributeNS(null, 'location');
        const assetNo = evt.target.getAttributeNS(null, 'asset_number');
        const act_long = parseFloat(evt.target.getAttributeNS(null, 'actual_longitude'));
        const act_lat = parseFloat(evt.target.getAttributeNS(null, 'actual_latitude'));
        setNewLatLong({
          asset_id: aId, id: dId, xpos: long, ypos: lat, asset_name: aname, location: lId, asset_number: assetNo, actual_longitude: act_long, actual_latitude: act_lat,
        });
        setSpaceDraggability(true);
      }
    }

    // add event listeners
    if (!spaceDraggable) {
      setNewLatLong(null);
      setSpaceDraggability(false);
      if (!isRemoveData) {
        elements && elements.forEach((el) => {
          const newElement = el.cloneNode(true);
          el.parentNode.replaceChild(newElement, el);
        });
      }
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
    if (isAddData) {
      setSpaceDraggable(true);
      setIsAddData(false);
    }
  }, [isAddData]);

  useEffect(() => {
    if (!spaceDraggable && newDraggableSpace && newDraggableSpace.render) {
      setNewDraggableSpace({});
    }
  }, [spaceDraggable, newDraggableSpace]);

  useEffect(() => {
    if (assetData && assetData.length && !spaceDraggable && !isAddData) {
      setPopoverClose(true);
      getdraggable();
    }
  }, [spaceDraggable]);

  useEffect(() => {
    if (assetData && assetData.length && !spaceDraggable && isRemoveData) {
      setPopoverClose(true);
      getdraggable();
      setIsRemoveData(false);
    }
  }, [spaceDraggable]);

  useEffect(() => {
    if (reload) {
      if (getSpaceInfo
        && getSpaceInfo.data
        && assetData && assetData.length) {
        setSpaceDraggable(false);
        dispatch(getSpaceEquipments(companies, spaceId, category, appModels.EQUIPMENT, sortBy, sortField, isSchool));
        setNewDraggableSpace({});
        setIsAddData(true);
      }
      setReload(false);
    }
  }, [getSpaceInfo, assetData, reload]);

  useEffect(() => {
    if (assetData && assetData.length && spaceDraggable) {
      getdraggable();
    }
  }, [spaceDraggable]);

  useEffect(() => {
    if (assetData && assetData.length && closeUpdate) {
      getdraggable();
      setCloseUpdate(false);
    }
  }, [assetData]);

  useEffect(() => {
    if (isUpdateSpaces) {
      if (spaceDraggability && newLatLong !== null) {
        const array = newBulkDraggavleSpace;
        if (newBulkDraggavleSpace && newBulkDraggavleSpace.length) {
          const bulkindex = newBulkDraggavleSpace.findIndex((sId) => sId.id === newLatLong.id);
          if (bulkindex !== -1) {
            array[bulkindex] = newLatLong;
            setNewBulkDraggavleSpace(array);
          } else {
            array.push(newLatLong);
            setNewBulkDraggavleSpace(array);
          }
        } else {
          array.push(newLatLong);
          setNewBulkDraggavleSpace(array);
        }
      }
      dispatch(newBulkDraggableSpaceData(newBulkDraggavleSpace));
    }
  }, [spaceDraggability, newLatLong, isUpdateSpaces]);

  useEffect(() => {
    if (isUpdateSpaces) {
      dispatch(isbulkUpdateData(false));
    }
  }, [isUpdateSpaces]);

  useEffect(() => {
    if (isDiscard) {
      setNewBulkDraggavleSpace([]);
    }
  }, [isDiscard]);

  useEffect(() => {
    if (assetData && assetData.length) {
      setFloorMapEquipments(assetData);
    } else {
      setFloorMapEquipments([]);
    }
  }, [assetData]);

  const onViewChange = (data) => {
    setEquipmentDetails(true);
    setAssetId(data.id);
    setAssetName(data.name);
  };

  useEffect(() => {
    if (getSpaceInfo && getSpaceInfo.data && getSpaceInfo.data.length > 0
      && getSpaceInfo && !getSpaceInfo.loading) {
      if (getSpaceInfo.data[0].file_path
        && getSpaceInfo.data[0].file_path !== '') {
        const filepath = getSpaceInfo.data[0].file_path.includes('https')
          ? getSpaceInfo.data[0].file_path
          : `${window.localStorage.getItem('api-url')}${`${getSpaceInfo.data[0].file_path.replace('+xml', '')}`}`;
        setResult(
          <Col lg="12" sm="12" md="12" onDoubleClick={() => setPanning(false)}>
            <TransformWrapper
              centerOnInit
              onZoomStart={() => setPanning(true)}
              panning={{ disabled: panning }}
            >
              {({
                zoomIn, zoomOut, resetTransform,
              }) => (
                <>
                  <div className="zommcontrols floormap-zoom">
                    <div>
                      <img
                        src={plusIcon}
                        className="outline-none cursor-pointer mb-2"
                        onClick={() => { setCurrentTool(false); zoomIn(); setPanning(false); }}
                        id="zoomin"
                        alt="zoomIn"
                        aria-hidden="true"
                      />
                      <UncontrolledTooltip placement="right" target="zoomin">
                        {translateText('Zoom In', userInfo)}
                      </UncontrolledTooltip>
                    </div>
                    <div>
                      <img
                        src={minusIcon}
                        className="outline-none cursor-pointer mb-2"
                        id="zoomout"
                        onClick={() => { setCurrentTool(false); zoomOut(); setPanning(false); }}
                        alt="zoomOut"
                        aria-hidden="true"
                      />
                      <UncontrolledTooltip
                        placement="right"
                        target="zoomout"
                      >
                        {translateText('Zoom Out', userInfo)}
                      </UncontrolledTooltip>
                    </div>
                    <div>
                      {isSchool && (
                      <img
                        src={resetIcon}
                        className="outline-none cursor-pointer"
                        id="reset"
                        onClick={() => {
                          dispatch(resetAssetDetails());
                          dispatch(setCurrentThreshold([]));
                          setCurrentTool(false);
                          resetTransform();
                          setPanning(true);
                        }}
                        alt="reset"
                        aria-hidden="true"
                      />
                      )}
                      {!isSchool && (
                      <img
                        src={resetIcon}
                        className="outline-none cursor-pointer"
                        id="reset"
                        onClick={() => {
                          setCurrentTool(false);
                          resetTransform();
                          setPanning(true);
                        }}
                        alt="reset"
                        aria-hidden="true"
                      />
                      )}
                      <UncontrolledTooltip placement="right" target="reset">
                        {translateText('Reset', userInfo)}
                      </UncontrolledTooltip>
                    </div>
                  </div>
                  <TransformComponent>
                    <div className="p-1 thin-scrollbar" id={isSchool ? idcss : 'containerImageSpace'}>
                      <div
                        id="contBox"
                        className="svgContainer"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 840 606"
                          className="injected-svg"
                          id="svg-drag"
                        >
                          <image href={filepath} height="100%" width="100%" />
                          {!loading && floorMapEquipments && floorMapEquipments.length > 0 && floorMapEquipments.map((fm, i) => (
                            <AllocatedSpaces
                              id={currentEquipmentId}
                              key={fm.id}
                              spaceIndex={`space${i}`}
                              cx={fm.xpos}
                              allocatedSpaceInfo={fm}
                              cy={fm.ypos}
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
                              currentTool={currentTool}
                              setCurrentTool={setCurrentTool}
                              onViewChange={onViewChange}
                              setAssetData={setAssetData}
                              isAddData={isAddData}
                              assetData={assetData}
                              setIsAddData={setIsAddData}
                              isSchool={isSchool}
                              eqData={eqData}
                            />
                          ))}
                        </svg>
                      </div>
                    </div>
                  </TransformComponent>
                </>
              )}
            </TransformWrapper>
          </Col>,
        );
      }
    }
  }, [getSpaceInfo, floorMapEquipments, category, newLatLong, spaceDraggable, panning, popoverClose, currentTool, closeUpdate]);

  useEffect(() => {
    if (category) {
      dispatch(getCategoryDetail(category, appModels.EQUIPMENTCATEGORY));
    }
  }, [category]);

  useEffect(() => {
    if (updateEquipment && updateEquipment.data) {
      setAssetData([]);
      dispatch(getSpaceEquipments(companies, spaceId, category, appModels.EQUIPMENT, sortBy, sortField, isSchool));
      ReactDOM.unmountComponentAtNode(document.getElementById('svg-drag'));
    }
  }, [updateEquipment]);

  useEffect(() => {
    if (currentEquipmentId) {
      setCurrentTool(currentEquipmentId);
    }
  }, [currentEquipmentId]);

  useEffect(() => {
    if (!isEquipmentsView) {
      dispatch(resetFloorMapEquipments());
      setCurrentTool(false);
      setEquipmentDetails(false);
      setAssetId(false);
      setAssetName(false);
      setFloorMapEquipments([]);
    }
  }, [isEquipmentsView]);

  useEffect(() => {
    if (assetId) {
      dispatch(getAssetDetail(assetId, appModels.EQUIPMENT, false));
    }
  }, [assetId]);

  const onViewReset = () => {
    setEquipmentDetails(false);
    setAssetId(false);
    setAssetName(false);
  };

  const restTicket = () => {
    showTicketModal(false);
    setTimeout(() => {
      dispatch(resetAddTicket());
    }, 1000);
  };

  const onCloseUpdate = () => {
    setEdit(false);
    dispatch(resetUpdateEquipment());
    setNewDraggableSpace({});
    // dispatch(getSpaceEquipments(companies, spaceId, category, appModels.EQUIPMENT, sortBy, sortField));
    setCloseUpdate(true);
  };

  let errorText = <div />;
  if (!loading && isError && spaceType && spaceType === 'Floor') {
    errorText = '';
  } else if (!loading && (!spaceType || (spaceType && spaceType !== 'Floor'))) {
    errorText = (
      <ErrorContent errorTxt="PLEASE SELECT ANY FLOOR" />
    );
  } else if (!loading && spaceType && spaceType === 'Floor' && !fileLink) {
    errorText = (
      <ErrorContent errorTxt="FLOOR MAP NOT AVAILABLE" />
    );
  }

  return (
    <Card className={collapse ? 'filter-margin-right h-100 border-0' : 'h-100 border-0'}>
      <Row>
        <Col sm="12" md="12" lg="12" xs="12" className="pr-3 pl-3">
          {result}
          <Drawer
            title=""
            closable={false}
            className="drawer-bg-lightblue"
            width={1250}
            visible={isEquipmentDetails}
          >
            <DrawerHeader
              title={assetName}
              imagePath={false}
              isEditable={(allowedOperations.includes(actionCodes['Edit Asset']))}
              closeDrawer={() => onViewReset()}
              onEdit={() => { setEdit(!isEdit); }}
            />
            <AssetDetails isEdit={false} afterUpdate={false} setEquipmentDetails={setEquipmentDetails} isEquipmentDetails={isEquipmentDetails} />
          </Drawer>
          {errorText}
          {loading && (
          <div className="mt-2 p-2">
            <Skeleton
              active
              size="large"
              paragraph={{
                rows: 10,
              }}
            />
          </div>
          )}
          {(getSpaceInfo && getSpaceInfo.err) && (
          <ErrorContent errorTxt={getSpaceInfo.err} />
          )}
        </Col>
        <Modal size={addTicketInfo && addTicketInfo.data ? 'sm' : 'xl'} className="border-radius-50px modal-dialog-centered" isOpen={ticketModal}>
          <ModalHeaderComponent title="Raise a Ticket" imagePath={ticketBlackIcon} closeModalWindow={() => restTicket()} response={addTicketInfo} />
          <ModalBody className="mt-0 pt-0">
            {addTicketInfo && !addTicketInfo.loading && !addTicketInfo.data && (
            <AddTicket isModal equipmentsDetails={equipmentsDetails && equipmentsDetails.data ? equipmentsDetails.data[0] : false} />
            )}
            <ModalFormAlert alertResponse={addTicketInfo} alertText="The ticket has been created successfully." />
            {addTicketInfo && addTicketInfo.data && (<hr />)}
            <div className="float-right">
              {addTicketInfo && addTicketInfo.data && (
              <Button
                size="sm"
                type="button"
                 variant="contained"
                onClick={() => restTicket()}
                disabled={addTicketInfo && addTicketInfo.loading}
              >
                OK
              </Button>
              )}
            </div>
          </ModalBody>
        </Modal>
        <Modal size={(updateEquipment && updateEquipment.data) ? 'sm' : 'xl'} className="border-radius-50px modal-dialog-centered" isOpen={isEdit}>
          <ModalHeaderComponent title="Edit Asset" imagePath={assetIcon} closeModalWindow={onCloseUpdate} response={updateEquipment} />
          <ModalBody className="mt-0 pt-0">
            <AssetsDetailUpdate />
            <div className="float-right mr-4">
              {' '}
              {(updateEquipment && updateEquipment.data) && (
              <Button  variant="contained" size="sm" onClick={() => onCloseUpdate()}>OK</Button>
              )}
            </div>
          </ModalBody>
        </Modal>
      </Row>
    </Card>
  );
});

MapControl.propTypes = {
  collapse: PropTypes.bool,
  isEquipmentsView: PropTypes.oneOfType([
    PropTypes.bool,
  ]).isRequired,
  category: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.bool,
  ]).isRequired,
  currentEquipmentId: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.bool,
  ]).isRequired,
  assetData: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.bool,
  ]).isRequired,
  spaceDraggable: PropTypes.bool,
  setSpaceDraggable: PropTypes.func,
  reload: PropTypes.bool,
  isAddData: PropTypes.bool,
  spaceId: PropTypes.string,
  setReload: PropTypes.func.isRequired,
  setIsAddData: PropTypes.func.isRequired,
  setIsRemoveData: PropTypes.func,
  isRemoveData: PropTypes.bool,
  setAssetData: PropTypes.func,
  isSchool: PropTypes.bool,
  eqData: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.bool,
  ]),
};
MapControl.defaultProps = {
  collapse: false,
  reload: false,
  isAddData: false,
  isRemoveData: false,
  spaceDraggable: false,
  spaceId: false,
  isSchool: false,
  eqData: false,
  setSpaceDraggable: () => { },
  setAssetData: () => { },
  setIsRemoveData: () => { },
};

export default MapControl;
