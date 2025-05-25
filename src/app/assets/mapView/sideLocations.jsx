/* eslint-disable no-nested-ternary */
/* eslint-disable import/no-unresolved */
import React, { useState, useEffect } from 'react';
import {
  Card,
  CardBody,
  CardTitle,
  Col,
  Row,
  Modal,
  ModalHeader,
  ModalBody,
  Collapse,
} from 'reactstrap';
import * as PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import TreeView from '@material-ui/lab/TreeView';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import TreeItem from '@material-ui/lab/TreeItem';
import {
  faChevronDown, faChevronRight, faArrowUp, faArrowDown,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import IconButton from '@material-ui/core/IconButton';
import InputAdornment from '@material-ui/core/InputAdornment';
import SearchIcon from '@material-ui/icons/Search';
import { Tooltip } from 'antd';
import { Typography, TextField } from '@mui/material';

import locationIcon from '@images/icons/locationBlack.svg';
import ExportDrawer from '../../commonComponents/exportDrawer';
import Loader from '@shared/loading';
import ErrorContent from '@shared/errorContent';
import Upload from '@shared/listViewFilters/upload';
import BulkUpload from '@shared/bulkUpload';

import fileMiniIcon from '@images/icons/fileMini.svg';

import locationTemplate from '@images/templates/location_template.xlsx';

import {
  getSpaceData, getAllLocationsData,
  resetCreateSpace,
  getBuildings, resetSpaceData, resetSpaceEquipments,
  getLocationImageInfo, resetLocationInfo, getSpacesCount,
} from '../equipmentService';
import { getCompanyDetail, resetCompanyDetail } from '../../adminSetup/setupService';
import {
  generateErrorMessage, getAllCompanies, truncate, getListOfOperations,
} from '../../util/appUtils';
import AddLocation from '../locationDetails/addLocation';
import { buildTreeViewObject } from '../utils/utils';
import '../sidebar/selectedSapceView.scss';
import { setInitialValues } from '../../purchase/purchaseService';
import DataExport from './dataExport/dataExport';
import fieldsArgs from './data/importFields.json';
import { AddThemeBackgroundColor, returnThemeColor } from '../../themes/theme';
import actionCodes from '../data/assetActionCodes.json';

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

const SideLocations = (props) => {
  const { title, setCollapse, collapse } = props;
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
  const [selectedSpaceNameValue, setSelectedSpaceNameValue] = useState([]);

  const [addLocationModal, showAddLocationModal] = useState(false);

  const [companyCollapse, setCompanyCollapse] = useState(true);

  const [exportLocations, setExportLocations] = useState(false);
  const [bulkUploadModal, showBulkUploadModal] = useState(false);
  const [sortBy, setSortBy] = useState('ASC');

  const {
    buildingSpaces, buildingsInfo, spacesCount,
    createSpaceInfo, getSpaceInfo, allLocationsInfo,
  } = useSelector((state) => state.equipment);

  const { userInfo, userRoles } = useSelector((state) => state.user);
  const companies = getAllCompanies(userInfo, userRoles);

  const allowedOperations = getListOfOperations(userRoles && userRoles.data ? userRoles.data.allowed_modules : [], 'code');

  const isQRExport = allowedOperations.includes(actionCodes['Space QR Export']);

  useEffect(() => {
    if ((userInfo && userInfo.data)) {
      dispatch(getBuildings(companies, appModels.SPACE));
      dispatch(resetSpaceEquipments());
      dispatch(resetSpaceData());
      dispatch(getSpacesCount(companies, appModels.SPACE));
    }
  }, []);

  useEffect(() => {
    if (userInfo && userInfo.data && sortBy) {
      dispatch(getAllLocationsData(userInfo.data.company.id, appModels.SPACE, sortBy));
    }
  }, [userInfo, sortBy]);

  useEffect(() => {
    if (userInfo && userInfo.data && companyCollapse) {
      dispatch(getCompanyDetail(userInfo.data.company.id, appModels.COMPANY));
    }
  }, [userInfo, companyCollapse]);

  useEffect(() => {
    if (allLocationsInfo && allLocationsInfo.data) { setTreeData(buildTreeViewObject(allLocationsInfo.data)); }
  }, [allLocationsInfo]);

  useEffect(() => {
    if (userInfo && userInfo.data && getSpaceInfo && getSpaceInfo.data && getSpaceInfo.data.length > 0) {
      dispatch(getLocationImageInfo(companies, getSpaceInfo.data[0].asset_category_id[0], appModels.ASSETCATEGORY));
    }
  }, [userInfo, getSpaceInfo]);

  const fetchChildObjects = (node) => {
    setSelectedTreeChild(node.id);
    dispatch(resetSpaceData());
    if (!node.parent_id) {
      setParentId(node.id);
      setFloorId('');
      setRoomId('');
      setSelectedNodes([node.id]);
    } else if (node.type === 'Floor') {
      dispatch(resetSpaceEquipments());
      setFloorId(node.id);
      setRoomId('');
      setSelectedNodes([parentId, node.id]);
    } else if (node.type === 'Room') {
      setRoomId(node.id);
      setSelectedNodes([parentId, floorId, node.id]);
    } else {
      if (roomId) {
        setSelectedNodes([parentId, floorId, roomId, node.id]);
      }
      if (!roomId) {
        setSelectedNodes([parentId, floorId, node.id]);
      }
    }
    if (node.childs && node.childs.length) {
      // dispatch(getSpaceChilds(companies, appModels.SPACE, node.id));
      // dispatch(getAllSpaces(node.id, companies));
    }
    if (node.childs && !node.childs.length) {
      setExpanded(expanded.filter((item) => item !== node.id));
    }
    dispatch(getSpaceData(appModels.SPACE, node.id));
    dispatch(resetCompanyDetail());
    dispatch(resetLocationInfo());
    dispatch(setInitialValues(false, false, false, false));
  };

  const onReset = () => {
    dispatch(resetCreateSpace());
  };

  function getTextLength(node) {
    let tLen;
    if (!node.parent_id || node.type === 'Floor' || node.type === 'Floor') {
      tLen = 27;
    } else {
      tLen = 22;
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
    <div>
      {nodes && nodes.map((node) => (
        <TreeItem
          classes={{
            label: selectedNodes.includes(node.id)
              && node.childs && !node.childs.length
              ? classes.selectedLabel
              : classes.label,
            expanded: node.childs && node.childs.length ? classes.expanded : '',
          }}
          key={node.treeNodeId}
          nodeId={node.treeNodeId}
          label={label(node)}
          expandIcon={node.childs && node.childs.length ? <ChevronRightIcon /> : <span />}
          onClick={!node.err ? () => fetchChildObjects(node) : undefined}
        >
          <Typography
            sx={{
              font: "normal normal normal 13px Suisse Intl",
              letterSpacing: "0.63px",
            }}
          >
            {(allLocationsInfo && !allLocationsInfo.loading && !allLocationsInfo.err) && (allLocationsInfo.data && allLocationsInfo.data.length > 0)
              && node.children && (
                <>
                  {Array.isArray(node.children) && node.childs && node.childs.length ? renderTreeChild(node.children) : null}
                </>
              )}

            {node.children && node.children.length === 0 && node && node.err && node.err.error && node.err.error.message && (
              <div className="text-danger ml-2">
                {' '}
                {node.err.error.message}
              </div>
            )}
          </Typography>
        </TreeItem>

      ))}
      {nodes && !nodes.length && allLocationsInfo && !allLocationsInfo.loading && (
        <div className="text-danger text-center">
          Spaces are not available
        </div>
      )}
    </div>
  );

  const handleChange = (event, nodes) => {
    setExpanded(nodes);
  };

  const onChangeSearchValue = (e) => {
    setSelectedSpaceNameValue(e);
  };

  const onUploadClose = () => {
    if (userInfo && userInfo.data && sortBy) {
      dispatch(getAllLocationsData(userInfo.data.company.id, appModels.SPACE, sortBy));
    }
    showBulkUploadModal(false);
  };

  useEffect(() => {
    if (selectedSpaceNameValue) {
      if (allLocationsInfo && allLocationsInfo.data) {
        setTreeData(buildTreeViewObject(allLocationsInfo && allLocationsInfo.data, selectedSpaceNameValue));
      }
    } else if (allLocationsInfo && allLocationsInfo.data) setTreeData(buildTreeViewObject(allLocationsInfo.data, selectedSpaceNameValue));
  }, [selectedSpaceNameValue]);

  const totalDataCount = spacesCount && spacesCount.length ? spacesCount.length : 0;

  const isUserError = userInfo && userInfo.err;
  const isUserLoading = userInfo && userInfo.loading;
  const userErrorMsg = generateErrorMessage(userInfo);
  const errorMsg = (allLocationsInfo && allLocationsInfo.err) ? generateErrorMessage(allLocationsInfo) : userErrorMsg;
  const [showExport, setShowExport] = useState(false);
  const [exportType, setExportType] = useState('');
  const [exportTrue, setExportTrue] = useState('');
  return (
    <Card className="bg-lightblue h-100 side-filters-list" onMouseOver={() => setFilterIcon(true)} onMouseLeave={() => setFilterIcon(false)}>
      {!collapse ? (
        <>
          <CardTitle style={AddThemeBackgroundColor({})} className="p-2 m-0">
            <Typography sx={{
              fontSize: '18px',
              fontWeight: 600,
              fontFamily: 'Suisse Intl',
              color: 'white'
            }}>
              {title}
            </Typography>
          </CardTitle>
          <CardBody className="pt-0 height-100 position-relative scrollable-list thin-scrollbar">
            <Row>
              <Col lg="9" sm="9" md="9" className="mr-0 search-Input pr-0">
                <TextField
                  value={selectedSpaceNameValue}
                  className="searchInput"
                  placeholder="Search..."
                  variant='standard'
                  onChange={(e) => {
                    onChangeSearchValue(e.target.value);
                  }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment>
                        <IconButton className="iconButton">
                          <SearchIcon className="searchIcon iconButton" />
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Col>
              <Col lg="3" sm="3" md="3" className="mt-1 pl-1">
                <div className="mt-2 d-inline-block">
                  <Tooltip title="Sort" placement="top">
                    <FontAwesomeIcon
                      className="cursor-pointer float-left font-weight-700 mr-1"
                      onClick={() => setSortBy(sortBy === 'DESC' ? 'ASC' : 'DESC')}
                      size="lg"
                      icon={sortBy === 'DESC' ? faArrowUp : faArrowDown}
                    />
                  </Tooltip>
                  <Tooltip title="Export" placement="top">
                    <img
                      aria-hidden="true"
                      id="Location-Export"
                      alt="Export"
                      height={18}
                      width={18}
                      className="cursor-pointer float-right"
                      onClick={() => setShowExport(true)}
                      src={fileMiniIcon}
                    />
                  </Tooltip>
                  <div className="display-flex-div">
                    <Upload setEnable={() => showBulkUploadModal(true)} />
                  </div>
                </div>
              </Col>
              <Col md="9" xs="9" sm="9" lg="9" className="page-actions-header">
                <FontAwesomeIcon
                  className="mr-2 mt-3 cursor-pointer font-weight-700"
                  onClick={() => setCompanyCollapse(!companyCollapse)}
                  size="sm"
                  icon={companyCollapse ? faChevronDown : faChevronRight}
                />
                <p
                  className={companyCollapse ? 'cursor-pointer company-heading font-weight-700 mb-1' : 'cursor-pointer bg-lightblue company-heading font-weight-700 mb-0'}
                  aria-hidden="true"
                  onClick={() => { setCompanyCollapse(!companyCollapse); }}
                >
                  {userInfo && userInfo.data && userInfo.data.company ? `${userInfo.data.company.name}  (${totalDataCount})` : ''}
                </p>
              </Col>
              <Col md="3" xs="3" sm="3" lg="3">
                <ExportDrawer
                  showExport={showExport}
                  setShowExport={setShowExport}
                  setExportTrue={setExportTrue}
                  setExportType={setExportType}
                  isQR={isQRExport}
                  loading={allLocationsInfo && allLocationsInfo.loading}
                />
                <DataExport
                  afterReset={() => setShowExport(false)}
                  fields={['space_name', 'path_name', 'asset_category_id', 'sequence_asset_hierarchy']}
                  exportType={exportType}
                  exportTrue={exportTrue}
                />
              </Col>
              {bulkUploadModal && (
                <BulkUpload
                  atFinish={() => {
                    onUploadClose();
                  }}
                  targetModel={appModels.SPACE}
                  modalTitle="Space Bulk Upload"
                  modalMsg="Spaces are uploaded successfully..."
                  testFields={fieldsArgs.fields}
                  uploadFields={fieldsArgs.ulpoadFields}
                  sampleTamplate={locationTemplate}
                  labels={fieldsArgs.fieldLabels}
                  bulkUploadModal
                />
              )}
            </Row>
            <Collapse isOpen={companyCollapse}>
              <div className="ml-0 mb-3">
                <TreeView
                  className={classes.root}
                  defaultCollapseIcon={<ExpandMoreIcon />}
                  defaultExpanded={['root']}
                  defaultExpandIcon={<ChevronRightIcon />}
                  onNodeToggle={handleChange}
                  multiSelect
                  expanded={expanded}
                >
                  {renderTreeChild(treeData)}
                </TreeView>

                {((allLocationsInfo && allLocationsInfo.loading) || isUserLoading) && (
                  <div className="mb-2 mt-4">
                    <Loader />
                  </div>
                )}
                {((allLocationsInfo && allLocationsInfo.err) || isUserError) && (
                  <ErrorContent errorTxt={errorMsg} />
                )}
              </div>
            </Collapse>
            <Modal size={(createSpaceInfo && createSpaceInfo.data) ? 'sm' : 'xl'} className="border-radius-50px modal-dialog-centered" isOpen={addLocationModal}>
              <ModalHeader className="modal-justify-header">
                <Row>
                  <Col sm="12" md="12" lg="12" xs="12" className="pr-0">
                    <h4 className="font-weight-800 mb-0">
                      <img
                        className="mr-3"
                        src={locationIcon}
                        width="23"
                        height="23"
                        alt="add_location"
                      />
                      Add Location
                    </h4>
                    <hr className="mb-0" />
                  </Col>
                </Row>
              </ModalHeader>
              <ModalBody className="mt-0 pt-0">
                <AddLocation
                  spaceCategory={getSpaceInfo && getSpaceInfo.data ? getSpaceInfo.data[0].asset_categ_type : ''}
                  afterReset={() => { showAddLocationModal(false); onReset(); }}
                  spaceId={getSpaceInfo && getSpaceInfo.data ? getSpaceInfo.data[0].id : ''}
                  pathName={getSpaceInfo && getSpaceInfo.data ? getSpaceInfo.data[0].path_name : ''}
                />
              </ModalBody>
            </Modal>
          </CardBody>
        </>
      ) : ''}
    </Card>
  );
};

SideLocations.propTypes = {
  title: PropTypes.string.isRequired,
  // data: PropTypes.arrayOf(
  //   PropTypes.shape({
  //     id: PropTypes.number,
  //     space_name: PropTypes.string,
  //   }),
  // ).isRequired,
  setCollapse: PropTypes.func,
  collapse: PropTypes.bool,
};
SideLocations.defaultProps = {
  setCollapse: () => { },
  collapse: false,
};

export default SideLocations;
