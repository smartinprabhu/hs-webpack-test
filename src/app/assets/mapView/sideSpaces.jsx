/* eslint-disable no-nested-ternary */
/* eslint-disable import/no-unresolved */
import React, { useState, useEffect } from 'react';
import {
  Card,
  CardBody,
  CardTitle,
  Col,
  Row,
  Collapse,
  Spinner,
  UncontrolledTooltip,
} from 'reactstrap';
import Button from '@mui/material/Button';
import { useSelector, useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import TreeView from '@material-ui/lab/TreeView';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import TreeItem from '@material-ui/lab/TreeItem';
import {
  faArrowLeft, faInfoCircle,
  faAngleDown, faAngleRight,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Tooltip } from 'antd';
import Switch from '@material-ui/core/Switch';

import filterIcon from '@images/filter.png';
import plusCircleGrey from '@images/icons/plusCircleGrey.svg';
import collapseIcon from '@images/collapse.png';
import discard from '@images/icons/discard.svg';
import select from '@images/icons/select.svg';
import location from '@images/icons/location.png';
import Loader from '@shared/loading';
import ErrorContent from '@shared/errorContent';
import {
  getSpaceData,
  getAllSpaces,
  getBuildings, getSpaceAssetsGroups, getSpaceEquipments, resetSpaceData, resetSpaceEquipments,
} from '../equipmentService';
import {
  setDiscard, newBulkDraggableSpaceData,
} from '../../spaceManagement/spaceService';
import {
  generateErrorMessage, getAllCompanies, truncate, extractTextObject,
} from '../../util/appUtils';
import { addParents, addChildrens } from '../utils/utils';
import '../sidebar/selectedSapceView.scss';
import MapControl from './mapControl';
import SaveSpaceModalWindow from './saveModalWindow';
import { returnThemeColor } from '../../themes/theme';

const appModels = require('../../util/appModels').default;

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  root1: {
    '&:checked': {
      backGround: '#3a4354',
    },
  },
  label: {
    fontSize: '13px',
    borderTopRightRadius: theme.spacing(2),
    borderBottomRightRadius: theme.spacing(2),
  },
  selectedLabel: {
    height: '35px',
    fontSize: '13px',
    borderTopRightRadius: theme.spacing(2),
    borderBottomRightRadius: theme.spacing(2),
  },
  labelRoot: {
    display: 'flex',
    alignItems: 'center',
    height: 'inherit',
    padding: theme.spacing(1),
    // backgroundColor: '#fff',
  },
  selectedLabelRoot: {
    alignItems: 'center',
    padding: theme.spacing(1),
    backgroundColor: returnThemeColor(),
    color: 'white',
    borderLeft: '3px solid #979ca6',
    borderTopRightRadius: theme.spacing(2),
    borderBottomRightRadius: theme.spacing(2),
  },
  expanded: {
    display: 'block',
  },
  expandedHide: {
    display: 'none',
  },
  statusMsg: {
    fontSize: '10px',
  },
}));

