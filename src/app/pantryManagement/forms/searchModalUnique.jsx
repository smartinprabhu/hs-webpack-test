/* eslint-disable radix */
/* eslint-disable import/no-unresolved */
/* eslint-disable camelcase */
/* eslint-disable react/jsx-props-no-spreading */
import React, { useState, useEffect } from 'react';
import {
  Table,
  Col,
  Row,
  Card,
  CardBody,
} from 'reactstrap';
import {
  Input, FormControl,
} from '@material-ui/core';
import {
  Dialog, DialogContent, DialogContentText,
} from '@mui/material';
import * as PropTypes from 'prop-types';
import { Tooltip } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import Pagination from '@material-ui/lab/Pagination';
import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from '@material-ui/core/IconButton';
import BackspaceIcon from '@material-ui/icons/Backspace';
import SearchIcon from '@material-ui/icons/Search';

import plusCircleMiniIcon from '@images/icons/plusCircleBlue.svg';

import SuccessAndErrorFormat from '@shared/successAndErrorFormat';
import Loader from '@shared/loading';
import DialogHeader from '../../commonComponents/dialogHeader';

import {
  getExtraSelection, getExtraSelectionCount,
} from '../../helpdesk/ticketService';
import {
  getDefaultNoValue, getPagesCountV2, extractTextObject, numToFloat,
  getColumnArrayByIdWithArray, getListOfModuleOperations,
} from '../../util/appUtils';
import customDataJson from '../../purchase/data/customData.json';
import AddProduct from '../../purchase/products/addProductMini';
import {
  clearAddProduct, clearTaxesInfo, clearTableData,
} from '../../purchase/purchaseService';
import actionCodes from '../../inventory/data/actionCodes.json';

const useStyles = makeStyles((theme) => ({
  root: {
    '& > *': {
      marginTop: theme.spacing(2),
    },
  },
}));

