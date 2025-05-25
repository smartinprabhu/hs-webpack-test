/* eslint-disable max-len */
/* eslint-disable import/no-unresolved */
/* eslint-disable camelcase */
/* eslint-disable react/jsx-props-no-spreading */
import React, { useState, useEffect } from 'react';
import {
  Table,
  Col,
  Row,
  FormGroup,
  Input,
  Card,
  CardBody,
} from 'reactstrap';
import * as PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import Pagination from '@material-ui/lab/Pagination';

import SuccessAndErrorFormat from '@shared/successAndErrorFormat';
import Loader from '@shared/loading';
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
    afterReset,
    fieldName,
    fields,
    company,
    setFieldValue,
  } = props;
  const limit = 50;
  const dispatch = useDispatch();
  const classes = useStyles();
  const [selectedId, setSelected] = useState('');
  const [searchValue, setSearchValue] = useState('');
  const [offset, setOffset] = useState(0);
  const [page, setPage] = useState(1);

  const {
    listDataMultipleInfo, listDataMultipleCountInfo, listDataMultipleCountLoading,
  } = useSelector((state) => state.ticket);

  useEffect(() => {
    if (modelName && fields) {
      if (fieldName === 'space_id') {
        const searchValueMultiple = `["&",["company_id","in",[${company}]],"|",["space_name", "ilike", "${searchValue}"],["path_name", "ilike", "${searchValue}"]]`;
        dispatch(getExtraSelectionMultiple(company, modelName, limit, offset, fields, searchValueMultiple));
      }
      if (fieldName === 'purpose_id') {
        let searchValueMultiple = '[]';
        if (searchValue) {
          searchValueMultiple = `[["space_name", "ilike", "${searchValue}"]]`;
        }
        dispatch(getExtraSelectionMultiple(company, modelName, limit, offset, fields, searchValueMultiple));
      }
      if (fieldName === 'tenant_id') {
        let searchValueMultiple = `[["company_id","in",[${company}]],["is_tenant","=",true]`;
        if (searchValue) {
          searchValueMultiple = `[["name", "ilike", "${searchValue}"]]`;
        }
        searchValueMultiple = `${searchValueMultiple}]`;
        dispatch(getExtraSelectionMultiple(company, modelName, limit, offset, fields, searchValueMultiple));
      }
    }
  }, [modelName, offset, searchValue]);

  useEffect(() => {
    if (modelName && fields) {
      if ((fieldName === 'space_id')) {
        const searchValueMultiple = `["&",["company_id","in",[${company}]],"|",["space_name", "ilike", "${searchValue}"],["path_name", "ilike", "${searchValue}"]]`;
        dispatch(getExtraSelectionMultipleCount(company, modelName, fields, searchValueMultiple));
      }
      if (fieldName === 'purpose_id') {
        let searchValueMultiple = '[]';
        if (searchValue) {
          searchValueMultiple = `[["space_name", "ilike", "${searchValue}"]]`;
        }
        dispatch(getExtraSelectionMultipleCount(company, modelName, fields, searchValueMultiple));
      }
      if (fieldName === 'tenant_id') {
        let searchValueMultiple = `[["company_id","in",[${company}]],["is_tenant","=",true]`;
        if (searchValue) {
          searchValueMultiple = `[["name", "ilike", "${searchValue}"]]`;
        }
        searchValueMultiple = `${searchValueMultiple}]`;
        dispatch(getExtraSelectionMultipleCount(company, modelName, fields, searchValueMultiple));
      }
    }
  }, [modelName, searchValue]);

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
  };

  const handleRowClick = (data) => {
    setSelected(data.id);
    let items = {};
    if ((fieldName === 'space_id')) {
      items = { id: data.id, path_name: data.path_name };
    } else {
      items = { id: data.id, name: data.name };
    }
    setFieldValue(fieldName, items);
    if (afterReset) afterReset();
  };

  function getRow(arrayData) {
    const tableTr = [];
    for (let i = 0; i < arrayData.length; i += 1) {
      tableTr.push(
        <tr className={selectedId === arrayData[i].id ? 'text-info cursor-pointer' : 'cursor-pointer'} onClick={() => handleRowClick(arrayData[i])} key={i}>
          {fieldName === 'space_id' && (
            <>
              <td className="p-2"><span className="font-weight-400">{getDefaultNoValue(arrayData[i].space_name)}</span></td>
              <td className="p-2"><span className="font-weight-400">{getDefaultNoValue(arrayData[i].path_name)}</span></td>
            </>
          )}
          {fieldName === 'purpose_id' && (
            <td className="p-2"><span className="font-weight-400">{getDefaultNoValue(arrayData[i].name)}</span></td>
          )}
          {fieldName === 'tenant_id' && (
          <td className="p-2"><span className="font-weight-400">{getDefaultNoValue(arrayData[i].name)}</span></td>
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
              <Col sm="12" md="9" lg="9" xs="12">
                <div className="mt-3">
                  <span className="p-0 font-weight-600 font-medium mr-2">
                    Total :
                    {' '}
                    {!listDataMultipleInfo.loaading && (listDataMultipleInfo && listDataMultipleInfo.data) && (totalDataCount)}
                  </span>
                </div>
              </Col>
              <Col sm="12" md="3" lg="3" xs="12" className="pl-0">
                <div className="float-right">
                  <FormGroup>
                    <Input type="input" name="search" id="exampleSearch" placeholder="Search.." onChange={onSearchChange} className="subjectticket bw-2 mt-2" />
                  </FormGroup>
                </div>
              </Col>
            </Row>
            <div className="pl-1 pr-1 pt-0 comments-list thin-scrollbar">
              {(listDataMultipleInfo && listDataMultipleInfo.data) && (
              <Table responsive>
                <thead className="bg-gray-light">
                  <tr>
                    {fieldName === 'space_id' && (
                    <>
                      <th className="p-2 min-width-100">
                        Space Name
                      </th>
                      <th className="p-2 min-width-100">
                        Full Path Name
                      </th>
                    </>
                    )}
                    {fieldName === 'purpose_id' && (
                    <th className="p-2 min-width-100">
                      Purpose
                    </th>
                    )}
                    {fieldName === 'tenant_id' && (
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
  afterReset: PropTypes.func.isRequired,
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
  setFieldValue: PropTypes.oneOfType([PropTypes.func, PropTypes.string]).isRequired,
};

export default SearchModalMultiple;
