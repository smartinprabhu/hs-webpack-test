/* eslint-disable radix */
/* eslint-disable react/no-danger */
/* eslint-disable import/no-unresolved */
import React, { useEffect, useState } from 'react';
import {
  Card,
  CardBody,
  Col,
  Table,
  Row,
} from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faTrashAlt,
} from '@fortawesome/free-solid-svg-icons';
import { useSelector, useDispatch } from 'react-redux';
import { ThemeProvider } from '@material-ui/core/styles';
import Loader from '@shared/loading';
import {
  Box, Button, Tooltip,
  Dialog, DialogActions, DialogContent, DialogContentText,
} from '@mui/material';

import plusCircle from '@images/icons/plusCircleMini.svg';
import editIcon from '@images/icons/edit.svg';
import '../../helpdesk/viewTicket/style.scss';
import AddPart from './partsDetails/addPart';
import EditPart from './partsDetails/editPart';
import {
  getOrderParts, resetAddedPartsRows, resetUpdateParts, resetAddParts, getOrderDetail, deletePart, getInventoryPartList, resetDeletePart,
} from '../workorderService';
import EnterUsedQuantity from './partsDetails/enterUsedQuantity';
import theme from '../../util/materialTheme';
import {
  getOrderWithInventory,
} from '../utils/utils';
import { extractTextObject } from '../../util/appUtils';
import DialogHeader from '../../commonComponents/dialogHeader';

const appModels = require('../../util/appModels').default;

