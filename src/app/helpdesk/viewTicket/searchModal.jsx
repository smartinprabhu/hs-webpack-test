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
} from '../ticketService';
import { getDefaultNoValue, getPagesCountV2 } from '../../util/appUtils';

const useStyles = makeStyles((theme) => ({
  root: {
    '& > *': {
      marginTop: theme.spacing(2),
    },
  },
}));

const SearchModal = (props) => {
  const {
    modelName,
    afterReset,
    fieldName,
    fields,
    company,
    otherFieldName,
    otherFieldValue,
    modalName,
    onTeamModalChange,
    isIncident,
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
      let searchValueMultiple = `[["company_id","in",[${company}]]`;
      if (fieldName === 'category_id' || fieldName === 'sub_category_id') {
        searchValueMultiple = '[["name","!=",false]';
      }
      if (typeof otherFieldValue === 'string' && otherFieldValue !== 'true') {
        searchValueMultiple = `${searchValueMultiple},["${otherFieldName}","ilike","${otherFieldValue}"]`;
      } else if (typeof otherFieldValue === 'object' && otherFieldValue !== 'true' && otherFieldName !== 'not_in') {
        searchValueMultiple = `${searchValueMultiple},["${otherFieldName}","in",${JSON.stringify(otherFieldValue)}]`;
      } else if (typeof otherFieldValue === 'object' && otherFieldName === 'not_in') {
        searchValueMultiple = `${searchValueMultiple},["id","not in",${JSON.stringify(otherFieldValue)}]`;
      } else if (otherFieldName) {
        searchValueMultiple = `${searchValueMultiple},["${otherFieldName}","=",${otherFieldValue}]`;
      }

      if (fieldName === 'parent_id') {
        if (isIncident) {
          searchValueMultiple = `${searchValueMultiple},["issue_type","=","incident"]`;
        } else {
          searchValueMultiple = `${searchValueMultiple},["issue_type","!=","incident"]`;
        }
      }

      if (searchValue) {
        if (fieldName === 'requestee_id') {
          searchValueMultiple = `${searchValueMultiple},"|","|",["name","ilike","${searchValue}"],["email", "ilike", "${searchValue}"],["mobile", "ilike", "${searchValue}"]`;
        } else if (fieldName === 'parent_id') {
          searchValueMultiple = `${searchValueMultiple},"|",["ticket_number","ilike","${searchValue}"],["subject", "ilike", "${searchValue}"]`;
        } else {
          searchValueMultiple = `${searchValueMultiple},["name","ilike","${searchValue}"]`;
        }
      }
      searchValueMultiple = `${searchValueMultiple}]`;
      dispatch(getExtraSelectionMultiple(company, modelName, limit, offset, fields, searchValueMultiple));
    }
  }, [modelName, offset, searchValue, fieldName]);

  useEffect(() => {
    if (modelName) {
      let searchValueMultiple = `[["company_id","in",[${company}]]`;
      if (fieldName === 'category_id' || fieldName === 'sub_category_id') {
        searchValueMultiple = '[["name","!=",false]';
      }
      if (typeof otherFieldValue === 'string' && otherFieldValue !== 'true') {
        searchValueMultiple = `${searchValueMultiple},["${otherFieldName}","ilike","${otherFieldValue}"]`;
      } else if (typeof otherFieldValue === 'object' && otherFieldValue !== 'true' && otherFieldName !== 'not_in') {
        searchValueMultiple = `${searchValueMultiple},["${otherFieldName}","in",${JSON.stringify(otherFieldValue)}]`;
      } else if (typeof otherFieldValue === 'object' && otherFieldName === 'not_in') {
        searchValueMultiple = `${searchValueMultiple},["id","not in",${JSON.stringify(otherFieldValue)}]`;
      } else if (otherFieldName) {
        searchValueMultiple = `${searchValueMultiple},["${otherFieldName}","=",${otherFieldValue}]`;
      }

      if (fieldName === 'parent_id') {
        if (isIncident) {
          searchValueMultiple = `${searchValueMultiple},["issue_type","=","incident"]`;
        } else {
          searchValueMultiple = `${searchValueMultiple},["issue_type","!=","incident"]`;
        }
      }

      if (searchValue) {
        if (fieldName === 'requestee_id') {
          searchValueMultiple = `${searchValueMultiple},"|","|",["name","ilike","${searchValue}"],["email", "ilike", "${searchValue}"],["mobile", "ilike", "${searchValue}"]`;
        } else if (fieldName === 'parent_id') {
          searchValueMultiple = `${searchValueMultiple},"|",["ticket_number","ilike","${searchValue}"],["subject", "ilike", "${searchValue}"]`;
        } else {
          searchValueMultiple = `${searchValueMultiple},["name","ilike","${searchValue}"]`;
        }
      }
      searchValueMultiple = `${searchValueMultiple}]`;
      dispatch(getExtraSelectionMultipleCount(company, modelName, fields, searchValueMultiple));
    }
  }, [modelName, searchValue, fieldName]);

  const totalDataCount = listDataMultipleCountInfo && listDataMultipleCountInfo.length ? listDataMultipleCountInfo.length : 0;

  const pages = getPagesCountV2(totalDataCount, limit);

  const handlePageClick = (e, index) => {
    e.preventDefault();
    const offsetValue = (index - 1) * limit;
    setPage(index);
    setOffset(offsetValue);
  };

  const onSearchChange = (e) => {
    const sVal = e.target.value ? e.target.value.trim() : '';
    setSearchValue(sVal);
  };

  const handleRowClick = (data) => {
    setSelected(data.id);
    onTeamModalChange(data);
    if (afterReset) afterReset();
  };

  function getRow(assetData) {
    const tableTr = [];
    for (let i = 0; i < assetData.length; i += 1) {
      tableTr.push(
        <tr className={selectedId === assetData[i].id ? 'text-info cursor-pointer' : 'cursor-pointer'} onClick={() => handleRowClick(assetData[i])} key={i}>
          {fieldName !== 'parent_id' && (
          <td className="p-2"><span className="font-weight-400">{getDefaultNoValue(assetData[i].name)}</span></td>
          )}
          {fieldName === 'parent_id' && (
          <>
            <td className="p-2"><span className="font-weight-400">{getDefaultNoValue(assetData[i].ticket_number)}</span></td>
            <td className="p-2"><span className="font-weight-400">{getDefaultNoValue(assetData[i].subject)}</span></td>
          </>
          )}
          {fieldName === 'requestee_id' && (
            <td className="p-2"><span className="font-weight-400">{getDefaultNoValue(assetData[i].email)}</span></td>
          )}
          {fieldName === 'requestee_id' && (
            <td className="p-2"><span className="font-weight-400">{getDefaultNoValue(assetData[i].mobile)}</span></td>
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
                    {totalDataCount}
                  </span>
                </div>
              </Col>
              <Col sm="12" md="3" lg="3" xs="12">
                <div className="">
                  <FormGroup>
                    <Input type="input" name="search" id="exampleSearch" placeholder={`Search ${modalName}`} onChange={onSearchChange} className="subjectticket bw-2 mt-2" />
                  </FormGroup>
                </div>
              </Col>
            </Row>
            <div className="pl-1 pr-1 pt-0 comments-list thin-scrollbar">
              {(listDataMultipleInfo && listDataMultipleInfo.data) && (
              <Table responsive>
                <thead className="bg-gray-light">
                  <tr>
                    {fieldName !== 'parent_id' && (
                    <th className="p-2 min-width-100">
                      Name
                    </th>
                    )}
                    {fieldName === 'parent_id' && (
                      <>
                        <th className="p-2 min-width-100">
                          Ticket Number
                        </th>
                        <th className="p-2 min-width-100">
                          Subject
                        </th>
                      </>
                    )}
                    {fieldName === 'requestee_id' && (
                    <th className="p-2 min-width-100">
                      Email ID
                    </th>
                    )}
                    {fieldName === 'requestee_id' && (
                    <th className="p-2 min-width-100">
                      Mobile
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

SearchModal.propTypes = {
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
  otherFieldName: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.string,
  ]).isRequired,
  modalName: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.string,
  ]).isRequired,
  otherFieldValue: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.string,
  ]).isRequired,
  onTeamModalChange: PropTypes.oneOfType([PropTypes.func, PropTypes.string]).isRequired,
  isIncident: PropTypes.bool,
};

SearchModal.defaultProps = {
  isIncident: false,
};

export default SearchModal;
