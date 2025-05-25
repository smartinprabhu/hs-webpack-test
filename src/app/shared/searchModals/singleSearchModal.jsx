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
import { Tooltip } from 'antd';

import plusCircleMiniIcon from '@images/icons/plusCircleBlue.svg';
import {
  Dialog,
  DialogContent, DialogContentText,
} from '@mui/material';
import * as PropTypes from 'prop-types';
import {
  Input, FormControl,
} from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import Pagination from '@material-ui/lab/Pagination';
import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from '@material-ui/core/IconButton';
import BackspaceIcon from '@material-ui/icons/Backspace';
import SearchIcon from '@material-ui/icons/Search';
import SuccessAndErrorFormat from '@shared/successAndErrorFormat';
import Loader from '@shared/loading';
import AddPartner from '../../adminSetup/siteConfiguration/addTenant/addCustomer';
import actionCodes from '../../adminSetup/data/actionCodes.json';
import actionCodes1 from '../../buildingCompliance/data/complianceActionCodes.json';
import AddUtil from '../../buildingCompliance/addUtils/addUtil';
import DialogHeader from '../../commonComponents/dialogHeader';

import {
  getExtraSelection, getExtraSelectionCount,
} from '../../helpdesk/ticketService';
import { getDefaultNoValue, getPagesCountV2, getListOfModuleOperations } from '../../util/appUtils';
import AddQuestionGroup from '../../auditManagement/auditDetails/systemForms/addQuestionGroup';

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
    isAdd,
    typeField,
    setSelectOption,
    columns,
    headers,
    value,
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

  const [addQuestionGroupModal, showAddQuestionGroupModal] = useState(false);
  const [modalHead, setModalHead] = useState('');
  const { userRoles } = useSelector((state) => state.user);

  const {
    listDataInfo, listDataCountInfo, listDataCountLoading,
  } = useSelector((state) => state.ticket);

  const allowedOperations = getListOfModuleOperations(userRoles && userRoles.data ? userRoles.data.allowed_modules : [], 'Admin Setup', 'code');
  const allowedOperations1 = getListOfModuleOperations(userRoles && userRoles.data ? userRoles.data.allowed_modules : [], 'Building Compliance', 'code');

  const { createTenantinfo } = useSelector((state) => state.setup);

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
    if (e.key === 'Enter') {
      setSearch(Math.random());
      setPage(1);
      setOffset(0);
    }
  };

  const handleRowClick = (data) => {
    setSelected(data.id);
    let items = { id: data.id, name: data.name };
    if (value) {
      items = data;
    }
    if (setSelectOption) {
      setFieldValue(data);
    } else {
      setFieldValue(fieldName, items);
    }
    if (afterReset) afterReset();
  };

  function getRow(assetData) {
    const tableTr = [];
    for (let i = 0; i < assetData.length; i += 1) {
      tableTr.push(
        <tr className={selectedId === assetData[i].id ? 'text-info cursor-pointer' : 'cursor-pointer'} onClick={() => handleRowClick(assetData[i])} key={i}>
          {headers && headers.length && columns && columns.length ? (
            <>
              {columns.map((column) => (
                <td className="p-2">
                  <span className="font-weight-400">
                    {getDefaultNoValue(assetData[i][column])}
                  </span>
                </td>
              ))}
            </>
          ) : (
            <td className="p-2">
              <span className="font-weight-400">
                {getDefaultNoValue(assetData[i].name)}

              </span>
            </td>
          )}
        </tr>,
      );
    }
    return tableTr;
  }

  const onModalClose = () => {
    setAddModal(false);
    dispatch(getExtraSelectionCount(company, modelName, searchValue, otherFieldName, otherFieldValue, false, typeField || false));
    dispatch(getExtraSelection(company, modelName, limit, offset, fields, searchValue, otherFieldName, otherFieldValue, false, false, typeField || false));
  };

  const onModalOpen = () => {
    setAddModal(true);
    let listName = 'list';
    if (fieldName === 'submitted_to') {
      listName = 'Add Customer';
    } else if (fieldName === 'compliance_category_id') {
      listName = 'Add Compliance Category';
    } else if (fieldName === 'compliance_act') {
      listName = 'Add Compliance Act';
    } else if (fieldName === 'location_id') {
      listName = 'Add Source Location';
    } else if (fieldName === 'location_dest_id') {
      listName = 'Add Destionation Location';
    }
    setModalHead(listName);
  };

  const loading = (listDataInfo && listDataInfo.loading) || (listDataCountLoading);
  const isAddVendor = allowedOperations.includes(actionCodes['Add Tenant']);
  const isCategoryCreatable = allowedOperations1.includes(actionCodes1['Add Compliance Category']);
  const isActCreatable = allowedOperations1.includes(actionCodes1['Add Compliance Act']);

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
                    {totalDataCount}
                  </span>
                </div>
              </Col>
              <Col sm="12" md="3" lg="3" xs="12">
                <div className="float-right">
                  {isAdd && fieldName === 'submitted_to' && isAddVendor && (
                  <Tooltip title="Add Customer" placement="top">
                    <img
                      aria-hidden="true"
                      id="Add"
                      alt="Add"
                      className="cursor-pointer mt-3 mr-3"
                      onClick={() => onModalOpen()}
                      src={plusCircleMiniIcon}
                    />
                  </Tooltip>
                  )}
                  {isAdd && fieldName === 'compliance_category_id' && isCategoryCreatable && (
                  <Tooltip title="Add Compliance Category" placement="top">
                    <img
                      aria-hidden="true"
                      id="Add"
                      alt="Add"
                      className="cursor-pointer mt-3 mr-3"
                      onClick={() => onModalOpen()}
                      src={plusCircleMiniIcon}
                    />
                  </Tooltip>
                  )}
                  {isAdd && fieldName === 'compliance_act' && isActCreatable && (
                  <Tooltip title="Add Compliance Act" placement="top">
                    <img
                      aria-hidden="true"
                      id="Add"
                      alt="Add"
                      className="cursor-pointer mt-3 mr-3"
                      onClick={() => onModalOpen()}
                      src={plusCircleMiniIcon}
                    />
                  </Tooltip>
                  )}
                  {fieldName && fieldName === 'question_group_id' && (
                  <Tooltip title="Create an Section" placement="top">
                    <img
                      aria-hidden="true"
                      id="Add"
                      alt="Add"
                      className="cursor-pointer mr-3 mt-3"
                      onClick={() => showAddQuestionGroupModal(true)}
                      src={plusCircleMiniIcon}
                    />
                  </Tooltip>
                  )}
                  <FormControl variant="standard">
                    <Input
                      type="input"
                      name="search"
                      id="exampleSearch"
                      placeholder="Search.."
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
                      className="subjectticket bw-2 mt-2"
                    />
                  </FormControl>
                </div>
              </Col>
            </Row>

            <div className="pl-1 pr-1 pt-0 comments-list thin-scrollbar">
              {(listDataInfo && listDataInfo.data) && (
                <Table responsive>
                  <thead className="bg-gray-light">
                    <tr>
                      {headers && headers.length ? (
                        <>
                          {headers.map((header) => (
                            <th className="p-2 min-width-100">
                              {header}
                            </th>
                          ))}
                        </>
                      ) : (
                        <th className="p-2 min-width-100">
                          Name
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
        {fieldName === 'submitted_to' && (
          <Dialog
            size={(createTenantinfo && createTenantinfo.data) ? 'sm' : 'xl'}
            fullWidth
            maxWidth="xl" // Allows the dialog to expand up to the largest size
            sx={{
              '& .MuiDialog-paper': {
                width: '600px', // Adjusts width to content size
                maxWidth: '80vw', // Limits the width to 80% of the viewport width
              },
            }}
            open={addModal}
          >
            <DialogHeader title={modalHead} imagePath={false} onClose={() => onModalClose()} response={createTenantinfo} />
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                <AddPartner
                  type="customer"
                  isComplaince
                  setFieldValue={setFieldValue}
                  afterReset={() => onModalClose()}
                />
              </DialogContentText>
            </DialogContent>
          </Dialog>
        )}
        {fieldName === 'compliance_category_id' && (
        <Dialog
          size={(createTenantinfo && createTenantinfo.data) ? 'sm' : 'xl'}
          fullWidth
          maxWidth="xl" // Allows the dialog to expand up to the largest size
          sx={{
            '& .MuiDialog-paper': {
              width: '600px', // Adjusts width to content size
              maxWidth: '80vw', // Limits the width to 80% of the viewport width
            },
          }}
          open={addModal}
        >
          <DialogHeader title={modalHead} imagePath={false} onClose={() => onModalClose()} response={createTenantinfo} />
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              <AddUtil
                moduleName="bcs.compliance.category"
                head="Compliance Category"
                setFieldValue={setFieldValue}
                afterReset={() => onModalClose()}
              />
            </DialogContentText>
          </DialogContent>
        </Dialog>
        )}
        {fieldName === 'compliance_act' && (
        <Dialog
          size={(createTenantinfo && createTenantinfo.data) ? 'sm' : 'xl'}
          fullWidth
          maxWidth="xl" // Allows the dialog to expand up to the largest size
          sx={{
            '& .MuiDialog-paper': {
              width: '600px', // Adjusts width to content size
              maxWidth: '80vw', // Limits the width to 80% of the viewport width
            },
          }}
          open={addModal}
        >
          <DialogHeader title={modalHead} imagePath={false} onClose={() => onModalClose()} response={createTenantinfo} />
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              <AddUtil
                moduleName="bcs.configuration.act"
                head="Compliance Act"
                setFieldValue={setFieldValue}
                afterReset={() => onModalClose()}
              />
            </DialogContentText>
          </DialogContent>
        </Dialog>
        )}
        {fieldName === 'question_group_id' && addQuestionGroupModal && (
        <AddQuestionGroup addModal={addQuestionGroupModal} atFinish={() => { showAddQuestionGroupModal(false); setSearch(Math.random()); }} />
        )}
      </Col>
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
  setFieldValue: PropTypes.oneOfType([PropTypes.func, PropTypes.string]),
};

export default SearchModal;
