/* eslint-disable import/no-unresolved */
/* eslint-disable no-underscore-dangle */
/* eslint-disable radix */
import { makeStyles } from '@material-ui/core/styles';
import Pagination from '@material-ui/lab/Pagination';
import PropTypes from 'prop-types';
import React, { useState, useEffect } from 'react';
import {
  Badge, Card, CardBody, Col, Label, Input, Row, Popover, PopoverHeader, PopoverBody, Table, Tooltip, Modal,
  ModalHeader,
  ModalBody,
} from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faTimesCircle,
} from '@fortawesome/free-solid-svg-icons';
import { useDispatch, useSelector } from 'react-redux';

import closeCircleIcon from '@images/icons/closeCircle.svg';
import filterMiniIcon from '@images/icons/searchBlack.svg';
import closeCirclegreyIcon from '@images/icons/closeCircleGrey.svg';
import assetIcon from '@images/icons/assetDefault.svg';
import plusCircleMiniIcon from '@images/icons/plusCircleMini.svg';
import calendarMiniIcon from '@images/icons/calendarMini.svg';
import CollapseItemCustom from '@shared/sideTools/collapseItemCustom';
import CollapseItemDynamic from '@shared/sideTools/collapseItemDynamic';
import CardTitleCustom from '@shared/sideTools/cardTitleCustom';
import CollapseImg from '@shared/sideTools/collapseImg';
import ErrorContent from '@shared/errorContent';
import Loader from '@shared/loading';
import DateFilters from '../../assets/filters/dateFilters';
import {
  getPagesCountV2, getColumnArrayById, generateErrorMessage, getLocalDate, getListOfOperations, getAllowedCompanies, queryGeneratorV1, queryGeneratorWithUtc,
} from '../../util/appUtils';
import { getEquipmentStateLabel } from '../../assets/utils/utils';
import Filters from '../../assets/filters/filters';
import {
  getAssetDetail, getEquipmentFilters, getCheckedRows, resetCheckedRows, resetAddAssetInfo, getCategoryGroups, getEquipmentList, getEquipmentCount,
} from '../../assets/equipmentService';
import '../preventiveMaintenance.scss';
import AddEquipment from '../../assets/addAsset';
import actionCodes from '../../assets/data/assetActionCodes.json';
import assetsActions from '../../assets/data/assetsActions.json';

const appModels = require('../../util/appModels').default;

const useStyles = makeStyles((theme) => ({
  root: {
    '& > *': {
      marginTop: theme.spacing(2),
    },
  },
}));

