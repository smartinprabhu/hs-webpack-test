/* eslint-disable import/no-unresolved */
/* eslint-disable camelcase */
/* eslint-disable react/jsx-props-no-spreading */
import React, { useState, useEffect } from 'react';
import {
  Table,
  Col,
  Row,
  Card,
  CardBody, Modal, ModalBody,
} from 'reactstrap';
import * as PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import Pagination from '@material-ui/lab/Pagination';
import { Tooltip } from 'antd';
import {
  FormControl, Input,
} from '@material-ui/core';
import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from '@material-ui/core/IconButton';
import BackspaceIcon from '@material-ui/icons/Backspace';
import SearchIcon from '@material-ui/icons/Search';

import plusCircleMiniIcon from '@images/icons/plusCircleBlue.svg';
import SuccessAndErrorFormat from '@shared/successAndErrorFormat';
import Loader from '@shared/loading';
import ModalHeaderComponent from '@shared/modalHeaderComponent';

import {
  getExtraSelection, getExtraSelectionCount,
} from '../../../helpdesk/ticketService';
import {
  getTaxData, clearAddProduct, clearTaxesInfo, clearTableData,
} from '../../purchaseService';
import { getPartsData } from '../../../preventiveMaintenance/ppmService';
import {
  getDefaultNoValue, getPagesCountV2, getFloatValue, getListOfModuleOperations,
} from '../../../util/appUtils';
import AddProduct from '../../products/addProduct';
import actionCodes from '../../products/data/actionCodes.json';

const appModels = require('../../../util/appModels').default;

const useStyles = makeStyles((theme) => ({
  root: {
    '& > *': {
      marginTop: theme.spacing(2),
    },
  },
}));

const SearchModal = (props) => {
  const {
    modelName,
    afterReset,
    fieldName,
    fields,
    company,
    otherFieldName,
    otherFieldValue,
    setFieldValue,
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
  const [openAddProductModal, setOpenAddProductModal] = useState(false);
  const [isSearch, setSearch] = useState(false);
  const {
    addProductInfo,
  } = useSelector((state) => state.purchase);

  const {
    listDataInfo, listDataCountInfo, listDataCountLoading,
  } = useSelector((state) => state.ticket);

  const { userRoles } = useSelector((state) => state.user);
  const allowedOperations = getListOfModuleOperations(userRoles && userRoles.data ? userRoles.data.allowed_modules : [], 'Purchase', 'code');

  const isCreatable = allowedOperations.includes(actionCodes['Add Product']);

  useEffect(() => {
    if ((modelName && fields)) {
      dispatch(getExtraSelection(company, modelName, limit, offset, fields, searchValue, otherFieldName, otherFieldValue));
    }
  }, [modelName, offset, isSearch]);

  useEffect(() => {
    if ((addProductInfo && addProductInfo.data)) {
      dispatch(getExtraSelection(company, modelName, limit, offset, fields, searchValue, otherFieldName, otherFieldValue));
      dispatch(getExtraSelectionCount(company, modelName, searchValue, otherFieldName, otherFieldValue));
    }
  }, [addProductInfo]);

  useEffect(() => {
    if (modelName) {
      dispatch(getExtraSelectionCount(company, modelName, searchValue, otherFieldName, otherFieldValue));
    }
  }, [modelName, isSearch]);

  const totalDataCount = listDataCountInfo && listDataCountInfo.length ? listDataCountInfo.length : 0;

  const pages = getPagesCountV2(totalDataCount, limit);

  const handlePageClick = (e, index) => {
    e.preventDefault();
    const offsetValue = (index - 1) * limit;
    setPage(index);
    setOffset(offsetValue);
  };

  const onSearchChange = (e) => {
    setSearchValue(e.target.value);
  };

  const handleRowClick = (data) => {
    setSelected(data.id);
    if (arrayValues && arrayValues.length > 0 && arrayIndex >= 0) {
      const newData = arrayValues;
      newData[arrayIndex].product_id = [data.id, data.name, data.company_id];
      newData[arrayIndex].name = data.name;
      newData[arrayIndex].company_id = data.company_id;
      newData[arrayIndex].price_unit = data.standard_price ? data.standard_price : 0;
      newData[arrayIndex].product_uom_id = data && data.uom_id ? [data.uom_id[0], data.uom_id[1]] : [];
      newData[arrayIndex].taxes_id = data.taxes_id ? data.taxes_id : '';
      newData[arrayIndex].price_subtotal = data && data.standard_price ? (getFloatValue(data.standard_price) * getFloatValue(newData[arrayIndex].product_qty)) : 0;
      dispatch(getTaxData(data.taxes_id ? data.taxes_id : '', appModels.TAX));
      dispatch(getPartsData(newData));
    } else {
      const items = { id: data.id, name: data.name };
      setFieldValue(fieldName, items);
    }
    if (afterReset) afterReset();
  };

  function getRow(assetData) {
    const tableTr = [];
    for (let i = 0; i < assetData.length; i += 1) {
      tableTr.push(
        <tr className={selectedId === assetData[i].id ? 'text-info cursor-pointer' : 'cursor-pointer'} onClick={() => handleRowClick(assetData[i])} key={i}>
          <td className="p-2"><span className="font-weight-400">{getDefaultNoValue(assetData[i].name)}</span></td>
        </tr>,
      );
    }
    return tableTr;
  }

  const addProductWindow = () => {
    setOpenAddProductModal(true);
  };

  const reset = () => {
    setOpenAddProductModal(false);
    dispatch(clearAddProduct());
    dispatch(clearTableData());
    dispatch(clearTaxesInfo());
  };

  const loading = (listDataInfo && listDataInfo.loading) || (listDataCountLoading);

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
                    {!listDataInfo.loaading && (listDataInfo && listDataInfo.data) && (totalDataCount)}
                  </span>
                </div>
              </Col>
              <Col sm="12" md="5" lg="5" xs="12" className="text-right">
                {isCreatable && fieldName === 'product' && (
                  <>
                    <Tooltip title="Add" placement="top">
                      <img
                        aria-hidden="true"
                        id="Add"
                        alt="Add"
                        className="cursor-pointer mr-3 mt-2"
                        onClick={addProductWindow}
                        src={plusCircleMiniIcon}
                      />
                    </Tooltip>
                  </>
                )}
                <FormControl variant="standard">
                  <Input
                    id="standard-adornment-password"
                    type="text"
                    name="search"
                    placeholder="search"
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
                      Name
                    </th>
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
      <Modal size={(addProductInfo && addProductInfo.data) ? 'sm' : 'xl'} className="border-radius-50px modal-dialog-centered purchase-modal" isOpen={openAddProductModal}>
        <ModalHeaderComponent title="Add Product" imagePath={false} closeModalWindow={() => { setOpenAddProductModal(false); }} response={addProductInfo} />
        <ModalBody className="mt-0 pt-0">
          <AddProduct
            reset={reset}
          />
        </ModalBody>
      </Modal>
    </Row>
  );
};

SearchModal.propTypes = {
  modelName: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.string,
  ]).isRequired,
  fieldName: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.string,
  ]).isRequired,
  afterReset: PropTypes.func.isRequired,
  fields: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.bool,
    PropTypes.string,
  ]).isRequired,
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
  arrayIndex: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.number,
    PropTypes.string,
  ]),
  arrayValues: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.bool,
    PropTypes.string,
  ]),
  setFieldValue: PropTypes.oneOfType([PropTypes.func, PropTypes.string]).isRequired,
};

SearchModal.defaultProps = {
  arrayValues: undefined,
  arrayIndex: undefined,
};

export default SearchModal;