const Parts = () => {
  const dispatch = useDispatch();
  const [addModal, showAddModal] = useState(false);
  const [editModal, showEditModal] = useState(false);
  const [usedQuantityModal, showUsedQuantityModal] = useState(false);
  const { userInfo } = useSelector((state) => state.user);
  const [modalAlert, setModalAlert] = useState(false);
  const [deletePartSpare, setDeletePartSpare] = useState(false);
  const [partId, setDeletePartId] = useState(false);
  const {
    workorderDetails, orderParts, inventoryParts, deletePartsInfo,
  } = useSelector((state) => state.workorder);

  const orderPartList = orderParts && orderParts.data && orderParts.data.length > 0 ? orderParts.data : false;
  const inventoryPart = inventoryParts && inventoryParts.data && inventoryParts.data.length > 0 ? inventoryParts.data : false;

  const toggleAlert = () => {
    setModalAlert(false);
  };

  useEffect(() => {
    if (userInfo && userInfo.data) {
      dispatch(getInventoryPartList());
    }
  }, [userInfo]);

  useEffect(() => {
    if (userInfo && userInfo.data && workorderDetails && workorderDetails.data) {
      const ids = workorderDetails.data.length > 0 ? workorderDetails.data[0].parts_lines : [];
      dispatch(getOrderParts(ids, appModels.PARTLINES));
    }
  }, [userInfo, workorderDetails]);

  const loadWorkorder = () => {
    dispatch(getOrderDetail(workorderDetails && workorderDetails.data ? workorderDetails.data[0].id : '', appModels.ORDER));
  };

  useEffect(() => {
    if (userInfo && userInfo.data && deletePartsInfo && deletePartsInfo.data) {
      const viewId = workorderDetails && workorderDetails.data && workorderDetails.data.length > 0 ? workorderDetails.data[0].id : '';
      dispatch(getOrderDetail(viewId, appModels.ORDER));
      dispatch(resetDeletePart());
    }
  }, [userInfo, deletePartsInfo]);

  useEffect(() => {
    if (deletePartSpare) {
      dispatch(deletePart(partId, appModels.PARTLINES));
    } else {
      setDeletePartId(false);
    }
  }, [deletePartSpare]);

  const cancelParts = () => {
    dispatch(resetAddedPartsRows());
    dispatch(resetAddParts());
  };

  const cancelEditParts = () => {
    const ids = workorderDetails.data.length > 0 ? workorderDetails.data[0].parts_lines : [];
    if (ids && ids.length && ids.length > 0) {
      dispatch(getOrderParts(ids, appModels.PARTLINES));
    }
    dispatch(resetAddedPartsRows());
    dispatch(resetUpdateParts());
  };

  const getReturnPart = (partqty, usedqty) => {
    const value = partqty - usedqty;
    return value;
  };

  const getAvailableUsedQuantity = (array) => {
    const result = array && array.length ? array.filter((obj) => (obj.used_qty !== obj.parts_qty)) : [];
    return result.length;
  };

  const getReturnValues = (array) => {
    const newArray = [];
    for (let i = 0; i < array.length; i += 1) {
      const value = (array[i].parts_qty - array[i].used_qty);
      if (value !== 0 && array[i].parts_id && array[i].parts_id.length && array[i].parts_id.length > 0) {
        const namePart = array[i].parts_id[1] && array[i].parts_id[1];
        const newValue = `${namePart}(${value})`;
        newArray.push(newValue);
      }
    }
    const value = newArray.join(',');
    return value;
  };

  const deletePartRow = (id) => {
    setDeletePartId(id);
    setModalAlert(true);
  };

  const state = workorderDetails && workorderDetails.data.length > 0 ? workorderDetails.data[0].state : [];

  return (
    <Box
      sx={{
        fontFamily: 'Suisse Intl',
      }}
    >
      <ThemeProvider theme={theme}>
        <Row className="parts-tab font-size-13">
          <Col sm="12" md="12" lg="12" xs="12">
            <Row className="ml-1 mr-1">
              <Col xs="12" md="12" lg="12" sm="12" className="p-0 text-right">
                {state !== 'done'
                  ? (
                    <Tooltip title="Add" placement="top">
                      <img src={plusCircle} className="mb-1" alt="addparts" height="15" width="15" onClick={() => showAddModal(true)} />
                    </Tooltip>
                  ) : ''}
                {(orderPartList) && orderPartList.length > 0 && (state !== 'done')
                  ? (
                    <Tooltip title="Edit" placement="top">
                      <img src={editIcon} className="ml-2 mt-n3px" alt="close" onClick={() => showEditModal(true)} />
                    </Tooltip>
                  )
                  : ''}
              </Col>
            </Row>
            <Row>
              <Col xs="12" md="12" lg="12" sm="12">
                <Table responsive>
                  <thead>
                    <tr className="border-bottom">
                      <th className="p-2 min-width-160 border-0">
                        Part/Spare
                      </th>
                      <th className="p-2 min-width-160 border-0">
                        Requested Quantity
                      </th>
                      <th className="p-2 min-width-100 border-0">
                        Used Quantity
                      </th>
                      <th className="p-2 min-width-100 border-0">
                        Products Category
                      </th>
                      <th className="p-2  border-0">
                        <span className="invisible">Del</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {(orderPartList) && orderPartList.length > 0 && orderPartList.map((pl) => (
                      <tr className="border-bottom" key={pl.id}>
                        <td className="p-2 border-0">
                          {pl.parts_id && pl.parts_id[1] ? pl.parts_id[1] : ''}
                          {` (${getOrderWithInventory(pl.parts_id && pl.parts_id[0] ? pl.parts_id[0] : false, inventoryPart)}) `}
                        </td>
                        <td className="p-2 border-0">
                          <div className="w-20">
                            {pl.parts_qty}
                          </div>
                          {' '}
                        </td>
                        <td className="p-2 border-0">
                          {pl.used_qty}
                        </td>
                        <td className="p-2 border-0">
                          {extractTextObject(pl.parts_categ_id)}
                        </td>
                        <td className="p-2 border-0">
                          {state !== 'done'
                            ? <FontAwesomeIcon onClick={() => deletePartRow(pl.id)} className="mr-1 ml-1 cursor-pointer" size="sm" icon={faTrashAlt} />
                            : ''}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
                {(orderParts && orderParts.loading) || (orderPartList && orderPartList.length)
                  ? ''
                  : <div className="font-11 mt-2 ml-2">No Parts/Spares. Click add button for Parts/Spares.</div>}
                {orderParts && orderParts.loading && (
                  <div className="font-11 pt-5 text-center" colSpan="4">
                    <Loader />
                  </div>
                )}
              </Col>
            </Row>
            <br />
            {(orderPartList) && orderPartList.length > 0 && getAvailableUsedQuantity(orderPartList) !== 0 && state !== 'done'
              ? (
                <Button
                  onClick={() => showUsedQuantityModal(true)}
                  className="mr-1 float-right"
                >
                  ENTER USED QUANTITY
                </Button>
              )
              : ''}
          </Col>
        </Row>
        {(orderPartList) && orderPartList.length > 0 && state === 'done'
          ? (
            <Row>
              <Col sm="12" md="12" lg="12" xs="12">
                <Card className="no-border-radius">
                  <CardBody className="p-0 bg-porcelain">
                    <p className="ml-2 mb-1 mt-1 font-weight-800 font-side-heading">Return Parts/Spares</p>
                  </CardBody>
                </Card>
                <Table responsive>
                  <thead>
                    <tr className="border-bottom">
                      <th className="p-2 min-width-160 border-0">
                        Part/Spare
                      </th>
                      <th className="p-2 min-width-160 border-0">
                        Planned
                      </th>
                      <th className="p-2 min-width-100 border-0">
                        Used
                      </th>
                      <th className="p-2 border-0">
                        Return
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {(orderPartList) && orderPartList.length > 0 && orderPartList.map((pl) => (
                      (getReturnPart(pl.parts_qty, pl.used_qty) > 0) && (
                        <tr className="border-bottom" key={pl.id}>
                          <td className="p-2 border-0">
                            {pl.parts_id && pl.parts_id[1] ? pl.parts_id[1] : ''}
                            {` (${getOrderWithInventory(pl.parts_id && pl.parts_id[0] ? pl.parts_id[0] : false, inventoryPart)}) `}
                          </td>
                          <td className="p-2 border-0">
                            <div className="d-flex">
                              <div className="w-20">{pl.parts_qty}</div>
                            </div>
                          </td>
                          <td className="p-2 border-0">
                            {pl.used_qty}
                          </td>
                          <td className="p-2 border-0">
                            {pl.parts_qty - pl.used_qty}
                          </td>
                        </tr>
                      )
                    ))}
                  </tbody>
                </Table>
                <span className="text-danger font-11 ml-2">
                  You need to return
                  {' '}
                  {getReturnValues(orderPartList)}
                  {' '}
                  to the inventory.
                </span>
              </Col>
            </Row>
          )
          : ''}
        {addModal && (
          <AddPart
            atFinish={() => {
              showAddModal(false);
              loadWorkorder();
              cancelParts();
            }}
            afterReset={() => {
              showAddModal(false);
              cancelParts();
            }}
            workorderDetails={workorderDetails}
            addModal
          />
        )}
        {editModal && (
          <EditPart
            orderPartsEdit={orderPartList}
            inventoryPartOrder={inventoryPart}
            atFinish={() => {
              showEditModal(false);
              loadWorkorder();
              cancelEditParts();
            }}
            afterReset={() => {
              showEditModal(false);
              cancelParts();
              cancelEditParts();
            }}
            editModal
          />
        )}
        {usedQuantityModal && (
          <EnterUsedQuantity
            orderPartsEdit={orderPartList}
            inventoryPartOrder={inventoryPart}
            atFinish={() => {
              showUsedQuantityModal(false);
              loadWorkorder();
              cancelEditParts();
            }}
            afterReset={() => {
              showUsedQuantityModal(false);
              cancelParts();
              cancelEditParts();
            }}
            usedQuantityModal
          />
        )}

        <Dialog maxWidth="xl" open={modalAlert}>
          <DialogHeader title="Alert" onClose={toggleAlert} />
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              <Box
                sx={{
                  width: '100%',
                  height: '100%',
                  backgroundColor: '#F6F8FA',
                  padding: '20px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '10%',
                  fontFamily: 'Suisse Intl',
                }}
              >
                Are you sure, you want to delete this part/spare ?
              </Box>
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button variant="contained" onClick={() => { setDeletePartSpare(Math.random()); setModalAlert(false); }}>Ok</Button>
          </DialogActions>
        </Dialog>
      </ThemeProvider>
    </Box>
  );
};

export default Parts;
