/* eslint-disable import/no-unresolved */
/* eslint-disable radix */
import React, { useState, useEffect } from 'react';
import * as PropTypes from 'prop-types';
import {
  Badge, Collapse, FormGroup, Card, CardBody, CardTitle, Col, Input, Label, Row,
} from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faChevronDown, faChevronUp, faTimesCircle,
} from '@fortawesome/free-solid-svg-icons';
import { useSelector, useDispatch } from 'react-redux';

import ErrorContent from '@shared/errorContent';
import Loader from '@shared/loading';
import {
  getUsersList, getUsersCount, getUserFilters,
  getRolesGroups, getUserDetails,
} from '../setupService';
import {
  getColumnArrayById, queryGenerator, queryGeneratorWithUtc,
  generateErrorMessage, truncate, getAllowedCompanies,
} from '../../util/appUtils';

const appModels = require('../../util/appModels').default;

const UserSidebar = (props) => {
  const {
    offset, id, statusValue, companyValue, afterReset,
    sortBy, sortField,
  } = props;
  const dispatch = useDispatch();
  const limit = 10;
  const [checkValues, setCheckValues] = useState([]);
  const [checkItems, setCheckItems] = useState([]);
  const [checkCompanyValues, setCheckCompanyValues] = useState([]);
  const [checkCompanyItems, setCheckCompanyItems] = useState([]);
  const [offsetValue, setOffsetValue] = useState(offset);
  const [sortByValue, setSortByValue] = useState(sortBy);
  const [sortFieldValue, setSortFieldValue] = useState(sortField);
  const [statusCollapse, setStatusCollapse] = useState(true);
  const [companyCollapse, setCompanyCollapse] = useState(false);
  const [customFiltersList, setCustomFilters] = useState([]);
  const [statusRemovedValue, setStatusRemovedValue] = useState(statusValue);
  const [companyRemovedValue, setCompanyRemovedValue] = useState(companyValue);
  const [scrollTop, setScrollTop] = useState(0);
  const [viewId, setViewId] = useState('');
  const [users, setUsers] = useState([]);

  const [roleGroups, setRoleGroups] = useState([]);
  const [companyGroups, setCompanyGroups] = useState([]);

  const { userInfo } = useSelector((state) => state.user);
  const companies = getAllowedCompanies(userInfo);
  const {
    userFilters, roleGroupsInfo, createUserInfo,
    userCount, userListInfo, allowedCompanies, updateUserInfo,
  } = useSelector((state) => state.setup);

  // eslint-disable-next-line no-nested-ternary
  const userCompanies = allowedCompanies && allowedCompanies.data && allowedCompanies.data.allowed_companies && allowedCompanies.data.allowed_companies.length > 0
    ? allowedCompanies.data.allowed_companies : userInfo && userInfo.data && userInfo.data.allowed_companies && userInfo.data.allowed_companies.length > 0 ? userInfo.data.allowed_companies : [];

  useEffect(() => {
    setOffsetValue(offset);
    setSortByValue(sortBy);
    setSortFieldValue(sortField);
  }, [offset, sortBy, sortField]);

  useEffect(() => {
    setStatusRemovedValue(statusValue);
  }, [statusValue]);

  useEffect(() => {
    setCompanyRemovedValue(companyValue);
  }, [companyValue]);

  useEffect(() => {
    if (roleGroupsInfo && roleGroupsInfo.data) {
      const arr = [...roleGroups, ...roleGroupsInfo.data];
      setRoleGroups([...new Map(arr.map((item) => [item.id, item])).values()]);
    }
  }, [roleGroupsInfo]);

  useEffect(() => {
    if (userInfo && userInfo.data) {
      const arr = [...companyGroups, ...userCompanies];
      setCompanyGroups([...new Map(arr.map((item) => [item.id, item])).values()]);
    }
  }, [userInfo]);

  useEffect(() => {
    if (statusRemovedValue && statusRemovedValue !== 0) {
      setCheckItems(checkItems.filter((item) => item.id !== statusRemovedValue));
      if (checkItems.filter((item) => item.id !== statusRemovedValue) && checkItems.filter((item) => item.id !== statusRemovedValue).length === 0) {
        dispatch(getUserFilters(checkItems.filter((item) => item.id !== statusRemovedValue), checkCompanyItems, customFiltersList));
      }
    }
  }, [statusRemovedValue]);

  useEffect(() => {
    if (companyRemovedValue && companyRemovedValue !== 0) {
      setCheckCompanyItems(checkCompanyItems.filter((item) => item.id !== companyRemovedValue));
      if (checkCompanyItems.filter((item) => item.id !== companyRemovedValue) && checkItems.filter((item) => item.id !== companyRemovedValue).length === 0) {
        dispatch(getUserFilters(checkItems, checkCompanyItems.filter((item) => item.id !== companyRemovedValue), customFiltersList));
      }
    }
  }, [companyRemovedValue]);

  useEffect(() => {
    if (userFilters && userFilters.customFilters) {
      setCustomFilters(userFilters.customFilters);
    }
  }, [userFilters]);

  useEffect(() => {
    if ((checkItems && checkItems.length > 0) || (checkCompanyItems && checkCompanyItems.length > 0)) {
      dispatch(getUserFilters(checkItems, checkCompanyItems, customFiltersList));
    }
  }, [checkItems, checkCompanyItems]);

  useEffect(() => {
    const statusValues = [];
    const companyValues = [];
    const filterList = [];
    /* let callFilter = true;
    if (checkItems && checkItems.length > 0) {
      statusValues = checkItems;
    } else if (userFilters && userFilters.statuses && userFilters.statuses.length > 0) {
      statusValues = userFilters.statuses;
      setCheckItems(userFilters.statuses);
      callFilter = false;
      setStatusCollapse(true);
    }

    if (checkCompanyItems && checkCompanyItems.length > 0) {
      companyValues = checkCompanyItems;
    } else if (userFilters && userFilters.companies && userFilters.companies.length > 0) {
      companyValues = userFilters.companies;
      setCheckCompanyItems(userFilters.companies);
      callFilter = false;
      setCompanyCollapse(true);
    }

    if (customFiltersList && customFiltersList.length > 0) {
      filterList = customFiltersList;
    } else if (userFilters && userFilters.customFilters) {
      filterList = userFilters.customFilters;
    }
    if (callFilter) {
      dispatch(getUserFilters(statusValues, companyValues, filterList));
    } */

    dispatch(getUserFilters(statusValues, companyValues, filterList));
  }, []);

  useEffect(() => {
    if ((userInfo && userInfo.data) && statusCollapse) {
      dispatch(getRolesGroups(companies, appModels.USERROLE));
      setCompanyCollapse(false);
    }
  }, [userInfo, statusCollapse]);

  useEffect(() => {
    if (companyCollapse) {
      setStatusCollapse(false);
    }
  }, [companyCollapse]);

  useEffect(() => {
    if (userInfo.data && (userFilters && (userFilters.statuses || userFilters.companies || userFilters.customFilters))) {
      const statusValues = userFilters.statuses ? getColumnArrayById(userFilters.statuses, 'id') : [];
      const companyValues = userFilters.companies ? getColumnArrayById(userFilters.companies, 'id') : [];
      const customFilters = userFilters.customFilters ? queryGeneratorWithUtc(userFilters.customFilters, false, userInfo.data) : '';
      dispatch(getUsersCount(companies, appModels.USER, statusValues, companyValues, customFilters));
    }
  }, [userInfo, userFilters]);

  useEffect(() => {
    if (userInfo.data && (userFilters && (userFilters.statuses || userFilters.companies || userFilters.customFilters))) {
      const statusValues = userFilters.statuses ? getColumnArrayById(userFilters.statuses, 'id') : [];
      const companyValues = userFilters.companies ? getColumnArrayById(userFilters.companies, 'id') : [];
      const customFilters = userFilters.customFilters ? queryGeneratorWithUtc(userFilters.customFilters,false, userInfo.data) : '';
      dispatch(getUsersList(companies, appModels.USER, limit, offsetValue, statusValues, companyValues, customFilters, sortByValue, sortFieldValue));
    }
  }, [userInfo, offsetValue, sortByValue, sortFieldValue, userFilters, scrollTop]);

  useEffect(() => {
    if ((createUserInfo && createUserInfo.data) || (updateUserInfo && updateUserInfo.data)) {
      const statusValues = userFilters.statuses ? getColumnArrayById(userFilters.statuses, 'id') : [];
      const companyValues = userFilters.companies ? getColumnArrayById(userFilters.companies, 'id') : [];
      const customFilters = userFilters.customFilters ? queryGeneratorWithUtc(userFilters.customFilters,false, userInfo.data) : '';
      dispatch(getUsersList(companies, appModels.USER, limit, offsetValue, statusValues, companyValues, customFilters, sortByValue, sortFieldValue));
      dispatch(getUsersCount(companies, appModels.USER, statusValues, companyValues, customFilters));
    }
  }, [createUserInfo, userFilters]);

  useEffect(() => {
    if (!id) {
      setUsers([]);
    }
  }, [id]);

  useEffect(() => {
    if (userListInfo && userListInfo.data && id) {
      const arr = [...users, ...userListInfo.data];
      setUsers([...new Map(arr.map((item) => [item.id, item])).values()]);
    }
  }, [userListInfo, id]);

  useEffect(() => {
    if ((userInfo && userInfo.data) && viewId) {
      dispatch(getUserDetails(companies, appModels.TEAMMEMEBERS, viewId));
    }
  }, [userInfo, viewId]);

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
        dispatch(getUserFilters(checkItems.filter((item) => item.id !== value), checkCompanyItems, customFiltersList));
      }
    }
    setOffsetValue(0);
    if (afterReset) afterReset();
    setUsers([]);
  };

  const handleStatusClose = (value) => {
    setCheckValues(checkValues.filter((item) => item !== value));
    setCheckItems(checkItems.filter((item) => item.id !== value));
    if (checkItems.filter((item) => item.id !== value) && checkItems.filter((item) => item.id !== value).length === 0) {
      dispatch(getUserFilters(checkItems.filter((item) => item.id !== value), checkCompanyItems, customFiltersList));
    }
    setOffsetValue(0);
    if (afterReset) afterReset();
    setUsers([]);
  };

  const handleCompanyCheckboxChange = (event) => {
    const { checked, value, name } = event.target;
    const values = { id: value, label: name };
    if (checked) {
      setCheckCompanyValues((state) => [...state, value]);
      setCheckCompanyItems((state) => [...state, values]);
    } else {
      setCheckCompanyValues(checkCompanyValues.filter((item) => item !== value));
      setCheckCompanyItems(checkCompanyItems.filter((item) => item.id !== value));
      if (checkCompanyItems.filter((item) => item.id !== value) && checkCompanyItems.filter((item) => item.id !== value).length === 0) {
        dispatch(getUserFilters(checkItems, checkCompanyItems.filter((item) => item.id !== value), customFiltersList));
      }
    }
    setOffsetValue(0);
    if (afterReset) afterReset();
    setUsers([]);
  };

  const handleCompanyClose = (value) => {
    setCheckCompanyValues(checkCompanyValues.filter((item) => item !== value));
    setCheckCompanyItems(checkCompanyItems.filter((item) => item.id !== value));
    if (checkCompanyItems.filter((item) => item.id !== value) && checkItems.filter((item) => item.id !== value).length === 0) {
      dispatch(getUserFilters(checkItems, checkCompanyItems.filter((item) => item.id !== value), customFiltersList));
    }
    setOffsetValue(0);
    if (afterReset) afterReset();
    setUsers([]);
  };

  const handleCustomFilterClose = (value) => {
    setCustomFilters(customFiltersList.filter((item) => item.key !== value));
    dispatch(getUserFilters(checkItems, checkCompanyItems, customFiltersList.filter((item) => item.key !== value)));
    setOffsetValue(0);
    if (afterReset) afterReset();
    setUsers([]);
  };

  const handleResetClick = (e) => {
    e.preventDefault();
    setCheckValues([]);
    setCheckItems([]);
    setCustomFilters([]);
    setCheckCompanyValues([]);
    setCheckCompanyItems([]);
    dispatch(getUserFilters([], [], []));
    setOffsetValue(0);
    if (afterReset) afterReset();
    setUsers([]);
  };

  const onScroll = (e) => {
    e.preventDefault();
    const divScrollHeight = e.target.scrollHeight - e.target.scrollTop;
    const divHeight = e.target.clientHeight;
    const bottom = ((divScrollHeight - divHeight) <= 150);
    const total = userCount && userCount.length ? userCount.length : 0;
    const scrollListCount = users && users.length ? users.length : 0;
    if ((userListInfo && !userListInfo.loading) && bottom && (total !== scrollListCount) && (total >= offsetValue)) {
      setScrollTop(e.target.scrollTop);
      const offsetVal = parseInt(offsetValue) + parseInt(limit);
      setOffsetValue(offsetVal);
    }
  };

  const onRoleSearchChange = (e) => {
    if (e.target.value && e.target.value.length > 0) {
      const ndata = roleGroups.filter((item) => {
        const searchValue = item.name ? item.name.toString().toUpperCase() : '';
        const s = e.target.value.toString().toUpperCase();
        return (searchValue.search(s) !== -1);
      });
      setRoleGroups(ndata);
    } else {
      setRoleGroups(roleGroupsInfo && roleGroupsInfo.data ? roleGroupsInfo.data : []);
    }
  };

  const onCompanySearchChange = (e) => {
    if (e.target.value && e.target.value.length > 0) {
      const ndata = companyGroups.filter((item) => {
        const searchValue = item.name ? item.name.toString().toUpperCase() : '';
        const s = e.target.value.toString().toUpperCase();
        return (searchValue.search(s) !== -1);
      });
      setCompanyGroups(ndata);
    } else {
      setCompanyGroups(userCompanies || []);
    }
  };

  const statusValues = userFilters && userFilters.statuses ? getColumnArrayById(userFilters.statuses, 'id') : [];
  const companyValues = userFilters && userFilters.companies ? getColumnArrayById(userFilters.companies, 'id') : [];
  const currentId = viewId || id;
  const statusList = userFilters && userFilters.statuses ? userFilters.statuses : [];
  const companyList = userFilters && userFilters.companies ? userFilters.companies : [];

  return (

    <Card className="p-1 h-100 bg-lightblue side-filters-list">
      <CardTitle className="mt-2 ml-2 mb-1 mr-2 sfilterarrow">
        <h4>
          Filters
        </h4>
      </CardTitle>
      <hr className="m-0 border-color-grey" />
      {id ? (
        <>
          <div>
            <div className="mr-2 ml-2 mt-2">
              {statusList && statusList.map((item) => (
                <h5 key={item.id} className="mr-2 content-inline">
                  <Badge color="dark" className="p-2 mb-2 bg-zodiac">
                    {item.label}
                    <FontAwesomeIcon className="ml-2 cursor-pointer" onClick={() => handleStatusClose(item.id)} size="sm" icon={faTimesCircle} />
                  </Badge>
                </h5>
              ))}
              {companyList && companyList.map((item) => (
                <h5 key={item.id} className="mr-2 content-inline">
                  <Badge color="dark" className="p-2 mb-2 bg-zodiac">
                    {item.label}
                    <FontAwesomeIcon className="ml-2 cursor-pointer" onClick={() => handleCompanyClose(item.id)} size="sm" icon={faTimesCircle} />
                  </Badge>
                </h5>
              ))}
              {customFiltersList && customFiltersList.map((cf) => (
                <h5 key={cf.key} className="mr-2 content-inline">
                  <Badge color="dark" className="p-2 mb-2 bg-zodiac">
                    {cf.label}
                    {(cf.type === 'text' || cf.type === 'id') && (
                    <span>
                      {'  '}
                      &quot;
                      {cf.value}
                      &quot;
                    </span>
                    )}
                    <FontAwesomeIcon className="ml-2 cursor-pointer" onClick={() => handleCustomFilterClose(cf.key)} size="sm" icon={faTimesCircle} />
                  </Badge>
                </h5>
              ))}
            </div>
            {((statusValues && statusValues.length > 0) || (companyValues && companyValues.length > 0) || (customFiltersList && customFiltersList.length > 0)) && (
            <div aria-hidden="true" className="cursor-pointer text-info text-right mr-2 font-weight-800" onClick={handleResetClick} onKeyDown={handleResetClick}>Reset Filters</div>
            )}
            {((statusValues && statusValues.length > 0) || (companyValues && companyValues.length > 0) || (customFiltersList && customFiltersList.length > 0)) && (
            <hr className="mt-0 pt-1 mb-2 ml-2 mr-2" />
            )}
            <div onScroll={onScroll} className={users && users.length > 9 ? 'height-100 side-filters-list thin-scrollbar' : ''}>
              {(users) && users.map((st) => (
                <Card
                  key={st.id}
                  onClick={() => setViewId(st.id)}
                  className={(st.id === currentId) ? 'mb-2 mr-2 ml-2 border-nepal-1px cursor-pointer' : 'cursor-pointer mb-2 mr-2 ml-2'}
                >
                  <CardBody className="p-2">
                    <Row>
                      <Col md={12} className="nowrap-content">
                        <span className="font-weight-700 ml-2 font-medium">{truncate(st.name, 12)}</span>
                      </Col>
                    </Row>
                    <span className="font-weight-400 mb-1 ml-2 font-tiny">
                      {st.email}
                    </span>
                    <Row>
                      <Col md={12} className="nowrap-content">
                        <span className="text-info font-weight-600 mb-0 ml-2 font-tiny">{st.role_ids ? st.role_ids[1] : ''}</span>
                      </Col>
                    </Row>
                  </CardBody>
                </Card>
              ))}
              {(userListInfo && userListInfo.err) && (
              <Card className="mb-2 mr-2 ml-2 border-nepal-1px">
                <CardBody className="p-2">
                  <ErrorContent errorTxt={generateErrorMessage(userListInfo)} />
                </CardBody>
              </Card>
              )}

              {(userInfo && userInfo.err) && (
              <Card className="mb-2 mr-2 ml-2 border-nepal-1px">
                <CardBody className="p-2">
                  <ErrorContent errorTxt={generateErrorMessage(userInfo)} />
                </CardBody>
              </Card>
              )}
              {((userListInfo && userListInfo.loading) || (userInfo && userInfo.loading)) && (
              <Loader />
              )}
            </div>
          </div>
        </>
      ) : (
        <CardBody className="pl-1 p-0 mt-2 position-relative side-filters-list thin-scrollbar">
          <Row className="m-0">
            <Col md="8" xs="8" sm="8" lg="8" className="p-0">
              <p className="m-0 font-weight-800 collapse-heading">BY ROLE</p>
            </Col>
            <Col md="4" xs="4" sm="4" lg="4" className="text-right p-0">
              <FontAwesomeIcon className="mr-2 cursor-pointer" onClick={() => setStatusCollapse(!statusCollapse)} size="sm" icon={statusCollapse ? faChevronUp : faChevronDown} />
            </Col>
          </Row>
          <Collapse isOpen={statusCollapse}>
            {(roleGroupsInfo && roleGroupsInfo.data && roleGroupsInfo.data.length > 10) && (
            <FormGroup className="mt-2 mb-2">
              <Input type="input" name="searchValue" placeholder="Please search a role" onChange={onRoleSearchChange} id="categorySearchValue" className="border-radius-50px" />
            </FormGroup>
            )}
            <div>
              {(roleGroupsInfo && roleGroupsInfo.loading) && (
              <Loader />
              )}
              {(roleGroups && roleGroupsInfo && roleGroupsInfo.data) && roleGroups.map((roleId) => (
                roleId.name && (
                <span className="mb-1 d-block font-weight-500" key={roleId.id}>
                  <div className="checkbox">
                    <Input
                      type="checkbox"
                      id={`checkboxcgroup${roleId.id}`}
                      value={roleId.id}
                      name={roleId.name}
                      checked={statusValues.some((selectedValue) => parseInt(selectedValue) === parseInt(roleId.id))}
                      onChange={handleCheckboxChange}
                    />
                    {' '}
                    <Label htmlFor={`checkboxcgroup${roleId.id}`}><span>{roleId.name}</span></Label>
                  </div>
                </span>
                )
              ))}
              {(roleGroupsInfo && roleGroupsInfo.err) && (
              <ErrorContent errorTxt={generateErrorMessage(roleGroupsInfo)} />
              )}
            </div>
          </Collapse>
          <hr className="mt-2" />
          <Row className="m-0">
            <Col md="8" xs="8" sm="8" lg="8" className="p-0">
              <p className="m-0 font-weight-800 collapse-heading">BY COMPANY</p>
            </Col>
            <Col md="4" xs="4" sm="4" lg="4" className="text-right p-0">
              <FontAwesomeIcon className="mr-2 cursor-pointer" onClick={() => setCompanyCollapse(!companyCollapse)} size="sm" icon={companyCollapse ? faChevronUp : faChevronDown} />
            </Col>
          </Row>
          <Collapse isOpen={companyCollapse}>
            {(userCompanies && userCompanies.length > 10) && (
            <FormGroup className="mt-2 mb-2">
              <Input type="input" name="searchCompanyValue" placeholder="Please search a company" onChange={onCompanySearchChange} id="categorySearchValue" className="border-radius-50px" />
            </FormGroup>
            )}
            <div>
              {(userInfo && userInfo.loading) && (
              <Loader />
              )}
              {userCompanies && companyGroups && companyGroups.map((cp) => (
                cp.name && (
                <span className="mb-1 d-block font-weight-500" key={cp.id}>
                  <div className="checkbox">
                    <Input
                      type="checkbox"
                      id={`checkboxcgroup${cp.id}`}
                      value={cp.id}
                      name={cp.name}
                      checked={companyValues.some((selectedValue) => parseInt(selectedValue) === parseInt(cp.id))}
                      onChange={handleCompanyCheckboxChange}
                    />
                    {' '}
                    <Label htmlFor={`checkboxcgroup${cp.id}`}><span>{cp.name}</span></Label>
                  </div>
                </span>
                )
              ))}
              {(userInfo && userInfo.err) && (
              <ErrorContent errorTxt={generateErrorMessage(userInfo)} />
              )}
            </div>
          </Collapse>
          <hr className="mt-2" />
          {((statusValues && statusValues.length > 0) || (companyValues && companyValues.length > 0) || (customFiltersList && customFiltersList.length > 0)) && (
          <div aria-hidden="true" className="float-right cursor-pointer mb-4 mr-2 text-info font-weight-800" onClick={handleResetClick} onKeyDown={handleResetClick}>Reset Filters</div>
          )}
        </CardBody>
      )}
    </Card>

  );
};

UserSidebar.propTypes = {
  offset: PropTypes.number.isRequired,
  id: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string,
  ]).isRequired,
  statusValue: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string,
  ]).isRequired,
  companyValue: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string,
  ]).isRequired,
  afterReset: PropTypes.func.isRequired,
  sortBy: PropTypes.string.isRequired,
  sortField: PropTypes.string.isRequired,
};

export default UserSidebar;
