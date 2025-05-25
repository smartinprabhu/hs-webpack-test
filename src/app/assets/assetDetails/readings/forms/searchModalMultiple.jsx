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
} from '../../../../helpdesk/ticketService';
import { getDefaultNoValue, getPagesCountV2, getColumnArrayByIdWithArray } from '../../../../util/appUtils';

const useStyles = makeStyles((theme) => ({
  root: {
    '& > *': {
      marginTop: theme.spacing(2),
    },
  },
}));

const SearchModalMutliple = (props) => {
  const {
    modelName,
    afterReset,
    fieldName,
    fieldNameOne,
    fieldNameTwo,
    fields,
    company,
    setFieldValue,
  } = props;
  const limit = 50;
  const dispatch = useDispatch();
  const classes = useStyles();
  const [selectedId, setSelected] = useState('');
  const [searchValue, setSearchValue] = useState('');
  const [isSearch, setSearch] = useState(false);
  const [offset, setOffset] = useState(0);
  const [page, setPage] = useState(1);

  const {
    listDataMultipleInfo, listDataMultipleCountInfo, listDataMultipleCountLoading,
  } = useSelector((state) => state.ticket);
  const {
    assetReadings,
  } = useSelector((state) => state.equipment);

  const ids = getColumnArrayByIdWithArray(assetReadings && assetReadings.data && assetReadings.data.length > 0 ? assetReadings.data : [], 'reading_id');

  useEffect(() => {
    if (modelName && fields) {
      if (fieldName === 'reading_id') {
        const searchValueMultiple = `["&",["id","!=",false], ["id","not in",[${ids}]], "|","|",["name","ilike","${searchValue}"],["type", "ilike", "${searchValue}"],["uom_id", "ilike", "${searchValue}"]]`;
        dispatch(getExtraSelectionMultiple(company, modelName, limit, offset, fields, searchValueMultiple));
      }
    }
  }, [modelName, offset, isSearch]);

  useEffect(() => {
    if (modelName && fields) {
      if (fieldName === 'reading_id') {
        const searchValueMultiple = `["&",["id","!=",false], ["id","not in",[${ids}]],"|","|",["name","ilike","${searchValue}"],["type", "ilike", "${searchValue}"],["uom_id", "ilike", "${searchValue}"]]`;
        dispatch(getExtraSelectionMultipleCount(company, modelName, fields, searchValueMultiple));
      }
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

  const handleRowClick = (data) => {
    setSelected(data.id);
    const items = { id: data.id, display_name: data.name };
    setFieldValue(fieldName, items);
    setFieldValue(fieldNameOne, data.type);
    setFieldValue(fieldNameTwo, data.uom_id ? data.uom_id[1] : '');
    if (afterReset) afterReset();
  };

  function getRow(assetData) {
    const tableTr = [];
    for (let i = 0; i < assetData.length; i += 1) {
      tableTr.push(
        <tr className={selectedId === assetData[i].id ? 'text-info cursor-pointer' : 'cursor-pointer'} onClick={() => handleRowClick(assetData[i])} key={i}>
          <td className="p-2"><span className="font-weight-400">{getDefaultNoValue(assetData[i].name)}</span></td>
          {fieldName === 'reading_id' && (
            <td className="p-2"><span className="font-weight-400">{getDefaultNoValue(assetData[i].type)}</span></td>
          )}
          {fieldName === 'reading_id' && (
            <td className="p-2"><span className="font-weight-400">{getDefaultNoValue(assetData[i].uom_id ? assetData[i].uom_id[1] : '')}</span></td>
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
                    {!loading && (listDataMultipleInfo && listDataMultipleInfo.data) && (totalDataCount)}
                  </span>
                </div>
              </Col>
              <Col sm="12" md="2" lg="2" xs="12" className="pl-0">
                <div className="float-right">
                  <FormGroup>
                    <Input type="input" name="search" id="exampleSearch" placeholder="Search.." onChange={onSearchChange} onKeyDown={onSearchChange} className="subjectticket bw-2 mt-2" />
                  </FormGroup>
                </div>
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
                    {fieldName === 'reading_id' && (
                    <th className="p-2 min-width-100">
                      Type
                    </th>
                    )}
                    {fieldName === 'reading_id' && (
                    <th className="p-2 min-width-100">
                      Unit of Measure
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

SearchModalMutliple.propTypes = {
  modelName: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.string,
  ]).isRequired,
  fieldName: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.string,
  ]).isRequired,
  fieldNameOne: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.string,
  ]).isRequired,
  fieldNameTwo: PropTypes.oneOfType([
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

export default SearchModalMutliple;
