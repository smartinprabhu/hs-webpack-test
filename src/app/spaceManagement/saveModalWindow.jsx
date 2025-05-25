/* eslint-disable react/jsx-no-useless-fragment */
/* eslint-disable no-unused-vars */
/* eslint-disable react/no-unused-prop-types */
/* eslint-disable no-nested-ternary */
/* eslint-disable array-callback-return */
/* eslint-disable no-plusplus */
import React, { useEffect, useState } from 'react';
import {
  Card,
  Modal,
  ModalBody,
  ModalFooter,
  Table,
  Container,
  CardHeader,
} from 'reactstrap';
import Button from '@mui/material/Button';
import { useSelector, useDispatch } from 'react-redux';
import * as PropTypes from 'prop-types';
import spaceManagementBlue from '@images/spaceManagementBlue.svg';
import { orderBy } from 'lodash';

import ModalHeaderComponent from '@shared/modalHeaderComponent';
import removeIcon from '@images/remove.png';
import Loader from '../shared/loading';
import {
  getFloorChild, bulkUpdateSpaces, resetSaveData, isdragSpaceUpdate, isOpenPopoverWindow,
} from './spaceService';

const appModels = require('../util/appModels').default;

const SaveSpaceModalWindow = ({
  setIsSaveData, catagories, setReload, setCatagories, id, remove, isSaveData, setRemove, setSpaceDraggable, setPopoverOpen,
  isUpdateData, setIsUpdateData, setBulkCatagories, onClickUpdate, setOnClickUpdate, setPopoverClose, setTooltipOpen, popoverOpen, spaceCategories,
}) => {
  const {
    updateSpaceInfo, bulkDraggableSpaces,
  } = useSelector((state) => state.space);
  const [updateResult, setUpdateResult] = useState({});
  const [tableData, setTableData] = useState(false);
  const [sortBy, setSortBy] = useState('asc');
  const [sortField, setSortField] = useState('id');
  const [removeButton, setRemoveButton] = useState(false);

  const dispatch = useDispatch();
  const cancelWindow = () => {
    dispatch(resetSaveData());
    setIsSaveData(false);
    setIsUpdateData(false);
    if (catagories && !catagories.length) {
      if (id) {
        dispatch(getFloorChild(id, appModels.SPACE, spaceCategories));
      }
    }
  };

  useEffect(() => {
    if (updateSpaceInfo && updateSpaceInfo.data) {
      setUpdateResult({ status: 'success' });
    } else if (updateSpaceInfo && updateSpaceInfo.err) {
      setUpdateResult({ status: 'error' });
    }
  }, [updateSpaceInfo]);

  const toggle = () => {
    if (isSaveData) {
      setCatagories([]);
    }
    if (isUpdateData) {
      setBulkCatagories([]);
      dispatch(isdragSpaceUpdate(false));
      if (updateSpaceInfo && updateSpaceInfo.data && bulkDraggableSpaces) {
        bulkDraggableSpaces.splice(0, bulkDraggableSpaces.length);
      }
    }
    dispatch(resetSaveData());
    setUpdateResult({});
    setIsSaveData(false);
    setIsUpdateData(false);
    if (id) {
      dispatch(getFloorChild(id, appModels.SPACE, spaceCategories));
    }
    setReload(true);
  };
  const filterSpaces = (catagoryType) => {
    const categoryData = {};
    catagories.map((filterData) => {
      categoryData[
        filterData.asset_category_id[1]
      ] = catagories.filter(
        (item) => item.asset_category_id[1] === filterData.asset_category_id[1],
      );
    });
    Object.keys(categoryData).map((key) => {
      if (catagoryType === key) {
        categoryData[key] = orderBy(categoryData[key], [sortField], [sortBy]);
      }
    });
    setTableData(categoryData);
  };
  const saveSpaces = () => {
    if (catagories && catagories.length) {
      // setSpaceDraggable(false);
      const catagoriesArray = [];
      catagories.map((spaces) => {
        const space = {
          id: parseInt(spaces.id),
          latitude: spaces.latitude,
          longitude: spaces.longitude,
        };
        catagoriesArray.push(space);
      });
      dispatch(bulkUpdateSpaces({ values: catagoriesArray }));
    }
    setRemoveButton(true);
    setPopoverOpen(false);
    setPopoverClose(false);
    setTooltipOpen(false);
  };

  const saveSpace = () => {
    setPopoverOpen(false);
    if (bulkDraggableSpaces && bulkDraggableSpaces.length) {
      const catagoriesArray = [];
      bulkDraggableSpaces.map((spaces) => {
        const space = {
          id: parseInt(spaces.space_id),
          latitude: spaces.latitude,
          longitude: spaces.longitude,
        };
        catagoriesArray.push(space);
      });
      dispatch(bulkUpdateSpaces({ values: catagoriesArray }));
      setBulkCatagories([]);
    }
    setRemoveButton(true);
  };

  const removeSelectedSpace = (removeSpace) => {
    const spaces = catagories;
    const index = catagories.findIndex((space) => space.id === removeSpace.id);
    if (catagories[index]) {
      spaces[index].latitude = false;
      spaces[index].longitude = false;
    }
    spaces.splice(index, 1);
    setCatagories(spaces);
    setReload(true);
    setRemove(true);
  };
  useEffect(() => {
    if (remove) {
      filterSpaces();
      setRemove(false);
    }
  }, [remove]);
  useEffect(() => {
    if (catagories && isSaveData) {
      filterSpaces();
    }
  }, [isSaveData, catagories]);
  let tableKey = 1;
  let tableIndex = 0;

  useEffect(() => {
    if (isSaveData) {
      setPopoverOpen(false);
    }
  }, [isSaveData]);

  const isPopover = () => {
    setPopoverOpen(false);
  };

  useEffect(() => {
    if (isUpdateData) {
      dispatch(isOpenPopoverWindow(false));
    }
  }, [isUpdateData]);

  return (
    <Modal className="save-space-modal" isOpen={isSaveData || isUpdateData} size="lg" onClick={isPopover}>
      <div className="mt-2">
        <ModalHeaderComponent imagePath={spaceManagementBlue} closeModalWindow={cancelWindow} title="Allocation Summary" response={updateSpaceInfo} />
      </div>
      <ModalBody className="mt-0 pt-2">
        {catagories && catagories.length ? (
          <>
            <Container>
              {Object.keys(tableData).map((key) => (
                <Card className="border-0 mt-1" key={tableIndex++}>
                  <CardHeader className="p-1 head-bg border-0">
                    <img src={tableData[key][0].category_image} height="30" width="30" alt="category" className="ml-2 mr-1 mb-1" />
                    <span className="font-weight-700 font-medium ml-2">
                      {key}
                    </span>
                  </CardHeader>
                  <div className="pl-5 pr-4 pt-1 pb-0">
                    <Table responsive className="mb-0 font-weight-400 border-0 assets-table" width="100%">
                      <thead>
                        <tr>
                          <th className="p-2 bt-0 ">
                            <span
                              aria-hidden="true"
                              className="sort-by cursor-pointer"
                              onClick={() => {
                                setSortBy(sortBy === 'asc' ? 'desc' : 'asc');
                                setSortField('space_name'); filterSpaces(key);
                              }}
                            >
                              Name
                            </span>
                          </th>
                          <th className="p-2 bt-0">
                            <span
                              aria-hidden="true"
                              className="sort-by cursor-pointer"
                              onClick={() => {
                                setSortBy(sortBy === 'asc' ? 'desc' : 'asc');
                                setSortField('path_name'); filterSpaces(key);
                              }}
                            >
                              Location
                            </span>
                          </th>
                          <th className="p-2 bt-0">
                            {}
                            <span />
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {tableData[key]
                            && tableData[key].length
                            && tableData[key].map((space) => (
                              <tr key={tableKey++}>
                                <td className="p-2">{space.space_name}</td>
                                <td className="p-2">{space.path_name}</td>
                                {setRemove && !removeButton && (
                                  <td className="p-2">
                                    <Button
                                      className="btn-removeButton"
                                      size="sm"
                                      variant="contained"
                                      onClick={() => removeSelectedSpace(space)}
                                    >
                                      <img
                                        src={removeIcon}
                                        alt="space"
                                        height="15"
                                        width="15"
                                        aria-hidden="true"
                                        className="mr-1"
                                      />
                                      Remove
                                    </Button>
                                  </td>
                                )}
                              </tr>
                            ))}
                      </tbody>
                    </Table>
                  </div>
                </Card>
              ))}
            </Container>
            {updateResult.status === 'success' && tableData && (
            // eslint-disable-next-line react/jsx-no-comment-textnodes
            <h5 className="text-center text-success mt-2">
              {catagories.length === 1 ? 'Space ' : catagories.length > 1 ? 'Spaces ' : ''}
              <span>
                added successfully.
              </span>
            </h5>
            )}
          </>
        ) : ''}
        {bulkDraggableSpaces && bulkDraggableSpaces.length ? (
          <>
            <Container>
              <div className="pl-5 pr-4 pt-1 pb-0">
                <Table responsive className="mb-0 font-weight-400 border-0 assets-table" width="100%">
                  <thead>
                    <tr>
                      <th className="ml-2">
                        <span aria-hidden="true" className="p-5">Name</span>
                      </th>
                      <th>
                        <span aria-hidden="true" className="p-5">Location</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.values(bulkDraggableSpaces).map((key) => (
                      <tr className="ml-2" key={key.id}>
                        <td className="p-2">{key && key.space_name}</td>
                        <td className="p-2">{key && key.path_name}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            </Container>
            {updateResult.status === 'success' && bulkDraggableSpaces && (
            // eslint-disable-next-line react/jsx-no-comment-textnodes
            <h5 className="text-center text-success mt-2">
              {bulkDraggableSpaces.length === 1 ? 'Space ' : bulkDraggableSpaces.length > 1 ? 'Spaces ' : ''}
              <span>
                added successfully.
              </span>
            </h5>
            )}
          </>
        ) : ''}
        {updateResult.status === 'error' && (
        <h5 className="text-center text-danger mt-2">
          {updateSpaceInfo
                && updateSpaceInfo.err
                && updateSpaceInfo.err.error
                && updateSpaceInfo.err.error.message
                && (
                  <>{updateSpaceInfo.err.error.message}</>
                )}
        </h5>
        )}
        {updateSpaceInfo && updateSpaceInfo.loading && (
        <div className="text-center mt-2"><Loader /></div>
        )}
        {isSaveData && catagories && !catagories.length ? (
          <h6 className="text-center text-danger mt-2">
            Please Select Spaces.
          </h6>
        ) : ''}
      </ModalBody>
      <ModalFooter>
        {updateResult.status === 'success' ? (
          <Button variant="contained" onClick={toggle} className="ok-btn" size="sm">Ok</Button>
        ) : (
          <>
            <Button
              size="sm"
              variant="contained"
              className="btn-cancel"
              onClick={cancelWindow}
            >
              Cancel
            </Button>
            {catagories && catagories.length && isSaveData ? (
              <Button
                size="sm"
               variant="contained"
                onClick={saveSpaces}
                className="px-3 save-btn"
              >
                Save
              </Button>
            ) : ''}
            {bulkDraggableSpaces && bulkDraggableSpaces.length && isUpdateData ? (
              <Button
                size="sm"
               variant="contained"
                onClick={saveSpace}
                className="px-3 save-btn"
              >
                Save
              </Button>
            ) : ''}
          </>
        )}
      </ModalFooter>
    </Modal>
  );
};
SaveSpaceModalWindow.propTypes = {
  id: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string,
    PropTypes.bool,
  ]),
  isSaveData: PropTypes.bool,
  setIsSaveData: PropTypes.func,
  isUpdateData: PropTypes.bool,
  popoverOpen: PropTypes.bool,
  setIsUpdateData: PropTypes.func,
  onClickUpdate: PropTypes.bool,
  setOnClickUpdate: PropTypes.func,
  setPopoverClose: PropTypes.func,
  setTooltipOpen: PropTypes.func,
  catagories: PropTypes.arrayOf(
    PropTypes.shape({}),
  ),
  spaceCategories: PropTypes.arrayOf(
    PropTypes.shape({}),
  ),
  setCatagories: PropTypes.func.isRequired,
  bulkCatagories: PropTypes.arrayOf(
    PropTypes.shape({}),
  ),
  setBulkCatagories: PropTypes.func,
  setReload: PropTypes.func,
  setRemove: PropTypes.func,
  setSpaceDraggable: PropTypes.func,
  setPopoverOpen: PropTypes.func,
  remove: PropTypes.bool,
};
SaveSpaceModalWindow.defaultProps = {
  id: undefined,
  isSaveData: false,
  isUpdateData: false,
  popoverOpen: false,
  onClickUpdate: false,
  catagories: [],
  spaceCategories: [],
  bulkCatagories: [],
  remove: false,
  setRemove: undefined,
  setReload: () => { },
  setSpaceDraggable: () => { },
  setPopoverOpen: () => { },
  setOnClickUpdate: () => { },
  setTooltipOpen: () => { },
  setPopoverClose: () => { },
  setBulkCatagories: () => { },
  setIsUpdateData: () => { },
  setIsSaveData: () => { },
};
export default SaveSpaceModalWindow;
