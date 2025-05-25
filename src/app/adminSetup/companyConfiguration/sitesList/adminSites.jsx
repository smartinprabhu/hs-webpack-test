/* eslint-disable import/no-unresolved */
/* eslint-disable no-underscore-dangle */
/* eslint-disable radix */
import { makeStyles } from '@material-ui/core/styles';
import Pagination from '@material-ui/lab/Pagination';
import React, { useState, useEffect } from 'react';
import {
 Badge, Card, CardBody, Col, Input, Label,
  CardTitle, Row, Modal, ModalBody, Table, Tooltip,
} from 'reactstrap';
import Button from '@mui/material/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faTimesCircle,
} from '@fortawesome/free-solid-svg-icons';
import { useDispatch, useSelector } from 'react-redux';

import editIcon from '@images/icons/edit.svg';
import editWhiteIcon from '@images/icons/editWhite.svg';
import closeCircleIcon from '@images/icons/closeCircle.svg';
import closeCircleWhiteIcon from '@images/icons/closeCircleWhite.svg';
import ModalHeaderComponent from '@shared/modalHeaderComponent';
import columnsMiniIcon from '@images/icons/gridBlack.svg';
import ListDateFilters from '@shared/listViewFilters/dateFilters';
import CreateList from '@shared/listViewFilters/create';
import SearchList from '@shared/listViewFilters/search';
import DetailNavigation from '@shared/navigation';
import ErrorContent from '@shared/errorContent';
import Loader from '@shared/loading';
import SuccessAndErrorFormat from '@shared/successAndErrorFormat';
import Refresh from '@shared/listViewFilters/refresh';

import {
  getPagesCountV2, generateErrorMessage, getArrayFromValuesByItem,
  getListOfModuleOperations, getLocalDate, getColumnArrayById,
} from '../../../util/appUtils';
import SideFilters from './sidebar';
import {
  getSiteFilters, resetCreateSite, resetUpdateSite, getSiteDetail,
  resetSiteDetails,
} from '../../setupService';
import AddSite from '../../siteConfiguration/addSite/addSite';
import actionCodes from '../../data/actionCodes.json';
import Sites from '../sites';
import SiteInfo from '../siteInfo';
import filtersFields from './filterFields.json';
import { setInitialValues } from '../../../purchase/purchaseService';

const appModels = require('../../../util/appModels').default;

const useStyles = makeStyles((theme) => ({
  root: {
    '& > *': {
      marginTop: theme.spacing(2),
    },
  },
}));

