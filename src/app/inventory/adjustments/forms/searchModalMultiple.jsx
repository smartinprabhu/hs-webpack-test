/* eslint-disable max-len */
/* eslint-disable react/forbid-prop-types */
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
  Input,
  Modal,
  ModalBody,
  ModalFooter,
  Label,
  CardBody,
} from 'reactstrap';
import * as PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import Pagination from '@material-ui/lab/Pagination';
import {
  Button, FormControlLabel, FormGroup, Checkbox,
} from '@mui/material';
import { Tooltip } from 'antd';
import {
  Dialog, DialogContent, DialogContentText, DialogActions
} from '@mui/material';
import plusCircleMiniIcon from '@images/icons/plusCircleBlue.svg';

import ModalHeaderComponent from '@shared/modalHeaderComponent';
import SuccessAndErrorFormat from '@shared/successAndErrorFormat';
import Loader from '@shared/loading';
import ModalSearch from '@shared/modalSearch';

import { getLocationProducts, getLocationProductsCount } from '../../../preventiveMaintenance/ppmService';
import {
  getColumnArrayById, getDefaultNoValue, getPagesCountV2, extractTextObject,
  extractValueObjects, getListOfModuleOperations,
} from '../../../util/appUtils';
import {
  clearAddProduct, clearTaxesInfo, clearTableData,
} from '../../../purchase/purchaseService';
import actionCodes1 from '../../data/actionCodes.json';
import AddProduct from '../../../purchase/products/addProductMini';
import DialogHeader from '../../../commonComponents/dialogHeader';

const useStyles = makeStyles((theme) => ({
  root: {
    '& > *': {
      marginTop: theme.spacing(2),
    },
  },
}));

