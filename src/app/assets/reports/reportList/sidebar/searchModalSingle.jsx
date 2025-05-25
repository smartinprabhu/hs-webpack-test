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
  CardBody,
} from 'reactstrap';
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

const SearchModalSingle = (props) => {
  const {
    modelName,
    fields,
    company,
    fieldName,
    afterReset,
    setSpaceValue,
    defaultSpace,
    setEquipValue,
  } = props;
  const limit = 50;
  const dispatch = useDispatch();
  const classes = useStyles();
  const [searchValue, setSearchValue] = useState('');
  const [offset, setOffset] = useState(0);
  const [page, setPage] = useState(1);
  const [ChangedSearchValue, setChangedSearchValue] = useState('');
  const [isSearch, setSearch] = useState(false);

  const [selectedId, setSelected] = useState('');

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
    if (modelName && fields) {
      let searchValueMultiple = '[';
      if (fieldName !== 'by_period') {
        searchValueMultiple = `[["company_id","in",[${company}]]`;
      }
      if (fieldName === 'equipment_id') {
        if (searchValue) {
          searchValueMultiple = `${searchValueMultiple},"|","|","|",["name","ilike","${ChangedSearchValue}"],["location_id.path_name","ilike","${ChangedSearchValue}"],["block_id.name","ilike","${ChangedSearchValue}"],["category_id.name","ilike","${ChangedSearchValue}"]`;
        }
      }
      if (fieldName === 'space_id') {
        if (searchValue) {
          searchValueMultiple = `${searchValueMultiple},"|",["space_name","ilike","${ChangedSearchValue}"],["path_name","ilike","${ChangedSearchValue}"]`;
        }
      }
      if (fieldName === 'equipment_id') {
        searchValueMultiple = `${searchValueMultiple},["location_id","in","${defaultSpace}"]]`;
      } else {
        searchValueMultiple = `${searchValueMultiple}]`;
      }

      dispatch(getExtraSelectionMultiple(company, modelName, limit, offset, fields, searchValueMultiple));
    }
  }, [modelName, offset, isSearch]);

  useEffect(() => {
    if (modelName) {
      let searchValueMultiple = '[';
      if (fieldName !== 'by_period') {
        searchValueMultiple = `[["company_id","in",[${company}]]`;
      }
      if (fieldName === 'equipment_id') {
        if (searchValue) {
          searchValueMultiple = `${searchValueMultiple},"|","|","|",["name","ilike","${ChangedSearchValue}"],["location_id.path_name","ilike","${ChangedSearchValue}"],["block_id.name","ilike","${ChangedSearchValue}"],["category_id.name","ilike","${ChangedSearchValue}"]`;
        }
      }
      if (fieldName === 'space_id') {
        if (searchValue) {
          searchValueMultiple = `${searchValueMultiple},"|",["space_name","ilike","${ChangedSearchValue}"],["path_name","ilike","${ChangedSearchValue}"]`;
        }
      }
      if (fieldName === 'equipment_id') {
        searchValueMultiple = `${searchValueMultiple},["location_id","in","${defaultSpace}"]]`;
      } else {
        searchValueMultiple = `${searchValueMultiple}]`;
      }
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

  const handleRowClick = (data) => {
    setSelected(data.id);
    if (fieldName === 'space_id') {
      setSpaceValue(data);
    }
    if (fieldName === 'equipment_id') {
      setEquipValue(data);
    }
    if (afterReset) afterReset();
  };

  function getRow(assetData) {
    const tableTr = [];
    for (let i = 0; i < assetData.length; i += 1) {
      tableTr.push(
        <tr className={selectedId === assetData[i].id ? 'text-info cursor-pointer' : 'cursor-pointer'} onClick={() => handleRowClick(assetData[i])} key={i}>
          {fieldName !== 'space_id' && (
            <td className="p-2"><span className="font-weight-400">{getDefaultNoValue(assetData[i].name)}</span></td>
          )}
          {fieldName === 'equipment_id' && (
            <>
              <td className="p-2"><span className="font-weight-400">{getDefaultNoValue(extractTextObject(assetData[i].location_id))}</span></td>
              <td className="p-2"><span className="font-weight-400">{getDefaultNoValue(extractTextObject(assetData[i].category_id))}</span></td>
            </>
          )}
          {fieldName === 'space_id' && (
            <>
              <td className="p-2"><span className="font-weight-400">{getDefaultNoValue(assetData[i].space_name)}</span></td>
              <td className="p-2"><span className="font-weight-400">{getDefaultNoValue(assetData[i].path_name)}</span></td>
            </>
          )}
          {fieldName === 'order' && (
            <>
              <td className="p-2"><span className="font-weight-400">{getDefaultNoValue(assetData[i].sequence)}</span></td>
              <td className="p-2"><span className="font-weight-400">{getDefaultNoValue(extractTextObject(assetData[i].maintenance_team_id))}</span></td>
            </>
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
                      <th className="p-2 min-width-100">
                        Name
                      </th>
                      {fieldName === 'equipment_id' && (
                        <>
                          <th className="p-2 min-width-100">
                            Location
                          </th>
                          <th className="p-2 min-width-100">
                            Category
                          </th>
                        </>
                      )}
                      {fieldName === 'space_id' && (
                        <th className="p-2 min-width-100">
                          Path Name
                        </th>
                      )}
                      {fieldName === 'order' && (
                        <>
                          <th className="p-2 min-width-100">
                            Asset Number
                          </th>
                          <th className="p-2 min-width-100">
                            Maintenance Team
                          </th>
                        </>
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
  setSpaceValue: PropTypes.func.isRequired,
  defaultSpace: PropTypes.func.isRequired,
  setEquipValue: PropTypes.func.isRequired,
};

export default SearchModalSingle;
