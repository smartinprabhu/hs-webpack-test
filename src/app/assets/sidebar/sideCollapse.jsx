/* eslint-disable import/no-unresolved */
import React, { useState, useEffect } from 'react';
import * as PropTypes from 'prop-types';
import {
  Collapse,
  Card,
  CardBody,
  CardTitle,
  Col,
  Modal,
  ModalHeader,
  ModalBody,
  Row,
  Spinner,
  UncontrolledTooltip,
} from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faChevronDown, faChevronRight,
} from '@fortawesome/free-solid-svg-icons';
import { useSelector, useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import TreeView from '@material-ui/lab/TreeView';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import TreeItem from '@material-ui/lab/TreeItem';

import locationIcon from '@images/icons/locationBlack.svg';
import collapseIcon from '@images/collapse.png';
import Loader from '@shared/loading';
import ErrorContent from '@shared/errorContent';
import AddLocation from '../locationDetails/addLocation';
import { getCompanyDetail, resetCompanyDetail } from '../../adminSetup/setupService';
import {
  getBuilingChilds, getSpaceChilds, getSpaceData, getFloorChilds, resetCreateSpace,
  getBuildings, getSpacesCount, getLocationImageInfo, resetLocationInfo,
} from '../equipmentService';
import { generateErrorMessage, getAllCompanies } from '../../util/appUtils';
import { addParents, addChildrensNew } from '../utils/utils';
import './selectedSapceView.scss';
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

const SideCollapse = (props) => {
  const { title, setCollapse, collapse } = props;
  const dispatch = useDispatch();
  const classes = useStyles();
  const [viewId] = useState(0);
  const [loadChilds] = useState(false);
  const [companyCollapse, setCompanyCollapse] = useState(true);
  const [spaceType] = useState('Floor');
  const [addLocationModal, showAddLocationModal] = useState(false);
  const [expanded, setExpanded] = useState(['root']);
  const [selectedNodes, setSelectedNodes] = useState([]);
  const [selectedTreeChild, setSelectedTreeChild] = useState({});
  const [treeData, setTreeData] = useState([]);
  const [parentId, setParentId] = useState('');
  const [floorId, setFloorId] = useState('');
  const [roomId, setRoomId] = useState('');
  const [filtersIcon, setFilterIcon] = useState(false);

  const {
    spaceChilds, buildingsInfo,
    getSpaceInfo, createSpaceInfo, spacesCount,
  } = useSelector((state) => state.equipment);

  const { userInfo, userRoles } = useSelector((state) => state.user);
  const companies = getAllCompanies(userInfo, userRoles);

  useEffect(() => {
    if ((userInfo && userInfo.data)) {
      dispatch(getBuildings(companies, appModels.SPACE));
      dispatch(getSpacesCount(companies, appModels.SPACE));
    }
  }, []);

  useEffect(() => {
    if ((userInfo && userInfo.data) && (createSpaceInfo && createSpaceInfo.data)) {
      setExpanded(['root']);
      setSelectedNodes([]);
      setSelectedTreeChild({});
      dispatch(getBuildings(companies, appModels.SPACE));
      dispatch(getSpacesCount(companies, appModels.SPACE));
    }
  }, [userInfo, createSpaceInfo]);

  useEffect(() => {
    if (userInfo && userInfo.data && companyCollapse) {
      dispatch(getCompanyDetail(userInfo.data.company.id, appModels.COMPANY));
    }
  }, [userInfo, companyCollapse]);

  useEffect(() => {
    if ((userInfo && userInfo.data) && (buildingsInfo && buildingsInfo.data)) {
      setTreeData(addParents(buildingsInfo.data));
    }
  }, [buildingsInfo]);

  useEffect(() => {
    if ((userInfo && userInfo.data) && (spaceChilds && spaceChilds.data)) {
      setTreeData(addChildrensNew(treeData, spaceChilds.data, selectedNodes));
    }
  }, [spaceChilds, selectedNodes]);

  useEffect(() => {
    if (userInfo && userInfo.data && loadChilds) {
      if (spaceType === 'Room') {
        dispatch(getSpaceChilds(companies, appModels.SPACE, viewId));
      }
      if (spaceType === 'Floor') {
        dispatch(getFloorChilds(companies, appModels.SPACE, viewId));
      }
      if (spaceType === 'Building') {
        dispatch(getBuilingChilds(companies, appModels.SPACE, viewId));
      }
    }
  }, [userInfo, spaceType, viewId, loadChilds]);

  useEffect(() => {
    if (userInfo && userInfo.data && viewId && !loadChilds) {
      dispatch(getSpaceData(appModels.SPACE, viewId));
      dispatch(resetLocationInfo());
    }
  }, [userInfo, viewId, loadChilds]);

  useEffect(() => {
    if (userInfo && userInfo.data && getSpaceInfo && getSpaceInfo.data && getSpaceInfo.data.length > 0) {
      dispatch(getLocationImageInfo(companies, getSpaceInfo.data[0].asset_category_id[0], appModels.ASSETCATEGORY));
    }
  }, [userInfo, getSpaceInfo]);

  const fetchChildObjects = (node) => {
    setSelectedTreeChild(node.id);
    if (!node.parent_id) {
      setParentId(node.id);
      setFloorId('');
      setRoomId('');
      setSelectedNodes([node.id]);
    } else if (node.type === 'Floor') {
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
      dispatch(getSpaceChilds(companies, appModels.SPACE, node.id));
    }
    if (node.childs && !node.childs.length) {
      setExpanded(expanded.filter((item) => item !== node.id));
    }
    dispatch(getSpaceData(appModels.SPACE, node.id));
    dispatch(resetCompanyDetail());
    dispatch(resetLocationInfo());
  };

  const label = (node) => (
    <div
      className={
        (node && selectedTreeChild === node.id)
          ? classes.selectedLabelRoot : classes.labelRoot
      }
    >
      <Row className="w-100">
        <Col sm="11" xs="10" md="11" lg="11" className="pl-2">
          <Row>
            <Col sm="12" className="occupancy">
              <span className="font-weight-700">{node.name}</span>
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
        {(spaceChilds && !spaceChilds.loading) && (spaceChilds && spaceChilds.err)
        && (node.id === selectedTreeChild) && node.children && node.children.length === 0 ? (
          <span />
          ) : (
            <>
              {Array.isArray(node.children) && node.childs && node.childs.length ? renderTreeChild(node.children) : null}
            </>
          )}
        {spaceChilds && node.id === selectedTreeChild && spaceChilds.loading && (
          <div className="text-center">
            <Spinner size="sm" color="dark" />
          </div>
        )}
        {!node.parent_id && spaceChilds && spaceChilds.data && spaceChilds.data.length > 0 && !spaceChilds.loading && (node.children && node.children.length === 0)
         && !spaceChilds.err && node.id === selectedTreeChild && (
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

  // const handleCollapseChange = (id, type) => {
  //   setLoadChilds(true);
  //   if (!collapses.includes(id)) {
  //     if (type === 'Building') {
  //       setCollapses([id]);
  //     }
  //     if (type === 'Floor') {
  //       setFloorCollapses([id]);
  //     }
  //     if (type === 'Room') {
  //       setRoomCollapses([id]);
  //     }
  //     setViewId(id);
  //     setSpaceType(type);
  //   } else {
  //     if (type === 'Building') {
  //       setCollapses([]);
  //       setFloorCollapses([]);
  //     }
  //     if (type === 'Floor') {
  //       setFloorCollapses([]);
  //       setRoomCollapses([]);
  //     }
  //     if (type === 'Room') {
  //       setRoomCollapses([]);
  //     }
  //   }
  // };

  const onReset = () => {
    dispatch(resetCreateSpace());
  };

  const handleChange = (event, nodes) => {
    setExpanded(nodes);
  };

  // const toggle1 = () => setTooltipOpen1(!tooltipOpen1);

  // const noData = buildingsInfo && buildingsInfo.err ? buildingsInfo.err.data : false;

  const totalDataCount = spacesCount && spacesCount.length ? spacesCount.length : 0;

  const isUserError = userInfo && userInfo.err;
  const isUserLoading = userInfo && userInfo.loading;
  const userErrorMsg = generateErrorMessage(userInfo);
  const errorMsg = (buildingsInfo && buildingsInfo.err) ? generateErrorMessage(buildingsInfo) : userErrorMsg;

  return (
    <Card className="p-1 bg-lightblue h-100 side-filters-list" onMouseOver={() => setFilterIcon(true)} onMouseLeave={() => setFilterIcon(false)}>
      {!collapse ? (
        <>
          <CardTitle className="mt-2 ml-2 mb-0 mr-2">
            <Row lg="12" sm="12" md="12">
              <Col lg="10" sm="10" md="10" className="mr-0">
                <h4>
                  {title}
                </h4>
              </Col>
              {filtersIcon && (
                <Col lg="2" sm="2" md="2" className="mt-1">
                  <img
                    src={collapseIcon}
                    height="25px"
                    aria-hidden="true"
                    width="25px"
                    alt="Collapse"
                    onClick={() => setCollapse(!collapse)}
                    className="cursor-pointer collapse-icon-margin-left"
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
            <div className="mb-2 mt-0">
              <Row>
                <Col md="12" xs="12" sm="12" lg="12" className="page-actions-header p-0 ml-1">
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
              </Row>
              <Collapse isOpen={companyCollapse}>
                <div className="ml-0">

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
                  {((buildingsInfo && buildingsInfo.loading) || isUserLoading) && (
                    <div className="mb-2 mt-4">
                      <Loader />
                    </div>
                  )}

                  {((buildingsInfo && buildingsInfo.err) || isUserError) && (
                    <ErrorContent errorTxt={errorMsg} />
                  )}

                </div>
              </Collapse>
            </div>

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

SideCollapse.propTypes = {
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
SideCollapse.defaultProps = {
  setCollapse: () => { },
  collapse: false,
};

export default SideCollapse;