const SearchModalMultiple = (props) => {
  const {
    modelName,
    fields,
    company,
    afterReset,
    onProductChange,
    oldValues,
    locationId,
  } = props;
  const limit = 50;
  const dispatch = useDispatch();
  const classes = useStyles();
  const [searchValue, setSearchValue] = useState('');
  const [offset, setOffset] = useState(0);
  const [page, setPage] = useState(1);
  const [isSearch, setSearch] = useState(false);

  const [checkedRows, setCheckRows] = useState(oldValues);
  const [isAllChecked, setIsAllChecked] = useState(false);
  const [addModal, setAddModal] = useState(false);

  const { locationProducts, locationProductsCount } = useSelector((state) => state.ppm);

  const { userRoles } = useSelector((state) => state.user);

  const { addProductInfo } = useSelector((state) => state.purchase);

  const allowedOperations1 = getListOfModuleOperations(userRoles && userRoles.data ? userRoles.data.allowed_modules : [], 'Inventory', 'code');

  const isProductCreatable = allowedOperations1.includes(actionCodes1['Add Product']);

  useEffect(() => {
    setCheckRows(oldValues);
  }, []);

  const stockType = 'Inward';

  useEffect(() => {
    if (modelName && fields && locationId && extractValueObjects(locationId)) {
      let searchValueMultiple = '[';
      if (oldValues && oldValues.length > 0) {
        searchValueMultiple = `${searchValueMultiple}["id","not in",${JSON.stringify(getColumnArrayById(oldValues, 'id'))}]`;
      }
      if (searchValue) {
        searchValueMultiple = `${searchValueMultiple}${oldValues && oldValues.length > 0 ? ',' : ''}"|","|","|",["name","ilike","${searchValue}"],["brand","ilike","${searchValue}"],["categ_id.name","ilike","${searchValue}"],["unique_code","ilike","${searchValue}"]`;
      }
      searchValueMultiple = `${searchValueMultiple}]`;
      dispatch(getLocationProducts(extractValueObjects(locationId), false, offset, limit, stockType, searchValueMultiple));
    }
  }, [modelName, offset, isSearch]);

  useEffect(() => {
    if (modelName && locationId && extractValueObjects(locationId)) {
      let searchValueMultiple = '[';
      if (oldValues && oldValues.length > 0) {
        searchValueMultiple = `${searchValueMultiple}["id","not in",${JSON.stringify(getColumnArrayById(oldValues, 'id'))}]`;
      }
      if (searchValue) {
        searchValueMultiple = `${searchValueMultiple}${oldValues && oldValues.length > 0 ? ',' : ''}"|","|","|",["name","ilike","${searchValue}"],["brand","ilike","${searchValue}"],["categ_id.name","ilike","${searchValue}"],["unique_code","ilike","${searchValue}"]`;
      }

      searchValueMultiple = `${searchValueMultiple}]`;
      dispatch(getLocationProductsCount(extractValueObjects(locationId), false, stockType, searchValueMultiple));
    }
  }, [modelName, isSearch]);

  useEffect(() => {
    if (addProductInfo && addProductInfo.data) {
      let searchValueMultiple = '[';
      if (oldValues && oldValues.length > 0) {
        searchValueMultiple = `${searchValueMultiple}["id","not in",${JSON.stringify(getColumnArrayById(oldValues, 'id'))}]`;
      }
      if (searchValue) {
        searchValueMultiple = `${searchValueMultiple}${oldValues && oldValues.length > 0 ? ',' : ''}"|","|","|",["name","ilike","${searchValue}"],["unique_code","ilike","${searchValue}"],["brand","ilike","${searchValue}"],["categ_id.name","ilike","${searchValue}"]`;
      }
      searchValueMultiple = `${searchValueMultiple}]`;
      dispatch(getLocationProducts(extractValueObjects(locationId), false, offset, limit, stockType, searchValueMultiple));
      dispatch(getLocationProductsCount(extractValueObjects(locationId), false, stockType, searchValueMultiple));
    }
  }, [addProductInfo]);

  const totalDataCount = locationProductsCount && locationProductsCount.data ? locationProductsCount.data : 0;

  const pages = getPagesCountV2(totalDataCount, limit);

  const handlePageClick = (e, index) => {
    e.preventDefault();
    const offsetValue = (index - 1) * limit;
    setPage(index);
    setOffset(offsetValue);
    setIsAllChecked(false);
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

  const onClear = () => {
    setSearchValue('');
    setSearch(Math.random());
    setPage(0);
    setOffset(0);
  };

  const onSearch = () => {
    setSearch(Math.random());
    setPage(0);
    setOffset(0);
  };

  const onModalClose = () => {
    setAddModal(false);
  };

  const onProductClose = () => {
    dispatch(clearAddProduct());
    dispatch(clearTableData());
    dispatch(clearTaxesInfo());
  };

  const handleAdd = () => {
    if (checkedRows) {
      onProductChange(checkedRows);
    }
    if (afterReset) afterReset();
  };

  const handleTableCellChange = (event) => {
    const { checked, value } = event.target;
    const values = JSON.parse(value);
    if (checked) {
      setCheckRows((state) => [...state, values]);
      if ((checkedRows && checkedRows.length + 1 === 50) || (checkedRows && checkedRows.length + 1 === totalDataCount)) {
        setIsAllChecked(true);
      }
    } else {
      setCheckRows(checkedRows.filter((item) => item.id !== values.id));
      setIsAllChecked(false);
    }
  };

  const handleTableCellAllChange = (event) => {
    const { checked } = event.target;
    if (checked) {
      const data = locationProducts && locationProducts.data ? locationProducts.data : [];
      const newArr = [...data, ...checkedRows];
      setCheckRows([...new Map(newArr.map((item) => [item.id, item])).values()]);
      setIsAllChecked(true);
    } else {
      setCheckRows([]);
      setIsAllChecked(false);
    }
  };

  function getRow(assetData) {
    const tableTr = [];
    for (let i = 0; i < assetData.length; i += 1) {
      tableTr.push(
        <tr key={i}>
          <td className="w-5">
            <FormGroup>
              <FormControlLabel control={(
                <Checkbox
                  id={`checkboxtk${assetData[i].id}`}
                  className="ml-0"
                  name={assetData[i].name}
                  value={JSON.stringify(assetData[i])}
                  checked={!!(checkedRows && checkedRows.find((selectedValue) => parseInt(selectedValue.id) === parseInt(assetData[i].id)))}
                  onChange={handleTableCellChange}
                />
              )}
              />
            </FormGroup>
          </td>
          <td className="p-2"><span className="font-weight-400">{getDefaultNoValue(assetData[i].name)}</span></td>
          <td className="p-2"><span className="font-weight-400">{getDefaultNoValue(assetData[i].unique_code)}</span></td>
          <td className="p-2"><span className="font-weight-400">{assetData[i].qty_on_hand}</span></td>
          <td className="p-2"><span className="font-weight-400">{getDefaultNoValue(assetData[i].brand)}</span></td>
          <td className="p-2"><span className="font-weight-400">{getDefaultNoValue(extractTextObject(assetData[i].category))}</span></td>
          <td className="p-2"><span className="font-weight-400">{getDefaultNoValue(extractTextObject(assetData[i].parts_uom))}</span></td>
          <td className="p-2"><span className="font-weight-400">{getDefaultNoValue(assetData[i].specification)}</span></td>
        </tr>,
      );
    }
    return tableTr;
  }

  const loading = (locationProducts && locationProducts.loading) || (locationProductsCount && locationProductsCount.loading);

  return (
    <>
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
                      {totalDataCount}
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
                        className="cursor-pointer mr-3 mt-4"
                        onClick={() => setAddModal(true)}
                        src={plusCircleMiniIcon}
                      />
                    </Tooltip>
                  )}
                  <ModalSearch
                    searchValue={searchValue}
                    onSearchChange={onSearchChange}
                    onClear={onClear}
                    onSearch={onSearch}
                  />
                </Col>
              </Row>
              <div className="pl-1 pr-1 pt-0 comments-list thin-scrollbar">
                {(locationProducts && locationProducts.data) && (
                  <Table responsive>
                    <thead className="bg-gray-light">
                      <tr>
                        <th className="w-5">
                          <FormGroup>
                            <FormControlLabel control={(
                              <Checkbox
                                name="checkall"
                                id="checkboxtkhead1"
                                value="all"
                                checked={isAllChecked}
                                onChange={handleTableCellAllChange}
                              />
                            )}
                            />
                          </FormGroup>
                        </th>
                        <th className="pb-4 p-2 min-width-160">
                          Name
                        </th>
                        <th className="pb-4 p-2 min-width-160">
                          Product Code
                        </th>
                        <th className="pb-4 p-2 min-width-160">
                          Quantity on Hand
                        </th>
                        <th className="pb-4 p-2 min-width-160">
                          Product Brand
                        </th>
                        <th className="pb-4 p-2 min-width-160">
                          Product Category
                        </th>
                        <th className="pb-4 p-2 min-width-160">
                          Product UOM
                        </th>
                        <th className="pb-4 p-2 min-width-160">
                          Product Specification
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {getRow(locationProducts && locationProducts.data ? locationProducts.data : [])}
                    </tbody>
                  </Table>
                )}
              </div>
              {loading || pages === 0 ? (<span />) : (
                <div className={`${classes.root} float-right`}>
                  <Pagination count={pages} page={page} size="small" color="primary" onChange={handlePageClick} showFirstButton showLastButton />
                </div>
              )}
              {loading && (
                <Loader />
              )}
              {(locationProducts && locationProducts.err) && (
                <SuccessAndErrorFormat response={locationProducts} />
              )}
            </CardBody>
          </Card>
        </Col>
      </Row>
      <Dialog size={(addProductInfo && addProductInfo.data) ? 'sm' : 'xl'} open={addModal}>
        <DialogHeader title="Add Product" imagePath={false} onClose={() => { onModalClose(); onProductClose(); }} response={addProductInfo} sx={{ width: '500px' }} />
        <DialogContent sx={{ overflow: 'unset' }}>
          <DialogContentText id="alert-dialog-description">
            <AddProduct
              isTheme
              isModal
              reset={() => { onModalClose(); onProductClose(); }}
            />
          </DialogContentText>
        </DialogContent>
      </Dialog>
      <ModalFooter>
        {(checkedRows && checkedRows.length && checkedRows.length > 0)
          ? (
            <Button
              type="button"
              onClick={() => handleAdd()}
              variant="contained"
            >
              {' '}
              Add
            </Button>
          ) : ''}
      </ModalFooter>
    </>
  );
};

SearchModalMultiple.propTypes = {
  modelName: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.string,
  ]).isRequired,
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
  oldValues: PropTypes.array.isRequired,
  afterReset: PropTypes.func.isRequired,
  onProductChange: PropTypes.func.isRequired,
  locationId: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.bool,
  ]).isRequired,
};

export default SearchModalMultiple;
