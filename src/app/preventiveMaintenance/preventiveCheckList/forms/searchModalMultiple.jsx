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
  Label,
  Modal, ModalBody, ModalFooter, Button,
} from 'reactstrap';
import * as PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import ModalHeaderComponent from '@shared/modalHeaderComponent';
import { makeStyles } from '@material-ui/core/styles';
import Pagination from '@material-ui/lab/Pagination';

import SuccessAndErrorFormat from '@shared/successAndErrorFormat';
import Loader from '@shared/loading';
import {
  getExtraSelectionMultiple, getExtraSelectionMultipleCount,
} from '../../../helpdesk/ticketService';
import { getDefaultNoValue, getPagesCountV2 } from '../../../util/appUtils';

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
    oldOptionData,
    olCheckedRows,
    setCheckedRows,
  } = props;
  const limit = 50;
  const dispatch = useDispatch();
  const classes = useStyles();
  const [selectedId, setSelected] = useState('');
  const [searchValue, setSearchValue] = useState('');
  const [offset, setOffset] = useState(0);
  const [page, setPage] = useState(1);
  const [checkedRows, setCheckRows] = useState(olCheckedRows);
  const [modalAlert, setModalAlert] = useState(false);

  const {
    listDataMultipleInfo, listDataMultipleCountInfo, listDataMultipleCountLoading,
  } = useSelector((state) => state.ticket);

  useEffect(() => {
    
    if (fieldName === 'based_on_ids') {
      setCheckRows(oldOptionData);
    }
  }, []);
console.log(checkedRows);
  useEffect(() => {
    if (modelName && fields) {
      if (fieldName === 'based_on_ids') {
        const searchValueMultiple = `["&",["company_id","in",[${company}]],["display_name", "ilike", "${searchValue}"]]`;
        dispatch(getExtraSelectionMultiple(company, modelName, limit, offset, fields, searchValueMultiple));
      }
    }
  }, [modelName, offset, searchValue]);

  useEffect(() => {
    if (modelName && fields) {
      if (fieldName === 'based_on_ids') {
        const searchValueMultiple = `["&",["company_id","in",[${company}]],["display_name", "ilike", "${searchValue}"]]`;
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

  const toggleAlert = () => {
    setModalAlert(false);
  };

  const handleTableCellChange = (event) => {
    const { checked, value } = event.target;
    const values = JSON.parse(value);
    if (checked) {
      setSelected(value.id);
      setCheckRows((state) => [...state, values]);
      let items = [];
      if ((fieldName === 'based_on_ids')) {
        items = [{ id: values.id, display_name: values.display_name, fieldName }];
      }
      if ((fieldName === 'problem_category_ids')) {
        items = [{
          id: values.id, name: values.name, cat_display_name: values.cat_display_name, company_id: values.company_id, fieldName,
        }];
      }
      const arr = [...items, ...olCheckedRows];
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
            {(fieldName === 'based_on_ids') && (
              <div className="checkbox">
                <Input
                  type="checkbox"
                  value={JSON.stringify(arrayData[i])}
                  id={`checkboxtk${arrayData[i].id}`}
                  className="ml-0"
                  name={fieldName === arrayData[i].display_name}
                  checked={checkedRows.some((selectedValue) => parseInt(selectedValue.id) === parseInt(arrayData[i].id))}
                  onChange={handleTableCellChange}
                />
                <Label htmlFor={`checkboxtk${arrayData[i].id}`} />
              </div>
            )}
          </td>
          {(fieldName === 'based_on_ids') && (
            <td><span className="font-weight-400">{getDefaultNoValue(arrayData[i].display_name)}</span></td>
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
                      <th className="p-2 min-width-100">
                        Name
                      </th>
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
            <Modal isOpen={modalAlert} toggle={toggleAlert} size="sm">
              <ModalHeaderComponent size="sm" title="Alert" closeModalWindow={toggleAlert} />
              <hr className="m-0" />
              <ModalBody>
                Maximum allowed
                {' '}
                {fieldName === 'recipients_ids' ? 'spaces' : 'equipments'}
                {' '}
                : 10
              </ModalBody>
              <ModalFooter>
                <Button color="primary" onClick={() => { setModalAlert(false); }}>Ok</Button>
              </ModalFooter>
            </Modal>
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
  oldOptionData: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.object,
    PropTypes.string,
  ]).isRequired,
  oldSpaceData: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.object,
    PropTypes.string,
  ]).isRequired,
  oldCatData: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.object,
    PropTypes.string,
  ]).isRequired,
  oldEqipmentData: PropTypes.oneOfType([
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
  oldProblemData: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.object,
    PropTypes.string,
  ]).isRequired,
  setCheckedRows: PropTypes.oneOfType([PropTypes.func, PropTypes.array, PropTypes.string]).isRequired,
};

export default SearchModalMutliple;