const SideSpaces = () => {
  const dispatch = useDispatch();
  const classes = useStyles();
  const [expanded, setExpanded] = useState(['root']);
  const [selectedNodes, setSelectedNodes] = useState([]);
  const [selectedTreeChild, setSelectedTreeChild] = useState({});
  const [treeData, setTreeData] = useState([]);
  const [parentId, setParentId] = useState('');
  const [floorId, setFloorId] = useState('');
  const [roomId, setRoomId] = useState('');
  const [filtersIcon, setFilterIcon] = useState(false);

  const [accordion, setAccordian] = useState([]);
  const [category, setCategory] = useState(false);
  const [load, setLoad] = useState('');
  const [currentEquipmentId, setCurrentEquipmentId] = useState(false);

  const [isEquipmentsView, setEquipmentsView] = useState(false);
  const [spaceName, setSpaceName] = useState(false);
  const [spaceId, setSpaceId] = useState(false);
  const [icon, setIcon] = useState(faAngleRight);
  const sortBy = 'DESC';
  const sortField = 'create_date';

  const [collapse, setCollapse] = useState(false);

  const [spaceDraggable, setSpaceDraggable] = useState(false);
  const [bulkCatagories, setBulkCatagories] = useState([]);
  const [isDiscards, setIsDiscards] = useState(false);
  const [isBulkFilteredData, setIsBulkFilteredData] = useState(false);
  const [indexInfo, setIndexInfo] = useState(false);
  const [reload, setReload] = useState(false);
  const [remove, setRemove] = useState(false);
  const [isUpdateData, setIsUpdateData] = useState(false);
  const [isAddData, setIsAddData] = useState(false);
  const [assetData, setAssetData] = useState([]);
  const [tooltipOpen, setTooltipOpen] = useState(false);
  const toggleEdit = () => setTooltipOpen(!tooltipOpen);

  const [isRemoveData, setIsRemoveData] = useState(false);

  const {
    buildingSpaces, buildingsInfo,
    assetsCategoryGroups, spaceEquipments, getSpaceInfo,
  } = useSelector((state) => state.equipment);

  const {
    bulkDraggableSpaces,
  } = useSelector((state) => state.space);

  const { userInfo, userRoles } = useSelector((state) => state.user);
  const companies = getAllCompanies(userInfo, userRoles);

  useEffect(() => {
    if ((userInfo && userInfo.data)) {
      dispatch(getBuildings(companies, appModels.SPACE));
      dispatch(resetSpaceEquipments());
      dispatch(resetSpaceData());
    }
  }, []);

  useEffect(() => {
    if ((spaceEquipments && spaceEquipments.data)) {
      dispatch(newBulkDraggableSpaceData([]));
      const arr = spaceEquipments.data;
      setAssetData(arr);
    }
  }, [spaceEquipments]);

  useEffect(() => {
    if ((userInfo && userInfo.data) && (buildingsInfo && buildingsInfo.data)) {
      setTreeData(addParents(buildingsInfo.data));
    }
  }, [buildingsInfo]);

  useEffect(() => {
    setTreeData(treeData);
  }, [treeData]);

  useEffect(() => {
    if ((userInfo && userInfo.data) && (buildingSpaces && buildingSpaces.data && buildingSpaces.data.length && parentId)) {
      setTreeData(addChildrens(treeData, buildingSpaces.data[0].child, parentId));
    }
  }, [buildingSpaces, parentId]);

  useEffect(() => {
    if ((userInfo && userInfo.data) && isEquipmentsView && spaceId) {
      setCategory(false);
      dispatch(getSpaceAssetsGroups(companies, spaceId, appModels.EQUIPMENT));
      setSpaceDraggable(false);
    }
  }, [userInfo, isEquipmentsView, spaceId]);

  useEffect(() => {
    if ((assetsCategoryGroups && assetsCategoryGroups.data && assetsCategoryGroups.data.length > 0) && category && load) {
      dispatch(getSpaceEquipments(companies, spaceId, category, appModels.EQUIPMENT, sortBy, sortField));
      setSpaceDraggable(false);
    }
  }, [load]);

  const getinitial = () => {
    if ((assetsCategoryGroups && assetsCategoryGroups.data && assetsCategoryGroups.data.length > 0)) {
      const assets = assetsCategoryGroups.data;
      const accordn = [];
      for (let i = 0; i < assets.length; i += 1) {
        if (i === 0) {
          // If first collapse want to open default then add true
          accordn.push(true);
        } else {
          accordn.push(false);
        }
      }
      setAccordian(accordn);
    }
  };

  useEffect(() => {
    if ((assetsCategoryGroups && assetsCategoryGroups.data && assetsCategoryGroups.data.length > 0)) {
      if (assetsCategoryGroups.data[0].category_id[0]) {
        // const categoryValue = assetsCategoryGroups.data[0].category_id[0];
        // setCategory(categoryValue);
        setLoad(Math.random());
        setSpaceDraggable(false);
      }
      getinitial();
    }
  }, [assetsCategoryGroups]);

  const fetchChildObjects = (node) => {
    setSelectedTreeChild(node.id);
    if (!node.parent_id) {
      setParentId(node.id);
      setFloorId('');
      setRoomId('');
      setSelectedNodes([node.id]);
      dispatch(getAllSpaces(node.id, companies));
    } else if (node.type === 'Floor') {
      dispatch(resetSpaceData());
      dispatch(resetSpaceEquipments());
      setFloorId(node.id);
      setRoomId('');
      dispatch(getSpaceData(appModels.SPACE, node.id));
      setSelectedNodes([parentId, node.id]);
    } else if (node.type === 'Room') {
      setRoomId(node.id);
      setSelectedNodes([parentId, floorId, node.id]);
      setEquipmentsView(true); setSpaceName(node.name); setSpaceId(node.id);
      getinitial([]);
      setCurrentEquipmentId(false);
    } else {
      if (roomId) {
        setSelectedNodes([parentId, floorId, roomId, node.id]);
      }
      if (!roomId) {
        setSelectedNodes([parentId, floorId, node.id]);
      }
      setEquipmentsView(true); setSpaceName(node.name); setSpaceId(node.id);
      getinitial([]);
      setCurrentEquipmentId(false);
    }
    if (node.childs && node.childs.length) {
      // dispatch(getSpaceChilds(companies, appModels.SPACE, node.id));
      // dispatch(getAllSpaces(node.id, companies));
    }
    if (node.childs && !node.childs.length) {
      setExpanded(expanded.filter((item) => item !== node.id));
    }
  };

  function getTextLength(node) {
    let tLen = 22;
    if (!node.parent_id || node.type === 'Floor') {
      tLen = 27;
    }
    return tLen;
  }

  const label = (node) => (
    <div
      className={
        (node && selectedTreeChild === node.id)
          ? classes.selectedLabelRoot : classes.labelRoot
      }
    >
      <Row>
        <Col sm="10" xs="10" md="12" lg="12" className="pl-2">
          <Row>
            <Col sm="12" className="occupancy">
              {node.name && node.name.length >= getTextLength(node) && (
              <Tooltip title={node.name} placement="right">
                <span className="font-weight-700">
                  {truncate(node.name, getTextLength(node))}
                  {' '}
                </span>
              </Tooltip>
              )}
              {node.name && node.name.length < getTextLength(node) && (
              <span className="font-weight-700">
                {node.name}
                {' '}
              </span>
              )}
            </Col>
          </Row>
        </Col>
      </Row>
    </div>
  );

  const renderTreeChild = (nodes) => (
    nodes && nodes.map((node) => (
      <TreeItem
        classes={{
          label: selectedNodes.includes(node.id)
          && node.childs && !node.childs.length
            ? classes.selectedLabel
            : classes.label,
          expanded: node.childs && node.childs.length ? classes.expanded : classes.expandedHide,
        }}
        key={node.treeNodeId}
        nodeId={node.treeNodeId}
        label={label(node)}
        expandIcon={node.childs && node.childs.length ? <ChevronRightIcon /> : <span />}
        onClick={!node.err ? () => fetchChildObjects(node) : undefined}
      >
        {(buildingSpaces && !buildingSpaces.loading && !buildingSpaces.err) && (buildingSpaces.data && buildingSpaces.data.length > 0)
        && node.children && (
          <>
            {Array.isArray(node.children) && node.childs && node.childs.length ? renderTreeChild(node.children) : null}
          </>
        )}
        {buildingSpaces && buildingSpaces.loading && !buildingSpaces.err && node.id === selectedTreeChild && (
          <div className="text-center">
            <Spinner size="sm" color="dark" />
          </div>
        )}
        {!node.parent_id && buildingSpaces && buildingSpaces.data && buildingSpaces.data.length > 0 && !buildingSpaces.loading && (node.children && node.children.length === 0)
         && !buildingSpaces.err && node.id === selectedTreeChild && buildingSpaces.data[0].child && buildingSpaces.data[0].child.length > 0 && (
         <div className="text-center">
           <Spinner size="sm" color="dark" />
         </div>
        )}
        {node.children && node.children.length === 0 && node && node.err && node.err.error && node.err.error.message && (
          <div className="text-danger ml-2">
            {' '}
            {node.err.error.message}
          </div>
        )}
      </TreeItem>
    ))
  );

  const handleChange = (event, nodes) => {
    setExpanded(nodes);
  };

  const toggleAccordion = (tab, categoryValue) => {
    setAssetData([]);
    setCategory(categoryValue);
    const prevState = accordion;
    const state = prevState.map((x, index) => (tab === index ? !x : false));
    for (let i = 0; i < state.length; i += 1) {
      if (state[i] === false) {
        setIcon(faAngleRight);
      } else {
        setIcon(faAngleDown);
      }
    }
    setAccordian(state);
    setLoad(Math.random());
  };

  const onEquipmentLoad = (eqid, x, y) => {
    if (x && y) {
      setCurrentEquipmentId(eqid);
    }
  };

  const onClickEquipmentAdd = (eqid) => {
    const eData = assetData;
    if (eqid && eqid > 0) {
      const index = eData.findIndex((obj) => (
        obj.id.toString() === eqid.toString()));
      if (index !== -1) {
        eData[index].xpos = '10';
        eData[index].ypos = '20';
        eData[index].type = 'add';
        setSpaceDraggable(false);
        setIsAddData(true);
      }
    }
  };

  const saveSpaces = () => {
    const space = bulkDraggableSpaces;
    setBulkCatagories(space);
    setIsBulkFilteredData(true);
    setIsUpdateData(true);
    setIsDiscards(false);
  };

  const onCliCkSwitch = () => {
    setSpaceDraggable(!spaceDraggable);
    setIsRemoveData(true);
  };

  useEffect(() => {
    if (isDiscards) {
      dispatch(setDiscard(isDiscards));
      setIsDiscards(false);
    }
  }, [isDiscards]);

  const isUserError = userInfo && userInfo.err;
  const isUserLoading = userInfo && userInfo.loading;
  const userErrorMsg = generateErrorMessage(userInfo);
  const errorMsg = (buildingsInfo && buildingsInfo.err) ? generateErrorMessage(buildingsInfo) : userErrorMsg;

  const selectedCategoryName = assetData && assetData.length > 0 ? extractTextObject(assetData[0].category_id) : '';

  return (
    <Row>
      <Col md="12" sm="12" lg={collapse ? 1 : 3} xs="12" className={collapse ? 'ml-2 pt-2 pl-2 pr-2 Location-hirarchy' : 'pt-2 pl-2 pr-2 Location-hirarchy'}>
        {collapse ? (
          <>
            <img src={filterIcon} height="30px" aria-hidden="true" width="30px" alt="Space" onClick={() => setCollapse(!collapse)} className="cursor-pointer filter-left ml-4" id="filters" />
            <UncontrolledTooltip target="filters" placement="right">
              Location Hierarchy
            </UncontrolledTooltip>
          </>
        ) : (
          <Card className={collapse ? 'filter-margin-right card h-100 p-1' : 'p-1 card h-100 bg-lightblue'} onMouseOver={() => setFilterIcon(true)} onMouseLeave={() => setFilterIcon(false)}>
            {!collapse ? (
              <>
                <CardTitle className="mt-2 ml-2 mb-0 mr-2">
                  <Row lg="12" sm="12" md="12">
                    <Col lg="10" sm="10" md="10" className="mr-0">
                      {!isEquipmentsView && (
                      <h4>
                        Location Hierarchy
                      </h4>
                      )}
                      {isEquipmentsView && (
                      <h6>
                        <Tooltip title="Back" placement="right">
                          <FontAwesomeIcon
                            onClick={() => { dispatch(resetSpaceEquipments()); setEquipmentsView(false); setSpaceDraggable(false); }}
                            className="cursor-pointer font-weight-400 font-tiny"
                            size="sm"
                            icon={faArrowLeft}
                          />
                        </Tooltip>
                        <span className="ml-2 font-weight-800">{spaceName}</span>
                      </h6>
                      )}
                    </Col>
                    {filtersIcon && (
                    <Col lg="2" sm="2" md="2" className={isEquipmentsView ? '' : 'mt-1'}>
                      <img
                        src={collapseIcon}
                        height="25px"
                        aria-hidden="true"
                        width="25px"
                        alt="Collapse"
                        onClick={() => setCollapse(!collapse)}
                        className="cursor-pointer collapse-margin-left-align"
                        id="collapse"
                      />
                      <UncontrolledTooltip target="collapse" placement="right">
                        Collapse
                      </UncontrolledTooltip>
                    </Col>
                    )}
                  </Row>
                  <hr className="m-0 border-color-grey" />
                </CardTitle>
                <CardBody className="pt-0 mt-2 height-100 position-relative scrollable-list thin-scrollbar">
                  <div className="ml-0">

                    {isEquipmentsView && (
                    <div>
                      <span className="font-weight-800 font-medium">Assets</span>
                      <div className="mt-1">
                        {(accordion.length > 0) && (assetsCategoryGroups && assetsCategoryGroups.data) && assetsCategoryGroups.data.map((asset, index) => (
                          <div
                            id="accordion"
                            className="accordion-wrapper mb-0 border-0"
                            key={asset.category_id[0]}
                          >
                            <div className="border-0">
                              <div id={`heading${index}`} className="p-2 border-0">
                                <p
                                  id={`heading${index}`}
                                  aria-hidden
                                  className="text-left m-0 p-0"
                                  onClick={() => toggleAccordion(index, asset.category_id[0])}
                                  aria-expanded={accordion[index]}
                                  aria-controls={`collapse${index}`}
                                >
                                  {accordion[index]
                                    ? <FontAwesomeIcon className="font-weight-300 cursor-pointer" size="sm" icon={faAngleDown} />
                                    : <FontAwesomeIcon className="font-weight-300 cursor-pointer" size="sm" icon={icon} />}
                                  <span className="font-weight-600 ml-2 cursor-pointer">
                                    {asset.category_id[1]}
                                    {' '}
                                  </span>
                                </p>
                              </div>
                              <Collapse
                                isOpen={accordion[index]}
                                data-parent="#accordion"
                                id={`collapse${index}`}
                                className="border-0 mb-2 max-form-content hidden-scrollbar"
                                aria-labelledby={`heading${index}`}
                              >
                                {assetData && assetData.length > 0 && assetData.map((sp) => (
                                  <>
                                    <div
                                      key={sp.id}
                                      aria-hidden
                                      className="p-2 ml-3 mt-1"
                                      onClick={() => onEquipmentLoad(sp.id, sp.xpos, sp.ypos)}
                                      onMouseOver={() => onEquipmentLoad(sp.id, sp.xpos, sp.ypos)}
                                      onFocus={() => onEquipmentLoad(sp.id, sp.xpos, sp.ypos)}
                                    >
                                      {sp.name && sp.name.length >= 20 && (
                                        <Tooltip title={sp.name} placement="right">
                                          <span className={`font-weight-400 cursor-pointer ${currentEquipmentId === sp.id ? 'selected-tree-item-active' : 'selected-tree-item'}`}>
                                            {truncate(sp.name, 20)}
                                            {' '}
                                          </span>
                                        </Tooltip>
                                      )}
                                      {sp.name && sp.name.length < 20 && (
                                      <span className={`font-weight-400 cursor-pointer ${currentEquipmentId === sp.id ? 'selected-tree-item-active' : 'selected-tree-item'}`}>
                                        {sp.name}
                                        {' '}
                                      </span>
                                      )}
                                      {(!sp.xpos || !sp.ypos) && (
                                        spaceDraggable
                                          ? (
                                            <Tooltip title="Add asset location" placement="right">
                                              <img
                                                src={plusCircleGrey}
                                                alt="space"
                                                onClick={() => onClickEquipmentAdd(sp.id)}
                                                height="14"
                                                width="14"
                                                className="ml-1 mb-1 cursor-pointer"
                                                aria-hidden="true"
                                              />
                                            </Tooltip>
                                          )
                                          : (
                                            <Tooltip title="This asset is not mapped to the floor plan" placement="right">
                                              <span className="text-info">
                                                <FontAwesomeIcon className="ml-3 cursor-pointer" size="sm" icon={faInfoCircle} />
                                              </span>
                                            </Tooltip>
                                          )
                                      )}
                                    </div>
                                  </>
                                ))}
                                {spaceEquipments && spaceEquipments.loading && (
                                <div className="mb-3 mt-3">
                                  <Loader />
                                </div>
                                )}
                                {(spaceEquipments && spaceEquipments.err) && (
                                <ErrorContent errorTxt={generateErrorMessage(spaceEquipments)} />
                                )}
                              </Collapse>
                            </div>
                          </div>
                        ))}
                      </div>
                      {assetsCategoryGroups && assetsCategoryGroups.loading && (
                      <div className="mb-3 mt-3">
                        <Loader />
                      </div>
                      )}
                      {(assetsCategoryGroups && assetsCategoryGroups.err) && (
                      <ErrorContent errorTxt={generateErrorMessage(assetsCategoryGroups)} />
                      )}
                    </div>
                    )}

                    {!isEquipmentsView && (
                    <TreeView
                      className={classes.root}
                      defaultCollapseIcon={<ExpandMoreIcon />}
                      defaultExpanded={['root']}
                      defaultExpandIcon={<ChevronRightIcon />}
                      onNodeToggle={handleChange}
                      expanded={expanded}
                    >
                      {renderTreeChild(treeData)}
                    </TreeView>
                    )}

                    {((buildingsInfo && buildingsInfo.loading) || isUserLoading) && (
                    <div className="mb-2 mt-4">
                      <Loader />
                    </div>
                    )}

                    {((buildingsInfo && buildingsInfo.err) || isUserError) && (
                    <ErrorContent errorTxt={errorMsg} />
                    )}

                  </div>
                </CardBody>
              </>
            ) : ''}
          </Card>
        )}
      </Col>
      <Col md="12" sm="12" lg={collapse ? 11 : 9} xs="12" className={collapse ? 'filter-margin-left-align pt-2 pr-2 pl-1' : 'pl-1 pt-2 pr-2'}>
        <Row className="list m-0 bg-lightblue h-100">
          <Col xs="12" sm="12" md="12" lg="12" className="p-0">
            <Card className="bg-lightblue h-100 pl-2 pr-2">
              {spaceEquipments && !spaceEquipments.loading && spaceEquipments.data && selectedCategoryName && selectedCategoryName !== '' && (
              <>
                <CardTitle className="mt-2 mb-0 row">
                  <Col xs="12" sm="6" md="6" lg="6">
                    <span className="font-weight-800 align-middle">{selectedCategoryName}</span>
                  </Col>
                  <Col xs="12" sm="6" md="6" lg="6">
                    {getSpaceInfo && !getSpaceInfo.loading && assetsCategoryGroups && !assetsCategoryGroups.loading && (
                    <>
                      {bulkDraggableSpaces && bulkDraggableSpaces.length ? (
                        <>
                          <Button
                             variant="contained"
                            size="sm"
                            className="rounded-pill float-right mt-1 mr-2"
                            onClick={() => saveSpaces()}
                          >
                            <img src={select} alt="select" className="mr-2 mb-1" />
                            Update
                          </Button>
                        </>
                      ) : ''}
                      {bulkDraggableSpaces && bulkDraggableSpaces.length ? (
                        <Button
                           variant="contained"
                          size="sm"
                          className="rounded-pill float-right mt-1 mr-2 bg-white text-dark"
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
                          {bulkDraggableSpaces.length === 1 ? 'asset' : bulkDraggableSpaces.length > 1 ? 'assets' : ''}
                        </span>
                      ) : ''}
                      {(bulkDraggableSpaces && bulkDraggableSpaces.length) ? '' : (
                        <>
                          <Switch color="primary" checked={spaceDraggable} onClick={() => { onCliCkSwitch(); }} id="spaceEdit" className="float-right" />
                          <UncontrolledTooltip
                            placement="top"
                            isOpen={tooltipOpen}
                            target="spaceEdit"
                            toggle={toggleEdit}
                          >
                            {spaceDraggable ? (
                              <span>Assets editable.</span>
                            ) : (
                              <span>Click here to edit assets.</span>
                            )}
                          </UncontrolledTooltip>
                        </>
                      )}
                    </>
                    )}
                  </Col>
                </CardTitle>
                <hr className={(bulkDraggableSpaces && bulkDraggableSpaces.length) ? 'mt-2 mb-1 border-color-grey' : 'mt-0 mb-1 border-color-grey'} />
              </>
              )}
              {getSpaceInfo && !getSpaceInfo.loading && (
              <MapControl
                collapse={collapse}
                isEquipmentsView={isEquipmentsView}
                category={category}
                spaceId={spaceId}
                assetData={assetData}
                setAssetData={setAssetData}
                currentEquipmentId={currentEquipmentId}
                spaceDraggable={spaceDraggable}
                setSpaceDraggable={setSpaceDraggable}
                indexInfo={indexInfo}
                setIndexInfo={setIndexInfo}
                remove={remove}
                setRemove={setRemove}
                reload={reload}
                setReload={setReload}
                isAddData={isAddData}
                setIsAddData={setIsAddData}
                isBulkFilteredData={isBulkFilteredData}
                setIsBulkFilteredData={setIsBulkFilteredData}
                setIsRemoveData={setIsRemoveData}
                isRemoveData={isRemoveData}
              />
              )}
              {getSpaceInfo && getSpaceInfo.loading && (
              <div className="mb-3 mt-3">
                <Loader />
              </div>
              )}
              {(isUpdateData) && (
              <SaveSpaceModalWindow
                setIsUpdateData={setIsUpdateData}
                isUpdateData={isUpdateData}
                remove={remove}
                setRemove={setRemove}
                id={currentEquipmentId}
                reload={reload}
                setReload={setReload}
                bulkCatagories={bulkCatagories}
                category={category}
                spaceId={spaceId}
                setBulkCatagories={setBulkCatagories}
              />
              )}
            </Card>
          </Col>
        </Row>
      </Col>
    </Row>
  );
};

export default SideSpaces;
