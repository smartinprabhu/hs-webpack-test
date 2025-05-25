/* eslint-disable operator-assignment */
/* eslint-disable import/no-unresolved */
/* eslint-disable react/jsx-props-no-spreading */
import React, { useEffect, useState } from 'react';
import {
  Col,
  Row,
} from 'reactstrap';
import * as PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import {
  Box, Button,
  Dialog, DialogActions, DialogContent, DialogContentText,
} from '@mui/material';

import SuccessAndErrorFormat from '@shared/successAndErrorFormat';
import Loader from '@shared/loading';
import addIcon from '@images/icons/addCircle.svg';
import addIconDisabled from '@images/icons/addCircleGrey.svg';
import minusIcon from '@images/icons/minusCircleBlue.svg';
import minusIconDisabled from '@images/icons/minusCircleGrey.svg';
import {
  updatePartsOrder, createInventoryOrder,
} from '../../workorderService';
import { getNewArrayEditParts, getOrderWithInventory } from '../../utils/utils';
import DialogHeader from '../../../commonComponents/dialogHeader';

const appModels = require('../../../util/appModels').default;

const EditPart = (props) => {
  const {
    editModal, atFinish, afterReset, orderPartsEdit, inventoryPartOrder,
  } = props;
  const dispatch = useDispatch();
  const [modal, setModal] = useState(editModal);
  const [addedParts, setAddedParts] = useState([]);
  const [partListAdd, setPartListAdd] = useState(false);
  const [alertMsg, setAlertMsg] = useState(false);

  const {
    workorderDetails, updatePartsOrderInfo,
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
      setAlertMsg(false);
    } else {
      setAlertMsg(false);
    }
  }, [updatePartsOrderInfo]);

  const onChangeMinus = (e, id) => {
    setAlertMsg(true);
    const newData = orderPartsEdit;
    const index = newData.findIndex((obj1) => (obj1.id === id));
    if (index > -1) {
      newData[index].parts_qty = parseInt(newData[index].parts_qty) - 1;
    }
    setAddedParts(newData);
    setPartListAdd(Math.random());
  };

  const onChangeAdd = (e, id) => {
    setAlertMsg(true);
    const newData = orderPartsEdit;
    const index = newData.findIndex((obj1) => (obj1.id === id));
    if (index > -1) {
      newData[index].parts_qty = parseInt(newData[index].parts_qty) + 1;
    }
    setAddedParts(newData);
    setPartListAdd(Math.random());
  };

  const getAddQuantity = (qty, qtyNew) => {
    let addQuantity = true;
    if (qtyNew && qty && parseInt(qty) === parseInt(qtyNew)) {
      addQuantity = false;
    }
    return addQuantity;
  };

  const onEditParts = () => {
    const pickingId = workorderDetails && workorderDetails.data && workorderDetails.data.length && workorderDetails.data[0].picking_id[0] ? workorderDetails.data[0].picking_id[0] : '';
    const payload = getNewArrayEditParts(addedParts, pickingId);
    for (let i = 0; i < payload.length; i += 1) {
      const obj = payload[i];
      const values = {
        parts_id: obj.parts_id && obj.parts_id.length && obj.parts_id[0], parts_qty: obj.parts_qty, maintenance_id: obj.maintenance_id[0], picking_id: obj.picking_id[0], parts_uom: obj.parts_uom[0],
      };
      dispatch(updatePartsOrder(payload[i].id, values, appModels.PARTLINES));
    }
  };

  return (
    <Dialog maxWidth="xl" open={modal}>
      <DialogHeader title="Edit Parts" onClose={toggleCancel} sx={{ width: '500px' }} />
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
            {updatePartsOrderInfo && !updatePartsOrderInfo.err && !updatePartsOrderInfo.data && (<>
              <Row className="ml-3 mr-3">
                <Col sm="12" md="12" lg="12" xs="12" className="font-size-13">
                  <Row className="border-bottom border-top pt-2 pb-2">
                    <Col sm="6" md="6" lg="6" xs="12">
                      <span className="font-weight-500">Part/Spare</span>
                    </Col>
                    <Col sm="6" md="6" lg="6" xs="12">
                      <span className="font-weight-500">Quantity Required</span>
                    </Col>
                  </Row>
                  {(orderPartsEdit && orderPartsEdit.length && orderPartsEdit.map((cl) => (
                    <Row className="pt-3 pb-3" key={cl.id}>
                      <Col sm="6" md="6" lg="6" xs="12">
                        {`${cl.parts_id && cl.parts_id[1] ? cl.parts_id[1] : ''} (${getOrderWithInventory(cl.parts_id && cl.parts_id[0] ? cl.parts_id[0] : false, inventoryPartOrder)}) `}
                      </Col>
                      <Col sm="6" md="6" lg="6" xs="12">
                        <div className="d-flex">
                          {getAddQuantity(cl.parts_qty, cl.used_qty > 1 ? cl.used_qty : 1)
                            ? <img src={minusIcon} alt="minusquantity" className="cursor-pointer" height="20" aria-hidden="true" onClick={(e) => onChangeMinus(e, cl.id)} />
                            : <img src={minusIconDisabled} alt="minusquantity" height="20" aria-hidden="true" />}
                          <div className="w-50 text-center">{cl.parts_qty}</div>
                          {getAddQuantity(cl.parts_qty, getOrderWithInventory(cl.parts_id && cl.parts_id[0] ? cl.parts_id[0] : false, inventoryPartOrder))
                            ? <img src={addIcon} alt="addquantity" className="cursor-pointer" height="20" aria-hidden="true" onClick={(e) => onChangeAdd(e, cl.id)} />
                            : <img src={addIconDisabled} alt="addquantity" height="20" aria-hidden="true" />}
                        </div>
                      </Col>
                    </Row>
                  )))}
                </Col>
              </Row>
              <br />
              <br />
              {updatePartsOrderInfo && !updatePartsOrderInfo.loading && alertMsg && (
                <div className="text-center mr-4 font-size-13">Parts will be edited to this work order. Do you want to continue?</div>
              )}
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
        {(updatePartsOrderInfo && updatePartsOrderInfo.data)
          ? (
            <Button
              size="sm"
              className="mr-1"
              variant='contained'
              onClick={toggle}
            >
              Ok
            </Button>
          )
          : (
            <Button
              size="sm"
              disabled={!alertMsg || updatePartsOrderInfo?.loading}
              className="mr-1"
              variant='contained'
              onClick={onEditParts}
            >
              Update
            </Button>
          )}
      </DialogActions>
    </Dialog>
  );
};

EditPart.propTypes = {
  orderPartsEdit: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array,
  ]).isRequired,
  inventoryPartOrder: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array,
  ]).isRequired,
  editModal: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.string,
  ]).isRequired,
  atFinish: PropTypes.func.isRequired,
  afterReset: PropTypes.func.isRequired,
};
export default EditPart;
