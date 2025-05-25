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
import {
  Input,
} from '@material-ui/core';
import * as PropTypes from 'prop-types';
import { Tooltip } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import Pagination from '@material-ui/lab/Pagination';
import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from '@material-ui/core/IconButton';
import BackspaceIcon from '@material-ui/icons/Backspace';
import SearchIcon from '@material-ui/icons/Search';
import plusCircleMiniIcon from '@images/icons/plusCircleBlue.svg';
import {
  Box,
  Dialog, DialogContent, DialogContentText,
} from '@mui/material';

import SuccessAndErrorFormat from '@shared/successAndErrorFormat';
import Loader from '@shared/loading';

import {
  getExtraSelectionMultiple, getExtraSelectionMultipleCount,
} from '../ticketService';
import {
  getDefaultNoValue, getPagesCountV2, getListOfModuleOperations, getListOfOperations, extractTextObject,
} from '../../util/appUtils';
import { resetCreateTeam } from '../../adminSetup/setupService';
import { resetAddAssetInfo } from '../../assets/equipmentService';
import AddTeam from '../../adminSetup/siteConfiguration/addTeam';
import actionCodes from '../../adminSetup/data/actionCodes.json';
import actionCodes1 from '../../assets/data/assetActionCodes.json';
import DialogHeader from '../../commonComponents/dialogHeader';
import CreateAsset from '../../assets/forms/createAsset';

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
    setFieldValue,
    isIncident,
    categoryInfo,
  } = props;
  const limit = 50;
  const dispatch = useDispatch();
  const classes = useStyles();
  const [selectedId, setSelected] = useState('');
  const [isSearch, setSearch] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [offset, setOffset] = useState(0);
  const [page, setPage] = useState(1);
  const [addModal, setAddModal] = useState(false);
  const [modalHead, setModalHead] = useState('');
  const [getRowData, setRowData] = useState([]);
  const [searchCategoryData, setSearchCategoryData] = useState([]);
  const [totalDataCount, setTotalDataCount] = useState(0);
  const [categorySearchvalue, setCategorySearchvalue] = useState([]);

  const {
    listDataMultipleInfo, listDataMultipleCountInfo, listDataMultipleCountLoading,
    maintenanceConfigurationData,
  } = useSelector((state) => state.ticket);

  const {
    createTeamInfo,
  } = useSelector((state) => state.setup);

  const { userRoles } = useSelector((state) => state.user);

  const {
    addAssetInfo,
  } = useSelector((state) => state.equipment);

  const isMobNotShow = maintenanceConfigurationData && !maintenanceConfigurationData.loading && maintenanceConfigurationData.data
    && maintenanceConfigurationData.data.length > 0 && maintenanceConfigurationData.data[0].requestor_mobile_visibility === 'Confidential';

  const allowedOperations = getListOfModuleOperations(userRoles && userRoles.data ? userRoles.data.allowed_modules : [], 'Admin Setup', 'code');

  const allowedOperations1 = getListOfOperations(userRoles && userRoles.data ? userRoles.data.allowed_modules : [], 'code');

  useEffect(() => {
    if (modelName && fields) {
      let searchValueMultiple = `[["company_id","in",[${company}]]`;
      if (fieldName === 'incident_type_id' || fieldName === 'incident_severity_id') {
        searchValueMultiple = '[';
      }
      // if (fieldName === 'category_id' || fieldName === 'sub_category_id') {
      //   searchValueMultiple = '[["name","!=",false]';
      // }
      if (typeof otherFieldValue === 'string' && otherFieldValue !== 'true') {
        searchValueMultiple = `${searchValueMultiple},["${otherFieldName}","ilike","${otherFieldValue}"]`;
      } else if (typeof otherFieldValue === 'object' && otherFieldValue !== 'true' && otherFieldName !== 'not_in') {
        searchValueMultiple = `${searchValueMultiple},["${otherFieldName}","in",${JSON.stringify(otherFieldValue)}]`;
      } else if (typeof otherFieldValue === 'object' && otherFieldName === 'not_in') {
        searchValueMultiple = `${searchValueMultiple},["id","not in",${JSON.stringify(otherFieldValue)}]`;
      } else if (otherFieldName && otherFieldValue) {
        searchValueMultiple = `${searchValueMultiple},["${otherFieldName}","=",${otherFieldValue}]`;
      }

      if (fieldName === 'requestee_id') {
        searchValueMultiple = `[["company_id","in",[${company}]],"|",["customer","=",true],["supplier","!=",true]`;
      }

      if (fieldName === 'parent_id') {
        if (isIncident) {
          searchValueMultiple = `${searchValueMultiple},["issue_type","=","incident"],["unattended_ppm", "!=", true],["maintenance_type","=","bm"]`;
        } else {
          searchValueMultiple = `${searchValueMultiple},["issue_type","!=","incident"],["unattended_ppm", "!=", true],["maintenance_type","=","bm"],["help_problem_id","!=","incident"]`;
        }
      }

      if (searchValue) {
        if (fieldName === 'requestee_id') {
          searchValueMultiple = `${searchValueMultiple},"|","|",["name","ilike","${searchValue}"],["email", "ilike", "${searchValue}"],["mobile", "ilike", "${searchValue}"]`;
        } else if (fieldName === 'parent_id') {
          searchValueMultiple = `${searchValueMultiple},"|",["ticket_number","ilike","${searchValue}"],["subject", "ilike", "${searchValue}"]`;
        } else if (fieldName === 'category_id') {
          searchValueMultiple = `${searchValueMultiple},["category_id","ilike","${searchValue}"]`;
        } else if (fieldName === 'equipment_id') {
          searchValueMultiple = `${searchValueMultiple},"|","|","|","|","|",["brand","ilike","${searchValue}"],["serial","ilike","${searchValue}"],["name","ilike","${searchValue}"],["location_id.path_name","ilike","${searchValue}"],["category_id","ilike","${searchValue}"],["equipment_seq","ilike","${searchValue}"]`;
        } else if (fieldName === 'incident_type_id' || fieldName === 'incident_severity_id') {
          searchValueMultiple = `${searchValueMultiple}["name","ilike","${searchValue}"]`;
        } else {
          searchValueMultiple = `${searchValueMultiple},["name","ilike","${searchValue}"]`;
        }
      }
      searchValueMultiple = `${searchValueMultiple}]`;
      dispatch(getExtraSelectionMultiple(company, modelName, limit, offset, fields, searchValueMultiple, fieldName === 'equipment_id' ? 'create_date DESC' : null));
    }
  }, [modelName, offset, isSearch, fieldName]);

  useEffect(() => {
    if (modelName) {
      let searchValueMultiple = `[["company_id","in",[${company}]]`;
      if (fieldName === 'incident_type_id' || fieldName === 'incident_severity_id') {
        searchValueMultiple = '[';
      }
      if (typeof otherFieldValue === 'string' && otherFieldValue !== 'true') {
        searchValueMultiple = `${searchValueMultiple},["${otherFieldName}","ilike","${otherFieldValue}"]`;
      } else if (typeof otherFieldValue === 'object' && otherFieldValue !== 'true' && otherFieldName !== 'not_in') {
        searchValueMultiple = `${searchValueMultiple},["${otherFieldName}","in",${JSON.stringify(otherFieldValue)}]`;
      } else if (typeof otherFieldValue === 'object' && otherFieldName === 'not_in') {
        searchValueMultiple = `${searchValueMultiple},["id","not in",${JSON.stringify(otherFieldValue)}]`;
      } else if (otherFieldName && otherFieldValue) {
        searchValueMultiple = `${searchValueMultiple},["${otherFieldName}","=",${otherFieldValue}]`;
      }

      if (fieldName === 'requestee_id') {
        searchValueMultiple = `[["company_id","in",[${company}]],"|",["customer","=",true],["supplier","!=",true]`;
      }

      if (fieldName === 'parent_id') {
        if (isIncident) {
          searchValueMultiple = `${searchValueMultiple},["issue_type","=","incident"],["unattended_ppm", "!=", true],["maintenance_type","=","bm"]`;
        } else {
          searchValueMultiple = `${searchValueMultiple},["issue_type","!=","incident"],["unattended_ppm", "!=", true],["maintenance_type","=","bm"],["help_problem_id","!=","incident"]`;
        }
      }

      if (searchValue) {
        if (fieldName === 'requestee_id') {
          searchValueMultiple = `${searchValueMultiple},"|","|",["name","ilike","${searchValue}"],["email", "ilike", "${searchValue}"],["mobile", "ilike", "${searchValue}"]`;
        } else if (fieldName === 'parent_id') {
          searchValueMultiple = `${searchValueMultiple},"|",["ticket_number","ilike","${searchValue}"],["subject", "ilike", "${searchValue}"]`;
        } else if (fieldName === 'equipment_id') {
          searchValueMultiple = `${searchValueMultiple},"|","|","|","|","|",["brand","ilike","${searchValue}"],["serial","ilike","${searchValue}"],["name","ilike","${searchValue}"],["location_id.path_name","ilike","${searchValue}"],["category_id","ilike","${searchValue}"],["equipment_seq","ilike","${searchValue}"]`;
        } else if (fieldName === 'category_id') {
          searchValueMultiple = `${searchValueMultiple},["category_id","ilike","${searchValue}"]`;
        } else if (fieldName === 'incident_type_id' || fieldName === 'incident_severity_id') {
          searchValueMultiple = `${searchValueMultiple}["name","ilike","${searchValue}"]`;
        } else {
          searchValueMultiple = `${searchValueMultiple},["name","ilike","${searchValue}"]`;
        }
      }
      searchValueMultiple = `${searchValueMultiple}]`;
      dispatch(getExtraSelectionMultipleCount(company, modelName, fields, searchValueMultiple));
    }
  }, [modelName, isSearch, fieldName]);

  const onSearchChange = (e) => {
    const sVal = e.target.value ? e.target.value.trim() : '';
    setSearchValue(sVal);
    if (e.key === 'Enter') {
      setCategorySearchvalue(sVal);
      setSearch(Math.random());
      setPage(1);
      setOffset(0);
    }
  };
  const handleRowClick = (data) => {
    setSelected(data.id);
    const items = { id: data.id, name: data.name };
    setFieldValue(fieldName, items);
    if (fieldName === 'requestee_id') {
      setFieldValue('email', data.email);
      setFieldValue('mobile', data.mobile);
    }
    if (fieldName === 'parent_id') {
      const parentItems = { id: data.id, subject: data.subject, ticket_number: data.ticket_number };
      setFieldValue(fieldName, parentItems);
    }
    if (fieldName === 'equipment_id') {
      const equipItems = {
        id: data.id, serial: data.serial, name: data.name, category_id: data.category_id,
      };
      setFieldValue(fieldName, equipItems);
    }
    if (fieldName === 'category_id') {
      const equipItems = { id: data.id, name: data.name };
      setFieldValue(fieldName, equipItems);
    }
    if (fieldName === 'maintenance_team_id') {
      setFieldValue(items);
    }
    if (afterReset) afterReset();
  };

  const onModalOpen = () => {
    setAddModal(true);
    let listName = 'Add Team';
    if (fieldName === 'equipment_id') {
      listName = 'Add Asset';
    }
    setModalHead(listName);
  };

  const onModalClose = () => {
    setAddModal(false);
    setSearch(Math.random());
  };

  const onTeamClose = () => {
    dispatch(resetCreateTeam());
  };

  const onAssetClose = () => {
    dispatch(resetAddAssetInfo());
  };

  function getRow(assetData) {
    const tableTr = [];
    for (let i = 0; i < assetData.length; i += 1) {
      tableTr.push(
        <tr className={selectedId === assetData[i].id ? 'text-info cursor-pointer' : 'cursor-pointer'} onClick={() => handleRowClick(assetData[i])} key={i}>
          {((fieldName !== 'parent_id') && (fieldName !== 'category_id')) && (
            <td className="p-2 min-width-100"><span className="font-weight-400">{getDefaultNoValue(assetData[i].name)}</span></td>
          )}
          {fieldName === 'equipment_id' && (
            <>
              <td className="p-2 min-width-100"><span className="font-weight-400">{getDefaultNoValue(assetData[i].equipment_seq)}</span></td>
              <td className="p-2 min-width-100"><span className="font-weight-400">{getDefaultNoValue(assetData[i].brand)}</span></td>
              <td className="p-2 min-width-100"><span className="font-weight-400">{getDefaultNoValue(assetData[i].serial)}</span></td>
              <td className="p-2 min-width-100"><span className="font-weight-400">{getDefaultNoValue(extractTextObject(assetData[i].location_id))}</span></td>
              <td className="p-2 min-width-100"><span className="font-weight-400">{getDefaultNoValue(extractTextObject(assetData[i].category_id))}</span></td>
            </>
          )}
          {fieldName === 'category_id' && (
            <td className="p-2 min-width-100"><span className="font-weight-400">{getDefaultNoValue(assetData[i].cat_display_name ? assetData[i].cat_display_name : assetData[i].name)}</span></td>
          )}
          {fieldName === 'parent_id' && (
            <>
              <td className="p-2 min-width-100"><span className="font-weight-400">{getDefaultNoValue(assetData[i].ticket_number)}</span></td>
              <td className="p-2 min-width-100"><span className="font-weight-400">{getDefaultNoValue(assetData[i].subject)}</span></td>
            </>
          )}
          {fieldName === 'requestee_id' && (
            <td className="p-2 min-width-100"><span className="font-weight-400">{getDefaultNoValue(assetData[i].email)}</span></td>
          )}
          {fieldName === 'requestee_id' && (
            <td className="p-2 min-width-100"><span className={`font-weight-400 ${isMobNotShow && assetData[i].mobile ? 'hide-phone-number' : ''}`}>{getDefaultNoValue(assetData[i].mobile)}</span></td>
          )}
        </tr>,
      );
    }
    return tableTr;
  }

  const isAddTeam = allowedOperations.includes(actionCodes['Add Team']);
  const isEquipment = allowedOperations1.includes(actionCodes1['Add an Asset']);

  const isAll = !!(window.localStorage.getItem('isAllCompany') && window.localStorage.getItem('isAllCompany') === 'yes');

  const loading = (listDataMultipleInfo && listDataMultipleInfo.loading) || (listDataMultipleCountLoading);

  useEffect(() => {
    if (fieldName === 'category_id' && categorySearchvalue !== '' && categorySearchvalue.length) {
      const searchFilterData = [];
      categoryInfo && categoryInfo.data && categoryInfo.data.length && categoryInfo.data.map((key) => {
        if (key && key.name && key.name.toLowerCase() && key.name.toLowerCase().includes(categorySearchvalue.toLowerCase())) {
          searchFilterData.push(key);
        }
      });
      setSearchCategoryData(searchFilterData);
    }
  }, [searchValue]);

  useEffect(() => {
    if ((categorySearchvalue !== '' || categorySearchvalue !== []) && categorySearchvalue.length && fieldName === 'category_id') {
      setRowData(searchCategoryData);
      setTotalDataCount(searchCategoryData.length);
    } else if (categoryInfo && categoryInfo.data) {
      setRowData(categoryInfo && categoryInfo.data);
      setTotalDataCount(categoryInfo.data.length);
    } else if (listDataMultipleCountInfo && listDataMultipleCountInfo.data && listDataMultipleInfo && listDataMultipleInfo.data) {
      setRowData(listDataMultipleInfo && listDataMultipleInfo.data);
      setTotalDataCount(listDataMultipleCountInfo.data.length);
    } else {
      setRowData([]);
      setTotalDataCount(0);
    }
  }, [categorySearchvalue, categoryInfo, listDataMultipleInfo, listDataMultipleCountInfo, searchCategoryData]);

  useEffect(() => {
    if (fieldName === 'category_id' && categoryInfo && categoryInfo.data && categoryInfo.data.length && offset === 0) {
      let data = [];
      data = categoryInfo.data.slice(0, limit);
      setRowData(data);
    }
  }, [fieldName, categoryInfo, offset]);

  const pages = getPagesCountV2(totalDataCount, limit);

  const handlePageClick = (e, index) => {
    e.preventDefault();
    const offsetValue = (index - 1) * limit;
    setPage(index);
    setOffset(offsetValue);
    if (fieldName === 'category_id') {
      const data = categoryInfo && categoryInfo.data.slice(offsetValue, (offsetValue + limit));
      setRowData(data);
    }
  };

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
                    {totalDataCount}
                  </span>
                </div>
              </Col>
              <Col sm="12" md="5" lg="5" xs="12" className="text-right">
                {(fieldName === 'maintenance_team_id' && isAddTeam && !isAll) && (
                  <Tooltip title="Add" placement="top">
                    <img
                      aria-hidden="true"
                      id="Add"
                      alt="Add"
                      className="cursor-pointer mr-3 mt-2"
                      onClick={() => onModalOpen()}
                      src={plusCircleMiniIcon}
                    />
                  </Tooltip>
                )}
                {(isEquipment && fieldName === 'equipment_id' && !isAll) && (
                  <Tooltip title="Add" placement="top">
                    <img
                      aria-hidden="true"
                      id="Add"
                      alt="Add"
                      className="cursor-pointer mr-3 mt-2"
                      onClick={() => onModalOpen()}
                      src={plusCircleMiniIcon}
                    />
                  </Tooltip>
                )}
                <Input
                  id="standard-adornment-password"
                  type="text"
                  name="search"
                  placeholder={modalName}
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
                              setCategorySearchvalue([]);
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
            <div className="pl-1 pr-1 pt-0 comments-list thin-scrollbar">
            <Table responsive className="mb-0">
              <thead className="bg-gray-light">
                <tr>
                  {((fieldName !== 'parent_id') && (fieldName !== 'category_id')) && (
                    <th className="p-2 min-width-100">
                      Name
                    </th>
                  )}
                  {fieldName === 'equipment_id' && (
                    <>
                      <th className="p-2 min-width-100">
                        Reference Number
                      </th>
                      <th className="p-2 min-width-100">
                        Brand
                      </th>
                      <th className="p-2 min-width-100">
                        Serial
                      </th>
                      <th className="p-2 min-width-100">
                        Location
                      </th>
                      <th className="p-2 min-width-100">
                        Category
                      </th>
                    </>
                  )}
                  {fieldName === 'category_id' && (
                    <th className="p-2 min-width-100">
                      Category
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
              {((listDataMultipleInfo && listDataMultipleInfo.data) || (fieldName === 'category_id' && categoryInfo && categoryInfo.data)) && (
              <tbody>
                    {getRow(listDataMultipleInfo && listDataMultipleInfo.data ? listDataMultipleInfo.data : [])}
                  </tbody>
              )}
            </Table>
            </div>
            {/* <div className="pl-1 pr-1 pt-0 comments-list thin-scrollbar">
              {((listDataMultipleInfo && listDataMultipleInfo.data) || (fieldName === 'category_id' && categoryInfo && categoryInfo.data)) && (
                <Table>
                  <tbody>
                    {getRow(getRowData)}
                  </tbody>
                </Table>
              )}
            </div> */}
            {loading || pages === 0 ? (<span />) : (
              <div className={`${classes.root} float-right`}>
                <Pagination count={pages} page={page} size="small" color="primary" onChange={handlePageClick} showFirstButton showLastButton />
              </div>
            )}
            {loading && (
              <Loader />
            )}
            {(listDataMultipleInfo && listDataMultipleInfo.err) && (
              <SuccessAndErrorFormat response={listDataMultipleInfo} />
            )}
          </CardBody>
        </Card>
      </Col>
      {(fieldName === 'maintenance_team_id') && (
        <Dialog maxWidth="lg" fullWidth open={addModal}>
          <DialogHeader title={modalHead} imagePath={false} onClose={() => { onModalClose(); onTeamClose(); }} response={createTeamInfo} />
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              <Box
                sx={{
                  width: '100%',
                  height: '100%',
                  backgroundColor: '#F6F8FA',
                  padding: '20px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '10%',
                  fontFamily: 'Suisse Intl',
                }}
              >
                <AddTeam closeModal={() => { onModalClose(); onTeamClose(); }} isTheme directToView={false} selectedUser={false} editData={[]} />
              </Box>
            </DialogContentText>
          </DialogContent>
        </Dialog>
      )}
      {(fieldName === 'equipment_id') && (
        <Dialog maxWidth="lg" fullWidth open={addModal}>
          <DialogHeader title={modalHead} imagePath={false} onClose={() => { onModalClose(); onAssetClose(); }} response={addAssetInfo} />
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              <Box
                sx={{
                  width: '100%',
                  height: '100%',
                  backgroundColor: '#F6F8FA',
                  padding: '20px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '10%',
                  fontFamily: 'Suisse Intl',
                }}
              >
                <CreateAsset closeModal={() => { onModalClose(); onAssetClose(); }} afterReset={() => { afterReset(); onModalClose(); onAssetClose(); }} isTheme isModal />
              </Box>
            </DialogContentText>
          </DialogContent>
        </Dialog>
      )}
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
  setFieldValue: PropTypes.oneOfType([PropTypes.func, PropTypes.string]).isRequired,
  isIncident: PropTypes.bool,
};

SearchModal.defaultProps = {
  isIncident: false,
};

export default SearchModal;
