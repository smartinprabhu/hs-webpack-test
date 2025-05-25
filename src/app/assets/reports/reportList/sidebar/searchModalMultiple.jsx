/* eslint-disable max-len */
/* eslint-disable radix */
/* eslint-disable import/no-unresolved */
/* eslint-disable camelcase */
/* eslint-disable react/jsx-props-no-spreading */
import React, { useState, useEffect } from 'react';
import {

  Col,
  Row,
  Card,
  CardBody,
} from 'reactstrap';
import { Checkbox, FormControlLabel, FormGroup, Button, DialogActions, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';

import * as PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import Pagination from '@material-ui/lab/Pagination';

import SuccessAndErrorFormat from '@shared/successAndErrorFormat';
import Loader from '@shared/loading';
import ModalSearch from '@shared/modalSearch';

import {
  getExtraSelectionMultiple, getExtraSelectionMultipleCount,
} from '../../../../helpdesk/ticketService';
import { getDefaultNoValue, getPagesCountV2, extractTextObject } from '../../../../util/appUtils';

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
    onSpaceChange,
    oldCategoryValues,
    oldSpaceValues,
  } = props;
  const limit = 10;
  const dispatch = useDispatch();
  const classes = useStyles();
  const [searchValue, setSearchValue] = useState('');
  const [offset, setOffset] = useState(0);
  const [page, setPage] = useState(1);
  const [isSearch, setSearch] = useState(false);

  const [checkedRows, setCheckRows] = useState(fieldName === 'vendor_id' ? oldCategoryValues : oldSpaceValues);
  const [isAllChecked, setIsAllChecked] = useState(false);
  const {
    listDataMultipleInfo, listDataMultipleCountInfo, listDataMultipleCountLoading,
  } = useSelector((state) => state.ticket);

  useEffect(() => {
    if (fieldName === 'vendor_id') {
      setCheckRows(oldCategoryValues);
    }
    if (fieldName === 'location_ids') {
      setCheckRows(oldSpaceValues);
    }
  }, []);

  useEffect(() => {
    if (modelName && fields) {
      let searchValueMultiple = `[["company_id","in",[${company}]]`;

      if (fieldName === 'vendor_id') {
        searchValueMultiple = `${searchValueMultiple},["supplier", "=", true],"|","|",["email", "ilike", "${searchValue}"],["display_name", "ilike", "${searchValue}"],["mobile", "ilike", "${searchValue}"]`;
      }
      if (fieldName === 'location_ids') {
        searchValueMultiple = `${searchValueMultiple},["asset_category_id", "ilike", "Building"],"|","|",["space_name","ilike","${searchValue}"],["path_name","ilike","${searchValue}"],["asset_category_id.name","ilike","${searchValue}"]`;
      }

      searchValueMultiple = `${searchValueMultiple}]`;
      dispatch(getExtraSelectionMultiple(company, modelName, limit, offset, fields, searchValueMultiple));
    }
  }, [modelName, offset, isSearch]);

  useEffect(() => {
    if (modelName) {
      let searchValueMultiple = `[["company_id","in",[${company}]]`;

      if (fieldName === 'vendor_id') {
        searchValueMultiple = `${searchValueMultiple},["supplier", "=", true],"|","|",["email", "ilike", "${searchValue}"],["display_name", "ilike", "${searchValue}"],["mobile", "ilike", "${searchValue}"]`;
      }
      if (fieldName === 'location_ids') {
        searchValueMultiple = `${searchValueMultiple},["asset_category_id", "ilike", "Building"],"|","|",["space_name","ilike","${searchValue}"],["path_name","ilike","${searchValue}"],["asset_category_id.name","ilike","${searchValue}"]`;
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
        <TableRow key={i}>
          <TableCell className="w-5 pl-2 p-0">
            <FormGroup>
              <FormControlLabel control={
                <Checkbox
                  value={JSON.stringify(assetData[i])}
                  id={`checkboxtk${assetData[i].id}`}
                  name={(fieldName !== 'location_ids') ? assetData[i].name : assetData[i].space_name}
                  checked={checkedRows.some((selectedValue) => parseInt(selectedValue.id) === parseInt(assetData[i].id))}
                  onChange={handleTableCellChange}
                />
              } />
            </FormGroup>
          </TableCell>
          {fieldName === 'vendor_id' && (
            <>
              <TableCell className=""><span className="font-weight-400">{getDefaultNoValue((assetData[i].display_name))}</span></TableCell>
              <TableCell className=""><span className="font-weight-400">{getDefaultNoValue((assetData[i].email))}</span></TableCell>
              <TableCell className=""><span className="font-weight-400">{getDefaultNoValue((assetData[i].mobile))}</span></TableCell>
            </>
          )}
          {(fieldName === 'location_ids') && (
            <>
              <TableCell className=""><span className="font-weight-400">{getDefaultNoValue(assetData[i].space_name)}</span></TableCell>
              <TableCell className=""><span className="font-weight-400">{getDefaultNoValue(assetData[i].path_name)}</span></TableCell>
              <TableCell className=""><span className="font-weight-400">{getDefaultNoValue(extractTextObject(assetData[i].asset_category_id))}</span></TableCell>
            </>
          )}
        </TableRow>,
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
                      {totalDataCount}
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
                    <TableHead className="bg-gray-light">
                      <TableRow>
                        <TableCell className="w-5 pl-2 p-0">
                          <FormGroup>
                            <FormControlLabel control={
                              <Checkbox
                                value="all"
                                id="checkboxtkhead1"
                                checked={isAllChecked}
                                onChange={handleTableCellAllChange}
                              />
                            } />
                          </FormGroup>
                        </TableCell>
                        {fieldName === 'vendor_id' && (
                          <>
                            <TableCell className="min-width-100 font-weight-bold">
                              Name
                            </TableCell>
                            <TableCell className="min-width-100 font-weight-bold">
                              Email ID
                            </TableCell>
                            <TableCell className="min-width-100 font-weight-bold">
                              Mobile
                            </TableCell>
                          </>
                        )}
                        {(fieldName === 'location_ids') && (
                          <>
                            <TableCell className="min-width-100 font-weight-bold">
                              Space Name
                            </TableCell>
                            <TableCell className="min-width-100 font-weight-bold">
                              Path Name
                            </TableCell>
                            <TableCell className="min-width-100 font-weight-bold">
                              Category
                            </TableCell>
                          </>
                        )}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {getRow(listDataMultipleInfo && listDataMultipleInfo.data ? listDataMultipleInfo.data : [])}
                    </TableBody>
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
      <DialogActions>
        {(checkedRows && checkedRows.length && checkedRows.length > 0)
          ? (
            <Button
              size="sm"
              onClick={() => handleAdd()}
              variant='contained'
            >
              {' '}
              Add
            </Button>
          ) : ''}
      </DialogActions>
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
  oldSpaceValues: PropTypes.array.isRequired,
  afterReset: PropTypes.func.isRequired,
  onCategoryChange: PropTypes.func.isRequired,
  onSpaceChange: PropTypes.func.isRequired,
};

export default SearchModalMultiple;
