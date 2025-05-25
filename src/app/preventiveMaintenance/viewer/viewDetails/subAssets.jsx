/* eslint-disable no-nested-ternary */
/* eslint-disable no-tabs */
/* eslint-disable max-len */
/* eslint-disable import/no-unresolved */
/* eslint-disable react/jsx-props-no-spreading */
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Col,
  Row,
  Spinner,
} from 'reactstrap';
import TreeView from '@material-ui/lab/TreeView';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import TreeItem from '@material-ui/lab/TreeItem';
import { makeStyles } from '@material-ui/core/styles';
import { Tooltip } from 'antd';

import ErrorContent from '@shared/errorContent';
import Loader from '@shared/loading';

import {
  generateErrorMessage,
  truncate,
} from '../../../util/appUtils';
import { returnThemeColor } from '../../../themes/theme';
import { getChildAssets } from '../../ppmService';

const appModels = require('../../../util/appModels').default;

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
    // borderTopRightRadius: theme.spacing(2),
    // borderBottomRightRadius: theme.spacing(2),
    width: 'auto',
    fontFamily: 'Suisse Intl',
  },
  selectedLabel: {
    height: '35px',
    fontSize: '13px',
    fontFamily: 'Suisse Intl',
    // borderTopRightRadius: theme.spacing(2),
    // borderBottomRightRadius: theme.spacing(2),
  },
  labelRoot: {
    // display: 'flex',
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
    // borderLeft: '3px solid #979ca6',
    // borderTopRightRadius: theme.spacing(2),
    // borderBottomRightRadius: theme.spacing(2),
  },
  expanded: {
    display: 'block',
  },
  expandedHide: {
    display: 'none',
  },
  statusMsg: {
    fontFamily: 'Suisse Intl',
    fontSize: '10px',
  },
}));

