/* eslint-disable no-nested-ternary */
/* eslint-disable radix */
/* eslint-disable import/no-unresolved */
/* eslint-disable camelcase */
/* eslint-disable react/jsx-props-no-spreading */
import React, { useState, useEffect } from 'react';
import {
  Table,
  Col,
  Row,
  FormGroup,
  Card,
  CardBody,
} from 'reactstrap';
import {
  Input,
} from '@material-ui/core';
import * as PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import Pagination from '@material-ui/lab/Pagination';

import SuccessAndErrorFormat from '@shared/successAndErrorFormat';
import Loader from '@shared/loading';

import {
  getExtraSelection, getExtraSelectionCount,
} from '../../../../helpdesk/ticketService';
import {
  getDefaultNoValue, getPagesCountV2,
} from '../../../../util/appUtils';

const useStyles = makeStyles((theme) => ({
  root: {
    '& > *': {
      marginTop: theme.spacing(2),
    },
  },
}));

const AdvancedSearchModal = (props) => {
  const {
    modelName,
    afterReset,
    fieldName,
    fields,
    company,
    otherFieldName,
    otherFieldValue,
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
    listDataInfo, listDataCountInfo, listDataCountLoading,
  } = useSelector((state) => state.ticket);

  useEffect(() => {
    if (modelName && fields) {
      const sortField = fieldName === 'helpdesk_survey' ? 'title' : 'name';
      dispatch(getExtraSelection(company, modelName, limit, offset, fields, searchValue, otherFieldName, otherFieldValue, sortField));
    }
  }, [modelName, offset, searchValue]);

  useEffect(() => {
    if (modelName) {
      dispatch(getExtraSelectionCount(company, modelName, searchValue, otherFieldName, otherFieldValue));
    }
  }, [modelName, searchValue]);

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
    let items = { id: data.id, name: data.name };
    if (fieldName === 'parent_id') {
      items = { id: data.id, display_name: data.display_name };
    }
    if (fieldName === 'helpdesk_survey') {
      items = { id: data.id, title: data.title };
    }
    setFieldValue(fieldName, items);
    if (afterReset) afterReset();
  };

  function getRow(assetData) {
    const tableTr = [];
    for (let i = 0; i < assetData.length; i += 1) {
      tableTr.push(
        <tr className={selectedId === assetData[i].id ? 'text-info cursor-pointer' : 'cursor-pointer'} onClick={() => handleRowClick(assetData[i])} key={i}>
          <td className="p-2">
            <span className="font-weight-400">
              {fieldName === 'parent_id'
                ? getDefaultNoValue(assetData[i].display_name) : fieldName === 'helpdesk_survey'
                  ? getDefaultNoValue(assetData[i].title) : getDefaultNoValue(assetData[i].name)}
            </span>

          </td>
        </tr>,
      );
    }
    return tableTr;
  }

  const loading = (listDataInfo && listDataInfo.loading) || (listDataCountLoading);
  const totalDataCount = listDataCountInfo && listDataCountInfo.length ? listDataCountInfo.length : 0;

  const pages = getPagesCountV2(totalDataCount, limit);

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
                <div className="float-right">
                  <FormGroup>
                    <Input type="input" name="search" id="exampleSearch" placeholder="Search" onChange={onSearchChange} className="subjectticket bw-2 mt-2" />
                  </FormGroup>
                </div>
              </Col>
            </Row>

            <div className="pl-1 pr-1 pt-0 comments-list thin-scrollbar">
              {(listDataInfo && listDataInfo.data) && (
                <Table responsive>
                  <thead className="bg-gray-light">
                    <tr>
                      {fieldName === 'helpdesk_survey'
                        ? (
                          <th className="p-2 min-width-100">
                            Title
                          </th>
                        )

                        : (
                          <th className="p-2 min-width-100">
                            Name
                          </th>
                        )}

                    </tr>
                  </thead>
                  <tbody>
                    {getRow(listDataInfo && listDataInfo.data ? listDataInfo.data : [])}
                  </tbody>
                </Table>
              )}
            </div>
            {loading || pages === 0 ? (<span />) : (
              <div className={`${classes.root} float-right`}>
                <Pagination count={pages} page={page} size="small" color="primary" onChange={handlePageClick} showFirstButton showLastButton />
              </div>
            )}
            {listDataInfo && listDataInfo.loading && (
              <Loader />
            )}
            {(listDataInfo && listDataInfo.err) && (
              <SuccessAndErrorFormat response={listDataInfo} />
            )}
          </CardBody>
        </Card>
      </Col>
    </Row>
  );
};

AdvancedSearchModal.propTypes = {
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
  otherFieldValue: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.string,
  ]).isRequired,
  setFieldValue: PropTypes.oneOfType([PropTypes.func, PropTypes.string]).isRequired,
};

export default AdvancedSearchModal;
