/* eslint-disable radix */
/* eslint-disable import/no-unresolved */
/* eslint-disable react/no-unused-prop-types */
/* eslint-disable no-nested-ternary */
/* eslint-disable array-callback-return */
import React, { useEffect, useState } from 'react';
import {
  Modal,
  ModalBody,
  ModalFooter,
  Table,
  Container,
} from 'reactstrap';
import Button from '@mui/material/Button';
import { useSelector, useDispatch } from 'react-redux';
import * as PropTypes from 'prop-types';

import spaceManagementBlue from '@images/icons/spaceManagementBlue.svg';
import ModalHeaderComponent from '@shared/modalHeaderComponent';
import Loader from '@shared/loading';
import {
  bulkUpdateSpaces, isdragSpaceUpdate, isOpenPopoverWindow, resetSaveData, newBulkDraggableSpaceData,
} from '../../spaceManagement/spaceService';
import { resetSpaceEquipments } from '../equipmentService';

const SaveModalWindow = ({
  setReload, setPopoverOpen,
  isUpdateData, setIsUpdateData, setBulkCatagories,
}) => {
  const {
    updateSpaceInfo, bulkDraggableSpaces,
  } = useSelector((state) => state.space);
  const [updateResult, setUpdateResult] = useState({});

  const dispatch = useDispatch();

  const cancelWindow = () => {
    dispatch(resetSaveData());
    setIsUpdateData(false);
  };

  useEffect(() => {
    if (updateSpaceInfo && updateSpaceInfo.data) {
      setUpdateResult({ status: 'success' });
    } else if (updateSpaceInfo && updateSpaceInfo.err) {
      setUpdateResult({ status: 'error' });
    }
  }, [updateSpaceInfo]);

  const toggles = () => {
    if (updateSpaceInfo && updateSpaceInfo.data && bulkDraggableSpaces) {
      bulkDraggableSpaces.splice(0, bulkDraggableSpaces.length);
    }
    dispatch(isdragSpaceUpdate(false));
    dispatch(resetSpaceEquipments());
    dispatch(resetSaveData());
    dispatch(newBulkDraggableSpaceData([]));
    setUpdateResult({});
    setBulkCatagories([]);
    setIsUpdateData(false);
    setReload(true);
  };

  const saveSpace = () => {
    setPopoverOpen(false);
    if (bulkDraggableSpaces && bulkDraggableSpaces.length) {
      const catagoriesArray = [];
      bulkDraggableSpaces.map((spaces) => {
        const space = {
          id: parseInt(spaces.asset_id),
          xpos: spaces.xpos,
          ypos: spaces.ypos,
        };
        catagoriesArray.push(space);
      });
      dispatch(bulkUpdateSpaces({ values: catagoriesArray }));
      setBulkCatagories([]);
    }
  };

  const isPopover = () => {
    setPopoverOpen(false);
  };

  useEffect(() => {
    if (isUpdateData) {
      dispatch(isOpenPopoverWindow(false));
    }
  }, [isUpdateData]);

  return (
    <>
      {bulkDraggableSpaces && bulkDraggableSpaces.length && (
        <>
          <Modal isOpen={isUpdateData} onClick={isPopover} size="lg">
            <div className="mt-2">
              <ModalHeaderComponent imagePath={spaceManagementBlue} closeModalWindow={cancelWindow} title="Allocation Summary" response={updateSpaceInfo} />
            </div>
            <ModalBody className="mt-0 pt-2">
              <Container>
                <div className="pl-5 pr-4 pt-1 pb-0">
                  <Table responsive className="mb-0 font-weight-400 font-size-13px border-0" width="100%">
                    <thead>
                      <th className="p-2">Name</th>
                      <th className="p-2">Location</th>
                    </thead>
                    <tbody>
                      {Object.values(bulkDraggableSpaces).map((key) => (
                        <tr>
                          <td className="p-2">
                            {key && key.asset_name}
                            {' '}
                            (
                            {' '}
                            {key && key.asset_number}
                            {' '}
                            )
                          </td>
                          <td className="p-2">{key && key.location}</td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              </Container>
              {updateResult.status === 'success' && bulkDraggableSpaces && (
                // eslint-disable-next-line react/jsx-no-comment-textnodes
                <h5 className="text-center text-success font-10 mt-2">
                  {bulkDraggableSpaces.length === 1 ? 'Asset ' : bulkDraggableSpaces.length > 1 ? 'Assets ' : ''}
                  <span>
                    location updated successfully.
                  </span>
                </h5>
              )}
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
              {bulkDraggableSpaces && !bulkDraggableSpaces.length ? (
                <h6 className="text-center text-danger mt-2">
                  Please Select Spaces.
                </h6>
              ) : ''}
            </ModalBody>
            <ModalFooter>
              {updateResult.status === 'success' ? (
                <Button onClick={toggles}  variant="contained" size="sm">Ok</Button>
              ) : (
                <>
                  {bulkDraggableSpaces && bulkDraggableSpaces.length ? (
                    <Button
                      size="sm"
                       variant="contained"
                      onClick={saveSpace}
                      className="px-3"
                    >
                      Save
                    </Button>
                  ) : ''}
                </>
              )}
            </ModalFooter>
          </Modal>

        </>
      )}
    </>
  );
};
SaveModalWindow.propTypes = {
  id: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string,
  ]),
  isSaveData: PropTypes.bool,
  setIsSaveData: PropTypes.func.isRequired,
  isUpdateData: PropTypes.bool,
  popoverOpen: PropTypes.bool,
  setIsUpdateData: PropTypes.func.isRequired,
  onClickUpdate: PropTypes.bool,
  setOnClickUpdate: PropTypes.func,
  setPopoverClose: PropTypes.func,
  setTooltipOpen: PropTypes.func,
  catagories: PropTypes.arrayOf(
    PropTypes.shape({}),
  ),
  setCatagories: PropTypes.func.isRequired,
  bulkCatagories: PropTypes.arrayOf(
    PropTypes.shape({}),
  ),
  setBulkCatagories: PropTypes.func.isRequired,
  setReload: PropTypes.func,
  setRemove: PropTypes.func,
  setSpaceDraggable: PropTypes.func,
  setPopoverOpen: PropTypes.func,
  remove: PropTypes.bool,
};
SaveModalWindow.defaultProps = {
  id: undefined,
  isSaveData: false,
  isUpdateData: false,
  popoverOpen: false,
  onClickUpdate: false,
  catagories: [],
  bulkCatagories: [],
  remove: false,
  setRemove: undefined,
  setReload: () => { },
  setSpaceDraggable: () => { },
  setPopoverOpen: () => { },
  setOnClickUpdate: () => { },
  setTooltipOpen: () => { },
  setPopoverClose: () => { },
};
export default SaveModalWindow;
