/* eslint-disable radix */
/* eslint-disable import/no-unresolved */
/* eslint-disable camelcase */
/* eslint-disable react/jsx-props-no-spreading */
import React, { useState, useEffect } from 'react';
import {
  Table,
  Col,
  Row,
  Label,
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
  getExtraSelection, getExtraSelectionCount, getSuggestedCheckedRows,
} from '../../workorderService';

import { getDefaultNoValue, getPagesCountV2 } from '../../../util/appUtils';

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
    fields,
    oldData,
    modalName,
    selectedQuestionId,
  } = props;
  const limit = 10;
  const dispatch = useDispatch();
  const classes = useStyles();
  const [searchValue, setSearchValue] = useState('');
  const [offset, setOffset] = useState(0);
  const [page, setPage] = useState(1);
  const [checkedRows, setCheckRows] = useState(oldData);
  const [isAllChecked, setIsAllChecked] = useState(false);

  const {
    listDataInfo, listDataCountInfo, listDataCountLoading,
  } = useSelector((state) => state.workorder);

  useEffect(() => {
    if (modelName && fields) {
      dispatch(getExtraSelection(modelName, limit, offset, fields, searchValue));
    }
  }, [modelName, offset, searchValue]);

  useEffect(() => {
    if (modelName) {
      dispatch(getExtraSelectionCount(modelName, searchValue));
    }
  }, [modelName, searchValue]);

  const totalDataCount = listDataCountInfo && listDataCountInfo.length ? listDataCountInfo.length : 0;

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

  const handleTableCellChange = (event) => {
    const { checked, value } = event.target;
    const values = JSON.parse(value);
    values.questionId = selectedQuestionId;
    if (checked) {
      setCheckRows((state) => [...state, values]);
      dispatch(getSuggestedCheckedRows([...checkedRows, values]));
    } else {
      setCheckRows(checkedRows.filter((item) => item.id !== values.id));
      dispatch(getSuggestedCheckedRows(checkedRows.filter((item) => item.id !== values.id)));
    }
  };

  const handleTableCellAllChange = (event) => {
    const { checked } = event.target;
    if (checked) {
      const data = listDataInfo && listDataInfo.data ? listDataInfo.data : [];
      setCheckRows(data);
      setIsAllChecked(true);
    } else {
      setCheckRows([]);
      setIsAllChecked(false);
    }
  };

  function getRow(assetData) {
    const tableTr = [];
    for (let i = 0; i < assetData.length; i += 1) {
      tableTr.push(
        <tr key={i}>
          <td className="w-5">
            <div className="checkbox">
              <Input
                type="checkbox"
                value={JSON.stringify(assetData[i])}
                id={`checkboxtk${assetData[i].id}`}
                className="ml-0"
                name={assetData[i].name}
                checked={checkedRows.some((selectedValue) => ((selectedValue.questionId === selectedQuestionId) && (parseInt(selectedValue.id) === parseInt(assetData[i].id))))}
                onChange={handleTableCellChange}
              />
              <Label htmlFor={`checkboxtk${assetData[i].id}`} />
            </div>
          </td>
          <td className="p-2"><span className="font-weight-400">{getDefaultNoValue(assetData[i].value)}</span></td>
        </tr>,
      );
    }
    return tableTr;
  }

  const loading = (listDataInfo && listDataInfo.loading) || (listDataCountLoading);

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
                    <Input type="input" name="search" id="exampleSearch" placeholder={`Search ${modalName}`} onChange={onSearchChange} className="subjectticket bw-2 mt-2" />
                  </FormGroup>
                </div>
              </Col>
            </Row>

            <div className="pl-1 pr-1 pt-0 comments-list thin-scrollbar">
              {(listDataInfo && listDataInfo.data) && (
              <Table responsive>
                <thead className="bg-gray-light">
                  <tr>
                    <th className="w-5">
                      <div className="checkbox">
                        <Input
                          type="checkbox"
                          value="all"
                          className="m-0 position-relative"
                          name="checkall"
                          id="checkboxtkhead"
                          checked={isAllChecked}
                          onChange={handleTableCellAllChange}
                        />
                        <Label htmlFor="checkboxtkhead" />
                      </div>
                    </th>
                    <th className="p-2 min-width-100">
                      Suggested Value
                    </th>
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

SearchModal.propTypes = {
  modelName: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.string,
  ]).isRequired,
  oldData: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.array,
  ]).isRequired,
  modalName: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.string,
  ]).isRequired,
  selectedQuestionId: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.string,
  ]).isRequired,
  fields: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.object,
  ]).isRequired,
};

export default SearchModal;