const SearchModalUnique = (props) => {
  const {
    modelName,
    afterReset,
    fieldName,
    fields,
    company,
    otherFieldName,
    otherFieldValue,
    onProductChange,
    arrayValues,
    arrayIndex,
  } = props;
  const limit = 50;
  const dispatch = useDispatch();
  const classes = useStyles();
  const [selectedId, setSelected] = useState('');
  const [searchValue, setSearchValue] = useState('');
  const [offset, setOffset] = useState(0);
  const [page, setPage] = useState(1);
  const [isSearch, setSearch] = useState(false);

  const [addModal, setAddModal] = useState(false);

  const {
    listDataInfo, listDataCountInfo, listDataCountLoading,
  } = useSelector((state) => state.ticket);

  const { addProductInfo } = useSelector((state) => state.purchase);

  const { userRoles } = useSelector((state) => state.user);

  const allowedOperations = getListOfModuleOperations(userRoles && userRoles.data ? userRoles.data.allowed_modules : [], 'Inventory', 'code');

  const isProductCreatable = allowedOperations.includes(actionCodes['Add Product']);

  useEffect(() => {
    if (modelName && fields) {
      dispatch(getExtraSelection(company, modelName, limit, offset, fields, searchValue, otherFieldName, otherFieldValue));
    }
  }, [modelName, offset, isSearch]);

  useEffect(() => {
    if (modelName) {
      dispatch(getExtraSelectionCount(company, modelName, searchValue, otherFieldName, otherFieldValue));
    }
  }, [modelName, isSearch]);

  const getType = (productType) => {
    if (productType && customDataJson && customDataJson.productTypeNames && customDataJson.productTypeNames[productType]) {
      return customDataJson.productTypeNames[productType].label;
    }
    return '-';
  };

  const handlePageClick = (e, index) => {
    e.preventDefault();
    const offsetValue = (index - 1) * limit;
    setPage(index);
    setOffset(offsetValue);
  };

  const onSearchChange = (e) => {
    setSearchValue(e.target.value);
    if (e.target.value.length < 2 && e.key === 'Backspace') {
      setSearchValue('');
      setSearch(Math.random());
    }
    if (e.key === 'Enter') {
      setSearch(Math.random());
      setPage(0);
      setOffset(0);
    }
  };

  const onModalOpen = () => {
    dispatch(clearAddProduct());
    dispatch(clearTableData());
    dispatch(clearTaxesInfo());
    setAddModal(true);
  };

  const onModalClose = () => {
    setAddModal(false);
    setSearch(Math.random());
  };

  const onProductClose = () => {
    dispatch(clearAddProduct());
    dispatch(clearTableData());
    dispatch(clearTaxesInfo());
  };

  const handleRowClick = (data) => {
    setSelected(data.id);
    if (arrayValues && arrayValues.length > 0 && arrayIndex >= 0) {
      onProductChange(data, arrayIndex);
    }
    if (afterReset) afterReset();
  };

  function isProductExists(id) {
    let isAllowed = true;
    if (fieldName === 'order_lines') {
      const ids = getColumnArrayByIdWithArray(arrayValues && arrayValues.length > 0 ? arrayValues : [], 'product_id');
      if (ids && (ids.indexOf(id) !== -1)) {
        isAllowed = false;
      }
    }
    return isAllowed;
  }

  function getRow(assetData) {
    const tableTr = [];
    for (let i = 0; i < assetData.length; i += 1) {
      if (isProductExists(assetData[i].id)) {
        tableTr.push(
          <tr className={selectedId === assetData[i].id ? 'text-info cursor-pointer' : 'cursor-pointer'} onClick={() => handleRowClick(assetData[i])} key={i}>
            <td className="p-2"><span className="font-weight-400">{getDefaultNoValue(assetData[i].name)}</span></td>
            {fieldName === 'order_lines' && (
            <td className="p-2"><span className="font-weight-400">{getType(assetData[i].type)}</span></td>
            )}
            {fieldName === 'order_lines' && (
            <td className="p-2"><span className="font-weight-400">{getDefaultNoValue(extractTextObject(assetData[i].uom_id))}</span></td>
            )}
            {fieldName === 'order_lines' && (
            <td className="p-2"><span className="font-weight-400">{numToFloat(assetData[i].qty_available)}</span></td>
            )}
          </tr>,
        );
      }
    }
    return tableTr;
  }

  const loading = (listDataInfo && listDataInfo.loading) || (listDataCountLoading);
  const existsProducts = getColumnArrayByIdWithArray(arrayValues && arrayValues.length > 0 ? arrayValues : [], 'product_id');
  let totalDataCount = listDataCountInfo && listDataCountInfo.length ? listDataCountInfo.length : 0;
  if (fieldName === 'order_lines' && totalDataCount) {
    const existsCount = existsProducts ? existsProducts.length : 0;
    if (totalDataCount > existsCount) {
      totalDataCount = parseInt(totalDataCount) - parseInt(existsCount);
    } else if (existsCount > totalDataCount) {
      totalDataCount = parseInt(existsCount) - parseInt(totalDataCount);
    } else if (totalDataCount === existsCount) {
      totalDataCount = 0;
    }
  }

  const pages = getPagesCountV2(totalDataCount, limit);

  return (
    <Row>
      <Col sm="12" md="12" lg="12" xs="12">
        <Card className="p-2 bg-lightblue h-100">
          <CardBody className="bg-color-white p-1 m-0">
            <Row className="pl-2 pr-2 pb-0 pt-0">
              <Col sm="12" md="7" lg="7" xs="12">
                <div className="mt-3">
                  <span className="p-0 font-weight-600 font-medium mr-2">
                    Total :
                    {' '}
                    {!loading && (listDataInfo && listDataInfo.data) && (totalDataCount)}
                  </span>
                </div>
              </Col>
              <Col sm="12" md="5" lg="5" xs="12" className="text-right">
                {isProductCreatable && (
                <Tooltip title="Add" placement="top">
                  <img
                    aria-hidden="true"
                    id="Add"
                    alt="Add"
                    className="cursor-pointer mr-4 mt-4"
                    onClick={() => onModalOpen()}
                    src={plusCircleMiniIcon}
                  />
                </Tooltip>
                )}
                <FormControl variant="standard">
                  <Input
                    id="standard-adornment-password"
                    type="text"
                    name="search"
                    placeholder="Search Products"
                    value={searchValue}
                    onChange={onSearchChange}
                    onKeyDown={onSearchChange}
                    endAdornment={(
                      <InputAdornment position="end">
                        {searchValue && (
                          <>
                            <IconButton
                              aria-label="toggle password visibility"
                              onClick={() => {
                                setSearchValue('');
                                setSearch(Math.random());
                                setPage(1);
                                setOffset(0);
                              }}
                            >
                              <BackspaceIcon fontSize="small" />
                            </IconButton>
                            <IconButton
                              aria-label="toggle search visibility"
                              onClick={() => {
                                setSearch(Math.random());
                                setPage(1);
                                setOffset(0);
                              }}
                            >
                              <SearchIcon fontSize="small" />
                            </IconButton>
                          </>
                        )}
                      </InputAdornment>
            )}
                  />
                </FormControl>
              </Col>
            </Row>

            <div className="pl-1 pr-1 pt-0 comments-list thin-scrollbar">
              {(listDataInfo && listDataInfo.data) && (
              <Table responsive>
                <thead className="bg-gray-light">
                  <tr>
                    <th className="p-2 min-width-100">
                      {fieldName === 'order_lines' ? 'Product Name' : 'Name'}
                    </th>
                    {fieldName === 'order_lines' && (
                    <th className="p-2 min-width-100">
                      Product Type
                    </th>
                    )}
                    {fieldName === 'order_lines' && (
                    <th className="p-2 min-width-100">
                      Product UOM
                    </th>
                    )}
                    {fieldName === 'order_lines' && (
                    <th className="p-2 min-width-100">
                      Quantity on Hand
                    </th>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {getRow(listDataInfo && listDataInfo.data ? listDataInfo.data : [])}
                </tbody>
              </Table>
              )}
            </div>
            {loading || pages === 0 ? (<span />) : (
              <div className={`${classes.root} float-right`}>
                <Pagination count={pages} page={page} size="small" color="primary" onChange={handlePageClick} showFirstButton showLastButton />
              </div>
            )}
            {listDataInfo && listDataInfo.loading && (
            <Loader />
            )}
            {(listDataInfo && listDataInfo.err) && (
            <SuccessAndErrorFormat response={listDataInfo} />
            )}
          </CardBody>
        </Card>
      </Col>
      {fieldName === 'order_lines' && (
        <Dialog size={(addProductInfo && addProductInfo.data) ? 'sm' : 'xl'} fullWidth={!((addProductInfo && addProductInfo.data))} open={addModal}>
          <DialogHeader title="Add Product" imagePath={false} onClose={() => { onModalClose(); onProductClose(); }} response={addProductInfo} />
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              <AddProduct
                isTheme
                isPantry
                reset={() => { onModalClose(); onProductClose(); }}
                isModal
              />
            </DialogContentText>
          </DialogContent>
        </Dialog>
      )}
    </Row>
  );
};

SearchModalUnique.propTypes = {
  modelName: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.string,
  ]).isRequired,
  fieldName: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.string,
  ]).isRequired,
  arrayIndex: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.number,
    PropTypes.string,
  ]),
  afterReset: PropTypes.func.isRequired,
  fields: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.bool,
    PropTypes.string,
  ]).isRequired,
  arrayValues: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.bool,
    PropTypes.string,
  ]),
  company: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.bool,
    PropTypes.string,
  ]).isRequired,
  otherFieldName: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.string,
  ]).isRequired,
  otherFieldValue: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.string,
  ]).isRequired,
  onProductChange: PropTypes.oneOfType([PropTypes.func, PropTypes.string]).isRequired,
};

SearchModalUnique.defaultProps = {
  arrayValues: undefined,
  arrayIndex: undefined,
};

export default SearchModalUnique;
