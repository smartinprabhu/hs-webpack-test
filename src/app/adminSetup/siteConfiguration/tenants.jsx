/* eslint-disable radix */
/* eslint-disable no-underscore-dangle */
/* eslint-disable import/no-unresolved */
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Button,
  Col,
  CardBody, Card,
  Row,
  Table,
  Label, FormGroup, Input,
  Modal, ModalBody,
  Popover, PopoverHeader, PopoverBody,
} from 'reactstrap';
import { Tooltip } from 'antd';
import Pagination from '@material-ui/lab/Pagination';
import { makeStyles } from '@material-ui/core/styles';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faSearch, faTimesCircle,
} from '@fortawesome/free-solid-svg-icons';

import ErrorContent from '@shared/errorContent';
import editIcon from '@images/icons/edit.svg';
import CreateList from '@shared/listViewFilters/create';
import AddColumns from '@shared/listViewFilters/columns';
import ExportList from '@shared/listViewFilters/export';
import ModalHeaderComponent from '@shared/modalHeaderComponent';
import Loader from '@shared/loading';
import closeCircleIcon from '@images/icons/closeCircle.svg';

import AddTenant from './addTenant/addTenant';
import EditTenant from './editTenant/editTenant';
import siteConfigureData from './data/siteConfigureData.json';
import { setInitialValues } from '../../purchase/purchaseService';
import DataExport from './tenantDataExport/dataExport';

import {
  generateErrorMessage, getDefaultNoValue, getPagesCount, getListOfModuleOperations,
  getTotalCount, getColumnArrayById, getArrayFromValuesByItem,
} from '../../util/appUtils';
import {
  getTenantsCount, getTenantsInfo, resetCreateTenant, geTenantDetail,
  resetUpdateTenant,
} from '../setupService';
import actionCodes from '../data/actionCodes.json';
import Refresh from '@shared/listViewFilters/refresh';

const appModels = require('../../util/appModels').default;

const useStyles = makeStyles((theme) => ({
  root: {
    '& > *': {
      marginTop: theme.spacing(2),
    },
  },
}));

