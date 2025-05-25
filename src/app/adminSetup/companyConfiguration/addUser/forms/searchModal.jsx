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
  // Button,
  ModalFooter,
  CardBody,
} from 'reactstrap';
import {
  Checkbox,
  Button,
} from '@mui/material';
import * as PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import Pagination from '@material-ui/lab/Pagination';
import ModalSearch from '@shared/modalSearch';
import uniqBy from 'lodash/unionBy';

import SuccessAndErrorFormat from '@shared/successAndErrorFormat';
import Loader from '@shared/loading';

import {
  getExtraSelectionMultiple, getExtraSelectionMultipleCount,
} from '../../../../helpdesk/ticketService';
import {
  getDefaultNoValue, getPagesCountV2} from '../../../../util/appUtils';

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
    otherFieldName,
    placeholderName,
    afterReset,
    setFieldValue,
    userCompanies,
    allowedCompanies,
    onCompanyChange,
    company_ids,
    setAssociateEntity,
    associatesTo,
    setSelectedDataz,
  } = props;
  const limit = 50;
  const dispatch = useDispatch();
  const classes = useStyles();
  const [searchValue, setSearchValue] = useState('');
  const [offset, setOffset] = useState(0);
  const [page, setPage] = useState(1);
  const [isSearch, setSearch] = useState(false);
  const [selectedId, setSelected] = useState('');
  const [totalData, setTotalData] = useState([]);
  const [companyData, setCompanyData] = useState([]);
  const [arrayOnClear, setArrayOnClear] = useState([]);
  const [pageData, setPageData] = useState([]);
  const [checkedRows, setCheckRows] = useState([]);
  const [isAllChecked, setIsAllChecked] = useState(false);
  const {
    listDataMultipleInfo, listDataMultipleCountInfo, listDataMultipleCountLoading,
  } = useSelector((state) => state.ticket);
  const { userInfo } = useSelector((state) => state.user);

  useEffect(() => {
    if (fieldName === 'company_ids') {
      setCheckRows([]);
    }
  }, []);

  const getCompanies = (data) => {
    let company_array = [];
    if (data && data.length) {
      company_array = data.map((company) => ({
        id: company.id,
        name: company.name,
      }));
    }
    return company_array;
  };

  useEffect(() => {
    // if (fieldName === 'company_ids' && allowedCompanies && allowedCompanies.data) {
    //   const companies = getCompanies(allowedCompanies.data.allowed_companies);
    if (fieldName === 'company_ids' && allowedCompanies && allowedCompanies.length) {
      const companies = getCompanies(allowedCompanies);
      setCompanyData(companies);
      setTotalData(companies);
      setArrayOnClear(companies);
    } else {
      setCompanyData([]);
    }
  }, [allowedCompanies]);

  useEffect(() => {
    if (modelName && fields) {
      let searchValueMultiple = '[';

      if (fieldName !== 'user_role_id' && fieldName !== 'default_user_role_id' && fieldName !== 'company_ids' && fieldName !== 'hr_department') {
        searchValueMultiple = `${searchValueMultiple}["company_id","in",[${company}]]`;
      }

      if (fieldName === 'vendor_id' && fieldName !== 'company_ids') {
        searchValueMultiple = `${searchValueMultiple},["${otherFieldName}","=",true]`;
        if (searchValue) {
          searchValueMultiple = `${searchValueMultiple},"|","|",["name","ilike","${searchValue}"],["mobile","ilike","${searchValue}"],["email","ilike","${searchValue}"]`;
        }
      }

      if (searchValue && fieldName !== 'vendor_id' && fieldName !== 'user_role_id' && fieldName !== 'default_user_role_id' && fieldName !== 'company_ids') {
        searchValueMultiple = `${searchValueMultiple},["name","ilike","${searchValue}"]`;
      }

      if (searchValue && (fieldName === 'user_role_id' || fieldName === 'default_user_role_id' && fieldName !== 'company_ids')) {
        searchValueMultiple = `${searchValueMultiple}["name","ilike","${searchValue}"]`;
      }

      searchValueMultiple = `${searchValueMultiple}]`;
      dispatch(getExtraSelectionMultiple(company, modelName, limit, offset, fields, searchValueMultiple));
    }
  }, [modelName, offset, isSearch]);

  useEffect(() => {
    if (modelName) {
      let searchValueMultiple = '[';

      if (fieldName !== 'user_role_id' && fieldName !== 'default_user_role_id' && fieldName !== 'company_ids' && fieldName !== 'hr_department') {
        searchValueMultiple = `${searchValueMultiple}["company_id","in",[${company}]]`;
      }

      if (fieldName === 'vendor_id' && fieldName !== 'company_ids') {
        searchValueMultiple = `${searchValueMultiple},["${otherFieldName}","=",true]`;
        if (searchValue) {
          searchValueMultiple = `${searchValueMultiple},"|","|",["name","ilike","${searchValue}"],["mobile","ilike","${searchValue}"],["email","ilike","${searchValue}"]`;
        }
      }

      if (searchValue && fieldName !== 'vendor_id' && fieldName !== 'user_role_id' && fieldName !== 'default_user_role_id' && fieldName !== 'company_ids') {
        searchValueMultiple = `${searchValueMultiple},["name","ilike","${searchValue}"]`;
      }

      if (searchValue && (fieldName === 'user_role_id' || fieldName === 'default_user_role_id' && fieldName !== 'company_ids')) {
        searchValueMultiple = `${searchValueMultiple}["name","ilike","${searchValue}"]`;
      }

      searchValueMultiple = `${searchValueMultiple}]`;
      dispatch(getExtraSelectionMultipleCount(company, modelName, fields, searchValueMultiple));
    }
  }, [modelName, isSearch]);

  // const totalDataCount = listDataMultipleCountInfo && listDataMultipleCountInfo.length ? listDataMultipleCountInfo.length : 0;

  const totalDataCount = () => {
    let totalCount = '';
    if (listDataMultipleCountInfo && fieldName !== 'company_ids') {
      totalCount = listDataMultipleCountInfo && listDataMultipleCountInfo.length ? listDataMultipleCountInfo.length : 0;
    } else if (fieldName === 'company_ids' && totalData) {
      totalCount = totalData && totalData.length ? totalData.length : 0;
    }

    return totalCount;
  };

  const pages = getPagesCountV2(totalDataCount(), limit);

  useEffect(() => {
    if (fieldName === 'company_ids' && companyData && companyData.length && !offset) {
      let data = [];

      data = companyData.slice(0, 10); 
      setPageData(data);
    }
  }, [fieldName, companyData, offset]);

  useEffect(() => {
    if (fieldName === 'company_ids' && companyData && offset) {
      setPageData(companyData);
    }
  }, [companyData, offset]);

  // useEffect(() => {
  //   if(company_ids && company_ids.length && totalData){
  //     const matchedObjects = totalData.filter(obj2 => {
  //       return company_ids.some(obj1 => obj1.id === obj2.id);
  //     });

  //     setCheckRows(matchedObjects);
  //   }
  // },[company_ids,totalData])

  const handlePageClick = (e, index) => {
    e.preventDefault();
    const offsetValue = (index - 1) * limit;
    setPage(index);
    setOffset(offsetValue);
    if (fieldName === 'company_ids') {
      const data = totalData;
      setCompanyData(data.slice(offsetValue, (offsetValue + limit)));
    }
  };

  const onSearchChange = (e) => {
    setSearchValue(e.target.value);
    if (e.key === 'Enter') {
      setSearch(Math.random());
      setPage(1);
      setOffset(0);
    }
  };

  const onSearchChangeCompany = (e) => {
    setSearchValue(e.target.value);
    const res = totalData.filter((obj) => obj.name.toLowerCase().includes(searchValue));
    if (e.target.value === '') {
      setSearchValue('');
      setTotalData(arrayOnClear);
      setCompanyData(arrayOnClear);
      setSearch(Math.random());
      setPage(1);
      setOffset(0);
    }
    if (e.key === 'Enter') {
      // setSearch(Math.random());
      setCompanyData(res);
      setTotalData(res);
      if (res && !res.length) {
        setPageData(res);
      }

      setPage(1);
      setOffset(0);
    }
  };

  function onSearchChangeIcon() {
    if (searchValue) {
      const res = totalData.filter((obj) => obj.name.toLowerCase().includes(searchValue));
      setCompanyData(res);
      setTotalData(res);
      if (res && !res.length) {
        setPageData(res);
      }
      setPage(1);
      setOffset(0);
    }
  }

  const handleRowClick = (data) => {
    setSelected(data.id);
    setFieldValue(fieldName, data);
    if (associatesTo === 'Client') {
      setAssociateEntity(data);
    } else if (associatesTo === 'Vendor' || associatesTo === 'Tenant') {
      setAssociateEntity(data);
    }
    if (afterReset) afterReset();
  };

  const handleAdd = () => {
    if (company_ids && company_ids.length && checkedRows) {
      const array = [];
      array.push(...company_ids, ...checkedRows);
      const data = uniqBy(array, 'id');
      onCompanyChange(data);
    } else if (checkedRows) {
      onCompanyChange(checkedRows);
    }

    // if (checkedRows) {
    //     onCompanyChange(checkedRows);
    // }
    if (afterReset) afterReset();
  };

  const onClearCategory = () => {
    setSearchValue('');
    setTotalData(arrayOnClear);
    setCompanyData(arrayOnClear);
    setSearch(Math.random());
    setPage(1);
    setOffset(0);
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

  const handleTableCellChange = (event) => {
    const { checked, value } = event.target;
    const values = JSON.parse(value);
    if (checked) {
      setCheckRows((state) => [...state, values]);
      if ((checkedRows && checkedRows.length + 1 === 10) || (checkedRows && checkedRows.length + 1 === totalDataCount())) {
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
      const data = fieldName !== 'company_ids' ? listDataMultipleInfo && listDataMultipleInfo.data ? listDataMultipleInfo.data : [] : totalData;
      const newArr = [...data, ...checkedRows];
      setCheckRows([...new Map(newArr.map((item) => [item.id, item])).values()]);
      setIsAllChecked(true);
    } else {
      setCheckRows([]);
      setIsAllChecked(false);
    }
  };

  function getRowForSites(assetData) {
    //const data = differenceArray(companyData, company_ids);
    const tableTr = [];
    for (let i = 0; i < assetData.length; i += 1) {
      tableTr.push(
        <tr key={i}>
          <td className="w-5">
            {/* <div className="checkbox">
             <Input
                type="checkbox"
                value={JSON.stringify(assetData[i])}
                id={`checkboxtk${assetData[i].id}`}
                className="ml-0"
                name={assetData[i].name}
                checked={checkedRows.some((selectedValue) => parseInt(selectedValue.id) === parseInt(assetData[i].id))}
                onChange={handleTableCellChange}
              />
              <Label htmlFor={`checkboxtk${assetData[i].id}`} />
            </div> */}
            <Checkbox
              sx={{
                transform: 'scale(0.9)',
                padding: '0px',
              }}
              disabled={company_ids.some((selectedValue) => parseInt(selectedValue.id) === parseInt(assetData[i].id))}
              id={`checkboxtk${assetData[i].id}`}
              value={JSON.stringify(assetData[i])}
              name={assetData[i].name}
              checked={checkedRows.some((selectedValue) => parseInt(selectedValue.id) === parseInt(assetData[i].id))}
              onChange={handleTableCellChange}
            />
          </td>
          <td className="p-3"><span className="font-weight-400">{getDefaultNoValue(assetData[i].name)}</span></td>
        </tr>,
      );
    }
    return tableTr;
  }

  function getRow(assetData) {
    const tableTr = [];
    for (let i = 0; i < assetData.length; i += 1) {
      tableTr.push(
        <tr className={selectedId === assetData[i].id ? 'text-info cursor-pointer' : 'cursor-pointer'} onClick={() => handleRowClick(assetData[i])} key={i}>

          <td className="p-2"><span className="font-weight-400">{getDefaultNoValue(assetData[i].name)}</span></td>
          {fieldName === 'vendor_id' && (
            <>
              <td className="p-2"><span className="font-weight-400">{getDefaultNoValue(assetData[i].mobile)}</span></td>
              <td className="p-2"><span className="font-weight-400">{getDefaultNoValue(assetData[i].email)}</span></td>
            </>
          )}
        </tr>,
      );
    }
    return tableTr;
  }

  const loading = (listDataMultipleInfo && listDataMultipleInfo.loading) || (listDataMultipleCountLoading) || (allowedCompanies && allowedCompanies.loading);

  return (
    <>
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
                      {totalDataCount()}
                    </span>
                  </div>
                </Col>

                <Col sm="12" md="5" lg="5" xs="12" className="text-right">
                  {fieldName === 'company_ids' ? (
                    <ModalSearch
                      searchValue={searchValue}
                      onSearchChange={onSearchChangeCompany}
                      onClear={onClearCategory}
                      onSearch={onSearchChangeIcon}
                    />
                  ) : (
                    <ModalSearch
                      searchValue={searchValue}
                      onSearchChange={onSearchChange}
                      onClear={onClear}
                      onSearch={onSearch}
                    />
                  )}
                </Col>
              </Row>
              <div className="pl-1 pr-1 pt-0 comments-list thin-scrollbar">
                {((listDataMultipleInfo && listDataMultipleInfo.data) || (fieldName === 'company_ids' && allowedCompanies && allowedCompanies.loading === false)) && (
                  <Table responsive>
                    <thead className="bg-gray-light">
                      <tr>
                        {fieldName === 'company_ids' && allowedCompanies && allowedCompanies.length && (
                        <th className="w-5 p-2">
                          {/* <div className="checkbox">
                            <Input
                              type="checkbox"
                              value="all"
                              className="m-0 position-relative"
                              name="checkall"
                              id="checkboxtkhead1"
                              checked={isAllChecked}
                              onChange={handleTableCellAllChange}
                            />
                            <Label htmlFor="checkboxtkhead1" />
                          </div> */}
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
                        )}
                        <th className="p-2 min-width-100">
                          Name
                        </th>
                        {fieldName === 'vendor_id' && (
                          <>
                            <th className="p-2 min-width-100">
                              Mobile
                            </th>
                            <th className="p-2 min-width-100">
                              Email
                            </th>
                          </>
                        )}
                      </tr>
                    </thead>
                    <tbody>
                      {(fieldName === 'company_ids' && allowedCompanies && allowedCompanies.length) ? getRowForSites(pageData) : getRow(listDataMultipleInfo && listDataMultipleInfo.data ? listDataMultipleInfo.data : [])}
                      {/* {getRow(listDataMultipleInfo && listDataMultipleInfo.data ? listDataMultipleInfo.data : [])} */}
                    </tbody>
                  </Table>
                )}
              </div>
              {loading || pages === 0 ? (<span />) : (
                <div className={`${classes.root} float-right`}>
                  <Pagination count={pages} page={page} size="small" color="primary" onChange={handlePageClick} showFirstButton showLastButton />
                </div>
              )}
              {(listDataMultipleInfo && listDataMultipleInfo.loading) || (allowedCompanies && allowedCompanies.loading) && (
                <Loader />
              )}
              {(listDataMultipleInfo && listDataMultipleInfo.err) && (
                <SuccessAndErrorFormat response={listDataMultipleInfo} />
              )}
            </CardBody>
          </Card>
        </Col>
      </Row>
      <ModalFooter>
        {(checkedRows && checkedRows.length && checkedRows.length > 0)
          ? (
            <Button
              type="button"
              size="sm"
              onClick={() => handleAdd()}
              //  variant="contained"
              variant="contained"
              className="submit-btn-auto"
            >
              {' '}
              Add
            </Button>
          ) : ''}
      </ModalFooter>
    </>
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
  otherFieldName: PropTypes.oneOfType([
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
  onCompanyChange: PropTypes.func.isRequired,

};

export default SearchModal;
