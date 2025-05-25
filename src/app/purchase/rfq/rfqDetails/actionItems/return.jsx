/* eslint-disable radix */
/* eslint-disable import/no-unresolved */
/* eslint-disable react/jsx-props-no-spreading */
import React, { useEffect, useState } from 'react';
import {
  CardBody,
  Col,
  Row,
  Table,
  Input,
} from 'reactstrap';
import * as PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import {
  Button, Dialog, DialogActions, DialogContent, DialogContentText, Box, Checkbox,
} from '@mui/material';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faTrashAlt,
} from '@fortawesome/free-solid-svg-icons';
import SuccessAndErrorFormat from '@shared/successAndErrorFormat';
import Loader from '@shared/loading';

import {
  decimalKeyPressDown, getAllowedCompanies,
} from '../../../../util/appUtils';
import {
  getMoveOrder, getTransferDetail, createStockScrap,
} from '../../../purchaseService';
import {
  getNewProductReturnArray, getDataWithName, getNewReturnArrayV1,
} from '../../utils/utils';
import DialogHeader from '../../../../commonComponents/dialogHeader';

const appModels = require('../../../../util/appModels').default;

const useStyles = makeStyles({
  option: {
    padding: 5,
    margin: 5,
    display: 'flow-root',
    '& > span': {
      marginRight: 10,
    },
  },
});

