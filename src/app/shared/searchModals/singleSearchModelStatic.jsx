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
import { useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import Pagination from '@material-ui/lab/Pagination';

import SuccessAndErrorFormat from '@shared/successAndErrorFormat';
import ModalSearch from '@shared/modalSearch';

import { getDefaultNoValue, getPagesCountV2 } from '../../util/appUtils';

const useStyles = makeStyles((theme) => ({
  root: {
    '& > *': {
      marginTop: theme.spacing(2),
    },
  },
}));

const SearchModalSingle = (props) => {
  const {
    afterReset,
    fieldName,
    data,
    dataChange,
    modalName,
    fields,
    oldValues,
    setFieldValue,
    headers,
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
  const [selectedId, setSelected] = useState('');

  const [pageData, setPageData] = useState([]);
  const [filterData, setFilterData] = useState([]);
  const [originalData, setOgData] = useState([]);

  useEffect(() => {
    setSelected(oldValues);
  }, []);

  useEffect(() => {
    if (data && data.length) {
      setPageData(data.slice(0, limit));
      setFilterData(data);
      setOgData(JSON.stringify(data));
    }
  }, [data]);

  const totalDataCount = filterData && filterData.length ? filterData.length : 0;

  const pages = getPagesCountV2(totalDataCount, limit);

  const handlePageClick = (e, index) => {
    e.preventDefault();
    const offsetValue = (index - 1) * limit;
    setPage(index);
    setOffset(offsetValue);
    setPageData(filterData.slice(offsetValue, offsetValue + limit));
    setIsAllChecked(false);
  };

  const handleRowClick = (datas) => {
    setSelected(datas.id);
    setFieldValue(fieldName, datas);
    if (afterReset) afterReset();
  };

  const onSearchChange = (e) => {
    setSearchValue(e.target.value);
    if (e.key === 'Enter') {
      setSearch(Math.random());
      setPage(1);
      setOffset(0);
      const ndata = filterData.filter((item) => {
        const searchedValue = item.name ? item.name.toString().toUpperCase() : '';
        const s = e.target.value.toString().toUpperCase();
        return (searchedValue.search(s) !== -1);
      });
      setPageData(ndata.slice(0, limit));
      setFilterData(ndata);
    }
  };

  const onClear = () => {
    setSearchValue('');
    setSearch(Math.random());
    setPage(1);
    setOffset(0);
    setPageData(JSON.parse(originalData).slice(0, limit));
    setFilterData(JSON.parse(originalData));
  };

  const onSearch = () => {
    setSearch(Math.random());
    setPage(1);
    setOffset(0);
    const ndata = filterData.filter((item) => {
      const searchedValue = item.name ? item.name.toString().toUpperCase() : '';
      const s = searchValue.toString().toUpperCase();
      return (searchedValue.search(s) !== -1);
    });
    setPageData(ndata.slice(0, limit));
    setFilterData(ndata);
  };

  function getDataName(datas) {
    let res = datas.name;
    if (datas.cat_display_name) {
      res = datas.cat_display_name;
    } else if (datas.sub_cat_display_name) {
      res = datas.sub_cat_display_name;
    }
    return res;
  }

  function getRow(assetData) {
    const tableTr = [];
    for (let i = 0; i < assetData.length; i += 1) {
      tableTr.push(
        <tr className={selectedId === assetData[i].id ? 'text-info cursor-pointer' : 'cursor-pointer'} onClick={() => handleRowClick(assetData[i])} key={i}>
          <td className="p-2"><span className="font-weight-400">{getDefaultNoValue(getDataName(assetData[i]))}</span></td>
        </tr>,
      );
    }
    return tableTr;
  }

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
                  modalName={modalName}
                  onClear={onClear}
                  onSearch={onSearch}
                />
              </Col>
            </Row>
            <div className="pl-1 pr-1 pt-0 comments-list thin-scrollbar">
              {(filterData && filterData.length > 0) && (
              <Table responsive>
                <thead className="bg-gray-light">
                  <tr>
                    {headers && headers.map((header) => (
                      <th className="p-2 min-width-100">
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {getRow(pageData)}
                </tbody>
              </Table>
              )}
            </div>
            {pages === 0 ? (<span />) : (
              <div className={`${classes.root} float-right`}>
                <Pagination count={pages} page={page} size="small" color="primary" onChange={handlePageClick} showFirstButton showLastButton />
              </div>
            )}
            {!(filterData && filterData.length > 0) && (
            <SuccessAndErrorFormat response="No Data Found" />
            )}
          </CardBody>
        </Card>
      </Col>
    </Row>
  );
};

SearchModalSingle.propTypes = {
  afterReset: PropTypes.func.isRequired,
};

export default SearchModalSingle;