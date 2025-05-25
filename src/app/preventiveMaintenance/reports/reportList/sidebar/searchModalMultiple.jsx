/* eslint-disable no-nested-ternary */
/* eslint-disable max-len */
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
  ModalFooter,
  CardBody,
} from 'reactstrap';
import {
  Checkbox,
  Button,
  FormControlLabel,
} from "@mui/material";
import * as PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import Pagination from '@material-ui/lab/Pagination';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationCircle } from '@fortawesome/free-solid-svg-icons';

import SuccessAndErrorFormat from '@shared/successAndErrorFormat';
import Loader from '@shared/loading';
import ModalSearch from '@shared/modalSearch';

import {
  getExtraSelectionMultiple, getExtraSelectionMultipleCount,
} from '../../../../helpdesk/ticketService';
import {
  getDefaultNoValue, getPagesCountV2, extractTextObject, extractNameObject,
} from '../../../../util/appUtils';

const useStyles = makeStyles((theme) => ({
  root: {
    '& > *': {
      marginTop: theme.spacing(2),
    },
  },
}));

const searchModalMultiple = (props) => {
  const {
    modelName,
    fields,
    company,
    fieldName,
    afterReset,
    onCategoryChange,
    onSpaceChange,
    oldCategoryValues,
    oldSpaceValues,
    globalCategories,
    onEquipmentChange,
    onSpaceListChange,
    oldEquipValues,
    oldSpaceListValues,
    inspectionassetSpaceInfo,
  } = props;
  const limit = 10;
  const dispatch = useDispatch();
  const classes = useStyles();
  const [searchValue, setSearchValue] = useState('');
  const [offset, setOffset] = useState(0);
  const [page, setPage] = useState(1);
  const [isSearch, setSearch] = useState(false);
  const [categoryData, setCategoryData] = useState([]);
  const [totalData, setTotalData] = useState([]);
  const getOldValues = (field) => {
    let oldValues = '';
    if (fieldName === 'category_ids') {
      oldValues = oldCategoryValues;
    }
    if (field === 'equipment') {
      oldValues = oldEquipValues;
    }
    if (field === 'space') {
      oldValues = oldSpaceListValues;
    }
    if (field === 'location_ids') {
      oldValues = oldSpaceValues;
    }
    return oldValues;
  };

  const [checkedRows, setCheckRows] = useState(getOldValues(fieldName));
  const [isAllChecked, setIsAllChecked] = useState(false);
  const [filteredArray, setFilteredArray] = useState([]);
  const [arrayOnClear, setArrayOnClear] = useState([]);
  const [pageData, setPageData] = useState([]);
  const {
    listDataMultipleInfo, listDataMultipleCountInfo, listDataMultipleCountLoading,
  } = useSelector((state) => state.ticket);

  useEffect(() => {
    if (fieldName === 'category_ids') {
      setCheckRows(oldCategoryValues);
    }
    if (fieldName === 'location_ids') {
      setCheckRows(oldSpaceValues);
    }
    if (fieldName === 'equipment') {
      setCheckRows(oldEquipValues);
    }
    if (fieldName === 'space') {
      const newArr = [...oldSpaceListValues, ...checkedRows];
      setCheckRows([...new Map(newArr.map((item) => [item.id, item])).values()]);
    }
  }, []);

  const getCategories = (data) => {
    let categ_array = [];
    if (data && data.length) {
      categ_array = data.map((categ) => ({
        id: categ,
        name: categ,
      }));
    }
    return categ_array;
  };

  useEffect(() => {
    if (fieldName === 'category_ids' && globalCategories && globalCategories.data && globalCategories.data.length) {
      const equip_categ = getCategories(globalCategories.data[0].category);
      const space_categ = getCategories(globalCategories.data[0].space_category);
      setCategoryData([...space_categ, ...equip_categ]);
      setTotalData([...space_categ, ...equip_categ]);
      setArrayOnClear([...space_categ, ...equip_categ]);
    } else {
      setCategoryData([]);
    }
  }, [globalCategories]);

  useEffect(() => {
    if ((fieldName === 'space' || fieldName === 'equipment') && inspectionassetSpaceInfo && inspectionassetSpaceInfo.data && inspectionassetSpaceInfo.data.length) {
      setCategoryData(inspectionassetSpaceInfo.data);
      setTotalData(inspectionassetSpaceInfo.data);
      setArrayOnClear(inspectionassetSpaceInfo.data);
    } else {
      setCategoryData([]);
    }
  }, [inspectionassetSpaceInfo]);

  useEffect(() => {
    if (modelName && fields && fieldName === 'location_ids') {
      let searchValueMultiple = `[["company_id","in",[${company}]]`;

      if (fieldName === 'location_ids') {
        searchValueMultiple = `${searchValueMultiple},["asset_category_id", "ilike", "Building"],"|","|",["space_name","ilike","${searchValue}"],["path_name","ilike","${searchValue}"],["asset_category_id.name","ilike","${searchValue}"]`;
      }

      searchValueMultiple = `${searchValueMultiple}]`;
      dispatch(getExtraSelectionMultiple(company, modelName, limit, offset, fields, searchValueMultiple));
    }
  }, [modelName, offset, isSearch]);

  useEffect(() => {
    if (modelName && fieldName === 'location_ids') {
      let searchValueMultiple = `[["company_id","in",[${company}]]`;

      if (fieldName === 'location_ids') {
        searchValueMultiple = `${searchValueMultiple},["asset_category_id", "ilike", "Building"],"|","|",["space_name","ilike","${searchValue}"],["path_name","ilike","${searchValue}"],["asset_category_id.name","ilike","${searchValue}"]`;
      }

      searchValueMultiple = `${searchValueMultiple}]`;
      dispatch(getExtraSelectionMultipleCount(company, modelName, fields, searchValueMultiple));
    }
  }, [modelName, isSearch]);

  // const totalDataCount = listDataMultipleCountInfo && listDataMultipleCountInfo.length ? listDataMultipleCountInfo.length : 0;

  const totalDataCount = () => {
    let totalCount = '';
    if (listDataMultipleCountInfo && fieldName === 'location_ids') {
      totalCount = listDataMultipleCountInfo && listDataMultipleCountInfo.length ? listDataMultipleCountInfo.length : 0;
    } else if ((fieldName === 'category_ids' || fieldName === 'space' || fieldName === 'equipment') && totalData) {
      totalCount = totalData && totalData.length ? totalData.length : 0;
    }

    return totalCount;
  };

  const pages = getPagesCountV2(totalDataCount(), limit);

  useEffect(() => {
    if ((fieldName === 'category_ids' || fieldName === 'space' || fieldName === 'equipment') && categoryData && categoryData.length && !offset) {
      let data = [];

      data = categoryData.slice(0, 10);
      setPageData(data);
    }
  }, [fieldName, categoryData, offset]);

  useEffect(() => {
    if ((fieldName === 'category_ids' || fieldName === 'space' || fieldName === 'equipment') && categoryData && offset) {
      setPageData(categoryData);
    }
  }, [categoryData, offset]);

  const handlePageClick = (e, index) => {
    e.preventDefault();
    const offsetValue = (index - 1) * limit;
    setPage(index);
    setOffset(offsetValue);
    setIsAllChecked(false);
    if (fieldName === 'category_ids' || fieldName === 'space' || fieldName === 'equipment') {
      const data = totalData;
      setCategoryData(data.slice(offsetValue, (offsetValue + limit)));
    }
  };

  const onSearchChangeCategory = (e) => {
    setSearchValue(e.target.value);
    let res = [];
    if (fieldName === 'category_ids') {
      res = totalData.filter((obj) => Object.values(obj).some((val) => val.toLowerCase().includes(searchValue.toLowerCase())));
    } else if (fieldName === 'equipment') {
      const { data } = inspectionassetSpaceInfo;
      if (e.target.value && e.target.value.length > 0) {
        const ndata = data.filter((item) => {
          const nameValue = item.name ? item.name.toString().toUpperCase() : '';
          const blockValue = item.block && item.block.space_name ? item.block.space_name.toString().toUpperCase() : '';
          const floorValue = item.floor && item.floor.space_name ? item.floor.space_name.toString().toUpperCase() : '';
          const locValue = item.location_id && item.location_id.path_name ? item.location_id.path_name.toString().toUpperCase() : '';
          const s = e.target.value.toString().toUpperCase();
          return (nameValue.search(s) !== -1 || blockValue.search(s) !== -1 || floorValue.search(s) !== -1 || locValue.search(s) !== -1);
        });
        res = ndata;
      } else {
        res = inspectionassetSpaceInfo.data;
      }
    } else if (fieldName === 'space') {
      res = totalData.filter((obj) => ((obj.space_name.toLowerCase().includes(searchValue.toLowerCase()) || obj.path_name.toLowerCase().includes(searchValue.toLowerCase())) || (obj.space_name.toUpperCase().includes(searchValue.toLowerCase()) || obj.path_name.toUpperCase().includes(searchValue.toLowerCase()))));
    }
    setFilteredArray(res);
    if (e.target.value.length < 2 && e.key === 'Backspace') {
      setSearchValue('');
      setSearch(Math.random());
    }
    if (e.target.value === '') {
      setSearchValue('');
      setTotalData(arrayOnClear);
      setCategoryData(arrayOnClear);
      setSearch(Math.random());
      setPage(1);
      setOffset(0);
    }

    if (e.key === 'Enter') {
      // setSearch(Math.random());
      setCategoryData(res);
      setTotalData(res);
      if (res && !res.length) {
        setPageData(res);
      }
      setPage(1);
      setOffset(0);
    }
  };

  const onSearchChange = (e) => {
    setSearchValue(e.target.value);
    if (e.target.value.length < 2 && e.key === 'Backspace') {
      setSearchValue('');
      setSearch(Math.random());
    }
    if (e.key === 'Enter') {
      setSearch(Math.random());
      setPage(1);
      setOffset(0);
    }
  };

  const onClearCategory = () => {
    setSearchValue('');
    setTotalData(arrayOnClear);
    setCategoryData(arrayOnClear);
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

  const onSearchCategory = () => {
    let res = [];
    if (fieldName === 'category_ids') {
      res = totalData.filter((obj) => Object.values(obj).some((val) => val.toLowerCase().includes(searchValue.toLowerCase())));
    } else if (fieldName === 'equipment') {
      const { data } = inspectionassetSpaceInfo;
      if (searchValue && searchValue.length > 0) {
        const ndata = data.filter((item) => {
          const nameValue = item.name ? item.name.toString().toUpperCase() : '';
          const blockValue = item.block && item.block.space_name ? item.block.space_name.toString().toUpperCase() : '';
          const floorValue = item.floor && item.floor.space_name ? item.floor.space_name.toString().toUpperCase() : '';
          const locValue = item.location_id && item.location_id.path_name ? item.location_id.path_name.toString().toUpperCase() : '';
          const s = searchValue.toString().toUpperCase();
          return (nameValue.search(s) !== -1 || blockValue.search(s) !== -1 || floorValue.search(s) !== -1 || locValue.search(s) !== -1);
        });
        res = ndata;
      } else {
        res = inspectionassetSpaceInfo.data;
      }
    } else if (fieldName === 'space') {
      res = totalData.filter((obj) => obj.space_name.toLowerCase().includes(searchValue.toLowerCase()));
    } else {
      res = totalData.filter((obj) => obj.name.toLowerCase().includes(searchValue.toLowerCase()));
    }
    setCategoryData(res);
    setTotalData(res);
    if (res && !res.length) {
      setPageData(res);
    }
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
      if (fieldName === 'category_ids') {
        onCategoryChange(checkedRows);
      }
      if (fieldName === 'equipment') {
        onEquipmentChange(checkedRows);
      }
      if (fieldName === 'space') {
        onSpaceListChange(checkedRows);
      }
      if (fieldName === 'location_ids') {
        onSpaceChange(checkedRows);
      }
    }
    if (afterReset) afterReset();
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
      const loadData = listDataMultipleInfo && listDataMultipleInfo.data ? listDataMultipleInfo.data : [];
      const data = (fieldName === 'category_ids' || fieldName === 'space' || fieldName === 'equipment') ? totalData : loadData;
      const datas = fieldName === 'equipment' && data.length > 100 ? data.slice(0, 100) : data;
      if (fieldName === 'equipment' && data.length > 100) {
        alert('Equipment can be selected for up to 100 records only.');
      }
      const newArr = [...datas, ...checkedRows];
      setCheckRows([...new Map(newArr.map((item) => [item.id, item])).values()]);
      setIsAllChecked(true);
    } else {
      setCheckRows([]);
      setIsAllChecked(false);
    }
  };

  function getRow(assetData) {
    const tableTr = [];
    for (let i = 0; i < assetData.length; i += 1) {
      tableTr.push(
        <tr key={i}>
          <td className="pt-0 pb-0 pl-2">
            <FormControlLabel
              control={<Checkbox
                id={`checkboxtk${assetData[i].id}`}
                value={JSON.stringify(assetData[i])}
                name={(fieldName !== 'location_ids' || fieldName === 'space') ? assetData[i].name : assetData[i].space_name}
                checked={(fieldName === 'location_ids' || fieldName === 'equipment' || fieldName === 'space') ? checkedRows.some((selectedValue) => parseInt(selectedValue.id) === parseInt(assetData[i].id)) : checkedRows.some((selectedValue) => selectedValue.id.includes(assetData[i].id))}
                onChange={handleTableCellChange}
              />}
            />
          </td>
          {(fieldName === 'category_ids' || fieldName === 'equipment') && (
            <td className="p-2"><span className="font-weight-400">{getDefaultNoValue(assetData[i].name)}</span></td>
          )}
          {(fieldName === 'location_ids') && (
            <>
              <td className="p-2"><span className="font-weight-400">{getDefaultNoValue(assetData[i].space_name)}</span></td>
              <td className="p-2"><span className="font-weight-400">{getDefaultNoValue(assetData[i].path_name)}</span></td>
              <td className="p-2"><span className="font-weight-400">{getDefaultNoValue(extractTextObject(assetData[i].asset_category_id))}</span></td>
            </>
          )}
          {(fieldName === 'space') && (
            <>
              <td className="p-2"><span className="font-weight-400">{getDefaultNoValue(assetData[i].space_name)}</span></td>
              <td className="p-2"><span className="font-weight-400">{getDefaultNoValue(assetData[i].path_name)}</span></td>
            </>
          )}
          {(fieldName === 'equipment') && (
            <>
              <td className="p-2"><span className="font-weight-400">{getDefaultNoValue(extractNameObject(assetData[i].block, 'space_name'))}</span></td>
              <td className="p-2"><span className="font-weight-400">{getDefaultNoValue(extractNameObject(assetData[i].floor, 'space_name'))}</span></td>
              <td className="p-2"><span className="font-weight-400">{getDefaultNoValue(extractNameObject(assetData[i].location_id, 'path_name'))}</span></td>
            </>
          )}
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
                  {/* <ModalSearch
                    searchValue={searchValue}
                    onSearchChange={onSearchChange}
                    onClear={onClear}
                    onSearch={onSearch}
                  /> */}
                  {fieldName === 'category_ids' || fieldName === 'space' || fieldName === 'equipment' ? (
                    <ModalSearch
                      searchValue={searchValue}
                      onSearchChange={onSearchChangeCategory}
                      onClear={onClearCategory}
                      onSearch={onSearchCategory}
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
                {((listDataMultipleInfo && listDataMultipleInfo.data) || (fieldName === 'category_ids' && globalCategories && globalCategories.loading === false) || ((fieldName === 'space' || fieldName === 'equipment') && inspectionassetSpaceInfo && inspectionassetSpaceInfo.loading === false)) && (
                  <Table responsive>
                    <thead className="bg-gray-light">
                      <tr>
                        <th className="pt-0 pb-0 pl-2">
                          {(fieldName !== 'category_ids') && (
                            <FormControlLabel
                              control={<Checkbox
                                id={`checkboxtkhead1`}
                                value={'all'}
                                name={'checkall'}
                                checked={isAllChecked}
                                onChange={handleTableCellAllChange}
                              />}
                            />
                          )}
                        </th>
                        {(fieldName === 'category_ids' || fieldName === 'equipment') && (
                          <th className="min-width-100">
                            Name
                          </th>
                        )}
                        {(fieldName === 'location_ids') && (
                          <>
                            <th className="min-width-100">
                              Space Name
                            </th>
                            <th className="min-width-100">
                              Path Name
                            </th>
                            <th className="min-width-100">
                              Category
                            </th>
                          </>
                        )}
                        {(fieldName === 'space') && (
                          <>
                            <th className="min-width-100">
                              Space Name
                            </th>
                            <th className="min-width-100">
                              Path Name
                            </th>
                          </>
                        )}
                        {(fieldName === 'equipment') && (
                          <>
                            <th className="p-2 min-width-100">
                              Block
                            </th>
                            <th className="p-2 min-width-100">
                              Floor
                            </th>
                            <th className="p-2 min-width-160">
                              Location
                            </th>
                          </>
                        )}
                      </tr>
                    </thead>
                    <tbody>
                      {/* {getRow(listDataMultipleInfo && listDataMultipleInfo.data ? listDataMultipleInfo.data : [])} */}
                      {(globalCategories !== undefined && (fieldName === 'category_ids')) ? getRow(pageData) : (inspectionassetSpaceInfo !== undefined && (fieldName === 'space' || fieldName === 'equipment')) ? getRow(pageData) : getRow(listDataMultipleInfo && listDataMultipleInfo.data ? listDataMultipleInfo.data : [])}
                    </tbody>
                  </Table>
                )}
              </div>
              {loading || pages === 0 ? (<span />) : (
                <div className={`${classes.root} float-right`}>
                  <Pagination count={pages} page={page} size="small" color="primary" onChange={handlePageClick} showFirstButton showLastButton />
                </div>
              )}

              {((listDataMultipleInfo && listDataMultipleInfo.loading) || (globalCategories && globalCategories.loading) || (inspectionassetSpaceInfo && inspectionassetSpaceInfo.loading)) && (
                <Loader />
              )}
              {(listDataMultipleInfo && listDataMultipleInfo.err) && (
                <SuccessAndErrorFormat response={listDataMultipleInfo} />
              )}
              {(fieldName === 'space' || fieldName === 'equipment') && (searchValue && searchValue !== '' && filteredArray && filteredArray.length <= 0) && (
                <div className="text-danger text-center mt-3">
                  <FontAwesomeIcon className="mr-2 font-size20 mb-n2px" size="lg" icon={faExclamationCircle} />
                  No Data
                </div>
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
              variant="contained"
            >
              {' '}
              Add
            </Button>
          ) : ''}
      </ModalFooter>
    </>
  );
};

searchModalMultiple.propTypes = {
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
  // eslint-disable-next-line react/forbid-prop-types
  oldCategoryValues: PropTypes.array.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  oldSpaceValues: PropTypes.array.isRequired,
  afterReset: PropTypes.func.isRequired,
  onCategoryChange: PropTypes.func.isRequired,
  onSpaceChange: PropTypes.func.isRequired,
};

export default searchModalMultiple;