const SubAssets = () => {
  const { userInfo } = useSelector((state) => state.user);
  const {
    ppmWeekInfo,
  } = useSelector((state) => state.inspection);
  const { assetChildsInfo, assetInnerChirldsInfo } = useSelector((state) => state.ppm);

  const classes = useStyles();
  const [expanded, setExpanded] = useState(['root']);
  const [selectedNodes, setSelectedNodes] = useState([]);
  const [selectedTreeChild, setSelectedTreeChild] = useState({});
  const [selectedTreeLevel, setSelectedTreeLevel] = useState(0);
  const [treeData, setTreeData] = useState([]);

  const dispatch = useDispatch();

  function getTextLength(node) {
    const tLen = 150;
    return tLen;
  }

  const {
    ppmSettingsInfo,
  } = useSelector((state) => state.site);

  const loading = assetChildsInfo && assetChildsInfo.loading;
  const isErr = ((ppmWeekInfo && ppmWeekInfo.err) || (ppmWeekInfo && ppmWeekInfo.data && !ppmWeekInfo.data.status));
  const inspDeata = ppmWeekInfo && ppmWeekInfo.data && ppmWeekInfo.data.data
  && ppmWeekInfo.data.data.length ? ppmWeekInfo.data.data[0] : false;

  const configData = ppmSettingsInfo && ppmSettingsInfo.data && ppmSettingsInfo.data.length ? ppmSettingsInfo.data[0] : false;

  useEffect(() => {
    if (inspDeata && inspDeata.category_type && inspDeata.category_type === 'Equipment' && inspDeata.asset_id) {
      dispatch(getChildAssets(inspDeata.asset_id, appModels.EQUIPMENT));
    }
  }, [ppmWeekInfo]);

  useEffect(() => {
    if (selectedTreeChild && typeof selectedTreeChild === 'number' && inspDeata && selectedTreeChild !== inspDeata.asset_id && configData && configData.is_indirect_child && selectedTreeLevel < 3) {
      dispatch(getChildAssets(selectedTreeChild, appModels.EQUIPMENT, 'noload'));
    }
  }, [selectedTreeChild]);

  function addChildParents(data, level) {
    let children = [];
    const filterData = data && data.length ? data : [];
    if (filterData) {
      children = filterData.map((space) => (
        {
          id: space.id,
          treeNodeId: `${space.id}`,
          name: space.name,
          children: [],
          level,
          space_name: space.location_id && space.location_id.path_name ? space.location_id.path_name : '',
          childs: [],
          category: space.category_id && space.category_id.name ? space.category_id.name : '',
          err: space.error ? space.error : '',
        }));
    }
    return children;
  }

  const isSubAssets = (assetChildsInfo && assetChildsInfo.data && assetChildsInfo.data.length > 0);

  useEffect(() => {
    if (isSubAssets) {
      const parentData = [
        {
          id: inspDeata.asset_id,
          treeNodeId: `${inspDeata.asset_id}`,
          name: inspDeata.asset_name,
          level: 1,
          children: addChildParents(assetChildsInfo.data, 2),
          space_name: inspDeata.asset_path,
          childs: addChildParents(assetChildsInfo.data, 2),
          category: '',
          err: '',
        },
      ];

      setTreeData(parentData);
      setExpanded(['root', `${parentData[0].id}`]);
      setSelectedTreeChild(parentData[0].id);
    } else {
      setTreeData([]);
    }
  }, [assetChildsInfo]);

  useEffect(() => {
    if (treeData && treeData.length) {
      const index = treeData[0].children.findIndex((element) => element.id === selectedTreeChild);
      if (assetInnerChirldsInfo && assetInnerChirldsInfo.data && selectedTreeChild) {
        if (index !== -1) {
          const newTreeData = [...treeData];
          const newChildren = [...newTreeData[0].children];
          newChildren[index] = {
            ...newChildren[index],
            children: assetInnerChirldsInfo.data ? addChildParents(assetInnerChirldsInfo.data, 3) : [],
            childs: assetInnerChirldsInfo.data ? addChildParents(assetInnerChirldsInfo.data, 3) : [],
          };
          newTreeData[0] = {
            ...newTreeData[0],
            children: newChildren,
            childs: newChildren,
          };

          setTreeData(newTreeData);
        }
      } else if (assetInnerChirldsInfo && assetInnerChirldsInfo.err) {
        if (index !== -1) {
          treeData[0].children[index].children = [];
          treeData[0].childs[index].childs = [];
          setTreeData(treeData);
        }
      }
    }
  }, [assetInnerChirldsInfo]);

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
            <Col sm="12" className="occupancy inline-loader">
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
                {node.space_name ? ` | ${node.space_name}` : ''}
                {' '}
                {node.category ? ` | ${node.category}` : ''}
                {' '}
              </span>
              )}
              {assetInnerChirldsInfo && assetInnerChirldsInfo.loading && !assetInnerChirldsInfo.err && node.id === selectedTreeChild && (
              <div className="text-center">
                <Spinner size="sm" color="light" />
              </div>
              )}
            </Col>
          </Row>
        </Col>
      </Row>
    </div>
  );

  const handleChange = (event, nodes) => {
    setExpanded(nodes);
  };

  const fetchChildObjects = (node) => {
    setSelectedTreeLevel(node.level);
    setSelectedTreeChild(node.id);
    if (node.childs && !node.childs.length) {
      setExpanded(expanded.filter((item) => item !== node.id));
    }
  };

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
        {(assetChildsInfo && !assetChildsInfo.loading && !assetChildsInfo.err) && (assetChildsInfo.data && assetChildsInfo.data.length > 0)
        && node.children && (
          <>
            {Array.isArray(node.children) && node.childs && node.childs.length ? renderTreeChild(node.children) : null}
          </>
        )}
        {/* assetInnerChirldsInfo && assetInnerChirldsInfo.loading && !assetInnerChirldsInfo.err && node.id === selectedTreeChild && (
          <div className="text-center">
            <Spinner size="sm" color="dark" />
          </div>
        ) */ }
        {/* !node.parent_id && assetChildsInfo && assetChildsInfo.data && assetChildsInfo.data.length > 0 && !assetChildsInfo.loading && (node.children && node.children.length === 0)
         && !assetChildsInfo.err && node.id === selectedTreeChild && (
         <div className="text-center">
           <Spinner size="sm" color="dark" />
         </div>
        ) */ }
        {node.children && node.children.length === 0 && node && node.err && node.err.error && node.err.error.message && (
          <div className="text-danger ml-2">
            {' '}
            {node.err.error.message}
          </div>
        )}
      </TreeItem>
    ))
  );

  return (
    <>
      {(!loading && isSubAssets) && (
      <div className="ml-0 bg-white">
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
      </div>
      )}
      {loading && (
      <div className="loader" data-testid="loading-case">
        <Loader />
      </div>
      )}
      {isErr && (
      <ErrorContent errorTxt={generateErrorMessage(ppmWeekInfo && ppmWeekInfo.err ? ppmWeekInfo.err : 'No Data Found')} />
      )}
      {!isErr && inspDeata && !isSubAssets && !loading && (
      <ErrorContent errorTxt="No Data Found" />
      )}
    </>
  );
};

export default SubAssets;
