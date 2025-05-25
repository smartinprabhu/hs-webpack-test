/* eslint-disable react/no-array-index-key */
/* eslint-disable import/no-unresolved */
/* eslint-disable radix */
import React, { useState, useEffect } from 'react';
import * as PropTypes from 'prop-types';
import {
  Collapse, Card, CardBody, CardTitle, Col, Input, Label, FormGroup, Row, UncontrolledTooltip,
} from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faChevronDown, faChevronUp,
} from '@fortawesome/free-solid-svg-icons';
import { useSelector, useDispatch } from 'react-redux';

import Loader from '@shared/loading';
import ErrorContent from '@shared/errorContent';
import collapseIcon from '@images/collapse.png';
import {
  getEquipmentList, getEquipmentCount, getCategoryGroups, getEquipmentFilters, getVendorGroups,
} from '../equipmentService';
import {
  getColumnArrayById, queryGenerator, generateErrorMessage,
  getAllCompanies, queryGeneratorWithUtc,
} from '../../util/appUtils';
import assetActionData from '../data/assetsActions.json';

const appModels = require('../../util/appModels').default;

const SideFilters = (props) => {
  const {
    offset, id, category, statusValue, vendorValue, tagStatusValue, partnerValue, afterReset,
    sortBy, sortField, columns, setCollapse, collapse,
  } = props;
  const dispatch = useDispatch();
  const limit = 10;
  const [checkValues, setCheckValues] = useState([]);
  const [checkItems, setCheckItems] = useState([]);
  const [offsetValue, setOffsetValue] = useState(offset);
  const [sortByValue, setSortByValue] = useState(sortBy);
  const [statusRemovedValue, setStatusRemovedValue] = useState(statusValue);
  const [categoryRemovedValue, setCategoryRemovedValue] = useState(category);
  const [vendorRemovedValue, setVendorRemovedValue] = useState(vendorValue);
  const [tagStatusRemovedValue, setTagStatusRemovedValue] = useState(tagStatusValue);
  const [partnerRemovedValue, setPartnerRemovedValue] = useState(partnerValue);
  const [fields, setFields] = useState(columns);
  const [sortFieldValue, setSortFieldValue] = useState(sortField);
  const [checkCategoryValues, setCheckCategoryValues] = useState([]);
  const [checkCategoryItems, setCheckCategoryItems] = useState([]);
  const [checkVendorValues, setCheckVendorValues] = useState([]);
  const [checkVendorItems, setCheckVendorItems] = useState([]);
  const [statusCollapse, setStatusCollapse] = useState(true);
  const [categoryCollapse, setCategoryCollapse] = useState(false);
  const [vendorCollapse, setVendorCollapse] = useState(false);
  const [partnerCollapse, setPartnerCollapse] = useState(false);
  const [tagStatusCollapse, setTagStatusCollapse] = useState(false);
  const [checkTagStatusValues, setCheckTagStatusValues] = useState([]);
  const [checkTagStatusItems, setCheckTagStatusItems] = useState([]);
  const [categoriesGroups, setCategories] = useState([]);
  const [vendorGroups, setVendors] = useState([]);
  const [customFiltersList, setCustomFilters] = useState([]);
  const [assetsList, setAssets] = useState([]);
  const [filtersIcon, setFilterIcon] = useState(false);

  const [checkPartnerValues, setCheckPartnerValues] = useState([]);
  const [checkPartnerItems, setCheckPartnerItems] = useState([]);

  const { userInfo, userRoles } = useSelector((state) => state.user);
  const companies = getAllCompanies(userInfo, userRoles);

  const {
    equipmentsInfo, categoryGroupsInfo, equipmentFilters, moveAssetInfo, stateChangeInfo, createBreakdownInfo, updateEquipment, operativeInfo, vendorGroupsInfo,
    addAssetInfo,
  } = useSelector((state) => state.equipment);

  useEffect(() => {
    setStatusRemovedValue(statusValue);
  }, [statusValue]);

  useEffect(() => {
    setCategoryRemovedValue(category);
  }, [category]);

  useEffect(() => {
    setVendorRemovedValue(vendorValue);
  }, [vendorValue]);

  useEffect(() => {
    setTagStatusRemovedValue(tagStatusValue);
  }, [tagStatusValue]);

  useEffect(() => {
    setPartnerRemovedValue(partnerValue);
  }, [partnerValue]);

  useEffect(() => {
    setOffsetValue(offset);
    setSortByValue(sortBy);
    setSortFieldValue(sortField);
    setFields(columns);
  }, [offset, sortBy, sortField, columns]);

  useEffect(() => {
    if (!id) {
      setAssets([]);
    }
  }, [id]);

  useEffect(() => {
    if (statusRemovedValue && statusRemovedValue !== 0) {
      setCheckItems(checkItems.filter((item) => item.id !== statusRemovedValue));
      if (checkItems.filter((item) => item.id !== statusRemovedValue) && checkItems.filter((item) => item.id !== statusRemovedValue).length === 0) {
        dispatch(getEquipmentFilters(checkItems.filter((item) => item.id !== statusRemovedValue), checkCategoryItems, checkVendorItems, customFiltersList, checkTagStatusItems, checkPartnerItems));
      }
    }
  }, [statusRemovedValue]);

  useEffect(() => {
    if (categoryRemovedValue && categoryRemovedValue !== 0) {
      setCheckCategoryItems(checkCategoryItems.filter((item) => item.id !== categoryRemovedValue));
      if (checkCategoryItems.filter((item) => item.id !== categoryRemovedValue) && checkCategoryItems.filter((item) => item.id !== categoryRemovedValue).length === 0) {
        dispatch(getEquipmentFilters(checkItems, checkCategoryItems.filter((item) => item.id !== categoryRemovedValue), checkVendorItems, customFiltersList, checkTagStatusItems, checkPartnerItems));
      }
    }
  }, [categoryRemovedValue]);

  useEffect(() => {
    if (vendorRemovedValue && vendorRemovedValue !== 0) {
      setCheckVendorItems(checkVendorItems.filter((item) => item.id !== vendorRemovedValue));
      if (checkVendorItems.filter((item) => item.id !== vendorRemovedValue) && checkVendorItems.filter((item) => item.id !== vendorRemovedValue).length === 0) {
        dispatch(getEquipmentFilters(checkItems, checkCategoryItems, checkVendorItems.filter((item) => item.id !== vendorRemovedValue), customFiltersList, checkTagStatusItems));
      }
    }
  }, [vendorRemovedValue]);

  useEffect(() => {
    if (tagStatusRemovedValue && tagStatusRemovedValue !== 0) {
      setCheckTagStatusItems(checkTagStatusItems.filter((item) => item.id !== tagStatusRemovedValue));
      if (checkTagStatusItems.filter((item) => item.id !== tagStatusRemovedValue) && checkTagStatusItems.filter((item) => item.id !== tagStatusRemovedValue).length === 0) {
        dispatch(getEquipmentFilters(checkItems, checkCategoryItems, checkVendorItems, customFiltersList, checkTagStatusItems.filter((item) => item.id !== tagStatusRemovedValue), checkPartnerItems));
      }
    }
  }, [tagStatusRemovedValue]);

  useEffect(() => {
    if (partnerRemovedValue && partnerRemovedValue !== 0) {
      setCheckPartnerItems(checkPartnerItems.filter((item) => item.id !== partnerRemovedValue));
      if (checkPartnerItems.filter((item) => item.id !== partnerRemovedValue) && checkPartnerItems.filter((item) => item.id !== partnerRemovedValue).length === 0) {
        dispatch(getEquipmentFilters(checkItems, checkCategoryItems, checkVendorItems, customFiltersList, checkTagStatusItems, checkPartnerItems.filter((item) => item.id !== partnerRemovedValue)));
      }
    }
  }, [partnerRemovedValue]);

  useEffect(() => {
    if (equipmentFilters && equipmentFilters.customFilters) {
      setCustomFilters(equipmentFilters.customFilters);
    }
  }, [equipmentFilters]);

  useEffect(() => {
    if ((checkItems && checkItems.length > 0)
      || (checkCategoryItems && checkCategoryItems.length > 0) || (checkVendorItems && checkVendorItems.length > 0)
      || (checkTagStatusItems && checkTagStatusItems.length > 0) || (checkPartnerItems && checkPartnerItems.length > 0)) {
      dispatch(getEquipmentFilters(checkItems, checkCategoryItems, checkVendorItems, customFiltersList, checkTagStatusItems, checkPartnerItems));
    }
  }, [checkItems, checkCategoryItems, checkVendorItems, checkTagStatusItems, checkPartnerItems]);

  useEffect(() => {
    if (categoryGroupsInfo && categoryGroupsInfo.data) {
      setCategories(categoryGroupsInfo.data);
    }
  }, [categoryGroupsInfo]);

  useEffect(() => {
    if (vendorGroupsInfo && vendorGroupsInfo.data) {
      setVendors(vendorGroupsInfo.data);
    }
  }, [vendorGroupsInfo]);

  useEffect(() => {
    let statusValues = [];
    let categories = [];
    let vendors = [];
    let tagStatus = [];
    let filterList = [];
    let partners = [];
    let callFilter = true;
    if (checkItems && checkItems.length > 0) {
      statusValues = checkItems;
    } else if (equipmentFilters && equipmentFilters.statuses && equipmentFilters.statuses.length > 0) {
      statusValues = equipmentFilters.statuses;
      setCheckItems(equipmentFilters.statuses);
      callFilter = false;
      setStatusCollapse(true);
    }

    if (checkCategoryItems && checkCategoryItems.length > 0) {
      categories = checkCategoryItems;
    } else if (equipmentFilters && equipmentFilters.categories && equipmentFilters.categories.length > 0) {
      setCheckCategoryItems(equipmentFilters.categories);
      callFilter = false;
      categories = equipmentFilters.categories;
    }

    if (checkVendorItems && checkVendorItems.length > 0) {
      vendors = checkVendorItems;
    } else if (equipmentFilters && equipmentFilters.vendors && equipmentFilters.vendors.length > 0) {
      setCheckVendorItems(equipmentFilters.vendors);
      callFilter = false;
      vendors = equipmentFilters.vendors;
    }

    if (checkTagStatusItems && checkTagStatusItems.length > 0) {
      tagStatus = checkTagStatusItems;
    } else if (equipmentFilters && equipmentFilters.tagStatus && equipmentFilters.tagStatus.length > 0) {
      tagStatus = equipmentFilters.tagStatus;
      setCheckTagStatusItems(equipmentFilters.tagStatus);
      callFilter = false;
      setTagStatusCollapse(true);
    }

    if (checkPartnerItems && checkPartnerItems.length > 0) {
      partners = checkPartnerItems;
    } else if (equipmentFilters && equipmentFilters.partners && equipmentFilters.partners.length > 0) {
      partners = equipmentFilters.partners;
      setCheckTagStatusItems(equipmentFilters.partners);
      callFilter = false;
      setPartnerCollapse(true);
    }

    if (customFiltersList && customFiltersList.length > 0) {
      filterList = customFiltersList;
    } else if (equipmentFilters && equipmentFilters.customFilters) {
      filterList = equipmentFilters.customFilters;
    }
    if (callFilter) {
      dispatch(getEquipmentFilters(statusValues, categories, vendors, filterList, tagStatus, partners));
    }
  }, []);

  useEffect(() => {
    if (userInfo && userInfo.data && (equipmentFilters && (equipmentFilters.statuses || equipmentFilters.categories || equipmentFilters.vendors || equipmentFilters.customFilters))) {
      const statusValues = equipmentFilters.statuses ? getColumnArrayById(equipmentFilters.statuses, 'id') : [];
      const categories = equipmentFilters.categories ? getColumnArrayById(equipmentFilters.categories, 'id') : [];
      const vendors = equipmentFilters.vendors ? getColumnArrayById(equipmentFilters.vendors, 'id') : [];
      const tagStatusValues = equipmentFilters.tagStatus ? getColumnArrayById(equipmentFilters.tagStatus, 'id') : [];
      const partnerFilters = equipmentFilters.partners ? getColumnArrayById(equipmentFilters.partners, 'id') : [];
      const customFilters = equipmentFilters.customFilters ? queryGeneratorWithUtc(equipmentFilters.customFilters, false, userInfo.data) : '';
      dispatch(getEquipmentCount(companies, appModels.EQUIPMENT, statusValues, categories, vendors, customFilters, tagStatusValues, partnerFilters));
    }
  }, [userInfo, equipmentFilters]);

  useEffect(() => {
    if (userInfo && userInfo.data && (equipmentFilters && (equipmentFilters.statuses || equipmentFilters.categories || equipmentFilters.vendors || equipmentFilters.customFilters
      || (moveAssetInfo && moveAssetInfo.data) || (stateChangeInfo && stateChangeInfo.data)))) {
      const statusValues = equipmentFilters.statuses ? getColumnArrayById(equipmentFilters.statuses, 'id') : [];
      const categories = equipmentFilters.categories ? getColumnArrayById(equipmentFilters.categories, 'id') : [];
      const vendors = equipmentFilters.vendors ? getColumnArrayById(equipmentFilters.vendors, 'id') : [];
      const tagStatusValues = equipmentFilters.tagStatus ? getColumnArrayById(equipmentFilters.tagStatus, 'id') : [];
      const partnerFilters = equipmentFilters.partners ? getColumnArrayById(equipmentFilters.partners, 'id') : [];
      const customFilters = equipmentFilters.customFilters ? queryGeneratorWithUtc(equipmentFilters.customFilters, false, userInfo.data) : '';
      dispatch(
        getEquipmentList(
          companies, appModels.EQUIPMENT, limit, offsetValue, fields, statusValues, categories, vendors, customFilters, sortByValue, sortFieldValue, false, tagStatusValues, partnerFilters,
        ),
      );
    }
  }, [userInfo, offsetValue, sortByValue, sortFieldValue, fields, equipmentFilters, moveAssetInfo, stateChangeInfo, createBreakdownInfo, updateEquipment, operativeInfo]);

  useEffect(() => {
    if (userInfo && userInfo.data && categoryCollapse) {
      dispatch(getCategoryGroups(companies, appModels.EQUIPMENT));
    }
  }, [userInfo, categoryCollapse]);

  useEffect(() => {
    if (partnerCollapse) {
      setVendorCollapse(false);
    }
  }, [partnerCollapse]);

  useEffect(() => {
    if (vendorCollapse) {
      setPartnerCollapse(false);
    }
  }, [vendorCollapse]);

  useEffect(() => {
    if (updateEquipment && updateEquipment.data) {
      setVendorCollapse(true);
      setPartnerCollapse(false);
      dispatch(getVendorGroups(companies, appModels.EQUIPMENT, 'vendor_id'));
      dispatch(getVendorGroups(companies, appModels.EQUIPMENT, 'manufacturer_id'));
    }
  }, [userInfo, updateEquipment]);

  useEffect(() => {
    if ((userInfo && userInfo.data && (vendorCollapse)) || (updateEquipment && updateEquipment.data)) {
      dispatch(getVendorGroups(companies, appModels.EQUIPMENT, 'vendor_id'));
    }
    if ((userInfo && userInfo.data && (partnerCollapse)) || (updateEquipment && updateEquipment.data)) {
      dispatch(getVendorGroups(companies, appModels.EQUIPMENT, 'manufacturer_id'));
    }
  }, [userInfo, vendorCollapse, partnerCollapse, updateEquipment]);

  useEffect(() => {
    if (userInfo && userInfo.data && ((addAssetInfo && addAssetInfo.data) || (updateEquipment && updateEquipment.data))) {
      dispatch(getVendorGroups(companies, appModels.EQUIPMENT, 'vendor_id'));
    }
    if (userInfo && userInfo.data && (partnerCollapse)) {
      dispatch(getVendorGroups(companies, appModels.EQUIPMENT, 'manufacturer_id'));
    }
  }, [userInfo, addAssetInfo, updateEquipment]);

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
      if (checkItems.filter((item) => item.id !== value) && checkItems.filter((item) => item.id !== value).length === 0) {
        dispatch(getEquipmentFilters(checkItems.filter((item) => item.id !== value), checkCategoryItems, checkVendorItems, customFiltersList, checkTagStatusItems, checkPartnerItems));
      }
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
      if (checkCategoryItems.filter((item) => item.id !== value) && checkCategoryItems.filter((item) => item.id !== value).length === 0) {
        dispatch(getEquipmentFilters(checkItems, checkCategoryItems.filter((item) => item.id !== value), checkVendorItems, customFiltersList, checkTagStatusItems, checkPartnerItems));
      }
    }
    setOffsetValue(0);
    if (afterReset) afterReset();
    setAssets([]);
  };

  const handleVendorCheckboxChange = (event) => {
    const { checked, value, name } = event.target;
    const values = { id: value, label: name };
    if (checked) {
      setCheckVendorValues((state) => [...state, value]);
      setCheckVendorItems((state) => [...state, values]);
    } else {
      setCheckVendorValues(checkVendorValues.filter((item) => item !== value));
      setCheckVendorItems(checkVendorItems.filter((item) => item.id !== value));
      if (checkVendorItems.filter((item) => item.id !== value) && checkVendorItems.filter((item) => item.id !== value).length === 0) {
        dispatch(getEquipmentFilters(checkItems, checkCategoryItems, checkVendorItems.filter((item) => item.id !== value), customFiltersList, checkTagStatusItems, checkPartnerItems));
      }
    }
    setOffsetValue(0);
    if (afterReset) afterReset();
    setAssets([]);
  };

  const handlePartnerCheckboxChange = (event) => {
    const { checked, value, name } = event.target;
    const values = { id: value, label: name };
    if (checked) {
      setCheckPartnerValues((state) => [...state, value]);
      setCheckPartnerItems((state) => [...state, values]);
    } else {
      setCheckPartnerValues(checkPartnerValues.filter((item) => item !== value));
      setCheckPartnerItems(checkPartnerItems.filter((item) => item.id !== value));
      if (checkPartnerItems.filter((item) => item.id !== value) && checkPartnerItems.filter((item) => item.id !== value).length === 0) {
        dispatch(getEquipmentFilters(checkItems, checkCategoryItems, checkVendorItems, customFiltersList, checkTagStatusItems, checkPartnerItems));
      }
    }
    setOffsetValue(0);
    if (afterReset) afterReset();
    setAssets([]);
  };

  const handleTagStatusCheckboxChange = (event) => {
    const { checked, value, name } = event.target;
    const values = { id: value, label: name };
    if (checked) {
      setCheckTagStatusValues((state) => [...state, value]);
      setCheckTagStatusItems((state) => [...state, values]);
    } else {
      setCheckTagStatusValues(checkTagStatusValues.filter((item) => item !== value));
      setCheckTagStatusItems(checkTagStatusItems.filter((item) => item.id !== value));
      if (checkTagStatusItems.filter((item) => item.id !== value) && checkItems.filter((item) => item.id !== value).length === 0) {
        dispatch(getEquipmentFilters(checkItems, checkCategoryItems, checkVendorItems, customFiltersList, checkTagStatusItems.filter((item) => item.id !== value), checkPartnerItems));
      }
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

  const onVendorSearchChange = (e) => {
    if (e.target.value && e.target.value.length > 0) {
      const ndata = vendorGroups.filter((item) => {
        const searchValue = item.vendor_id ? item.vendor_id[1].toString().toUpperCase() : '';
        const s = e.target.value.toString().toUpperCase();
        return (searchValue.search(s) !== -1);
      });
      setVendors(ndata);
    } else {
      setVendors(vendorGroupsInfo && vendorGroupsInfo.data ? vendorGroupsInfo.data : []);
    }
  };

  const onPartnerSearchChange = (e) => {
    if (e.target.value && e.target.value.length > 0) {
      const ndata = vendorGroups.filter((item) => {
        const searchValue = item.manufacturer_id ? item.manufacturer_id[1].toString().toUpperCase() : '';
        const s = e.target.value.toString().toUpperCase();
        return (searchValue.search(s) !== -1);
      });
      setVendors(ndata);
    } else {
      setVendors(vendorGroupsInfo && vendorGroupsInfo.data ? vendorGroupsInfo.data : []);
    }
  };

  const handleResetClick = (e) => {
    e.preventDefault();
    setCheckValues([]);
    setCheckCategoryValues([]);
    setCheckCategoryItems([]);
    setCheckVendorValues([]);
    setCheckVendorItems([]);
    setCheckPartnerValues([]);
    setCheckPartnerItems([]);
    setCheckItems([]);
    setCustomFilters([]);
    setOffsetValue(0);
    setCheckTagStatusItems([]);
    setCheckTagStatusValues([]);
    dispatch(getEquipmentFilters([], [], [], [], [], []));
    if (afterReset) afterReset();
    setAssets([]);
  };

  const isUserError = userInfo && userInfo.err;
  const isUserLoading = userInfo && userInfo.loading;
  const userErrorMsg = generateErrorMessage(userInfo);
  const errorMsg = (categoryGroupsInfo && categoryGroupsInfo.err) ? generateErrorMessage(categoryGroupsInfo) : userErrorMsg;

  const statusValues = equipmentFilters && equipmentFilters.statuses ? getColumnArrayById(equipmentFilters.statuses, 'id') : [];
  const categories = equipmentFilters && equipmentFilters.categories ? getColumnArrayById(equipmentFilters.categories, 'id') : [];
  const vendors = equipmentFilters && equipmentFilters.vendors ? getColumnArrayById(equipmentFilters.vendors, 'id') : [];
  const tagStatusValues = equipmentFilters && equipmentFilters.tagStatus ? getColumnArrayById(equipmentFilters.tagStatus, 'id') : [];
  const partnerValues = equipmentFilters && equipmentFilters.partners ? getColumnArrayById(equipmentFilters.partners, 'id') : [];

  return (

    <Card className="side-filters p-1 bg-lightblue h-100" onMouseOver={() => setFilterIcon(true)} onMouseLeave={() => setFilterIcon(false)}>
      {!collapse ? (
        <>
          <CardTitle className="mt-2 ml-2 mb-1 mr-2">
            <Row lg="12" sm="12" md="12">
              <Col lg="10" sm="10" md="10" className="mr-0">
                <h4>
                  Filters
                </h4>
              </Col>
              {filtersIcon && (
                <Col lg="2" sm="2" md="2" className="mt-1">
                  <img
                    src={collapseIcon}
                    height="25px"
                    aria-hidden="true"
                    width="25px"
                    alt="Collapse"
                    onClick={() => setCollapse(!collapse)}
                    className="cursor-pointer collapse-icon-margin-left"
                    id="collapse"
                  />
                  <UncontrolledTooltip target="collapse" placement="right">
                    Collapse
                  </UncontrolledTooltip>
                </Col>
              )}
            </Row>
          </CardTitle>
          <hr className="m-0 border-color-grey ml-2px" />

          <CardBody className="ml-2 p-0 mt-2 position-relative side-filters-list thin-scrollbar">
            <Row className="m-0">
              <Col md="8" xs="8" sm="8" lg="8" className="p-0">
                <p className="m-0 font-weight-800 collapse-heading">BY STATUS</p>
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
                <p className="m-0 font-weight-800 collapse-heading">BY CATEGORY</p>
              </Col>
              <Col md="4" xs="4" sm="4" lg="4" className="text-right p-0">
                <FontAwesomeIcon className="mr-2 cursor-pointer" onClick={() => setCategoryCollapse(!categoryCollapse)} size="sm" icon={categoryCollapse ? faChevronUp : faChevronDown} />
              </Col>
            </Row>
            <Collapse isOpen={categoryCollapse}>
              {(categoryGroupsInfo && categoryGroupsInfo.data && categoryGroupsInfo.data.length > 15) && (
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
            <Row className="m-0">
              <Col md="8" xs="8" sm="8" lg="8" className="p-0">
                <p className="m-0 font-weight-800 collapse-heading">BY TAG STATUS</p>
              </Col>
              <Col md="4" xs="4" sm="4" lg="4" className="text-right p-0">
                <FontAwesomeIcon className="mr-2 cursor-pointer" onClick={() => setTagStatusCollapse(!tagStatusCollapse)} size="sm" icon={tagStatusCollapse ? faChevronUp : faChevronDown} />
              </Col>
            </Row>
            <Collapse isOpen={tagStatusCollapse}>
              <div>
                {assetActionData.tagStatsus.map((item, index) => (
                  <span className="mb-1 d-block font-weight-500" key={item.value}>
                    <div className="checkbox">
                      <Input
                        type="checkbox"
                        id={`checkboxTagStatus${index}`}
                        name={item.label}
                        value={item.value}
                        checked={tagStatusValues.some((selectedValue) => selectedValue === item.value)}
                        onChange={handleTagStatusCheckboxChange}
                      />
                      <Label htmlFor={`checkboxTagStatus${index}`}>
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
                <p className="m-0 font-weight-800 collapse-heading">BY VENDOR</p>
              </Col>
              <Col md="4" xs="4" sm="4" lg="4" className="text-right p-0">
                <FontAwesomeIcon className="mr-2 cursor-pointer" onClick={() => setVendorCollapse(!vendorCollapse)} size="sm" icon={vendorCollapse ? faChevronUp : faChevronDown} />
              </Col>
            </Row>
            <Collapse isOpen={vendorCollapse}>
              {(vendorGroupsInfo && vendorGroupsInfo.data && vendorGroupsInfo.data.length > 15) && (
              <FormGroup className="mt-2 mb-2">
                <Input type="input" name="vendorSearchValue" placeholder="Please search a vendor" onChange={onVendorSearchChange} id="vendorSearchValue" className="border-radius-50px" />
              </FormGroup>
              )}
              <div>
                {((vendorGroupsInfo && vendorGroupsInfo.loading) || isUserLoading) && (
                <div className="p-5">
                  <Loader />
                </div>
                )}
                {vendorGroups && vendorGroups.map((vItem, index) => (
                  vItem.vendor_id && (
                  <span className="mb-1 d-block font-weight-500" key={vItem.vendor_id}>
                    <div className="checkbox">
                      <Input
                        type="checkbox"
                        id={`checkboxvendorgroup${index}`}
                        value={vItem.vendor_id[0]}
                        name={vItem.vendor_id[1]}
                        checked={vendors.some((selectedValue) => parseInt(selectedValue) === parseInt(vItem.vendor_id[0]))}
                        onChange={handleVendorCheckboxChange}
                      />
                      {' '}
                      <Label htmlFor={`checkboxvendorgroup${index}`}><span>{vItem.vendor_id[1]}</span></Label>
                    </div>
                  </span>
                  )
                ))}
                {((vendorGroupsInfo && vendorGroupsInfo.err) || isUserError) && (
                <ErrorContent errorTxt={errorMsg} />
                )}
              </div>
            </Collapse>
            <hr className="mt-2" />
            <Row className="m-0">
              <Col md="8" xs="8" sm="8" lg="8" className="p-0">
                <p className="m-0 font-weight-800 collapse-heading">BY MANUFACTURER</p>
              </Col>
              <Col md="4" xs="4" sm="4" lg="4" className="text-right p-0">
                <FontAwesomeIcon className="mr-2 cursor-pointer" onClick={() => setPartnerCollapse(!partnerCollapse)} size="sm" icon={partnerCollapse ? faChevronUp : faChevronDown} />
              </Col>
            </Row>
            <Collapse isOpen={partnerCollapse}>
              {(vendorGroupsInfo && vendorGroupsInfo.data && vendorGroupsInfo.data.length > 15) && (
              <FormGroup className="mt-2 mb-2">
                <Input type="input" name="vendorSearchValue" placeholder="Please search a manufacturer" onChange={onPartnerSearchChange} id="vendorSearchValue" className="border-radius-50px" />
              </FormGroup>
              )}
              <div>
                {((vendorGroupsInfo && vendorGroupsInfo.loading) || isUserLoading) && (
                <div className="p-5">
                  <Loader />
                </div>
                )}
                {vendorGroups && vendorGroups.map((vItem, index) => (
                  vItem.manufacturer_id && (
                  <span className="mb-1 d-block font-weight-500" key={`${vItem.manufacturer_id}${index}`}>
                    <div className="checkbox">
                      <Input
                        type="checkbox"
                        id={`checkboxmfgroup${vItem.manufacturer_id[0]}`}
                        value={vItem.manufacturer_id[0]}
                        name={vItem.manufacturer_id[1]}
                        checked={partnerValues.some((selectedValue) => parseInt(selectedValue) === parseInt(vItem.manufacturer_id[0]))}
                        onChange={handlePartnerCheckboxChange}
                      />
                      {' '}
                      <Label htmlFor={`checkboxmfgroup${vItem.manufacturer_id[0]}`}><span>{vItem.manufacturer_id[1]}</span></Label>
                    </div>
                  </span>
                  )
                ))}
                {((vendorGroupsInfo && vendorGroupsInfo.err) || isUserError) && (
                <ErrorContent errorTxt={errorMsg} />
                )}
              </div>
            </Collapse>
            <hr className="mt-2" />
            {((statusValues && statusValues.length > 0)
                || (categories && categories.length > 0)
                || (vendors && vendors.length > 0)
                || (customFiltersList && customFiltersList.length > 0)
                || (partnerValues && partnerValues.length > 0)
                || (tagStatusValues && tagStatusValues.length > 0))
                && (<div aria-hidden="true" className="float-right cursor-pointer mb-4 mr-2 text-info font-weight-800" onClick={handleResetClick} onKeyDown={handleResetClick}>Reset Filters</div>)}
          </CardBody>
        </>
      ) : ''}
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
  vendorValue: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string,
  ]).isRequired,
  statusValue: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string,
  ]).isRequired,
  tagStatusValue: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string,
  ]).isRequired,
  partnerValue: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string,
  ]).isRequired,
  afterReset: PropTypes.func.isRequired,
  sortBy: PropTypes.string.isRequired,
  sortField: PropTypes.string.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  columns: PropTypes.array.isRequired,
  setCollapse: PropTypes.func,
  collapse: PropTypes.bool,
};
SideFilters.defaultProps = {
  setCollapse: () => { },
  collapse: false,
};

export default SideFilters;
