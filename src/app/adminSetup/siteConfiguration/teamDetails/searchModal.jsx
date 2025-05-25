/* eslint-disable radix */
/* eslint-disable import/no-unresolved */
/* eslint-disable camelcase */
/* eslint-disable react/jsx-props-no-spreading */
import React, { useState, useEffect } from 'react';
import {
  Table,
  Col,
  Row,
  Input,
  Card,
  CardBody,
} from 'reactstrap';
import {
  Checkbox, Drawer, Dialog, DialogContent, DialogContentText, DialogActions,
} from '@mui/material';
import * as PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from '@material-ui/core/IconButton';
import BackspaceIcon from '@material-ui/icons/Backspace';
import SearchIcon from '@material-ui/icons/Search';
import { makeStyles } from '@material-ui/core/styles';
import {
  FormControl,
} from '@material-ui/core';
import { Tooltip } from 'antd';
import Pagination from '@material-ui/lab/Pagination';
import plusCircleMiniIcon from '@images/icons/plusCircleBlue.svg';

import SuccessAndErrorFormat from '@shared/successAndErrorFormat';
import Loader from '@shared/loading';
import DrawerHeader from '../../../commonComponents/drawerHeader';

import {
  getExtraSelectionMultiple, getExtraSelectionMultipleCount,
} from '../../../helpdesk/ticketService';
import {
  storeSelectedMembers, resetCreateUser, resetUpdateUser, resetUsersCount,
} from '../../setupService';
import actionCodes from '../../data/actionCodes.json';
import AddUser from '../../companyConfiguration/addUser/addUser';
import DialogHeader from '../../../commonComponents/dialogHeader';
import { getDefaultNoValue, getPagesCountV2, getListOfModuleOperations } from '../../../util/appUtils';

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
    fields,
    company,
    otherFieldName,
    otherFieldValue,
    modalName,
  } = props;
  const limit = 50;
  const dispatch = useDispatch();
  const classes = useStyles();
  const [searchValue, setSearchValue] = useState('');
  const [offset, setOffset] = useState(0);
  const [page, setPage] = useState(1);
  const [checkedRows, setCheckRows] = useState([]);
  const [isAllChecked, setIsAllChecked] = useState(false);
  const [isSearch, setSearch] = useState(false);
  const [addTeamModal, showAddTeamModal] = useState(false);

  const {
    listDataMultipleInfo, listDataMultipleCountInfo, listDataMultipleCountLoading,
  } = useSelector((state) => state.ticket);

  const { userRoles } = useSelector((state) => state.user);

  useEffect(() => {
    if (modelName && fields) {
      let searchValueMultiple = `[["company_id","in",[${company}]]`;
      if (typeof otherFieldValue === 'string' && otherFieldValue !== 'true') {
        searchValueMultiple = `${searchValueMultiple},["${otherFieldName}","ilike","${otherFieldValue}"]`;
      } else if (typeof otherFieldValue === 'object' && otherFieldValue !== 'true' && otherFieldName !== 'not_in') {
        searchValueMultiple = `${searchValueMultiple},["${otherFieldName}","in",${JSON.stringify(otherFieldValue)}]`;
      } else if (typeof otherFieldValue === 'object' && otherFieldName === 'not_in') {
        //searchValueMultiple = `${searchValueMultiple},["id","not in",${JSON.stringify(otherFieldValue)}],["user_id", "!=", false]`;
        searchValueMultiple = `${searchValueMultiple},["id","not in",${JSON.stringify(otherFieldValue)}]`;
      } else {
        searchValueMultiple = `${searchValueMultiple},["${otherFieldName}","=",${otherFieldValue}]`;
      }

      if (searchValue) {
        searchValueMultiple = `${searchValueMultiple},"|",["name","ilike","${searchValue}"],["work_email", "ilike", "${searchValue}"]`;
      }
      searchValueMultiple = `${searchValueMultiple}]`;
      dispatch(getExtraSelectionMultiple(company, modelName, limit, offset, fields, searchValueMultiple));
    }
  }, [modelName, offset, isSearch]);

  const allowedOperations = getListOfModuleOperations(userRoles && userRoles.data ? userRoles.data.allowed_modules : [], 'Users', 'code');

  const isAddTeam = allowedOperations.includes(actionCodes['Add Team']);

  useEffect(() => {
    if (modelName) {
      let searchValueMultiple = `[["company_id","in",[${company}]]`;
      if (typeof otherFieldValue === 'string' && otherFieldValue !== 'true') {
        searchValueMultiple = `${searchValueMultiple},["${otherFieldName}","ilike","${otherFieldValue}"]`;
      } else if (typeof otherFieldValue === 'object' && otherFieldValue !== 'true' && otherFieldName !== 'not_in') {
        searchValueMultiple = `${searchValueMultiple},["${otherFieldName}","in",${JSON.stringify(otherFieldValue)}]`;
      } else if (typeof otherFieldValue === 'object' && otherFieldName === 'not_in') {
        //searchValueMultiple = `${searchValueMultiple},["id","not in",${JSON.stringify(otherFieldValue)}],["user_id", "!=", false]`;
        searchValueMultiple = `${searchValueMultiple},["id","not in",${JSON.stringify(otherFieldValue)}]`;
      } else {
        searchValueMultiple = `${searchValueMultiple},["${otherFieldName}","=",${otherFieldValue}]`;
      }

      if (searchValue) {
        searchValueMultiple = `${searchValueMultiple},"|",["name","ilike","${searchValue}"],["work_email", "ilike", "${searchValue}"]`;
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
    setIsAllChecked(false);
  };

  const onSearchChange = (e) => {
    setSearchValue(e.target.value);
    if (e.target.value.length < 2 && e.key === 'Backspace') {
      setSearchValue('');
      setSearch(Math.random());
    }
    if (e.key === 'Enter') {
      setSearch(Math.random());
      setPage(1);
      setOffset(0);
    }
  };

  useEffect(() => {
    if (checkedRows) {
      dispatch(storeSelectedMembers(checkedRows));
    }
  }, [checkedRows]);

  const handleTableCellChange = (event) => {
    const { checked, value } = event.target;
    const values = JSON.parse(value);
    if (checked) {
      setCheckRows((state) => [...state, values]);
      if ((checkedRows && checkedRows.length + 1 === 50) || (checkedRows && checkedRows.length + 1 === totalDataCount)) {
        setIsAllChecked(true);
      }
    } else {
      setCheckRows(checkedRows.filter((item) => item.id !== values.id));
      setIsAllChecked(false);
    }
  };

  const handleTableCellAllChange = (event) => {
    const { checked } = event.target;
    if (checked) {
      const data = listDataMultipleInfo && listDataMultipleInfo.data ? listDataMultipleInfo.data : [];
      const newArr = [...data, ...checkedRows];
      setCheckRows([...new Map(newArr.map((item) => [item.id, item])).values()]);
      setIsAllChecked(true);
    } else {
      setCheckRows([]);
      setIsAllChecked(false);
    }
  };

  function getRow(assetData) {
    const tableTr = [];
    for (let i = 0; i < assetData.length; i += 1) {
      tableTr.push(
        <tr key={i}>
          <td className="w-5">
            <Checkbox
              sx={{
                transform: 'scale(0.9)',
                padding: '0px',
              }}
              value={JSON.stringify(assetData[i])}
              id={`checkboxtk${assetData[i].id}`}
              className="ml-0"
              name={assetData[i].name}
              checked={checkedRows && checkedRows.length && checkedRows.some((selectedValue) => parseInt(selectedValue.id) === parseInt(assetData[i].id))}
              onChange={handleTableCellChange}
            />
          </td>
          <td className="p-2"><span className="font-weight-400">{getDefaultNoValue(assetData[i].name)}</span></td>
          <td className="p-2"><span className="font-weight-400">{getDefaultNoValue(assetData[i].work_email)}</span></td>
        </tr>,
      );
    }
    return tableTr;
  }

  const onAddReset = () => {
    if (document.getElementById('locationForm')) {
      document.getElementById('locationForm').reset();
    }
    let searchValueMultiple = `[["company_id","in",[${company}]]`;
    if (typeof otherFieldValue === 'string' && otherFieldValue !== 'true') {
      searchValueMultiple = `${searchValueMultiple},["${otherFieldName}","ilike","${otherFieldValue}"]`;
    } else if (typeof otherFieldValue === 'object' && otherFieldValue !== 'true' && otherFieldName !== 'not_in') {
      searchValueMultiple = `${searchValueMultiple},["${otherFieldName}","in",${JSON.stringify(otherFieldValue)}]`;
    } else if (typeof otherFieldValue === 'object' && otherFieldName === 'not_in') {
      searchValueMultiple = `${searchValueMultiple},["id","not in",${JSON.stringify(otherFieldValue)}]`;
    } else {
      searchValueMultiple = `${searchValueMultiple},["${otherFieldName}","=",${otherFieldValue}]`;
    }

    if (searchValue) {
      searchValueMultiple = `${searchValueMultiple},"|",["name","ilike","${searchValue}"],["work_email", "ilike", "${searchValue}"]`;
    }
    searchValueMultiple = `${searchValueMultiple}]`;
    dispatch(getExtraSelectionMultiple(company, modelName, limit, offset, fields, searchValueMultiple));
    dispatch(getExtraSelectionMultipleCount(company, modelName, fields, searchValueMultiple));
    dispatch(resetCreateUser());
    showAddTeamModal(false);
  };

  const onReset = () => {
    if (document.getElementById('locationForm')) {
      document.getElementById('locationForm').reset();
    }
    let searchValueMultiple = `[["company_id","in",[${company}]]`;
    if (typeof otherFieldValue === 'string' && otherFieldValue !== 'true') {
      searchValueMultiple = `${searchValueMultiple},["${otherFieldName}","ilike","${otherFieldValue}"]`;
    } else if (typeof otherFieldValue === 'object' && otherFieldValue !== 'true' && otherFieldName !== 'not_in') {
      searchValueMultiple = `${searchValueMultiple},["${otherFieldName}","in",${JSON.stringify(otherFieldValue)}]`;
    } else if (typeof otherFieldValue === 'object' && otherFieldName === 'not_in') {
      searchValueMultiple = `${searchValueMultiple},["id","not in",${JSON.stringify(otherFieldValue)}]`;
    } else {
      searchValueMultiple = `${searchValueMultiple},["${otherFieldName}","=",${otherFieldValue}]`;
    }

    if (searchValue) {
      searchValueMultiple = `${searchValueMultiple},"|",["name","ilike","${searchValue}"],["work_email", "ilike", "${searchValue}"]`;
    }
    searchValueMultiple = `${searchValueMultiple}]`;
    dispatch(getExtraSelectionMultiple(company, modelName, limit, offset, fields, searchValueMultiple));
    dispatch(getExtraSelectionMultipleCount(company, modelName, fields, searchValueMultiple));
    dispatch(resetCreateUser());
    dispatch(resetUsersCount());
  };

  const onResetEdit = () => {
    if (document.getElementById('locationForm')) {
      document.getElementById('locationForm').reset();
    }
    let searchValueMultiple = `[["company_id","in",[${company}]]`;
    if (typeof otherFieldValue === 'string' && otherFieldValue !== 'true') {
      searchValueMultiple = `${searchValueMultiple},["${otherFieldName}","ilike","${otherFieldValue}"]`;
    } else if (typeof otherFieldValue === 'object' && otherFieldValue !== 'true' && otherFieldName !== 'not_in') {
      searchValueMultiple = `${searchValueMultiple},["${otherFieldName}","in",${JSON.stringify(otherFieldValue)}]`;
    } else if (typeof otherFieldValue === 'object' && otherFieldName === 'not_in') {
      searchValueMultiple = `${searchValueMultiple},["id","not in",${JSON.stringify(otherFieldValue)}]`;
    } else {
      searchValueMultiple = `${searchValueMultiple},["${otherFieldName}","=",${otherFieldValue}]`;
    }

    if (searchValue) {
      searchValueMultiple = `${searchValueMultiple},"|",["name","ilike","${searchValue}"],["work_email", "ilike", "${searchValue}"]`;
    }
    searchValueMultiple = `${searchValueMultiple}]`;
    dispatch(getExtraSelectionMultiple(company, modelName, limit, offset, fields, searchValueMultiple));
    dispatch(getExtraSelectionMultipleCount(company, modelName, fields, searchValueMultiple));
    dispatch(resetUpdateUser());
    dispatch(resetUsersCount());
  };

  const directModal = () => {
    showAddTeamModal(false);
    dispatch(resetCreateUser());
    dispatch(resetUsersCount());
  };

  const closeModal = () => {
    if (document.getElementById('locationForm')) {
      document.getElementById('locationForm').reset();
    }
    dispatch(resetCreateUser());
    showAddTeamModal(false);
  };

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
                    {totalDataCount}
                  </span>
                </div>
              </Col>
              <Col sm="12" md="3" lg="3" xs="12" className="text-right">
                {isAddTeam && (
                <Tooltip title="Add" placement="top">
                  <img
                    aria-hidden="true"
                    id="Add"
                    alt="Add"
                    className="cursor-pointer mr-3 mt-2"
                    onClick={() => showAddTeamModal(true)}
                    src={plusCircleMiniIcon}
                  />
                </Tooltip>
                )}
                <FormControl variant="standard">
                  <Input
                    id="standard-adornment-password"
                    type="text"
                    name="search"
                    placeholder={`Search ${modalName}`}
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
                    <th className="w-5">
                      <Checkbox
                        sx={{
                          transform: 'scale(0.9)',
                          padding: '0px',
                        }}
                        value="all"
                        name="checkall"
                        id="checkboxtkhead1"
                        checked={isAllChecked}
                        onChange={handleTableCellAllChange}
                      />
                    </th>
                    <th className="p-2 min-width-100">
                      Name
                    </th>
                    <th className="p-2 min-width-100">
                      Email
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
        <Dialog size="lg" fullWidth open={addTeamModal}>
          <DialogHeader title={modalName} imagePath={false} onClose={() => {  onAddReset();  showAddTeamModal(false); }} />
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              <AddUser
                afterReset={() => { showAddTeamModal(false); onReset(); onResetEdit(); }}
                closeEditModal={() => { showAddTeamModal(false); }}
                directToView={directModal}
                closeModal={closeModal}
                isModal
              />
            </DialogContentText>
          </DialogContent>
        </Dialog>
      </Col>
    </Row>
  );
};

SearchModal.propTypes = {
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
  otherFieldName: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.string,
  ]).isRequired,
  modalName: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.string,
  ]).isRequired,
  otherFieldValue: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.string,
    PropTypes.array,
    PropTypes.number,
  ]).isRequired,
};

export default SearchModal;
