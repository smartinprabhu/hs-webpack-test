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

import {
  getExtraSelectionMultiple, getExtraSelectionMultipleCount,
} from '../../ticketService';
import { getDefaultNoValue, getPagesCountV2 } from '../../../util/appUtils';
import { Button } from '@mui/material';

const useStyles = makeStyles((theme) => ({
  root: {
    '& > *': {
      marginTop: theme.spacing(2),
    },
  },
}));

const SearchModalMultiple = (props) => {
  const {
    modelName,
    fields,
    company,
    fieldName,
    afterReset,
    onCategoryChange,
    onProductChange,
    oldCategoryValues,
    oldProductValues,
    globalCategories,
  } = props;
  const limit = 10;
  const dispatch = useDispatch();
  const classes = useStyles();
  const [searchValue, setSearchValue] = useState('');
  const [offset, setOffset] = useState(0);
  const [page, setPage] = useState(1);
  const [isSearch, setSearch] = useState(false);

  const [checkedRows, setCheckRows] = useState(fieldName === 'vendor_id' ? oldCategoryValues : []);
  const [isAllChecked, setIsAllChecked] = useState(false);

  const {
    listDataMultipleInfo, listDataMultipleCountInfo, listDataMultipleCountLoading,
  } = useSelector((state) => state.ticket);

  useEffect(() => {
    if (fieldName === 'vendor_id') {
      setCheckRows(oldCategoryValues);
    }
    if (fieldName === 'category_id') {
      setCheckRows(oldProductValues);
    }
  }, []);

  useEffect(() => {
    if (modelName && fields) {
      let searchValueMultiple = `[["company_id","in",[${company}]]`;

      if (fieldName === 'vendor_id') {
        searchValueMultiple = `${searchValueMultiple},["supplier", "=", true],"|","|",["email", "ilike", "${searchValue}"],["name", "ilike", "${searchValue}"],["mobile", "ilike", "${searchValue}"]`;
      }
      if (searchValue && fieldName === 'category_id') {
        searchValueMultiple = `${searchValueMultiple},["name","ilike","${searchValue}"]`;
      }

      searchValueMultiple = `${searchValueMultiple}]`;
      dispatch(getExtraSelectionMultiple(company, modelName, limit, offset, fields, searchValueMultiple));
    }
  }, [modelName, offset, isSearch]);

  useEffect(() => {
    if (modelName) {
      let searchValueMultiple = `[["company_id","in",[${company}]]`;

      if (fieldName === 'vendor_id') {
        searchValueMultiple = `${searchValueMultiple},["supplier", "=", true],"|","|",["email", "ilike", "${searchValue}"],["name", "ilike", "${searchValue}"],["mobile", "ilike", "${searchValue}"]`;
      }
      if (fieldName === 'category_id') {
        searchValueMultiple = `${searchValueMultiple},["name","ilike","${searchValue}"]`;
      }

      searchValueMultiple = `${searchValueMultiple}]`;
      dispatch(getExtraSelectionMultipleCount(company, modelName, fields, searchValueMultiple));
    }
  }, [modelName, isSearch]);

  const totalDataCount = listDataMultipleCountInfo && listDataMultipleCountInfo.length ? listDataMultipleCountInfo.length : 0;
  const totalDataCount2 = globalCategories && globalCategories.data && globalCategories.data.length ? globalCategories.data.length : 0;

  const pages = (globalCategories && globalCategories.length) ? getPagesCountV2(totalDataCount2, limit) : getPagesCountV2(totalDataCount, limit);

  const handlePageClick = (e, index) => {
    e.preventDefault();
    const offsetValue = (index - 1) * limit;
    setPage(index);
    setOffset(offsetValue);
    setIsAllChecked(false);
  };

  const onSearchChange = (e) => {
    setSearchValue(e.target.value);
    if (e.key === 'Enter') {
      setSearch(Math.random());
      setPage(1);
      setOffset(0);
    }
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

  const handleAdd = () => {
    if (checkedRows) {
      if (fieldName === 'vendor_id') {
        onCategoryChange(checkedRows);
      }
      if (fieldName === 'category_id') {
        onProductChange(checkedRows);
      }
    }
    if (afterReset) afterReset();
  };

  const handleTableCellChange = (event) => {
    const { checked, value } = event.target;
    const values = JSON.parse(value);
    if (checked) {
      setCheckRows((state) => [...state, values]);
      if ((checkedRows && checkedRows.length + 1 === 10) || (checkedRows && checkedRows.length + 1 === totalDataCount)) {
        setIsAllChecked(true);
      }
    } else {
      setCheckRows(checkedRows.filter((item) => item.id !== values.id));
      setIsAllChecked(false);
    }
  };

  const handleTableCellAllChange = (event) => {
    const { checked } = event.target;
    let data = [];
    if (checked) {
      if (fieldName === 'vendor_id') {
        data = listDataMultipleInfo && listDataMultipleInfo.data ? listDataMultipleInfo.data : [];
      }
      if (fieldName === 'category_id') {
        data = globalCategories && globalCategories.data ? globalCategories.data : [];
      }
      const newArr = [...data, ...checkedRows];
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
          <td className="w-5">
          <Checkbox
              id={`checkboxtk${assetData[i].id}`}
              className="ml-0"
              name={assetData[i].name}
              value={JSON.stringify(assetData[i])}
              checked={checkedRows && checkedRows.find((selectedValue) => parseInt(selectedValue.id) === parseInt(assetData[i].id))?true:false}
              onChange={handleTableCellChange}
            />
          </td>
          {fieldName === 'vendor_id' && (
            <>
              <td className="pt-4"><span className="font-weight-400">{getDefaultNoValue((assetData[i].name))}</span></td>
              <td className="pt-4"><span className="font-weight-400">{getDefaultNoValue((assetData[i].email))}</span></td>
              <td className="pt-4"><span className="font-weight-400">{getDefaultNoValue((assetData[i].mobile))}</span></td>
            </>
          )}
          {(fieldName === 'category_id') && (
            <>
              <td className="pt-4"><span className="font-weight-400">{getDefaultNoValue(assetData[i].name)}</span></td>
              {/* <td className="p-2"><span className="font-weight-400">{getDefaultNoValue(assetData[i].name)}</span></td> */}
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
                    {fieldName === 'category_id'
                      ? (
                        <span className="p-0 font-weight-600 font-medium mr-2">
                          Total :
                          {' '}
                          {totalDataCount2}
                        </span>
                      )
                      : (
                        <span className="p-0 font-weight-600 font-medium mr-2">
                          Total :
                          {' '}
                          {totalDataCount}
                        </span>
                      )}

                  </div>
                </Col>
                <Col sm="12" md="5" lg="5" xs="12" className="text-right">
                  <ModalSearch
                    searchValue={searchValue}
                    onSearchChange={onSearchChange}
                    onClear={onClear}
                    onSearch={onSearch}
                  />
                </Col>
              </Row>
              <div className="pl-1 pr-1 pt-0 comments-list thin-scrollbar">
                {(listDataMultipleInfo && listDataMultipleInfo.data) && (
                  <Table responsive>
                    <thead className="bg-gray-light">
                      <tr>
                        <th className="w-5">
                        <th className="w-5">
                          <Checkbox
                            name="checkall"
                            id="checkboxtkhead1"
                            value="all"
                            checked={isAllChecked}
                            onChange={handleTableCellAllChange}
                          />
                        </th>
                        </th>
                        {fieldName === 'vendor_id' && (
                          <>
                            <th className="pb-4 min-width-100">
                              Name
                            </th>
                            <th className="pb-4 min-width-100">
                              Email ID
                            </th>
                            <th className="pb-4 min-width-100">
                              Mobile
                            </th>
                          </>
                        )}
                        {(fieldName === 'category_id') && (
                          <>
                            <th className="pb-4 min-width-100">
                              Name
                            </th>
                            {/* <th className="p-2 min-width-100">
                              Display Name
                            </th> */}
                          </>
                        )}
                      </tr>
                    </thead>
                    <tbody>
                      {(globalCategories !== undefined && (fieldName === 'category_id')) ? getRow(globalCategories && globalCategories.data ? globalCategories.data : []) : ((fieldName === 'vendor_id')) ? getRow(listDataMultipleInfo && listDataMultipleInfo.data ? listDataMultipleInfo.data : []) : getRow(listDataMultipleInfo && listDataMultipleInfo.data ? listDataMultipleInfo.data : [])}
                    </tbody>
                  </Table>
                )}
              </div>
              {loading || pages === 0 ? (<span />) : (
                <div className={`${classes.root} float-right`}>
                  <Pagination count={pages} page={page} size="small" color="primary" onChange={handlePageClick} showFirstButton showLastButton />
                </div>
              )}
              {listDataMultipleInfo && listDataMultipleInfo.loading && (
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
                onClick={() => handleAdd()}
                className='apply-btn'
                style={{width:'50px'}}
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

SearchModalMultiple.propTypes = {
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
  oldProductValues: PropTypes.array.isRequired,
  afterReset: PropTypes.func.isRequired,
  onCategoryChange: PropTypes.func.isRequired,
  onProductChange: PropTypes.func.isRequired,
  globalCategories: PropTypes.func.isRequired,
};

export default SearchModalMultiple;
