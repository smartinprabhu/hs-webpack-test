/* eslint-disable radix */
/* eslint-disable no-underscore-dangle */
/* eslint-disable import/no-unresolved */
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Col,
  Row,
  CardBody, Card,
  Table, Input,
  Label,
  Modal, ModalBody,
  FormGroup,
  Popover, PopoverHeader, PopoverBody,
} from 'reactstrap';
import Button from '@mui/material/Button';
import Pagination from '@material-ui/lab/Pagination';
import { makeStyles } from '@material-ui/core/styles';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faSearch, faTimesCircle,
} from '@fortawesome/free-solid-svg-icons';
import { Tooltip } from 'antd';

import CreateList from '@shared/listViewFilters/create';
import AddColumns from '@shared/listViewFilters/columns';
import ExportList from '@shared/listViewFilters/export';
import ErrorContent from '@shared/errorContent';
import editIcon from '@images/icons/edit.svg';
import ModalHeaderComponent from '@shared/modalHeaderComponent';
import Loader from '@shared/loading';
import closeCircleIcon from '@images/icons/closeCircle.svg';
import ModalFormAlert from '@shared/modalFormAlert';
import Refresh from '@shared/listViewFilters/refresh';

import AddShift from './addShift/addShift';
import siteConfigureData from './data/siteConfigureData.json';
import actionCodes from '../data/actionCodes.json';
import { setInitialValues } from '../../purchase/purchaseService';

import {
  generateErrorMessage, getPagesCount, getDefaultNoValue, getListOfModuleOperations,
  getTotalCount, getColumnArrayById, getArrayFromValuesByItem,
} from '../../util/appUtils';
import {
  getShiftsCount, getShiftsInfo, resetCreateShift, resetUpdateShift, getShiftDetail,
} from '../setupService';
import DataExport from './shiftDataExport/dataExport';

const appModels = require('../../util/appModels').default;

const useStyles = makeStyles((theme) => ({
  root: {
    '& > *': {
      marginTop: theme.spacing(2),
    },
  },
}));