const Tenants = () => {
  const limit = 10;
  const dispatch = useDispatch();
  const [offset, setOffset] = useState(0);
  const [page, setPage] = useState(1);
  const [columns, setColumns] = useState(siteConfigureData && siteConfigureData.tenantTableColumnsShow ? siteConfigureData.tenantTableColumnsShow : []);
  const [addTenantModal, showAddTenantModal] = useState(false);
  const [updateTenantModal, showUpdateTenantModal] = useState(false);
  const [viewId, setViewId] = useState(0);
  const {
    tenantInfo, companyDetail, tenantCountLoading, tenantCount, createTenantinfo,
    tenantUpdateInfo,
  } = useSelector((state) => state.setup);
  const [sortBy, setSortBy] = useState('DESC');
  const [sortField, setSortField] = useState('create_date');

  const [searchValue, setSearchValue] = useState('');
  const [isSearch, setSearch] = useState(false);
  const [reload, setReload] = useState(false);
  const [checkedRows, setCheckRows] = useState([]);
  const [isAllChecked, setIsAllChecked] = useState(false);

  const classes = useStyles();

  const { userRoles } = useSelector((state) => state.user);
  const { filterInitailValues } = useSelector((state) => state.purchase);
  const allowedOperations = getListOfModuleOperations(userRoles && userRoles.data ? userRoles.data.allowed_modules : [], 'Admin Setup', 'code');

  const handleColumnChange = (event) => {
    const { checked, value } = event.target;
    if (checked) {
      setColumns((state) => [...state, value]);
    } else {
      setColumns(columns.filter((item) => item !== value));
    }
  };

  const onReset = () => {
    dispatch(resetCreateTenant());
  };

  const onUpdateReset = () => {
    dispatch(resetUpdateTenant());
  };

  const loading = (tenantInfo && tenantInfo.loading) || (companyDetail && companyDetail.loading) || (tenantCountLoading);

  useEffect(() => {
    (async () => {
      if ((companyDetail && companyDetail.data&&companyDetail.data.length&&createTenantinfo && createTenantinfo.data)) {
        await dispatch(getTenantsInfo(companyDetail.data[0].id, appModels.PARTNER, limit, offset, sortBy, sortField, searchValue));
      }
    })();
  }, [companyDetail, offset, sortBy, sortField, createTenantinfo, isSearch]);

  useEffect(() => {
    if ((companyDetail && companyDetail.data&&companyDetail.data.length&&createTenantinfo && createTenantinfo.data)) {
      dispatch(getTenantsCount(companyDetail.data[0].id, appModels.PARTNER, searchValue));
    }
  }, [companyDetail, createTenantinfo, isSearch]);

  useEffect(() => {
    if (companyDetail && companyDetail.data&&companyDetail.data.length) {
      dispatch(getTenantsCount(companyDetail.data[0].id, appModels.PARTNER, searchValue));
    }
  }, [companyDetail]);
 
  
  useEffect(() => {
    (async () => {
      if (companyDetail && companyDetail.data&&companyDetail.data.length) {
        await dispatch(getTenantsInfo(companyDetail.data[0].id, appModels.PARTNER, limit, offset, sortBy, sortField, searchValue));
      }
    })();
  }, [companyDetail, reload]);

  useEffect(() => {
    if (viewId && updateTenantModal) {
      dispatch(geTenantDetail(viewId, appModels.PARTNER));
    }
  }, [viewId, updateTenantModal]);

  const pages = getPagesCount(tenantCount, limit);

  const handlePageClick = (e, index) => {
    e.preventDefault();
    const offsetValue = (index - 1) * limit;
    setOffset(offsetValue);
    setPage(index);
    setIsAllChecked(false);
  };

  const onSearchChange = (e) => {
    setSearchValue(e.target.value);
    if (e.key === 'Enter') {
      setSearch(Math.random());
      setPage(1);
      setOffset(0);
    }
  };

  const handleTableCellChange = (event) => {
    dispatch(setInitialValues(false, false, false, false));
    const { checked, value } = event.target;
    if (checked) {
      setCheckRows((state) => [...state, value]);
    } else {
      setCheckRows(checkedRows.filter((item) => parseInt(item) !== parseInt(value)));
    }
  };

  const handleTableCellAllChange = (event) => {
    dispatch(setInitialValues(false, false, false, false));
    const { checked } = event.target;
    if (checked) {
      const data = tenantInfo && tenantInfo.data ? tenantInfo.data : [];
      const newArr = [...getColumnArrayById(data, 'id'), ...checkedRows];
      setCheckRows([...new Map(newArr.map((item) => [item, item])).values()]);
      setIsAllChecked(true);
    } else {
      const data = tenantInfo && tenantInfo.data ? tenantInfo.data : [];
      const ids = getColumnArrayById(data, 'id');
      setCheckRows(getArrayFromValuesByItem(checkedRows, ids));
      setIsAllChecked(false);
    }
  };

  const onUpdate = (id) => {
    if (allowedOperations.includes(actionCodes['Edit Tenant'])) {
      showAddTenantModal(false);
      setViewId(id);
      showUpdateTenantModal(true);
    }
  };

  function getRow(tenantData) {
    const tableTr = [];
    for (let i = 0; i < tenantData.length; i += 1) {
      tableTr.push(
        <tr key={i}>
          <td className="w-5">
            <div className="checkbox">
              <Input
                type="checkbox"
                value={tenantData[i].id}
                id={`checkboxtk${tenantData[i].id}`}
                className="ml-0"
                name={tenantData[i].name}
                checked={checkedRows.some((selectedValue) => parseInt(selectedValue) === parseInt(tenantData[i].id))}
                onChange={handleTableCellChange}
              />
              <Label htmlFor={`checkboxtk${tenantData[i].id}`} />
            </div>
          </td>
          <td
            className="p-2"
          >
            <span className="font-weight-600">{tenantData[i].name}</span>
          </td>
          <td className="p-2">{getDefaultNoValue(tenantData[i].company_id[1])}</td>
          <td className="p-2">{getDefaultNoValue(tenantData[i].city)}</td>
          <td className="p-2">{getDefaultNoValue(tenantData[i].zip)}</td>
          <td className="p-2">{getDefaultNoValue(tenantData[i].state_id[1])}</td>
          {columns.some((selectedValue) => selectedValue.includes('phone')) && (
            <td className="p-2">{getDefaultNoValue(tenantData[i].phone)}</td>
          )}
          {columns.some((selectedValue) => selectedValue.includes('mobile')) && (
            <td className="p-2">{getDefaultNoValue(tenantData[i].mobile)}</td>
          )}
          {columns.some((selectedValue) => selectedValue.includes('email')) && (
            <td className="p-2">{getDefaultNoValue(tenantData[i].email)}</td>
          )}
          {columns.some((selectedValue) => selectedValue.includes('website')) && (
            <td className="p-2">{getDefaultNoValue(tenantData[i].website)}</td>
          )}
          <td className="p-2">
            {allowedOperations.includes(actionCodes['Edit Tenant']) && (
            <Tooltip title="Edit">
              <img
                aria-hidden="true"
                src={editIcon}
                className="ml-3 cursor-pointer"
                height="12"
                width="12"
                alt="edit"
                onClick={() => { onUpdate(tenantData[i].id); }}
              />
            </Tooltip>
            )}
          </td>
        </tr>,
      );
    }
    return tableTr;
  }

  return (
    <Card className="p-2 bg-lightblue admin-tenants-table">
      <CardBody className="bg-color-white p-1 m-0">
        <Row className="p-2">
          <Col sm="12" md="5" lg="5" xs="12">
            <div className="content-inline">
              <span className="p-0 font-weight-600 font-medium mr-2">
                Tenants List:
                {' '}
                {getTotalCount(tenantCount)}
              </span>

            </div>
          </Col>
          <Col sm="12" md="7" lg="7" xs="12">
            <Row className="content-center m-0">
              <Col sm="9" md="9" lg="9" xs="12" className="mt-n15px">
                <FormGroup className="m-0">
                  <Input
                    type="input"
                    name="search"
                    value={searchValue}
                    id="exampleSearch"
                    placeholder="Search"
                    onKeyDown={onSearchChange}
                    onChange={onSearchChange}
                    className="subjectticket bw-2 mt-2"
                  />
                  {searchValue && searchValue.length
                    ? (
                      <>
                        <FontAwesomeIcon
                          className="float-right mr-32px cursor-pointer mt-n6per"
                          size="sm"
                          type="reset"
                          onClick={() => {
                            setSearchValue('');
                            setPage(1);
                            setOffset(0);
                            setSearch(Math.random());
                          }}
                          icon={faTimesCircle}
                        />
                        <FontAwesomeIcon
                          className="float-right mr-2 cursor-pointer mt-n6per"
                          size="sm"
                          onClick={() => {
                            setSearch(Math.random());
                            setPage(1);
                            setOffset(0);
                          }}
                          icon={faSearch}
                        />
                      </>
                    ) : ''}
                </FormGroup>
              </Col>
              <Col sm="3" md="3" lg="3" xs="12">
                <div className="float-right">
                <Refresh
                    loadingTrue={loading}
                    setReload={setReload}
                  />
                  {allowedOperations.includes(actionCodes['Add Tenant']) && (
                  <>
                    <CreateList name="Add Tenant" showCreateModal={() => { showAddTenantModal(true); }} />
                  </>
                  )}
                  <AddColumns
                    columns={siteConfigureData && siteConfigureData.tenantTableColumns ? siteConfigureData.tenantTableColumns : []}
                    handleColumnChange={handleColumnChange}
                    columnFields={columns}
                  />
                  <ExportList response={tenantInfo && tenantInfo.data && tenantInfo.data.length} />
                </div>
                {tenantInfo && tenantInfo.data && tenantInfo.data.length && (
                  <Popover placement="bottom" isOpen={filterInitailValues.download} target="Export">
                    <PopoverHeader>
                      Export
                      <img
                        src={closeCircleIcon}
                        aria-hidden="true"
                        className="cursor-pointer mr-1 mt-1 float-right"
                        onClick={() => dispatch(setInitialValues(false, false, false, false))}
                        alt="close"
                      />
                    </PopoverHeader>
                    <PopoverBody>
                      <DataExport
                        afterReset={() => dispatch(setInitialValues(false, false, false, false))}
                        fields={columns}
                        rows={checkedRows}
                        searchValue={searchValue}
                      />
                    </PopoverBody>
                  </Popover>
                )}
              </Col>
            </Row>
          </Col>
        </Row>
        {tenantInfo && tenantInfo.data && (
        <Col lg="12" md="12" sm="12" xs="12">
          <Table responsive className="mb-0 mt-3 font-weight-400 border-0">
            <thead className="bg-lightgrey">
              <tr>
                <th>
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
                <th className="p-2 min-width-160">
                  <span aria-hidden="true" className="sort-by cursor-pointer" onClick={() => { setSortField('name'); setSortBy(sortBy === 'ASC' ? 'DESC' : 'ASC'); }}>
                    Name
                  </span>
                </th>
                <th className="p-2 min-width-160">
                  <span aria-hidden="true" className="sort-by cursor-pointer" onClick={() => { setSortField('company_id'); setSortBy(sortBy === 'ASC' ? 'DESC' : 'ASC'); }}>
                    Company
                  </span>
                </th>
                <th className="p-2 min-width-160">
                  <span aria-hidden="true" className="sort-by cursor-pointer" onClick={() => { setSortField('city'); setSortBy(sortBy === 'ASC' ? 'DESC' : 'ASC'); }}>
                    City
                  </span>
                </th>
                <th className="p-2 min-width-160">
                  <span aria-hidden="true" className="sort-by cursor-pointer" onClick={() => { setSortField('zip'); setSortBy(sortBy === 'ASC' ? 'DESC' : 'ASC'); }}>
                    Zip Code
                  </span>
                </th>
                <th className="p-2 min-width-160">
                  <span aria-hidden="true" className="sort-by cursor-pointer" onClick={() => { setSortField('state_id'); setSortBy(sortBy === 'ASC' ? 'DESC' : 'ASC'); }}>
                    State
                  </span>
                </th>
                {columns.some((selectedValue) => selectedValue.includes('phone')) && (
                  <th className="p-2 min-width-160">
                    <span aria-hidden="true" className="sort-by cursor-pointer" onClick={() => { setSortField('phone'); setSortBy(sortBy === 'ASC' ? 'DESC' : 'ASC'); }}>
                      Phone
                    </span>
                  </th>
                )}
                {columns.some((selectedValue) => selectedValue.includes('mobile')) && (
                  <th className="p-2 min-width-160">
                    <span aria-hidden="true" className="sort-by cursor-pointer" onClick={() => { setSortField('mobile'); setSortBy(sortBy === 'ASC' ? 'DESC' : 'ASC'); }}>
                      Mobile
                    </span>
                  </th>
                )}
                {columns.some((selectedValue) => selectedValue.includes('email')) && (
                  <th className="p-2 min-width-160">
                    <span aria-hidden="true" className="sort-by cursor-pointer" onClick={() => { setSortField('email'); setSortBy(sortBy === 'ASC' ? 'DESC' : 'ASC'); }}>
                      Email
                    </span>
                  </th>
                )}
                {columns.some((selectedValue) => selectedValue.includes('website')) && (
                  <th className="p-2 min-width-160">
                    <span aria-hidden="true" className="sort-by cursor-pointer" onClick={() => { setSortField('website'); setSortBy(sortBy === 'ASC' ? 'DESC' : 'ASC'); }}>
                      Website
                    </span>
                  </th>
                )}
                <th className="p-2 min-width-100">
                  <span>
                    Action
                  </span>
                </th>
              </tr>
            </thead>
            <tbody>
              {getRow(tenantInfo.data)}
            </tbody>
          </Table>
          <hr className="m-0" />
        </Col>
        )}

        {loading || pages === 0 ? (<span />) : (
          <div className={`${classes.root} float-right`}>
            <Pagination count={pages} page={page} size="small" color="primary" onChange={handlePageClick} showFirstButton showLastButton />
          </div>
        )}

        {loading && (
          <div className="mb-3 mt-3">
            <Loader />
          </div>
        )}
        {(tenantInfo && tenantInfo.err) && (
          <ErrorContent errorTxt={generateErrorMessage(tenantInfo)} />
        )}

        <Modal size={(createTenantinfo && createTenantinfo.data) ? 'sm' : 'xl'} className="border-radius-50px modal-dialog-centered" isOpen={addTenantModal}>
          <ModalHeaderComponent title="Add Tenant" imagePath={false} closeModalWindow={() => { showAddTenantModal(false); onReset(); }} response={createTenantinfo} />
          <ModalBody className="pt-0 mt-0">
            <AddTenant
              afterReset={() => { showAddTenantModal(false); onReset(); }}
            />
          </ModalBody>
        </Modal>

        <Modal size={(tenantUpdateInfo && tenantUpdateInfo.data) ? 'sm' : 'xl'} className="border-radius-50px modal-dialog-centered" isOpen={updateTenantModal}>
          <ModalHeaderComponent title="Edit Tenant" imagePath={false} closeModalWindow={() => { showUpdateTenantModal(false); onUpdateReset(); }} response={tenantUpdateInfo} />
          <ModalBody className="pt-0 mt-0">
            <EditTenant
              afterReset={() => { showUpdateTenantModal(false); onUpdateReset(); }}
            />
            <div className="float-right mr-4">
              {(tenantUpdateInfo && tenantUpdateInfo.data) && (
              <Button
                type="button"
                size="sm"
                 variant="contained"
                onClick={() => { onUpdateReset(); showUpdateTenantModal(false); }}
              >
                Ok
              </Button>
              )}
            </div>
          </ModalBody>
        </Modal>
      </CardBody>
    </Card>
  );
};

export default Tenants;
