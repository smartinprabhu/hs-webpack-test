/* eslint-disable import/no-unresolved */
/* eslint-disable no-underscore-dangle */
/* eslint-disable radix */
import { makeStyles } from '@material-ui/core/styles';
import Pagination from '@material-ui/lab/Pagination';
import React, { useState, useEffect } from 'react';
import {
  Badge, Card, CardBody, Col, Input, Label, Row, Table, Popover, PopoverHeader, PopoverBody,
} from 'reactstrap';
import { useDispatch, useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faTimesCircle,
} from '@fortawesome/free-solid-svg-icons';
import moment from 'moment-timezone';
import {
  Drawer,
} from 'antd';

import ListDateFilters from '@shared/listViewFilters/dateFilters';
import TableListFormat from '@shared/tableListFormat';
import SearchList from '@shared/listViewFilters/search';
import AddColumns from '@shared/listViewFilters/columns';
import CardTitleCustom from '@shared/sideTools/cardTitleCustom';
import ExportList from '@shared/listViewFilters/export';
import DrawerHeader from '@shared/drawerHeader';
import CollapseImg from '@shared/sideTools/collapseImg';
import CollapseItemDynamic from '@shared/sideTools/collapseItemDynamic';
import closeCircleIcon from '@images/icons/closeCircle.svg';
import workOrdersBlue from '@images/icons/workPermitBlue.svg';
import customData from '../data/customData.json';
import filtersFields from '../data/filtersFields.json';
import {
  getPagesCountV2, extractTextObject,
  queryGeneratorV1, getAllowedCompanies, getColumnArrayById,
  getCompanyTimezoneDate, getDefaultNoValue,
  getArrayFromValuesByItem,queryGeneratorWithUtc,  
} from '../../util/appUtils';
import {
  getOpportunities, getOpportunitiesCount,
  getOpportunitiesFilters, getOpportunitiesDetails,
  getStageGroups,
} from '../auditService';
import {
  setInitialValues,
} from '../../purchase/purchaseService';

import DataExport from './dataExport/opportunityDataExport';
import OpportunitiesDetail from '../opportunityDetail/opportunitiesDetail';

const appModels = require('../../util/appModels').default;

const useStyles = makeStyles((theme) => ({
  root: {
    '& > *': {
      marginTop: theme.spacing(2),
    },
  },
}));

