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
  CardBody,
} from 'reactstrap';
import {
  Input, FormControl,
} from '@material-ui/core';
import * as PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import Pagination from '@material-ui/lab/Pagination';
import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from '@material-ui/core/IconButton';
import BackspaceIcon from '@material-ui/icons/Backspace';
import SearchIcon from '@material-ui/icons/Search';

import SuccessAndErrorFormat from '@shared/successAndErrorFormat';
import Loader from '@shared/loading';

import {
  getExtraSelectionMultiple, getExtraSelectionMultipleCount,
} from '../../../../../../helpdesk/ticketService';
import {
  getDefaultNoValue, getPagesCountV2, extractTextObject,
} from '../../../../../../util/appUtils';

const useStyles = makeStyles((theme) => ({
  root: {
    '& > *': {
      marginTop: theme.spacing(2),
    },
  },
}));

const SearchModalAdvanced = (props) => {
  const {
    modelName,
    fields,
    company,
    fieldName,
    placeholderName,
    afterReset,
    setFieldValue,
  } = props;
  const limit = 50;
  const dispatch = useDispatch();
  const classes = useStyles();
  const [searchValue, setSearchValue] = useState('');
  const [offset, setOffset] = useState(0);
  const [page, setPage] = useState(1);
  const [isSearch, setSearch] = useState(false);
  const [selectedId, setSelected] = useState('');

  const {
    listDataMultipleInfo, listDataMultipleCountInfo, listDataMultipleCountLoading,
  } = useSelector((state) => state.ticket);

  useEffect(() => {
    if (modelName && fields) {
      let searchValueMultiple = `[["company_id","in",[${company}]]`;

      if (searchValue && fieldName === 'employee_id') {
        searchValueMultiple = `${searchValueMultiple},"|","|",["name","ilike","${searchValue}"],["work_phone","ilike","${searchValue}"],["work_email","ilike","${searchValue}"]`;
      }

      if (searchValue && fieldName === 'space_id') {
        searchValueMultiple = `${searchValueMultiple},"|","|",["name","ilike","${searchValue}"],["path_name","ilike","${searchValue}"],["asset_category_id.name","ilike","${searchValue}"]`;
      }

      if (searchValue && fieldName === 'asset_id') {
        searchValueMultiple = `${searchValueMultiple},"|",["name","ilike","${searchValue}"],["category_id","ilike","${searchValue}"]`;
      }
      if (searchValue && fieldName === 'department_id') {
        searchValueMultiple = `${searchValueMultiple},["name","ilike","${searchValue}"]`;
      }

      searchValueMultiple = `${searchValueMultiple}]`;
      dispatch(getExtraSelectionMultiple(company, modelName, limit, offset, fields, searchValueMultiple));
    }
  }, [modelName, offset, isSearch]);

  useEffect(() => {
    if (modelName) {
      let searchValueMultiple = `[["company_id","in",[${company}]]`;

      if (searchValue && fieldName === 'employee_id') {
        searchValueMultiple = `${searchValueMultiple},"|","|",["name","ilike","${searchValue}"],["work_phone","ilike","${searchValue}"],["work_email","ilike","${searchValue}"]`;
      }

      if (searchValue && fieldName === 'space_id') {
        searchValueMultiple = `${searchValueMultiple},"|","|",["name","ilike","${searchValue}"],["path_name","ilike","${searchValue}"],["asset_category_id.name","ilike","${searchValue}"]`;
      }

      if (searchValue && fieldName === 'asset_id') {
        searchValueMultiple = `${searchValueMultiple},"|",["name","ilike","${searchValue}"],["category_id","ilike","${searchValue}"]`;
      }
      if (searchValue && fieldName === 'department_id') {
        searchValueMultiple = `${searchValueMultiple},["name","ilike","${searchValue}"]`;
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

  const handleRowClick = (data) => {
    setSelected(data.id);
    setFieldValue(fieldName, data);
    if (afterReset) afterReset();
  };

  function getRow(assetData) {
    const tableTr = [];
    for (let i = 0; i < assetData.length; i += 1) {
      tableTr.push(
        <tr className={selectedId === assetData[i].id ? 'text-info cursor-pointer' : 'cursor-pointer'} onClick={() => handleRowClick(assetData[i])} key={i}>
          {fieldName === 'employee_id' && (
            <>
              <td className="p-2"><span className="font-weight-400">{getDefaultNoValue(assetData[i].name)}</span></td>
              <td className="p-2"><span className="font-weight-400">{getDefaultNoValue(assetData[i].work_phone)}</span></td>
              <td className="p-2"><span className="font-weight-400">{getDefaultNoValue(assetData[i].work_email)}</span></td>
            </>
          )}
          {fieldName === 'space_id' && (
            <>
              <td className="p-2"><span className="font-weight-400">{assetData[i].name ? getDefaultNoValue(assetData[i].name) : getDefaultNoValue(assetData[i].space_name)}</span></td>
              <td className="p-2"><span className="font-weight-400">{getDefaultNoValue(assetData[i].path_name)}</span></td>
              <td className="p-2"><span className="font-weight-400">{getDefaultNoValue(extractTextObject(assetData[i].asset_category_id))}</span></td>
            </>
          )}
          {fieldName === 'asset_id' && (
            <>
              <td className="p-2"><span className="font-weight-400">{getDefaultNoValue(assetData[i].name)}</span></td>
              <td className="p-2"><span className="font-weight-400">{getDefaultNoValue(extractTextObject(assetData[i].category_id))}</span></td>
            </>
          )}
          {fieldName === 'department_id' && (
            <td className="p-2"><span className="font-weight-400">{getDefaultNoValue(assetData[i].name)}</span></td>
          )}
        </tr>,
      );
    }
    return tableTr;
  }

  const loading = (listDataMultipleInfo && listDataMultipleInfo.loading) || (listDataMultipleCountLoading);

  return (
    <Row>
      <Col sm="12" md="12" lg="12" xs="12">
        <Card className="p-2 bg-lightblue h-100">
          <CardBody className="bg-color-white p-1 m-0">
            <Row className="pl-2 pr-2 pb-0 pt-0">
              <Col sm="12" md="7" lg="7" xs="12">
                {!loading && (
                  <div className="mt-3">
                    <span className="p-0 font-weight-600 font-medium mr-2">
                      Total :
                      {' '}
                      {totalDataCount}
                    </span>
                  </div>
                )}
              </Col>
              <Col sm="12" md="5" lg="5" xs="12" className="text-right">
                <FormControl variant="standard">
                  <Input
                    id="standard-adornment-password"
                    type="text"
                    name="search"
                    placeholder={placeholderName}
                    value={searchValue}
                    onChange={onSearchChange}
                    onKeyDown={onSearchChange}
                    endAdornment={(
                      <InputAdornment position="end">
                        {searchValue && (
                          <>
                            <IconButton
                              aria-label="toggle password visibility"
                              onClick={() => {
                                setSearchValue('');
                                setSearch(Math.random());
                                setPage(1);
                                setOffset(0);
                              }}
                            >
                              <BackspaceIcon fontSize="small" />
                            </IconButton>
                            <IconButton
                              aria-label="toggle search visibility"
                              onClick={() => {
                                setSearch(Math.random());
                                setPage(1);
                                setOffset(0);
                              }}
                            >
                              <SearchIcon fontSize="small" />
                            </IconButton>
                          </>
                        )}
                      </InputAdornment>
                    )}
                  />
                </FormControl>
              </Col>
            </Row>
            <div className="pl-1 pr-1 pt-0 comments-list thin-scrollbar">
              {(listDataMultipleInfo && listDataMultipleInfo.data && !loading) && (
                <Table responsive>
                  <thead className="bg-gray-light">
                    <tr>
                      <th className="p-2 min-width-100">
                        Name
                      </th>
                      {fieldName === 'employee_id' && (
                        <>
                          <th className="p-2 min-width-100">
                            Phone
                          </th>
                          <th className="p-2 min-width-100">
                            Email
                          </th>
                        </>
                      )}
                      {fieldName === 'space_id' && (
                        <>
                          <th className="p-2 min-width-160">
                            Full Path
                          </th>
                          <th className="p-2 min-width-100">
                            Category
                          </th>
                        </>
                      )}
                      {fieldName === 'asset_id' && (
                        <th className="p-2 min-width-160">
                          Category
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
            {loading && (
              <Loader />
            )}
            {(listDataMultipleInfo && listDataMultipleInfo.err) && (
              <SuccessAndErrorFormat response={listDataMultipleInfo} />
            )}
          </CardBody>
        </Card>
      </Col>
    </Row>
  );
};

SearchModalAdvanced.propTypes = {
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
  afterReset: PropTypes.func.isRequired,
  placeholderName: PropTypes.string.isRequired,
  setFieldValue: PropTypes.func.isRequired,
};

export default SearchModalAdvanced;
