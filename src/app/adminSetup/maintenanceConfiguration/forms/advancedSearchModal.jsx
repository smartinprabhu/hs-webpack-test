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

import plusCircleMiniIcon from '@images/icons/plusCircleBlue.svg';

import SuccessAndErrorFormat from '@shared/successAndErrorFormat';
import Loader from '@shared/loading';
import ModalHeaderComponent from '@shared/modalHeaderComponent';

import {
  getExtraSelection, getExtraSelectionCount,
} from '../../../helpdesk/ticketService';
import {
  getDefaultNoValue, getPagesCountV2,
  getListOfModuleOperations,
} from '../../../util/appUtils';
import { resetCreateTeam } from '../../setupService';
import AddTeam from '../../siteConfiguration/addTeam';
import actionCodes from '../../data/actionCodes.json';

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
    afterReset,
    fieldName,
    fields,
    company,
    otherFieldName,
    otherFieldValue,
    setFieldValue,
    modalName,
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
    listDataInfo, listDataCountInfo, listDataCountLoading,
  } = useSelector((state) => state.ticket);
  const {
    createTeamInfo,
  } = useSelector((state) => state.setup);

  const { userRoles } = useSelector((state) => state.user);

  const allowedOperations = getListOfModuleOperations(userRoles && userRoles.data ? userRoles.data.allowed_modules : [], 'Admin Setup', 'code');

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

  const onModalOpen = () => {
    setAddModal(true);
    const listName = 'Add Team';
    setModalHead(listName);
  };

  const onModalClose = () => {
    setAddModal(false);
    setSearch(Math.random());
  };

  const onTeamClose = () => {
    dispatch(resetCreateTeam());
  };

  const handleRowClick = (data) => {
    setSelected(data.id);
    const items = { id: data.id, name: data.name };
    setFieldValue(fieldName, items);
    if (afterReset) afterReset();
  };

  function getRow(assetData) {
    const tableTr = [];
    for (let i = 0; i < assetData.length; i += 1) {
      tableTr.push(
        <tr className={selectedId === assetData[i].id ? 'text-info cursor-pointer' : 'cursor-pointer'} onClick={() => handleRowClick(assetData[i])} key={i}>
          <td className="p-2"><span className="font-weight-400">{getDefaultNoValue(assetData[i].name)}</span></td>
        </tr>,
      );
    }
    return tableTr;
  }

  const loading = (listDataInfo && listDataInfo.loading) || (listDataCountLoading);
  const totalDataCount = listDataCountInfo && listDataCountInfo.length ? listDataCountInfo.length : 0;

  const isAddTeam = allowedOperations.includes(actionCodes['Add Team']);

  const pages = getPagesCountV2(totalDataCount, limit);

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
                {isAddTeam && (fieldName === 'maintenance_team_id') && (
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
              {(listDataInfo && listDataInfo.data) && (
              <Table responsive>
                <thead className="bg-gray-light">
                  <tr>
                    <th className="p-2 min-width-100">
                      Name
                    </th>
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
      </Col>
      {(fieldName === 'maintenance_team_id') && (
      <Modal size={(createTeamInfo && createTeamInfo.data) ? 'sm' : 'xl'} className="border-radius-50px modal-dialog-centered" isOpen={addModal}>
        <ModalHeaderComponent title={modalHead} imagePath={false} closeModalWindow={() => { onModalClose(); onTeamClose(); }} response={createTeamInfo} />
        <ModalBody className="pt-0 mt-0">
          <AddTeam closeModal={() => { onModalClose(); onTeamClose(); }} isTheme directToView={false} selectedUser={false} editData={[]} />
        </ModalBody>
      </Modal>
      )}
    </Row>
  );
};

AdvancedSearchModal.propTypes = {
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
  modalName: PropTypes.oneOfType([
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
  setFieldValue: PropTypes.oneOfType([PropTypes.func, PropTypes.string]).isRequired,
};

export default AdvancedSearchModal;
