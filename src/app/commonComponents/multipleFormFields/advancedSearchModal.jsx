/* eslint-disable radix */
/* eslint-disable import/no-unresolved */
/* eslint-disable camelcase */
/* eslint-disable react/jsx-props-no-spreading */
import {
  Input,
} from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import InputAdornment from '@material-ui/core/InputAdornment';
import { makeStyles } from '@material-ui/core/styles';
import BackspaceIcon from '@material-ui/icons/Backspace';
import SearchIcon from '@material-ui/icons/Search';
import Pagination from '@material-ui/lab/Pagination';
import * as PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Card,
  CardBody,
  Col,
  Row,
  Table,
} from 'reactstrap';

import Loader from '@shared/loading';
import SuccessAndErrorFormat from '@shared/successAndErrorFormat';

import {
  getExtraSelectionMultiple, getExtraSelectionMultipleCount,
} from '../../helpdesk/ticketService';
import { getDefaultNoValue, getListOfModuleOperations, getPagesCountV2 } from '../../util/appUtils';

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
    fields,
    company,
    fieldName,
    placeholderName,
    afterReset,
    paramsEdit,
    optionDisplayName,
  } = props;
  const limit = 50;
  const dispatch = useDispatch();
  const classes = useStyles();
  const [searchValue, setSearchValue] = useState('');
  const [offset, setOffset] = useState(0);
  const [page, setPage] = useState(1);
  const [isSearch, setSearch] = useState(false);
  const [selectedId, setSelected] = useState('');
  const [fullWidth, setFullWidth] = useState(true);
  const [maxWidth, setMaxWidth] = useState('lg');
  const [addModal, setAddModal] = useState(false);
  const [modalHead, setModalHead] = useState('');

  const {
    listDataMultipleInfo, listDataMultipleCountInfo, listDataMultipleCountLoading,
  } = useSelector((state) => state.ticket);

  const { userRoles } = useSelector((state) => state.user);

  const allowedOperations = getListOfModuleOperations(userRoles && userRoles.data ? userRoles.data.allowed_modules : [], 'Admin Setup', 'code');

  useEffect(() => {
    if (modelName && fields) {
      if (fieldName !== 'parent_id') {
        let searchValueMultiple = '[';

        if (fieldName !== 'category_id' && fieldName !== 'commodity_id') {
          searchValueMultiple = `${searchValueMultiple}["company_id","in",[${company}]]`;
        }

        if (searchValue) {
          if (fieldName !== 'category_id' && fieldName !== 'commodity_id') {
            searchValueMultiple = `${searchValueMultiple},["name","ilike","${searchValue}"]`;
          } else {
            searchValueMultiple = `${searchValueMultiple}["name","ilike","${searchValue}"]`;
          }
        }

        searchValueMultiple = `${searchValueMultiple}]`;
        dispatch(getExtraSelectionMultiple(company, modelName, limit, offset, fields, searchValueMultiple));
      }
      if (fieldName === 'parent_id') {
        const fieldsNew = '["id", "space_name",("asset_category_id",["id","name"]),("parent_id",["id","space_name"])]';
        let searchValueMultiple = `[["company_id","in",[${company}]],["asset_category_id", "in", ["Floor","Building"]]]`;
        if (searchValue) {
          searchValueMultiple = `[["company_id","in",[${company}]],["asset_category_id", "in", ["Floor","Building"]],["name","ilike","${searchValue}"]]`;
        }
        dispatch(getExtraSelectionMultiple(company, modelName, limit, offset, fieldsNew, searchValueMultiple, false, 'search'));
      }
    }
  }, [modelName, offset, isSearch]);

  useEffect(() => {
    if (modelName) {
      let searchValueMultiple = '[';

      if (fieldName !== 'parent_id') {
        searchValueMultiple = `${searchValueMultiple}["company_id","in",[${company}]]`;
      }

      if (fieldName === 'parent_id') {
        searchValueMultiple = `${searchValueMultiple}["company_id","in",[${company}]],["asset_category_id", "in", ["Floor","Building"]]`;
      }

      if (searchValue) {
        if (fieldName !== 'category_id' && fieldName !== 'commodity_id') {
          searchValueMultiple = `${searchValueMultiple},["name","ilike","${searchValue}"]`;
        } else {
          searchValueMultiple = `${searchValueMultiple}["name","ilike","${searchValue}"]`;
        }
      }

      searchValueMultiple = `${searchValueMultiple}]`;
      dispatch(getExtraSelectionMultipleCount(company, modelName, fields, searchValueMultiple));
    }
  }, [modelName, isSearch]);

  const totalDataCount = listDataMultipleCountInfo && listDataMultipleCountInfo.length ? listDataMultipleCountInfo.length : '';

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

  const handleRowClick = (data, event) => {
    setSelected(data.id);
    event.stopPropagation();
    paramsEdit.api.setEditCellValue({
      id: paramsEdit.id,
      field: paramsEdit.field,
      value: data,
    });
    if (afterReset) afterReset();
  };

  const onModalOpen = () => {
    setAddModal(true);
    let listName = 'Add Team';
    if (fieldName === 'space_id') {
      listName = 'Add Space';
    } else if (fieldName === 'pantry_id') {
      listName = 'Add Pantry';
    }

    setModalHead(listName);
  };

  function getRow(assetData) {
    const tableTr = [];
    for (let i = 0; i < assetData.length; i += 1) {
      tableTr.push(
        <tr className={selectedId === assetData[i].id ? 'text-info cursor-pointer' : 'cursor-pointer'} onClick={(event) => handleRowClick(assetData[i], event)} key={i}>
          {fieldName === 'parent_id'
            && (
            <td className="p-2">
              <span className="font-weight-400">
                {assetData[i].parent_id && assetData[i].parent_id.space_name ? (`${assetData[i].parent_id.space_name}/${assetData[i][optionDisplayName]}`) : assetData[i][optionDisplayName]}
              </span>
            </td>
            )}
          {fieldName !== 'parent_id'
            ? optionDisplayName
              ? <td className="p-2"><span className="font-weight-400">{getDefaultNoValue(assetData[i][optionDisplayName])}</span></td>
              : <td className="p-2"><span className="font-weight-400">{getDefaultNoValue(assetData[i].name)}</span></td>
            : ''}

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
                <div className="mt-3 display-flex ">
                  <span className="p-0 font-weight-600 font-medium mr-2">
                    Total :
                    {' '}
                    {!listDataMultipleCountLoading && totalDataCount}
                  </span>
                </div>
              </Col>
              <Col sm="12" md="5" lg="5" xs="12" className="text-right">
                <Input
                  id="standard-adornment-password"
                  type="text"
                  name="search"
                  placeholder={placeholderName}
                  value={searchValue}
                  onChange={onSearchChange}
                  onKeyDown={onSearchChange}
                  endAdornment={(
                    <InputAdornment position="end">
                      {searchValue && (
                        <>
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={() => {
                              setSearchValue('');
                              setSearch(Math.random());
                              setPage(1);
                              setOffset(0);
                            }}
                          >
                            <BackspaceIcon fontSize="small" />
                          </IconButton>
                          <IconButton
                            aria-label="toggle search visibility"
                            onClick={() => {
                              setSearch(Math.random());
                              setPage(1);
                              setOffset(0);
                            }}
                          >
                            <SearchIcon fontSize="small" />
                          </IconButton>
                        </>
                      )}
                    </InputAdornment>
                  )}
                />
              </Col>
            </Row>
            <Table responsive className="mb-0">
              <thead className="bg-gray-light">
                <tr>
                  <th className="p-2 min-width-160">
                    Name
                  </th>
                </tr>
              </thead>
            </Table>
            <div className="pl-1 pr-1 pt-0 comments-list thin-scrollbar">
              {(!listDataMultipleCountLoading && listDataMultipleInfo && listDataMultipleInfo.data) && (
                <Table responsive>
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
            {(listDataMultipleInfo && listDataMultipleInfo.loading) || (listDataMultipleCountLoading) && (
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

AdvancedSearchModal.defaultProps = {
  optionDisplayName: false,
};

AdvancedSearchModal.propTypes = {
  modelName: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.string,
  ]).isRequired,
  fields: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.bool,
    PropTypes.string,
  ]).isRequired,
  paramsEdit: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.object,
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
  optionDisplayName: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.string,
  ]),
  afterReset: PropTypes.func.isRequired,
  placeholderName: PropTypes.string.isRequired,
  setFieldValue: PropTypes.func.isRequired,
};

export default AdvancedSearchModal;
