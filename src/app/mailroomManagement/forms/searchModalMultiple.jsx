/* eslint-disable no-loop-func */
/* eslint-disable radix */
/* eslint-disable max-len */
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
} from '../../helpdesk/ticketService';
import { getDefaultNoValue, getPagesCountV2 } from '../../util/appUtils';

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
    fieldName,
    fields,
    company,
    afterReset,
    setFieldValue,
  } = props;
  const limit = 50;
  const dispatch = useDispatch();
  const classes = useStyles();
  const [isSearch, setSearch] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [offset, setOffset] = useState(0);
  const [page, setPage] = useState(1);
  const [selectedId, setSelected] = useState('');

  const {
    listDataMultipleInfo, listDataMultipleCountInfo, listDataMultipleCountLoading,
  } = useSelector((state) => state.ticket);

  useEffect(() => {
    if (modelName && fields) {
      let searchValueMultiple = `[["company_id","in",[${company}]]`;

      if (fieldName === 'employee_id_seq') {
        searchValueMultiple = `${searchValueMultiple},["name","!=",false],["work_email","!=",false],["employee_id_seq","!=",false]`;
        if (searchValue) {
          searchValueMultiple = `${searchValueMultiple},"|","|",["name","ilike","${searchValue}"],["work_email","ilike","${searchValue}"],["employee_id_seq","ilike","${searchValue}"]`;
        }
      }
      searchValueMultiple = `${searchValueMultiple}]`;
      dispatch(getExtraSelectionMultiple(company, modelName, limit, offset, fields, searchValueMultiple));
    }
  }, [modelName, offset, isSearch]);

  useEffect(() => {
    if (modelName && fields) {
      let searchValueMultiple = `[["company_id","in",[${company}]]`;

      if (fieldName === 'employee_id_seq') {
        searchValueMultiple = `${searchValueMultiple},["name","!=",false],["work_email","!=",false],["employee_id_seq","!=",false]`;
        if (searchValue) {
          searchValueMultiple = `${searchValueMultiple},"|","|",["name","ilike","${searchValue}"],["work_email","ilike","${searchValue}"],["employee_id_seq","ilike","${searchValue}"]`;
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
  };

  const handleRowClick = (data) => {
    setSelected(data.id);
    setFieldValue(fieldName, data);
    if (afterReset) afterReset();
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

  function getRow(arrayData) {
    const tableTr = [];
    for (let i = 0; i < arrayData.length; i += 1) {
      tableTr.push(
        <tr className={selectedId === arrayData[i].id ? 'text-info cursor-pointer' : 'cursor-pointer'} onClick={() => handleRowClick(arrayData[i])} key={i}>
          {(fieldName === 'employee_id_seq') && (
            <>
              <td><span className="font-weight-400">{getDefaultNoValue(arrayData[i].name)}</span></td>
              <td><span className="font-weight-400">{getDefaultNoValue(arrayData[i].employee_id_seq)}</span></td>
              <td><span className="font-weight-400">{getDefaultNoValue(arrayData[i].work_email)}</span></td>
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
                    {(!listDataMultipleInfo.loaading && (listDataMultipleInfo && listDataMultipleInfo.data) && (totalDataCount))}
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
                    {(fieldName === 'employee_id_seq') && (
                    <>
                      <th className="p-2 min-width-100">
                        Name
                      </th>
                      <th className="p-2 min-width-100">
                        id
                      </th>
                      <th className="p-2 min-width-100">
                        Email
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

SearchModalMultiple.propTypes = {
  modelName: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.string,
  ]).isRequired,
  fieldName: PropTypes.oneOfType([
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
  afterReset: PropTypes.func.isRequired,
  setFieldValue: PropTypes.func.isRequired,
};

export default SearchModalMultiple;