const Equipments = (props) => {
  const {
    setFieldValue,
  } = props;
  const limit = 10;
  const dispatch = useDispatch();
  const [offset, setOffset] = useState(0);
  const [page, setPage] = useState(1);
  const [viewId] = useState(0);
  const [openValues, setOpenValues] = useState([]);
  const [customFilters, setCustomFilters] = useState([]);
  const [isFilter, showFilter] = useState(false);
  const [checkedRowsReset, setCheckedRowsReset] = useState(false);
  const [checkedRows, setCheckRows] = useState([]);
  const [isAllChecked, setIsAllChecked] = useState(false);
  const [sortBy, setSortBy] = useState('DESC');
  const [isDateFilter, showDateFilter] = useState(false);
  const [addAssetModal, showAddAssetModal] = useState(false);
  const [statusCollapse, setStatusCollapse] = useState(true);
  const [categoryCollapse, setCategoryCollapse] = useState(false);
  const [categoriesGroups, setCategories] = useState([]);
  const [sortField, setSortField] = useState('create_date');
  const [filtersIcon, setFilterIcon] = useState(false);
  const [collapse, setCollapse] = useState(false);

  const { userInfo, userRoles } = useSelector((state) => state.user);
  const companies = getAllowedCompanies(userInfo);

  const toggle = (id) => {
    setOpenValues((state) => [...state, id]);
  };

  const classes = useStyles();
  const {
    equipmentsCount, equipmentsInfo, equipmentsCountLoading,
    equipmentFilters, categoryGroupsInfo,
  } = useSelector((state) => state.equipment);
  const {
    equipmentSelected,
  } = useSelector((state) => state.ppm);

  const allowedOperations = getListOfOperations(userRoles && userRoles.data ? userRoles.data.allowed_modules : [], 'code');

  useEffect(() => {
    if (categoryGroupsInfo && categoryGroupsInfo.data) {
      setCategories(categoryGroupsInfo.data);
    }
  }, [categoryGroupsInfo]);

  useEffect(() => {
    if (userInfo && userInfo.data && categoryCollapse) {
      dispatch(getCategoryGroups(companies, appModels.EQUIPMENT));
    }
  }, [userInfo, categoryCollapse]);

  const handleTableCellChange = (event) => {
    const { checked, value } = event.target;
    if (checked) {
      setCheckRows((state) => [...state, value]);
    } else {
      setCheckRows(checkedRows.filter((item) => parseInt(item) !== parseInt(value)));
    }
  };

  const handleTableCellAllChange = (event) => {
    const { checked } = event.target;
    if (checked) {
      const data = equipmentsInfo && equipmentsInfo.data ? equipmentsInfo.data : [];
      setCheckRows(getColumnArrayById(data, 'id'));
      setIsAllChecked(true);
    } else {
      setCheckRows([]);
      setIsAllChecked(false);
    }
  };

  useEffect(() => {
    if (equipmentSelected) {
      const data = equipmentSelected || [];
      setCheckRows(getColumnArrayById(data, 'id'));
    }
  }, [equipmentSelected]);

  useEffect(() => {
    dispatch(resetCheckedRows());
  }, [checkedRowsReset]);

  const onReset = () => {
    dispatch(resetAddAssetInfo());
  };

  useEffect(() => {
    const payload = {
      rows: checkedRows,
    };
    setFieldValue('equipment_ids', checkedRows);
    dispatch(getCheckedRows(payload));
  }, [checkedRows]);

  useEffect(() => {
    if (viewId) {
      dispatch(getAssetDetail(viewId, appModels.EQUIPMENT, false));
    }
  }, [viewId]);

  useEffect(() => {
    if (equipmentFilters && equipmentFilters.customFilters) {
      setCustomFilters(equipmentFilters.customFilters);
    }
  }, [equipmentFilters]);

  useEffect(() => {
    if (userInfo && userInfo.data) {
      const customFiltersList = equipmentFilters.customFilters ? queryGeneratorWithUtc(equipmentFilters.customFilters, false, userInfo.data) : '';
      dispatch(getEquipmentCount(companies, appModels.EQUIPMENT, customFiltersList));
    }
  }, [userInfo, customFilters]);

  useEffect(() => {
    if (userInfo && userInfo.data) {
      const customFiltersList = equipmentFilters.customFilters ? queryGeneratorWithUtc(equipmentFilters.customFilters, false, userInfo.data) : '';
      dispatch(getEquipmentList(companies, appModels.EQUIPMENT, limit, offset, customFiltersList, sortBy, sortField, false));
    }
  }, [userInfo, offset, sortField, sortBy, customFilters]);

  const handleStatusCheckboxChange = (event) => {
    const { checked, value, name } = event.target;
    if (checked) {
      const filters = [{
        key: 'state', title: 'Status', value, label: name, type: 'inarray',
      }];
      const customFiltersList = [...customFilters, ...filters];
      dispatch(getEquipmentFilters(customFiltersList));
    } else {
      const customFiltersList = customFilters.filter((item) => item.value !== value);
      dispatch(getEquipmentFilters(customFiltersList));
    }
    setOffset(0);
    setPage(1);
  };

  const onCategorySearchChange = (e) => {
    if (e.target.value && e.target.value.length > 0) {
      const ndata = categoriesGroups.filter((item) => {
        const searchValue = item.category_id ? item.category_id[1].toString().toUpperCase() : '';
        const s = e.target.value.toString().toUpperCase();
        return (searchValue.search(s) !== -1);
      });
      setCategories(ndata);
    } else {
      setCategories(categoryGroupsInfo && categoryGroupsInfo.data ? categoryGroupsInfo.data : []);
    }
  };

  const handleCategoryChange = (event) => {
    const { checked, value, name } = event.target;
    if (checked) {
      const filters = [{
        key: 'category_id', title: 'Category', value: parseInt(value), label: name, type: 'inarray',
      }];
      const customFiltersList = [...customFilters, ...filters];
      dispatch(getEquipmentFilters(customFiltersList));
    } else {
      const customFiltersList = customFilters.filter((item) => parseInt(item.value) !== parseInt(value));
      dispatch(getEquipmentFilters(customFiltersList));
    }
    setOffset(0);
    setPage(1);
  };

  const totalDataCount = equipmentsCount && equipmentsCount.length ? equipmentsCount.length : 0;

  const pages = getPagesCountV2(totalDataCount, limit);

  const handlePageClick = (e, index) => {
    e.preventDefault();
    const offsetValue = (index - 1) * limit;
    setOffset(offsetValue);
    setPage(index);
    setIsAllChecked(false);
  };

  const handleCustomFilterClose = (value, key) => {
    setCustomFilters(customFilters.filter((item) => item.value !== value && item.key !== key));
    const customFiltersList = customFilters.filter((item) => item.value !== value && item.key !== key);
    dispatch(getEquipmentFilters(customFiltersList));
    setOffset(0);
    setPage(1);
  };

  const stateValuesList = (equipmentFilters && equipmentFilters.customFilters && equipmentFilters.customFilters.length > 0)
    ? equipmentFilters.customFilters.filter((item) => (item.type === 'inarray')) : [];

  const stateValues = getColumnArrayById(stateValuesList, 'value');

  const isUserError = userInfo && userInfo.err;
  const loading = (userInfo && userInfo.loading) || (equipmentsInfo && equipmentsInfo.loading) || (equipmentsCountLoading);
  const userErrorMsg = generateErrorMessage(userInfo);
  const errorMsg = (equipmentsInfo && equipmentsInfo.err) ? generateErrorMessage(equipmentsInfo) : userErrorMsg;

  return (
    <Row>
      <Col md="12" sm="12" lg={collapse ? 1 : 3} xs="12" className={collapse ? 'ml-2 pt-2 pl-2 pr-2 ' : 'pt-2 pl-2 pr-2'}>
        {collapse ? (
          <>
            <CollapseImg onCollapse={() => setCollapse(!collapse)} />
          </>
        ) : (
          <Card className="p-1 h-100 bg-lightblue side-filters-list" onMouseOver={() => setFilterIcon(true)} onMouseLeave={() => setFilterIcon(false)}>
            <CardTitleCustom filtersIcon={filtersIcon} onCollapse={() => setCollapse(!collapse)} />
            <CardBody className="ml-2 p-0 mt-2 position-relative side-filters-list thin-scrollbar">
              <CollapseItemCustom
                title="STATUS"
                data={assetsActions && assetsActions.states ? assetsActions.states : []}
                selectedValues={stateValues}
                onCollapse={() => setStatusCollapse(!statusCollapse)}
                isOpen={statusCollapse}
                onCheckboxChange={handleStatusCheckboxChange}
              />
              <CollapseItemDynamic
                title="CATEGORY"
                data={categoryGroupsInfo}
                selectedValues={stateValues}
                dataGroup={categoriesGroups}
                placeholder="Please search a category"
                filtervalue="category_id"
                onCollapse={() => setCategoryCollapse(!categoryCollapse)}
                isOpen={categoryCollapse}
                onCheckboxChange={handleCategoryChange}
                onSearchChange={onCategorySearchChange}
              />
            </CardBody>
          </Card>
        )}
      </Col>
      <Col md="12" sm="12" lg={collapse ? 11 : 9} xs="12" className={collapse ? 'list filter-margin-left-align pt-2 pr-2 pl-1' : 'list pl-1 pt-2 pr-2'}>
        <Card className="p-2 mb-2 h-100 bg-lightblue">
          <CardBody className="bg-color-white p-1 m-0">
            <Row className="p-2">
              <Col md="8" xs="12" sm="8" lg="8">
                <div className="content-inline">
                  <span className="p-0 mr-2 font-weight-800 font-medium">
                    Equipment List :
                    {totalDataCount}
                  </span>
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
                        <FontAwesomeIcon className="ml-2 cursor-pointer" onClick={() => handleCustomFilterClose(cf.value, cf.key)} size="sm" icon={faTimesCircle} />
                      </Badge>
                    </p>
                  ))}
                </div>
              </Col>
              <Col md="4" xs="12" sm="4" lg="4">
                <div className="float-right">
                  {allowedOperations.includes(actionCodes['Add an Asset']) && (
                  <>
                    <img
                      aria-hidden="true"
                      alt="Add"
                      src={plusCircleMiniIcon}
                      height="15"
                      id="Add"
                      className="cursor-pointer mr-2"
                      onClick={() => { showAddAssetModal(true); setCheckedRowsReset(Math.random()); }}
                      onMouseOver={() => toggle(3)}
                      onMouseLeave={() => setOpenValues([])}
                      onFocus={() => toggle(3)}
                    />
                    <Tooltip
                      placement="top"
                      isOpen={openValues.some((selectedValue) => selectedValue === 3)}
                      target="Add"
                    >
                      Add an Equipment
                    </Tooltip>
                  </>
                  )}
                  <img
                    aria-hidden="true"
                    id="DateFiltersPPM"
                    alt="DateFilters"
                    onClick={() => { showFilter(false); showDateFilter(!isDateFilter); }}
                    onMouseOver={() => toggle(1)}
                    onFocus={() => toggle(1)}
                    onMouseLeave={() => setOpenValues([])}
                    className="cursor-pointer mr-2"
                    src={calendarMiniIcon}
                  />
                  <Tooltip
                    placement="top"
                    isOpen={openValues.some((selectedValue) => selectedValue === 1)}
                    target="DateFiltersPPM"
                  >
                    Date Filters
                  </Tooltip>
                  <img
                    aria-hidden="true"
                    alt="Filters"
                    src={filterMiniIcon}
                    id="SearchFilters"
                    className="cursor-pointer mr-2"
                    onClick={() => { showFilter(!isFilter); }}
                    onMouseOver={() => toggle(6)}
                    onMouseLeave={() => setOpenValues([])}
                    onFocus={() => toggle(6)}
                  />
                  <Tooltip
                    placement="top"
                    isOpen={openValues.some((selectedValue) => selectedValue === 6)}
                    target="SearchFilters"
                  >
                    Search
                  </Tooltip>
                </div>
                <Popover placement="bottom" isOpen={isFilter} target="SearchFilters" className="modelPopover">
                  <PopoverHeader>
                    Search
                    <img
                      aria-hidden="true"
                      alt="close"
                      src={closeCircleIcon}
                      onClick={() => showFilter(false)}
                      className="cursor-pointer float-right"
                    />
                  </PopoverHeader>
                  <PopoverBody><Filters afterReset={() => showFilter(false)} /></PopoverBody>
                </Popover>
                <Popover placement="bottom" className="ppm_datefilter modelPopover" isOpen={isDateFilter} target="DateFiltersPPM">
                  <PopoverHeader>
                    Date Filters
                    <img
                      aria-hidden="true"
                      alt="close"
                      src={closeCircleIcon}
                      onClick={() => showDateFilter(false)}
                      className="cursor-pointer float-right"
                    />
                  </PopoverHeader>
                  <PopoverBody><DateFilters afterReset={() => showDateFilter(false)} /></PopoverBody>
                </Popover>
              </Col>
              <Modal size="xl" className="border-radius-50px" isOpen={addAssetModal}>
                <ModalHeader className="modal-justify-header">
                  <Row>
                    <Col sm="12" md="12" lg="12" xs="12">
                      <img
                        aria-hidden="true"
                        className="ml-2 mt-0 tab_nav_link cursor-pointer float-right"
                        onClick={() => { showAddAssetModal(false); onReset(); }}
                        alt="close"
                        width="17"
                        height="17"
                        src={closeCirclegreyIcon}
                      />
                      <Row>
                        <Col sm="8" md="8" lg="8" xs="12">
                          <h5 className="font-weight-800 mb-0">
                            <img
                              className="mr-2"
                              src={assetIcon}
                              width="20"
                              height="20"
                              alt="add_asset"
                            />
                            Add Asset
                          </h5>
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                </ModalHeader>
                <ModalBody className="mt-0 pt-0">
                  <AddEquipment
                    afterReset={() => { showAddAssetModal(false); onReset(); }}
                  />
                </ModalBody>
              </Modal>
            </Row>

            {(equipmentsInfo && equipmentsInfo.data) && (
            <span data-testid="success-case" />
            )}
            <div className="thin-scrollbar">
              {(equipmentsInfo && equipmentsInfo.data) && (

              <Table responsive>
                <thead className="bg-thin-ash">
                  <tr>
                    <th className="p-2">
                      <div className="checkbox ml-1">
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
                    <th className="min-width-160 p-2">
                      <span aria-hidden="true" className="sort-by cursor-pointer" onClick={() => { setSortField('name'); setSortBy(sortBy === 'ASC' ? 'DESC' : 'ASC'); }}>
                        Equipment Name
                      </span>
                    </th>
                    <th className="min-width-200 p-2">
                      <span aria-hidden="true" className="sort-by cursor-pointer" onClick={() => { setSortField('equipment_seq'); setSortBy(sortBy === 'ASC' ? 'DESC' : 'ASC'); }}>
                        Equipment Number
                      </span>
                    </th>
                    <th className="min-width-160 p-2">
                      <span aria-hidden="true" className="sort-by cursor-pointer" onClick={() => { setSortField('category_id'); setSortBy(sortBy === 'ASC' ? 'DESC' : 'ASC'); }}>
                        Category
                      </span>
                    </th>
                    <th className="min-width-100 p-2">
                      <span aria-hidden="true" className="sort-by cursor-pointer" onClick={() => { setSortField('location_id'); setSortBy(sortBy === 'ASC' ? 'DESC' : 'ASC'); }}>
                        Space
                      </span>
                    </th>
                    <th className="min-width-100 p-2">
                      <span aria-hidden="true" className="sort-by cursor-pointer" onClick={() => { setSortField('state'); setSortBy(sortBy === 'ASC' ? 'DESC' : 'ASC'); }}>
                        Status
                      </span>
                    </th>
                    <th className="min-width-160 p-2">
                      <span aria-hidden="true" className="sort-by cursor-pointer" onClick={() => { setSortField('warranty_end_date'); setSortBy(sortBy === 'ASC' ? 'DESC' : 'ASC'); }}>
                        Warranty End
                      </span>
                    </th>
                    <th className="min-width-160 p-2">
                      <span aria-hidden="true" className="sort-by cursor-pointer" onClick={() => { setSortField('equipment_number'); setSortBy(sortBy === 'ASC' ? 'DESC' : 'ASC'); }}>
                        Description
                      </span>
                    </th>
                    <th className="min-width-160 p-2">
                      <span aria-hidden="true" className="sort-by cursor-pointer" onClick={() => { setSortField('company_id'); setSortBy(sortBy === 'ASC' ? 'DESC' : 'ASC'); }}>
                        Company
                      </span>
                    </th>
                  </tr>
                </thead>
                <tbody>

                  {equipmentsInfo.data.map((equipment, index) => (

                    <tr key={equipment.id}>
                      <td className="w-5">
                        <div className="checkbox">
                          <Input
                            type="checkbox"
                            value={equipment.id}
                            id={`checkboxtk${index}`}
                            className="ml-0"
                            name={equipment.name}
                            checked={checkedRows.some((selectedValue) => parseInt(selectedValue) === parseInt(equipment.id))}
                            onChange={handleTableCellChange}
                          />
                          <Label htmlFor={`checkboxtk${index}`} />
                        </div>
                      </td>
                      <td
                        aria-hidden="true"
                        className="w-20"
                      >
                        <span className="font-weight-400">{equipment.name}</span>
                      </td>
                      <td className="w-15"><span className="font-weight-400 d-inline-block">{equipment.equipment_seq ? equipment.equipment_seq : ''}</span></td>
                      <td className="w-15"><span className="font-weight-400 d-inline-block">{equipment.category_id ? equipment.category_id[1] : ''}</span></td>
                      <td className="w-25"><span className="font-weight-400 d-inline-block">{equipment.location_id ? equipment.location_id[1] : ''}</span></td>
                      <td className="w-15">{getEquipmentStateLabel(equipment.state)}</td>
                      <td className="w-15">{getLocalDate(equipment.warranty_end_date)}</td>
                      <td className="w-15">{equipment.equipment_number}</td>
                      <td><span className="font-weight-400 d-inline-block">{equipment.company_id ? equipment.company_id[1] : ''}</span></td>
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
              {loading && (
              <div className="mb-2 mt-3 p-5" data-testid="loading-case">
                <Loader />
              </div>
              )}

              {((equipmentsInfo && equipmentsInfo.err) || isUserError) && (

              <ErrorContent errorTxt={errorMsg} />

              )}
            </div>
          </CardBody>
        </Card>
      </Col>
    </Row>
  );
};

Equipments.propTypes = {
  setFieldValue: PropTypes.oneOfType([PropTypes.func, PropTypes.string]).isRequired,
};

export default Equipments;
