/* eslint-disable radix */
/* eslint-disable react/forbid-prop-types */
/* eslint-disable import/no-unresolved */
/* eslint-disable camelcase */
/* eslint-disable react/jsx-props-no-spreading */
import React, { useState, useEffect } from 'react';
import {
  Table,
  Col,
  Row,
  Card,
  Input,
  ModalFooter,
  Label,
  CardBody,
} from 'reactstrap';
import Button from '@mui/material/Button';
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
import {
  getDefaultNoValue, getPagesCountV2, extractTextObject,
} from '../../../../util/appUtils';

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
    onEquipmentChange,
    onSpaceChange,
    onTeamChange,
    oldEquipValues,
    oldSpaceValues,
    oldTeamValues,
  } = props;
  const limit = 50;
  const dispatch = useDispatch();
  const classes = useStyles();
  const [searchValue, setSearchValue] = useState('');
  const [offset, setOffset] = useState(0);
  const [page, setPage] = useState(1);
  const [isSearch, setSearch] = useState(false);
  const [ChangedSearchValue, setChangedSearchValue] = useState('');

  const getOldValues = (field) => {
    let oldValues = '';
    if (field === 'equipment') {
      oldValues = oldEquipValues;
    }
    if (field === 'space' || field === 'space_block_id') {
      oldValues = oldSpaceValues;
    }
    if (field === 'maintenance_team_id') {
      oldValues = oldTeamValues;
    }
    return oldValues;
  };
  const [checkedRows, setCheckRows] = useState(getOldValues(fieldName));
  const [isAllChecked, setIsAllChecked] = useState(false);

  const {
    listDataMultipleInfo, listDataMultipleCountInfo, listDataMultipleCountLoading,
  } = useSelector((state) => state.ticket);

  useEffect(() => {
    if (searchValue) {
      const foundIdx = searchValue.indexOf('(');
      if (foundIdx >= 0) {
        const addDataToSearch = `${searchValue.slice(0, foundIdx)}%${searchValue.substring(foundIdx, searchValue.length)}`;
        setChangedSearchValue(addDataToSearch);
      } else {
        setChangedSearchValue(searchValue);
      }
    }
  }, [searchValue]);

  useEffect(() => {
    if (fieldName === 'equipment') {
      setCheckRows(oldEquipValues);
    }
    if (fieldName === 'space' || fieldName === 'space_block_id') {
      setCheckRows(oldSpaceValues);
    }
    if (fieldName === 'maintenance_team_id') {
      setCheckRows(oldTeamValues);
    }
  }, []);

  useEffect(() => {
    if (modelName && fields) {
      let searchValueMultiple = `[["company_id","in",[${company}]]`;

      if (searchValue && fieldName === 'equipment') {
        searchValueMultiple = `${searchValueMultiple},"|","|",["name","ilike","${ChangedSearchValue}"],["location_id.path_name","ilike","${ChangedSearchValue}"],["category_id.name","ilike","${ChangedSearchValue}"]`;
      }
      if (searchValue && (fieldName === 'space' || fieldName === 'space_block_id')) {
        searchValueMultiple = `${searchValueMultiple},"|","|",["space_name","ilike","${ChangedSearchValue}"],["path_name","ilike","${ChangedSearchValue}"],["asset_category_id.name","ilike","${ChangedSearchValue}"]`;
      }
      if (fieldName === 'maintenance_team_id') {
        searchValueMultiple = `${searchValueMultiple},["name","!=",false],`;
        if (searchValue) {
          searchValueMultiple = `${searchValueMultiple},"|",["name","ilike","${ChangedSearchValue}"]`;
        }
      }

      searchValueMultiple = `${searchValueMultiple}]`;
      dispatch(getExtraSelectionMultiple(company, modelName, limit, offset, fields, searchValueMultiple));
    }
  }, [modelName, offset, isSearch]);

  useEffect(() => {
    if (modelName) {
      let searchValueMultiple = `[["company_id","in",[${company}]]`;

      if (searchValue && fieldName === 'equipment') {
        searchValueMultiple = `${searchValueMultiple},"|","|",["name","ilike","${ChangedSearchValue}"],["location_id.path_name","ilike","${ChangedSearchValue}"],["category_id.name","ilike","${ChangedSearchValue}"]`;
      }
      if (searchValue && (fieldName === 'space' || fieldName === 'space_block_id')) {
        searchValueMultiple = `${searchValueMultiple},"|","|",["space_name","ilike","${ChangedSearchValue}"],["path_name","ilike","${ChangedSearchValue}"],["asset_category_id.name","ilike","${ChangedSearchValue}"]`;
      }
      if (searchValue && fieldName === 'maintenance_team_id') {
        searchValueMultiple = `${searchValueMultiple},"|","|",["id","ilike","${ChangedSearchValue}"],["name","ilike","${ChangedSearchValue}"]`;
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
      if (fieldName === 'equipment') {
        onEquipmentChange(checkedRows);
      }
      if (fieldName === 'space' || fieldName === 'space_block_id') {
        onSpaceChange(checkedRows);
      }
      if (fieldName === 'maintenance_team_id') {
        onTeamChange(checkedRows);
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
            <div className="checkbox">
              <Input
                type="checkbox"
                value={JSON.stringify(assetData[i])}
                id={`checkboxtk${assetData[i].id}`}
                className="ml-0"
                name={(fieldName !== 'space' || fieldName !== 'space_block_id') ? assetData[i].name : assetData[i].space_name}
                checked={checkedRows.some((selectedValue) => parseInt(selectedValue.id) === parseInt(assetData[i].id))}
                onChange={handleTableCellChange}
              />
              <Label htmlFor={`checkboxtk${assetData[i].id}`} />
            </div>
          </td>
          {fieldName === 'equipment' && (
            <>
              <td className="p-2"><span className="font-weight-400">{getDefaultNoValue((assetData[i].name))}</span></td>
              <td className="p-2"><span className="font-weight-400">{getDefaultNoValue(extractTextObject(assetData[i].location_id))}</span></td>
              <td className="p-2"><span className="font-weight-400">{getDefaultNoValue(extractTextObject(assetData[i].category_id))}</span></td>
            </>
          )}
          {(fieldName === 'space' || fieldName === 'space_block_id') && (
          <>
            <td className="p-2"><span className="font-weight-400">{getDefaultNoValue(assetData[i].space_name)}</span></td>
            <td className="p-2"><span className="font-weight-400">{getDefaultNoValue(assetData[i].path_name)}</span></td>
            <td className="p-2"><span className="font-weight-400">{getDefaultNoValue(extractTextObject(assetData[i].asset_category_id))}</span></td>
          </>
          )}
          {fieldName === 'maintenance_team_id' && (
            <td className="p-2"><span className="font-weight-400">{getDefaultNoValue((assetData[i].name))}</span></td>
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
                        <div className="checkbox">
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
                        </div>
                      </th>
                      <th className="p-2 min-width-100">
                        Name
                      </th>
                      {fieldName === 'equipment' && (
                      <>
                        <th className="p-2 min-width-100">
                          Location
                        </th>
                        <th className="p-2 min-width-100">
                          Category
                        </th>
                      </>
                      )}
                      {(fieldName === 'space' || fieldName === 'space_block_id') && (
                      <>
                        <th className="p-2 min-width-100">
                          Path Name
                        </th>
                        <th className="p-2 min-width-100">
                          Category
                        </th>
                      </>
                      )}
                      {fieldName === 'maintenance_team_id' && (
                        <th className="p-2 min-width-100">
                          Name
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
  oldEquipValues: PropTypes.array.isRequired,
  oldSpaceValues: PropTypes.array.isRequired,
  oldTeamValues: PropTypes.array.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  afterReset: PropTypes.func.isRequired,
  onEquipmentChange: PropTypes.func.isRequired,
  onSpaceChange: PropTypes.func.isRequired,
  onTeamChange: PropTypes.func.isRequired,
};

export default SearchModalSingle;
