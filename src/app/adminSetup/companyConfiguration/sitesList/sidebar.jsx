/* eslint-disable import/no-unresolved */
/* eslint-disable radix */
import React, { useState, useEffect } from "react";
import * as PropTypes from "prop-types";
import {
  Badge,
  Collapse,
  Card,
  CardBody,
  CardTitle,
  Col,
  FormGroup,
  Input,
  Label,
  Row,
} from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronDown,
  faChevronUp,
  faTimesCircle,
} from "@fortawesome/free-solid-svg-icons";
import { useSelector, useDispatch } from "react-redux";

import ErrorContent from "@shared/errorContent";
import Loader from "@shared/loading";
import {
  getSitesList,
  getSitesCount,
  getSiteFilters,
  getCountryGroups,
  getSiteDetail,
} from "../../setupService";
import {
  getColumnArrayById,
  queryGenerator,
  queryGeneratorWithUtc,
  generateErrorMessage,
  truncate,
  getAllowedCompanies,
} from "../../../util/appUtils";

const appModels = require("../../../util/appModels").default;

const Sidebar = (props) => {
  const { offset, id, statusValue, afterReset, sortBy, sortField } = props;
  const dispatch = useDispatch();
  const limit = 12;
  const [checkValues, setCheckValues] = useState([]);
  const [checkItems, setCheckItems] = useState([]);
  const [offsetValue, setOffsetValue] = useState(offset);
  const [sortByValue, setSortByValue] = useState(sortBy);
  const [sortFieldValue, setSortFieldValue] = useState(sortField);
  const [statusCollapse, setStatusCollapse] = useState(true);
  const [customFiltersList, setCustomFilters] = useState([]);
  const [viewId, setViewId] = useState("");
  const [sites, setSites] = useState([]);
  const [statusRemovedValue, setStatusRemovedValue] = useState(statusValue);
  const [countryGroups, setCountryGroups] = useState([]);
  const [scrollTop, setScrollTop] = useState(0);

  const { userInfo } = useSelector((state) => state.user);
  const companies = getAllowedCompanies(userInfo);
  const {
    siteFilters,
    countryGroupsInfo,
    companyDetail,
    sitesListInfo,
    sitesCount,
  } = useSelector((state) => state.setup);

  useEffect(() => {
    setOffsetValue(offset);
    setSortByValue(sortBy);
    setSortFieldValue(sortField);
  }, [offset, sortBy, sortField]);

  useEffect(() => {
    setStatusRemovedValue(statusValue);
  }, [statusValue]);

  useEffect(() => {
    if (!id) {
      setSites([]);
    }
  }, [id]);

  useEffect(() => {
    if (sitesListInfo && sitesListInfo.data && id) {
      const arr = [...sites, ...sitesListInfo.data];
      setSites([...new Map(arr.map((item) => [item.id, item])).values()]);
    }
  }, [sitesListInfo, id]);

  useEffect(() => {
    if (statusRemovedValue && statusRemovedValue !== 0) {
      setCheckItems(
        checkItems.filter((item) => item.id !== statusRemovedValue)
      );
      if (
        checkItems.filter((item) => item.id !== statusRemovedValue) &&
        checkItems.filter((item) => item.id !== statusRemovedValue).length === 0
      ) {
        dispatch(
          getSiteFilters(
            checkItems.filter((item) => item.id !== statusRemovedValue),
            customFiltersList
          )
        );
      }
    }
  }, [statusRemovedValue]);

  useEffect(() => {
    if (siteFilters && siteFilters.customFilters) {
      setCustomFilters(siteFilters.customFilters);
    }
  }, [siteFilters]);

  useEffect(() => {
    if (checkItems && checkItems.length > 0) {
      dispatch(getSiteFilters(checkItems, customFiltersList));
    }
  }, [checkItems]);

  useEffect(() => {
    const statusValues = [];
    const filterList = [];
    /* let callFilter = true;
    if (checkItems && checkItems.length > 0) {
      statusValues = checkItems;
    } else if (siteFilters && siteFilters.statuses && siteFilters.statuses.length > 0) {
      statusValues = siteFilters.statuses;
      setCheckItems(siteFilters.statuses);
      callFilter = false;
      setStatusCollapse(true);
    }

    if (customFiltersList && customFiltersList.length > 0) {
      filterList = customFiltersList;
    } else if (siteFilters && siteFilters.customFilters) {
      filterList = siteFilters.customFilters;
    }
    if (callFilter) {
      dispatch(getSiteFilters(statusValues, filterList));
    } */

    dispatch(getSiteFilters(statusValues, filterList));
  }, []);

  useEffect(() => {
    if (
      companyDetail &&
      companyDetail.data &&
      companyDetail.data.length &&
      statusCollapse
    ) {
      dispatch(getCountryGroups(companyDetail.data[0].id, appModels.COMPANY));
    }
  }, [companyDetail, statusCollapse]);

  useEffect(() => {
    if (countryGroupsInfo && countryGroupsInfo.data) {
      const arr = [...countryGroups, ...countryGroupsInfo.data];
      setCountryGroups([
        ...new Map(arr.map((item) => [item.city, item])).values(),
      ]);
    }
  }, [countryGroupsInfo]);

  useEffect(() => {
    if (
      userInfo.data &&
      siteFilters &&
      (siteFilters.statuses || siteFilters.customFilters) &&
      companyDetail &&
      companyDetail.data &&
      companyDetail.data.length
    ) {
      const statusValues = siteFilters.statuses
        ? getColumnArrayById(siteFilters.statuses, "id")
        : [];
      const customFilters = siteFilters.customFilters
        ? queryGeneratorWithUtc(siteFilters.customFilters, false, userInfo.data)
        : "";
      const pid = companyDetail.data[0].id;
      dispatch(
        getSitesCount(
          companies,
          appModels.COMPANY,
          pid,
          statusValues,
          customFilters
        )
      );
    }
  }, [userInfo, companyDetail, siteFilters]);

  useEffect(() => {
    if (
      userInfo.data &&
      siteFilters &&
      (siteFilters.statuses || siteFilters.customFilters) &&
      companyDetail &&
      companyDetail.data &&
      companyDetail.data.length
    ) {
      const statusValues = siteFilters.statuses
        ? getColumnArrayById(siteFilters.statuses, "id")
        : [];
      const customFilters = siteFilters.customFilters
        ? queryGeneratorWithUtc(siteFilters.customFilters, false, userInfo.data)
        : "";
      const pid = companyDetail.data[0].id;
      dispatch(
        getSitesList(
          companies,
          appModels.COMPANY,
          limit,
          offsetValue,
          pid,
          statusValues,
          customFilters,
          sortByValue,
          sortFieldValue
        )
      );
    }
  }, [
    userInfo,
    companyDetail,
    offsetValue,
    sortByValue,
    sortFieldValue,
    siteFilters,
    scrollTop,
  ]);

  useEffect(() => {
    if (userInfo && userInfo.data && viewId) {
      dispatch(getSiteDetail(viewId, appModels.COMPANY));
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
      if (
        checkItems.filter((item) => item.id !== value) &&
        checkItems.filter((item) => item.id !== value).length === 0
      ) {
        dispatch(
          getSiteFilters(
            checkItems.filter((item) => item.id !== value),
            customFiltersList
          )
        );
      }
    }
    setOffsetValue(0);
    if (afterReset) afterReset();
    setSites([]);
  };

  const handleStatusClose = (value) => {
    setCheckValues(checkValues.filter((item) => item !== value));
    setCheckItems(checkItems.filter((item) => item.id !== value));
    if (
      checkItems.filter((item) => item.id !== value) &&
      checkItems.filter((item) => item.id !== value).length === 0
    ) {
      dispatch(
        getSiteFilters(
          checkItems.filter((item) => item.id !== value),
          customFiltersList
        )
      );
    }
    setOffsetValue(0);
    if (afterReset) afterReset();
    setSites([]);
  };

  const handleCustomFilterClose = (value) => {
    setCustomFilters(customFiltersList.filter((item) => item.key !== value));
    dispatch(
      getSiteFilters(
        checkItems,
        customFiltersList.filter((item) => item.key !== value)
      )
    );
    setOffsetValue(0);
    if (afterReset) afterReset();
    setSites([]);
  };

  const onScroll = (e) => {
    e.preventDefault();
    const divScrollHeight = e.target.scrollHeight - e.target.scrollTop;
    const divHeight = e.target.clientHeight;
    const bottom = divScrollHeight - divHeight <= 150;
    const total = sitesCount && sitesCount.length ? sitesCount.length : 0;
    const scrollListCount = sites && sites.length ? sites.length : 0;
    if (
      sitesListInfo &&
      !sitesListInfo.loading &&
      bottom &&
      total !== scrollListCount &&
      total >= offsetValue
    ) {
      setScrollTop(e.target.scrollTop);
      const offsetVal = parseInt(offsetValue) + parseInt(limit);
      setOffsetValue(offsetVal);
    }
  };

  const onCountrySearchChange = (e) => {
    if (e.target.value && e.target.value.length > 0) {
      const ndata = countryGroups.filter((item) => {
        const searchValue = item.city ? item.city.toString().toUpperCase() : "";
        const s = e.target.value.toString().toUpperCase();
        return searchValue.search(s) !== -1;
      });
      setCountryGroups(ndata);
    } else {
      setCountryGroups(
        countryGroupsInfo && countryGroupsInfo.data
          ? countryGroupsInfo.data
          : []
      );
    }
  };

  const handleResetClick = (e) => {
    e.preventDefault();
    setCheckValues([]);
    setCheckItems([]);
    setCustomFilters([]);
    dispatch(getSiteFilters([], []));
    setOffsetValue(0);
    if (afterReset) afterReset();
    setSites([]);
  };

  const statusValues =
    siteFilters && siteFilters.statuses
      ? getColumnArrayById(siteFilters.statuses, "id")
      : [];
  const currentId = viewId || id;
  const statusList =
    siteFilters && siteFilters.statuses ? siteFilters.statuses : [];

  return (
    <Card className="p-1 h-100 bg-lightblue side-filters-list">
      <CardTitle className="mt-2 ml-2 mb-1 mr-2 sfilterarrow">
        <h4>{id ? "All Sites" : "Filter"}</h4>
      </CardTitle>
      <hr className="m-0 border-color-grey" />
      {id ? (
        <>
          <div>
            <div className="mr-2 ml-2 mt-2">
              {statusList &&
                statusList.map((item) => (
                  <h5 key={item.id} className="mr-2 content-inline">
                    <Badge color="dark" className="p-2 mb-2 bg-zodiac">
                      {item.label}
                      <FontAwesomeIcon
                        className="ml-2 cursor-pointer"
                        onClick={() => handleStatusClose(item.id)}
                        size="sm"
                        icon={faTimesCircle}
                      />
                    </Badge>
                  </h5>
                ))}
              {customFiltersList &&
                customFiltersList.map((cf) => (
                  <h5 key={cf.key} className="mr-2 content-inline">
                    <Badge color="dark" className="p-2 mb-2 bg-zodiac">
                      {cf.label}
                      {(cf.type === "text" || cf.type === "id") && (
                        <span>
                          {"  "}
                          &quot;
                          {cf.value}
                          &quot;
                        </span>
                      )}
                      <FontAwesomeIcon
                        className="ml-2 cursor-pointer"
                        onClick={() => handleCustomFilterClose(cf.key)}
                        size="sm"
                        icon={faTimesCircle}
                      />
                    </Badge>
                  </h5>
                ))}
            </div>
            {((statusValues && statusValues.length > 0) ||
              (customFiltersList && customFiltersList.length > 0)) && (
              <div
                aria-hidden="true"
                className="cursor-pointer text-info text-right mr-2 font-weight-800"
                onClick={handleResetClick}
                onKeyDown={handleResetClick}
              >
                Reset Filters
              </div>
            )}
            {((statusValues && statusValues.length > 0) ||
              (customFiltersList && customFiltersList.length > 0)) && (
              <hr className="mt-0 pt-1 mb-2 ml-2 mr-2" />
            )}
            <div
              onScroll={onScroll}
              className={
                sites && sites.length > 9
                  ? "height-100 side-filters-list thin-scrollbar"
                  : ""
              }
            >
              {sites &&
                sites.map((st) => (
                  <Card
                    key={st.id}
                    onClick={() => setViewId(st.id)}
                    className={
                      st.id === currentId
                        ? "mb-2 mr-2 ml-2 border-nepal-1px cursor-pointer"
                        : "cursor-pointer mb-2 mr-2 ml-2"
                    }
                  >
                    <CardBody className="p-2">
                      <Row>
                        <Col md={12} className="nowrap-content">
                          <span className="font-weight-700 ml-2 font-medium">
                            {truncate(st.name, 12)}
                          </span>
                        </Col>
                      </Row>
                      <span className="font-weight-400 mb-1 ml-2 font-tiny">
                        #{st.code}
                      </span>
                      <Row>
                        <Col md={12} className="nowrap-content">
                          <span className="text-info font-weight-600 mb-0 ml-2 font-tiny">
                            {st.res_company_categ_id[1]}
                          </span>
                        </Col>
                      </Row>
                    </CardBody>
                  </Card>
                ))}
              {sitesListInfo && sitesListInfo.err && (
                <Card className="mb-2 mr-2 ml-2 border-nepal-1px">
                  <CardBody className="p-2">
                    <ErrorContent
                      errorTxt={generateErrorMessage(sitesListInfo)}
                    />
                  </CardBody>
                </Card>
              )}

              {userInfo && userInfo.err && (
                <Card className="mb-2 mr-2 ml-2 border-nepal-1px">
                  <CardBody className="p-2">
                    <ErrorContent errorTxt={generateErrorMessage(userInfo)} />
                  </CardBody>
                </Card>
              )}
              {((sitesListInfo && sitesListInfo.loading) ||
                (userInfo && userInfo.loading)) && <Loader />}
            </div>
          </div>
        </>
      ) : (
        <CardBody className="pl-1 p-0 mt-2 position-relative side-filters-list thin-scrollbar">
          <Row className="m-0">
            <Col md="8" xs="8" sm="8" lg="8" className="p-0">
              <p className="m-0 font-weight-800 collapse-heading">BY CITY</p>
            </Col>
            <Col md="4" xs="4" sm="4" lg="4" className="text-right p-0">
              <FontAwesomeIcon
                className="mr-2 cursor-pointer"
                onClick={() => setStatusCollapse(!statusCollapse)}
                size="sm"
                icon={statusCollapse ? faChevronUp : faChevronDown}
              />
            </Col>
          </Row>
          <Collapse isOpen={statusCollapse}>
            {countryGroupsInfo &&
              countryGroupsInfo.data &&
              countryGroupsInfo.data.length > 10 && (
                <FormGroup className="mt-2 mb-2">
                  <Input
                    type="input"
                    name="countrySearchValue"
                    placeholder="Please search a city"
                    onChange={onCountrySearchChange}
                    id="categorySearchValue"
                    className="border-radius-50px"
                  />
                </FormGroup>
              )}
            <div className="pl-1">
              {countryGroupsInfo && countryGroupsInfo.loading && <Loader />}
              {countryGroups &&
                countryGroups.map(
                  (cg) =>
                    cg.city && (
                      <span
                        className="mb-1 d-block font-weight-500"
                        key={cg.city}
                      >
                        <div className="checkbox">
                          <Input
                            type="checkbox"
                            id={`checkboxcgroup${cg.city}`}
                            value={cg.city}
                            name={cg.city}
                            checked={statusValues.some((selectedValue) =>
                              selectedValue.includes(cg.city)
                            )}
                            onChange={handleCheckboxChange}
                          />{" "}
                          <Label htmlFor={`checkboxcgroup${cg.city}`}>
                            <span>{cg.city}</span>
                          </Label>
                        </div>
                      </span>
                    )
                )}
              {countryGroupsInfo && countryGroupsInfo.err && (
                <ErrorContent
                  errorTxt={generateErrorMessage(countryGroupsInfo)}
                />
              )}
            </div>
          </Collapse>
          <hr className="mt-2" />
          {((statusValues && statusValues.length > 0) ||
            (customFiltersList && customFiltersList.length > 0)) && (
            <div
              aria-hidden="true"
              className="float-right cursor-pointer mb-4 mr-2 text-info font-weight-800"
              onClick={handleResetClick}
              onKeyDown={handleResetClick}
            >
              Reset Filters
            </div>
          )}
        </CardBody>
      )}
    </Card>
  );
};

Sidebar.propTypes = {
  offset: PropTypes.number.isRequired,
  id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  statusValue: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
    .isRequired,
  afterReset: PropTypes.func.isRequired,
  sortBy: PropTypes.string.isRequired,
  sortField: PropTypes.string.isRequired,
};

export default Sidebar;
