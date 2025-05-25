/* eslint-disable radix */
/* eslint-disable import/no-unresolved */
/* eslint-disable react/jsx-props-no-spreading */
import React, { useEffect, useState } from 'react';
import {
  Card,
  CardBody,
  Col,
  Row,
  Label,
  Input,
} from 'reactstrap';
import * as PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import { ThemeProvider, makeStyles } from '@material-ui/core/styles';
import { Autocomplete } from '@material-ui/lab';
import { TextField, CircularProgress, FormHelperText } from '@material-ui/core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, Box } from '@mui/material'

import assetDefault from '@images/icons/assetDefault.svg';
import SuccessAndErrorFormat from '@shared/successAndErrorFormat';
import Loader from '@shared/loading';
import {
  faExclamationCircle,
} from '@fortawesome/free-solid-svg-icons';
import {
  getDefaultNoValue, getLocalTime, generateErrorMessage,
  getColumnArrayByIdWithArray, numToFloat,
} from '../../../../util/appUtils';
import {
  purchaseStateChange, getTransferDetail, getStockProducts, createStockScrap,
  getStockQuantProducts,
} from '../../../purchaseService';
import theme from '../../../../util/materialTheme';
import DialogHeader from '../../../../commonComponents/dialogHeader';

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

const appModels = require('../../../../util/appModels').default;

