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
  Input,
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
  Box, Dialog, DialogContent, DialogContentText,
} from '@mui/material';
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

import DialogHeader from '../../commonComponents/dialogHeader';

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
  } = props;
  const limit = 50;
  const dispatch = useDispatch();
  const classes = useStyles();
  const [searchValue, setSearchValue] = useState('');
  const [offset, setOffset] = useState(0);
  const [page, setPage] = useState(1);
  const [isSearch, setSearch] = useState(false);
  const [selectedId, setSelected] = useState('');
  const [fullWidth, setFullWidth] = useState(true);
  const [maxWidth, setMaxWidth] = useState('lg');
  const [addModal, setAddModal] = useState(false);
  const [modalHead, setModalHead] = useState('');

  const {
    listDataMultipleInfo, listDataMultipleCountInfo, listDataMultipleCountLoading,
  } = useSelector((state) => state.ticket);

  const { userRoles } = useSelector((state) => state.user);

  const {
    createTeamInfo,
  } = useSelector((state) => state.setup);

  const allowedOperations = getListOfModuleOperations(userRoles && userRoles.data ? userRoles.data.allowed_modules : [], 'Admin Setup', 'code');

  useEffect(() => {
    if (modelName && fields) {
      let searchValueMultiple = '[';

      if (fieldName !== 'category_id' && fieldName !== 'commodity_id'  && fieldName !== 'equipment_cost_ids') {
        searchValueMultiple = `${searchValueMultiple}["company_id","in",[${company}]]`;
      }

      if (searchValue) {
        if (fieldName !== 'category_id' && fieldName !== 'commodity_id' && fieldName !== 'equipment_cost_ids') {
          searchValueMultiple = `${searchValueMultiple},["name","ilike","${searchValue}"]`;
        } else {
          searchValueMultiple = `${searchValueMultiple}["name","ilike","${searchValue}"]`;
        }
      }

      searchValueMultiple = `${searchValueMultiple}]`;
      dispatch(getExtraSelectionMultiple(company, modelName, limit, offset, fields, searchValueMultiple));
    }
  }, [modelName, offset, isSearch]);

  useEffect(() => {
    if (modelName) {
      let searchValueMultiple = '[';

      if (fieldName !== 'category_id' && fieldName !== 'commodity_id' && fieldName !== 'equipment_cost_ids') {
        searchValueMultiple = `${searchValueMultiple}["company_id","in",[${company}]]`;
      }

      if (searchValue) {
        if (fieldName !== 'category_id' && fieldName !== 'commodity_id' && fieldName !== 'equipment_cost_ids') {
          searchValueMultiple = `${searchValueMultiple},["name","ilike","${searchValue}"]`;
        } else {
          searchValueMultiple = `${searchValueMultiple}["name","ilike","${searchValue}"]`;
        }
      }

      searchValueMultiple = `${searchValueMultiple}]`;
      dispatch(getExtraSelectionMultipleCount(company, modelName, fields, searchValueMultiple));
    }
  }, [modelName, isSearch]);

  const totalDataCount = listDataMultipleCountInfo && listDataMultipleCountInfo.length ? listDataMultipleCountInfo.length : '';

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
    setFieldValue(fieldName, data);
    if (afterReset) afterReset();
  };

  const onModalOpen = () => {
    setAddModal(true);
    let listName = 'Add Team';
    if (fieldName === 'space_id') {
      listName = 'Add Space';
    } else if (fieldName === 'pantry_id') {
      listName = 'Add Pantry';
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

  function getRow(assetData) {
    const tableTr = [];
    for (let i = 0; i < assetData.length; i += 1) {
      tableTr.push(
        <tr className={selectedId === assetData[i].id ? 'text-info cursor-pointer' : 'cursor-pointer'} onClick={() => handleRowClick(assetData[i])} key={i}>
          {(fieldName === 'category_id')
            ? <td className="p-2"><span className="font-weight-400">{getDefaultNoValue(assetData[i].path_name)}</span></td>
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
                <div className="mt-3 display-flex ">
                  <span className="p-0 font-weight-600 font-medium mr-2">
                    Total :
                    {' '}
                    {!listDataMultipleCountLoading && totalDataCount}
                  </span>
                </div>
              </Col>
              <Col sm="12" md="5" lg="5" xs="12" className="text-right">
                {isAddTeam && (fieldName === 'maintenance_team_id' || fieldName === 'monitored_by_id' || fieldName === 'managed_by_id' || fieldName === 'maintained_by_id') && (
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
              </Col>
            </Row>
            <Table responsive className="mb-0">
              <thead className="bg-gray-light">
                <tr>
                  <th className="p-2 min-width-160">
                    Name
                  </th>
                </tr>
              </thead>
            </Table>
            <div className="pl-1 pr-1 pt-0 comments-list thin-scrollbar">
              {(!listDataMultipleCountLoading && listDataMultipleInfo && listDataMultipleInfo.data) && (
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
            {(listDataMultipleInfo && listDataMultipleInfo.loading) || (listDataMultipleCountLoading) && (
              <Loader />
            )}
            {(listDataMultipleInfo && listDataMultipleInfo.err) && (
              <SuccessAndErrorFormat response={listDataMultipleInfo} />
            )}
          </CardBody>
        </Card>
      </Col>
      {(fieldName === 'maintenance_team_id' || fieldName === 'monitored_by_id' || fieldName === 'managed_by_id' || fieldName === 'maintained_by_id') && (

        <>
          {/*  <Modal zIndex="1500" size={(createTeamInfo && createTeamInfo.data) ? 'sm' : 'xl'} className="border-radius-50px modal-dialog-centered" isOpen={addModal}>
        <ModalHeaderComponent title={modalHead} imagePath={false} closeModalWindow={() => { onModalClose(); onTeamClose(); }} response={createTeamInfo} />
        <ModalBody className="pt-0 mt-0">
          <AddTeam closeModal={() => { onModalClose(); onTeamClose(); }} isTheme directToView={false} selectedUser={false} />
        </ModalBody>
      </Modal>
 */}
          <Dialog maxWidth={maxWidth} open={addModal} fullWidth={fullWidth}>
            <DialogHeader title="Add Team" onClose={() => { onModalClose(); onTeamClose(); }} response={createTeamInfo} imagePath={false} />
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

                  <AddTeam closeModal={() => { onModalClose(); onTeamClose(); }} isTheme directToView={false} selectedUser={false} />

                </Box>
              </DialogContentText>
            </DialogContent>
            {/*   <DialogActions>
      {deleteAttatchmentInfo && !deleteAttatchmentInfo.data && (
              <Button color="primary" disabled={deleteAttatchmentInfo.loading} onClick={() => removeFile(selectedDocId)}>Remove</Button>
          )}
          {deleteAttatchmentInfo && deleteAttatchmentInfo.data && (
              <Button color="primary" onClick={() => toggleDelete()}>Ok</Button>
          )}
      </DialogActions> */}
          </Dialog>
        </>
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
};

export default AdvancedSearchModal;
