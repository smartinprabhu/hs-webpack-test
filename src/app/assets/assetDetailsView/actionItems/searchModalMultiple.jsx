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
  Modal,
  ModalBody,
} from 'reactstrap';
import {
  Input, FormControl,
} from '@material-ui/core';
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
import ModalHeaderComponent from '@shared/modalHeaderComponent';
import Loader from '@shared/loading';
import {
  getExtraSelectionMultiple, getExtraSelectionMultipleCount,
} from '../../../helpdesk/ticketService';
import { resetAddAssetInfo } from '../../equipmentService';
import AddAsset from '../../addAsset';
import actionCodes from '../../data/assetActionCodes.json';
import { getDefaultNoValue, getPagesCountV2, getListOfOperations } from '../../../util/appUtils';

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
    categoryType,
  } = props;
  const limit = 50;
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
  const { addAssetInfo } = useSelector((state) => state.equipment);

  const { userRoles } = useSelector((state) => state.user);

  const allowedOperations = getListOfOperations(userRoles && userRoles.data ? userRoles.data.allowed_modules : [], 'code');

  const isEquipment = allowedOperations.includes(actionCodes['Add an Asset']);

  useEffect(() => {
    dispatch(resetAddAssetInfo());
  }, []);

  useEffect(() => {
    if (modelName && fields) {
      if ((addAssetInfo && addAssetInfo.data)) {
        const searchValueMultiple = `["&",["company_id","in",[${company}]],["is_itasset","=","true"],"|",["name", "ilike", "${searchValue}"],["location_id", "ilike", "${searchValue}"]]`;
        dispatch(getExtraSelectionMultiple(company, modelName, limit, offset, fields, searchValueMultiple));
        dispatch(getExtraSelectionMultipleCount(company, modelName, fields, searchValueMultiple));
      }
    }
  }, [addAssetInfo]);

  useEffect(() => {
    if (modelName && fields) {
      if (fieldName === 'location_id') {
        const searchValueMultiple = `["&",["company_id","in",[${company}]],"|",["space_name", "ilike", "${searchValue}"],["path_name", "ilike", "${searchValue}"]]`;
        dispatch(getExtraSelectionMultiple(company, modelName, limit, offset, fields, searchValueMultiple));
      }
      if (fieldName === 'asset_id') {
        const searchValueMultiple = `["&",["company_id","in",[${company}]],["is_itasset","=","true"],"|",["name", "ilike", "${searchValue}"],["location_id", "ilike", "${searchValue}"]]`;
        dispatch(getExtraSelectionMultiple(company, modelName, limit, offset, fields, searchValueMultiple));
      }
      if (fieldName === 'employee_id') {
        const searchValueMultiple = `["&",["company_id","in",[${company}]],"|","|",["name","ilike","${searchValue}"],["work_phone","ilike","${searchValue}"],["work_email","ilike","${searchValue}"]]`;
        dispatch(getExtraSelectionMultiple(company, modelName, limit, offset, fields, searchValueMultiple));
      }
    }
  }, [modelName, offset, isSearch]);

  useEffect(() => {
    if (modelName && fields) {
      if (fieldName === 'location_id') {
        const searchValueMultiple = `["&",["company_id","in",[${company}]],"|",["space_name", "ilike", "${searchValue}"],["path_name", "ilike", "${searchValue}"]]`;
        dispatch(getExtraSelectionMultipleCount(company, modelName, fields, searchValueMultiple));
      }
      if (fieldName === 'asset_id') {
        const searchValueMultiple = `["&",["company_id","in",[${company}]],["is_itasset","=","true"],"|",["name", "ilike", "${searchValue}"],["location_id", "ilike", "${searchValue}"]]`;
        dispatch(getExtraSelectionMultipleCount(company, modelName, fields, searchValueMultiple));
      }
      if (fieldName === 'employee_id') {
        const searchValueMultiple = `["&",["company_id","in",[${company}]],"|","|",["name","ilike","${searchValue}"],["work_phone","ilike","${searchValue}"],["work_email","ilike","${searchValue}"]]`;
        dispatch(getExtraSelectionMultipleCount(company, modelName, fields, searchValueMultiple));
      }
    }
  }, [modelName, isSearch]);

  const totalDataCount = listDataMultipleCountInfo && listDataMultipleCountInfo.length ? listDataMultipleCountInfo.length : 0;

  const pages = getPagesCountV2(totalDataCount, limit);

  const onAssetClose = () => {
    dispatch(resetAddAssetInfo());
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
          {fieldName === 'asset_id' && (
            <>
              <td className="p-2"><span className="font-weight-400">{getDefaultNoValue(arrayData[i].name)}</span></td>
              <td className="p-2"><span className="font-weight-400">{getDefaultNoValue(arrayData[i].location_id && arrayData[i].location_id.length > 0 ? arrayData[i].location_id[1] : '')}</span></td>
            </>
          )}
          {fieldName === 'employee_id' && (
            <>
              <td className="p-2"><span className="font-weight-400">{getDefaultNoValue(arrayData[i].name)}</span></td>
              <td className="p-2"><span className="font-weight-400">{getDefaultNoValue(arrayData[i].work_phone)}</span></td>
              <td className="p-2"><span className="font-weight-400">{getDefaultNoValue(arrayData[i].work_email)}</span></td>
            </>
          )}
        </tr>,
      );
    }
    return tableTr;
  }

  const onModalOpen = () => {
    setAddModal(true);
    let listName = '';
    if (fieldName === 'asset_id') {
      listName = 'Add IT Asset';
    }
    setModalHead(listName);
  };

  const onModalClose = (cancel) => {
    if (cancel === '1') {
      setAddModal(false);
      setSearch(Math.random());
    } else {
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
                    {!loading && (listDataMultipleInfo && listDataMultipleInfo.data) && (totalDataCount)}
                  </span>
                </div>
              </Col>
              <Col sm="12" md="5" lg="5" xs="12" className="text-right">
                {(isEquipment && fieldName === 'asset_id') && (
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
                    {fieldName === 'asset_id' && (
                    <>
                      <th className="p-2 min-width-100">
                        Name
                      </th>
                      <th className="p-2 min-width-100">
                        Full Path Name
                      </th>
                    </>
                    )}
                    {fieldName === 'employee_id' && (
                    <>
                      <th className="p-2 min-width-100">
                        Name
                      </th>
                      <th className="p-2 min-width-100">
                        Phone
                      </th>
                      <th className="p-2 min-width-100">
                        Email
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
      {(fieldName === 'asset_id') && (
      <Modal size={(addAssetInfo && addAssetInfo.data) ? 'sm' : 'xl'} className="border-radius-50px modal-dialog-centered" isOpen={addModal}>
        <ModalHeaderComponent title={modalHead} imagePath={false} closeModalWindow={() => { onModalClose(0); onAssetClose(); }} response={addAssetInfo} />
        <ModalBody className="pt-0 mt-0">
          <AddAsset closeModal={() => { onModalClose(1); onAssetClose(); }} afterReset={() => { onModalClose(1); onAssetClose(); }} isTheme isITAsset categoryType={categoryType} />
        </ModalBody>
      </Modal>
      )}
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
  categoryType: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.string,
  ]).isRequired,
  setFieldValue: PropTypes.oneOfType([PropTypes.func, PropTypes.string]).isRequired,
};

export default SearchModalMultiple;
