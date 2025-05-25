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
import Button from '@mui/material/Button';
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
import ModalFormAlert from '@shared/modalFormAlert';

import {
  getExtraSelectionMultiple, getExtraSelectionMultipleCount,
} from '../../helpdesk/ticketService';
import {
  getDefaultNoValue, getPagesCountV2, extractTextObject, getListOfModuleOperations,
} from '../../util/appUtils';
import { resetCreateConfigPantry } from '../pantryService';
import AddPantry from '../configuration/addPantry';
import actionCodes from '../configuration/data/actionCodes.json';

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

  const [addModal, setAddModal] = useState(false);
  const [modalHead, setModalHead] = useState('');

  const {
    listDataMultipleInfo, listDataMultipleCountInfo, listDataMultipleCountLoading,
  } = useSelector((state) => state.ticket);

  const { addConfigPantryInfo } = useSelector((state) => state.pantry);

  const { userRoles } = useSelector((state) => state.user);

  const allowedOperations = getListOfModuleOperations(userRoles && userRoles.data ? userRoles.data.allowed_modules : [], 'Pantry Management', 'code');

  const isCreatable = allowedOperations.includes(actionCodes['Add Pantry']);

  useEffect(() => {
    if (modelName && fields) {
      let searchValueMultiple = `[["company_id","in",[${company}]]`;

      if (fieldName === 'employee_id') {
        searchValueMultiple = `${searchValueMultiple},["name","!=",false], ["work_email","!=",false], ["employee_id_seq","!=",false], ["employee_id_seq","!=",""], ["active","=",true]`;
        if (searchValue) {
          searchValueMultiple = `${searchValueMultiple},"|","|",["name","ilike","${searchValue}"],["work_phone","ilike","${searchValue}"],["work_email","ilike","${searchValue}"]`;
        }
      }

      if (searchValue && fieldName === 'space_id') {
        searchValueMultiple = `${searchValueMultiple},"|","|",["name","ilike","${searchValue}"],["path_name","ilike","${searchValue}"],["asset_category_id.name","ilike","${searchValue}"]`;
      }

      if (searchValue && fieldName === 'pantry_id') {
        searchValueMultiple = `${searchValueMultiple},"|","|",["name","ilike","${searchValue}"],["pantry_sequence","ilike","${searchValue}"],["maintenance_team_id.name","ilike","${searchValue}"]`;
      }

      searchValueMultiple = `${searchValueMultiple}]`;
      dispatch(getExtraSelectionMultiple(company, modelName, limit, offset, fields, searchValueMultiple));
    }
  }, [modelName, offset, isSearch]);

  useEffect(() => {
    if (modelName) {
      let searchValueMultiple = `[["company_id","in",[${company}]]`;

      if (fieldName === 'employee_id') {
        searchValueMultiple = `${searchValueMultiple},["name","!=",false], ["work_email","!=",false], ["employee_id_seq","!=",false], ["employee_id_seq","!=",""], ["active","=",true]`;
        if (searchValue) {
          searchValueMultiple = `${searchValueMultiple},"|","|",["name","ilike","${searchValue}"],["work_phone","ilike","${searchValue}"],["work_email","ilike","${searchValue}"]`;
        }
      }

      if (searchValue && fieldName === 'space_id') {
        searchValueMultiple = `${searchValueMultiple},"|","|",["name","ilike","${searchValue}"],["path_name","ilike","${searchValue}"],["asset_category_id.name","ilike","${searchValue}"]`;
      }

      if (searchValue && fieldName === 'pantry_id') {
        searchValueMultiple = `${searchValueMultiple},"|","|",["name","ilike","${searchValue}"],["pantry_sequence","ilike","${searchValue}"],["maintenance_team_id.name","ilike","${searchValue}"]`;
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
    setFieldValue(fieldName, data);
    if (afterReset) afterReset();
  };

  const onModalOpen = () => {
    setAddModal(true);
    let listName = 'list';
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

  const onPantryClose = () => {
    dispatch(resetCreateConfigPantry());
  };

  function getRow(assetData) {
    const tableTr = [];
    for (let i = 0; i < assetData.length; i += 1) {
      tableTr.push(
        <tr className={selectedId === assetData[i].id ? 'text-info cursor-pointer' : 'cursor-pointer'} onClick={() => handleRowClick(assetData[i])} key={i}>
          {fieldName === 'employee_id' && (
            <>
              <td className="p-2"><span className="font-weight-400">{getDefaultNoValue(assetData[i].name)}</span></td>
              <td className="p-2"><span className="font-weight-400">{getDefaultNoValue(assetData[i].work_phone)}</span></td>
              <td className="p-2"><span className="font-weight-400">{getDefaultNoValue(assetData[i].work_email)}</span></td>
            </>
          )}
          {fieldName === 'space_id' && (
            <>
              <td className="p-2"><span className="font-weight-400">{assetData[i].name ? getDefaultNoValue(assetData[i].name) : getDefaultNoValue(assetData[i].space_name)}</span></td>
              <td className="p-2"><span className="font-weight-400">{getDefaultNoValue(assetData[i].path_name)}</span></td>
              <td className="p-2"><span className="font-weight-400">{getDefaultNoValue(extractTextObject(assetData[i].asset_category_id))}</span></td>
            </>
          )}
          {fieldName === 'pantry_id' && (
            <>
              <td className="p-2"><span className="font-weight-400">{getDefaultNoValue(assetData[i].name)}</span></td>
              <td className="p-2"><span className="font-weight-400">{getDefaultNoValue(assetData[i].pantry_sequence)}</span></td>
              <td className="p-2"><span className="font-weight-400">{getDefaultNoValue(extractTextObject(assetData[i].maintenance_team_id))}</span></td>
            </>
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
                    {!loading && (listDataMultipleInfo && listDataMultipleInfo.data) && (totalDataCount)}
                  </span>
                </div>
              </Col>
              <Col sm="12" md="5" lg="5" xs="12" className="text-right">
                {isCreatable && (fieldName !== 'employee_id' && fieldName !== 'space_id') && (
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
                      <th className="p-2 min-width-100">
                        Name
                      </th>
                      {fieldName === 'employee_id' && (
                        <>
                          <th className="p-2 min-width-100">
                            Phone
                          </th>
                          <th className="p-2 min-width-100">
                            Email
                          </th>
                        </>
                      )}
                      {fieldName === 'space_id' && (
                        <>
                          <th className="p-2 min-width-160">
                            Full Path
                          </th>
                          <th className="p-2 min-width-100">
                            Category
                          </th>
                        </>
                      )}
                      {fieldName === 'pantry_id' && (
                        <>
                          <th className="p-2 min-width-100">
                            Sequence
                          </th>
                          <th className="p-2 min-width-160">
                            Maintenance Team
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
            {loading && (
              <Loader />
            )}
            {(listDataMultipleInfo && listDataMultipleInfo.err) && (
              <SuccessAndErrorFormat response={listDataMultipleInfo} />
            )}
          </CardBody>
        </Card>
      </Col>
      {(fieldName === 'pantry_id') && (
        <Modal size={(addConfigPantryInfo && addConfigPantryInfo.data) ? 'sm' : 'xl'} className="border-radius-50px modal-dialog-centered searchData-modalwindow" isOpen={addModal}>
          <ModalHeaderComponent title={modalHead} imagePath={false} closeModalWindow={() => { onModalClose(); onPantryClose(); }} response={addConfigPantryInfo} />
          <ModalBody className="pt-0 mt-0">
            <AddPantry editId={false} isTheme isModal />
            <ModalFormAlert alertResponse={addConfigPantryInfo} alertText="Pantry added successfully.." />
            {addConfigPantryInfo && addConfigPantryInfo.data && (<hr />)}
            <div className="float-right">
              {addConfigPantryInfo && addConfigPantryInfo.data && (
                <Button
                  size="sm"
                  type="button"
                   variant="contained"
                  onClick={() => { onModalClose(); onPantryClose(); }}
                  disabled={addConfigPantryInfo && addConfigPantryInfo.loading}
                >
                  OK
                </Button>
              )}
            </div>
          </ModalBody>
        </Modal>
      )}
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
  fieldName: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.string,
  ]).isRequired,
  afterReset: PropTypes.func.isRequired,
  placeholderName: PropTypes.string.isRequired,
  setFieldValue: PropTypes.func.isRequired,
};

export default SearchModal;