const Shifts = () => {
  const limit = 10;
  const dispatch = useDispatch();
  const [offset, setOffset] = useState(0);
  const [page, setPage] = useState(1);
  const [addShiftModal, showAddShiftModal] = useState(false);
  const [columns, setColumns] = useState(siteConfigureData && siteConfigureData.shiftTableColumnsShow ? siteConfigureData.shiftTableColumnsShow : []);
  const {
    shiftInfo, companyDetail, shiftCountLoading, shiftCount, createShiftInfo,
    updateShiftInfo, shiftDetail,
  } = useSelector((state) => state.setup);
  const [sortBy, setSortBy] = useState('ASC');
  const [sortField, setSortField] = useState('create_date');

  const [searchValue, setSearchValue] = useState('');
  const [isSearch, setSearch] = useState(false);
  
  const [reload, setReload] = useState(false);

  const [checkedRows, setCheckRows] = useState([]);
  const [isAllChecked, setIsAllChecked] = useState(false);

  const [viewId, setViewId] = useState(false);
  const [updateModal, showUpdateModal] = useState(false);

  const classes = useStyles();

  const { userRoles } = useSelector((state) => state.user);
  const { filterInitailValues } = useSelector((state) => state.purchase);
  const allowedOperations = getListOfModuleOperations(userRoles && userRoles.data ? userRoles.data.allowed_modules : [], 'Admin Setup', 'code');

  const loading = (shiftInfo && shiftInfo.loading) || (companyDetail && companyDetail.loading) || (shiftCountLoading);

  useEffect(() => {
    (async () => {
      if (companyDetail && companyDetail.data && companyDetail.data.length && ((createShiftInfo && createShiftInfo.data) || (updateShiftInfo && updateShiftInfo.data))) {
        await dispatch(getShiftsInfo(companyDetail.data[0].id, appModels.SHIFT, limit, offset, sortBy, sortField, searchValue));
      }
    })();
  }, [companyDetail, offset, sortBy, sortField, createShiftInfo, isSearch, updateShiftInfo]);
  useEffect(() => {
    if (companyDetail && companyDetail.data && companyDetail.data.length && ((createShiftInfo && createShiftInfo.data) || (updateShiftInfo && updateShiftInfo.data))) {
      dispatch(getShiftsCount(companyDetail.data[0].id, appModels.SHIFT, searchValue));
    }
  }, [companyDetail, createShiftInfo, isSearch, updateShiftInfo]);

  useEffect(() => {
    (async () => {
      if (companyDetail.data.length && companyDetail && companyDetail.data) {
        await dispatch(getShiftsInfo(companyDetail.data[0].id, appModels.SHIFT, limit, offset, sortBy, sortField, searchValue));
      }
    })();
  }, [updateShiftInfo, reload]);

  useEffect(() => {
    if (companyDetail && companyDetail.data && companyDetail.data.length) {
      dispatch(getShiftsCount(companyDetail.data[0].id, appModels.SHIFT, searchValue));
    }
  }, [companyDetail]);

  useEffect(() => {
    if (viewId && updateModal) {
      dispatch(getShiftDetail(viewId, appModels.SHIFT));
    }
  }, [viewId, updateModal]);

  const pages = getPagesCount(shiftCount, limit);

  const handlePageClick = (e, index) => {
    e.preventDefault();
    const offsetValue = (index - 1) * limit;
    setOffset(offsetValue);
    setPage(index);
    setIsAllChecked(false);
  };

  const handleColumnChange = (event) => {
    const { checked, value } = event.target;
    if (checked) {
      setColumns((state) => [...state, value]);
    } else {
      setColumns(columns.filter((item) => item !== value));
    }
  };

  const onReset = () => {
    dispatch(resetCreateShift());
  };

  const onUpdateReset = () => {
    dispatch(resetUpdateShift());
    showUpdateModal(false);
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
      const data = shiftInfo && shiftInfo.data ? shiftInfo.data : [];
      const newArr = [...getColumnArrayById(data, 'id'), ...checkedRows];
      setCheckRows([...new Map(newArr.map((item) => [item, item])).values()]);
      setIsAllChecked(true);
    } else {
      const data = shiftInfo && shiftInfo.data ? shiftInfo.data : [];
      const ids = getColumnArrayById(data, 'id');
      setCheckRows(getArrayFromValuesByItem(checkedRows, ids));
      setIsAllChecked(false);
    }
  };

  const onSearchChange = (e) => {
    setSearchValue(e.target.value);
    if (e.key === 'Enter') {
      setSearch(Math.random());
      setPage(1);
      setOffset(0);
    }
  };

  const onUpdate = (id) => {
    setViewId(id);
    showUpdateModal(true);
  };

  function getRow(shiftData) {
    const tableTr = [];
    for (let i = 0; i < shiftData.length; i += 1) {
      tableTr.push(
        <tr key={i}>
          <td className="w-5">
            <div className="checkbox">
              <Input
                type="checkbox"
                value={shiftData[i].id}
                id={`checkboxtk${shiftData[i].id}`}
                className="ml-0"
                name={shiftData[i].name}
                checked={checkedRows.some((selectedValue) => parseInt(selectedValue) === parseInt(shiftData[i].id))}
                onChange={handleTableCellChange}
              />
              <Label htmlFor={`checkboxtk${shiftData[i].id}`} />
            </div>
          </td>
          <td className="p-2 font-weight-600">
            Shift
            {' '}
            {shiftData[i].name}
          </td>
          <td className="p-2">{shiftData[i].start_time}</td>
          <td className="p-2">{shiftData[i].duration}</td>
          <td className="p-2">{getDefaultNoValue(shiftData[i].vendor_id ? shiftData[i].vendor_id[1] : '')}</td>
          <td className="p-2">{shiftData[i].is_use_company ? 'Yes' : 'No'}</td>
          {columns.some((selectedValue) => selectedValue.includes('lc_grace')) && (
            <td className="p-2">{shiftData[i].lc_grace ? `${shiftData[i].lc_grace}.00` : '0.00'}</td>
          )}
          {columns.some((selectedValue) => selectedValue.includes('eg_grace')) && (
            <td className="p-2">{shiftData[i].eg_grace ? `${shiftData[i].eg_grace}.00` : '0.00'}</td>
          )}
          {columns.some((selectedValue) => selectedValue.includes('lt_period')) && (
            <td className="p-2">{shiftData[i].lt_period ? `${shiftData[i].lt_period}.00` : '0.00'}</td>
          )}
          {columns.some((selectedValue) => selectedValue.includes('half_day_from')) && (
            <td className="p-2">{shiftData[i].half_day_from ? `${shiftData[i].half_day_from}.00` : '0.00'}</td>
          )}
          {columns.some((selectedValue) => selectedValue.includes('half_day_from')) && (
            <td className="p-2">{shiftData[i].half_day_to ? `${shiftData[i].half_day_to}.00` : '0.00'}</td>
          )}
          {columns.some((selectedValue) => selectedValue.includes('company_id')) && (
            <td className="p-2">{getDefaultNoValue(shiftData[i].company_id[1])}</td>
          )}
          <td className="p-2">
            {allowedOperations.includes(actionCodes['Edit Shift']) && (
              <Tooltip title="Edit">
                <img
                  aria-hidden="true"
                  src={editIcon}
                  className="ml-3 cursor-pointer"
                  height="12"
                  width="12"
                  alt="edit"
                  onClick={() => { onUpdate(shiftData[i].id); }}
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
    <Card className="p-2 bg-lightblue admin-shift-table">
      <CardBody className="bg-color-white p-1 m-0">
        <Row className="p-2">
          <Col sm="12" md="5" lg="5" xs="12">
            <div className="content-inline">
              <span className="p-0 font-weight-600 font-medium mr-2">
                Shift List :
                {' '}
                {getTotalCount(shiftCount)}
              </span>

            </div>
          </Col>
          <Col sm="12" md="7" lg="7" xs="12">
            <Row className="content-center m-0">
              <Col sm="12" md="9" lg="9" xs="12" className="mt-n15px">
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
              <Col sm="12" md="3" lg="3" xs="12">
                <div className="float-right">
                  <Refresh
                    loadingTrue={loading}
                    setReload={setReload}
                  />
                  {allowedOperations.includes(actionCodes['Add Shift']) && (
                    <>
                      <CreateList name="Add Shift" showCreateModal={() => { showAddShiftModal(true); }} />
                    </>
                  )}
                  <AddColumns
                    columns={siteConfigureData && siteConfigureData.shiftsTableColumns ? siteConfigureData.shiftsTableColumns : []}
                    handleColumnChange={handleColumnChange}
                    columnFields={columns}
                  />
                  <ExportList response={shiftInfo && shiftInfo.data && shiftInfo.data.length} />
                </div>
                {shiftInfo && shiftInfo.data && shiftInfo.data.length && (
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
        {shiftInfo && shiftInfo.data && (
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
                  <th className="p-2 min-width-100">
                    <span aria-hidden="true" className="sort-by cursor-pointer" onClick={() => { setSortField('name'); setSortBy(sortBy === 'ASC' ? 'DESC' : 'ASC'); }}>
                      Code
                    </span>
                  </th>
                  <th className="p-2 min-width-160">
                    <span aria-hidden="true" className="sort-by cursor-pointer" onClick={() => { setSortField('start_time'); setSortBy(sortBy === 'ASC' ? 'DESC' : 'ASC'); }}>
                      Start Time
                    </span>
                  </th>
                  <th className="p-2 min-width-160">
                    <span aria-hidden="true" className="sort-by cursor-pointer" onClick={() => { setSortField('duration'); setSortBy(sortBy === 'ASC' ? 'DESC' : 'ASC'); }}>
                      Duration
                    </span>
                  </th>
                  <th className="p-2 min-width-160">
                    <span aria-hidden="true" className="sort-by cursor-pointer" onClick={() => { setSortField('vendor_id'); setSortBy(sortBy === 'ASC' ? 'DESC' : 'ASC'); }}>
                      Tenant
                    </span>
                  </th>
                  <th className="p-2 min-width-300">
                    <span aria-hidden="true" className="sort-by cursor-pointer" onClick={() => { setSortField('is_use_company'); setSortBy(sortBy === 'ASC' ? 'DESC' : 'ASC'); }}>
                      Use Company Rules for Grace Period
                    </span>
                  </th>
                  {columns.some((selectedValue) => selectedValue.includes('lc_grace')) && (
                    <th className="p-2 min-width-160">
                      <span aria-hidden="true" className="sort-by cursor-pointer" onClick={() => { setSortField('lc_grace'); setSortBy(sortBy === 'ASC' ? 'DESC' : 'ASC'); }}>
                        LC grace
                      </span>
                    </th>
                  )}
                  {columns.some((selectedValue) => selectedValue.includes('eg_grace')) && (
                    <th className="p-2 min-width-160">
                      <span aria-hidden="true" className="sort-by cursor-pointer" onClick={() => { setSortField('eg_grace'); setSortBy(sortBy === 'ASC' ? 'DESC' : 'ASC'); }}>
                        EG Grace
                      </span>
                    </th>
                  )}
                  {columns.some((selectedValue) => selectedValue.includes('lt_period')) && (
                    <th className="p-2 min-width-160">
                      <span aria-hidden="true" className="sort-by cursor-pointer" onClick={() => { setSortField('lt_period'); setSortBy(sortBy === 'ASC' ? 'DESC' : 'ASC'); }}>
                        LT
                      </span>
                    </th>
                  )}
                  {columns.some((selectedValue) => selectedValue.includes('half_day_from')) && (
                    <th className="p-2 min-width-160">
                      <span aria-hidden="true" className="sort-by cursor-pointer" onClick={() => { setSortField('half_day_from'); setSortBy(sortBy === 'ASC' ? 'DESC' : 'ASC'); }}>
                        HD From
                      </span>
                    </th>
                  )}
                  {columns.some((selectedValue) => selectedValue.includes('half_day_to')) && (
                    <th className="p-2 min-width-160">
                      <span aria-hidden="true" className="sort-by cursor-pointer" onClick={() => { setSortField('half_day_to'); setSortBy(sortBy === 'ASC' ? 'DESC' : 'ASC'); }}>
                        HD To
                      </span>
                    </th>
                  )}
                  {columns.some((selectedValue) => selectedValue.includes('company_id')) && (
                    <th className="p-2 min-width-160">
                      <span aria-hidden="true" className="sort-by cursor-pointer" onClick={() => { setSortField('company_id'); setSortBy(sortBy === 'ASC' ? 'DESC' : 'ASC'); }}>
                        Company
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
                {getRow(shiftInfo.data)}
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
        {(shiftInfo && shiftInfo.err) && (
          <ErrorContent errorTxt={generateErrorMessage(shiftInfo)} />
        )}
        <Modal size={(createShiftInfo && createShiftInfo.data) ? 'sm' : 'lg'} className="border-radius-50px modal-dialog-centered" isOpen={addShiftModal}>
          <ModalHeaderComponent title="Add Shift" imagePath={false} closeModalWindow={() => { showAddShiftModal(false); }} response={createShiftInfo} />
          <ModalBody className="pt-0 mt-0">
            <AddShift
              afterReset={() => { showAddShiftModal(false); onReset(); }}
              editId={false}
            />
          </ModalBody>
        </Modal>
        <Modal size={(updateShiftInfo && updateShiftInfo.data) ? 'sm' : 'lg'} className="border-radius-50px modal-dialog-centered" isOpen={updateModal}>
          <ModalHeaderComponent title="Edit Shift" imagePath={false} closeModalWindow={() => onUpdateReset()} response={updateShiftInfo} />
          <ModalBody className="mt-0 pt-0">
            {shiftDetail && shiftDetail.loading && (
              <div className="text-center mt-3">
                <Loader />
              </div>
            )}
            {(shiftDetail && shiftDetail.data && updateShiftInfo && !updateShiftInfo.data && !updateShiftInfo.loading) && (
              <AddShift
                afterReset={() => onUpdateReset()}
                editId={viewId}
              />
            )}
            <ModalFormAlert alertResponse={updateShiftInfo} alertText="Shift updated successfully.." />
            {updateShiftInfo && updateShiftInfo.data && (<hr />)}
            <div className="float-right">
              {updateShiftInfo && updateShiftInfo.data && (
                <Button
                  size="sm"
                  type="button"
                   variant="contained"
                  onClick={() => onUpdateReset()}
                  disabled={updateShiftInfo && updateShiftInfo.loading}
                >
                  OK
                </Button>
              )}
            </div>
          </ModalBody>
        </Modal>
      </CardBody>
    </Card>
  );
};

export default Shifts;
