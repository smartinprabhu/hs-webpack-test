/* eslint-disable max-len */
/* eslint-disable react/forbid-prop-types */
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

import SuccessAndErrorFormat from '@shared/successAndErrorFormat';
import Loader from '@shared/loading';
import ModalSearch from '@shared/modalSearch';

import { Button, Checkbox } from '@mui/material';
import {
  getExtraSelectionMultiple, getExtraSelectionMultipleCount,
} from '../../helpdesk/ticketService';
import { getDefaultNoValue, getPagesCountV2, extractTextObject } from '../../util/appUtils';

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
    setFieldValue,
    oldValues,
    headers,
    noBuildings,
  } = props;
  const limit = 50;
  const dispatch = useDispatch();
  const classes = useStyles();
  const [searchValue, setSearchValue] = useState('');
  const [offset, setOffset] = useState(0);
  const [page, setPage] = useState(1);
  const [isSearch, setSearch] = useState(false);

  const [checkedRows, setCheckRows] = useState([]);
  const [isAllChecked, setIsAllChecked] = useState(false);

  const {
    listDataMultipleInfo, listDataMultipleCountInfo, listDataMultipleCountLoading,
  } = useSelector((state) => state.ticket);

  useEffect(() => {
    setCheckRows(oldValues);
  }, []);

  useEffect(() => {
    if (modelName && fields) {
      let searchValueMultiple = '[';
      searchValueMultiple = `[["company_id","in",[${company}]]`;
      if (!noBuildings && fieldName === 'location_ids') {
        searchValueMultiple = `${searchValueMultiple},["asset_category_id", "ilike", "Building"]`;
      }
      if (searchValue && fieldName === 'asset_ids') {
        searchValueMultiple = `${searchValueMultiple},"|","|","|","|","|",["name","ilike","${searchValue}"],["model","ilike","${searchValue}"],["serial","ilike","${searchValue}"],["location_id.path_name","ilike","${searchValue}"],["block_id.name","ilike","${searchValue}"],["category_id.name","ilike","${searchValue}"]`;
      }
      if (fieldName === 'location_ids' && searchValue) {
        searchValueMultiple = `${searchValueMultiple},"|","|",["space_name","ilike","${searchValue}"],["path_name","ilike","${searchValue}"],["asset_category_id.name","ilike","${searchValue}"]`;
      }
      if (fieldName === 'recipients_ids') {
        searchValueMultiple = `${searchValueMultiple},["name","!=",false],["name","!=",""]`;
        if (searchValue) {
          searchValueMultiple = `${searchValueMultiple},"|","|",["name","ilike","${searchValue}"],["display_name","ilike","${searchValue}"],["email","ilike","${searchValue}"]`;
        }
      }
      if (fieldName === 'tenant_ids') {
        searchValueMultiple = `${searchValueMultiple},["name","!=",false],["name","!=",""],["is_tenant","=",true]`;
        if (searchValue) {
          searchValueMultiple = `${searchValueMultiple},"|","|",["name","ilike","${searchValue}"],["display_name","ilike","${searchValue}"],["email","ilike","${searchValue}"]`;
        }
      }
      if ((fieldName === 'maintenance_team_ids') && searchValue) {
        searchValueMultiple = `${searchValueMultiple},["name","ilike","${searchValue}"]`;
      }
      if ((fieldName === 'company_ids')) {
        if (searchValue) {
          searchValueMultiple = `["|",["parent_id","in",[${company}]],["id","in",[${company}]],["name","ilike","${searchValue}"]`;
        } else {
          searchValueMultiple = `["|",["parent_id","in",[${company}]],["id","in",[${company}]]`;
        }
      }
      searchValueMultiple = `${searchValueMultiple}]`;
      dispatch(getExtraSelectionMultiple(company, modelName, limit, offset, fields, searchValueMultiple));
    }
  }, [modelName, offset, isSearch]);

  useEffect(() => {
    if (modelName) {
      let searchValueMultiple = '[';
      searchValueMultiple = `[["company_id","in",[${company}]]`;
      if (!noBuildings && fieldName === 'location_ids') {
        searchValueMultiple = `${searchValueMultiple},["asset_category_id", "ilike", "Building"]`;
      }
      if (searchValue && fieldName === 'asset_ids') {
        searchValueMultiple = `${searchValueMultiple},"|","|","|","|","|",["name","ilike","${searchValue}"],["model","ilike","${searchValue}"],["serial","ilike","${searchValue}"],["location_id.path_name","ilike","${searchValue}"],["block_id.name","ilike","${searchValue}"],["category_id.name","ilike","${searchValue}"]`;
      }
      if (fieldName === 'location_ids' && searchValue) {
        searchValueMultiple = `${searchValueMultiple},"|","|",["space_name","ilike","${searchValue}"],["path_name","ilike","${searchValue}"],["asset_category_id.name","ilike","${searchValue}"]`;
      }
      if (fieldName === 'tenant_ids') {
        searchValueMultiple = `${searchValueMultiple},["name","!=",false],["name","!=",""],["is_tenant","=",true]`;
        if (searchValue) {
          searchValueMultiple = `${searchValueMultiple},"|","|",["name","ilike","${searchValue}"],["display_name","ilike","${searchValue}"],["email","ilike","${searchValue}"]`;
        }
      }
      if (fieldName === 'recipients_ids') {
        searchValueMultiple = `${searchValueMultiple},["name","!=",false],["name","!=",""]`;
        if (searchValue) {
          searchValueMultiple = `${searchValueMultiple},"|","|",["name","ilike","${searchValue}"],["display_name","ilike","${searchValue}"],["email","ilike","${searchValue}"]`;
        }
      }
      if (fieldName === 'maintenance_team_ids' && searchValue) {
        searchValueMultiple = `${searchValueMultiple},["name","ilike","${searchValue}"]`;
      }
      if ((fieldName === 'company_ids')) {
        if (searchValue) {
          searchValueMultiple = `["|",["parent_id","in",[${company}]],["id","in",[${company}]],["name","ilike","${searchValue}"]`;
        } else {
          searchValueMultiple = `["|",["parent_id","in",[${company}]],["id","in",[${company}]]`;
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
      setFieldValue(fieldName, checkedRows);
    }
    if (afterReset) afterReset();
  };

  const handleTableCellChange = (event) => {
    const { checked, value } = event.target;
    const values = JSON.parse(value);
    if (checked) {
      setCheckRows((state) => [...(state || []), values]);
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
            <Checkbox
              sx={{
                transform: 'scale(0.9)',
                padding: '0px',
              }}
              value={JSON.stringify(assetData[i])}
              id={`checkboxtk${assetData[i].id}`}
              className="ml-0"
              name={fieldName !== 'space' ? assetData[i].name : assetData[i].space_name}
              checked={(checkedRows && checkedRows.length > 0 && checkedRows.some((selectedValue) => parseInt(selectedValue.id) === parseInt(assetData[i].id))) || (oldValues && oldValues.length && oldValues.includes(parseInt(assetData[i].id)))}
              onChange={handleTableCellChange}
            />
          </td>

          {fieldName === 'asset_ids' && (
            <>
              <td className="pt-3"><span className="font-weight-400">{getDefaultNoValue(assetData[i].name)}</span></td>
              <td className="pt-3"><span className="font-weight-400">{getDefaultNoValue(extractTextObject(assetData[i].location_id))}</span></td>
              <td className="pt-3"><span className="font-weight-400">{getDefaultNoValue(extractTextObject(assetData[i].category_id))}</span></td>
            </>
          )}
          {(fieldName === 'tenant_ids' || fieldName === 'recipients_ids') && (
          <>
            <td className="pt-3"><span className="font-weight-400">{getDefaultNoValue(assetData[i].display_name || assetData[i].name)}</span></td>
            <td className="pt-3"><span className="font-weight-400">{getDefaultNoValue(assetData[i].email)}</span></td>
            <td className="pt-3"><span className="font-weight-400">{getDefaultNoValue(assetData[i].mobile)}</span></td>
          </>
          )}
          {fieldName === 'location_ids' && (
            <>
              <td className="pt-3"><span className="font-weight-400">{getDefaultNoValue(assetData[i].path_name)}</span></td>
              <td className="pt-3"><span className="font-weight-400">{getDefaultNoValue(assetData[i].space_name)}</span></td>
              <td className="pt-3"><span className="font-weight-400">{getDefaultNoValue(extractTextObject(assetData[i].asset_category_id))}</span></td>
            </>
          )}
          {(fieldName === 'maintenance_team_ids' || fieldName === 'company_ids') && (
            <td className="pt-3"><span className="font-weight-400">{getDefaultNoValue(assetData[i].name)}</span></td>
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
                    <thead className="bg-gray-light">
                      <tr>
                        <th className="w-5">
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
                        {headers && headers.map((header) => (
                          <th className="pt-4 min-width-100">
                            {header}
                          </th>
                        ))}
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
  afterReset: PropTypes.func.isRequired,
};

export default SearchModalSingle;
