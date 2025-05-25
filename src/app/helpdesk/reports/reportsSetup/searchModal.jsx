/* eslint-disable react/forbid-prop-types */
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
import * as PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import Pagination from '@material-ui/lab/Pagination';
import Checkbox from '@mui/material/Checkbox';

import SuccessAndErrorFormat from '@shared/successAndErrorFormat';
import Loader from '@shared/loading';
import ModalSearch from '@shared/modalSearch';

import { Button } from '@mui/material';
import { getDefaultNoValue, getPagesCountV2 } from '../../../util/appUtils';

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
    onCatChange,
    onCompanyChange,
    onRegionChange,
    oldCategoryValues,
    oldRegValues,
    oldComValues,
    globalCategories,
    subCatOptions,
    regionOptions,
    companyOptions,
    onEquipmentChange,
    onSpaceListChange,
    oldCatValues,
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
  const [pageData, setPageData] = useState([]);

  const [subCategoryData, setSubCategoryData] = useState([]);
  const [subTotalData, setSubTotalData] = useState([]);
  const [subPageData, setSubPageData] = useState([]);
  const [subSearchValue, setSubSearchValue] = useState('');

  const [comCategoryData, setComCategoryData] = useState([]);
  const [comTotalData, setComTotalData] = useState([]);
  const [comPageData, setComPageData] = useState([]);
  const [comSearchValue, setComSearchValue] = useState('');

  const [regCategoryData, setRegCategoryData] = useState([]);
  const [regTotalData, setRegTotalData] = useState([]);
  const [regPageData, setRegPageData] = useState([]);
  const [regSearchValue, setRegSearchValue] = useState('');

  const getOldValues = (field) => {
    let oldValues = '';
    if (fieldName === 'sub_category_id') {
      oldValues = oldCategoryValues;
    }
    if (field === 'category_id') {
      oldValues = oldCatValues;
    }
    if (field === 'company_id') {
      oldValues = oldComValues;
    }
    if (field === 'region_id') {
      oldValues = oldRegValues;
    }
    return oldValues;
  };

  const [checkedRows, setCheckRows] = useState(getOldValues(fieldName));
  const [isAllChecked, setIsAllChecked] = useState(false);
  const [filteredArray, setFilteredArray] = useState([]);
  const [arrayOnClear, setArrayOnClear] = useState([]);
  const [newDataSelected, setNewDataSelected] = useState(false);
  const {
    listDataMultipleInfo, listDataMultipleCountLoading,
  } = useSelector((state) => state.ticket);

  useEffect(() => {
    if (fieldName === 'sub_category_id') {
      setCheckRows(oldCategoryValues);
    }
    if (fieldName === 'category_id') {
      setCheckRows(oldCatValues);
    }
    if (fieldName === 'company_id') {
      setCheckRows(oldComValues);
    }
    if (fieldName === 'region_id') {
      setCheckRows(oldRegValues);
    }
  }, []);

  const getCategories = (data) => {
    let categ_array = [];
    categ_array = Object.entries(data);
    if (data && data.length) {
      categ_array = data.map((categ) => ({
        id: categ.id,
        name: categ.name,
      }));
    }
    return categ_array;
  };

  useEffect(() => {
    if ((fieldName === 'category_id') && globalCategories && globalCategories.data && globalCategories.data.length) {
      const categ = getCategories(globalCategories.data);
      setCategoryData(categ);
      setTotalData(categ);
      setArrayOnClear(categ);
    } else {
      setCategoryData([]);
    }
  }, [globalCategories]);

  useEffect(() => {
    if (fieldName === 'sub_category_id' && subCatOptions && subCatOptions.length) {
      const categ = getCategories(subCatOptions);
      setSubCategoryData(categ);
      setSubTotalData(categ);
      setArrayOnClear(categ);
    } else {
      setSubCategoryData('');
    }
  }, [globalCategories]);

  useEffect(() => {
    if (fieldName === 'company_id' && companyOptions && companyOptions.length) {
      const categ = getCategories(companyOptions);
      setComCategoryData(categ);
      setComTotalData(categ);
      setArrayOnClear(categ);
    } else {
      setComCategoryData('');
    }
  }, [globalCategories]);

  useEffect(() => {
    if (fieldName === 'region_id' && regionOptions && regionOptions.length) {
      const categ = regionOptions;
      setRegCategoryData(categ);
      setRegTotalData(categ);
      setArrayOnClear(categ);
    } else {
      setRegCategoryData('');
    }
  }, [globalCategories]);

  const totalDataCount = () => {
    let totalCount = '';
    if (subTotalData && fieldName === 'sub_category_id') {
      totalCount = subTotalData && subTotalData.length ? subTotalData.length : 0;
    } else if ((fieldName === 'category_id') && totalData) {
      totalCount = totalData && totalData.length ? totalData.length : 0;
    } else if ((fieldName === 'company_id') && comTotalData) {
      totalCount = comTotalData && comTotalData.length ? comTotalData.length : 0;
    } else if ((fieldName === 'region_id') && regTotalData) {
      totalCount = regTotalData && regTotalData.length ? regTotalData.length : 0;
    }

    return totalCount;
  };

  const pages = getPagesCountV2(totalDataCount(), limit);

  useEffect(() => {
    if ((fieldName === 'sub_category_id') && subCategoryData && subCategoryData.length && !offset) {
      let data = [];

      data = subCategoryData.slice(0, 10);
      setSubPageData(data);
    }
    if ((fieldName === 'category_id') && categoryData && categoryData.length && !offset) {
      let data = [];

      data = categoryData.slice(0, 10);
      setPageData(data);
    }
    if ((fieldName === 'company_id') && comCategoryData && comCategoryData.length && !offset) {
      let data = [];

      data = comCategoryData.slice(0, 10);
      setComPageData(data);
    }
    if ((fieldName === 'region_id') && regCategoryData && regCategoryData.length && !offset) {
      let data = [];

      data = regCategoryData.slice(0, 10);
      setRegPageData(data);
    }
  }, [fieldName, categoryData, comCategoryData, regCategoryData, subCategoryData, offset]);

  useEffect(() => {
    if ((fieldName === 'sub_category_id') && subCategoryData && offset) {
      setSubPageData(subCategoryData);
    }
    if ((fieldName === 'category_id') && categoryData && offset) {
      setPageData(categoryData);
    }
    if ((fieldName === 'company_id') && comCategoryData && offset) {
      setComPageData(comCategoryData);
    }
    if ((fieldName === 'region_id') && regCategoryData && offset) {
      setRegPageData(regCategoryData);
    }
  }, [categoryData, comCategoryData, regCategoryData, subCategoryData, offset]);

  const handlePageClick = (e, index) => {
    e.preventDefault();
    const offsetValue = (index - 1) * limit;
    setPage(index);
    setOffset(offsetValue);
    setIsAllChecked(false);
    if (fieldName === 'sub_category_id') {
      const data = subTotalData;
      setSubCategoryData(data.slice(offsetValue, (offsetValue + limit)));
    }
    if (fieldName === 'category_id') {
      const data = totalData;
      setCategoryData(data.slice(offsetValue, (offsetValue + limit)));
    }
    if (fieldName === 'company_id') {
      const data = comTotalData;
      setComCategoryData(data.slice(offsetValue, (offsetValue + limit)));
    }
    if (fieldName === 'region_id') {
      const data = regTotalData;
      setRegCategoryData(data.slice(offsetValue, (offsetValue + limit)));
    }
  };


  const onSearchChangeCategory = (e) => {
    setSearchValue(e.target.value);
    setSubSearchValue(e.target.value);
    setComSearchValue(e.target.value);
    setRegSearchValue(e.target.value);
    let res = [];
    if (fieldName === 'category_id') {
      res = totalData.filter((obj) => obj.name.toLowerCase().includes(searchValue) || obj.name.toUpperCase().includes(searchValue));
    }
    if (fieldName === 'sub_category_id') {
      res = subTotalData.filter((obj) => obj.name.toLowerCase().includes(subSearchValue) || obj.name.toUpperCase().includes(subSearchValue));
    }
    if (fieldName === 'company_id') {
      res = comTotalData.filter((obj) => obj.name.toLowerCase().includes(comSearchValue) || obj.name.toUpperCase().includes(comSearchValue));
    }
    if (fieldName === 'region_id') {
      res = regTotalData.filter((obj) => obj.name.toLowerCase().includes(regSearchValue) || obj.name.toUpperCase().includes(regSearchValue));
    }
    {/* setFilteredArray(res);
    setCategoryData(res);
    if (e.target.value === '') {
      setSearchValue('');
      setTotalData(arrayOnClear);
      setCategoryData(arrayOnClear);
      setSearch(Math.random());
      setPage(1);
      setOffset(0);
    }
  */}
    if (e.key === 'Enter') {
      if (fieldName === 'category_id') {
        setCategoryData(res);
        setTotalData(res);
        if (res && !res.length) {
          setPageData(res);
        }
      }
      if (fieldName === 'sub_category_id') {
        setSubCategoryData(res);
        setSubTotalData(res);
        if (res && !res.length) {
          setSubPageData(res);
        }
      }
      if (fieldName === 'company_id') {
        setComCategoryData(res);
        setComTotalData(res);
        if (res && !res.length) {
          setComPageData(res);
        }
      }
      if (fieldName === 'region_id') {
        setRegCategoryData(res);
        setRegTotalData(res);
        if (res && !res.length) {
          setRegPageData(res);
        }
      }
      setPage(1);
      setOffset(0);
    }
  };

  const onClearCategory = () => {
    setSearchValue('');
    setTotalData(arrayOnClear);
    setCategoryData(arrayOnClear);
    setSubSearchValue('');
    setSubTotalData(arrayOnClear);
    setSubCategoryData(arrayOnClear);
    setComSearchValue('');
    setComTotalData(arrayOnClear);
    setComCategoryData(arrayOnClear);
    setRegSearchValue('');
    setRegTotalData(arrayOnClear);
    setRegCategoryData(arrayOnClear);
    setSearch(Math.random());
    setPage(1);
    setOffset(0);
  };

  const onSearchCategory = () => {
    let res = [];
    if (fieldName === 'category_id') {
      res = totalData.filter((obj) => obj.name.toLowerCase().includes(searchValue) || obj.name.toUpperCase().includes(searchValue));
    }
    if (fieldName === 'sub_category_id') {
      res = subTotalData.filter((obj) => obj.name.toLowerCase().includes(subSearchValue) || obj.name.toUpperCase().includes(subSearchValue));
    }
    if (fieldName === 'company_id') {
      res = comTotalData.filter((obj) => obj.name.toLowerCase().includes(comSearchValue) || obj.name.toUpperCase().includes(comSearchValue));
    }
    if (fieldName === 'region_id') {
      res = regTotalData.filter((obj) => obj.name.toLowerCase().includes(regSearchValue) || obj.name.toUpperCase().includes(regSearchValue));
    }
    {/* setCategoryData(res);
    setTotalData(res);
    if (res && !res.length) {
      setPageData(res);
    } */}
    if (fieldName === 'category_id') {
      setCategoryData(res);
      setTotalData(res);
      if (res && !res.length) {
        setPageData(res);
      }
    }
    if (fieldName === 'sub_category_id') {
      setSubCategoryData(res);
      setSubTotalData(res);
      if (res && !res.length) {
        setSubPageData(res);
      }
    }
    if (fieldName === 'company_id') {
      setComCategoryData(res);
      setComTotalData(res);
      if (res && !res.length) {
        setComPageData(res);
      }
    }
    if (fieldName === 'region_id') {
      setRegCategoryData(res);
      setRegTotalData(res);
      if (res && !res.length) {
        setRegPageData(res);
      }
    }
    setPage(1);
    setOffset(0);
  };

  const handleAdd = () => {
    if (checkedRows) {
      if (fieldName === 'sub_category_id') {
        onCategoryChange(checkedRows);
      }
      if (fieldName === 'category_id') {
        onCatChange(checkedRows);
      }
      if (fieldName === 'company_id') {
        onCompanyChange(checkedRows);
      }
      if (fieldName === 'region_id') {
        onRegionChange(checkedRows);
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
      setNewDataSelected(true);
    } else {
      setCheckRows(checkedRows.filter((item) => item.id !== values.id));
      setIsAllChecked(false);
      setNewDataSelected(checkedRows.some((item) => item.id !== values.id));
    }
  };

  const handleTableCellAllChange = (event) => {
    const { checked } = event.target;
    if (checked) {
      const data = fieldName === 'category_id' ? pageData : fieldName === 'sub_category_id' ? subTotalData : fieldName === 'company_id' ? comTotalData : fieldName === 'region_id' ? regTotalData : [];
      const newArr = [...data, ...checkedRows];
      setCheckRows([...new Map(newArr.map((item) => [item.id, item])).values()]);
      setIsAllChecked(true);
      setNewDataSelected(true);
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
          <td className="w-5">
            <Checkbox
              id={`checkboxtk${assetData[i].id}`}
              className="ml-0"
              name={assetData[i].name}
              value={JSON.stringify(assetData[i])}
              checked={checkedRows && checkedRows.find((selectedValue) => parseInt(selectedValue.id) === parseInt(assetData[i].id)) ? true : false}
              onChange={handleTableCellChange}
            />
          </td>
          {(fieldName === 'sub_category_id' || fieldName === 'category_id' || fieldName === 'company_id' || fieldName === 'region_id') && (
            <td className="pt-4"><span className="font-weight-400">{getDefaultNoValue(assetData[i].name)}</span></td>
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
                  <ModalSearch
                    searchValue={searchValue}
                    onSearchChange={onSearchChangeCategory}
                    onClear={onClearCategory}
                    onSearch={onSearchCategory}
                  />
                </Col>
              </Row>
              <div className="pl-1 pr-1 pt-0 comments-list thin-scrollbar">
                {((fieldName === 'sub_category_id' && subCatOptions) || ((fieldName === 'category_id') && globalCategories) || ((fieldName === 'company_id') && companyOptions) || ((fieldName === 'region_id') && regionOptions)) && (
                  <Table responsive>
                    <thead className="bg-gray-light">
                      <tr>
                        <th className="w-5">
                          <Checkbox
                            name="checkall"
                            id="checkboxtkhead1"
                            value="all"
                            checked={isAllChecked}
                            onChange={handleTableCellAllChange}
                          />
                        </th>
                        {(fieldName === 'sub_category_id' || fieldName === 'category_id' || fieldName === 'company_id' || fieldName === 'region_id') && (
                          <th className="pb-4 min-width-100">
                            Name
                          </th>
                        )}
                      </tr>
                    </thead>
                    <tbody>
                      {(globalCategories !== undefined && (fieldName === 'category_id')) ? getRow(pageData) : (subCatOptions !== undefined && (fieldName === 'sub_category_id')) ? getRow(subPageData) : (companyOptions !== undefined && (fieldName === 'company_id')) ? getRow(comPageData) : (regionOptions !== undefined && (fieldName === 'region_id')) ? getRow(regPageData) : []}
                    </tbody>
                  </Table>
                )}
              </div>
              {loading || pages === 0 ? (<span />) : (
                <div className={`${classes.root} float-right`}>
                  <Pagination count={pages} page={page} size="small" color="primary" onChange={handlePageClick} showFirstButton showLastButton />
                </div>
              )}

              {((globalCategories && globalCategories.loading)) && (
                <Loader />
              )}
              {globalCategories && globalCategories.err && (
                <SuccessAndErrorFormat response={globalCategories} />
              )}
            </CardBody>
          </Card>
        </Col>
      </Row>
      <ModalFooter>
        {newDataSelected && ((totalDataCount() !== 0) && checkedRows && checkedRows.length && checkedRows.length > 0)
          ? (
            <Button
              onClick={() => handleAdd()}
              className='apply-btn'
              style={{ width: '50px' }}
              variant='contained'
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
  oldRegValues: PropTypes.array.isRequired,
  oldComValues: PropTypes.array.isRequired,
  oldSpaceValues: PropTypes.array.isRequired,
  afterReset: PropTypes.func.isRequired,
  onCategoryChange: PropTypes.func.isRequired,
  onCatChange: PropTypes.func.isRequired,
  onSpaceChange: PropTypes.func.isRequired,
  onRegionChange: PropTypes.func.isRequired,
  onCompanyChange: PropTypes.func.isRequired,
};

export default searchModalMultiple;
