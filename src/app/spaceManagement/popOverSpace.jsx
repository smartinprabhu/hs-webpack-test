/* eslint-disable no-unused-vars */
/* eslint-disable react/jsx-props-no-spreading */
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Badge,
  Col,
  Popover,
  PopoverBody,
  Row,
} from 'reactstrap';
import Button from '@mui/material/Button';
import { ThemeProvider } from '@material-ui/core/styles';
import * as PropTypes from 'prop-types';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';

import theme from '../util/materialTheme';
import {
  getUnAllocatedSpaces, getAllocatedSpaces,
} from './utils/utils';
import { apiURL } from '../util/appUtils';
import {
  getSpaceFilters, getSelectSpace, getFloorChild, getSpaceCategory,
} from './spaceService';
import { getFloorsList } from '../assets/equipmentService';

const appModels = require('../util/appModels').default;
const appConfig = require('../config/appConfig').default;

const PopOverSpace = (props) => {
  const {
    categoryList, parentId, popoverOpen, openModal, removeCategoryData, setPopoverOpen,
  } = props;
  const [open, setOpen] = React.useState(false);
  const dispatch = useDispatch();
  const [unAllocateValue, setUnAllocateValue] = useState(null);
  const [finish, setFinish] = useState(false);
  const [allocatedSpace, setAllocatedSpace] = useState([]);

  const {
    spaceChilds, spaceCategory,
  } = useSelector((state) => state.space);
  const { userInfo } = useSelector((state) => state.user);

  const [unAllocatedSpace, setunAllocatedSpace] = useState([]);
  const [checkAddItems, setCheckAddItems] = useState([]);

  useEffect(() => {
    if (finish) {
      dispatch(getFloorChild(parentId, appModels.SPACE));
      dispatch(getFloorsList(userInfo.data.company.id, appModels.SPACE));
      getSpaceCategory();
    }
  }, [finish]);

  useEffect(() => {
    if (categoryList) {
      setCheckAddItems([categoryList]);
    }
  }, [categoryList]);

  useEffect(() => {
    if (allocatedSpace) {
      dispatch(getSelectSpace(allocatedSpace));
    }
  }, [allocatedSpace]);

  useEffect(() => {
    if (checkAddItems && checkAddItems.length > 0 && spaceChilds && spaceChilds.data) {
      dispatch(getSpaceFilters(checkAddItems));
      setunAllocatedSpace(getUnAllocatedSpaces(checkAddItems, spaceChilds.data));
    }
  }, [checkAddItems]);
  const handleOpen = () => {
    // eslint-disable-next-line no-undef
    if (inputValue.length > 0) {
      setOpen(true);
    }
  };
  useEffect(() => {
    if (unAllocateValue === null
      && spaceChilds
      && spaceChilds.data
      && spaceCategory
      && spaceCategory.data) {
      setAllocatedSpace(getAllocatedSpaces(spaceCategory.data, spaceChilds.data));
    }
  }, [spaceChilds, spaceCategory, unAllocateValue]);

  const onAddChange = () => {
    if (unAllocateValue !== null) {
      const index = allocatedSpace.findIndex((obj) => (obj.id === unAllocateValue.id));
      if (index === -1) {
        setAllocatedSpace(allocatedSpace.concat(unAllocateValue));
      }
    }
    openModal(unAllocateValue);
  };

  const remove = () => {
    removeCategoryData();
  };

  return (
    <Popover placement="right" className="spacePopover" isOpen={popoverOpen} target={`${'Popover-'}${categoryList.id}`}>
      <PopoverBody className="popover-bg">
        <div>
          <Row className="mb-2">
            <Col sm="2" md="2" lg="2">
              <img
                src={`${apiURL}${categoryList.file_path}`}
                height="30"
                width="30"
                className="mr-2"
                alt="spaceImage"
              />
            </Col>
            <Col sm="10" md="10" lg="10" className="float-left">
              <span className="font-weight-600 float-left">
                {categoryList.name}
              </span>
              <br />
              Unallocated Spaces
              <Badge color="danger" className="ml-2 p-1" pill>{unAllocatedSpace.length > 0 ? unAllocatedSpace.length : '0'}</Badge>
            </Col>
          </Row>
        </div>
        <Row>
          <Col sm="12" md="12" lg="12" className="mb-3">
            <ThemeProvider theme={theme}>
              <Autocomplete
                id="combo-box-demo"
                onOpen={handleOpen}
                size="small"
                onChange={(event, newValue) => {
                  setFinish(false);
                  setUnAllocateValue(newValue);
                }}
                options={unAllocatedSpace}
                getOptionLabel={(option) => `${option.space_name} - ${option.sequence_asset_hierarchy}`}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    className="bg-white"
                    variant="outlined"
                    placeholder="Select Spaces"
                  />
                )}
              />
            </ThemeProvider>
          </Col>
          <Col sm="12" md="12" lg="12" className="text-right">
            {unAllocateValue !== null
              ? (
                <Button variant="contained" className="add-btn btn-sm mr-2" onClick={onAddChange}>
                  Add
                </Button>
              ) : ''}
            <Button variant="contained" className="btn-sm remove-btn" onClick={remove}>Remove</Button>
          </Col>
        </Row>
      </PopoverBody>
    </Popover>
  );
};

PopOverSpace.propTypes = {
  categoryList: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.number,
    PropTypes.bool,
    PropTypes.string,
  ]).isRequired,
  parentId: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string,
    PropTypes.bool,
  ]),
  popoverOpen: PropTypes.bool.isRequired,
  setPopoverOpen: PropTypes.func.isRequired,
  openModal: PropTypes.func.isRequired,
  removeCategoryData: PropTypes.func.isRequired,
};

PopOverSpace.defaultProps = {
  parentId: undefined,
};

export default PopOverSpace;
