/* eslint-disable max-len */
/* eslint-disable react/forbid-prop-types */
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
import Drawer from '@mui/material/Drawer';
import Edit from '@mui/icons-material/Edit';
import Add from '@mui/icons-material/Add';
import {
  Input,
} from '@material-ui/core';
import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from '@material-ui/core/IconButton';
import BackspaceIcon from '@material-ui/icons/Backspace';
import SearchIcon from '@material-ui/icons/Search';

import * as PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import Pagination from '@material-ui/lab/Pagination';

import SuccessAndErrorFormat from '@shared/successAndErrorFormat';
import Loader from '@shared/loading';

import {
  Button, Checkbox, ButtonGroup, Tooltip,
} from '@mui/material';
import { infoValue } from '../../utils/utils';
import DrawerHeader from '../../../commonComponents/drawerHeader';
import ScheduleForm from './maintenanceSteps';
import {
  getExtraSelectionMultiple, getExtraSelectionMultipleCount,
} from '../../../helpdesk/ticketService';
import { getDefaultNoValue, getPagesCountV2, extractTextObject } from '../../../util/appUtils';

const useStyles = makeStyles((theme) => ({
  root: {
    '& > *': {
      marginTop: theme.spacing(2),
    },
  },
}));

const SearchModalSingle = (props) => {
  const {
    modelName,
    fields,
    company,
    fieldName,
    afterReset,
    modalName,
    setFieldValue,
    oldValues,
    headers,
    noBuildings,
    otherFieldValue,
    otherFieldName,
    onNext,
    setMaintenanceType,
  } = props;
  const limit = 10;
  const dispatch = useDispatch();
  const classes = useStyles();
  const [searchValue, setSearchValue] = useState('');
  const [offset, setOffset] = useState(0);
  const [page, setPage] = useState(1);
  const [isSearch, setSearch] = useState(false);
  const [formModal, showFormModal] = useState(false);

  const [checkedRows, setCheckRows] = useState([]);
  const [isAllChecked, setIsAllChecked] = useState(false);

  const {
    listDataMultipleInfo, listDataMultipleCountInfo, listDataMultipleCountLoading,
  } = useSelector((state) => state.ticket);

  useEffect(() => {
    setCheckRows(oldValues);
  }, []);

  useEffect(() => {
    if (otherFieldValue) {
      setCheckRows([]);
    }
  }, [otherFieldValue]);

  useEffect(() => {
    if (checkedRows) {
      setFieldValue(checkedRows);
    }
  }, [checkedRows]);

  useEffect(() => {
    if (modelName && fields) {
      let searchValueMultiple = '[';
      searchValueMultiple = `[["company_id","in",[${company}]]`;
      if (fieldName === 'asset_ids') {
        if (searchValue) {
          searchValueMultiple = `${searchValueMultiple},["category_id","=",${otherFieldValue}],"|","|","|","|","|",["name","ilike","${searchValue}"],["model","ilike","${searchValue}"],["serial","ilike","${searchValue}"],["location_id.path_name","ilike","${searchValue}"],["block_id.name","ilike","${searchValue}"],["category_id.name","ilike","${searchValue}"]`;
        } else {
          searchValueMultiple = `${searchValueMultiple},["category_id","=",${otherFieldValue}]`;
        }
      }
      if (fieldName === 'location_ids') {
        if (searchValue) {
          searchValueMultiple = `${searchValueMultiple},["asset_category_id","=",${otherFieldValue}],"|","|",["space_name","ilike","${searchValue}"],["path_name","ilike","${searchValue}"],["asset_category_id.name","ilike","${searchValue}"]`;
        } else {
          searchValueMultiple = `${searchValueMultiple},["asset_category_id","=",${otherFieldValue}]`;
        }
      }
      searchValueMultiple = `${searchValueMultiple}]`;
      dispatch(getExtraSelectionMultiple(company, modelName, limit, offset, fields, searchValueMultiple));
    }
  }, [modelName, offset, isSearch, otherFieldValue]);

  useEffect(() => {
    if (modelName) {
      let searchValueMultiple = '[';
      searchValueMultiple = `[["company_id","in",[${company}]]`;
      if (fieldName === 'asset_ids') {
        if (searchValue) {
          searchValueMultiple = `${searchValueMultiple},["category_id","=",${otherFieldValue}],"|","|","|","|","|",["name","ilike","${searchValue}"],["model","ilike","${searchValue}"],["serial","ilike","${searchValue}"],["location_id.path_name","ilike","${searchValue}"],["block_id.name","ilike","${searchValue}"],["category_id.name","ilike","${searchValue}"]`;
        } else {
          searchValueMultiple = `${searchValueMultiple},["category_id","=",${otherFieldValue}]`;
        }
      }
      if (fieldName === 'location_ids') {
        if (searchValue) {
          searchValueMultiple = `${searchValueMultiple},["asset_category_id","=",${otherFieldValue}],"|","|",["space_name","ilike","${searchValue}"],["path_name","ilike","${searchValue}"],["asset_category_id.name","ilike","${searchValue}"]`;
        } else {
          searchValueMultiple = `${searchValueMultiple},["asset_category_id","=",${otherFieldValue}]`;
        }
      }
      searchValueMultiple = `${searchValueMultiple}]`;
      dispatch(getExtraSelectionMultipleCount(company, modelName, fields, searchValueMultiple));
    }
  }, [modelName, isSearch, otherFieldValue]);

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
    if (e.key === 'Enter') {
      setSearch(Math.random());
      setPage(1);
      setOffset(0);
    }
  };

  const onClear = () => {
    setSearchValue('');
    setSearch(Math.random());
    setPage(1);
    setOffset(0);
  };

  const onSearch = () => {
    setSearch(Math.random());
    setPage(1);
    setOffset(0);
  };

  const handleAdd = () => {
    if (checkedRows) {
      setFieldValue(checkedRows);
    }
    if (afterReset) afterReset();
  };

  const onReset = () => {
    showFormModal(false);
  };

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

  const handleRowClick = (data) => {
    setCheckRows([data]);
    setFieldValue([data]);
    onNext();
  };

  function getRow(assetData) {
    const tableTr = [];
    for (let i = 0; i < assetData.length; i += 1) {
      tableTr.push(
        <tr key={i}>
          <td className="w-5 p-2">
            <Checkbox
              sx={{
                transform: 'scale(0.9)',
                padding: '0px',
              }}
              value={JSON.stringify(assetData[i])}
              id={`checkboxtk${assetData[i].id}`}
              className="ml-0"
              name={fieldName !== 'space' ? assetData[i].name : assetData[i].space_name}
              checked={checkedRows.some((selectedValue) => parseInt(selectedValue.id) === parseInt(assetData[i].id))}
              onChange={handleTableCellChange}
            />
          </td>
          {fieldName === 'asset_ids' && (
            <>
              <td className="p-2"><span className="font-weight-400">{getDefaultNoValue(assetData[i].name)}</span></td>
              <td className="p-2"><span className="font-weight-400">{getDefaultNoValue(extractTextObject(assetData[i].location_id))}</span></td>
            </>
          )}
          {fieldName === 'location_ids' && (
            <>
              <td className="p-2"><span className="font-weight-400">{getDefaultNoValue(assetData[i].space_name)}</span></td>
              <td className="p-2"><span className="font-weight-400">{getDefaultNoValue(assetData[i].path_name)}</span></td>
            </>
          )}
          <td className="p-2">
            <ButtonGroup size="small" aria-label="outlined primary button group">
              <Button>0</Button>
              <Tooltip title="Edit Inspection">
                <Button>
                  <Edit style={{ fontSize: '14px' }} />
                </Button>
              </Tooltip>
              <Tooltip title="Add Inspection">
                <Button onClick={() => { setMaintenanceType({ id: 'Inspection', name: 'Daily Inspection', subName: 'These are daily Preventive Maintenance activities' });  handleRowClick(assetData[i]); showFormModal(true); }}>
                  {' '}
                  <Add style={{ fontSize: '15px' }} />
                </Button>
              </Tooltip>
            </ButtonGroup>
          </td>
          <td className="p-2">
            <ButtonGroup size="small" aria-label="outlined primary button group">
              <Button>0</Button>
              <Tooltip title="Edit PPM">
                <Button>
                  <Edit style={{ fontSize: '14px' }} />
                </Button>
              </Tooltip>
              <Tooltip title="Add PPM">
                <Button onClick={() => { setMaintenanceType({ id: 'PPM', name: '52 Week PPM', subName: 'These are planned PPMs with a week long duration' }); handleRowClick(assetData[i]);  showFormModal(true); }}>
                  {' '}
                  <Add style={{ fontSize: '15px' }} />
                </Button>
              </Tooltip>
            </ButtonGroup>
          </td>
        </tr>,
      );
    }
    return tableTr;
  }

  const loading = (listDataMultipleInfo && listDataMultipleInfo.loading) || (listDataMultipleCountLoading);

  return (
    <>
      <Row>
        <Col sm="12" md="12" lg="12" xs="12">
          <Card className="p-0 bg-lightblue h-100 border-0">
            <CardBody className="bg-color-white p-0 m-0">
              <Row className="pl-2 pr-2 pb-2 pt-0">
                <Col sm="12" md="7" lg="7" xs="12">
                  <div className="display-flex mt-2">
                    <span className="p-0 font-weight-600 font-medium mr-2">
                      {otherFieldName}
                      {' '}
                      List
                      {' ('}
                      {totalDataCount}
                      {') '}
                    </span>
                  </div>
                </Col>
                <Col sm="12" md="5" lg="5" xs="12" className="text-right">
                  {checkedRows && checkedRows.length > 0 && (
                  <Button
                    onClick={() => { onNext(); showFormModal(true); }}
                    type="button"
                    variant="contained"
                    className="header-create-btn mr-3"
                  >
                    Add Schedule
                  </Button>
                  )}
                  <Input
                    id="standard-adornment-password"
                    type="text"
                    name="search"
                    placeholder="Search Name, Path..."
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
              <div className="pl-1 pr-1 pt-0 comments-list thin-scrollbar">
                {(listDataMultipleInfo && listDataMultipleInfo.data) && (
                  <Table responsive>
                    <thead className="bg-gray-light">
                      <tr>
                        <th className="w-5 p-2">
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
                        {headers && headers.map((header) => (
                          <th className="min-width-100 p-2">
                            {header.name}
                            {infoValue(header.infoText)}
                          </th>
                        ))}
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
        <Drawer
          PaperProps={{
            sx: { width: '85%' },
          }}
          anchor="right"
          open={formModal}
        >
          <DrawerHeader
            headerName="Schedule Planner"
            onClose={() => { onReset(); setMaintenanceType(false); }}
          />
          <ScheduleForm
            afterReset={() => {
              onReset();
            }}
            closeAddModal={() => {
              showFormModal(false);
            }}
            categoryId
            typeValue
            maintenanceType
          />
        </Drawer>
      </Row>
      {/* <ModalFooter>
        {(checkedRows && checkedRows.length && checkedRows.length > 0)
          ? (
            <Button
              type="button"
              size="sm"
              onClick={() => handleAdd()}
              variant="contained"
            >
              {' '}
              Add
            </Button>
          ) : ''}
      </ModalFooter> */}
    </>
  );
};

SearchModalSingle.propTypes = {
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
};

export default SearchModalSingle;
