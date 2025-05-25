/* eslint-disable import/no-unresolved */
/* eslint-disable radix */
import React, { useState, useEffect } from 'react';
import * as PropTypes from 'prop-types';
import {
  Collapse, Card, CardBody, CardTitle, Col, Input, Label, FormGroup, Row,
} from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faChevronDown, faChevronUp,
} from '@fortawesome/free-solid-svg-icons';
import { useSelector, useDispatch } from 'react-redux';

import Loader from '@shared/loading';
import ErrorContent from '@shared/errorContent';
import {
  getEquipmentList, getEquipmentCount, getCategoryGroups, getEquipmentFilters,
} from '../../assets/equipmentService';
import {
  getColumnArrayById, queryGenerator, generateErrorMessage, queryGeneratorWithUtc,
} from '../../util/appUtils';
import assetActionData from '../../assets/data/assetsActions.json';

const appModels = require('../../util/appModels').default;

const SideFilters = (props) => {
  const {
    offset, id, category, statusValue, afterReset,
    sortBy, sortField, columns,
  } = props;
  const dispatch = useDispatch();
  const limit = 10;
  const [checkValues, setCheckValues] = useState([]);
  const [checkItems, setCheckItems] = useState([]);
  const [offsetValue, setOffsetValue] = useState(offset);
  const [sortByValue, setSortByValue] = useState(sortBy);
  const [fields] = useState(columns);
  const [sortFieldValue, setSortFieldValue] = useState(sortField);
  const [checkCategoryValues, setCheckCategoryValues] = useState([]);
  const [checkCategoryItems, setCheckCategoryItems] = useState([]);
  const [statusCollapse, setStatusCollapse] = useState(true);
  const [categoryCollapse, setCategoryCollapse] = useState(false);
  const [categoriesGroups, setCategories] = useState([]);
  const [customFiltersList, setCustomFilters] = useState([]);
  const [assetsList, setAssets] = useState([]);

  const { userInfo } = useSelector((state) => state.user);
  const {
    equipmentsInfo, categoryGroupsInfo, equipmentFilters,
  } = useSelector((state) => state.equipment);

  useEffect(() => {
    setOffsetValue(offset);
    setSortByValue(sortBy);
    setSortFieldValue(sortField);
  }, [offset, sortBy, sortField]);

  useEffect(() => {
    if (!id) {
      setAssets([]);
    }
  }, [id]);

  useEffect(() => {
    if (statusValue && statusValue !== 0) {
      setCheckItems(checkItems.filter((item) => item.id !== statusValue));
    }
    if (category && category !== 0) {
      setCheckCategoryItems(checkCategoryItems.filter((item) => item.id !== category));
    }
  }, [statusValue, category]);

  useEffect(() => {
    if (equipmentFilters && equipmentFilters.customFilters) {
      setCustomFilters(equipmentFilters.customFilters);
    }
  }, [equipmentFilters]);

  useEffect(() => {
    const vendors = [];
    dispatch(getEquipmentFilters(checkItems, checkCategoryItems, vendors, customFiltersList));
  }, [checkItems, checkCategoryItems]);

  useEffect(() => {
    if (categoryGroupsInfo && categoryGroupsInfo.data) {
      setCategories(categoryGroupsInfo.data);
    }
  }, [categoryGroupsInfo]);

  useEffect(() => {
    let statusValues = [];
    let categories = [];
    let filterList = [];
    if (checkItems && checkItems.length > 0) {
      statusValues = checkItems;
    } else if (equipmentFilters && equipmentFilters.statuses) {
      statusValues = equipmentFilters.statuses;
      setStatusCollapse(true);
    }

    if (checkCategoryItems && checkCategoryItems.length > 0) {
      categories = checkCategoryItems;
    } else if (equipmentFilters && equipmentFilters.categories) {
      categories = equipmentFilters.categories;
    }

    if (customFiltersList && customFiltersList.length > 0) {
      filterList = customFiltersList;
    } else if (equipmentFilters && equipmentFilters.customFilters) {
      filterList = equipmentFilters.customFilters;
    }
    const vendors = [];
    dispatch(getEquipmentFilters(statusValues, categories, vendors, filterList));
  }, []);

  useEffect(() => {
    if (userInfo && userInfo.data && (equipmentFilters && (equipmentFilters.statuses || equipmentFilters.categories || equipmentFilters.customFilters))) {
      const statusValues = equipmentFilters.statuses ? getColumnArrayById(equipmentFilters.statuses, 'id') : [];
      const categories = equipmentFilters.categories ? getColumnArrayById(equipmentFilters.categories, 'id') : [];
      const customFilters = equipmentFilters.customFilters ? queryGeneratorWithUtc(equipmentFilters.customFilters, false,userInfo.data) : '';
      dispatch(getEquipmentCount(userInfo.data.company.id, appModels.EQUIPMENT, statusValues, categories, false, customFilters));
    }
  }, [userInfo, equipmentFilters]);

  useEffect(() => {
    if (userInfo && userInfo.data && (equipmentFilters && (equipmentFilters.statuses || equipmentFilters.categories || equipmentFilters.customFilters))) {
      const statusValues = equipmentFilters.statuses ? getColumnArrayById(equipmentFilters.statuses, 'id') : [];
      const categories = equipmentFilters.categories ? getColumnArrayById(equipmentFilters.categories, 'id') : [];
      const customFilters = equipmentFilters.customFilters ? queryGeneratorWithUtc(equipmentFilters.customFilters,false, userInfo.data) : '';
      dispatch(getEquipmentList(userInfo.data.company.id, appModels.EQUIPMENT, limit, offsetValue, fields, statusValues, categories, false, customFilters, sortByValue, sortFieldValue));
    }
  }, [userInfo, offsetValue, sortByValue, sortFieldValue, fields, equipmentFilters]);

  useEffect(() => {
    if (userInfo && userInfo.data && categoryCollapse) {
      dispatch(getCategoryGroups(userInfo.data.company.id, appModels.EQUIPMENT));
      setStatusCollapse(false);
    }
  }, [userInfo, categoryCollapse]);

  useEffect(() => {
    if (statusCollapse) {
      setCategoryCollapse(false);
    }
  }, [statusCollapse]);

  useEffect(() => {
    if (equipmentsInfo && equipmentsInfo.data && id) {
      const arr = [...assetsList, ...equipmentsInfo.data];
      setAssets([...new Map(arr.map((item) => [item.id, item])).values()]);
    }
  }, [equipmentsInfo, id]);

  const handleCheckboxChange = (event) => {
    const { checked, value, name } = event.target;
    const values = { id: value, label: name };
    if (checked) {
      setCheckValues((state) => [...state, value]);
      setCheckItems((state) => [...state, values]);
    } else {
      setCheckValues(checkValues.filter((item) => item !== value));
      setCheckItems(checkItems.filter((item) => item.id !== value));
    }
    setOffsetValue(0);
    if (afterReset) afterReset();
    setAssets([]);
  };

  const handleCategoryCheckboxChange = (event) => {
    const { checked, value, name } = event.target;
    const values = { id: value, label: name };
    if (checked) {
      setCheckCategoryValues((state) => [...state, value]);
      setCheckCategoryItems((state) => [...state, values]);
    } else {
      setCheckCategoryValues(checkCategoryValues.filter((item) => item !== value));
      setCheckCategoryItems(checkCategoryItems.filter((item) => item.id !== value));
    }
    setOffsetValue(0);
    if (afterReset) afterReset();
    setAssets([]);
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

  const handleResetClick = (e) => {
    e.preventDefault();
    setCheckValues([]);
    setCheckCategoryValues([]);
    setCheckCategoryItems([]);
    setCheckItems([]);
    setCustomFilters([]);
    setOffsetValue(0);
    if (afterReset) afterReset();
    setAssets([]);
  };

  const isUserError = userInfo && userInfo.err;
  const isUserLoading = userInfo && userInfo.loading;
  const userErrorMsg = generateErrorMessage(userInfo);
  const errorMsg = (categoryGroupsInfo && categoryGroupsInfo.err) ? generateErrorMessage(categoryGroupsInfo) : userErrorMsg;

  const statusValues = equipmentFilters && equipmentFilters.statuses ? getColumnArrayById(equipmentFilters.statuses, 'id') : [];
  const categories = equipmentFilters && equipmentFilters.categories ? getColumnArrayById(equipmentFilters.categories, 'id') : [];

  return (

    <Card className="p-1 bg-lightblue h-100 side-filters-list">
      <CardTitle className="mt-2 ml-2 mb-1 mr-2">
        <h4>
          Filters
        </h4>
      </CardTitle>
      <hr className="m-0 border-color-grey ml-2px" />
      <CardBody className="pl-1 p-0 mt-2 position-relative side-filters-list thin-scrollbar">
        <Row className="m-0">
          <Col md="8" xs="8" sm="8" lg="8" className="p-0">
            <p className="m-0 font-weight-800 collapse-heading">BY  STATUS</p>
          </Col>
          <Col md="4" xs="4" sm="4" lg="4" className="text-right p-0">
            <FontAwesomeIcon className="mr-2 cursor-pointer" onClick={() => setStatusCollapse(!statusCollapse)} size="sm" icon={statusCollapse ? faChevronUp : faChevronDown} />
          </Col>
        </Row>
        <Collapse isOpen={statusCollapse}>
          <div>
            {assetActionData.states.map((item, index) => (
              <span className="mb-1 d-block font-weight-500" key={item.value}>
                <div className="checkbox">
                  <Input
                    type="checkbox"
                    id={`checkboxasaction${index}`}
                    name={item.label}
                    value={item.value}
                    checked={statusValues.some((selectedValue) => selectedValue === item.value)}
                    onChange={handleCheckboxChange}
                  />
                  <Label htmlFor={`checkboxasaction${index}`}>
                    <span>{item.label}</span>
                  </Label>
                  {' '}
                </div>
              </span>
            ))}
          </div>
        </Collapse>
        <hr className="mt-2" />
        <Row className="m-0">
          <Col md="8" xs="8" sm="8" lg="8" className="p-0">
            <p className="m-0 font-weight-800 collapse-heading">BY  CATEGORY</p>
          </Col>
          <Col md="4" xs="4" sm="4" lg="4" className="text-right p-0">
            <FontAwesomeIcon className="mr-2 cursor-pointer" onClick={() => setCategoryCollapse(!categoryCollapse)} size="sm" icon={categoryCollapse ? faChevronUp : faChevronDown} />
          </Col>
        </Row>
        <Collapse isOpen={categoryCollapse}>
          {(categoryGroupsInfo && categoryGroupsInfo.data && categoryGroupsInfo.data.length > 10) && (
            <FormGroup className="mt-2 mb-2">
              <Input type="input" name="categorySearchValue" placeholder="Please search a category" onChange={onCategorySearchChange} id="categorySearchValue" className="border-radius-50px" />
            </FormGroup>
          )}
          <div>
            {((categoryGroupsInfo && categoryGroupsInfo.loading) || isUserLoading) && (
              <div className="p-5">
                <Loader />
              </div>
            )}
            {categoriesGroups && categoriesGroups.map((categoryItem, index) => (
              categoryItem.category_id && (
                <span className="mb-1 d-block font-weight-500" key={categoryItem.category_id}>
                  <div className="checkbox">
                    <Input
                      type="checkbox"
                      id={`checkboxcgroup${index}`}
                      value={categoryItem.category_id[0]}
                      name={categoryItem.category_id[1]}
                      checked={categories.some((selectedValue) => parseInt(selectedValue) === parseInt(categoryItem.category_id[0]))}
                      onChange={handleCategoryCheckboxChange}
                    />
                    {' '}
                    <Label htmlFor={`checkboxcgroup${index}`}><span>{categoryItem.category_id[1]}</span></Label>
                  </div>
                </span>
              )
            ))}
            {((categoryGroupsInfo && categoryGroupsInfo.err) || isUserError) && (
              <ErrorContent errorTxt={errorMsg} />
            )}
          </div>
        </Collapse>
        <hr className="mt-2" />
        {((statusValues && statusValues.length > 0) || (categories && categories.length > 0) || (customFiltersList && customFiltersList.length > 0)) && (
          <div aria-hidden="true" className="float-right cursor-pointer mb-4 mr-2 text-info font-weight-800" onClick={handleResetClick} onKeyDown={handleResetClick}>Reset Filters</div>
        )}
      </CardBody>
    </Card>

  );
};

SideFilters.propTypes = {
  offset: PropTypes.number.isRequired,
  id: PropTypes.number.isRequired,
  category: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string,
  ]).isRequired,
  statusValue: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string,
  ]).isRequired,
  afterReset: PropTypes.func.isRequired,
  sortBy: PropTypes.string.isRequired,
  sortField: PropTypes.string.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  columns: PropTypes.array.isRequired,
};

export default SideFilters;