const Scrap = (props) => {
  const {
    transferDetails, scrapModal, atFinish,
  } = props;
  const classes = useStyles();
  const dispatch = useDispatch();
  const [modal, setModal] = useState(scrapModal);
  const [quantityValue, setQuantityValue] = useState(numToFloat(0));
  const [productValue, setProductValue] = useState(false);
  const toggle = () => {
    setModal(!modal);
    atFinish();
  };
  const { userInfo } = useSelector((state) => state.user);
  const {
    stateChangeInfo, stockProducts, stockScrapInfo, moveProducts, stockQuantInfo,
  } = useSelector((state) => state.purchase);

  const stateData = stateChangeInfo && stateChangeInfo.data ? stateChangeInfo.data : false;

  const isScrap = stateData && stateData.data && typeof stateData.data === 'boolean';
  const isNotScrap = (stateData && stateData.data && typeof stateData.data === 'object');

  // const productCurrentQuantity = stockQuantInfo && stockQuantInfo.data && stockQuantInfo.data.length ? stockQuantInfo.data[0].quantity : 0;

  useEffect(() => {
    if (moveProducts && moveProducts.data) {
      const ids = getColumnArrayByIdWithArray(moveProducts.data, 'product_id');
      dispatch((getStockProducts(ids, appModels.PRODUCT)));
    }
  }, [moveProducts]);

  useEffect(() => {
    if (moveProducts && moveProducts.data) {
      const ids = getColumnArrayByIdWithArray(moveProducts.data, 'product_id');
      const locId = transferDetails && transferDetails.data && transferDetails.data.length && transferDetails.data[0].location_id ? transferDetails.data[0].location_id[0] : false;
      dispatch((getStockQuantProducts(ids, locId, appModels.STOCKQUANT)));
    }
  }, [moveProducts]);

  /* useEffect(() => {
    if (isNotScrap && productValue && productValue.id) {
      const ids = productValue.id;
      const locId = transferDetails && transferDetails.data && transferDetails.data.length && transferDetails.data[0].location_id ? transferDetails.data[0].location_id[0] : false;
      dispatch((getStockQuantProducts(ids, locId, appModels.STOCKQUANT)));
    }
  }, [isNotScrap]); */

  useEffect(() => {
    if ((userInfo && userInfo.data) && (stockScrapInfo && stockScrapInfo.data)) {
      const resid = stockScrapInfo.data ? stockScrapInfo.data[0] : false;
      if (resid) {
        dispatch(purchaseStateChange(resid, 'action_validate', appModels.STOCKSCRAP));
      }
    }
  }, [userInfo, stockScrapInfo]);

  useEffect(() => {
    const viewId = transferDetails && transferDetails.data ? transferDetails.data[0].id : '';
    if ((userInfo && userInfo.data) && viewId && (isScrap)) {
      dispatch(getTransferDetail(viewId, appModels.STOCK));
      setProductValue('');
    }
  }, [userInfo, stateChangeInfo]);

  const transferData = transferDetails && (transferDetails.data && transferDetails.data.length > 0) ? transferDetails.data[0] : '';

  const handleStateChange = (id) => {
    const locationId = transferData && transferData.location_id ? transferData.location_id[0] : '';
    const product = productValue && productValue.id ? productValue.id : '';
    const productUom = productValue && productValue.uom_id ? productValue.uom_id[0] : '';
    const payload = {
      model: appModels.STOCK, picking_id: id, scrap_qty: quantityValue, product_id: product, state: 'draft', location_id: locationId, product_uom_id: productUom,
    };
    dispatch(createStockScrap(appModels.STOCKSCRAP, payload));
    // setQuantityValue(0);
  };

  function getProductQuantity(id) {
    let quantity = 0;
    const qdata = stockQuantInfo && stockQuantInfo.data ? stockQuantInfo.data : [];
    if (qdata && qdata.length) {
      const result = qdata.filter((item) => (item.product_id) && item.product_id[0] === id);
      if (result && result.length) {
        quantity = result[0].quantity;
      }
    }
    return quantity;
  }

  const onInputChange = (e) => {
    if (productValue && productValue.qty_available && e.target.value) {
      if (parseInt(getProductQuantity(productValue.id)) >= parseInt(e.target.value)) {
        setQuantityValue(e.target.value);
      } else {
        setQuantityValue('');
      }
    } else {
      setQuantityValue('');
    }
  };

  let productOptions = [];

  if (stockProducts && stockProducts.loading) {
    productOptions = [{ display_name: 'Loading..' }];
  }

  if (stockProducts && stockProducts.err) {
    productOptions = [];
  }

  if (stockProducts && stockProducts.data && stockProducts.data.length > 0) {
    productOptions = stockProducts.data;
  }

  return (
    <Dialog maxWidth={'lg'} open={scrapModal}>
      <DialogHeader title="Return" onClose={toggle} response={stateChangeInfo} />
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          <Box
            sx={{
              width: "100%",
              height: "100%",
              backgroundColor: "#F6F8FA",
              padding: "20px",
              display: "flex",
              flexDirection: "column",
              gap: "10%",
              fontFamily: "Suisse Intl",
            }}
          >
            <Card className="border-5 mt-3 ml-4 mb-4 mr-4 border-secondary rounded-0 border-top-0 border-right-0 border-bottom-0">
              {transferDetails && (transferDetails.data && transferDetails.data.length > 0) && (
                <CardBody data-testid="success-case" className="bg-lightblue p-3">
                  <Row>
                    <Col md="2" xs="2" sm="2" lg="2">
                      <img src={assetDefault} alt="asset" className="mt-2" width="45" height="45" />
                    </Col>
                    <Col md="8" xs="8" sm="8" lg="8" className="ml-2">
                      <Row>
                        <h6 className="mb-1">{transferData.name}</h6>
                      </Row>
                      <Row>
                        <Col md="12" xs="12" sm="12" lg="12" className="p-0">
                          <span className="font-weight-800 font-side-heading mr-1">
                            Partner :
                          </span>
                          <span className="font-weight-400">
                            {getDefaultNoValue(transferDetails && transferDetails.data && transferDetails.data[0].partner_id[1] ? transferDetails.data[0].partner_id[1] : '')}
                          </span>
                        </Col>
                      </Row>
                      <Row>
                        <Col md="12" xs="12" sm="12" lg="12" className="p-0">
                          <span className="font-weight-800 font-side-heading mr-1">
                            Scheduled Date :
                          </span>
                          <span className="font-weight-400">
                            {getDefaultNoValue(getLocalTime(transferDetails && transferDetails.data && transferDetails.data[0].scheduled_date ? transferDetails.data[0].scheduled_date : ''))}
                          </span>
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                </CardBody>
              )}
            </Card>
            <>
              <Row className="ml-2 mr-2">
                {((stateChangeInfo && !stateChangeInfo.data) || (isNotScrap)) && (
                  <ThemeProvider theme={theme}>
                    <Col xs={12} sm={12} md={12} lg={6}>
                      <Label for="product_id">
                        Product
                        <span className="text-danger ml-1">*</span>
                      </Label>
                      <Autocomplete
                        name="product_id"
                        size="small"
                        onChange={(_event, newValue) => {
                          setProductValue(newValue);
                        }}
                        classes={{
                          option: classes.option,
                        }}
                        getOptionSelected={(option, value) => option.display_name === value.display_name}
                        getOptionLabel={(option) => (typeof option === 'string' ? option : option.display_name)}
                        renderOption={(option) => (
                          <>
                            <p className="float-left">
                              {option.display_name}
                            </p>
                            <p className="float-right">
                              {getProductQuantity(option.id)}
                            </p>
                          </>
                        )}
                        options={productOptions}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            variant="outlined"
                            className="without-padding"
                            placeholder="Select"
                            InputProps={{
                              ...params.InputProps,
                              endAdornment: (
                                <>
                                  {stockProducts && stockProducts.loading ? <CircularProgress color="inherit" size={20} /> : null}
                                  {params.InputProps.endAdornment}
                                </>
                              ),
                            }}
                          />
                        )}
                      />
                      {(stockProducts && stockProducts.err) && (<FormHelperText><span className="text-danger">{generateErrorMessage(stockProducts)}</span></FormHelperText>)}
                    </Col>
                    <Col xs={12} sm={12} md={12} lg={6}>
                      <Label for="quantity">
                        Quantity
                        <span className="text-danger ml-1">*</span>
                      </Label>
                      <Input type="text" id="quantity" value={quantityValue} onChange={onInputChange} className="" />
                    </Col>
                  </ThemeProvider>
                )}
              </Row>
            </>
            <Row className="justify-content-center">
              {isScrap && (transferDetails && !transferDetails.loading) && (
                <SuccessAndErrorFormat response={stateChangeInfo} successMessage="The product has been scrapped successfully.." />
              )}
              {stateChangeInfo && stateChangeInfo.err && (
                <SuccessAndErrorFormat response={stateChangeInfo} />
              )}
              {stockScrapInfo && stockScrapInfo.err && (
                <SuccessAndErrorFormat response={stockScrapInfo} />
              )}
              {stockScrapInfo && stockScrapInfo.loading && (
                <CardBody className="mt-4" data-testid="loading-case">
                  <Loader />
                </CardBody>
              )}
              {transferDetails && transferDetails.loading && (
                <CardBody className="mt-4" data-testid="loading-case">
                  <Loader />
                </CardBody>
              )}
              {isNotScrap && (
                <div className="text-danger text-center mt-3">
                  <FontAwesomeIcon className="mr-2 font-size20 mb-n2px" size="lg" icon={faExclamationCircle} />
                  Insufficient product quantity
                </div>
              )}
            </Row>
          </Box>
        </DialogContentText>
      </DialogContent>
      <DialogActions className="mr-3 ml-3">
        {stateChangeInfo && !stateChangeInfo.data && (
          <Button
            variant='contained'
            className="mr-1 submit-btn"
            disabled={!productValue || parseInt(quantityValue) === 0 || !quantityValue}
            onClick={() => handleStateChange(transferData.id)}
          >
            Scrap
          </Button>
        )}
        {((isScrap) || (isNotScrap)) && (
          <Button
            variant='contained'
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

Scrap.propTypes = {
  transferDetails: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array,
  ]).isRequired,
  scrapModal: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.string,
  ]).isRequired,
  atFinish: PropTypes.func.isRequired,
};
export default Scrap;
