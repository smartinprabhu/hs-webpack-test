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
  CardBody} from 'reactstrap';
import {
  Input, FormControl,
} from '@material-ui/core';
import * as PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import Pagination from '@material-ui/lab/Pagination';
import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from '@material-ui/core/IconButton';
import BackspaceIcon from '@material-ui/icons/Backspace';
import SearchIcon from '@material-ui/icons/Search';
import { Tooltip } from 'antd';
import {
  Dialog, DialogContent, DialogContentText, Box,
} from '@mui/material';

import plusCircleMiniIcon from '@images/icons/plusCircleBlue.svg';
import SuccessAndErrorFormat from '@shared/successAndErrorFormat';
import Loader from '@shared/loading';
import DialogHeader from '../../commonComponents/dialogHeader';
import {
  getExtraSelectionMultiple, getExtraSelectionMultipleCount,
} from '../../helpdesk/ticketService';
import { getDefaultNoValue, getPagesCountV2, getListOfModuleOperations } from '../../util/appUtils';
import AddVendor from '../../purchase/vendors/addVendor';
import { resetAddVendorInfo } from '../../purchase/purchaseService';
import actionCodes from '../../purchase/vendors/data/actionCodes.json';

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
    modalName,
    afterReset,
    fieldName,
    fields,
    company,
    setFieldValue,
  } = props;
  const limit = 50;
  const dispatch = useDispatch();
  const classes = useStyles();
  const [selectedId, setSelected] = useState('');
  const [isSearch, setSearch] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [offset, setOffset] = useState(0);
  const [page, setPage] = useState(1);
  const [addVendorModal, showAddVendorModal] = useState(false);
  const [modalHead, setModalHead] = useState('');
  const [successMassage, setSuccessMassage] = useState('');

  const {
    addVendorInfo,
  } = useSelector((state) => state.purchase);

  const { userRoles } = useSelector((state) => state.user);

  const allowedOperations = getListOfModuleOperations(userRoles && userRoles.data ? userRoles.data.allowed_modules : [], 'Purchase', 'code');

  const {
    listDataMultipleInfo, listDataMultipleCountInfo, listDataMultipleCountLoading,
  } = useSelector((state) => state.ticket);

  useEffect(() => {
    if (modelName && fields) {
      if ((fieldName === 'vendor_id' || fieldName === 'customer_id' || fieldName === 'manufacturer_id')) {
        const searchValueMultiple = `["&",["company_id","in",[${company}]], ["supplier", "=", true],"|","|",["email", "ilike", "${searchValue}"],["display_name", "ilike", "${searchValue}"],["mobile", "ilike", "${searchValue}"]]`;
        dispatch(getExtraSelectionMultiple(company, modelName, limit, offset, fields, searchValueMultiple));
      }
    }
  }, [modelName, offset, isSearch]);

  useEffect(() => {
    if (modelName && fields) {
      if ((addVendorInfo && addVendorInfo.data)) {
        const searchValueMultiple = `["&",["company_id","in",[${company}]], ["supplier", "=", true],"|","|",["email", "ilike", "${searchValue}"],["display_name", "ilike", "${searchValue}"],["mobile", "ilike", "${searchValue}"]]`;
        dispatch(getExtraSelectionMultiple(company, modelName, limit, offset, fields, searchValueMultiple));
        dispatch(getExtraSelectionMultipleCount(company, modelName, fields, searchValueMultiple));
      }
    }
  }, [addVendorInfo]);

  useEffect(() => {
    if (modelName && fields) {
      if ((fieldName === 'vendor_id' || fieldName === 'customer_id' || fieldName === 'manufacturer_id')) {
        const searchValueMultiple = `["&",["company_id","in",[${company}]],["supplier", "=", true],"|","|",["email", "ilike", "${searchValue}"],["display_name", "ilike", "${searchValue}"],["mobile", "ilike", "${searchValue}"]]`;
        dispatch(getExtraSelectionMultipleCount(company, modelName, fields, searchValueMultiple));
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
    const items = { id: data.id, display_name: data.display_name };
    setFieldValue(fieldName, items);
    if (afterReset) afterReset();
  };

  const addVendorWindow = () => {
    showAddVendorModal(true);
    let listName = 'Add Vendor';
    let massage = 'Vendor Added Successfully';
    if (fieldName === 'customer_id') {
      listName = 'Add Customer';
      massage = 'Customer Added Successfully';
    } else if (fieldName === 'manufacturer_id') {
      listName = 'Add Manufacturer';
      massage = 'Manufacture Added Successfully';
    }
    setModalHead(listName);
    setSuccessMassage(massage);
  };

  const onReset = () => {
    dispatch(resetAddVendorInfo());
  };

  const isCreatable = allowedOperations.includes(actionCodes['Add vendors']);

  function getRow(assetData) {
    const tableTr = [];
    for (let i = 0; i < assetData.length; i += 1) {
      tableTr.push(
        <tr className={selectedId === assetData[i].id ? 'text-info cursor-pointer' : 'cursor-pointer'} onClick={() => handleRowClick(assetData[i])} key={i}>
          {(fieldName === 'vendor_id' || fieldName === 'customer_id' || fieldName === 'manufacturer_id') && (
            <td className="p-2"><span className="font-weight-400">{getDefaultNoValue(assetData[i].display_name)}</span></td>
          )}
          {(fieldName === 'vendor_id' || fieldName === 'customer_id' || fieldName === 'manufacturer_id') && (
            <td className="p-2"><span className="font-weight-400">{getDefaultNoValue(assetData[i].email)}</span></td>
          )}
          {(fieldName === 'vendor_id' || fieldName === 'customer_id' || fieldName === 'manufacturer_id') && (
            <td className="p-2"><span className="font-weight-400">{getDefaultNoValue(assetData[i].mobile)}</span></td>
          )}
        </tr>,
      );
    }
    return tableTr;
  }

  const loading = (listDataMultipleInfo && listDataMultipleInfo.loading) || (listDataMultipleCountLoading);

  return (
    <Row>
      <Col sm="12" md="12" lg="12" xs="12">
        <Card className="p-2 bg-lightblue h-100">
          <CardBody className="bg-color-white p-1 m-0">
            <Row className="pl-2 pr-2 pb-0 pt-0">
              <Col sm="12" md="9" lg="9" xs="12">
                <div className="mt-3">
                  <span className="p-0 font-weight-600 font-medium mr-2">
                    Total :
                    {' '}
                    {!loading && (listDataMultipleInfo && listDataMultipleInfo.data) && (totalDataCount)}
                  </span>
                </div>
              </Col>
              <Col sm="12" md="1" lg="1" xs="12">
                {isCreatable && (fieldName === 'vendor_id' || fieldName === 'customer_id' || fieldName === 'manufacturer_id') && (
                  <div className="float-right">
                    <Tooltip title={modalHead} placement="top">
                      <img
                        aria-hidden="true"
                        id="Add"
                        alt="Add"
                        className="cursor-pointer mr-2"
                        onClick={addVendorWindow}
                        src={plusCircleMiniIcon}
                      />
                    </Tooltip>
                  </div>
                )}
              </Col>
              <Col sm="12" md="2" lg="2" xs="12" className="pl-0 text-right">
                <FormControl variant="standard">
                  <Input
                    id="standard-adornment-password"
                    type="text"
                    name="search"
                    placeholder={modalName}
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
                      {(fieldName === 'vendor_id' || fieldName === 'customer_id' || fieldName === 'manufacturer_id') && (
                        <th className="p-2 min-width-100">
                          Email ID
                        </th>
                      )}
                      {(fieldName === 'vendor_id' || fieldName === 'customer_id' || fieldName === 'manufacturer_id') && (
                        <th className="p-2 min-width-100">
                          Mobile
                        </th>
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
      <Dialog maxWidth="lg" open={addVendorModal} fullWidth={!(addVendorInfo && addVendorInfo.data)}>
        <DialogHeader title={modalHead} onClose={() => { showAddVendorModal(false); onReset(); }} response={addVendorInfo} imagePath={false} />
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
              <AddVendor
                editId={false}
                afterReset={() => { dispatch(resetAddVendorInfo()); showAddVendorModal(false); onReset(); }}
                modalHead={successMassage}
                isTheme
                isModal
              />
            </Box>
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
  modalName: PropTypes.oneOfType([
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
