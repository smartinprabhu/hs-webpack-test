/* eslint-disable no-nested-ternary */
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
import {
  FormControlLabel, Checkbox,
  Button,
} from '@mui/material';

import SuccessAndErrorFormat from '@shared/successAndErrorFormat';
import Loader from '@shared/loading';
import ModalSearch from '@shared/modalSearch';

import {
  getExtraSelectionMultiple, getExtraSelectionMultipleCount,
} from '../../../helpdesk/ticketService';
import { getDefaultNoValue, getPagesCountV2 } from '../../../util/appUtils';

const useStyles = makeStyles((theme) => ({
  root: {
    '& > *': {
      marginTop: theme.spacing(2),
    },
  },
}));

const SearchModalSingle = (props) => {
  const {
    modelName,
    fields,
    company,
    fieldName,
    afterReset,
    onEmployeeChange,
    onCourierChange,
    onDepartmentChange,
    onProductCategoryChange,
    oldEmployeeValues,
    oldCourierValues,
    oldDepartmentValues,
    oldProductCategoryValues,
    onProductChange,
    oldProductValues,
  } = props;
  const limit = 50;
  const dispatch = useDispatch();
  const classes = useStyles();
  const [searchValue, setSearchValue] = useState('');
  const [offset, setOffset] = useState(0);
  const [page, setPage] = useState(1);
  const [isSearch, setSearch] = useState(false);

  const [checkedRows, setCheckRows] = useState(fieldName === 'employees_id' ? oldEmployeeValues : fieldName === 'courier_id' ? oldCourierValues : fieldName === 'product_categ_ids' ? oldProductCategoryValues : fieldName === 'product_ids' ? oldProductValues : oldDepartmentValues);
  const [isAllChecked, setIsAllChecked] = useState(false);

  const {
    listDataMultipleInfo, listDataMultipleCountInfo, listDataMultipleCountLoading,
  } = useSelector((state) => state.ticket);

  useEffect(() => {
    if (fieldName === 'employees_id') {
      setCheckRows(oldEmployeeValues);
    }
    if (fieldName === 'courier_id') {
      setCheckRows(oldCourierValues);
    }
    if (fieldName === 'department_id') {
      setCheckRows(oldDepartmentValues);
    }
    if (fieldName === 'product_categ_ids') {
      setCheckRows(oldProductCategoryValues);
    }
    if (fieldName === 'product_ids') {
      setCheckRows(oldProductValues);
    }
  }, []);

  useEffect(() => {
    if (modelName && fields) {
      let searchValueMultiple = '[';

      if (fieldName === 'employees_id') {
        searchValueMultiple = `${searchValueMultiple},["name","!=",false],["work_email","!=",false]`;
        if (searchValue) {
          searchValueMultiple = `${searchValueMultiple},"|",["name","ilike","${searchValue}"],["work_email","ilike","${searchValue}"]`;
        }
      }
      if (searchValue && fieldName === 'courier_id') {
        searchValueMultiple = `${searchValueMultiple},["name","ilike","${searchValue}"]`;
      }
      if (searchValue && fieldName === 'department_id') {
        searchValueMultiple = `${searchValueMultiple},["name","ilike","${searchValue}"]`;
      }
      if (searchValue && fieldName === 'product_categ_ids') {
        searchValueMultiple = `[["name","ilike","${searchValue}"]`;
      }
      if (fieldName === 'product_ids') {
        searchValueMultiple = `${searchValueMultiple}["company_id","in",[${company}]],["purchase_ok","=",true],["active","=",true],["is_pantry_item","!=",true]`;
        if (searchValue) {
          searchValueMultiple = `${searchValueMultiple},"|",["name","ilike","${searchValue}"],["unique_code","ilike","${searchValue}"]`;
        }
      }
      // if (fieldName === 'product_categ_ids') {
      //   searchValueMultiple = `${searchValueMultiple},["name","!=",false],["display_name","!=",false]`;
      //   if (searchValue) {
      //     searchValueMultiple = `${searchValueMultiple},"|",["name","ilike","${searchValue}"],["display_name","ilike","${searchValue}"]`;
      //   }
      // }

      searchValueMultiple = `${searchValueMultiple}]`;
      dispatch(getExtraSelectionMultiple(company, modelName, limit, offset, fields, searchValueMultiple));
    }
  }, [modelName, offset, isSearch]);

  useEffect(() => {
    if (modelName) {
      // let searchValueMultiple = `[["company_id","in",[${company}]]`;
      let searchValueMultiple = '[';

      if (fieldName === 'employees_id') {
        searchValueMultiple = `${searchValueMultiple},["name","!=",false],["work_email","!=",false]`;
        if (searchValue) {
          searchValueMultiple = `${searchValueMultiple},"|",["name","ilike","${searchValue}"],["work_email","ilike","${searchValue}"]`;
        }
      }
      if (searchValue && fieldName === 'courier_id') {
        searchValueMultiple = `${searchValueMultiple},["name","ilike","${searchValue}"]`;
      }
      if (searchValue && fieldName === 'department_id') {
        searchValueMultiple = `${searchValueMultiple},["name","ilike","${searchValue}"]`;
      }
      if (searchValue && fieldName === 'product_categ_ids') {
        searchValueMultiple = `[["name","ilike","${searchValue}"]`;
      }
      if (fieldName === 'product_ids') {
        searchValueMultiple = `${searchValueMultiple}["company_id","in",[${company}]],["purchase_ok","=",true],["active","=",true],["is_pantry_item","!=",true]`;
        if (searchValue) {
          searchValueMultiple = `${searchValueMultiple},"|",["name","ilike","${searchValue}"],["unique_code","ilike","${searchValue}"]`;
        }
      }
      searchValueMultiple = `${searchValueMultiple}]`;
      dispatch(getExtraSelectionMultipleCount(company, modelName, fields, searchValueMultiple));
    }
  }, [modelName, isSearch]);

  const totalDataCount = listDataMultipleCountInfo && listDataMultipleCountInfo.length ? listDataMultipleCountInfo.length : 0;

  const pages = getPagesCountV2(totalDataCount, limit);

  const handlePageClick = (e, index) => {
    e.preventDefault();
    const offsetValue = (index - 1) * limit;
    setPage(index);
    setOffset(offsetValue);
    setIsAllChecked(false);
  };

  const onSearchChange = (e) => {
    setSearchValue(e.target.value);
    if (e.target.value.length < 2 && e.key === 'Backspace') {
      setSearchValue('');
      setSearch(Math.random());
    }
    if (e.key === 'Enter') {
      setSearch(Math.random());
      setPage(0);
      setOffset(0);
    }
  };

  const onClear = () => {
    setSearchValue('');
    setSearch(Math.random());
    setPage(0);
    setOffset(0);
  };

  const onSearch = () => {
    setSearch(Math.random());
    setPage(0);
    setOffset(0);
  };

  const handleAdd = () => {
    if (checkedRows) {
      if (fieldName === 'employees_id') {
        onEmployeeChange(checkedRows);
      }
      if (fieldName === 'courier_id') {
        onCourierChange(checkedRows);
      }
      if (fieldName === 'department_id') {
        onDepartmentChange(checkedRows);
      }
      if (fieldName === 'product_categ_ids') {
        onProductCategoryChange(checkedRows);
      }
      if (fieldName === 'product_ids') {
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
      if ((checkedRows && checkedRows.length + 1 === 50) || (checkedRows && checkedRows.length + 1 === totalDataCount)) {
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
      const data = listDataMultipleInfo && listDataMultipleInfo.data ? listDataMultipleInfo.data : [];
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
            <FormControlLabel
              control={(
                <Checkbox
                sx={{
                  transform: 'scale(0.9)',
                  padding: '0px',
                }}
                  value={JSON.stringify(assetData[i])}
                  id={`checkboxtk${assetData[i].id}`}
                 // className="ml-0"
                  name={assetData[i].name}
                  checked={checkedRows.some((selectedValue) => parseInt(selectedValue.id) === parseInt(assetData[i].id))}
                  onChange={handleTableCellChange}
                />
)}
            />
          </td>
          {fieldName === 'employees_id' && (
            <>
              <td className="pt-3"><span className="font-weight-400">{getDefaultNoValue((assetData[i].name))}</span></td>
              <td className="pt-3"><span className="font-weight-400">{getDefaultNoValue((assetData[i].work_email))}</span></td>
            </>
          )}
          {fieldName === 'courier_id' && (
            <td className="pt-3"><span className="font-weight-400">{getDefaultNoValue(assetData[i].name)}</span></td>
          )}
          {fieldName === 'department_id' && (
            <td className="pt-3"><span className="font-weight-400">{getDefaultNoValue(assetData[i].display_name)}</span></td>
          )}
          {fieldName === 'product_categ_ids' && (
            <>
              <td className="pt-3"><span className="font-weight-400">{getDefaultNoValue((assetData[i].name))}</span></td>
              <td className="pt-3"><span className="font-weight-400">{getDefaultNoValue(assetData[i].display_name)}</span></td>
            </>
          )}
          {fieldName === 'product_ids' && (
            <>
              <td className="pt-3"><span className="font-weight-400">{getDefaultNoValue((assetData[i].name))}</span></td>
              <td className="pt-3"><span className="font-weight-400">{getDefaultNoValue((assetData[i].unique_code))}</span></td>
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
          <Card className="pt-3 bg-lightblue h-100">
            <CardBody className="bg-color-white p-1 m-0">
              <Row className="pl-2 pr-2 pb-0 pt-0">
                <Col sm="12" md="7" lg="7" xs="12">
                  <div className="mt-3">
                    <span className="p-0 font-weight-600 font-medium mr-2">
                      Total :
                      {' '}
                      {!loading ? totalDataCount : ''}
                    </span>
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
                          <FormControlLabel
                            control={(
                              <Checkbox
                                type="checkbox"
                                value="all"
                                sx={{
                                  transform: 'scale(0.9)',
                                  padding: '0px',
                                }}
                                //className="m-0 position-relative"
                                name="checkall"
                                id="checkboxtkhead1"
                                checked={isAllChecked}
                                onChange={handleTableCellAllChange}
                              />
)}
                          />
                        </th>
                        <th className="pt-4 min-width-100">
                          Name
                        </th>
                        {fieldName === 'product_ids' && (
                          <th className="pt-4 min-width-100">
                            Code
                          </th>
                        )}
                        {fieldName === 'employees_id' && (
                          <th className="pt-4 min-width-100">
                            Work Email
                          </th>
                        )}
                        {fieldName === 'product_categ_ids' && (
                          <th className="pt-4 min-width-100">
                            Display Name
                          </th>
                        )}
                      </tr>
                    </thead>
                    <tbody>
                      {getRow(listDataMultipleInfo && listDataMultipleInfo.data ? listDataMultipleInfo.data : [])}
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

SearchModalSingle.propTypes = {
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
  oldEmployeeValues: PropTypes.array.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  oldCourierValues: PropTypes.array.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  oldDepartmentValues: PropTypes.array.isRequired,
  oldProductCategoryValues: PropTypes.array.isRequired,
  afterReset: PropTypes.func.isRequired,
  onEmployeeChange: PropTypes.func.isRequired,
  onCourierChange: PropTypes.func.isRequired,
  onDepartmentChange: PropTypes.func.isRequired,
  onProductCategoryChange: PropTypes.func.isRequired,
  onProductChange: PropTypes.func,
};

export default SearchModalSingle;
