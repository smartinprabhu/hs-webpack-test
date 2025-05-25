/* eslint-disable operator-assignment */
/* eslint-disable import/no-unresolved */
/* eslint-disable react/jsx-props-no-spreading */
import React, { useEffect, useState } from 'react';
import {
  Col,
  Label,
  Row,
} from 'reactstrap';
import * as PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import {
  Box, Button, Checkbox,
  Dialog, DialogActions, DialogContent, DialogContentText,
} from '@mui/material';

import SuccessAndErrorFormat from '@shared/successAndErrorFormat';
import Loader from '@shared/loading';
import addIcon from '@images/icons/addCircle.svg';
import addIconDisabled from '@images/icons/addCircleGrey.svg';
import minusIcon from '@images/icons/minusCircleBlue.svg';
import minusIconDisabled from '@images/icons/minusCircleGrey.svg';
import {
  updatePartsOrder, resetUpdateParts, createInventoryOrder,
} from '../../workorderService';
import { getOrderWithInventory, getNewArrayUsedQuantity } from '../../utils/utils';
import DialogHeader from '../../../commonComponents/dialogHeader';

const appModels = require('../../../util/appModels').default;

const EnterUsedQuantity = (props) => {
  const {
    usedQuantityModal, atFinish, afterReset, orderPartsEdit, inventoryPartOrder,
  } = props;
  const dispatch = useDispatch();
  const [modal, setModal] = useState(usedQuantityModal);
  const [addedParts, setAddedParts] = useState([]);
  const [partListAdd, setPartListAdd] = useState(false);
  const [confirmMessage, showConfirmMessage] = useState(false);
  const [checkedData, setCheckedData] = useState(false);

  const {
    updatePartsOrderInfo, workorderDetails,
  } = useSelector((state) => state.workorder);

  const toggle = () => {
    setModal(!modal);
    atFinish();
  };

  const toggleCancel = () => {
    setModal(!modal);
    afterReset();
  };

  useEffect(() => {
    if (partListAdd) {
      setAddedParts(addedParts);
    }
  }, [partListAdd]);

  useEffect(() => {
    if (updatePartsOrderInfo && updatePartsOrderInfo.data) {
      const id = workorderDetails && workorderDetails.data && workorderDetails.data.length ? workorderDetails.data[0].id : '';
      const payload = { order_id: id };
      dispatch(createInventoryOrder(payload));
    } else {
      setModal(modal);
    }
  }, [updatePartsOrderInfo]);

  useEffect(() => {
    if (orderPartsEdit) {
      setAddedParts(orderPartsEdit);
      const dataArray = orderPartsEdit;
      const newData = dataArray.map((obj) => ({
        ...obj,
        used_qty: obj.used_qty > 0 ? (obj.parts_qty - obj.used_qty) : obj.parts_qty,
        balance_used_quantity: obj.used_qty > 0 ? (obj.parts_qty - obj.used_qty) : obj.parts_qty,
        used_qty_initial: obj.used_qty,
      }));
      setAddedParts(newData);
      setCheckedData(true);
    }
  }, [orderPartsEdit]);

  const onChangeMinus = (e, id) => {
    const newData = addedParts;
    const index = newData.findIndex((obj1) => (obj1.id === id));
    if (index > -1) {
      newData[index].used_qty = newData[index].used_qty - 1;
    }
    setAddedParts(newData);
    setPartListAdd(Math.random());
  };

  const onChangeAdd = (e, id) => {
    const newData = addedParts;
    const index = newData.findIndex((obj1) => (obj1.id === id));
    if (index > -1) {
      newData[index].used_qty = newData[index].used_qty + 1;
    }
    setAddedParts(newData);
    setPartListAdd(Math.random());
  };

  const handleChangeMovePlanned = (event) => {
    const { checked } = event.target;
    if (checked) {
      const dataArray = addedParts;
      const newData = dataArray.map((obj) => ({
        ...obj,
        used_qty: obj.used_qty > 0 ? (obj.parts_qty - obj.used_qty) : obj.parts_qty,
        balance_used_quantity: obj.used_qty > 0 ? (obj.parts_qty - obj.used_qty) : obj.parts_qty
      }));
      setAddedParts(newData);
      setCheckedData(true);
    } else {
      const dataArray = orderPartsEdit;
      const newData = dataArray.map((obj) => ({
        ...obj,
        used_qty: obj.used_qty,
      }));
      setAddedParts(newData);
      setCheckedData(false);
    }
    setPartListAdd(Math.random());
  };

  const getMinusQuantity = (qty, qtyNew) => {
    let addQuantity = true;
    if (qty === qtyNew) {
      addQuantity = false;
    }
    return addQuantity;
  };

  const getAddQuantity = (qty, qtyNew, qtyInitial) => {
    let addQuantity = true;
    if (qty === qtyNew || qty === qtyInitial) {
      addQuantity = false;
    }
    return addQuantity;
  };

  const onSaveParts = () => {
    showConfirmMessage(true);
  };

  const onClickBack = () => {
    dispatch(resetUpdateParts());
    showConfirmMessage(false);
  };

  const onConfirmParts = () => {
    const pickingId = workorderDetails && workorderDetails.data && workorderDetails.data.length && workorderDetails.data[0].picking_id[0] ? workorderDetails.data[0].picking_id[0] : '';
    const payload = getNewArrayUsedQuantity(addedParts, pickingId);
    for (let i = 0; i < payload.length; i += 1) {
      const obj = payload[i];
      const values = {
        parts_id: obj.parts_id[0], parts_qty: obj.parts_qty, used_qty: obj.used_qty_initial > 0 ? (obj.used_qty + obj.used_qty_initial) : obj.used_qty, maintenance_id: obj.maintenance_id[0], picking_id: obj.picking_id[0], parts_uom: obj.parts_uom[0],
      };
      dispatch(updatePartsOrder(payload[i].id, values, appModels.PARTLINES));
    }
  };

  return (
    <Dialog maxWidth="xl" open={modal}>
      <DialogHeader title={confirmMessage ? 'Parts Usage Confirmation' : 'Enter Used Quantity'} onClose={toggleCancel} />
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
            {updatePartsOrderInfo && !updatePartsOrderInfo.err && !updatePartsOrderInfo.data && (
              <>
                <Row className="ml-3 mr-3 font-size-13">
                  {confirmMessage
                    ? (
                      <Col sm="12" md="12" lg="12" xs="12" className="font-size-13 text-center border-top">
                        <div className="pt-3 pb-3 text-center text-danger">If you confirm the used quantity of the parts, you can’t edit it.</div>
                      </Col>
                    )
                    : (
                      <>
                        <Col sm="12" md="12" lg="12" xs="12" className="font-size-13 text-center border-top">
                          <div className="pt-2 pb-2 mb-3">You have not entered the used quantity in the parts</div>
                        </Col>
                        <Col sm="12" md="12" lg="12" xs="12" className="font-size-13 pl-2px ml-2">
                          <Checkbox
                            type="checkbox"
                            id="checkId"
                            checked={checkedData}
                            onChange={handleChangeMovePlanned}
                          />
                          <Label htmlFor="checkId" className="padding-top-1">Mark planned as used</Label>
                          {' '}
                        </Col>
                      </>
                    )}
                </Row>
                <Row className="ml-3 mr-3">
                  <Col sm="12" md="12" lg="12" xs="12" className="font-size-13">
                    <Row className="border-bottom border-top pt-2 pb-2">
                      <Col sm="5" md="5" lg="5" xs="12">
                        <span className="font-weight-500">Part/Spare</span>
                      </Col>
                      <Col sm="3" md="3" lg="3" xs="12">
                        <span className="font-weight-500">Quantity Required</span>
                      </Col>
                      <Col sm="4" md="4" lg="4" xs="12" className="text-center">
                        <span className="font-weight-500">Used</span>
                      </Col>
                    </Row>
                    {(addedParts && addedParts.length && addedParts.map((cl) => (
                      <Row className="pt-3 pb-3" key={cl.id}>
                        <Col sm="5" md="5" lg="5" xs="12">
                          {`${cl.parts_id && cl.parts_id[1] ? cl.parts_id[1] : ''} (${getOrderWithInventory(cl.parts_id && cl.parts_id[0] ? cl.parts_id[0] : false, inventoryPartOrder)}) `}
                        </Col>
                        <Col sm="3" md="3" lg="3" xs="12">
                          {cl.parts_qty}
                        </Col>
                        <Col sm="4" md="4" lg="4" xs="12" className="text-center">
                          {confirmMessage || !checkedData
                            ? cl.used_qty
                            : (
                              <div className="d-flex ml-5">
                                {getMinusQuantity(cl.used_qty, 0)
                                  ? <img src={minusIcon} alt="minusquantity" className="cursor-pointer" height="20" aria-hidden="true" onClick={(e) => onChangeMinus(e, cl.id)} />
                                  : <img src={minusIconDisabled} alt="minusquantity" height="20" aria-hidden="true" />}
                                <div className="w-50 text-center">{cl.used_qty}</div>
                                {getAddQuantity(cl.used_qty, cl.parts_qty, cl.balance_used_quantity)
                                  ? <img src={addIcon} alt="addquantity" className="cursor-pointer" height="20" aria-hidden="true" onClick={(e) => onChangeAdd(e, cl.id)} />
                                  : <img src={addIconDisabled} alt="addquantity" height="20" aria-hidden="true" />}
                              </div>
                            )}
                        </Col>
                      </Row>
                    )))}
                  </Col>
                </Row>
                <br />
                <div className="text-center mr-4 font-size-13">You need to return the unused parts to the inventory</div>
                {updatePartsOrderInfo && updatePartsOrderInfo.loading && (
                  <div className="text-center mt-3">
                    <Loader />
                  </div>
                )}
              </>
            )}
            {(updatePartsOrderInfo && updatePartsOrderInfo.err) && (
              <SuccessAndErrorFormat response={updatePartsOrderInfo} />
            )}
            {(updatePartsOrderInfo && updatePartsOrderInfo.data) && (
              <SuccessAndErrorFormat response={updatePartsOrderInfo} successMessage="Parts/Spares updated successfully." />
            )}
          </Box>
        </DialogContentText>
      </DialogContent>
      <DialogActions className="mr-4 ml-4">
        {confirmMessage && (updatePartsOrderInfo && !updatePartsOrderInfo.data)
          && (
            <>
              <Button
                className="mr-1"
                variant='contained'
                onClick={onClickBack}
                disabled={updatePartsOrderInfo?.loading}
              >
                Back
              </Button>
              <Button
                className="mr-1"
                variant='contained'
                onClick={onConfirmParts}
                disabled={updatePartsOrderInfo?.loading}
              >
                Confirm
              </Button>
            </>
          )}
        {!confirmMessage
          && (
            <Button
              disabled={!checkedData}
              className="mr-1"
              variant='contained'
              onClick={onSaveParts}
            >
              Save
            </Button>
          )}
        {(updatePartsOrderInfo && updatePartsOrderInfo.data) && (
          <Button
            disabled={!checkedData}
            className="mr-1"
            variant='contained'
            onClick={toggle}
          >
            Ok
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

EnterUsedQuantity.propTypes = {
  orderPartsEdit: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array,
  ]).isRequired,
  inventoryPartOrder: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array,
  ]).isRequired,
  usedQuantityModal: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.string,
  ]).isRequired,
  atFinish: PropTypes.func.isRequired,
  afterReset: PropTypes.func.isRequired,
};
export default EnterUsedQuantity;
