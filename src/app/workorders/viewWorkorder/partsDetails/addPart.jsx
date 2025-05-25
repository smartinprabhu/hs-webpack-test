/* eslint-disable operator-assignment */
/* eslint-disable react/no-array-index-key */
/* eslint-disable import/no-unresolved */
/* eslint-disable react/jsx-props-no-spreading */
import React, { useEffect, useState } from 'react';
import {
  Card,
  CardBody,
  Col,
  FormGroup,
  Row,
  Input,
} from 'reactstrap';
import { Autocomplete } from '@material-ui/lab';
import {
  TextField, CircularProgress,
} from '@material-ui/core';
import * as PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import 'antd/dist/antd.css';
import {
  Box, Button,
  Dialog, DialogActions, DialogContent, DialogContentText,
} from '@mui/material';

import DialogHeader from '../../../commonComponents/dialogHeader';
import SuccessAndErrorFormat from '@shared/successAndErrorFormat';
import Loader from '@shared/loading';
import workorder from '@images/icons/workorder.svg';
import addIcon from '@images/icons/addCircle.svg';
import addIconDisabled from '@images/icons/addCircleGrey.svg';
import minusIcon from '@images/icons/minusCircleBlue.svg';
import minusIconDisabled from '@images/icons/minusCircleGrey.svg';
import {
  getTrimmedArrayByArray, getNonzeroParts, getNewArrayParts,
} from '../../utils/utils';
import {
  integerKeyPress,
} from '../../../util/appUtils';
import {
  getInventoryPartList, getAddedParts, createPartsOrder, resetAddedPartsRows, createInventoryOrder,
} from '../../workorderService';

const appModels = require('../../../util/appModels').default;

