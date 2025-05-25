/* eslint-disable no-nested-ternary */
/* eslint-disable max-len */
/* eslint-disable radix */
/* eslint-disable import/no-unresolved */
/* eslint-disable camelcase */
/* eslint-disable react/jsx-props-no-spreading */
import { makeStyles } from '@material-ui/core/styles';
import Pagination from '@material-ui/lab/Pagination';
import * as PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import {
  Card, CardBody, Col, Row, Table,
} from 'reactstrap';

import Loader from '@shared/loading';
import ModalSearch from '@shared/modalSearch';
import SuccessAndErrorFormat from '@shared/successAndErrorFormat';

import { getDefaultNoValue, getPagesCountV2 } from '../../util/appUtils';

const useStyles = makeStyles((theme) => ({
  root: {
    '& > *': {
      marginTop: theme.spacing(2),
    },
  },
}));

const searchModalCustom = (props) => {
  const {
    fieldName,
    afterReset,
    setFieldValue,
    customDataInfo,
  } = props;
  const limit = 10;
  const classes = useStyles();
  const [searchValue, setSearchValue] = useState('');
  const [offset, setOffset] = useState(0);
  const [page, setPage] = useState(1);
  const [categoryData, setCategoryData] = useState([]);
  const [totalData, setTotalData] = useState([]);
  const [selectedId, setSelected] = useState('');

  const [arrayOnClear, setArrayOnClear] = useState([]);
  const [pageData, setPageData] = useState([]);
  const {
    listDataMultipleInfo, listDataMultipleCountLoading,
  } = useSelector((state) => state.ticket);

  useEffect(() => {
    if ((fieldName === 'vendor_id') && customDataInfo && customDataInfo.data && customDataInfo.data.length) {
      setCategoryData(customDataInfo.data);
      setTotalData(customDataInfo.data);
      setArrayOnClear(customDataInfo.data);
    } else {
      setCategoryData([]);
    }
  }, [customDataInfo]);

  const totalDataCount = () => {
    let totalCount = '';
    if ((fieldName === 'vendor_id') && totalData) {
      totalCount = totalData && totalData.length ? totalData.length : 0;
    }

    return totalCount;
  };

  const pages = getPagesCountV2(totalDataCount(), limit);

  useEffect(() => {
    if ((fieldName === 'vendor_id') && categoryData && categoryData.length && !offset) {
      let data = [];

      data = categoryData.slice(0, 10);
      setPageData(data);
    }
  }, [fieldName, categoryData, offset]);

  useEffect(() => {
    if ((fieldName === 'vendor_id') && categoryData && offset) {
      setPageData(categoryData);
    }
  }, [categoryData, offset]);

  const handlePageClick = (e, index) => {
    e.preventDefault();
    const offsetValue = (index - 1) * limit;
    setPage(index);
    setOffset(offsetValue);
    if (fieldName === 'vendor_id') {
      const data = totalData;
      setCategoryData(data.slice(offsetValue, (offsetValue + limit)));
    }
  };

  const onSearchChangeCategory = (e) => {
    setSearchValue(e.target.value);
    let res = [];
    if (fieldName === 'vendor_id') {
      res = totalData.filter((obj) => ((typeof obj.name === 'string' ? ((obj.name).toLowerCase().includes(searchValue.toLowerCase())) : '') || (typeof obj.email === 'string' ? (obj.email.toLowerCase().includes(searchValue.toLowerCase())) : '')));
    }
    if (e.target.value === '') {
      setSearchValue('');
      setTotalData(arrayOnClear);
      setCategoryData(arrayOnClear);
      setPage(1);
      setOffset(0);
    }
    if (e.key === 'Enter') {
      setCategoryData(res);
      setTotalData(res);
      if (res && !res.length) {
        setPageData(res);
      }
      setPage(1);
      setOffset(0);
    }
  };

  const onClearCategory = () => {
    setSearchValue('');
    setTotalData(arrayOnClear);
    setCategoryData(arrayOnClear);
    setPage(1);
    setOffset(0);
  };

  const onSearchCategory = () => {
    let res = [];
    if (fieldName === 'vendor_id') {
      res = totalData.filter((obj) => ((typeof obj.name === 'string' ? ((obj.name).toLowerCase().includes(searchValue.toLowerCase())) : '') || (typeof obj.email === 'string' ? (obj.email.toLowerCase().includes(searchValue.toLowerCase())) : '')));
    }
    setCategoryData(res);
    setTotalData(res);
    if (res && !res.length) {
      setPageData(res);
    }
    setPage(1);
    setOffset(0);
  };

  const handleRowClick = (data) => {
    setSelected(data.id);
    if (fieldName === 'vendor_id') {
      setFieldValue(data);
    }
    if (afterReset) afterReset();
  };


  function getRow(assetData) {
    const tableTr = [];
    for (let i = 0; i < assetData.length; i += 1) {
      tableTr.push(
        <tr className={selectedId === assetData[i].id ? 'text-info cursor-pointer' : 'cursor-pointer'} onClick={() => handleRowClick(assetData[i])} key={i}>
          {(fieldName === 'vendor_id') && (
            <>
              <td className="p-2 border-vendor-table"><span className="font-weight-400">{getDefaultNoValue(assetData[i].name)}</span></td>
              <td className="p-2 border-vendor-table"><span className="font-weight-400">{getDefaultNoValue(assetData[i].email)}</span></td>
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
              {(((fieldName === 'vendor_id') && customDataInfo && customDataInfo.loading === false)) && (
                <Table responsive className='border-vendor-table'>
                  <thead className="bg-gray-light">
                    <tr className='border-vendor-table'>
                      {(fieldName === 'vendor_id') && (
                        <>
                          <th className="p-2 min-width-100 border-vendor-table">
                            Name
                          </th>
                          <th className="p-2 min-width-100 border-vendor-table">
                            Email ID
                          </th>
                        </>
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {(customDataInfo !== undefined && (fieldName === 'vendor_id')) ? getRow(pageData) : []}
                  </tbody>
                </Table>
              )}
            </div>
            {loading || pages === 0 ? (<span />) : (
              <div className={`${classes.root} float-right`}>
                <Pagination count={pages} page={page} size="small" color="primary" onChange={handlePageClick} showFirstButton showLastButton />
              </div>
            )}

            {((customDataInfo && customDataInfo.loading)) && (
              <Loader />
            )}
            {listDataMultipleInfo && listDataMultipleInfo.err && (
              <SuccessAndErrorFormat response={listDataMultipleInfo} />
            )}
          </CardBody>
        </Card>
      </Col>
    </Row>
  );
};

searchModalCustom.propTypes = {
  modelName: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.string,
  ]).isRequired,
  fields: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.bool,
    PropTypes.string,
  ]).isRequired,
  customDataInfo: PropTypes.oneOfType([
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

export default searchModalCustom;
