/* eslint-disable max-len */
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
import * as PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import Pagination from '@material-ui/lab/Pagination';
import { Tooltip } from 'antd';
import {
  FormControl, Input,
} from '@material-ui/core';
import {
  Dialog, DialogContent, DialogContentText,
} from '@mui/material';
import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from '@material-ui/core/IconButton';
import BackspaceIcon from '@material-ui/icons/Backspace';
import SearchIcon from '@material-ui/icons/Search';

import plusCircleMiniIcon from '@images/icons/plusCircleBlue.svg';
import SuccessAndErrorFormat from '@shared/successAndErrorFormat';
import Loader from '@shared/loading';
import {
  getExtraSelectionMultiple, getExtraSelectionMultipleCount,
} from '../../../helpdesk/ticketService';
import DialogHeader from '../../../commonComponents/dialogHeader';
import {
  getDefaultNoValue, getPagesCountV2, extractNameObject, getListOfModuleOperations,
} from '../../../util/appUtils';
import AddVendor from '../../../adminSetup/siteConfiguration/addTenant/addCustomer';
import { resetAddVendorInfo } from '../../../purchase/purchaseService';
import actionCodes1 from '../../data/actionCodes.json';
import AddTanker from '../addTanker';

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
    afterReset,
    fieldName,
    fields,
    company,
    tankerKeyword,
    setFieldValue,
  } = props;
  const limit = 50;
  const endpoint = 'search';
  const dispatch = useDispatch();
  const classes = useStyles();
  const [selectedId, setSelected] = useState('');
  const [searchValue, setSearchValue] = useState('');
  const [offset, setOffset] = useState(0);
  const [page, setPage] = useState(1);
  const [isSearch, setSearch] = useState(false);
  const [addVendorModal, showAddVendorModal] = useState(false);
  const [addTankerModal, showAddTankerModal] = useState(false);
  const {
    createTenantinfo,
  } = useSelector((state) => state.setup);

  const { userRoles } = useSelector((state) => state.user);

  const {
    listDataMultipleInfo, listDataMultipleCountInfo, listDataMultipleCountLoading,
  } = useSelector((state) => state.ticket);

  useEffect(() => {
    if (modelName && fields) {
      if (fieldName === 'vendor_id') {
        let searchValueMultiple = `[["company_id","in",[${company}]], ["supplier", "=", true],["parent_id", "=", false],["name","!=",false],["name","!=",""],["display_name","!=",false]]`;
        if (searchValue) {
          searchValueMultiple = `[["company_id","in",[${company}]], ["supplier", "=", true],["parent_id", "=", false],"|","|",["email", "ilike", "${searchValue}"],["name", "ilike", "${searchValue}"],["mobile", "ilike", "${searchValue}"]]`;
        }
        dispatch(getExtraSelectionMultiple(company, modelName, limit, offset, fields, searchValueMultiple));
      }
      if (fieldName === 'tanker_id') {
        const searchValueMultiple = `[["company_id","in",[${company}]],"|","|",["name", "ilike", "${searchValue}"],["vendor_id", "ilike", "${searchValue}"],["commodity", "ilike", "${searchValue}"]]`;
        const fieldsNew = '["id","name", ("commodity", ["id", "name", "is_enable_amount"]),"capacity",("company_id", ["id", "name"]),("vendor_id", ["id", "name"]),("uom_id", ["id", "name"])]';
        dispatch(getExtraSelectionMultiple(company, modelName, limit, offset, fieldsNew, searchValueMultiple, false, endpoint));
      }
    }
  }, [modelName, offset, isSearch]);

  useEffect(() => {
    if (modelName && fields) {
      if ((createTenantinfo && createTenantinfo.data)) {
        let searchValueMultiple = `[["company_id","in",[${company}]], ["supplier", "=", true],["parent_id", "=", false],["name","!=",false],["name","!=",""],["display_name","!=",false]]`;
        if (searchValue) {
          searchValueMultiple = `[["company_id","in",[${company}]], ["supplier", "=", true],["parent_id", "=", false],"|","|",["email", "ilike", "${searchValue}"],["name", "ilike", "${searchValue}"],["mobile", "ilike", "${searchValue}"]]`;
        }
        dispatch(getExtraSelectionMultiple(company, modelName, limit, offset, fields, searchValueMultiple));
        dispatch(getExtraSelectionMultipleCount(company, modelName, fields, searchValueMultiple));
      }
    }
  }, [createTenantinfo]);

  useEffect(() => {
    if (modelName && fields) {
      if ((fieldName === 'vendor_id')) {
        let searchValueMultiple = `[["company_id","in",[${company}]], ["supplier", "=", true],["parent_id", "=", false],["name","!=",false],["name","!=",""],["display_name","!=",false]]`;
        if (searchValue) {
          searchValueMultiple = `[["company_id","in",[${company}]], ["supplier", "=", true],["parent_id", "=", false],"|","|",["email", "ilike", "${searchValue}"],["name", "ilike", "${searchValue}"],["mobile", "ilike", "${searchValue}"]]`;
        }
        dispatch(getExtraSelectionMultipleCount(company, modelName, fields, searchValueMultiple));
      }
      if (fieldName === 'tanker_id') {
        const searchValueMultiple = `[["company_id","in",[${company}]],"|","|",["name", "ilike", "${searchValue}"],["vendor_id", "ilike", "${searchValue}"],["commodity", "ilike", "${searchValue}"]]`;
        dispatch(getExtraSelectionMultipleCount(company, modelName, fields, searchValueMultiple, endpoint));
      }
    }
  }, [modelName, isSearch]);

  const totalDataCount = listDataMultipleCountInfo && listDataMultipleCountInfo.length ? listDataMultipleCountInfo.length : 0;

  const pages = getPagesCountV2(totalDataCount, limit);

  const handlePageClick = (e, index) => {
    e.preventDefault();
    const offsetValue = (index - 1) * limit;
    setPage(index);
    setOffset(offsetValue);
  };

  const onSearchChange = (e) => {
    setSearchValue(e.target.value);
    if (e.key === 'Enter') {
      setSearch(Math.random());
      setPage(1);
      setOffset(0);
    }
  };

  const handleRowClick = (data) => {
    setSelected(data.id);
    let items = { id: data.id, name: data.name };
    if (fieldName === 'tanker_id') {
      items = {
        id: data.id,
        name: data.name,
        vendor_id: data.vendor_id ? data.vendor_id : '',
        commodity: data.commodity ? data.commodity : '',
        is_enable_amount: data.commodity && data.commodity.is_enable_amount ? data.commodity.is_enable_amount : '',
        uom_id: data.uom_id ? data.uom_id : '',
        capacity: data.capacity,
      };
    }

    setFieldValue(fieldName, items);
    if (afterReset) afterReset();
  };

  const addVendorWindow = () => {
    showAddVendorModal(true);
  };

  const addTankerWindow = () => {
    showAddTankerModal(true);
  };

  const closeModal = () => {
    showAddTankerModal(false);
    const searchValueMultiple = `[["company_id","in",[${company}]],"|","|",["name", "ilike", "${searchValue}"],["vendor_id", "ilike", "${searchValue}"],["commodity", "ilike", "${searchValue}"]]`;
    const fieldsNew = '["id","name", ("commodity", ["id", "name", "is_enable_amount"]),"capacity",("company_id", ["id", "name"]),("vendor_id", ["id", "name"]),("uom_id", ["id", "name"])]';
        dispatch(getExtraSelectionMultiple(company, modelName, limit, offset, fieldsNew, searchValueMultiple, false, endpoint));
    dispatch(getExtraSelectionMultipleCount(company, modelName, fields, searchValueMultiple, endpoint));
  };

  const onReset = () => {
    dispatch(resetAddVendorInfo());
  };

  function getRow(assetData) {
    const tableTr = [];
    for (let i = 0; i < assetData.length; i += 1) {
      tableTr.push(
        <tr className={selectedId === assetData[i].id ? 'text-info cursor-pointer' : 'cursor-pointer'} onClick={() => handleRowClick(assetData[i])} key={i}>
          <td className="p-2"><span className="font-weight-400">{getDefaultNoValue(assetData[i].name)}</span></td>
          {fieldName === 'vendor_id' && (
            <>
              <td className="p-2"><span className="font-weight-400">{getDefaultNoValue(assetData[i].email)}</span></td>
              <td className="p-2"><span className="font-weight-400">{getDefaultNoValue(assetData[i].mobile)}</span></td>
            </>
          )}
          {fieldName === 'tanker_id' && (
          <>
            <td className="p-2"><span className="font-weight-400">{getDefaultNoValue(extractNameObject(assetData[i].vendor_id, 'name'))}</span></td>
            <td className="p-2"><span className="font-weight-400">{getDefaultNoValue(extractNameObject(assetData[i].commodity, 'name'))}</span></td>
          </>
          )}
        </tr>,
      );
    }
    return tableTr;
  }

  const allowedOperations = getListOfModuleOperations(userRoles && userRoles.data ? userRoles.data.allowed_modules : [], 'Purchase', 'code');

  const allowedOperations1 = getListOfModuleOperations(userRoles && userRoles.data ? userRoles.data.allowed_modules : [], 'Commodity Transactions', 'code');

  const isCreatable1 = allowedOperations1.includes(actionCodes1['Create Tanker']);

  const isCreatable = allowedOperations1.includes(actionCodes1['Add Vendors']);

  const loading = (listDataMultipleInfo && listDataMultipleInfo.loading) || (listDataMultipleCountLoading);

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
                    {!listDataMultipleInfo.loaading && (listDataMultipleInfo && listDataMultipleInfo.data) && (totalDataCount)}
                  </span>
                </div>
              </Col>
              <Col sm="12" md="5" lg="5" xs="12" className="text-right">
                {isCreatable && fieldName === 'vendor_id' && (
                <Tooltip title="Add Vendor" placement="top">
                  <img
                    aria-hidden="true"
                    id="Add"
                    alt="Add"
                    className="cursor-pointer mr-3 mt-4"
                    onClick={addVendorWindow}
                    src={plusCircleMiniIcon}
                  />
                </Tooltip>
                )}
                {isCreatable1 && fieldName === 'tanker_id' && (
                <Tooltip title="Add Tanker" placement="top">
                  <img
                    aria-hidden="true"
                    id="Add"
                    alt="Add"
                    className="cursor-pointer mr-3 mt-4"
                    onClick={addTankerWindow}
                    src={plusCircleMiniIcon}
                  />
                </Tooltip>
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
              {(listDataMultipleInfo && listDataMultipleInfo.data) && (
              <Table responsive>
                <thead className="bg-gray-light">
                  <tr>
                    <th className="p-2 min-width-100">
                      Name
                    </th>
                    {fieldName === 'vendor_id' && (
                    <>
                      <th className="p-2 min-width-100">
                        Email ID
                      </th>
                      <th className="p-2 min-width-100">
                        Mobile
                      </th>
                    </>
                    )}
                    {fieldName === 'tanker_id' && (
                    <>
                      <th className="p-2 min-width-100">
                        Vendor
                      </th>
                      <th className="p-2 min-width-100">
                        Commodity
                      </th>
                    </>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {getRow(listDataMultipleInfo && listDataMultipleInfo.data ? listDataMultipleInfo.data : [])}
                </tbody>
              </Table>
              )}
            </div>
            {loading || pages === 0 ? (<span />) : (
              <div className={`${classes.root} float-right`}>
                <Pagination count={pages} page={page} size="small" color="primary" onChange={handlePageClick} showFirstButton showLastButton />
              </div>
            )}
            {listDataMultipleInfo && listDataMultipleInfo.loading && (
            <Loader />
            )}
            {(listDataMultipleInfo && listDataMultipleInfo.err) && (
            <SuccessAndErrorFormat response={listDataMultipleInfo} />
            )}
          </CardBody>
        </Card>
      </Col>
      <Dialog maxWidth={(createTenantinfo && createTenantinfo.data) ? 'sm' : 'md'} open={addVendorModal}>
        <DialogHeader title="Add Vendor" imagePath={false} onClose={() => { showAddVendorModal(false); }} sx={{ width: '800px' }} />
        <DialogContent>
          <DialogContentText id="alert-dialog-description">

            <AddVendor
              setFieldValue={setFieldValue}
              requestorName=""
              updateField="vendor_id"
              type="vendor"
              afterReset={() => { showAddVendorModal(false); onReset(); }}
            />
          </DialogContentText>
        </DialogContent>
      </Dialog>
      <Dialog maxWidth={(createTenantinfo && createTenantinfo.data) ? 'sm' : 'md'} open={addTankerModal}>
        <DialogHeader title="Add Tanker" imagePath={false} onClose={() => { showAddTankerModal(false); }} sx={{ width: '800px' }} />
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <AddTanker setFieldValue={setFieldValue} isModal tankerKeyword={tankerKeyword} closeModal={closeModal} selectedUser={false} editData={false} />
          </DialogContentText>
        </DialogContent>
      </Dialog>
    </Row>
  );
};

SearchModalMultiple.propTypes = {
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
  setFieldValue: PropTypes.oneOfType([PropTypes.func, PropTypes.string]).isRequired,
};

export default SearchModalMultiple;
