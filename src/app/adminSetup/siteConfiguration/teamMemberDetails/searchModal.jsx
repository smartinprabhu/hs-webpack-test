/* eslint-disable radix */
/* eslint-disable import/no-unresolved */
/* eslint-disable camelcase */
/* eslint-disable react/jsx-props-no-spreading */
import React, { useState, useEffect } from 'react';
import {
  Checkbox,
} from '@mui/material';
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
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faSearch, faTimesCircle,
} from '@fortawesome/free-solid-svg-icons';

import SuccessAndErrorFormat from '@shared/successAndErrorFormat';
import Loader from '@shared/loading';

import {
  storeSelectedMembers, getAllCompanyTeams,
} from '../../setupService';
import { getDefaultNoValue, getPagesCountV2, extractTextObject } from '../../../util/appUtils';

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
    detailData,
    otherFieldName,
    otherFieldValue,
    modalName,
  } = props;
  const limit = 50;
  const dispatch = useDispatch();
  const classes = useStyles();
  const [searchValue, setSearchValue] = useState('');
  const [offset, setOffset] = useState(0);
  const [page, setPage] = useState(1);
  const [checkedRows, setCheckRows] = useState([]);
  const [isAllChecked, setIsAllChecked] = useState(false);
  const [pageData, setPageData] = useState([]);
  const [totalData, setTotalData] = useState([]);

  const { allCompanyTeams, userTeams } = useSelector((state) => state.setup);
  const { userInfo } = useSelector((state) => state.user);
  const selectedCompany = userInfo && userInfo.data && userInfo.data.company && userInfo.data.company.id ? userInfo.data.company.id : '';

  useEffect(() => {
    if (modelName && fields) {
      dispatch(getAllCompanyTeams(detailData.company_ids || selectedCompany));
    }
  }, [modelName]);

  const totalDataCount = totalData && totalData.length ? totalData.length : 0;

  const pages = getPagesCountV2(totalDataCount, limit);

  const handlePageClick = (e, index) => {
    e.preventDefault();
    const offsetValue = (index - 1) * limit;
    setPage(index);
    setOffset(offsetValue);
    setIsAllChecked(false);
    setPageData(totalData.slice(offsetValue, (offsetValue + limit)));
  };

  const onSearchChange = (e) => {
    setSearchValue(e.target.value);
    if (e.key === 'Enter') {
      if (totalData && totalData.length && e.target.value) {
        const filteredData = totalData.filter((data) => data.name.toLowerCase().includes(e.target.value.toLowerCase()) || data.company_id.name.toLowerCase().includes(e.target.value.toLowerCase()));
        setTotalData(filteredData);
        setPageData(filteredData.slice(0, limit));
      } else {
        setTotalData(allCompanyTeams && allCompanyTeams.data && allCompanyTeams.data.length ? allCompanyTeams.data : []);
        setPageData(allCompanyTeams && allCompanyTeams.data && allCompanyTeams.data.length ? allCompanyTeams.data.slice(0, limit) : []);
      }
      setPage(1);
      setOffset(0);
    }
  };

  useEffect(() => {
    if (checkedRows) {
      dispatch(storeSelectedMembers(checkedRows));
    }
  }, [checkedRows]);

  const handleTableCellChange = (event) => {
    const { checked, value } = event.target;
    const values = JSON.parse(value);
    if (checked) {
      setCheckRows((state) => [...state, values]);
      if ((checkedRows && checkedRows.length + 1 === 50) || (checkedRows && checkedRows.length + 1 === totalDataCount)) {
        setIsAllChecked(true);
      }
    } else {
      setCheckRows(checkedRows.filter((item) => item.id !== values.id));
      setIsAllChecked(false);
    }
  };

  const handleTableCellAllChange = (event) => {
    const { checked } = event.target;
    if (checked) {
      const data1 = allCompanyTeams && allCompanyTeams.data ? allCompanyTeams.data : [];
      const data = searchValue && searchValue.length ? totalData : data1;
      const newArr = [...data, ...checkedRows];
      const finalArray = [];
      newArr && newArr.length && newArr.filter((value) => {
        if (!userTeams.data.find((data) => data.id === value.id)) {
          finalArray.push(value);
        }
      });
      setCheckRows([...new Map(finalArray.map((item) => [item.id, item])).values()]);
      setIsAllChecked(true);
    } else {
      setCheckRows([]);
      setIsAllChecked(false);
    }
  };

  useEffect(() => {
    if (allCompanyTeams && allCompanyTeams.data) {
      setPageData(allCompanyTeams.data.slice(0, limit));
      setTotalData(allCompanyTeams.data);
    }
  }, [allCompanyTeams]);

  function getRow(assetData) {
    const tableTr = [];
    for (let i = 0; i < assetData.length; i += 1) {
      tableTr.push(
        <tr key={i}>
          <td className="w-5">
            <Checkbox
              sx={{
                transform: 'scale(0.9)',
                padding: '0px',
              }}
              value={JSON.stringify(assetData[i])}
              id={`checkboxtk${assetData[i].id}`}
              className="ml-0"
              name={assetData[i].name}
              disabled={!!(userTeams && userTeams.data && userTeams.data.length && userTeams.data.find((data) => data.id === assetData[i].id))}
              checked={checkedRows && checkedRows.length && checkedRows.some((selectedValue) => parseInt(selectedValue.id) === parseInt(assetData[i].id))}
              onChange={handleTableCellChange}
            />
          </td>
          <td className="p-2"><span className={userTeams && userTeams.data && userTeams.data.length && userTeams.data.find((data) => data.id === assetData[i].id) ? 'font-weight-400' : ''}>{getDefaultNoValue(assetData[i].name)}</span></td>
          {/* <td className="p-2"><span className="font-weight-400">{getDefaultNoValue(assetData[i].team_type)}</span></td>
          <td className="p-2"><span className="font-weight-400">{getDefaultNoValue(extractTextObject(assetData[i].team_category_id))}</span></td> */}
          <td className="p-2"><span className={userTeams && userTeams.data && userTeams.data.length && userTeams.data.find((data) => data.id === assetData[i].id) ? 'font-weight-400' : ''}>{getDefaultNoValue(extractTextObject(assetData[i].company_id))}</span></td>
        </tr>,
      );
    }
    return tableTr;
  }

  const loading = (allCompanyTeams && allCompanyTeams.loading);

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
                    <Input
                      type="input"
                      name="search"
                      value={searchValue}
                      id="exampleSearch"
                      placeholder={`Search ${modalName}`}
                      onKeyDown={onSearchChange}
                      onChange={onSearchChange}
                      className="subjectticket bw-2 mt-2"
                    />
                    {searchValue && searchValue.length
                      ? (
                        <>
                          <FontAwesomeIcon
                            className="float-right mr-32px cursor-pointer mt-n12per"
                            size="sm"
                            type="reset"
                            onClick={() => {
                              setSearchValue('');
                              setPage(1);
                              setOffset(0);
                              setTotalData(allCompanyTeams && allCompanyTeams.data && allCompanyTeams.data.length ? allCompanyTeams.data : []);
                              setPageData(allCompanyTeams && allCompanyTeams.data && allCompanyTeams.data.length ? allCompanyTeams.data.slice(0, limit) : []);
                            }}
                            icon={faTimesCircle}
                          />
                          <FontAwesomeIcon
                            className="float-right mr-2 cursor-pointer mt-n12per"
                            size="sm"
                            icon={faSearch}
                          />
                        </>
                      ) : ''}
                  </FormGroup>
                </div>
              </Col>
            </Row>
            <div className="pl-1 pr-1 pt-0 comments-list thin-scrollbar">
              {(allCompanyTeams && allCompanyTeams.data) && (
                <Table responsive>
                  <thead className="bg-gray-light">
                    <tr>
                      <th className="w-5">
                        <Checkbox
                          sx={{
                            transform: 'scale(0.9)',
                            padding: '0px',
                          }}
                          value="all"
                          name="checkall"
                          id="checkboxtkhead1"
                          checked={isAllChecked}
                          onChange={handleTableCellAllChange}
                        />
                      </th>
                      <th className="p-2 min-width-100">
                        Name
                      </th>
                      {/* <th className="p-2 min-width-100">
                        Type
                      </th>
                      <th className="p-2 min-width-100">
                        Category
                      </th> */}
                      <th className="p-2 min-width-100">
                        Company
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {getRow(pageData)}
                  </tbody>
                </Table>
              )}
            </div>
            {loading || pages === 0 ? (<span />) : (
              <div className={`${classes.root} float-right`}>
                <Pagination count={pages} page={page} size="small" color="primary" onChange={handlePageClick} showFirstButton showLastButton />
              </div>
            )}
            {allCompanyTeams && allCompanyTeams.loading && (
              <Loader />
            )}
            {(allCompanyTeams && allCompanyTeams.err) && (
              <SuccessAndErrorFormat response={allCompanyTeams} />
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
    PropTypes.array,
    PropTypes.number,
  ]).isRequired,
};

export default SearchModal;
