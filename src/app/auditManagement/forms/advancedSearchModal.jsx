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
import { useDispatch, useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import Pagination from '@material-ui/lab/Pagination';
import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from '@material-ui/core/IconButton';
import BackspaceIcon from '@material-ui/icons/Backspace';
import SearchIcon from '@material-ui/icons/Search';
import CircularProgress from '@mui/material/CircularProgress';
import { Tooltip } from 'antd';

import plusCircleMiniIcon from '@images/icons/plusCircleBlue.svg';

import TrackerCheck from '@images/icons/auditBlue.svg';
import SuccessAndErrorFormat from '@shared/successAndErrorFormat';
import Loader from '@shared/loading';

import DialogHeader from '../../commonComponents/dialogHeader';
import {
  getExtraSelectionMultiple, getExtraSelectionMultipleCount,
} from '../../helpdesk/ticketService';
import {
  resetCreateSytem,
  resetUpdateSystem,
} from '../auditService';
import {
  getDefaultNoValue, getPagesCountV2, getListOfOperations, extractTextObject,
} from '../../util/appUtils';
import AddSystem from '../addSystem';
import actionCodes from '../data/actionCodes.json';

const useStyles = makeStyles((theme) => ({
  root: {
    '& > *': {
      marginTop: theme.spacing(2),
    },
  },
}));

const AdvancedSearchModal = (props) => {
  const {
    modelName,
    fields,
    company,
    fieldName,
    placeholderName,
    afterReset,
    setFieldValue,
    setAssignMember,
    setAssignType,
  } = props;
  const limit = 50;
  const dispatch = useDispatch();
  const classes = useStyles();
  const [searchValue, setSearchValue] = useState('');
  const [offset, setOffset] = useState(0);
  const [page, setPage] = useState(1);
  const [isSearch, setSearch] = useState(false);
  const [selectedId, setSelected] = useState('');

  const [addSystemModal, showAddSystemModal] = useState(false);
  const [modalHead, setModalHead] = useState('');
  const [viewId, setViewId] = useState(false);
  const [viewModal, setViewModal] = useState(false);

  const {
    listDataMultipleInfo, listDataMultipleCountInfo, listDataMultipleCountLoading,
  } = useSelector((state) => state.ticket);

  const { userRoles } = useSelector((state) => state.user);


  const allowedOperations = getListOfOperations(
    userRoles && userRoles.data ? userRoles.data.allowed_modules : [],
    'code',
  );

  const isCreateSystem = allowedOperations.includes(actionCodes['Add Audit System']);

  useEffect(() => {
    if (modelName && fields) {
      let searchValueMultiple = `[${company}`;

      if (searchValue) {
        searchValueMultiple = `${searchValueMultiple},["name","ilike","${searchValue}"]`;
      }

      searchValueMultiple = `${searchValueMultiple}]`;
      dispatch(getExtraSelectionMultiple(company, modelName, limit, offset, fields, searchValueMultiple));
    }
  }, [company, offset, isSearch]);

  useEffect(() => {
    if (modelName) {
      let searchValueMultiple = `[${company}`;

      if (searchValue) {
        searchValueMultiple = `${searchValueMultiple},["name","ilike","${searchValue}"]`;
      }

      searchValueMultiple = `${searchValueMultiple}]`;
      dispatch(getExtraSelectionMultipleCount(company, modelName, fields, searchValueMultiple));
    }
  }, [company, isSearch]);

  const totalDataCount = listDataMultipleCountInfo && listDataMultipleCountInfo.length ? listDataMultipleCountInfo.length : 0;

  const pages = getPagesCountV2(totalDataCount, limit);

  const handlePageClick = (e, index) => {
    e.preventDefault();
    const offsetValue = (index - 1) * limit;
    setPage(index);
    setOffset(offsetValue);
  };

  const onSearchChange = (e, search) => {
    setSearchValue(e.target.value);
    if (e.key === 'Enter' || (search && !e.target.value)) {
      setSearch(Math.random());
      setPage(1);
      setOffset(0);
    }
  };

  const handleRowClick = (data) => {
    setSelected(data.id);
    if (setAssignMember && fieldName === 'assigned_id') {
      setAssignMember(data);
    } else if (setAssignType && fieldName === 'task_type_id') {
      setAssignType(data);
    } else {
      setFieldValue(fieldName, data);
    }
    if (afterReset) afterReset();
  };

  function getRow(assetData) {
    const tableTr = [];
    for (let i = 0; i < assetData.length; i += 1) {
      tableTr.push(
        <tr className={selectedId === assetData[i].id ? 'text-info cursor-pointer' : 'cursor-pointer'} onClick={() => handleRowClick(assetData[i])} key={i}>
          <td className="p-2"><span className="font-weight-400">{getDefaultNoValue(assetData[i].name)}</span></td>
          {fieldName === 'equipment_id' && (
            <>
              <td className="p-2"><span className="font-weight-400">{getDefaultNoValue(extractTextObject(assetData[i].location_id))}</span></td>
              <td className="p-2"><span className="font-weight-400">{getDefaultNoValue(extractTextObject(assetData[i].category_id))}</span></td>
            </>
          )}
        </tr>,
      );
    }
    return tableTr;
  }

  const resetForm = () => {
    if (document.getElementById('systemForm')) {
      document.getElementById('systemForm').reset();
    }
    setSearch(Math.random());
    dispatch(resetCreateSytem());
    dispatch(resetUpdateSystem());
    showAddSystemModal(false);
  };

  const resetAdd = () => {
    dispatch(resetCreateSytem());
    dispatch(resetUpdateSystem());
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
                    {listDataMultipleCountInfo && !listDataMultipleCountInfo.loading && totalDataCount}
                    {listDataMultipleCountLoading && (
                      <CircularProgress size={20} className="mt-2" />
                    )}
                  </span>
                </div>
              </Col>
              <Col sm="12" md="5" lg="5" xs="12" className="text-right">
                {fieldName && fieldName === 'audit_system_id' && isCreateSystem && (
                <Tooltip title="Create an System" placement="top">
                  <img
                    aria-hidden="true"
                    id="Add"
                    alt="Add"
                    className="cursor-pointer mr-3 mt-4"
                    onClick={() => showAddSystemModal(true)}
                    src={plusCircleMiniIcon}
                  />
                </Tooltip>
                )}
                <FormControl variant="standard">
                  <Input
                    id="standard-adornment-password"
                    type="text"
                    name="search"
                    placeholder={placeholderName}
                    value={searchValue}
                    onChange={(e) => onSearchChange(e, 'search')}
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
            <Table responsive className="mb-0">
              <thead className="bg-gray-light">
                <tr>
                  <th className="p-2 min-width-160">
                    Name
                  </th>
                  {fieldName === 'equipment_id' && (
                    <>
                      <th className="p-2 min-width-160">
                        Location
                      </th>
                      <th className="p-2 min-width-160">
                        Category
                      </th>
                    </>
                  )}
                </tr>
              </thead>
            </Table>
            <div className="pl-1 pr-1 pt-0 comments-list thin-scrollbar">
              {(listDataMultipleInfo && listDataMultipleInfo.data) && (
                <Table responsive>
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
            <Dialog size="lg" fullWidth open={addSystemModal}>
              <DialogHeader title="Create an System" imagePath={TrackerCheck} onClose={() => resetForm()} />
              <DialogContent>
                <DialogContentText id="alert-dialog-description">

                  <AddSystem
                    editId={false}
                    closeModal={() => resetForm()}
                    afterReset={() => resetAdd()}
                    isShow={addSystemModal}
                    addModal={addSystemModal}
                    setViewId={setViewId}
                    setViewModal={setViewModal}
                    isDialog
                  />
                </DialogContentText>
              </DialogContent>
            </Dialog>
          </CardBody>
        </Card>
      </Col>
    </Row>
  );
};

AdvancedSearchModal.propTypes = {
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
  fieldName: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.string,
  ]).isRequired,
  afterReset: PropTypes.func.isRequired,
  placeholderName: PropTypes.string.isRequired,
  setFieldValue: PropTypes.func.isRequired,
};

export default AdvancedSearchModal;
