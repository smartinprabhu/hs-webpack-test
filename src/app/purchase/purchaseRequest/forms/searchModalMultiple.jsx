/* eslint-disable max-len */
/* eslint-disable import/no-unresolved */
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
  getExtraSelectionMultiple, getExtraSelectionMultipleCount,
} from '../../../helpdesk/ticketService';
import {
  getDefaultNoValue, getPagesCountV2, getListOfModuleOperations,
} from '../../../util/appUtils';
import AddVendor from '../../vendors/addVendor';
import { resetAddVendorInfo } from '../../purchaseService';
import actionCodesVendor from '../../vendors/data/actionCodes.json';

const useStyles = makeStyles((theme) => ({
  root: {
    '& > *': {
      marginTop: theme.spacing(2),
    },
  },
}));

const SearchModalMutliple = (props) => {
  const {
    modelName,
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
  const [searchValue, setSearchValue] = useState('');
  const [offset, setOffset] = useState(0);
  const [page, setPage] = useState(1);
  const [addVendorModal, showAddVendorModal] = useState(false);
  const [isSearch, setSearch] = useState(false);
  const {
    addVendorInfo,
  } = useSelector((state) => state.purchase);

  const {
    listDataMultipleInfo, listDataMultipleCountInfo, listDataMultipleCountLoading,
  } = useSelector((state) => state.ticket);

  const { userRoles } = useSelector((state) => state.user);

  const allowedOperations = getListOfModuleOperations(userRoles && userRoles.data ? userRoles.data.allowed_modules : [], 'Purchase', 'code');

  const isCreatableVendor = allowedOperations.includes(actionCodesVendor['Add vendors']);

  useEffect(() => {
    if (modelName && fields) {
      if (fieldName === 'partner_id') {
        const searchValueMultiple = `["&",["company_id","in",[${company}]], ["supplier", "=", true],["parent_id", "=", false],"|","|",["email", "ilike", "${searchValue}"],["name", "ilike", "${searchValue}"],["mobile", "ilike", "${searchValue}"]]`;
        dispatch(getExtraSelectionMultiple(company, modelName, limit, offset, fields, searchValueMultiple));
      }
    }
  }, [modelName, offset, isSearch]);

  useEffect(() => {
    if (modelName && fields) {
      if ((addVendorInfo && addVendorInfo.data)) {
        const searchValueMultiple = `["&",["company_id","in",[${company}]], ["supplier", "=", true],["parent_id", "=", false],"|","|",["email", "ilike", "${searchValue}"],["name", "ilike", "${searchValue}"],["mobile", "ilike", "${searchValue}"]]`;
        dispatch(getExtraSelectionMultiple(company, modelName, limit, offset, fields, searchValueMultiple));
        dispatch(getExtraSelectionMultipleCount(company, modelName, fields, searchValueMultiple));
      }
    }
  }, [addVendorInfo]);

  useEffect(() => {
    if (modelName && fields) {
      if ((fieldName === 'partner_id')) {
        const searchValueMultiple = `["&",["company_id","in",[${company}]],["supplier", "=", true],["parent_id", "=", false],"|","|",["email", "ilike", "${searchValue}"],["name", "ilike", "${searchValue}"],["mobile", "ilike", "${searchValue}"]]`;
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
  };

  const handleRowClick = (data) => {
    setSelected(data.id);
    let items = '';
    if (fieldName === 'request_id') {
      items = { id: data.id, display_name: data.display_name };
    } else {
      items = { id: data.id, name: data.name };
    }
    setFieldValue(fieldName, items);
    if (afterReset) afterReset();
  };

  const addVendorWindow = () => {
    showAddVendorModal(true);
  };

  const onReset = () => {
    dispatch(resetAddVendorInfo());
  };

  function getRow(assetData) {
    const tableTr = [];
    for (let i = 0; i < assetData.length; i += 1) {
      tableTr.push(
        <tr className={selectedId === assetData[i].id ? 'text-info cursor-pointer' : 'cursor-pointer'} onClick={() => handleRowClick(assetData[i])} key={i}>
          {fieldName !== 'request_id' && (
            <td className="p-2"><span className="font-weight-400">{getDefaultNoValue(assetData[i].name)}</span></td>
          )}
          {fieldName === 'partner_id' && (
            <td className="p-2"><span className="font-weight-400">{getDefaultNoValue(assetData[i].email)}</span></td>
          )}
          {fieldName === 'partner_id' && (
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
                {isCreatableVendor && fieldName === 'partner_id' && (
                <Tooltip title="Add" placement="top">
                  <img
                    aria-hidden="true"
                    id="Add"
                    alt="Add"
                    className="cursor-pointer mr-3 mt-2"
                    onClick={addVendorWindow}
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
                    {fieldName !== 'request_id' && (
                    <th className="p-2 min-width-100">
                      Name
                    </th>
                    )}
                    {fieldName === 'partner_id' && (
                    <th className="p-2 min-width-100">
                      Email ID
                    </th>
                    )}
                    {fieldName === 'partner_id' && (
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
      <Modal size={(addVendorInfo && addVendorInfo.data) ? 'sm' : 'xl'} className="border-radius-50px modal-dialog-centered purchase-modal" isOpen={addVendorModal}>
        <ModalHeaderComponent title="Add Vendor" imagePath={false} closeModalWindow={() => { showAddVendorModal(false); onReset(); }} response={addVendorInfo} />
        <ModalBody className="mt-0 pt-0">
          <AddVendor
            editId={false}
            isTheme
            afterReset={() => { showAddVendorModal(false); onReset(); }}
          />
        </ModalBody>
      </Modal>
    </Row>
  );
};

SearchModalMutliple.propTypes = {
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

export default SearchModalMutliple;