const opportunities = () => {
  const limit = 10;
  const classes = useStyles();
  const dispatch = useDispatch();
  const [offset, setOffset] = useState(0);
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState('DESC');
  const [sortField, setSortField] = useState('create_date');
  const [columns, setColumns] = useState(customData && customData.listfieldsShowsOpp ? customData.listfieldsShowsOpp : []);
  const [customFilters, setCustomFilters] = useState([]);
  const [collapse, setCollapse] = useState(false);
  const [checkedRows, setCheckRows] = useState([]);
  const [isAllChecked, setIsAllChecked] = useState(false);

  const [filtersIcon, setFilterIcon] = useState(false);
  // const [statusCollapse, setStatusCollapse] = useState(true);
  const [statusCollapse, setStatusCollapse] = useState(true);
  const [statusGroups, setStatusGroups] = useState([]);

  const [viewId, setViewId] = useState(false);
  const [viewModal, setViewModal] = useState(false);

  const [editId, setEditId] = useState(false);
  const [editModal, showEditModal] = useState(false);

  const { userInfo } = useSelector((state) => state.user);
  const companies = getAllowedCompanies(userInfo);
  const {
    opportunitiesInfo, opportunitiesCount, opportunitiesCountLoading,
    opportunitiesFilters, opportunitiesDetails, statusGroupInfo,
  } = useSelector((state) => state.audit);

  const { filterInitailValues } = useSelector((state) => state.purchase);

  useEffect(() => {
    if (statusGroupInfo && statusGroupInfo.data) {
      setStatusGroups(statusGroupInfo.data);
    }
  }, [statusGroupInfo]);

  useEffect(() => {
    if (statusCollapse) {
      dispatch(getStageGroups(companies, appModels.SYSTEMOPPORTUNITIES));
    }
  }, [statusCollapse]);

  useEffect(() => {
    if (opportunitiesFilters && opportunitiesFilters.customFilters) {
      setCustomFilters(opportunitiesFilters.customFilters);
    }
  }, [opportunitiesFilters]);

  useEffect(() => {
    if (userInfo && userInfo.data) {
      const customFiltersList = opportunitiesFilters.customFilters ? queryGeneratorWithUtc(opportunitiesFilters.customFilters, false,userInfo.data ) : '';
      dispatch(getOpportunitiesCount(companies, appModels.SYSTEMOPPORTUNITIES, customFiltersList));
    }
  }, [userInfo, customFilters]);

  useEffect(() => {
    if (userInfo && userInfo.data) {
      const customFiltersList = opportunitiesFilters.customFilters ? queryGeneratorWithUtc(opportunitiesFilters.customFilters, false, userInfo.data) : '';
      dispatch(getOpportunities(companies, appModels.SYSTEMOPPORTUNITIES, limit, offset, customFiltersList, sortBy, sortField));
    }
  }, [userInfo, offset, sortField, sortBy, customFilters]);

  useEffect(() => {
    if (viewId) {
      dispatch(getOpportunitiesDetails(viewId, appModels.SYSTEMOPPORTUNITIES));
    }
  }, [viewId]);

  const totalDataCount = opportunitiesCount && opportunitiesCount.length ? opportunitiesCount.length : 0;

  const pages = getPagesCountV2(totalDataCount, limit);

  const handlePageClick = (e, index) => {
    e.preventDefault();
    const offsetVal = (index - 1) * limit;
    setOffset(offsetVal);
    setPage(index);
    setIsAllChecked(false);
  };

  const handleColumnChange = (event) => {
    const { checked, value } = event.target;
    if (checked) {
      setColumns((state) => [...state, value]);
    } else {
      setColumns(columns.filter((item) => item !== value));
    }
  };

  const handleTableCellChange = (event) => {
    dispatch(setInitialValues(false, false, false, false));
    const { checked, value } = event.target;
    if (checked) {
      setCheckRows((state) => [...state, value]);
    } else {
      setCheckRows(checkedRows.filter((item) => parseInt(item) !== parseInt(value)));
    }
  };

  const handleTableCellAllChange = (event) => {
    dispatch(setInitialValues(false, false, false, false));
    const { checked } = event.target;
    if (checked) {
      const data = opportunitiesInfo && opportunitiesInfo.data ? opportunitiesInfo.data : [];
      const newArr = [...getColumnArrayById(data, 'id'), ...checkedRows];
      setCheckRows([...new Map(newArr.map((item) => [item, item])).values()]);
      setIsAllChecked(true);
    } else {
      const data = opportunitiesInfo && opportunitiesInfo.data ? opportunitiesInfo.data : [];
      const ids = getColumnArrayById(data, 'id');
      setCheckRows(getArrayFromValuesByItem(checkedRows, ids));
      setIsAllChecked(false);
    }
  };

  const handleStatusChange = (event) => {
    const { checked, value, name } = event.target;
    if (checked) {
      const filters = [{
        key: 'stage_id', title: 'Status', value: parseInt(value), label: name, type: 'inarray',
      }];
      const customFiltersList = [...customFilters, ...filters];
      dispatch(getOpportunitiesFilters(customFiltersList));
    } else {
      const customFiltersList = customFilters.filter((item) => parseInt(item.value) !== parseInt(value));
      dispatch(getOpportunitiesFilters(customFiltersList));
    }
    setOffset(0);
    setPage(1);
  };

  const onStateSearchChange = (e) => {
    if (e.target.value && e.target.value.length > 0) {
      const ndata = statusGroups.filter((item) => {
        const searchValue = item.stage_id ? item.stage_id[1].toString().toUpperCase() : '';
        const s = e.target.value.toString().toUpperCase();
        return (searchValue.search(s) !== -1);
      });
      setStatusGroups(ndata);
    } else {
      setStatusGroups(statusGroupInfo && statusGroupInfo.data ? statusGroupInfo.data : []);
    }
  };
  const onViewReset = () => {
    setViewId(false);
    setViewModal(false);
  };

  const handleRadioboxChange = (event) => {
    const { checked, value } = event.target;
    const filters = [{
      key: value, value, label: value, type: 'date',
    }];
    if (checked) {
      const oldCustomFilters = opportunitiesFilters && opportunitiesFilters.customFilters ? opportunitiesFilters.customFilters : [];
      const customFilters1 = [...oldCustomFilters.filter((item) => item.type !== 'date' && item.type !== 'customdate'), ...filters];
      dispatch(getOpportunitiesFilters(customFilters1));
    }
    setOffset(0);
    setPage(1);
  };

  const handleCustomDateChange = (startDate, endDate) => {
    const value = 'Custom';
    let start = '';
    let end = '';
    let filters = [];
    if (startDate && endDate) {
      start = `${moment(startDate).utc().format('YYYY-MM-DD')} 18:30:59`;
      end = `${moment(endDate).utc().format('YYYY-MM-DD')} 18:30:59`;
    }
    if (startDate && endDate) {
      filters = [{
        key: value, value, label: value, type: 'customdate', start, end,
      }];
    }
    if (start && end) {
      const oldCustomFilters = opportunitiesFilters && opportunitiesFilters.customFilters ? opportunitiesFilters.customFilters : [];
      const customFilters1 = [...oldCustomFilters.filter((item) => item.type !== 'date' && item.type !== 'customdate' && item.type !== 'datearray'), ...filters];
      dispatch(getOpportunitiesFilters(customFilters1));
    }
    setOffset(0);
    setPage(1);
  };

  const handleCustomFilterClose = (value) => {
    setCustomFilters(customFilters.filter((item) => item.value !== value));
    const customFiltersList = customFilters.filter((item) => item.value !== value);
    dispatch(getOpportunitiesFilters(customFiltersList));
    setOffset(0);
    setPage(1);
  };

  const handleResetClick = (e) => {
    e.preventDefault();
    setCustomFilters([]);
    dispatch(getOpportunitiesFilters([]));
    setOffset(0);
    setPage(1);
  };

  const showDetailsView = (id) => {
    dispatch(setInitialValues(false, false, false, false));
    setViewId(id);
    setViewModal(true);
  };

  const searchHandleSubmit = (values, { resetForm }) => {
    const sVal = values.fieldValue ? values.fieldValue.trim() : '';
    const filters = [{
      key: values.fieldName.value, value: encodeURIComponent(sVal), label: values.fieldName.label, type: 'text',
    }];
    const customFilters1 = [...customFilters, ...filters];
    resetForm({ values: '' });
    dispatch(getOpportunitiesFilters(customFilters1));
    setOffset(0);
    setPage(1);
  };

  function getNextPreview(ids, type) {
    const array = opportunitiesInfo && opportunitiesInfo.data ? opportunitiesInfo.data : [];
    let listId = 0;
    if (array && array.length > 0) {
      const index = array.findIndex((element) => element.id === ids);

      if (index > -1) {
        if (type === 'Next') {
          listId = array[index + 1].id;
        } else {
          listId = array[index - 1].id;
        }
      }
    }
    return listId;
  }

  const stateValuesList = (opportunitiesFilters && opportunitiesFilters.customFilters && opportunitiesFilters.customFilters.length > 0)
    ? opportunitiesFilters.customFilters.filter((item) => item.type === 'inarray') : [];

  const stateValues = getColumnArrayById(stateValuesList, 'value');

  const dateFilters = (opportunitiesFilters && opportunitiesFilters.customFilters && opportunitiesFilters.customFilters.length > 0) ? opportunitiesFilters.customFilters : [];
  const loading = (userInfo && userInfo.loading) || (opportunitiesInfo && opportunitiesInfo.loading) || (opportunitiesCountLoading);

  return (
    <Row className="pt-2">
      <Col md="12" sm="12" lg={collapse ? 1 : 3} xs="12" className={collapse ? 'ml-2 pt-2 pl-2 pr-2' : 'pt-2 pl-2 pr-2'}>
        {collapse
          ? (
            <CollapseImg onCollapse={() => setCollapse(!collapse)} />
          )
          : (
            <Card className="p-1 h-100 bg-lightblue side-filters-list" onMouseOver={() => setFilterIcon(true)} onMouseLeave={() => setFilterIcon(false)}>
              <CardTitleCustom filtersIcon={filtersIcon} onCollapse={() => setCollapse(!collapse)} />
              <CardBody className="ml-2 p-0 mt-2 position-relative side-filters-list thin-scrollbar">
                {/* <CollapseItemCustom
                  title="STATUS"
                  data={customData && customData.states ? customData.states : []}
                  selectedValues={stateValues}
                  onCollapse={() => setStatusCollapse(!statusCollapse)}
                  isOpen={statusCollapse}
                  onCheckboxChange={handleStatusCheckboxChange}
          /> */}
                <CollapseItemDynamic
                  title="STATUS"
                  data={statusGroupInfo}
                  selectedValues={stateValues}
                  dataGroup={statusGroups}
                  placeholder="Please search a STATUS"
                  filtervalue="stage_id"
                  onCollapse={() => setStatusCollapse(!statusCollapse)}
                  isOpen={statusCollapse}
                  onCheckboxChange={handleStatusChange}
                  onSearchChange={onStateSearchChange}
                />
                {customFilters && customFilters.length > 0 && (
                <div aria-hidden="true" className="float-right cursor-pointer mb-4 mr-2 text-info font-weight-800" onClick={handleResetClick} onKeyDown={handleResetClick}>Reset Filters</div>
                )}
              </CardBody>
            </Card>
          )}
      </Col>
      <Col md="12" sm="12" lg={collapse ? 11 : 9} xs="12" className={collapse ? 'filter-margin-left-align pt-2 pr-2 pl-1 list' : 'list pl-1 pt-2 pr-2'}>
        <Card className={collapse ? 'filter-margin-right p-2 mb-2 h-100 bg-lightblue' : 'p-2 mb-2 h-100 bg-lightblue'}>
          <CardBody className="bg-color-white p-1 m-0">
            <Row className="p-2">
              <Col md="8" xs="12" sm="8" lg="8">
                <div className="content-inline">
                  <span className="p-0 mr-2 font-weight-800 font-medium">
                    Opportunities List :
                    {'  '}
                    {totalDataCount}
                  </span>
                  {customFilters && customFilters.map((cf) => (
                    <p key={cf.value} className="mr-2 content-inline">
                      <Badge color="dark" className="p-2 mb-1 bg-zodiac">
                        {cf.label}
                        {(cf.type === 'text' || cf.type === 'id') && (
                        <span>
                          {'  '}
                          &quot;
                          {decodeURIComponent(cf.value)}
                          &quot;
                        </span>
                        )}
                        {(cf.type === 'customdate') && (
                        <span>
                          {' - '}
                          &quot;
                          {getCompanyTimezoneDate(cf.start, userInfo, 'date')}
                          {' - '}
                          {getCompanyTimezoneDate(cf.end, userInfo, 'date')}
                          &quot;
                        </span>
                        )}
                        <FontAwesomeIcon className="ml-2 cursor-pointer" onClick={() => handleCustomFilterClose(cf.value)} size="sm" icon={faTimesCircle} />
                      </Badge>
                    </p>
                  ))}
                </div>
              </Col>
              <Col md="4" xs="12" sm="4" lg="4">
                <div className="float-right">
                  <ListDateFilters dateFilters={dateFilters} onClickRadioButton={handleRadioboxChange} onChangeCustomDate={handleCustomDateChange} />
                  <SearchList formFields={filtersFields.fields} searchHandleSubmit={searchHandleSubmit} />
                  <AddColumns columns={customData.tableColumnsOpp} handleColumnChange={handleColumnChange} columnFields={columns} />
                  <ExportList response={(opportunitiesInfo && opportunitiesInfo.data && opportunitiesInfo.data.length > 0)} />
                </div>
                <Popover placement="bottom" isOpen={filterInitailValues.download} target="Export">
                  <PopoverHeader>
                    Export
                    <img
                      src={closeCircleIcon}
                      aria-hidden="true"
                      className="cursor-pointer mr-1 mt-1 float-right"
                      onClick={() => dispatch(setInitialValues(false, false, false, false))}
                      alt="close"
                    />
                  </PopoverHeader>
                  <PopoverBody>
                    <DataExport
                      afterReset={() => dispatch(setInitialValues(false, false, false, false))}
                      fields={columns}
                      rows={checkedRows}
                      sortBy={sortBy}
                      sortField={sortField}
                    />
                  </PopoverBody>
                </Popover>
              </Col>
            </Row>
            <div className="thin-scrollbar">
              {(opportunitiesInfo && opportunitiesInfo.data && opportunitiesInfo.data.length > 0) && (

              <Table responsive>
                <thead className="bg-gray-light">
                  <tr>
                    <th>
                      <div className="checkbox">
                        <Input
                          type="checkbox"
                          value="all"
                          className="m-0 position-relative"
                          name="checkall"
                          id="checkboxtkhead"
                          checked={isAllChecked}
                          onChange={handleTableCellAllChange}
                        />
                        <Label htmlFor="checkboxtkhead" />
                      </div>
                    </th>
                    <th className="min-width-120">
                      <span aria-hidden="true" className="sort-by cursor-pointer" onClick={() => { setSortField('reference'); setSortBy(sortBy === 'ASC' ? 'DESC' : 'ASC'); }}>
                        Reference
                      </span>
                    </th>
                    <th className="min-width-140">
                      <span aria-hidden="true" className="sort-by cursor-pointer" onClick={() => { setSortField('name'); setSortBy(sortBy === 'ASC' ? 'DESC' : 'ASC'); }}>
                        Subject
                      </span>
                    </th>
                    <th className="min-width-180">
                      <span aria-hidden="true" className="sort-by cursor-pointer" onClick={() => { setSortField('type_action'); setSortBy(sortBy === 'ASC' ? 'DESC' : 'ASC'); }}>
                        Response Type
                      </span>
                    </th>
                    <th className="min-width-160">
                      <span aria-hidden="true" className="sort-by cursor-pointer" onClick={() => { setSortField('user_id'); setSortBy(sortBy === 'ASC' ? 'DESC' : 'ASC'); }}>
                        Responsible
                      </span>
                    </th>
                    <th className="min-width-180">
                      <span aria-hidden="true" className="sort-by cursor-pointer" onClick={() => { setSortField('date_deadline'); setSortBy(sortBy === 'ASC' ? 'DESC' : 'ASC'); }}>
                        Dead Line
                      </span>
                    </th>
                    <th className="min-width-180">
                      <span aria-hidden="true" className="sort-by cursor-pointer" onClick={() => { setSortField('stage_id'); setSortBy(sortBy === 'ASC' ? 'DESC' : 'ASC'); }}>
                        Stage
                      </span>
                    </th>
                    {columns.some((selectedValue) => selectedValue.includes('create_date')) && (
                    <th className="p-2 min-width-200">
                      <span aria-hidden="true" className="sort-by cursor-pointer" onClick={() => { setSortField('create_date'); setSortBy(sortBy === 'ASC' ? 'DESC' : 'ASC'); }}>
                        Create Date
                      </span>
                    </th>
                    )}
                    {columns.some((selectedValue) => selectedValue.includes('company_id')) && (
                    <th className="p-2 min-width-200">
                      <span aria-hidden="true" className="sort-by cursor-pointer" onClick={() => { setSortField('company_id'); setSortBy(sortBy === 'ASC' ? 'DESC' : 'ASC'); }}>
                        Company
                      </span>
                    </th>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {opportunitiesInfo.data.map((pt) => (
                    <tr key={pt.id}>
                      <td className="w-5">
                        <div className="checkbox">
                          <Input
                            type="checkbox"
                            value={pt.id}
                            id={`checkboxtk${pt.id}`}
                            className="ml-0"
                            name={pt.name}
                            checked={checkedRows.some((selectedValue) => parseInt(selectedValue) === parseInt(pt.id))}
                            onChange={handleTableCellChange}
                          />
                          <Label htmlFor={`checkboxtk${pt.id}`} />
                        </div>
                      </td>
                      <td aria-hidden className="w-15 cursor-pointer" onClick={() => showDetailsView(pt.id)}>
                        <span className="font-weight-600">
                          {getDefaultNoValue(pt.reference)}
                        </span>
                      </td>
                      <td className="w-15">
                        <span className="font-weight-400">{getDefaultNoValue(pt.name)}</span>
                      </td>
                      <td className="w-15">
                        <span className="font-weight-400">{getDefaultNoValue(pt.type_action)}</span>
                      </td>
                      {/* <td className="w-15">
                        <span className="font-weight-400">
                          {getDefaultNoValue(getCompanyTimezoneDate(pt.date_deadline, userInfo, 'datetime'))}
                        </span>
                  </td> */}
                      <td className="w-15">

                        <span className="font-weight-400">{getDefaultNoValue(extractTextObject(pt.user_id))}</span>

                      </td>
                      <td className="w-15">
                        <span className="font-weight-400">
                          {getDefaultNoValue(getCompanyTimezoneDate(pt.date_deadline, userInfo, 'datetime'))}
                        </span>
                      </td>
                      <td className="w-15">
                        <span className="font-weight-400 d-inline-block">
                          {getDefaultNoValue(extractTextObject(pt.stage_id))}
                        </span>
                      </td>

                      {columns.some((selectedValue) => selectedValue.includes('create_date')) && (
                      <td className="w-15">
                        <span className="font-weight-400">{getDefaultNoValue(getCompanyTimezoneDate(pt.create_date, userInfo, 'datetime'))}</span>
                      </td>
                      )}
                      {columns.some((selectedValue) => selectedValue.includes('company_id')) && (
                      <td className="w-15">
                        <span className="font-weight-400">{getDefaultNoValue(extractTextObject(pt.company_id))}</span>
                      </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </Table>
              )}
              {loading || pages === 0 ? (<span />) : (
                <div className={`${classes.root} float-right`}>
                  <Pagination count={pages} page={page} size="small" color="primary" onChange={handlePageClick} showFirstButton showLastButton />
                </div>
              )}
              <Drawer
                title=""
                closable={false}
                width={1250}
                className="drawer-bg-lightblue"
                visible={viewModal}
              >
                <DrawerHeader
                  title={opportunitiesDetails && (opportunitiesDetails.data && opportunitiesDetails.data.length > 0)
                    ? `${'Opportunities'}${' - '}${opportunitiesDetails.data[0].name}${' ('}${opportunitiesDetails.data[0].reference}${')'}` : 'Oppertunities'}
                  imagePath={workOrdersBlue}
                  closeDrawer={() => onViewReset()}
                  isEditable={editModal && (opportunitiesDetails && !opportunitiesDetails.loading)}
                  onEdit={() => {
                    setEditId(opportunitiesDetails && (opportunitiesDetails.data && opportunitiesDetails.data.length > 0) ? opportunitiesDetails.data[0].id : false);
                    showEditModal(!editModal);
                  }}
                  onPrev={() => { setViewId(getNextPreview(viewId, 'Prev')); }}
                  onNext={() => { setViewId(getNextPreview(viewId, 'Next')); }}
                />
                <OpportunitiesDetail />
              </Drawer>
              <TableListFormat
                userResponse={userInfo}
                listResponse={opportunitiesInfo}
                countLoad={opportunitiesCountLoading}
              />
            </div>

          </CardBody>
        </Card>
      </Col>
    </Row>
  );
};

export default opportunities;
