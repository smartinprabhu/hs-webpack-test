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
import { Tooltip } from 'antd';
import * as PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import Pagination from '@material-ui/lab/Pagination';
import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from '@material-ui/core/IconButton';
import BackspaceIcon from '@material-ui/icons/Backspace';
import SearchIcon from '@material-ui/icons/Search';
import { Dialog, DialogContent, DialogContentText } from '@mui/material';
import DialogHeader from '../../commonComponents/dialogHeader';

import plusCircleMiniIcon from '@images/icons/plusCircleBlue.svg';

import SuccessAndErrorFormat from '@shared/successAndErrorFormat';
import Loader from '@shared/loading';

import {
  getExtraSelectionMultiple, getExtraSelectionMultipleCount,
} from '../../helpdesk/ticketService';
import { getDefaultNoValue, getPagesCountV2, getListOfModuleOperations } from '../../util/appUtils';
import { resetCreateTeam } from '../../adminSetup/setupService';
import AddTeam from '../../adminSetup/siteConfiguration/addTeam';
import actionCodes from '../../adminSetup/data/actionCodes.json';

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
  const [successMsg, setSuccessMsg] = useState('');

  const {
    listDataMultipleInfo, listDataMultipleCountInfo, listDataMultipleCountLoading,
  } = useSelector((state) => state.ticket);
  const {
    createUserInfo,
  } = useSelector((state) => state.setup);

  const { userRoles } = useSelector((state) => state.user);

  const {
    createTeamInfo,
  } = useSelector((state) => state.setup);

  const allowedOperations = getListOfModuleOperations(userRoles && userRoles.data ? userRoles.data.allowed_modules : [], 'Admin Setup', 'code');

  useEffect(() => {
    if (modelName && fields) {
      let searchValueMultiple = '[';

      if (fieldName !== 'type_work_id' && fieldName !== 'user_id') {
        searchValueMultiple = `${searchValueMultiple}["company_id","in",[${company}]]`;
      } else if (fieldName === 'user_id') {
        if (approvalTeam) {
          searchValueMultiple = `${searchValueMultiple}["company_id","in",[${company}]],["id","in",[${approvalTeam}]],["user_id","!=",false]`;
        } else {
          searchValueMultiple = `${searchValueMultiple}["company_id","in",[${company}]],["user_id","!=",false]`;
        }
      } else if (fieldName === 'type_work_id') {
        searchValueMultiple = `[${company}`;
      }

      if (searchValue) {
        if (fieldName !== 'user_id') {
          searchValueMultiple = `${searchValueMultiple},["name","ilike","${searchValue}"]`;
        } else if (fieldName === 'user_id' && approvalTeam) {
          searchValueMultiple = `${searchValueMultiple},["user_id","ilike","${searchValue}"]`;
        } else {
          searchValueMultiple = `${searchValueMultiple}["name","ilike","${searchValue}"]`;
        }
      } else if (fieldName === 'type_work_id') {
        searchValueMultiple = `[${company}`;
      }

      searchValueMultiple = `${searchValueMultiple}]`;
      dispatch(getExtraSelectionMultiple(company, modelName, limit, offset, fields, searchValueMultiple));
    }
  }, [modelName, offset, isSearch]);

  useEffect(() => {
    if (modelName) {
      let searchValueMultiple = '[';

      if (fieldName !== 'type_work_id' && fieldName !== 'commodity_id' && fieldName !== 'user_id') {
        searchValueMultiple = `${searchValueMultiple}["company_id","in",[${company}]]`;
      } else if (fieldName === 'user_id') {
        if (approvalTeam) {
          searchValueMultiple = `${searchValueMultiple}["company_id","in",[${company}]],["id","in",[${approvalTeam}]],["user_id","!=",false]`;
        } else {
          searchValueMultiple = `${searchValueMultiple}["company_id","in",[${company}]],["user_id","!=",false]`;
        }
      }

      if (searchValue) {
        if (fieldName !== 'commodity_id' && fieldName !== 'user_id') {
          searchValueMultiple = `${searchValueMultiple},["name","ilike","${searchValue}"]`;
        } else if (fieldName === 'user_id' && approvalTeam) {
          searchValueMultiple = `${searchValueMultiple},["user_id","ilike","${searchValue}"]`;
        } else {
          searchValueMultiple = `${searchValueMultiple}["name","ilike","${searchValue}"]`;
        }
      }

      searchValueMultiple = `${searchValueMultiple}]`;
      dispatch(getExtraSelectionMultipleCount(company, modelName, fields, searchValueMultiple));
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
    let listName = 'Add Team';
    let successMessage = 'Team';
    if (fieldName === 'space_id') {
      listName = 'Add Space';
      successMessage = 'Space';
    } else if (fieldName === 'pantry_id') {
      listName = 'Add Pantry';
      successMessage = 'Pantry';
    } else if (fieldName === 'reviewer_id' || fieldName === 'requestor_id') {
      listName = 'Add User';
      successMessage = 'User';
    }
    setModalHead(listName);
    setSuccessMsg(successMessage);
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
            : <td className="p-2"><span className="font-weight-400">{getDefaultNoValue(assetData[i].name)}</span></td>}
        </tr>,
      );
    }
    return tableTr;
  }

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
                {isAddTeam
                  && (fieldName === 'maintenance_team_id'
                    || fieldName === 'approval_authority_id' || fieldName === 'ehs_authority_id' || fieldName === 'security_office_id' || fieldName === 'reviewer_id' || fieldName === 'requestor_id') && (
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
        <Dialog size={(createTeamInfo && createTeamInfo.data) ? 'sm' : 'xl'} fullWidth open={addModal}>
          <DialogHeader title={modalHead} imagePath={false} onClose={() => { onModalClose(0); onTeamClose(); }} response={createTeamInfo} />
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              <AddTeam closeModal={() => { onModalClose(); onTeamClose(); }} isTheme directToView={false} selectedUser={false} editData={[]} />
            </DialogContentText>
          </DialogContent>
        </Dialog>
        /* <Modal size={(createTeamInfo && createTeamInfo.data) ? 'sm' : 'xl'} className="border-radius-50px modal-dialog-centered" isOpen={addModal}>
           <ModalHeaderComponent title={modalHead} imagePath={false} closeModalWindow={() => { onModalClose(); onTeamClose(); }} response={createTeamInfo} />
           <ModalBody className="pt-0 mt-0">
             <AddTeam closeModal={() => { onModalClose(); onTeamClose(); }} isTheme directToView={false} selectedUser={false} editData={[]} />
           </ModalBody>
         </Modal>*/
      )}
      {(fieldName === 'reviewer_id' || fieldName === 'requestor_id') && (
        <Dialog size={(createUserInfo && createUserInfo.data) ? 'sm' : 'xl'} fullWidth open={addModal}>
          <DialogHeader title={modalHead} imagePath={false} onClose={() => { onModalClose(0); onTeamClose(); }} response={createUserInfo} />
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              <AddTeam closeModal={() => { onModalClose(); onTeamClose(); }} isTheme directToView={false} selectedUser={false} editData={[]} successMsg={successMsg} />
            </DialogContentText>
          </DialogContent>
        </Dialog>
        /*<Modal size={(createUserInfo && createUserInfo.data) ? 'sm' : 'xl'} className="border-radius-50px modal-dialog-centered" isOpen={addModal}>
          <ModalHeaderComponent title={modalHead} imagePath={false} closeModalWindow={() => { onModalClose(); onTeamClose(); }} response={createUserInfo} />
          <ModalBody className="pt-0 mt-0">
            <AddTeam closeModal={() => { onModalClose(); onTeamClose(); }} isTheme directToView={false} selectedUser={false} editData={[]} successMsg={successMsg} />
          </ModalBody>
        </Modal>*/
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
