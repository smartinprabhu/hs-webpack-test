/* eslint-disable max-len */
/* eslint-disable import/no-unresolved */
/* eslint-disable camelcase */
/* eslint-disable react/jsx-props-no-spreading */
import plusCircleMiniIcon from '@images/icons/plusCircleBlue.svg';
import {
  Input,
} from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import InputAdornment from '@material-ui/core/InputAdornment';
import { makeStyles } from '@material-ui/core/styles';
import BackspaceIcon from '@material-ui/icons/Backspace';
import SearchIcon from '@material-ui/icons/Search';
import Pagination from '@material-ui/lab/Pagination';
import {
  Dialog, DialogContent, DialogContentText,
} from '@mui/material';
import ErrorContent from '@shared/errorContent';
import { Tooltip } from 'antd';
import * as PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Card,
  CardBody,
  Col,
  Row,
  Table,
} from 'reactstrap';

import Loader from '@shared/loading';
import SuccessAndErrorFormat from '@shared/successAndErrorFormat';
import DialogHeader from '../../../commonComponents/dialogHeader';
import actionCodes from '../../../assets/data/assetActionCodes.json';
import { resetAddAssetInfo } from '../../../assets/equipmentService';
import {
  getExtraSelectionMultiple, getExtraSelectionMultipleCount,
} from '../../../helpdesk/ticketService';
import {
  resetAddVendorInfo,
} from '../../../purchase/purchaseService';
import AddVendor from '../../../purchase/vendors/addVendor';
import { getDefaultNoValue, getListOfOperations, getPagesCountV2 } from '../../../util/appUtils';

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
    modalName,
    setFieldValue,
    setVendorShow,
    setNatureShow,
  } = props;
  const limit = 50;
  const endpoint = 'search';
  const dispatch = useDispatch();
  const classes = useStyles();
  const [selectedId, setSelected] = useState('');
  const [isSearch, setSearch] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [offset, setOffset] = useState(0);
  const [page, setPage] = useState(1);
  const [addModal, setAddModal] = useState(false);
  const [modalHead, setModalHead] = useState('');

  const {
    listDataMultipleInfo, listDataMultipleCountInfo, listDataMultipleCountLoading,
  } = useSelector((state) => state.ticket);
  const {
    addVendorInfo,
  } = useSelector((state) => state.purchase);

  const { userRoles } = useSelector((state) => state.user);

  const {
    addAssetInfo,
  } = useSelector((state) => state.equipment);

  const allowedOperations = getListOfOperations(userRoles && userRoles.data ? userRoles.data.allowed_modules : [], 'code');

  const isEquipment = allowedOperations.includes(actionCodes['Add an Asset']);

  useEffect(() => {
    if (modelName && fields) {
      if ((addVendorInfo && addVendorInfo.data)) {
        const searchValueMultiple = `[["company_id","in",[${company}]],"|","|",["email", "ilike", "${searchValue}"],["name", "ilike", "${searchValue}"],["mobile", "ilike", "${searchValue}"]]`;
        const fieldsNew = '["id","name","email"]';
        dispatch(getExtraSelectionMultiple(company, modelName, limit, offset, fieldsNew, searchValueMultiple, false, endpoint));
        dispatch(getExtraSelectionMultipleCount(company, modelName, fields, searchValueMultiple, endpoint));
      }
    }
  }, [addVendorInfo]);

  useEffect(() => {
    if (modelName && fields) {
      if (fieldName === 'location_id' || fieldName === 'space_id') {
        const searchValueMultiple = `["&",["company_id","in",[${company}]],"|",["space_name", "ilike", "${searchValue}"],["path_name", "ilike", "${searchValue}"]]`;
        dispatch(getExtraSelectionMultiple(company, modelName, limit, offset, fields, searchValueMultiple));
      }
      if (fieldName === 'audit_system_id') {
        const searchValueMultiple = `[["title", "ilike", "${searchValue}"]]`;
        dispatch(getExtraSelectionMultiple(company, modelName, limit, offset, fields, searchValueMultiple));
      }
      if (fieldName === 'sys_auditor_id') {
        const searchValueMultiple = `[["company_id","in",[${company}]],"|","|",["email", "ilike", "${searchValue}"],["name", "ilike", "${searchValue}"],["mobile", "ilike", "${searchValue}"]]`;
        const fieldsNew = '["id", "name","email","mobile"]';
        dispatch(getExtraSelectionMultiple(company, modelName, limit, offset, fieldsNew, searchValueMultiple, false, endpoint));
      }
      if (fieldName === 'facility_manager_id') {
        const searchValueMultiple = `[["company_id","in",[${company}]],"|","|",["email", "ilike", "${searchValue}"],["name", "ilike", "${searchValue}"],["phone_number", "ilike", "${searchValue}"]]`;
        const fieldsNew = '["id", "name","email","phone_number"]';
        dispatch(getExtraSelectionMultiple(company, modelName, limit, offset, fieldsNew, searchValueMultiple, false, endpoint));
      }
    }
  }, [modelName, offset, isSearch]);

  useEffect(() => {
    if (modelName && fields) {
      if ((fieldName === 'location_id' || fieldName === 'space_id')) {
        const searchValueMultiple = `["&",["company_id","in",[${company}]],"|",["space_name", "ilike", "${searchValue}"],["path_name", "ilike", "${searchValue}"]]`;
        dispatch(getExtraSelectionMultipleCount(company, modelName, fields, searchValueMultiple));
      }
      if (fieldName === 'audit_system_id') {
        const searchValueMultiple = `[["title", "ilike", "${searchValue}"]]`;
        dispatch(getExtraSelectionMultipleCount(company, modelName, fields, searchValueMultiple));
      }
      if (fieldName === 'sys_auditor_id') {
        const searchValueMultiple = `[["company_id","in",[${company}]],"|","|",["email", "ilike", "${searchValue}"],["name", "ilike", "${searchValue}"],["mobile", "ilike", "${searchValue}"]]`;
        dispatch(getExtraSelectionMultipleCount(company, modelName, fields, searchValueMultiple, endpoint));
      }
      if (fieldName === 'facility_manager_id') {
        const searchValueMultiple = `[["company_id","in",[${company}]],"|","|",["email", "ilike", "${searchValue}"],["name", "ilike", "${searchValue}"],["phone_number", "ilike", "${searchValue}"]]`;
        dispatch(getExtraSelectionMultipleCount(company, modelName, fields, searchValueMultiple, endpoint));
      }
    }
  }, [modelName, isSearch]);

  const totalDataCount = listDataMultipleCountInfo && listDataMultipleCountInfo.length ? listDataMultipleCountInfo.length : 0;

  const pages = getPagesCountV2(totalDataCount, limit);

  const onAssetClose = () => {
    dispatch(resetAddAssetInfo());
  };

  const onVendorClose = () => {
    dispatch(resetAddAssetInfo());
    dispatch(resetAddVendorInfo());
  };

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
    let items = {};
    if ((fieldName === 'location_id' || fieldName === 'space_id')) {
      items = { id: data.id, path_name: data.path_name };
    } else if (fieldName === 'sys_auditor_id') {
      setVendorShow(true);
      items = data;
    } else if ((fieldName === 'audit_system_id')) {
      items = { id: data.id, title: data.title };
    } else if (fieldName === 'facility_manager_id') {
      setNatureShow(true);
      items = data;
    } else {
      items = { id: data.id, name: data.name };
    }
    setFieldValue(fieldName, items);
    if (afterReset) afterReset();
  };

  function getRow(arrayData) {
    const tableTr = [];
    for (let i = 0; i < arrayData.length; i += 1) {
      tableTr.push(
        <tr className={selectedId === arrayData[i].id ? 'text-info cursor-pointer' : 'cursor-pointer'} onClick={() => handleRowClick(arrayData[i])} key={i}>
          {(fieldName === 'location_id' || fieldName === 'space_id') && (
            <>
              <td className="p-2"><span className="font-weight-400">{getDefaultNoValue(arrayData[i].space_name)}</span></td>
              <td className="p-2"><span className="font-weight-400">{getDefaultNoValue(arrayData[i].path_name)}</span></td>
            </>
          )}
          {fieldName === 'sys_auditor_id' && (
            <>
              <td className="p-2"><span className="font-weight-400">{getDefaultNoValue(arrayData[i].name)}</span></td>
              <td className="p-2"><span className="font-weight-400">{getDefaultNoValue(arrayData[i].email)}</span></td>
              <td className="p-2"><span className="font-weight-400">{getDefaultNoValue(arrayData[i].mobile)}</span></td>
            </>
          )}
          {fieldName === 'facility_manager_id' && (
            <>
              <td className="p-2"><span className="font-weight-400">{getDefaultNoValue(arrayData[i].name)}</span></td>
              <td className="p-2"><span className="font-weight-400">{getDefaultNoValue(arrayData[i].email)}</span></td>
              <td className="p-2"><span className="font-weight-400">{getDefaultNoValue(arrayData[i].phone_number)}</span></td>
            </>
          )}
          {fieldName === 'audit_system_id' && (
            <td className="p-2"><span className="font-weight-400">{getDefaultNoValue(arrayData[i].title)}</span></td>
          )}

        </tr>,
      );
    }
    return tableTr;
  }

  const onModalOpen = () => {
    if (document.getElementById('vendorForm')) {
      document.getElementById('vendorForm').reset();
    }
    dispatch(resetAddVendorInfo());
    setAddModal(true);
    let listName = '';
    if (fieldName === 'sys_auditor_id') {
      listName = 'Add Auditor';
    }
    setModalHead(listName);
  };

  const onModalClose = (cancel) => {
    if (cancel === '1') {
      setAddModal(false);
      setSearch(Math.random());
    } else {
      if (document.getElementById('vendorForm')) {
        document.getElementById('vendorForm').reset();
      }
      dispatch(resetAddVendorInfo());
      setAddModal(false);
    }
  };

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

                {fieldName === 'sys_auditor_id' && (
                  <Tooltip title="Add" placement="top">
                    <img
                      aria-hidden="true"
                      id="Add"
                      alt="Add"
                      className="cursor-pointer mr-3 mt-2"
                      onClick={() => onModalOpen()}
                      src={plusCircleMiniIcon}
                    />
                  </Tooltip>
                )}
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
              </Col>
            </Row>
            <Table responsive className="mb-0">
              <thead className="bg-gray-light">
                <tr>
                  {(fieldName === 'location_id' || fieldName === 'space_id') && (
                    <>
                      <th className="p-2 min-width-100">
                        Space Name
                      </th>
                      <th className="p-2 min-width-100">
                        Full Path Name
                      </th>
                    </>
                  )}
                  {fieldName === 'audit_system_id' && (
                    <th className="p-2 min-width-100">
                      Name
                    </th>
                  )}
                  {fieldName === 'sys_auditor_id' && (
                    <>
                      <th className="p-2 min-width-100">
                        Name
                      </th>
                      <th className="p-2 min-width-100">
                        Email ID
                      </th>
                      <th className="p-2 min-width-100">
                        Mobile
                      </th>
                    </>
                  )}
                  {fieldName === 'facility_manager_id' && (
                    <>
                      <th className="p-2 min-width-100">
                        Name
                      </th>
                      <th className="p-2 min-width-100">
                        Email ID
                      </th>
                      <th className="p-2 min-width-100">
                        Phone Number
                      </th>
                    </>
                  )}
                  {fieldName === 'nature_work_id' && (
                    <th className="p-2 min-width-100">
                      Name
                    </th>
                  )}
                </tr>
              </thead>
            </Table>
            <div className="pl-1 pr-1 pt-0 comments-list thin-scrollbar">
              {(listDataMultipleInfo && listDataMultipleInfo.data) && (
                <Table>
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
            {(listDataMultipleInfo && listDataMultipleInfo.data && listDataMultipleInfo.data.length <= 0 && !listDataMultipleInfo.err) && (
              <ErrorContent errorTxt="No data found." />
            )}
          </CardBody>
        </Card>
      </Col>
      {
        (fieldName === 'sys_auditor_id') && (
          <Dialog size="xl" fullWidth open={addModal}>
            <DialogHeader title={modalHead} imagePath={false} onClose={() => { onModalClose(0); onVendorClose(); }} response={addVendorInfo} />
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                <AddVendor closeModal={() => { onModalClose(1); onVendorClose(); }} afterReset={() => { onModalClose(1); onVendorClose(); }} isTheme isAuditor isModal modalHead="Auditor Added Successfully" />
              </DialogContentText>
            </DialogContent>
          </Dialog>
        )
      }
      {/*  <Drawer
          title=""
          closable={false}
          className="drawer-bg-lightblue"
          width={1250}
          visible={addModal}
        >

          <DrawerHeader
            title="Create Vendors"
            imagePath={false}
            closeDrawer={() => { onModalClose(1); onVendorClose(); }}
          />
          <AddVendor
            editId={false}
            afterReset={() => { onModalClose(1); }}
            closeAddModal={() => { onVendorClose(false); }}
          />
      </Drawer> */}
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
  modalName: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.string,
  ]).isRequired,
  company: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.bool,
    PropTypes.string,
  ]).isRequired,
  setFieldValue: PropTypes.oneOfType([PropTypes.func, PropTypes.string]).isRequired,
  setVendorShow: PropTypes.oneOfType([PropTypes.func, PropTypes.string]).isRequired,
  setNatureShow: PropTypes.oneOfType([PropTypes.func, PropTypes.string]).isRequired,
};

export default SearchModalMultiple;
