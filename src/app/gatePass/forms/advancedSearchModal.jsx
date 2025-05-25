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
  Modal,
  ModalBody,
} from 'reactstrap';
import {
  Input, FormControl,
} from '@material-ui/core';
import { Tooltip } from 'antd';
import * as PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import Pagination from '@material-ui/lab/Pagination';
import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from '@material-ui/core/IconButton';
import BackspaceIcon from '@material-ui/icons/Backspace';
import SearchIcon from '@material-ui/icons/Search';
import {
  Dialog, DialogContent, DialogContentText,
} from '@mui/material';

import plusCircleMiniIcon from '@images/icons/plusCircleBlue.svg';

import SuccessAndErrorFormat from '@shared/successAndErrorFormat';
import Loader from '@shared/loading';
import ModalHeaderComponent from '@shared/modalHeaderComponent';
import DialogHeader from '../../commonComponents/dialogHeader';

import {
  getExtraSelectionMultiple, getExtraSelectionMultipleCount,
} from '../../helpdesk/ticketService';
import { getDefaultNoValue, getPagesCountV2, getListOfModuleOperations } from '../../util/appUtils';
import { resetCreateTeam } from '../../adminSetup/setupService';
import AddTeam from '../../adminSetup/siteConfiguration/addTeam';
import { resetAddVendorInfo } from '../../purchase/purchaseService';
import actionCodes from '../../adminSetup/data/actionCodes.json';
import actionCodes1 from '../data/actionCodes.json';
import AddVendor from '../../adminSetup/siteConfiguration/addTenant/addCustomer';

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
    approvalTeam,
  } = props;
  const limit = 50;
  const dispatch = useDispatch();
  const classes = useStyles();
  const [searchValue, setSearchValue] = useState('');
  const [offset, setOffset] = useState(0);
  const [page, setPage] = useState(1);
  const [isSearch, setSearch] = useState(false);
  const [selectedId, setSelected] = useState('');

  const [addModal, setAddModal] = useState(false);
  const [modalHead, setModalHead] = useState('');
  const [addVendorModal, showAddVendorModal] = useState(false);

  const {
    listDataMultipleInfo, listDataMultipleCountInfo, listDataMultipleCountLoading,
  } = useSelector((state) => state.ticket);
  const {
    createTenantinfo,
  } = useSelector((state) => state.setup);

  const { userRoles } = useSelector((state) => state.user);

  const {
    createTeamInfo,
  } = useSelector((state) => state.setup);

  const allowedOperations = getListOfModuleOperations(userRoles && userRoles.data ? userRoles.data.allowed_modules : [], 'Admin Setup', 'code');

  const allowedOperations1 = getListOfModuleOperations(userRoles && userRoles.data ? userRoles.data.allowed_modules : [], 'Gate Pass', 'code');

  const isCreatable = allowedOperations1.includes(actionCodes1['Add Vendors']);

  useEffect(() => {
    if (modelName && fields) {
      let searchValueMultiple = '[';

      if (fieldName !== 'type_work_id' && fieldName !== 'user_id' && fieldName !== 'vendor_id') {
        searchValueMultiple = `${searchValueMultiple}["company_id","in",[${company}]]`;
      } else if (fieldName === 'vendor_id') {
        searchValueMultiple = `${searchValueMultiple}["company_id","in",[${company}]], ["supplier", "=", true],["parent_id", "=", false],["name","!=",false],["name","!=",""],["display_name","!=",false]`;
      } else if (fieldName === 'user_id') {
        if (approvalTeam) {
          searchValueMultiple = `${searchValueMultiple}["company_id","in",[${company}]],["id","in",[${approvalTeam}]],["user_id","!=",false]`;
        } else {
          searchValueMultiple = `${searchValueMultiple}["company_id","in",[${company}]],["user_id","!=",false]`;
        }
      }

      if (searchValue) {
        if (fieldName !== 'type_work_id' && fieldName !== 'user_id' && fieldName !== 'vendor_id') {
          searchValueMultiple = `${searchValueMultiple},["name","ilike","${searchValue}"]`;
        } else if (fieldName === 'vendor_id') {
          searchValueMultiple = `${searchValueMultiple},"|","|",["email", "ilike", "${searchValue}"],["name", "ilike", "${searchValue}"],["mobile", "ilike", "${searchValue}"]`;
        } else if (fieldName === 'user_id' && approvalTeam) {
          searchValueMultiple = `${searchValueMultiple},["user_id","ilike","${searchValue}"]`;
        } else {
          searchValueMultiple = `${searchValueMultiple}["name","ilike","${searchValue}"]`;
        }
      }

      searchValueMultiple = `${searchValueMultiple}]`;
      dispatch(getExtraSelectionMultiple(company, modelName, limit, offset, fields, searchValueMultiple));
    }
  }, [modelName, offset, isSearch, createTeamInfo, createTenantinfo]);

  useEffect(() => {
    if (modelName) {
      let searchValueMultiple = '[';

      if (fieldName !== 'type_work_id' && fieldName !== 'commodity_id' && fieldName !== 'user_id' && fieldName !== 'vendor_id') {
        searchValueMultiple = `${searchValueMultiple}["company_id","in",[${company}]]`;
      } else if (fieldName === 'vendor_id') {
        searchValueMultiple = `${searchValueMultiple}["company_id","in",[${company}]], ["supplier", "=", true],["parent_id", "=", false],["name","!=",false],["name","!=",""],["display_name","!=",false]`;
      } else if (fieldName === 'user_id') {
        if (approvalTeam) {
          searchValueMultiple = `${searchValueMultiple}["company_id","in",[${company}]],["id","in",[${approvalTeam}]],["user_id","!=",false]`;
        } else {
          searchValueMultiple = `${searchValueMultiple}["company_id","in",[${company}]],["user_id","!=",false]`;
        }
      }

      if (searchValue) {
        if (fieldName !== 'type_work_id' && fieldName !== 'commodity_id' && fieldName !== 'user_id' && fieldName !== 'vendor_id') {
          searchValueMultiple = `${searchValueMultiple},["name","ilike","${searchValue}"]`;
        } else if (fieldName === 'vendor_id') {
          searchValueMultiple = `${searchValueMultiple},"|","|",["email", "ilike", "${searchValue}"],["name", "ilike", "${searchValue}"],["mobile", "ilike", "${searchValue}"]`;
        } else if (fieldName === 'user_id' && approvalTeam) {
          searchValueMultiple = `${searchValueMultiple},["user_id","ilike","${searchValue}"]`;
        } else {
          searchValueMultiple = `${searchValueMultiple}["name","ilike","${searchValue}"]`;
        }
      }

      searchValueMultiple = `${searchValueMultiple}]`;
      dispatch(getExtraSelectionMultipleCount(company, modelName, fields, searchValueMultiple));
    }
  }, [modelName, isSearch, createTeamInfo, createTenantinfo]);

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

  const handleRowClick = (data) => {
    setSelected(data.id);
    if (fieldName === 'user_id') {
      const items = { id: data.user_id[0], name: data.user_id[1] };
      setFieldValue(fieldName, items);
    } else {
      setFieldValue(fieldName, data);
    }
    if (afterReset) afterReset();
  };

  const onModalOpen = () => {
    setAddModal(true);
    let listName = 'Team';
    if (fieldName === 'space_id') {
      listName = 'Space';
    } else if (fieldName === 'pantry_id') {
      listName = 'Pantry';
    } else if (fieldName === 'reviewer_id' || fieldName === 'requestor_id') {
      listName = 'User';
    } else if (fieldName === 'Vendor_id') {
      listName = 'Vendor';
    }
    setModalHead(listName);
  };

  const onModalClose = () => {
    setAddModal(false);
    setSearch(Math.random());
  };

  const onTeamClose = () => {
    dispatch(resetCreateTeam());
  };

  function getRow(newData) {
    const tableTr = [];
    const assetData = fieldName === 'user_id' ? [...new Map(newData.map((item) => [item.user_id && item.user_id.length ? item.user_id[0] : item.id, item])).values()] : newData;
    for (let i = 0; i < assetData.length; i += 1) {
      tableTr.push(
        <tr className={selectedId === assetData[i].id ? 'text-info cursor-pointer' : 'cursor-pointer'} onClick={() => handleRowClick(assetData[i])} key={i}>
          {(fieldName === 'user_id')
            ? <td className="p-2"><span className="font-weight-400">{getDefaultNoValue(assetData[i].user_id && assetData[i].user_id.length > 0 ? assetData[i].user_id[1] : '')}</span></td>
            : (
              <>
                <td className="p-2"><span className="font-weight-400">{getDefaultNoValue(assetData[i].name)}</span></td>
                {fieldName === 'vendor_id' && (
                <>
                  <td className="p-2"><span className="font-weight-400">{getDefaultNoValue(assetData[i].email)}</span></td>
                  <td className="p-2"><span className="font-weight-400">{getDefaultNoValue(assetData[i].mobile)}</span></td>
                </>
                )}
              </>
            )}
        </tr>,
      );
    }
    return tableTr;
  }

  const addVendorWindow = () => {
    showAddVendorModal(true);
  };

  
  const onReset = () => {
    dispatch(resetAddVendorInfo());
  };

  const isAddTeam = allowedOperations.includes(actionCodes['Add Team']);

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
                    {totalDataCount}
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
                    className="cursor-pointer mr-3 mt-2"
                    onClick={addVendorWindow}
                    src={plusCircleMiniIcon}
                  />
                </Tooltip>
                )}
                {isAddTeam
                  && (fieldName === 'maintenance_team_id'
                    || fieldName === 'approval_authority_id' || fieldName === 'issue_permit_approval_id' || fieldName === 'ehs_authority_id' || fieldName === 'security_office_id') && (
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
                    className="mt-0"
                    placeholder={placeholderName}
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
                      <th className="p-2 min-width-160">
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
      {(fieldName === 'maintenance_team_id' || fieldName === 'approval_authority_id' || fieldName === 'ehs_authority_id' || fieldName === 'security_office_id') && (
        <Dialog maxWidth="md" open={addModal}>
          <DialogHeader title={`Add ${modalHead}`} imagePath={false} onClose={() => { onModalClose(); onTeamClose(); }} response={createTeamInfo} />
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              <AddTeam closeModal={() => { onModalClose(); onTeamClose(); }} isTheme directToView={false} selectedUser={false} editData={[]} modalHead={modalHead} />
            </DialogContentText>
          </DialogContent>
        </Dialog>
      )}
      {(fieldName === 'vendor_id') && (
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
      )}
      {(fieldName === 'reviewer_id' || fieldName === 'requestor_id') && (
        <Dialog maxWidth="md" open={addModal}>
          <DialogHeader title={`Add ${modalHead}`} imagePath={false} onClose={() => { onModalClose(); onTeamClose(); }} response={createTeamInfo} />
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              <AddTeam closeModal={() => { onModalClose(); onTeamClose(); }} isTheme directToView={false} selectedUser={false} editData={[]} modalHead={modalHead} />
            </DialogContentText>
          </DialogContent>
        </Dialog>
      )}
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
  approvalTeam: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.bool,
    PropTypes.object,
  ]),
};

AdvancedSearchModal.defaultProps = {
  approvalTeam: false,
};

export default AdvancedSearchModal;