const AddPart = (props) => {
  const {
    addModal, atFinish, workorderDetails, afterReset,
  } = props;
  const dispatch = useDispatch();
  const [modal, setModal] = useState(addModal);
  const [partsOpen, setPartsOpen] = useState(false);
  const [partsKeyword, setPartsKeyword] = useState('');
  const [partData, setPartData] = useState([]);
  const [addedParts, setAddedParts] = useState([]);
  const [partListAdd, setPartListAdd] = useState(false);
  const [addbtn, setAddBtn] = useState(false);
  const toggle = () => {
    setModal(!modal);
    atFinish();
  };

  const toggleCancel = () => {
    setModal(!modal);
    afterReset();
  };

  const { userInfo } = useSelector((state) => state.user);
  const {
    inventoryParts, addedPartsRows, createPartsOrderInfo, orderParts, createInventoryInfo,
  } = useSelector((state) => state.workorder);

  useEffect(() => {
    (async () => {
      if (userInfo && userInfo.data && partsOpen) {
        await dispatch(getInventoryPartList(partsKeyword));
      }
    })();
  }, [partsOpen, partsKeyword]);

  useEffect(() => {
    if (partListAdd) {
      setAddedParts(addedParts);
      dispatch(getAddedParts(addedParts));
    }
  }, [partListAdd]);

  useEffect(() => {
    if (createPartsOrderInfo && createPartsOrderInfo.data) {
      const id = workorderDetails && workorderDetails.data && workorderDetails.data.length ? workorderDetails.data[0].id : '';
      const payload = { order_id: id };
      dispatch(createInventoryOrder(payload));
      resetAddedPartsRows();
    }
  }, [createPartsOrderInfo]);

  useEffect(() => {
    if (addedPartsRows) {
      setPartData([]);
      setAddBtn(false);
    }
  }, [addedPartsRows]);

  const onPartsChange = (e, data) => {
    setPartData(data);
    setAddBtn(true);
  };

  const onpartsKeywordChange = (event) => {
    setPartsKeyword(event.target.value);
  };

  let partsOptions = [];

  if (inventoryParts && (inventoryParts.loading || !inventoryParts.data)) {
    partsOptions = [{ name: 'Loading..' }];
  }
  if (inventoryParts && inventoryParts.data) {
    const partsArray = addedPartsRows && addedPartsRows.length ? addedPartsRows : [];
    if (partsArray && partsArray.length) {
      const filterArray = getNonzeroParts(inventoryParts.data, 'qty_on_hand', orderParts);
      partsOptions = getTrimmedArrayByArray(filterArray, 'id', partsArray);
    } else {
      partsOptions = getNonzeroParts(inventoryParts.data, 'qty_on_hand', orderParts.data);
    }
  }
  if (inventoryParts && inventoryParts.err) {
    partsOptions = [{ name: 'No Options' }];

  }
  const loadPartsList = () => {
    const newData = partData;
    newData.qty_on_hand_default = newData.qty_on_hand;
    setAddedParts((data) => [...data, newData]);
    setPartListAdd(Math.random());
  };

  const onChangeMinus = (e, id) => {
    const newData = addedPartsRows;
    const index = newData.findIndex((obj1) => (obj1.id === id));
    if (index > -1) {
      newData[index].qty_on_hand = parseInt(newData[index].qty_on_hand) !== 0 ? parseInt(newData[index].qty_on_hand) - 1 : parseInt(newData[index].qty_on_hand);
    }
    setAddedParts(newData);
    setPartListAdd(Math.random());
  };

  const onChangeAdd = (e, id) => {
    const newData = addedPartsRows;
    const index = newData.findIndex((obj1) => (obj1.id === id));
    if (index > -1) {
      newData[index].qty_on_hand = parseInt(newData[index].qty_on_hand) + 1;
    }
    setAddedParts(newData);
    setPartListAdd(Math.random());
  };

  const handleInputChange = (e, id, handqty) => {
    const newData = addedPartsRows;
    if (e.target.value <= handqty) {
      const index = newData.findIndex((obj1) => (obj1.id === id));
      if (index > -1) {
        newData[index].qty_on_hand = parseInt(e.target.value);
      }
      setAddedParts(newData);
      setPartListAdd(Math.random());
    }
  };

  const getAddQuantity = (qty, qtyNew) => {
    let addQuantity = true;
    if (parseInt(qty) === parseInt(qtyNew)) {
      addQuantity = false;
    }
    return addQuantity;
  };

  const partRows = addedPartsRows && addedPartsRows.length ? addedPartsRows : [];

  const onSaveParts = () => {
    const id = workorderDetails && workorderDetails.data && workorderDetails.data.length ? workorderDetails.data[0].id : '';
    const pickingId = workorderDetails && workorderDetails.data && workorderDetails.data.length && workorderDetails.data[0].picking_id[0] ? workorderDetails.data[0].picking_id[0] : '';
    const payload = getNewArrayParts(partRows, id, pickingId);
    dispatch(createPartsOrder(payload, appModels.PARTLINES));
  };

  return (
    <Dialog maxWidth="xl" open={modal}>
      <DialogHeader title="Search and Add Parts/Spares" imagePath={workorder} onClose={toggleCancel} response={createPartsOrderInfo} sx={{ width: '1000px' }} />
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
            {createPartsOrderInfo && !createPartsOrderInfo.data && !createPartsOrderInfo.err && (
              <>
                <Row className="mr-4">
                  <Col sm="6" md="6" lg="6" xs="12">
                    <Card className="border-0 ml-4">
                      <CardBody className="p-2 ml-2">
                        <Row>
                          <Col sm="12" md="12" lg="12" xs="12">
                            <FormGroup className="mt-3">
                              <span className="font-weight-500 mb-1 d-inline-block">Select the part</span>
                              <Autocomplete
                                name="parts_lines"
                                open={partsOpen}
                                size="small"
                                onOpen={() => {
                                  setPartsOpen(true);
                                  onpartsKeywordChange('')
                                }}
                                onClose={() => {
                                  setPartsOpen(false);
                                  onpartsKeywordChange('')
                                }}
                                value={partData && partData.id ? `${partData.name}(${partData.qty_on_hand})` : ''}
                                disableClearable={!(partData && partData.id)}
                                onChange={onPartsChange}
                                loading={inventoryParts && inventoryParts.loading}
                                getOptionSelected={(option, value) => option.name === value.name}
                                getOptionLabel={(option) => (typeof option === 'string' ? option : `${option.name} ${option.qty_on_hand ? `(${option.qty_on_hand})` : ''}`)}
                                options={partsOptions}
                                renderInput={(params) => (
                                  <TextField
                                    {...params}
                                    onChange={onpartsKeywordChange}
                                    variant="outlined"
                                    className="input-small-custom without-padding"
                                    placeholder="Search & Select"
                                    InputProps={{
                                      ...params.InputProps,
                                      endAdornment: (
                                        <>
                                          {inventoryParts && inventoryParts.loading ? <CircularProgress color="inherit" size={20} /> : null}
                                          {params.InputProps.endAdornment}
                                        </>
                                      ),
                                    }}
                                  />
                                )}
                              />
                            </FormGroup>
                            <Button
                              type="button"
                              variant='contained'
                              onClick={loadPartsList}
                              disabled={(!addbtn)}
                              className="submit-btn"
                            >
                              Add
                            </Button>
                          </Col>
                        </Row>
                      </CardBody>
                    </Card>
                  </Col>
                  <Col sm="5" md="5" lg="5" xs="12" className="ml-5  font-size-13">
                    <span className="font-weight-bold font-17 mb-1 d-inline-block">Added Parts</span>
                    <Row className="border-bottom border-top pt-2 pb-2">
                      <Col sm="6" md="6" lg="6" xs="12">
                        <span className="font-weight-500">Part/Spare</span>
                      </Col>
                      <Col sm="6" md="6" lg="6" xs="12">
                        <span className="font-weight-500">Quantity Required</span>
                      </Col>
                    </Row>
                    {(partRows && partRows.map((cl, index) => (
                      <Row className="pt-3 pb-3" key={index}>
                        <Col sm="6" md="6" lg="6" xs="12">
                          {`${cl.name} (${cl.qty_on_hand_default}) `}
                        </Col>
                        <Col sm="6" md="6" lg="6" xs="12">
                          <div className="d-flex">
                            {getAddQuantity(cl.qty_on_hand, 1)
                              ? <img src={minusIcon} alt="minusquantity" className="cursor-pointer mt-1" height="20" aria-hidden="true" onClick={(e) => onChangeMinus(e, cl.id)} />
                              : <img src={minusIconDisabled} className="mt-1" alt="minusquantity" height="20" aria-hidden="true" />}
                            <div className="ml-2 mr-2">
                              <Input
                                type="text"
                                className="m-0 text-center"
                                name="part"
                                size="sm"
                                onKeyPress={integerKeyPress}
                                value={cl.qty_on_hand}
                                onChange={(e) => handleInputChange(e, cl.id, cl.qty_on_hand_default)}
                              />
                            </div>
                            {getAddQuantity(cl.qty_on_hand, cl.qty_on_hand_default)
                              ? <img src={addIcon} alt="addquantity" className="cursor-pointer mt-1" height="20" aria-hidden="true" onClick={(e) => onChangeAdd(e, cl.id)} />
                              : <img src={addIconDisabled} className="mt-1" alt="addquantity" height="20" aria-hidden="true" />}
                          </div>
                        </Col>
                      </Row>
                    )))}
                    {(addedPartsRows && !addedPartsRows.length)
                      ? <div className="font-11 mt-2">No Parts/Spares added</div>
                      : ''}
                  </Col>
                </Row>
                <br />
                <br />
                {(addedPartsRows && addedPartsRows.length)
                  ? (
                    <>
                      <div className="text-right mr-4 font-size-13">Parts will be added to this work order. Do you want to continue?</div>
                    </>
                  )
                  : ''}
                {createPartsOrderInfo && createPartsOrderInfo.loading && (
                  <div className="text-center mt-3">
                    <Loader />
                  </div>
                )}
              </>
            )}
            {(createPartsOrderInfo && createPartsOrderInfo.err) && (
              <SuccessAndErrorFormat response={createPartsOrderInfo} />
            )}
            {(createPartsOrderInfo && createPartsOrderInfo.data) && (
              <SuccessAndErrorFormat response={createPartsOrderInfo} successMessage="Parts/Spares added successfully." />
            )}
          </Box>
        </DialogContentText>
      </DialogContent>
      <DialogActions className="mr-4 ml-4">
        {(createPartsOrderInfo && (createPartsOrderInfo.data || createPartsOrderInfo.err)) && (
          <Button
            type="button"
            variant='contained'
            className="submit-btn"
            onClick={toggle}
          >
            Ok
          </Button>
        )}
        {(createPartsOrderInfo && !createPartsOrderInfo.data && !createPartsOrderInfo.err) && (
          <Button
            type="button"
            variant='contained'
            disabled={(addedPartsRows && !addedPartsRows.length) || createPartsOrderInfo?.loading}
            className="submit-btn"
            onClick={onSaveParts}
          >
            Save
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

AddPart.propTypes = {
  addModal: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.string,
  ]).isRequired,
  atFinish: PropTypes.func.isRequired,
  afterReset: PropTypes.func.isRequired,
  workorderDetails: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array,
  ]).isRequired,
};
export default AddPart;