const AdminSites = () => {
  const limit = 12;
  const dispatch = useDispatch();
  const [offset, setOffset] = useState(0);
  const [page, setPage] = useState(1);
  const [reload, setReload] = useState(false);
  const [statusValue, setStatusValue] = useState(0);
  const [checkItems, setCheckItems] = useState([]);
  const [customFilters, setCustomFilters] = useState([]);
  const [customFilterList, setCustomFiltersList] = useState([]);
  const [sortBy, setSortBy] = useState('DESC');
  const [sortField, setSortField] = useState('create_date');
  const [openValues, setOpenValues] = useState([]);
  const [addSiteModal, showAddSiteModal] = useState(false);
  const [editSiteModal, showEditSiteModal] = useState(false);
  const [showType, setShowType] = useState('table');
  const [viewId, setViewId] = useState(0);
  const [isButtonHover, setButtonHover] = useState(false);
  const [isButtonHover1, setButtonHover1] = useState(false);

  const [checkedRows, setCheckRows] = useState([]);
  const [isAllChecked, setIsAllChecked] = useState(false);
  const [customVariable, setCustomVariable] = useState(false);

  const toggle = (id) => {
    setOpenValues((state) => [...state, id]);
  };

  const classes = useStyles();

  const { userInfo, userRoles } = useSelector((state) => state.user);
  const {
    sitesListInfo, sitesCount, sitesCountLoading,
    siteFilters, siteDetails, updateSiteInfo, createSiteInfo,
  } = useSelector((state) => state.setup);

  const allowedOperations = getListOfModuleOperations(userRoles && userRoles.data ? userRoles.data.allowed_modules : [], 'Admin Setup', 'code');

  useEffect(() => {
    if (siteFilters && siteFilters.statuses) {
      setCheckItems(siteFilters.statuses);
      setStatusValue(0);
    }
    if (siteFilters && siteFilters.customFilters) {
      setCustomFilters(siteFilters.customFilters);
    }
  }, [siteFilters]);

  useEffect(() => {
    if ((userInfo && userInfo.data) && (updateSiteInfo && updateSiteInfo.data)) {
      const id = siteDetails && siteDetails.data ? siteDetails.data[0].id : '';
      dispatch(getSiteDetail(id, appModels.COMPANY));
    }
  }, [userInfo, updateSiteInfo]);

  const totalDataCount = sitesCount && sitesCount.length ? sitesCount.length : 0;

  const pages = getPagesCountV2(totalDataCount, limit);
  const dateFilters = (siteFilters && siteFilters.customFilters && siteFilters.customFilters.length > 0) ? siteFilters.customFilters : [];

  const handlePageClick = (e, index) => {
    e.preventDefault();
    const offsetValue = (index - 1) * limit;
    setOffset(offsetValue);
    setPage(index);
    setIsAllChecked(false);
  };

  const onReset = () => {
    dispatch(resetCreateSite());
    dispatch(resetUpdateSite());
  };

  const onResetSiteInfo = () => {
    showAddSiteModal(true);
    dispatch(resetSiteDetails());
  };

  const getSiteDetails = (id) => {
    dispatch(getSiteDetail(id, appModels.COMPANY));
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
      const data = sitesListInfo && sitesListInfo.data ? sitesListInfo.data : [];
      const newArr = [...getColumnArrayById(data, 'id'), ...checkedRows];
      setCheckRows([...new Map(newArr.map((item) => [item, item])).values()]);
      setIsAllChecked(true);
    } else {
      const data = sitesListInfo && sitesListInfo.data ? sitesListInfo.data : [];
      const ids = getColumnArrayById(data, 'id');
      setCheckRows(getArrayFromValuesByItem(checkedRows, ids));
      setIsAllChecked(false);
    }
  };

  const handleStatusClose = (value) => {
    setOffset(0); setPage(1);
    setStatusValue(value);
    setCheckItems(checkItems.filter((item) => item.id !== value));
  };

  const handleCustomFilterClose = (value) => {
    setOffset(0); setPage(1);
    setCustomFilters(customFilters.filter((item) => item.key !== value));
    const states = siteFilters && siteFilters.statuses ? siteFilters.statuses : [];
    const customFiltersList = customFilters.filter((item) => item.key !== value);
    dispatch(getSiteFilters(states, customFiltersList));
  };

  const handleRadioboxChange = (event) => {
    const { checked, value } = event.target;
    const filters = [{
      key: value, value, label: value, type: 'date',
    }];
    if (checked) {
      setCustomFiltersList(filters);
      const oldCustomFilters = siteFilters && siteFilters.customFilters ? siteFilters.customFilters : [];
      const states = siteFilters && siteFilters.statuses ? siteFilters.statuses : [];
      const customFiltersData = [...oldCustomFilters.filter((item) => item.type !== 'date' && item.type !== 'customdate'), ...filters];
      dispatch(getSiteFilters(states, customFiltersData));
    } else {
      setCustomFiltersList(customFilterList.filter((item) => item !== value));
      const oldCustomFilters = siteFilters && siteFilters.customFilters ? siteFilters.customFilters : [];
      const states = siteFilters && siteFilters.statuses ? siteFilters.statuses : [];
      const customFilter = [...oldCustomFilters, ...customFilterList.filter((item) => item !== value)];
      dispatch(getSiteFilters(states, customFilter));
    }
    setOffset(0); setPage(1);
  };

  const handleCustomDateChange = (start, end) => {
    const value = 'Custom';
    const filters = [{
      key: value, value, label: value, type: 'customdate', start, end,
    }];
    if (start && end) {
      setCustomFiltersList(filters);
      const oldCustomFilters = siteFilters && siteFilters.customFilters ? siteFilters.customFilters : [];
      const states = siteFilters && siteFilters.statuses ? siteFilters.statuses : [];
      const customFiltersData = [...oldCustomFilters.filter((item) => item.type !== 'date' && item.type !== 'customdate'), ...filters];
      dispatch(getSiteFilters(states, customFiltersData));
    } else {
      setCustomFiltersList(customFilterList.filter((item) => item !== value));
      const oldCustomFilters = siteFilters && siteFilters.customFilters ? siteFilters.customFilters : [];
      const states = siteFilters && siteFilters.statuses ? siteFilters.statuses : [];
      const customFilter = [...oldCustomFilters, ...customFilterList.filter((item) => item !== value)];
      dispatch(getSiteFilters(states, customFilter));
    }
    setOffset(0); setPage(1);
  };

  function searchHandleSubmit(values, { resetForm }) {
    const filters = [{
      key: values.fieldName.value, value: encodeURIComponent(values.fieldValue), label: values.fieldName.label, type: 'text',
    }];
    const oldCustomFilters = siteFilters && siteFilters.customFilters ? siteFilters.customFilters : [];
    const states = siteFilters && siteFilters.statuses ? siteFilters.statuses : [];
    const customFilter = [...oldCustomFilters, ...filters];
    dispatch(getSiteFilters(states, customFilter));
    resetForm({ values: '' });
    setOffset(0); setPage(1);
  }

  const isUserError = userInfo && userInfo.err;
  const loading = (userInfo && userInfo.loading) || (sitesListInfo && sitesListInfo.loading) || (sitesCountLoading);
  const userErrorMsg = generateErrorMessage(userInfo);
  const errorMsg = (sitesListInfo && sitesListInfo.err) ? generateErrorMessage(sitesListInfo) : userErrorMsg;

  return (

    <Row className="pt-2">
      <Col md="3" sm="3" lg="3" xs="12">
        <SideFilters
          offset={offset}
          id={viewId}
          statusValue={statusValue}
          afterReset={() => { setPage(1); setOffset(0); }}
          sortBy={sortBy}
          sortField={sortField}
          reload={reload}
        />
      </Col>
      <Col className="adminsetup-site-table" md="9" sm="9" lg="9" xs="12">
        {viewId ? (
          <div className="card h-100">
            <Row>
              <Col sm="12" md="12" lg="12" xs="12">
                <Card className="bg-lightblue border-0 pr-2 pl-2 h-100">
                  <CardTitle className="mt-2 mb-0">
                    <Row>
                      <Col sm="12" md="9" lg="9" xs="12" className="card-mb-3">
                        <DetailNavigation
                          overviewName="Company Configuration"
                          overviewPath="/site-configuration"
                          listName="Sites"
                          detailName={siteDetails && (siteDetails.data && siteDetails.data.length > 0) ? siteDetails.data[0].name : ''}
                          afterList={() => { setOffset(offset); setPage(page); setViewId(0); }}
                        />
                      </Col>
                      <Col sm="12" md="3" lg="3" xs="12">
                        <span className="float-right">
                          {allowedOperations.includes(actionCodes['Edit Site']) && (
                          <>
                            <Button
                               variant="contained"
                              size="sm"
                              onClick={() => { dispatch(setInitialValues(false, false, false, false)); showEditSiteModal(true); }}
                              onMouseLeave={() => setButtonHover1(false)}
                              onMouseEnter={() => setButtonHover1(true)}
                              className="hoverColor pb-05 pt-05 font-11 border-color-red-gray bg-white text-dark rounded-pill mb-1 mr-2"
                            >
                              <img src={isButtonHover1 ? editWhiteIcon : editIcon} className="mr-2 pb-2px" height="12" width="12" alt="edit" />
                              <span className="mr-2">Edit</span>
                            </Button>
                          </>
                          )}
                          <Button
                             variant="contained"
                            size="sm"
                            onClick={() => { setOffset(offset); setPage(page); setViewId(0); }}
                            onMouseLeave={() => setButtonHover(false)}
                            onMouseEnter={() => setButtonHover(true)}
                            className="hoverColor pb-05 pt-05 font-11 border-color-red-gray bg-white text-dark rounded-pill mb-1 mr-2"
                          >
                            <img src={isButtonHover ? closeCircleWhiteIcon : closeCircleIcon} className="mr-2 pb-2px" height="12" width="12" alt="close" />
                            <span className="mr-2">Close</span>
                          </Button>
                        </span>
                      </Col>
                    </Row>
                  </CardTitle>
                  <hr className="mt-1 mb-1 border-color-grey" />
                </Card>
              </Col>
            </Row>
            <SiteInfo />
            <Modal size={(createSiteInfo && createSiteInfo.data) || (updateSiteInfo && updateSiteInfo.data) ? 'sm' : 'xl'} className="border-radius-50px modal-dialog-centered" isOpen={editSiteModal}>
              <ModalHeaderComponent title="Edit Site" imagePath={false} closeModalWindow={() => { showEditSiteModal(false); }} response={updateSiteInfo} />
              <ModalBody className="mt-0 pt-0">
                {siteDetails && siteDetails.data && (
                <AddSite
                  afterReset={() => { showEditSiteModal(false); onReset(); }}
                />
                )}
                {siteDetails && siteDetails.loading && (
                <div className="mb-2 mt-5 text-center">
                  <Loader />
                </div>
                )}
                {(siteDetails && siteDetails.err) && (
                <SuccessAndErrorFormat response={siteDetails} />
                )}
              </ModalBody>
            </Modal>
          </div>
        ) : (
          <Card className="p-2 mb-2 h-100 bg-lightblue">
            <CardBody className="bg-color-white p-1 m-0">
              <Row className="p-2">
                <Col md="8" xs="12" sm="8" lg="8">
                  <div className="content-inline">
                    <span className="p-0 mr-2 font-weight-800 font-medium">
                      Sites List :
                      {totalDataCount}
                    </span>
                    {(checkItems) && checkItems.map((st) => (
                      <p key={st.id} className="mr-2 content-inline">
                        <Badge color="dark" className="p-2 mb-1 bg-zodiac">
                          {st.label}
                          <FontAwesomeIcon className="ml-2 cursor-pointer" onClick={() => handleStatusClose(st.id)} size="sm" icon={faTimesCircle} />
                        </Badge>
                      </p>
                    ))}
                    {customFilters && customFilters.map((cf) => (
                      <p key={cf.key} className="mr-2 content-inline">
                        <Badge color="dark" className="p-2 mb-1 bg-zodiac">
                          {cf.label}
                          {cf.type === 'text' && (
                          <span>
                            {'  '}
                            &quot;
                            {cf.value}
                            &quot;
                          </span>
                          )}
                          {(cf.type === 'customdate') && (
                            <span>
                              {' - '}
                              &quot;
                              {getLocalDate(cf.start)}
                              {' - '}
                              {getLocalDate(cf.end)}
                              &quot;
                            </span>
                          )}
                          <FontAwesomeIcon className="ml-2 cursor-pointer" onClick={() => handleCustomFilterClose(cf.key)} size="sm" icon={faTimesCircle} />
                        </Badge>
                      </p>
                    ))}
                  </div>
                </Col>
                <Col md="4" xs="12" sm="4" lg="4">
                  <div className="float-right">
                      <Refresh
                        loadingTrue={loading}
                        setReload={setReload}
                      />
                    <ListDateFilters dateFilters={dateFilters} setCustomVariable={setCustomVariable} customVariable={customVariable} onClickRadioButton={handleRadioboxChange} onChangeCustomDate={handleCustomDateChange} />
                    <SearchList formFields={filtersFields.fields} searchHandleSubmit={searchHandleSubmit} />
                    {allowedOperations.includes(actionCodes['Create New Site']) && (
                    <CreateList name="Add Site" showCreateModal={() => onResetSiteInfo()} />
                    )}
                    <img
                      aria-hidden="true"
                      alt="Columns"
                      src={columnsMiniIcon}
                      id="Columns"
                      className="cursor-pointer mr-2"
                      onMouseOver={() => toggle(4)}
                      onFocus={() => toggle(4)}
                      onMouseLeave={() => setOpenValues([])}
                      onClick={() => setShowType(showType === 'table' ? 'grid' : 'table')}
                    />
                    <Tooltip
                      placement="top"
                      isOpen={openValues.some((selectedValue) => selectedValue === 4)}
                      target="Columns"
                    >
                      {showType === 'table' ? 'Grid View' : 'Table View'}
                    </Tooltip>
                  </div>
                  <Modal
                    size={(createSiteInfo && createSiteInfo.data) || (updateSiteInfo && updateSiteInfo.data) ? 'sm' : 'xl'}
                    className="border-radius-50px modal-dialog-centered"
                    isOpen={addSiteModal}
                  >
                    <ModalHeaderComponent title="Add Site" imagePath={false} closeModalWindow={() => { showAddSiteModal(false); }} response={createSiteInfo} />
                    <ModalBody className="mt-0 pt-0">
                      <AddSite
                        afterReset={() => { showAddSiteModal(false); onReset(); }}
                      />
                    </ModalBody>
                  </Modal>
                </Col>
              </Row>

              {(sitesListInfo && sitesListInfo.data) && (
              <span data-testid="success-case" />
              )}
              <div className="thin-scrollbar">
                {(sitesListInfo && sitesListInfo.data) && (
                  showType === 'table' ? (

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
                          <th className="p-2 min-width-160">
                            <span aria-hidden="true" className="sort-by cursor-pointer" onClick={() => { setSortField('name'); setSortBy(sortBy === 'ASC' ? 'DESC' : 'ASC'); }}>
                              Name
                            </span>
                          </th>
                          <th className="p-2 min-width-160">
                            <span aria-hidden="true" className="sort-by cursor-pointer" onClick={() => { setSortField('code'); setSortBy(sortBy === 'ASC' ? 'DESC' : 'ASC'); }}>
                              Code
                            </span>
                          </th>
                          <th className="p-2 min-width-160">
                            <span>
                              City
                            </span>
                          </th>
                          <th className="p-2 min-width-160">
                            <span>
                              State
                            </span>
                          </th>
                          <th className="p-2 min-width-160">
                            <span>
                              Country
                            </span>
                          </th>
                          <th className="p-2 min-width-200">
                            <span>
                              Address
                            </span>
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {sitesListInfo.data.map((op) => (
                          <tr key={op.id}>
                            <td className="w-5">
                              <div className="checkbox">
                                <Input
                                  type="checkbox"
                                  value={op.id}
                                  id={`checkboxtk${op.id}`}
                                  className="ml-0"
                                  name={op.name}
                                  checked={checkedRows.some((selectedValue) => parseInt(selectedValue) === parseInt(op.id))}
                                  onChange={handleTableCellChange}
                                />
                                <Label htmlFor={`checkboxtk${op.id}`} />
                              </div>
                            </td>
                            <td
                              aria-hidden="true"
                              className="cursor-pointer w-20"
                              onClick={() => { dispatch(setInitialValues(false, false, false, false)); getSiteDetails(op.id); setViewId(op.id); }}
                            >
                              <span className="font-weight-600">{op.name}</span>
                            </td>
                            <td className="w-15"><span className="font-weight-400 d-inline-block">{op.code}</span></td>
                            <td className="w-15"><span className="font-weight-400 d-inline-block">{op.city}</span></td>
                            <td className="w-15"><span className="font-weight-400 d-inline-block">{op.state_id ? op.state_id[1] : '' }</span></td>
                            <td className="w-15"><span className="font-weight-400 d-inline-block">{op.country_id ? op.country_id[1] : '' }</span></td>
                            <td className="w-15"><span className="font-weight-400 d-inline-block">{op.street}</span></td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  )
                    : (
                      <Sites
                        afterReset={() => {
                          dispatch(setInitialValues(false, false, false, false));
                          setViewId(siteDetails && (siteDetails.data && siteDetails.data.length > 0) ? siteDetails.data[0].id : 0);
                        }}
                      />
                    )
                )}
                {loading || pages === 0 ? (<span />) : (
                  <div className={`${classes.root} float-right`}>
                    <Pagination count={pages} page={page} size="small" color="primary" onChange={handlePageClick} showFirstButton showLastButton />
                  </div>
                )}
                {loading && (
                <div className="mb-2 mt-3 p-5" data-testid="loading-case">
                  <Loader />
                </div>
                )}

                {((sitesListInfo && sitesListInfo.err) || isUserError) && (
                <ErrorContent errorTxt={errorMsg} />
                )}
              </div>
            </CardBody>
          </Card>
        )}
      </Col>
    </Row>
  );
};

export default AdminSites;