const Return = (props) => {
  const {
    transferDetails, returnModal, atFinish,
  } = props;
  const dispatch = useDispatch();
  const classes = useStyles();
  const [modal, setModal] = useState(returnModal);
  const [productData, setProductData] = useState([]);
  const [productListAdd, setProductListAdd] = useState(false);
  const [locOpen, setLocOpen] = useState(false);
  const [locKeyword, setLocKeyword] = useState('');
  const [spaceLocation, setSpaceLocation] = useState('');
  const [selectedLocation, setSelectedLocation] = useState(false);
  const { userInfo } = useSelector((state) => state.user);
  const companies = getAllowedCompanies(userInfo);
  const {
    stockScrapInfo, moveOrders, unitNameInfo, productNameInfo, stockLocations,
    moveProductsV1,
  } = useSelector((state) => state.purchase);

  const toggle = () => {
    setModal(!modal);
    setSelectedLocation('');
    const viewId = transferDetails && transferDetails.data ? transferDetails.data[0].id : '';
    if ((userInfo && userInfo.data) && viewId && (stockScrapInfo && stockScrapInfo.data)) {
      dispatch(getTransferDetail(viewId, appModels.STOCK));
    }
    atFinish();
  };

  /* useEffect(() => {
    if (userInfo && userInfo.data && locOpen) {
      dispatch(getStockLocations(companies, appModels.STOCKLOCATION, locKeyword, 'return_location'));
    }
  }, [userInfo, locKeyword, locOpen]); */

  useEffect(() => {
    if (productListAdd) {
      setProductData(productData);
    }
  }, [productListAdd]);

  useEffect(() => {
    if (transferDetails && transferDetails.data) {
      const viewId = transferDetails && transferDetails.data ? transferDetails.data[0].id : '';
      const arg = [['move_dest_exists', 'product_return_moves', 'parent_location_id', 'original_location_id', 'location_id']];
      const contex = { active_id: viewId, active_ids: [viewId], active_model: appModels.STOCK };
      dispatch(getMoveOrder(arg, contex, 'default_get', appModels.STOCKRETURN));
    }
  }, []);

  /* useEffect(() => {
    if ((userInfo && userInfo.data) && (stockScrapInfo && stockScrapInfo.data)) {
      const resid = stockScrapInfo.data ? stockScrapInfo.data[0] : false;
      if (resid) {
        const viewId = transferDetails && transferDetails.data ? transferDetails.data[0].id : '';
        const contex = { active_id: viewId, active_ids: [viewId], active_model: appModels.STOCK };
        dispatch(purchaseStateChange(resid, 'create_returns', appModels.STOCKRETURN, contex));
      }
    }
  }, [userInfo, stockScrapInfo]); */

  /* useEffect(() => {
    const viewId = transferDetails && transferDetails.data ? transferDetails.data[0].id : '';
    if ((userInfo && userInfo.data) && viewId && (stockScrapInfo && stockScrapInfo.data)) {
      dispatch(getTransferDetail(viewId, appModels.STOCK));
    }
  }, [userInfo, stockScrapInfo]); */

  const transferData = transferDetails && (transferDetails.data && transferDetails.data.length > 0) ? transferDetails.data[0] : '';

  const handleStateChange = (id) => {
    const originallocationId = transferData && transferData.location_id ? transferData.location_id[0] : '';
    const locationId = selectedLocation && selectedLocation.id ? selectedLocation.id : originallocationId;
    const products = productData && productData.length > 0 ? getNewProductReturnArray(productData) : false;
    const payload = {
      active_model: appModels.STOCK, active_id: id, picking_id: id, original_location_id: originallocationId, location_id: locationId, product_return_moves: products,
    };
    dispatch(createStockScrap(id, products));
  };

  useEffect(() => {
    if ((moveOrders && moveOrders.data && moveOrders.data.product_return_moves)) {
      const newData = getNewReturnArrayV1(moveOrders.data.product_return_moves);
      if (newData && newData.length > 0) {
        // const ids = getColumnArrayByIdWithArray(newData, 'product_id');
        // dispatch(getProductName(ids, appModels.PRODUCT));
        // const idunit = getColumnArrayByIdWithArray(newData, 'uom_id');
        // dispatch(getUnitName(idunit, appModels.UOM));
        const newData1 = newData.filter((item) => item.quantity > 0);
        setProductData(newData1);
        setProductListAdd(Math.random());
      }
    }
  }, [moveOrders]);

  function isProductQuantity() {
    let res = true;
    if (productData && productData.length) {
      const newData1 = productData.filter((item) => parseFloat(item.quantity) > 0);
      if (newData1 && newData1.length && newData1.length === productData.length) {
        res = false;
      }
    }
    return res;
  }

  useEffect(() => {
    if (productNameInfo && productNameInfo.data) {
      const newData = getDataWithName(productData && productData.length ? productData : [], productNameInfo.data, 'product_id');
      setProductData(newData);
    }
  }, [productNameInfo]);

  useEffect(() => {
    if (unitNameInfo && unitNameInfo.data) {
      const newData = getDataWithName(productData && productData.length ? productData : [], unitNameInfo.data, 'uom_id');
      setProductData(newData);
    }
  }, [unitNameInfo]);

  const removeData = (e, index) => {
    const checkData = productData;
    const indexRemove = checkData.indexOf(index);
    checkData.splice(indexRemove, 1);
    setProductData(checkData);
    setProductListAdd(Math.random());
  };

  function getProductDoneMove(id) {
    let pname = 0;
    const data = moveProductsV1 && moveProductsV1.data ? moveProductsV1.data : [];
    const prData = data.filter((item) => item.id === id);
    if (prData && prData.length) {
      pname = prData[0].quantity_done;
    }
    return pname;
  }

  const onUnitChange = (e, index) => {
    const newData = productData;
    const doneQty = getProductDoneMove(newData[index].move_id);
    newData[index].quantity = e.target.value && e.target.value > 0 && e.target.value <= parseFloat(doneQty) ? e.target.value : '';
    setProductData(newData);
    setProductListAdd(Math.random());
  };

  const onRefundChange = (e, index) => {
    const newData = productData;
    newData[index].to_refund = e.target.checked;
    setProductData(newData);
    setProductListAdd(Math.random());
  };

  const onLocKeywordChange = (event) => {
    setLocKeyword(event.target.value);
  };

  const onChange = (e, value) => {
    setSelectedLocation(value);
    setSpaceLocation(value);
  };

  function getProductNameMove(id) {
    let pname = '';
    const data = moveProductsV1 && moveProductsV1.data ? moveProductsV1.data : [];
    const prData = data.filter((item) => item.product_id && item.product_id.id && item.product_id.id === id);
    if (prData && prData.length) {
      pname = prData[0].product_id ? prData[0].product_id.name : '';
    }
    return pname;
  }

  function getProductCatMove(id) {
    let pname = '';
    const data = moveProductsV1 && moveProductsV1.data ? moveProductsV1.data : [];
    const prData = data.filter((item) => item.product_id && item.product_id.id && item.product_id.id === id);
    if (prData && prData.length) {
      pname = prData[0].product_id && prData[0].product_id.categ_id && prData[0].product_id.categ_id.name ? prData[0].product_id.categ_id.name : '';
    }
    return pname;
  }

  function getProductUomMove(id) {
    let pname = '';
    const data = moveProductsV1 && moveProductsV1.data ? moveProductsV1.data : [];
    const prData = data.filter((item) => item.product_uom && item.product_uom.id && item.product_uom.id === id);
    if (prData && prData.length) {
      pname = prData[0].product_uom ? prData[0].product_uom.name : '';
    }
    return pname;
  }

  let locationOptions = [];

  const locationTransfer = (transferData && transferData.location_id ? transferData.location_id : '');
  const oldLocationId = transferData && transferData.location_id ? transferData.location_id[1] : '';

  useEffect(() => {
    if (oldLocationId) {
      setSpaceLocation(oldLocationId);
    }
  }, [transferDetails]);

  if (stockLocations && stockLocations.loading) {
    locationOptions = [{ name: 'Loading..' }];
  }
  if (stockLocations && stockLocations.data) {
    locationOptions = stockLocations.data;
  }
  if (stockLocations && stockLocations.data && transferDetails && transferDetails.data) {
    if (locationTransfer && locationTransfer.length && locationTransfer.length > 0) {
      const arr = [...locationOptions, ...stockLocations.data];
      const oldSpaceId = [{ id: locationTransfer[0], name: locationTransfer[1] }];
      const newArr = [...arr, ...oldSpaceId];
      locationOptions = [...new Map(newArr.map((item) => [item.id, item])).values()];
    } else {
      locationOptions = [...locationOptions, ...stockLocations.data];
    }
  }

  const loading = ((moveOrders && moveOrders.loading) || (productNameInfo && productNameInfo.loading) || (unitNameInfo && unitNameInfo.loading)
    || (stockScrapInfo && stockScrapInfo.loading)
    || (transferDetails && transferDetails.loading));

  return (
    <Dialog maxWidth="lg" open={returnModal}>
      <DialogHeader title="Return" onClose={toggle} response={stockScrapInfo} />
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
            {loading || (stockScrapInfo && (stockScrapInfo.data || stockScrapInfo.status)) ? '' : (
              <>
                <Row className="pr-3 pl-3 pb-3">
                  <Col md="12" sm="12" lg="12" xs="12">
                    <small className="text-grey text-center mt-3">
                      Note :
                      This picking appears to be chained with another operation.Later,
                      if you receive the goods you are returning now, make sure to reverse the
                      returned picking in order to avoid logistic rules to be applied again (which would create duplicated operations).
                    </small>
                  </Col>
                </Row>
                <Row className="pr-3 pl-3 pb-3">
                  { /* <Col xs={12} sm={12} md={12} lg={6}>
                <ThemeProvider theme={theme}>
                  <FormGroup>
                    <Label for="location_id">Return Location</Label>
                    <Autocomplete
                      name="location_id"
                      open={locOpen}
                      size="small"
                      onOpen={() => {
                        setLocOpen(true);
                      }}
                      onClose={() => {
                        setLocOpen(false);
                        setLocKeyword('');
                      }}
                      classes={{
                        option: classes.option,
                      }}
                      onChange={onChange}
                      value={selectedLocation && selectedLocation.name ? selectedLocation.name : spaceLocation}
                      loading={stockLocations && stockLocations.loading}
                      getOptionSelected={(option, value) => option.name === value.name}
                      getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
                      options={locationOptions}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          onChange={onLocKeywordChange}
                          variant="outlined"
                          className="without-padding custom-icons"
                          placeholder="Search & Select"
                          InputProps={{
                            ...params.InputProps,
                            endAdornment: (
                              <>
                                {stockLocations && stockLocations.loading ? <CircularProgress color="inherit" size={20} /> : null}
                                <InputAdornment position="end">
                                  {((selectedLocation && selectedLocation.name) || spaceLocation) && (
                                  <IconButton onClick={() => {
                                    setSpaceLocation('');
                                    setLocKeyword('');
                                    setSelectedLocation('');
                                  }}
                                  >
                                    <BackspaceIcon fontSize="small" />
                                  </IconButton>
                                  )}
                                  <IconButton>
                                    <SearchIcon fontSize="small" />
                                  </IconButton>
                                </InputAdornment>
                              </>
                            ),
                          }}
                        />
                      )}
                    />
                    {(stockLocations && stockLocations.err) && (<FormHelperText><span className="text-danger">{generateErrorMessage(stockLocations)}</span></FormHelperText>) }
                  </FormGroup>
                </ThemeProvider>
                        </Col> */ }
                </Row>
                <Row className="pr-2 pl-2">
                  <Col xs={12} sm={12} md={12} lg={12}>
                    <p className="text-info">Return quantity should not be more than delivered quantity</p>
                    <Table responsive>
                      <thead>
                        <tr>
                          <th className="p-2 min-width-200 border-0">
                            Product
                          </th>                          
                          <th className="p-2 min-width-100 border-0">
                            Quantity
                          </th>
                          <th className="p-2 min-width-200 border-0">
                            Category
                          </th>
                          <th className="p-2 min-width-100 border-0">
                            Unit of Measure
                          </th>
                          <th className="p-2 min-width-100 border-0">
                            To Refund(Update SO/PO)
                          </th>
                          <th className="p-2 min-width-100 border-0">
                            <span className="invisible">Del</span>
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {(productData && productData.length > 0) && productData.map((pl, index) => (
                          <tr className="font-weight-400">
                            <td className="p-2">
                              <span>{pl.product_id ? getProductNameMove(pl.product_id) : ''}</span>
                            </td>                           
                            <td className="p-2">
                              <Input type="input" name="quantity" value={pl.quantity} maxLength="5" onKeyDown={decimalKeyPressDown} onChange={(e) => onUnitChange(e, index)} />
                            </td>
                            <td className="p-2">
                              <span>{pl.product_id ? getProductCatMove(pl.product_id) : ''}</span>
                            </td>                         
                            <td className="p-2">
                              <span>{pl.uom_id ? getProductUomMove(pl.uom_id) : ''}</span>
                            </td>
                            <td className="p-2">
                            <Checkbox
                                  value={pl.to_refund}
                                  name="refund"
                                  id={`refund${index}`}
                                  checked={pl.to_refund}
                                  onChange={(e) => onRefundChange(e, index)}
                                />
                              {/* <div className="checkbox">                               
                                <Input
                                  type="checkbox"
                                  id={`refund${index}`}
                                  onChange={(e) => onRefundChange(e, index)}
                                  value={pl.to_refund}
                                />
                                <Label htmlFor={`refund${index}`} />
                                {' '}
                              </div> */}
                            </td>
                            {productData && productData.length > 1 && (
                            <td className="p-2">
                              <span className="font-weight-400 d-inline-block" />
                              <FontAwesomeIcon className="mr-1 ml-1 cursor-pointer" size="sm" icon={faTrashAlt} onClick={(e) => { removeData(e, index); }} />
                            </td>
                            )}
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </Col>
                </Row>
              </>
            )}
            {stockScrapInfo && stockScrapInfo.data && (!loading) && (
              <SuccessAndErrorFormat response={stockScrapInfo} successMessage="This order has been returned successfully.." />
            )}
            {moveOrders && moveOrders.err && (
              <SuccessAndErrorFormat response={moveOrders} />
            )}
            {stockScrapInfo && stockScrapInfo.err && (
              <SuccessAndErrorFormat response={stockScrapInfo} />
            )}
            {loading && (
              <CardBody className="mt-4" data-testid="loading-case">
                <Loader />
              </CardBody>
            )}
          </Box>
        </DialogContentText>
      </DialogContent>
      <DialogActions className="mr-3 ml-3">
        {stockScrapInfo && !stockScrapInfo.data && (
          <Button
            variant="contained"
            className="mr-1 submit-btn"
            disabled={isProductQuantity() || (productData && productData.length <= 0) || (moveOrders && !moveOrders.data) || loading}
            onClick={() => handleStateChange(transferData.id)}
          >
            Return
          </Button>
        )}
        {(stockScrapInfo && stockScrapInfo.data) && (
          <Button
            variant="contained"
            className="mr-1 submit-btn"
            onClick={toggle}
          >
            Ok
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

Return.propTypes = {
  transferDetails: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array,
  ]).isRequired,
  returnModal: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.string,
  ]).isRequired,
  atFinish: PropTypes.func.isRequired,
};
export default Return;
