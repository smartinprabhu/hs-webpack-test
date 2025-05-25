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
  FormGroup,
  Input,
  Card,
  CardBody,
} from 'reactstrap';
import * as PropTypes from 'prop-types';
import { Checkbox } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import Pagination from '@material-ui/lab/Pagination';

import SuccessAndErrorFormat from '@shared/successAndErrorFormat';
import Loader from '@shared/loading';
import {
  getExtraSelectionMultiple, getExtraSelectionMultipleCount,
} from '../../../../helpdesk/ticketService';
import { getDefaultNoValue, getPagesCountV2 } from '../../../../util/appUtils';

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
    fieldName,
    fields,
    company,
    oldSpaceIdData,
    oldAccessData,
    olCheckedRows,
    setCheckedRows,
    oldVisitorData,
    oldAssetData,
  } = props;
  const limit = 50;
  const dispatch = useDispatch();
  const classes = useStyles();
  const [selectedId, setSelected] = useState('');
  const [searchValue, setSearchValue] = useState('');
  const [offset, setOffset] = useState(0);
  const [page, setPage] = useState(1);
  const [checkedRows, setCheckRows] = useState(olCheckedRows);

  const {
    listDataMultipleInfo, listDataMultipleCountInfo, listDataMultipleCountLoading,
  } = useSelector((state) => state.ticket);

  useEffect(() => {
    if (fieldName === 'allowed_sites_ids') {
      setCheckRows(oldSpaceIdData);
    }
    if (fieldName === 'allowed_domains_host_ids') {
      setCheckRows(oldAccessData);
    }
    if (fieldName === 'visitor_types') {
      setCheckRows(oldVisitorData);
    }
    if (fieldName === 'visitor_allowed_asset_ids') {
      setCheckRows(oldAssetData);
    }
  }, []);

  useEffect(() => {
    if (modelName && fields) {
      if (fieldName === 'allowed_sites_ids') {
        const searchValueMultiple = `[["name", "ilike", "${searchValue}"]]`;
        dispatch(getExtraSelectionMultiple(company, modelName, limit, offset, fields, searchValueMultiple));
      }
      if (fieldName === 'allowed_domains_host_ids') {
        const searchValueMultiple = `[["name", "ilike", "${searchValue}"]]`;
        dispatch(getExtraSelectionMultiple(company, modelName, limit, offset, fields, searchValueMultiple));
      }
      if (fieldName === 'visitor_types') {
        const searchValueMultiple = `[["name", "ilike", "${searchValue}"]]`;
        dispatch(getExtraSelectionMultiple(company, modelName, limit, offset, fields, searchValueMultiple));
      }
      if (fieldName === 'visitor_allowed_asset_ids') {
        const searchValueMultiple = `[["name", "ilike", "${searchValue}"]]`;
        dispatch(getExtraSelectionMultiple(company, modelName, limit, offset, fields, searchValueMultiple));
      }
    }
  }, [modelName, offset, searchValue]);

  useEffect(() => {
    if (modelName && fields) {
      if ((fieldName === 'allowed_sites_ids')) {
        const searchValueMultiple = `[["name", "ilike", "${searchValue}"]]`;
        dispatch(getExtraSelectionMultipleCount(company, modelName, fields, searchValueMultiple));
      }
      if ((fieldName === 'allowed_domains_host_ids')) {
        const searchValueMultiple = `[["name", "ilike", "${searchValue}"]]`;
        dispatch(getExtraSelectionMultipleCount(company, modelName, fields, searchValueMultiple));
      }
      if ((fieldName === 'visitor_types')) {
        const searchValueMultiple = `[["name", "ilike", "${searchValue}"]]`;
        dispatch(getExtraSelectionMultipleCount(company, modelName, fields, searchValueMultiple));
      }
      if ((fieldName === 'visitor_allowed_asset_ids')) {
        const searchValueMultiple = `[["name", "ilike", "${searchValue}"]]`;
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

  const handleTableCellChange = (event) => {
    const { checked, value } = event.target;
    const values = JSON.parse(value);
    if (checked) {
      setSelected(value.id);
      setCheckRows((state) => [...state, values]);
      let items = [];
      if ((fieldName === 'allowed_sites_ids' || fieldName === 'allowed_domains_host_ids' || fieldName === 'visitor_types' || fieldName === 'visitor_allowed_asset_ids')) {
        items = [{ id: values.id, name: values.name, fieldName }];
      }
      console.log(olCheckedRows);
      const arr = [...items, ...olCheckedRows];
      console.log(arr);
      setCheckedRows(arr);
    } else {
      setCheckedRows(olCheckedRows.filter((item) => item.id !== values.id));
      setCheckRows(checkedRows.filter((item) => item.id !== values.id));
    }
  };

  const onSearchChange = (e) => {
    setSearchValue(e.target.value);
  };

  function getRow(arrayData) {
    const tableTr = [];
    for (let i = 0; i < arrayData.length; i += 1) {
      tableTr.push(
        <tr className={selectedId === arrayData[i].id ? 'text-info cursor-pointer' : 'cursor-pointer'} key={i}>
          <td className="w-5">
            {(fieldName === 'allowed_sites_ids') && (
            <Checkbox
              sx={{
                transform: 'scale(0.9)',
                padding: '0px',
              }}
              value={JSON.stringify(arrayData[i])}
              id={`checkboxtk${arrayData[i].id}`}
              className="ml-0"
              name={fieldName === arrayData[i].name}
              checked={checkedRows.some((selectedValue) => parseInt(selectedValue.id) === parseInt(arrayData[i].id))}
              onChange={handleTableCellChange}
            />
            )}
            {(fieldName === 'allowed_domains_host_ids' || fieldName === 'visitor_types' || fieldName === 'visitor_allowed_asset_ids') && (
            <Checkbox
              sx={{
                transform: 'scale(0.9)',
                padding: '0px',
              }}
              value={JSON.stringify(arrayData[i])}
              id={`checkboxatk${arrayData[i].id}`}
              className="ml-0"
              name={fieldName === arrayData[i].name}
              checked={checkedRows.some((selectedValue) => parseInt(selectedValue.id) === parseInt(arrayData[i].id))}
              onChange={handleTableCellChange}
            />
            )}
          </td>
          {(fieldName === 'allowed_sites_ids' || fieldName === 'allowed_domains_host_ids' || fieldName === 'visitor_types' || fieldName === 'visitor_allowed_asset_ids') && (
            <td><span className="font-weight-400">{getDefaultNoValue(arrayData[i].name)}</span></td>
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
                    {(!listDataMultipleInfo.loaading && (listDataMultipleInfo && listDataMultipleInfo.data) && (totalDataCount))}
                  </span>
                </div>
              </Col>
              <Col sm="12" md="3" lg="3" xs="12" className="pl-0">
                <div className="float-right">
                  <FormGroup>
                    <Input type="input" name="search" id="exampleSearch" placeholder="Search" onChange={onSearchChange} className="subjectticket bw-2 mt-2" />
                  </FormGroup>
                </div>
              </Col>
            </Row>
            <div className="pl-1 pr-1 pt-0 comments-list thin-scrollbar">
              {(listDataMultipleInfo && listDataMultipleInfo.data) && (
                <Table responsive>
                  <thead className="bg-gray-light">
                    <tr>
                      <th className="w-5">
                        <span className="ml-2 invisible">#</span>
                      </th>
                      {(fieldName === 'allowed_sites_ids') && (
                        <th className="p-2 min-width-100">
                          Name
                        </th>
                      )}
                      {fieldName === 'allowed_domains_host_ids' && (
                        <th className="p-2 min-width-100">
                          Name
                        </th>
                      )}
                      {fieldName === 'visitor_types' && (
                        <th className="p-2 min-width-100">
                          Name
                        </th>
                      )}
                      {fieldName === 'visitor_allowed_asset_ids' && (
                        <th className="p-2 min-width-100">
                          Name
                        </th>
                      )}
                      {fieldName === 'location_ids' && (
                        <th className="p-2 min-width-100">
                          Name
                        </th>
                      )}
                      {fieldName === 'space_category_id' && (
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
            {/* <Modal isOpen={modalAlert} toggle={toggleAlert} size="sm">
              <ModalHeaderComponent size="sm" title="Alert" closeModalWindow={toggleAlert} />
              <hr className="m-0" />
              <ModalBody>
                Maximum allowed
                {' '}
                {fieldName === 'allowed_sites_ids' ? 'spaces' : 'equipments'}
                {' '}
                : 10
              </ModalBody>
              <ModalFooter>
                <Button color="primary" onClick={() => { setModalAlert(false); }}>Ok</Button>
              </ModalFooter>
            </Modal> */}
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
  olCheckedRows: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.object,
    PropTypes.string,
  ]).isRequired,
  oldSpaceIdData: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.object,
    PropTypes.string,
  ]).isRequired,
  oldAccessData: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.object,
    PropTypes.string,
  ]).isRequired,
  oldVisitorData: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.object,
    PropTypes.string,
  ]).isRequired,
  setCheckedRows: PropTypes.oneOfType([PropTypes.func, PropTypes.array, PropTypes.string]).isRequired,
};

export default SearchModalMutliple;
